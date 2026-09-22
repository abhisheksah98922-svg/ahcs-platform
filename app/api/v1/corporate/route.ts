import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { validateClientIdChecksum } from '@/lib/client-id';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orgId = searchParams.get('orgId');

    if (orgId) {
      const org = db.getOrganizationById(orgId);
      if (!org) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }

      const sponsorships = db.getCorporateSponsorshipsByOrg(orgId);
      // Ensure strict privacy: Map sponsorships to remove any internal clinical pointers
      const safeSponsorships = sponsorships.map(s => {
        const card = db.findActiveCardByAccountId(s.accountId);
        return {
          id: s.id,
          employeeId: s.employeeId,
          status: s.status,
          sponsoredAt: s.sponsoredAt,
          cardStatus: card?.status || 'NOT_ISSUED',
        };
      });

      return NextResponse.json({
        success: true,
        organization: org,
        sponsoredMembersCount: sponsorships.length,
        members: safeSponsorships,
        privacyNotice: 'Under AHCS privacy architecture, corporate employers are strictly restricted from viewing employee clinical histories, diagnoses, or emergency medical profiles.',
      });
    }

    const orgs = db.listOrganizations();
    return NextResponse.json({
      success: true,
      organizations: orgs,
    });
  } catch (error: any) {
    console.error('Error fetching corporate data:', error);
    return NextResponse.json({ error: 'Failed to retrieve corporate information' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    // Action 1: Register Corporate Organization
    if (action === 'REGISTER_ORG') {
      const { orgName, registrationNumber, contactEmail, contactPhone, domain, plan } = body;
      if (!orgName || !registrationNumber || !contactEmail || !contactPhone) {
        return NextResponse.json({ error: 'Missing mandatory organization fields' }, { status: 400 });
      }

      const org = db.createOrganization({
        orgName: orgName.trim(),
        registrationNumber: registrationNumber.trim(),
        contactEmail: contactEmail.trim(),
        contactPhone: contactPhone.trim(),
        domain: domain?.trim() || '',
        activePlan: plan || 'CORPORATE_ENTERPRISE_SHIELD',
      });

      db.logAudit({
        actorId: null,
        actorRole: 'ORGANIZATION_ADMIN',
        action: 'ORGANIZATION_REGISTERED',
        targetResource: 'organizations',
        targetId: org.id,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: {
          orgId: org.id,
          orgName: org.orgName,
          registrationNumber: org.registrationNumber,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Organization registered for AHCS Corporate Health Sponsorship.',
        organization: org,
      }, { status: 201 });
    }

    // Action 2: Sponsor an Employee's AHCS Card
    if (action === 'SPONSOR_EMPLOYEE') {
      const { orgId, employeeId, clientId } = body;
      if (!orgId || !employeeId || !clientId) {
        return NextResponse.json({ error: 'Missing orgId, employeeId, or clientId' }, { status: 400 });
      }

      const org = db.getOrganizationById(orgId);
      if (!org) {
        return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
      }

      const cleanClientId = clientId.trim().toUpperCase();
      if (!validateClientIdChecksum(cleanClientId)) {
        return NextResponse.json({ error: 'Invalid AHCS Client ID checksum' }, { status: 400 });
      }

      const clientRec = db.findClientId(cleanClientId);
      if (!clientRec || !clientRec.isActive) {
        return NextResponse.json({ error: 'AHCS Client ID not found in active registry' }, { status: 404 });
      }

      const sponsorship = db.addCorporateSponsorship({
        orgId,
        accountId: clientRec.accountId,
        employeeId: employeeId.trim(),
        status: 'ACTIVE',
      });

      db.logAudit({
        actorId: null,
        actorRole: 'ORGANIZATION_ADMIN',
        action: 'EMPLOYEE_CARD_SPONSORED',
        targetResource: 'corporate_sponsorships',
        targetId: sponsorship.id,
        ipAddress: request.headers.get('x-forwarded-for') || null,
        userAgent: request.headers.get('user-agent') || null,
        metadata: {
          orgId,
          employeeId,
          clientId: cleanClientId,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Employee ${employeeId} successfully enrolled in ${org.orgName} AHCS Health Sponsorship.`,
        sponsorship,
      }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action. Allowed: REGISTER_ORG, SPONSOR_EMPLOYEE' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing corporate request:', error);
    return NextResponse.json({ error: 'Failed to process corporate request' }, { status: 500 });
  }
}
