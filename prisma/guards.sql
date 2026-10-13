-- ==============================================================================
-- AHCS Database Integrity & Append-Only Guards
-- ==============================================================================

-- 1. Ensure UserRole Partial Uniqueness for Nullable organizationId
CREATE UNIQUE INDEX IF NOT EXISTS "user_role_org_unique" 
  ON "UserRole" ("userId", "role", "organizationId") 
  WHERE "organizationId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "user_role_global_unique" 
  ON "UserRole" ("userId", "role") 
  WHERE "organizationId" IS NULL;

-- 2. Enforce Immutable Append-Only Behavior on AuditLog Table
CREATE OR REPLACE FUNCTION enforce_audit_log_immutable()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'UPDATE and DELETE operations are strictly forbidden on AuditLog table';
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_audit_log_immutable ON "AuditLog";

CREATE TRIGGER trg_audit_log_immutable
  BEFORE UPDATE OR DELETE ON "AuditLog"
  FOR EACH ROW EXECUTE FUNCTION enforce_audit_log_immutable();
