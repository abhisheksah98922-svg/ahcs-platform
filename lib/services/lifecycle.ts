import { ClientIdStatus, VerificationCaseStatus, ConsentStatus } from '@prisma/client';
import { prisma } from '@/lib/db/prisma';
import { logAuditEvent } from '@/lib/audit/audit-logger';

// -----------------------------------------------------------------------------
// CLIENT ID FINITE STATE MACHINE
// -----------------------------------------------------------------------------

const ALLOWED_CLIENT_ID_TRANSITIONS: Record<ClientIdStatus, readonly ClientIdStatus[]> = {
  APPLICATION: ['PENDING_VERIFICATION', 'DEACTIVATED'],
  PENDING_VERIFICATION: ['VERIFICATION_REQUIRED', 'VERIFIED', 'DEACTIVATED'],
  VERIFICATION_REQUIRED: ['PENDING_VERIFICATION', 'DEACTIVATED'],
  VERIFIED: ['ACTIVE', 'SUSPENDED', 'DEACTIVATED'],
  ACTIVE: ['SUSPENDED', 'DEACTIVATED'],
  SUSPENDED: ['ACTIVE', 'DEACTIVATED'],
  DEACTIVATED: [], // Terminal state
};

export function isValidClientIdTransition(from: ClientIdStatus, to: ClientIdStatus): boolean {
  return ALLOWED_CLIENT_ID_TRANSITIONS[from]?.includes(to) ?? false;
}

export async function transitionClientIdStatus(params: {
  clientIdRecordId: string;
  targetStatus: ClientIdStatus;
  actorId: string;
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.clientId.findUnique({
      where: { id: params.clientIdRecordId },
    });

    if (!existing) {
      throw new Error(`ClientId record not found: ${params.clientIdRecordId}`);
    }

    if (!isValidClientIdTransition(existing.status, params.targetStatus)) {
      throw new Error(
        `Invalid ClientId state transition: Cannot transition from ${existing.status} to ${params.targetStatus}`
      );
    }

    const updated = await tx.clientId.update({
      where: { id: params.clientIdRecordId },
      data: {
        status: params.targetStatus,
        lastStatusChange: new Date(),
        statusReason: params.reason ?? null,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.actorId,
        action: `CLIENT_ID.TRANSITION_${params.targetStatus}`,
        entityType: 'ClientId',
        entityId: params.clientIdRecordId,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
        metadata: {
          previousStatus: existing.status,
          newStatus: params.targetStatus,
          reason: params.reason,
        },
      },
    });

    return updated;
  });
}

// -----------------------------------------------------------------------------
// VERIFICATION CASE FINITE STATE MACHINE
// -----------------------------------------------------------------------------

const ALLOWED_CASE_TRANSITIONS: Record<VerificationCaseStatus, readonly VerificationCaseStatus[]> = {
  UNASSIGNED: ['UNDER_REVIEW'],
  UNDER_REVIEW: ['INFO_REQUESTED', 'APPROVED', 'REJECTED'],
  INFO_REQUESTED: ['UNDER_REVIEW', 'REJECTED'],
  APPROVED: [], // Terminal state
  REJECTED: ['UNDER_REVIEW'], // Can be reopened on formal dispute
};

export function isValidCaseTransition(
  from: VerificationCaseStatus,
  to: VerificationCaseStatus
): boolean {
  return ALLOWED_CASE_TRANSITIONS[from]?.includes(to) ?? false;
}

export async function transitionCaseToUnderReview(params: {
  caseId: string;
  officerId: string;
  ipAddress?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const c = await tx.verificationCase.findUnique({ where: { id: params.caseId } });
    if (!c) throw new Error('VerificationCase not found');
    if (!isValidCaseTransition(c.status, 'UNDER_REVIEW')) {
      throw new Error(`Cannot transition case from ${c.status} to UNDER_REVIEW`);
    }

    const updated = await tx.verificationCase.update({
      where: { id: params.caseId },
      data: {
        status: 'UNDER_REVIEW',
        assignedOfficerId: params.officerId,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.officerId,
        action: 'CASE.ASSIGN_AND_REVIEW',
        entityType: 'VerificationCase',
        entityId: params.caseId,
        ipAddress: params.ipAddress ?? null,
        metadata: { previousStatus: c.status, newStatus: 'UNDER_REVIEW' },
      },
    });

    return updated;
  });
}

