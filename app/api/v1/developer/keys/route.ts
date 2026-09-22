import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const targetId = context.account?.id || context.user.id;
    // In a multi-tenant setup, filter keys by account
    const allKeys = (db as any).data.apiKeys.filter((k: any) => k.accountId === targetId);
    return NextResponse.json({
      success: true,
      apiKeys: allKeys.map((k: any) => ({
        id: k.id,
        name: k.name,
        keyPrefix: k.keyPrefix,
        scopes: k.scopes,
        status: k.status,
        createdAt: k.createdAt,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Failed to retrieve API keys' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user } = context;
    const targetId = context.account?.id || user.id;
    const body = await request.json();
    const { name, keyName, scopes = ['patient.read', 'appointment.read'] } = body;
    const finalName = name || keyName;

    if (!finalName) {
      return NextResponse.json({ error: 'Key name is required' }, { status: 400 });
    }

    const allowedScopes = [
      'patient.read',
      'records.read',
      'records.write',
      'appointment.read',
      'appointment.write',
      'provider.read',
    ];

    const validScopes = scopes.filter((s: string) => allowedScopes.includes(s));
    if (validScopes.length === 0) {
      return NextResponse.json({ error: 'At least one valid scope required' }, { status: 400 });
    }

    // Generate raw secret key
    const rawSecret = `ahcs_live_${crypto.randomBytes(24).toString('hex')}`;
    const keyPrefix = rawSecret.slice(0, 14);
    const keyHash = crypto.createHash('sha256').update(rawSecret).digest('hex');

    const apiKeyRecord = db.createApiKey({
      accountId: targetId,
      name: finalName,
      keyHash,
      keyPrefix,
      scopes: validScopes,
      status: 'ACTIVE',
    });

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'DEVELOPER_API_KEY_CREATED',
      targetResource: 'developer_api_keys',
      targetId: apiKeyRecord.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { keyPrefix, scopes: validScopes },
    });

    return NextResponse.json({
      success: true,
      message: 'API Key generated. Copy the secret key now; it cannot be shown again.',
      apiKey: rawSecret,
      record: apiKeyRecord,
      secretKey: rawSecret, // Displayed once upon creation
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error generating API key:', error);
    return NextResponse.json({ error: 'Failed to create API key' }, { status: 500 });
  }
}
