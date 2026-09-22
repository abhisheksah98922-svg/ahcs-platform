import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/auth/sessions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const context = await getCurrentUser();
    if (!context || !context.account) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { user, account } = context;
    const body = await request.json();
    const { query, mode = 'EXPLAIN_TERM', recordId } = body;

    if (!query) {
      return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 });
    }

    // Safety checks against dangerous prompt injections trying to force diagnosis
    const lowerQuery = query.toLowerCase();
    const isDangerousDiagnosisAttempt =
      lowerQuery.includes('diagnose') ||
      lowerQuery.includes('what disease') ||
      lowerQuery.includes('dose') ||
      lowerQuery.includes('stop taking') ||
      lowerQuery.includes('prescribe');

    if (isDangerousDiagnosisAttempt) {
      const refusalText =
        'Medical Safety Notice: The AHCS AI Health Assistant is strictly an educational tool and cannot diagnose or prescribe medications, change dosages, or modify your treatment plan. Please consult your verified physician for clinical guidance.';
      return NextResponse.json({
        success: true,
        refused: true,
        mode: 'SAFETY_INTERVENTION',
        response: refusalText,
        explanation: refusalText,
        disclaimer: 'For educational purposes only. AHCS AI cannot diagnose or prescribe.',
        isMedicalAdvice: false,
        requiresPhysicianConsultation: true,
      });
    }

    // Record summary mode: ensure caller possesses authorization for recordId
    let contextRecordNotes = '';
    if (recordId) {
      const record = db.getMedicalRecordById(recordId);
      if (record) {
        if (record.accountId !== account.id && !db.canAccessFamilyRecords(account.id, record.accountId, 'MEDICAL_RECORD')) {
          return NextResponse.json({ error: 'Unauthorized to access this record' }, { status: 403 });
        }
        contextRecordNotes = `Record Title: ${record.title}. Clinical Notes: ${record.clinicalNotes}. Diagnosis: ${record.clinicalDiagnosis}.`;
      }
    }

    // Generate safe, deterministic medical education response
    let educationalResponse = '';
    if (mode === 'EXPLAIN_TERM') {
      educationalResponse = `Medical Term Explanation: "${query}" is commonly used in clinical practice. In standard medical terminology, this refers to observed anatomical or physiological indicators evaluated by clinicians during diagnosis. Always review lab ranges with your prescribing physician.`;
    } else if (mode === 'PREPARE_QUESTIONS') {
      educationalResponse = `Suggested Questions for Dr. Consultation regarding "${query}":\n1. What is the primary cause of these symptoms?\n2. Are there any dietary or lifestyle adjustments recommended alongside my prescription?\n3. When should I schedule a follow-up consultation or blood work?`;
    } else {
      educationalResponse = `Educational Summary: Based on authorized documentation, the referenced medical context relates to scheduled primary care reviews. Note: This explanation does not substitute for clinical examination by a qualified practitioner.`;
    }

    db.logAudit({
      actorId: user.id,
      actorRole: user.role,
      action: 'AI_HEALTH_ASSISTANT_QUERY',
      targetResource: 'ai_assistant',
      targetId: recordId || null,
      ipAddress: request.headers.get('x-forwarded-for') || null,
      userAgent: request.headers.get('user-agent') || null,
      metadata: { mode, queryLength: query.length },
    });

    return NextResponse.json({
      success: true,
      mode,
      response: educationalResponse,
      explanation: educationalResponse,
      disclaimer: 'This information is for educational purposes only and does not provide medical diagnosis, clinical prescriptions, or emergency directives. Always consult your attending doctor.',
      isMedicalAdvice: false,
    });
  } catch (error: any) {
    console.error('Error in AI assistant:', error);
    return NextResponse.json({ error: 'Failed to process assistant query' }, { status: 500 });
  }
}
