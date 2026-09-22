import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user } = context;
    // Must be a verified healthcare provider staff or verification officer
    if (!['DOCTOR', 'PROVIDER_ADMIN', 'ADMIN', 'VERIFICATION_OFFICER'].includes(user.role)) {
      return NextResponse.json(
        { error: 'Forbidden: Only verified laboratory personnel or clinicians may upload diagnostic reports' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      orderId,
      patientClientId,
      testName,
      labObservations,
      observations,
      fileMimeType = 'application/pdf',
      fileSizeBytes = 2048,
    } = body;

    const finalObservations = labObservations || observations;

    if (!patientClientId || !testName || !finalObservations) {
      return NextResponse.json(
        { error: 'Missing mandatory fields: patientClientId, testName, and labObservations are required' },
        { status: 400 }
      );
    }

    // 1. Verify Client ID
    const targetClient = db.findClientId(patientClientId);
    if (!targetClient) {
      return NextResponse.json({ error: `Invalid Client ID ${patientClientId}` }, { status: 404 });
    }

    const targetAccount = db.findAccountById(targetClient.accountId);
    if (!targetAccount) {
      return NextResponse.json({ error: 'Associated patient account not found' }, { status: 404 });
    }

    // 2. Generate secure document key & hash
    const documentHash = crypto.createHash('sha256').update(`${testName}-${Date.now()}-${patientClientId}`).digest('hex');
    const documentKey = `lab-reports/${targetAccount.id}/${crypto.randomBytes(12).toString('hex')}`;

    // 3. Create Vault Document Record
    const vaultDoc = db.uploadVaultDocument({
      accountId: targetAccount.id,
      documentType: 'LAB_REPORT',
      title: `Verified Lab Report: ${testName}`,
      documentKey,
      fileMimeType,
      fileSizeBytes,
      documentHash,
      uploadedByUserId: user.id,
    });

    // 4. Attach as formal Medical Record
    const medicalRecord = db.createMedicalRecord({
      accountId: targetAccount.id,
      authorProviderId: 'PRV-103', // Lab provider
      authorProviderName: 'LifeCare Diagnostics & Pathology',
      authorDoctorName: 'Pathologist On-Duty',
      recordType: 'LAB_REPORT',
      title: `Diagnostic Pathology Report: ${testName}`,
      clinicalDiagnosis: 'Laboratory Analysis Completed',
      clinicalNotes: finalObservations,
      medications: [],
      labObservations: finalObservations,
      recordDate: new Date().toISOString(),
    });

    // 5. Update Lab Order if orderId provided
    let updatedOrder = null;
    if (orderId) {
      updatedOrder = db.updateLabOrderStatus(orderId, 'COMPLETED', vaultDoc.id, user.id);
    }

    // 6. Notify Patient
    db.createNotification({
      userId: targetAccount.userId,
      title: 'Lab Report Ready',
      message: `Your verified diagnostic report for ${testName} is now available in your health records.`,
      category: 'LAB',
      channel: 'IN_APP',
    });

    // 7. Audit Log
    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'LAB_REPORT_UPLOADED',
      targetResource: 'medical_records',
      targetId: medicalRecord.id,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: {
        patientClientId,
        testName,
        documentHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Diagnostic report verified, indexed in vault, and attached to patient medical records',
      order: updatedOrder,
      medicalRecordId: medicalRecord.id,
      vaultDocumentId: vaultDoc.id,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading lab report:', error);
    return NextResponse.json({ error: 'Failed to upload lab report' }, { status: 500 });
  }
}