export async function transitionCaseToInfoRequested(params: {
  caseId: string;
  officerId: string;
  infoRequestNote: string;
  ipAddress?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const c = await tx.verificationCase.findUnique({ where: { id: params.caseId } });
    if (!c) throw new Error('VerificationCase not found');
    if (!isValidCaseTransition(c.status, 'INFO_REQUESTED')) {
      throw new Error(`Cannot transition case from ${c.status} to INFO_REQUESTED`);
    }

    const updated = await tx.verificationCase.update({
      where: { id: params.caseId },
      data: {
        status: 'INFO_REQUESTED',
        infoRequestNote: params.infoRequestNote,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.officerId,
        action: 'CASE.REQUEST_MORE_INFO',
        entityType: 'VerificationCase',
        entityId: params.caseId,
        ipAddress: params.ipAddress ?? null,
        metadata: { note: params.infoRequestNote },
      },
    });

    return updated;
  });
}

export async function transitionCaseToApproved(params: {
  caseId: string;
  officerId: string;
  notes?: string;
  ipAddress?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const c = await tx.verificationCase.findUnique({
      where: { id: params.caseId },
      include: { profile: { include: { user: true } } },
    });
    if (!c) throw new Error('VerificationCase not found');
    if (!isValidCaseTransition(c.status, 'APPROVED')) {
      throw new Error(`Cannot transition case from ${c.status} to APPROVED`);
    }

    const updated = await tx.verificationCase.update({
      where: { id: params.caseId },
      data: {
        status: 'APPROVED',
        reviewedById: params.officerId,
        reviewedAt: new Date(),
        notes: params.notes,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.officerId,
        action: 'CASE.APPROVE',
        entityType: 'VerificationCase',
        entityId: params.caseId,
        ipAddress: params.ipAddress ?? null,
        metadata: { notes: params.notes },
      },
    });

    return updated;
  });
}

export async function transitionCaseToRejected(params: {
  caseId: string;
  officerId: string;
  rejectionReason: string;
  ipAddress?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const c = await tx.verificationCase.findUnique({ where: { id: params.caseId } });
    if (!c) throw new Error('VerificationCase not found');
    if (!isValidCaseTransition(c.status, 'REJECTED')) {
      throw new Error(`Cannot transition case from ${c.status} to REJECTED`);
    }

    const updated = await tx.verificationCase.update({
      where: { id: params.caseId },
      data: {
        status: 'REJECTED',
        reviewedById: params.officerId,
        reviewedAt: new Date(),
        notes: params.rejectionReason,
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.officerId,
        action: 'CASE.REJECT',
        entityType: 'VerificationCase',
        entityId: params.caseId,
        ipAddress: params.ipAddress ?? null,
        metadata: { reason: params.rejectionReason },
      },
    });

    return updated;
  });
}

// -----------------------------------------------------------------------------
// CONSENT GRANT TRANSITION
// -----------------------------------------------------------------------------

export async function transitionConsentToRevoked(params: {
  consentId: string;
  granterId: string;
  ipAddress?: string;
}) {
  return await prisma.$transaction(async (tx) => {
    const consent = await tx.consentGrant.findUnique({ where: { id: params.consentId } });
    if (!consent) throw new Error('ConsentGrant not found');
    if (consent.granterId !== params.granterId) {
      throw new Error('Unauthorized: only the granter can revoke consent');
    }
    if (consent.status === 'REVOKED') {
      return consent;
    }

    const updated = await tx.consentGrant.update({
      where: { id: params.consentId },
      data: {
        status: 'REVOKED',
        revokedAt: new Date(),
      },
    });

    await tx.auditLog.create({
      data: {
        actorId: params.granterId,
        action: 'CONSENT.REVOKED',
        entityType: 'ConsentGrant',
        entityId: params.consentId,
        ipAddress: params.ipAddress ?? null,
      },
    });

    return updated;
  });
}
