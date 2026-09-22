import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const { id } = params;

    const doc = db.getVaultDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check authorization: cardholder or family member with permission or consent-verified doctor
    const isOwner = doc.accountId === account.id;
    const hasFamilyAccess = db.canAccessFamilyRecords(account.id, doc.accountId, 'MEDICAL_RECORD');
    const isDoctorWithConsent = context.user.role === 'DOCTOR' && db.hasActiveConsent(doc.accountId, user.id);

    if (!isOwner && !hasFamilyAccess && !isDoctorWithConsent) {
      return NextResponse.json({ error: 'Unauthorized: Access to this private medical document is restricted' }, { status: 403 });
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'VAULT_DOCUMENT_DOWNLOADED',
      targetResource: 'medical_documents_vault',
      targetId: id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        documentHash: doc.documentHash,
        fileMimeType: doc.fileMimeType,
      },
    });

    return NextResponse.json({
      success: true,
      document: doc,
      secureDownloadUrl: `/api/v1/documents/vault/${id}/stream?token=tmp_${doc.documentHash.slice(0, 16)}`,
    });
  } catch (error: any) {
    console.error('Error fetching vault document:', error);
    return NextResponse.json({ error: 'Failed to access document' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const { id } = params;

    const doc = db.getVaultDocumentById(id);
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    if (doc.accountId !== account.id) {
      return NextResponse.json({ error: 'Only the account owner can delete vault documents' }, { status: 403 });
    }

    const deleted = db.deleteVaultDocument(id);

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'VAULT_DOCUMENT_DELETED',
      targetResource: 'medical_documents_vault',
      targetId: id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { documentTitle: doc.title },
    });

    return NextResponse.json({
      success: true,
      message: 'Medical document removed from vault',
    });
  } catch (error: any) {
    console.error('Error deleting vault document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
