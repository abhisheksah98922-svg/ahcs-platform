import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { ProviderCategory } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const query = searchParams.get('query') || undefined;
    const city = searchParams.get('city') || undefined;
    const status = searchParams.get('status') || 'VERIFIED'; // Default to verified providers for public directory
    const emergencyParam = searchParams.get('emergency24x7');
    const emergency24x7 = emergencyParam !== null ? emergencyParam === 'true' : undefined;
    const speciality = searchParams.get('speciality') || undefined;
    const partnerTier = searchParams.get('partnerTier') || undefined;

    const providers = db.listProviders({ category, query, city, status, emergency24x7, speciality, partnerTier });

    return NextResponse.json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error: any) {
    console.error('Error fetching providers:', error);
    return NextResponse.json({ error: 'Failed to fetch providers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      category,
      registrationNumber,
      medicalCouncil,
      address,
      city,
      state,
      pinCode,
      phone,
      email,
      services,
      operatingHours,
    } = body;

    if (!name || !category || !registrationNumber || !medicalCouncil || !phone || !email || !city) {
      return NextResponse.json({
        error: 'Missing required fields: name, category, registrationNumber, medicalCouncil, phone, email, and city are mandatory',
      }, { status: 400 });
    }

    // Check duplicate registration
    const existing = db.findProviderByRegistration(registrationNumber);
    if (existing) {
      return NextResponse.json({
        error: `A healthcare provider is already registered with registration number ${registrationNumber}`,
      }, { status: 409 });
    }

    const newProvider = db.createProvider({
      name: name.trim(),
      category: category as ProviderCategory,
      registrationNumber: registrationNumber.trim(),
      medicalCouncil: medicalCouncil.trim(),
      address: address || '',
      city: city.trim(),
      state: state || 'Karnataka',
      pinCode: pinCode || '',
      phone: phone.trim(),
      email: email.trim(),
      services: Array.isArray(services) && services.length > 0 ? services : ['General Healthcare Consultation'],
      partnerTier: 'STANDARD',
      operatingHours: operatingHours || '09:00 AM - 08:00 PM',
      status: 'PENDING_VERIFICATION',
      verifiedAt: null,
      verifiedByOfficerId: null,
    });

    try {
      db.logAudit({
        actorId: null,
        actorRole: 'HEALTHCARE_PROVIDER_APPLICANT',
        action: 'PROVIDER_REGISTRATION_SUBMITTED',
        targetResource: 'providers',
        targetId: newProvider.id,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: {
          providerId: newProvider.id,
          name: newProvider.name,
          category: newProvider.category,
          registrationNumber: newProvider.registrationNumber,
        },
      });
    } catch (e) {
      // Non-blocking audit log
    }

    return NextResponse.json({
      success: true,
      message: 'Healthcare facility registration submitted. Queued for credential verification by AHCS officer.',
      provider: newProvider,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error registering provider:', error);
    return NextResponse.json({ error: error?.message || 'Failed to process provider registration' }, { status: 500 });
  }
}
