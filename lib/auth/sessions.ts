import crypto from 'crypto';
import { cookies } from 'next/headers';
import { db } from '../db/store';
import { prisma } from '../db/prisma';
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
  let session = db.findSessionByHash(sessionTokenHash);

  // Serverless Cold-Start Fallback: Direct PostgreSQL lookup if not in memory cache
  if (!session) {
    try {
      const dbSession = await prisma.userSession.findUnique({
        where: { sessionTokenHash },
        include: {
          user: {
            include: {
              accounts: {
                include: {
                  profile: true,
                  clientId: true,
                  cards: true,
                },
              },
            },
          },
        },
      });

      if (dbSession && !dbSession.revokedAt && new Date(dbSession.expiresAt) > new Date()) {
        const u = dbSession.user;
        if (!u || u.status === 'SUSPENDED' || u.status === 'LOCKED') return null;

        const primaryAccount = u.accounts?.[0];
        return {
          user: {
            id: u.id,
            mobileNumber: u.mobileNumber,
            mobileVerifiedAt: u.mobileVerifiedAt ? u.mobileVerifiedAt.toISOString() : null,
            email: u.email,
            emailVerifiedAt: u.emailVerifiedAt ? u.emailVerifiedAt.toISOString() : null,
            role: u.role as any,
            status: u.status as any,
            authProvider: u.authProvider as any,
            googleSub: u.googleSub,
            createdAt: u.createdAt.toISOString(),
            updatedAt: u.updatedAt.toISOString(),
          },
          session: {
            id: dbSession.id,
            userId: dbSession.userId,
            sessionTokenHash: dbSession.sessionTokenHash,
            ipAddress: dbSession.ipAddress,
            userAgent: dbSession.userAgent,
            expiresAt: dbSession.expiresAt.toISOString(),
            createdAt: dbSession.createdAt.toISOString(),
            revokedAt: null,
          },
          account: primaryAccount ? {
            id: primaryAccount.id,
            userId: primaryAccount.userId,
            accountNumber: primaryAccount.accountNumber,
            state: primaryAccount.state as any,
            createdAt: primaryAccount.createdAt.toISOString(),
            updatedAt: primaryAccount.updatedAt.toISOString(),
          } : undefined,
          profile: primaryAccount?.profile ? {
            id: primaryAccount.profile.id,
            accountId: primaryAccount.profile.accountId,
            fullName: primaryAccount.profile.fullName,
            dateOfBirth: primaryAccount.profile.dateOfBirth.toISOString().split('T')[0],
            gender: primaryAccount.profile.gender as any,
            bloodGroup: primaryAccount.profile.bloodGroup as any,
            bloodGroupSource: (primaryAccount.profile.bloodGroupSource || 'UNKNOWN') as any,
            addressLine1: primaryAccount.profile.addressLine1 || '',
            addressLine2: primaryAccount.profile.addressLine2 || '',
            district: primaryAccount.profile.district,
            stateProvince: primaryAccount.profile.stateProvince,
            pinCode: primaryAccount.profile.pinCode,
            countryCode: 'IN',
            emergencyContactName: primaryAccount.profile.emergencyContactName || '',
            emergencyContactPhone: primaryAccount.profile.emergencyContactPhone || '',
            emergencyContactRelation: primaryAccount.profile.emergencyContactRelation || '',
            createdAt: primaryAccount.profile.createdAt.toISOString(),
            updatedAt: primaryAccount.profile.updatedAt.toISOString(),
          } : undefined,
          clientId: primaryAccount?.clientId ? {
            id: primaryAccount.clientId.id,
            accountId: primaryAccount.clientId.accountId,
            clientId: primaryAccount.clientId.clientId,
            checksum: primaryAccount.clientId.checksum,
            issuedAt: primaryAccount.clientId.issuedAt.toISOString(),
            isActive: primaryAccount.clientId.isActive,
          } : undefined,
          card: primaryAccount?.cards?.[0] ? {
            id: primaryAccount.cards[0].id,
            clientIdFk: primaryAccount.cards[0].clientIdFk,
            accountId: primaryAccount.cards[0].accountId,
            cardNumber: primaryAccount.cards[0].cardNumber,
            version: primaryAccount.cards[0].version,
            status: primaryAccount.cards[0].status as any,
            activationCodeHash: primaryAccount.cards[0].activationCodeHash,
            activatedAt: primaryAccount.cards[0].activatedAt ? primaryAccount.cards[0].activatedAt.toISOString() : null,
            activatedByUserId: primaryAccount.cards[0].activatedByUserId,
            expiresAt: primaryAccount.cards[0].expiresAt.toISOString(),
            createdAt: primaryAccount.cards[0].createdAt.toISOString(),
            updatedAt: primaryAccount.cards[0].updatedAt.toISOString(),
          } : undefined,
        };
      }
    } catch (e: any) {
      console.warn('[SESSION_PG_LOOKUP_NOTICE]', e.message);
    }
  }

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
