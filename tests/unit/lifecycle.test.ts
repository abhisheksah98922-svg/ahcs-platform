import { describe, it, expect } from 'vitest';
import {
  isValidClientIdTransition,
  isValidCaseTransition,
} from '@/lib/services/lifecycle';

describe('Lifecycle State Machine Transitions', () => {
  describe('ClientId Transitions', () => {
    it('allows valid forward transitions', () => {
      expect(isValidClientIdTransition('APPLICATION', 'PENDING_VERIFICATION')).toBe(true);
      expect(isValidClientIdTransition('PENDING_VERIFICATION', 'VERIFIED')).toBe(true);
      expect(isValidClientIdTransition('VERIFIED', 'ACTIVE')).toBe(true);
      expect(isValidClientIdTransition('ACTIVE', 'SUSPENDED')).toBe(true);
      expect(isValidClientIdTransition('SUSPENDED', 'ACTIVE')).toBe(true);
    });

    it('rejects invalid or skipped transitions', () => {
      // Cannot jump from APPLICATION straight to ACTIVE
      expect(isValidClientIdTransition('APPLICATION', 'ACTIVE')).toBe(false);
      // Cannot jump from APPLICATION to VERIFIED
      expect(isValidClientIdTransition('APPLICATION', 'VERIFIED')).toBe(false);
      // Terminal state cannot transition to anything
      expect(isValidClientIdTransition('DEACTIVATED', 'ACTIVE')).toBe(false);
    });
  });

  describe('VerificationCase Transitions', () => {
    it('allows valid case flow', () => {
      expect(isValidCaseTransition('UNASSIGNED', 'UNDER_REVIEW')).toBe(true);
      expect(isValidCaseTransition('UNDER_REVIEW', 'APPROVED')).toBe(true);
      expect(isValidCaseTransition('UNDER_REVIEW', 'REJECTED')).toBe(true);
      expect(isValidCaseTransition('UNDER_REVIEW', 'INFO_REQUESTED')).toBe(true);
      expect(isValidCaseTransition('INFO_REQUESTED', 'UNDER_REVIEW')).toBe(true);
    });

    it('rejects invalid jumps', () => {
      // Cannot approve straight from UNASSIGNED without review
      expect(isValidCaseTransition('UNASSIGNED', 'APPROVED')).toBe(false);
      // Approved is terminal
      expect(isValidCaseTransition('APPROVED', 'UNDER_REVIEW')).toBe(false);
    });
  });
});
