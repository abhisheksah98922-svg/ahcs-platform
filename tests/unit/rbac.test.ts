import { describe, it, expect } from 'vitest';
import {
  hasPermission,
  isAuthorized,
  isReceptionRestrictedFromClinical,
} from '@/lib/permissions/rbac';

describe('RBAC Matrix & Security Guards', () => {
  it('allows citizens to manage own profile and view own card', () => {
    expect(hasPermission('CITIZEN', 'PROFILE_READ_OWN')).toBe(true);
    expect(hasPermission('CITIZEN', 'PROFILE_UPDATE_OWN')).toBe(true);
    expect(hasPermission('CITIZEN', 'CARD_VIEW_OWN')).toBe(true);
    expect(hasPermission('CITIZEN', 'DOC_UPLOAD_OWN')).toBe(true);
  });

  it('denies citizen from clinical or officer actions', () => {
    expect(hasPermission('CITIZEN', 'CASE_REVIEW')).toBe(false);
    expect(hasPermission('CITIZEN', 'CLINICAL_READ_FULL')).toBe(false);
    expect(hasPermission('CITIZEN', 'EMERGENCY_BREAK_GLASS')).toBe(false);
  });

  it('allows verification officers to review and approve cases', () => {
    expect(hasPermission('VERIFICATION_OFFICER', 'CASE_VIEW_QUEUE')).toBe(true);
    expect(hasPermission('VERIFICATION_OFFICER', 'CASE_REVIEW')).toBe(true);
    expect(hasPermission('VERIFICATION_OFFICER', 'CASE_APPROVE')).toBe(true);
    expect(hasPermission('VERIFICATION_OFFICER', 'CASE_REJECT')).toBe(true);
    expect(hasPermission('VERIFICATION_OFFICER', 'DOC_INSPECT')).toBe(true);
  });

  it('strictly limits Reception staff to identity verification only', () => {
    expect(hasPermission('RECEPTION', 'RECEPTION_VERIFY_IDENTITY')).toBe(true);

    // Forbidden from all clinical data
    expect(hasPermission('RECEPTION', 'CLINICAL_READ_FULL')).toBe(false);
    expect(hasPermission('RECEPTION', 'CLINICAL_READ_VITALS')).toBe(false);
    expect(hasPermission('RECEPTION', 'CLINICAL_WRITE')).toBe(false);
    expect(hasPermission('RECEPTION', 'EMERGENCY_BREAK_GLASS')).toBe(false);
    expect(hasPermission('RECEPTION', 'DOC_INSPECT')).toBe(false);
  });

  it('correctly flags clinical actions as forbidden for reception', () => {
    expect(isReceptionRestrictedFromClinical('CLINICAL_READ_FULL')).toBe(true);
    expect(isReceptionRestrictedFromClinical('CLINICAL_READ_VITALS')).toBe(true);
    expect(isReceptionRestrictedFromClinical('EMERGENCY_BREAK_GLASS')).toBe(true);
    expect(isReceptionRestrictedFromClinical('RECEPTION_VERIFY_IDENTITY')).toBe(false);
  });

  it('validates organization scoping in multi-tenant contexts', () => {
    const doctorAtHospitalA = [
      { role: 'DOCTOR' as const, organizationId: 'hosp-100' },
    ];

    expect(isAuthorized(doctorAtHospitalA, 'CLINICAL_READ_FULL', 'hosp-100')).toBe(true);
    expect(isAuthorized(doctorAtHospitalA, 'CLINICAL_READ_FULL', 'hosp-200')).toBe(false);

    // Platform admin has universal bypass
    const platformAdmin = [{ role: 'PLATFORM_ADMIN' as const, organizationId: null }];
    expect(isAuthorized(platformAdmin, 'SYSTEM_OPS', 'hosp-200')).toBe(true);
  });
});
