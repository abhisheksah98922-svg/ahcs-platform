import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';
import { VaultDocumentType } from '@/lib/db/types';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const documents = db.getVaultDocuments(context.account.id);
    return NextResponse.json({
      success: true,
      count: documents.length,
      documents,
    });
  } catch (error: any) {
    console.error('Error listing vault documents:', error);
    return NextResponse.json({ error: 'Failed to retrieve vault documents' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const {
      title,
      documentType,
      fileBase64,
      fileContentBase64,
      fileMimeType,
      mimeType,
      fileSizeBytes,
    } = body;

    const finalMimeType = fileMimeType || mimeType;
    const finalBase64 = fileBase64 || fileContentBase64;

    if (!title || !documentType || !finalMimeType) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: title, documentType, and fileMimeType are required' },
        { status: 400 }
      );
    }

    // MIME Validation
    const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'];
    if (!allowedMimes.includes(finalMimeType)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only PDF, JPEG, PNG, WebP, and text documents are permitted in the medical vault.' },
        { status: 400 }
      );
    }

    // Size Validation (10MB)
    const size = fileSizeBytes || (finalBase64 ? Math.round(finalBase64.length * 0.75) : 1024);
    if (size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File exceeds maximum permissible size of 10MB' },
        { status: 400 }
      );
    }

    // Cryptographic Content Hash
    let documentHash = '';
    if (finalBase64) {
      try {
        const buf = Buffer.from(finalBase64, 'base64');
        documentHash = crypto.createHash('sha256').update(buf).digest('hex');
      } catch (e) {
        documentHash = crypto.createHash('sha256').update(finalBase64).digest('hex');
      }
    } else {
      documentHash = crypto.createHash('sha256').update(`${title}-${Date.now()}-${account.id}`).digest('hex');
    }
    const documentKey = `vault/${account.id}/${crypto.randomBytes(16).toString('hex')}`;

    const doc = db.uploadVaultDocument({
      accountId: account.id,
      documentType: documentType as VaultDocumentType,
      title,
      documentKey,
      fileMimeType: finalMimeType,
      fileSizeBytes: size,
      documentHash,
      uploadedByUserId: user.id,
    });

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'VAULT_DOCUMENT_UPLOADED',
      targetResource: 'medical_documents_vault',
      targetId: doc.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { documentType, title, size, documentHash },
    });

    return NextResponse.json({
      success: true,
      message: 'Medical document securely uploaded and hashed',
      document: {
        ...doc,
        sha256Hash: documentHash,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading vault document:', error);
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 });
  }
}
