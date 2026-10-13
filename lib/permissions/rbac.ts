import { SystemRole } from '@prisma/client';

export type PermissionAction =
  // Citizen
  | 'PROFILE_READ_OWN'
  | 'PROFILE_UPDATE_OWN'
  | 'DOC_UPLOAD_OWN'
  | 'CARD_VIEW_OWN'
  | 'CONSENT_MANAGE_OWN'
  | 'FAMILY_MANAGE_OWN'
  // Officer
  | 'CASE_VIEW_QUEUE'
  | 'CASE_REVIEW'
  | 'CASE_APPROVE'
  | 'CASE_REJECT'
  | 'CASE_REQUEST_INFO'
  | 'DOC_INSPECT'
  // Clinical
  | 'CLINICAL_READ_FULL'
  | 'CLINICAL_READ_VITALS'
  | 'CLINICAL_WRITE'
  | 'EMERGENCY_BREAK_GLASS'
  // Reception (strictly purpose-limited)
  | 'RECEPTION_VERIFY_IDENTITY'
  // Organization Admin
  | 'ORG_MANAGE_STAFF'
  | 'ORG_VIEW_AUDIT'
  // Platform Admin
  | 'SYSTEM_OPS'
  | 'SYSTEM_VIEW_ALL_AUDIT'
  | 'ORG_MANAGE_ALL';

const ROLE_PERMISSIONS: Record<SystemRole, readonly PermissionAction[]> = {
  CITIZEN: [
    'PROFILE_READ_OWN',
    'PROFILE_UPDATE_OWN',
    'DOC_UPLOAD_OWN',
    'CARD_VIEW_OWN',
    'CONSENT_MANAGE_OWN',
    'FAMILY_MANAGE_OWN',
  ],
  VERIFICATION_OFFICER: [
    'CASE_VIEW_QUEUE',
    'CASE_REVIEW',
    'CASE_APPROVE',
    'CASE_REJECT',
    'CASE_REQUEST_INFO',
    'DOC_INSPECT',
  ],
  DOCTOR: [
    'CLINICAL_READ_FULL',
    'CLINICAL_READ_VITALS',
    'CLINICAL_WRITE',
    'EMERGENCY_BREAK_GLASS',
    'RECEPTION_VERIFY_IDENTITY',
  ],
  NURSE_CLINICAL: [
    'CLINICAL_READ_VITALS',
    'EMERGENCY_BREAK_GLASS',
    'RECEPTION_VERIFY_IDENTITY',
  ],
  RECEPTION: [
    'RECEPTION_VERIFY_IDENTITY', // ONLY check card active status, photo, and demographic name. NO clinical records.
  ],
  ORG_ADMIN: [
    'ORG_MANAGE_STAFF',
    'ORG_VIEW_AUDIT',
  ],
  PLATFORM_ADMIN: [
    'SYSTEM_OPS',
    'SYSTEM_VIEW_ALL_AUDIT',
    'ORG_MANAGE_ALL',
    'CASE_VIEW_QUEUE',
    'DOC_INSPECT',
  ],
};

/**
 * Checks whether a single role has a specific permission.
 */
export function hasPermission(role: SystemRole, action: PermissionAction): boolean {
  const allowed = ROLE_PERMISSIONS[role];
  return allowed ? allowed.includes(action) : false;
}

export interface UserRoleAssignment {
  role: SystemRole;
  organizationId?: string | null;
}

/**
 * Validates whether a user possessing a list of role assignments is authorized to perform an action.
 * If targetOrganizationId is specified, the role must either match that organization or be a global platform admin.
 */
export function isAuthorized(
  assignments: UserRoleAssignment[],
  action: PermissionAction,
  targetOrganizationId?: string | null
): boolean {
  if (!assignments || assignments.length === 0) return false;

  for (const assignment of assignments) {
    if (!hasPermission(assignment.role, action)) {
      continue;
    }

    // Platform admin has universal scope
    if (assignment.role === 'PLATFORM_ADMIN') {
      return true;
    }

    // If an action requires organization scoping
    if (targetOrganizationId) {
      if (assignment.organizationId === targetOrganizationId) {
        return true;
      }
    } else {
      // Global role action or non-scoped action
      return true;
    }
  }

  return false;
}

/**
 * Explicit purpose-limitation check for Reception staff.
 * Guarantees Reception can NEVER access clinical data.
 */
export function isReceptionRestrictedFromClinical(action: PermissionAction): boolean {
  const clinicalActions: PermissionAction[] = [
    'CLINICAL_READ_FULL',
    'CLINICAL_READ_VITALS',
    'CLINICAL_WRITE',
    'EMERGENCY_BREAK_GLASS',
    'DOC_INSPECT',
  ];
  return clinicalActions.includes(action);
}
