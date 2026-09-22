import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '../db/store';
import { UserRecord, UserSessionRecord, Role, AccountRecord, ProfileRecord, ClientIdRecord, CardRecord } from '../db/types';

export const SESSION_COOKIE_NAME = 'ahcs_session';
const SESSION_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

export function hashSessionToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createSessionForUser(userId: string, userAgent?: string, ipAddress?: string): {
  rawToken: string;
  expiresAt: string;
} {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const sessionTokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

  db.createSession({
    userId,
    sessionTokenHash,
    ipAddress: ipAddress || null,
    userAgent: userAgent || null,
    expiresAt,
    revokedAt: null,
  });

  return { rawToken, expiresAt };
}

export interface AuthenticatedContext {
  user: UserRecord;
  session?: UserSessionRecord;
  account?: AccountRecord;
  profile?: ProfileRecord;
  clientId?: ClientIdRecord;
  card?: CardRecord;
}

export async function getCurrentUser(): Promise<AuthenticatedContext | null> {
  const cookieStore = cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!rawToken) return null;

  const sessionTokenHash = hashSessionToken(rawToken);
  const session = db.findSessionByHash(sessionTokenHash);

  if (!session) return null;

  const user = db.findUserById(session.userId);
  if (!user || user.status === 'SUSPENDED' || user.status === 'LOCKED') {
    return null;
  }

  const account = db.findAccountByUserId(user.id);
  const profile = account ? db.findProfileByAccountId(account.id) : undefined;
  const clientId = account ? db.findClientIdByAccountId(account.id) : undefined;
  const card = account ? db.findCardByAccountId(account.id) : undefined;

  return {
    user,
    session,
    account,
    profile,
    clientId,
    card,
  };
}

export async function requireAuth(): Promise<AuthenticatedContext> {
  const context = await getCurrentUser();
  if (!context) {
    throw new Error('UNAUTHORIZED: Valid authenticated session required');
  }
  return context;
}

export async function requireRole(allowedRoles: Role[]): Promise<AuthenticatedContext> {
  const context = await requireAuth();
  if (!allowedRoles.includes(context.user.role)) {
    throw new Error(`FORBIDDEN: Requires one of roles [${allowedRoles.join(', ')}], current role is ${context.user.role}`);
  }
  return context;
}
