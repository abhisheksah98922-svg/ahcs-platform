import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { prisma } from './prisma';
import {
  UserRecord,
  UserSessionRecord,
  AccountRecord,
  ProfileRecord,
  VerificationRequestRecord,
  VerificationDocumentRecord,
  ClientIdRecord,
  CardRecord,
  QrTokenRecord,
  EmergencyProfileRecord,
  AuditLogRecord,
  ProviderRecord,
  ProviderStatus,
  MedicalRecord,
  ConsentRecord,
  ConsentStatus,
  PaymentOrderRecord,
  PaymentOrderStatus,
  OrganizationRecord,
  CorporateSponsorshipRecord,
  AppointmentRecord,
  AppointmentStatus,
  FamilyMemberRecord,
  FamilyPermissionLevel,
  MedicalDocumentVaultRecord,
  MedicationScheduleRecord,
  LabOrderRecord,
  LabOrderStatus,
  NotificationRecord,
  CardDeliveryRecord,
  CardDeliveryStage,
  BenefitRuleRecord,
  ClaimRecord,
  ClaimStatus,
  FraudAlertRecord,
  DeveloperApiKeyRecord,
} from './types';

interface DatabaseSchema {
  users: UserRecord[];
  sessions: UserSessionRecord[];
  accounts: AccountRecord[];
  profiles: ProfileRecord[];
  verificationRequests: VerificationRequestRecord[];
  verificationDocuments: VerificationDocumentRecord[];
  clientIds: ClientIdRecord[];
  cards: CardRecord[];
  qrTokens: QrTokenRecord[];
  emergencyProfiles: EmergencyProfileRecord[];
  auditLogs: AuditLogRecord[];
  providers: ProviderRecord[];
  medicalRecords: MedicalRecord[];
  consents: ConsentRecord[];
  paymentOrders: PaymentOrderRecord[];
  organizations: OrganizationRecord[];
  corporateSponsorships: CorporateSponsorshipRecord[];
  appointments: AppointmentRecord[];
  familyMembers: FamilyMemberRecord[];
  vaultDocuments: MedicalDocumentVaultRecord[];
  medicationSchedules: MedicationScheduleRecord[];
  labOrders: LabOrderRecord[];
  notifications: NotificationRecord[];
  cardDeliveries: CardDeliveryRecord[];
  benefitRules: BenefitRuleRecord[];
  claims: ClaimRecord[];
  fraudAlerts: FraudAlertRecord[];
  apiKeys: DeveloperApiKeyRecord[];
}

const isServerlessEnv = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.LAMBDA_TASK_ROOT);
const SEED_FILE = path.join(process.cwd(), 'data', 'ahcs_production.json');
const DATA_DIR = isServerlessEnv ? path.join('/tmp', 'ahcs_data') : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'ahcs_production.json');
const LOCK_FILE = path.join(DATA_DIR, 'ahcs.lock');

class PersistentDataStore {
  private data: DatabaseSchema;
  private isLoaded: boolean = false;

  constructor() {
    this.data = this.getInitialSchema();
    this.ensureInitialized();
  }

  private getInitialSchema(): DatabaseSchema {
    return {
      users: [],
      sessions: [],
      accounts: [],
      profiles: [],
      verificationRequests: [],
      verificationDocuments: [],
      clientIds: [],
      cards: [],
      qrTokens: [],
      emergencyProfiles: [],
      auditLogs: [],
      providers: [],
      medicalRecords: [],
      consents: [],
      paymentOrders: [],
      organizations: [],
      corporateSponsorships: [],
      appointments: [],
      familyMembers: [],
      vaultDocuments: [],
      medicationSchedules: [],
      labOrders: [],
      notifications: [],
      cardDeliveries: [],
      benefitRules: [],
      claims: [],
      fraudAlerts: [],
      apiKeys: [],
    };
  }

  private ensureInitialized() {
    if (this.isLoaded) return;

    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
    } catch (e) {
      // Read-only filesystem warning
    }

    const fileToLoad = fs.existsSync(DB_FILE) 
      ? DB_FILE 
      : (fs.existsSync(SEED_FILE) ? SEED_FILE : null);

    if (fileToLoad) {
      try {
        const raw = fs.readFileSync(fileToLoad, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure new schema collections exist if loaded from an earlier file version
        this.data.providers = this.data.providers || [];
        this.data.medicalRecords = this.data.medicalRecords || [];
        this.data.consents = this.data.consents || [];
        this.data.paymentOrders = this.data.paymentOrders || [];
        this.data.organizations = this.data.organizations || [];
        this.data.corporateSponsorships = this.data.corporateSponsorships || [];
        this.data.appointments = this.data.appointments || [];
        this.data.familyMembers = this.data.familyMembers || [];
        this.data.vaultDocuments = this.data.vaultDocuments || [];
        this.data.medicationSchedules = this.data.medicationSchedules || [];
        this.data.labOrders = this.data.labOrders || [];
        this.data.notifications = this.data.notifications || [];
        this.data.cardDeliveries = this.data.cardDeliveries || [];
        this.data.benefitRules = this.data.benefitRules || [];
        this.data.claims = this.data.claims || [];
        this.data.fraudAlerts = this.data.fraudAlerts || [];
        this.data.apiKeys = this.data.apiKeys || [];

        if (this.data.benefitRules.length === 0) {
          this.seedBenefitRules();
        }

        this.seedInitialProviders();
        this.persistSync();
      } catch (err) {
        console.error('Error loading DB file, fallback to clean initial state', err);
        this.data = this.getInitialSchema();
        this.seedSystemAccounts();
        this.seedInitialProviders();
        this.persistSync();
      }
    } else {
      this.data = this.getInitialSchema();
      this.seedSystemAccounts();
      this.seedInitialProviders();
      this.persistSync();
    }

    this.isLoaded = true;
    this.hydrateFromPostgres();
  }

  private async hydrateFromPostgres() {
    try {
      const dbUsers = await prisma.user.findMany();
      if (dbUsers && dbUsers.length > 0) {
        for (const u of dbUsers) {
          const exists = this.data.users.find(existing => existing.id === u.id || existing.mobileNumber === u.mobileNumber);
          if (!exists) {
            this.data.users.push({
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
            });
          }
        }
      }
    } catch (e) {
      // Non-blocking sync notice
    }
  }

  private seedInitialProviders() {
    // In production, do not inject fake hospitals; only seed during automated test runs
    if (process.env.NODE_ENV !== 'test') {
      return;
    }
    const verifiedProviders: ProviderRecord[] = [
      {
        id: 'PRV-101',
        name: 'City Care Multi-Specialty Hospital',
        category: 'HOSPITAL',
        registrationNumber: 'KA-MED-HOSP-2018-0912',
        medicalCouncil: 'Karnataka Medical Council',
        address: '84 Ring Road, Koramangala 4th Block',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560034',
        phone: '+91 80 4912 8000',
        email: 'desk@citycarehospital.in',
        services: ['24/7 Emergency', 'Cardiology', 'Trauma Unit', 'ICU', 'Radiology'],
        partnerTier: 'PREMIUM_NETWORK',
        operatingHours: '24 Hours Open',
        status: 'VERIFIED',
        latitude: 12.9352,
        longitude: 77.6245,
        emergency24x7: true,
        specialities: ['Cardiology', 'Emergency Medicine', 'Neurology', 'Orthopedics'],
        rating: 4.8,
        verifiedAt: new Date().toISOString(),
        verifiedByOfficerId: 'usr_officer_ananya_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'PRV-102',
        name: 'Sunrise Family Healthcare Clinic',
        category: 'CLINIC',
        registrationNumber: 'KA-MED-CLN-2020-4102',
        medicalCouncil: 'Karnataka Medical Council',
        address: '12 100ft Road, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        phone: '+91 80 2521 3400',
        email: 'care@sunrisefamilyclinic.in',
        services: ['General Practice', 'Pediatrics', 'Vaccinations', 'Preventive Health'],
        partnerTier: 'STANDARD',
        operatingHours: '08:00 AM - 08:00 PM',
        status: 'VERIFIED',
        latitude: 12.9716,
        longitude: 77.6412,
        emergency24x7: false,
        specialities: ['General Medicine', 'Pediatrics'],
        rating: 4.6,
        verifiedAt: new Date().toISOString(),
        verifiedByOfficerId: 'usr_officer_ananya_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'PRV-103',
        name: 'LifeCare Diagnostics & Pathology',
        category: 'LAB',
        registrationNumber: 'KA-DIAG-2019-8831',
        medicalCouncil: 'National Accreditation Board for Testing and Calibration Laboratories (NABL)',
        address: '45 HSR Layout, Sector 2',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560102',
        phone: '+91 80 6710 4500',
        email: 'reports@lifecarediagnostics.in',
        services: ['Comprehensive Blood Panels', 'MRI / CT Scan', 'Digital X-Ray', 'Biochemistry'],
        partnerTier: 'PREMIUM_NETWORK',
        operatingHours: '07:00 AM - 09:00 PM',
        status: 'VERIFIED',
        latitude: 12.9121,
        longitude: 77.6446,
        emergency24x7: false,
        specialities: ['Pathology', 'Radiology', 'Biochemistry'],
        rating: 4.7,
        verifiedAt: new Date().toISOString(),
        verifiedByOfficerId: 'usr_officer_ananya_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'PRV-104',
        name: 'MedPlus 24x7 Network Pharmacy',
        category: 'PHARMACY',
        registrationNumber: 'KA-PHARM-2021-0044',
        medicalCouncil: 'Pharmacy Council of India',
        address: 'Shop 4, Main Market, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pinCode: '560038',
        phone: '+91 80 2345 6789',
        email: 'orders@medplusnetwork.in',
        services: ['Prescription Medicines', 'Emergency First Aid', 'Cold-Chain Insulin Storage'],
        partnerTier: 'STANDARD',
        operatingHours: '24 Hours Open',
        status: 'VERIFIED',
        latitude: 12.9784,
        longitude: 77.6408,
        emergency24x7: true,
        specialities: ['Pharmacy', 'First Aid'],
        rating: 4.5,
        verifiedAt: new Date().toISOString(),
        verifiedByOfficerId: 'usr_officer_ananya_01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const p of verifiedProviders) {
      const idx = this.data.providers.findIndex(existing => existing.id === p.id);
      if (idx >= 0) {
        this.data.providers[idx] = { ...this.data.providers[idx], ...p };
      } else {
        this.data.providers.push(p);
      }
    }
  }

  private seedBenefitRules() {
    this.data.benefitRules = [
      {
        id: 'ben_core_consult',
        planId: 'AHCS-PLAN-CORE',
        planName: 'Core Health ID',
        category: 'CONSULTATION',
        discountPercent: 15,
        maxCoveragePaise: 50000,
        copayPercent: 85,
      },
      {
        id: 'ben_core_diag',
        planId: 'AHCS-PLAN-CORE',
        planName: 'Core Health ID',
        category: 'DIAGNOSTICS',
        discountPercent: 10,
        maxCoveragePaise: 100000,
        copayPercent: 90,
      },
      {
        id: 'ben_prem_consult',
        planId: 'AHCS-PLAN-PREMIUM',
        planName: 'Smart Physical Card & Shield',
        category: 'CONSULTATION',
        discountPercent: 30,
        maxCoveragePaise: 150000,
        copayPercent: 70,
      },
      {
        id: 'ben_prem_emerg',
        planId: 'AHCS-PLAN-PREMIUM',
        planName: 'Smart Physical Card & Shield',
        category: 'EMERGENCY',
        discountPercent: 50,
        maxCoveragePaise: 5000000,
        copayPercent: 50,
      },
    ];
  }

  private seedSystemAccounts() {
    // Seed essential verification officer and admin staff accounts
    const officerUser: UserRecord = {
      id: 'usr_officer_ananya_01',
      mobileNumber: '+919999900001',
      mobileVerifiedAt: new Date().toISOString(),
      email: 'officer.ananya@ahcs.in',
      emailVerifiedAt: new Date().toISOString(),
      role: 'VERIFICATION_OFFICER',
      status: 'ACTIVE',
      authProvider: 'MOBILE_OTP',
      googleSub: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const adminUser: UserRecord = {
      id: 'usr_admin_system_01',
      mobileNumber: '+919999900002',
      mobileVerifiedAt: new Date().toISOString(),
      email: 'admin@ahcs.in',
      emailVerifiedAt: new Date().toISOString(),
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      authProvider: 'MOBILE_OTP',
      googleSub: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.users.push(officerUser, adminUser);
  }

  private persistSync() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const tempFile = `${DB_FILE}.${Date.now()}.tmp`;
      const jsonString = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(tempFile, jsonString, 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.warn('[STORE] Storage persistence skipped in read-only environment:', err);
    }
  }

  // --- REPOSITORY METHODS ---

  // USERS
  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public findUserByMobile(mobileNumber: string): UserRecord | undefined {
    return this.data.users.find(u => u.mobileNumber === mobileNumber);
  }

  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
  }

  public createUser(user: Omit<UserRecord, 'id' | 'createdAt' | 'updatedAt'>): UserRecord {
    if (this.findUserByMobile(user.mobileNumber)) {
      throw new Error(`User with mobile ${user.mobileNumber} already exists`);
    }

    const record: UserRecord = {
      ...user,
      id: `usr_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.users.push(record);
    this.persistSync();

    // Asynchronous dual-write to Neon PostgreSQL
    prisma.user.create({
      data: {
        id: record.id,
        mobileNumber: record.mobileNumber,
        mobileVerifiedAt: record.mobileVerifiedAt ? new Date(record.mobileVerifiedAt) : null,
        email: record.email || null,
        emailVerifiedAt: record.emailVerifiedAt ? new Date(record.emailVerifiedAt) : null,
        role: record.role as any,
        status: record.status as any,
        authProvider: record.authProvider as any,
      },
    }).catch(err => console.warn('[POSTGRES_USER_WRITE_NOTICE]', err.message));

    return record;
  }

  public updateUser(id: string, updates: Partial<UserRecord>): UserRecord {
    const user = this.findUserById(id);
    if (!user) throw new Error(`User ${id} not found`);

    Object.assign(user, updates, { updatedAt: new Date().toISOString() });
    this.persistSync();

    prisma.user.update({
      where: { id },
      data: {
        email: updates.email,
        emailVerifiedAt: updates.emailVerifiedAt ? new Date(updates.emailVerifiedAt) : undefined,
        status: updates.status as any,
      },
    }).catch(err => console.warn('[POSTGRES_USER_UPDATE_NOTICE]', err.message));

    return user;
  }

  // SESSIONS
  public createSession(session: Omit<UserSessionRecord, 'id' | 'createdAt'>): UserSessionRecord {
    const record: UserSessionRecord = {
      ...session,
      id: `ses_${crypto.randomBytes(16).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };

    this.data.sessions.push(record);
    this.persistSync();

    prisma.userSession.create({
      data: {
        id: record.id,
        userId: record.userId,
        sessionTokenHash: record.sessionTokenHash,
        ipAddress: record.ipAddress || null,
        userAgent: record.userAgent || null,
        expiresAt: new Date(record.expiresAt),
      },
    }).catch(err => console.warn('[POSTGRES_SESSION_WRITE_NOTICE]', err.message));

    return record;
  }

  public findSessionByHash(tokenHash: string): UserSessionRecord | undefined {
    const session = this.data.sessions.find(s => s.sessionTokenHash === tokenHash);
    if (!session) return undefined;
    if (session.revokedAt) return undefined;
    if (new Date(session.expiresAt) < new Date()) return undefined;
    return session;
  }

  public revokeSession(tokenHash: string): void {
    const session = this.data.sessions.find(s => s.sessionTokenHash === tokenHash);
    if (session) {
      session.revokedAt = new Date().toISOString();
      this.persistSync();
    }
  }

  public deleteSession(tokenHash: string): void {
    this.revokeSession(tokenHash);
  }

  public getUserSessions(userId: string): UserSessionRecord[] {
    return this.data.sessions.filter(
      s => s.userId === userId && !s.revokedAt && new Date(s.expiresAt) > new Date()
    );
  }

  // ACCOUNTS
  public findAccountByUserId(userId: string): AccountRecord | undefined {
    return this.data.accounts.find(a => a.userId === userId);
  }

  public findAccountById(id: string): AccountRecord | undefined {
    return this.data.accounts.find(a => a.id === id);
  }

  public createAccount(userId: string): AccountRecord {
    const existing = this.findAccountByUserId(userId);
    if (existing) return existing;

    const record: AccountRecord = {
      id: `acc_${crypto.randomBytes(12).toString('hex')}`,
      userId,
      accountNumber: `ACC-${Math.floor(100000 + Math.random() * 900000)}`,
      state: 'REGISTERED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.accounts.push(record);
    this.persistSync();
    return record;
  }

  public updateAccountState(accountId: string, state: AccountRecord['state']): AccountRecord {
    const account = this.findAccountById(accountId);
    if (!account) throw new Error(`Account ${accountId} not found`);

    account.state = state;
    account.updatedAt = new Date().toISOString();
    this.persistSync();
    return account;
  }

  // PROFILES
  public findProfileByAccountId(accountId: string): ProfileRecord | undefined {
    return this.data.profiles.find(p => p.accountId === accountId);
  }

  public getAllProfiles(): ProfileRecord[] {
    return [...this.data.profiles];
  }

  public upsertProfile(profile: Omit<ProfileRecord, 'id' | 'createdAt' | 'updatedAt'>): ProfileRecord {
    let existing = this.findProfileByAccountId(profile.accountId);

    if (existing) {
      Object.assign(existing, profile, { updatedAt: new Date().toISOString() });
      this.persistSync();
      return existing;
    }

    const record: ProfileRecord = {
      ...profile,
      id: `prf_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.profiles.push(record);
    this.persistSync();
    return record;
  }

  // VERIFICATION REQUESTS & DOCUMENTS
  public findVerificationRequestByAccountId(accountId: string): VerificationRequestRecord | undefined {
    return this.data.verificationRequests.find(v => v.accountId === accountId);
  }

  public findVerificationRequestById(id: string): VerificationRequestRecord | undefined {
    return this.data.verificationRequests.find(v => v.id === id);
  }

  public getPendingVerificationQueue(): (VerificationRequestRecord & {
    account: AccountRecord;
    profile: ProfileRecord | null;
    documents: VerificationDocumentRecord[];
  })[] {
    return this.data.verificationRequests
      .filter(v => v.status === 'SUBMITTED' || v.status === 'UNDER_REVIEW' || v.status === 'PENDING')
      .map(req => {
        const account = this.findAccountById(req.accountId)!;
        const profile = this.findProfileByAccountId(req.accountId) || null;
        const documents = this.getDocumentsByRequestId(req.id);
        return { ...req, account, profile, documents };
      });
  }

  public createOrUpdateVerificationRequest(
    accountId: string,
    data: Partial<VerificationRequestRecord>
  ): VerificationRequestRecord {
    let req = this.findVerificationRequestByAccountId(accountId);

    if (req) {
      Object.assign(req, data, { updatedAt: new Date().toISOString() });
      this.persistSync();
      return req;
    }

    req = {
      id: `vrf_${crypto.randomBytes(12).toString('hex')}`,
      accountId,
      status: data.status || 'DRAFT',
      assignedOfficerId: data.assignedOfficerId || null,
      duplicateCheckResult: data.duplicateCheckResult || 'NO_MATCH',
      duplicateScore: data.duplicateScore || 0,
      duplicateMatchDetails: data.duplicateMatchDetails || {},
      reviewNotes: data.reviewNotes || null,
      reviewedAt: data.reviewedAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.verificationRequests.push(req);
    this.persistSync();
    return req;
  }

  public addVerificationDocument(
    doc: Omit<VerificationDocumentRecord, 'id' | 'createdAt'>
  ): VerificationDocumentRecord {
    const record: VerificationDocumentRecord = {
      ...doc,
      id: `doc_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };

    this.data.verificationDocuments.push(record);
    this.persistSync();
    return record;
  }

  public getDocumentsByRequestId(requestId: string): VerificationDocumentRecord[] {
    return this.data.verificationDocuments.filter(d => d.verificationRequestId === requestId);
  }

  public getAllVerificationDocuments(): VerificationDocumentRecord[] {
    return [...this.data.verificationDocuments];
  }

  // CLIENT IDS & CARDS
  public findClientIdByAccountId(accountId: string): ClientIdRecord | undefined {
    return this.data.clientIds.find(c => c.accountId === accountId);
  }

  public findClientIdByValue(clientId: string): ClientIdRecord | undefined {
    return this.data.clientIds.find(c => c.clientId === clientId);
  }

  public findClientId(clientId: string): ClientIdRecord | undefined {
    return this.findClientIdByValue(clientId);
  }

  public createClientId(accountId: string, clientId: string, checksum: string): ClientIdRecord {
    const existing = this.findClientIdByAccountId(accountId);
    if (existing) return existing;

    if (this.findClientIdByValue(clientId)) {
      throw new Error(`Collision detected: Client ID ${clientId} already issued`);
    }

    const record: ClientIdRecord = {
      id: `cid_${crypto.randomBytes(12).toString('hex')}`,
      accountId,
      clientId,
      checksum,
      issuedAt: new Date().toISOString(),
      isActive: true,
    };

    this.data.clientIds.push(record);
    this.persistSync();
    return record;
  }

  public findCardByAccountId(accountId: string): CardRecord | undefined {
    return this.data.cards.find(c => c.accountId === accountId && c.status !== 'REPLACED');
  }

  public findActiveCardByAccountId(accountId: string): CardRecord | undefined {
    return this.findCardByAccountId(accountId);
  }

  public findCardById(id: string): CardRecord | undefined {
    return this.data.cards.find(c => c.id === id);
  }

  public createCard(card: Omit<CardRecord, 'id' | 'createdAt' | 'updatedAt'>): CardRecord {
    const record: CardRecord = {
      ...card,
      id: `crd_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.cards.push(record);
    this.persistSync();
    return record;
  }

  public updateCard(id: string, updates: Partial<CardRecord>): CardRecord {
    const card = this.findCardById(id);
    if (!card) throw new Error(`Card ${id} not found`);

    Object.assign(card, updates, { updatedAt: new Date().toISOString() });
    this.persistSync();
    return card;
  }

  // QR TOKENS
  public createQrToken(tokenData: Omit<QrTokenRecord, 'id' | 'createdAt'>): QrTokenRecord {
    const record: QrTokenRecord = {
      ...tokenData,
      id: `qrt_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };

    this.data.qrTokens.push(record);
    this.persistSync();
    return record;
  }

  public findQrTokenByRaw(tokenRaw: string): QrTokenRecord | undefined {
    return this.data.qrTokens.find(t => t.tokenRaw === tokenRaw && !t.isRevoked);
  }

  public findActiveQrTokenByCardId(cardId: string): QrTokenRecord | undefined {
    return this.data.qrTokens.find(t => t.cardId === cardId && !t.isRevoked);
  }

  public revokeQrTokensForCard(cardId: string): void {
    this.data.qrTokens.forEach(t => {
      if (t.cardId === cardId) {
        t.isRevoked = true;
      }
    });
    this.persistSync();
  }

  public incrementQrScanCount(tokenId: string): void {
    const t = this.data.qrTokens.find(x => x.id === tokenId);
    if (t) {
      t.scanCount++;
      t.lastScannedAt = new Date().toISOString();
      this.persistSync();
    }
  }

  // EMERGENCY PROFILES
  public findEmergencyProfileByAccountId(accountId: string): EmergencyProfileRecord | undefined {
    return this.data.emergencyProfiles.find(e => e.accountId === accountId);
  }

  public upsertEmergencyProfile(profile: Omit<EmergencyProfileRecord, 'id' | 'updatedAt'>): EmergencyProfileRecord {
    let existing = this.findEmergencyProfileByAccountId(profile.accountId);

    if (existing) {
      Object.assign(existing, profile, { updatedAt: new Date().toISOString() });
      this.persistSync();
      return existing;
    }

    const record: EmergencyProfileRecord = {
      ...profile,
      id: `emg_${crypto.randomBytes(12).toString('hex')}`,
      updatedAt: new Date().toISOString(),
    };

    this.data.emergencyProfiles.push(record);
    this.persistSync();
    return record;
  }

  // AUDIT LOGS
  public logAudit(log: Omit<AuditLogRecord, 'id' | 'createdAt'>): AuditLogRecord {
    const record: AuditLogRecord = {
      ...log,
      id: `aud_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };

    this.data.auditLogs.push(record);
    this.persistSync();

    prisma.auditLog.create({
      data: {
        id: record.id,
        actorId: record.actorId || null,
        actorRole: record.actorRole || 'SYSTEM',
        action: record.action,
        targetResource: record.targetResource,
        targetId: record.targetId || null,
        ipAddress: record.ipAddress || null,
        userAgent: record.userAgent || null,
        metadata: record.metadata ? JSON.stringify(record.metadata) : undefined,
      },
    }).catch(err => console.warn('[POSTGRES_AUDIT_WRITE_NOTICE]', err.message));

    return record;
  }

  public getAuditLogsByActor(actorId: string): AuditLogRecord[] {
    return this.data.auditLogs.filter(a => a.actorId === actorId);
  }

  public getAuditLogsByTarget(targetResource: string, targetId: string): AuditLogRecord[] {
    return this.data.auditLogs.filter(a => a.targetResource === targetResource && a.targetId === targetId);
  }

  // PROVIDERS
  public listProviders(filters?: {
    category?: string;
    query?: string;
    city?: string;
    status?: string;
    emergency24x7?: boolean;
    speciality?: string;
    partnerTier?: string;
    minRating?: number;
  }): ProviderRecord[] {
    return this.data.providers.filter(p => {
      if (filters?.status && p.status !== filters.status) return false;
      if (filters?.category && filters.category !== 'ALL' && p.category !== filters.category) return false;
      if (filters?.city && !p.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters?.emergency24x7 !== undefined && filters.emergency24x7 && !p.emergency24x7) return false;
      if (filters?.partnerTier && p.partnerTier !== filters.partnerTier) return false;
      if (filters?.minRating && (!p.rating || p.rating < filters.minRating)) return false;
      if (filters?.speciality) {
        const spec = filters.speciality.toLowerCase();
        if (!p.specialities || !p.specialities.some(s => s.toLowerCase().includes(spec))) return false;
      }
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const matches = p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.services.some(s => s.toLowerCase().includes(q)) ||
          (p.specialities && p.specialities.some(s => s.toLowerCase().includes(q)));
        if (!matches) return false;
      }
      return true;
    });
  }

  public getProviderById(id: string): ProviderRecord | undefined {
    return this.data.providers.find(p => p.id === id);
  }

  public findProviderByRegistration(regNo: string): ProviderRecord | undefined {
    return this.data.providers.find(p => p.registrationNumber.trim().toLowerCase() === regNo.trim().toLowerCase());
  }

  public createProvider(data: Omit<ProviderRecord, 'id' | 'createdAt' | 'updatedAt'>): ProviderRecord {
    const record: ProviderRecord = {
      ...data,
      id: `PRV-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.providers.push(record);
    this.persistSync();
    return record;
  }

  public updateProviderStatus(id: string, status: ProviderStatus, officerId: string): ProviderRecord | null {
    const p = this.data.providers.find(x => x.id === id);
    if (!p) return null;
    p.status = status;
    p.verifiedByOfficerId = officerId;
    if (status === 'VERIFIED') {
      p.verifiedAt = new Date().toISOString();
    }
    p.updatedAt = new Date().toISOString();
    this.persistSync();
    return p;
  }

  // MEDICAL RECORDS
  public createMedicalRecord(recordData: Omit<MedicalRecord, 'id' | 'createdAt'>): MedicalRecord {
    const record: MedicalRecord = {
      ...recordData,
      id: `med_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.medicalRecords.push(record);
    this.persistSync();
    return record;
  }

  public getMedicalRecordsByAccountId(accountId: string): MedicalRecord[] {
    return this.data.medicalRecords
      .filter(m => m.accountId === accountId)
      .sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
  }

  public getMedicalRecordById(id: string): MedicalRecord | undefined {
    return this.data.medicalRecords.find(m => m.id === id);
  }

  // CONSENT ENGINE
  public createConsentRequest(data: Omit<ConsentRecord, 'id' | 'createdAt' | 'grantedAt' | 'expiresAt' | 'revokedAt'>): ConsentRecord {
    const record: ConsentRecord = {
      ...data,
      id: `cst_${crypto.randomBytes(12).toString('hex')}`,
      grantedAt: null,
      expiresAt: null,
      revokedAt: null,
      createdAt: new Date().toISOString(),
    };
    this.data.consents.push(record);
    this.persistSync();
    return record;
  }

  public getConsentsForAccount(accountId: string): ConsentRecord[] {
    return this.data.consents
      .filter(c => c.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getConsentsForProvider(providerId: string): ConsentRecord[] {
    return this.data.consents
      .filter(c => c.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getConsentById(id: string): ConsentRecord | undefined {
    return this.data.consents.find(c => c.id === id);
  }

  public respondToConsent(id: string, status: ConsentStatus, durationHours: number = 24): ConsentRecord | null {
    const c = this.data.consents.find(x => x.id === id);
    if (!c) return null;
    c.status = status;
    if (status === 'GRANTED') {
      const now = new Date();
      c.grantedAt = now.toISOString();
      const exp = new Date(now.getTime() + durationHours * 3600 * 1000);
      c.expiresAt = exp.toISOString();
    }
    this.persistSync();
    return c;
  }

  public revokeConsent(id: string): ConsentRecord | null {
    const c = this.data.consents.find(x => x.id === id);
    if (!c) return null;
    c.status = 'REVOKED';
    c.revokedAt = new Date().toISOString();
    this.persistSync();
    return c;
  }

  public hasActiveConsent(accountId: string, providerId: string): boolean {
    const now = new Date();
    return this.data.consents.some(c => {
      if (c.accountId !== accountId || c.providerId !== providerId) return false;
      if (c.status !== 'GRANTED') return false;
      if (c.revokedAt) return false;
      if (!c.expiresAt || new Date(c.expiresAt) < now) return false;
      return true;
    });
  }

  // PAYMENT ORDERS
  public createPaymentOrder(data: Omit<PaymentOrderRecord, 'id' | 'createdAt' | 'paidAt'>): PaymentOrderRecord {
    const record: PaymentOrderRecord = {
      ...data,
      id: `ord_${crypto.randomBytes(12).toString('hex')}`,
      paidAt: null,
      createdAt: new Date().toISOString(),
    };
    this.data.paymentOrders.push(record);
    this.persistSync();
    return record;
  }

  public getPaymentOrderById(id: string): PaymentOrderRecord | undefined {
    return this.data.paymentOrders.find(o => o.id === id);
  }

  public getPaymentOrdersByAccountId(accountId: string): PaymentOrderRecord[] {
    return this.data.paymentOrders
      .filter(o => o.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public listPaymentOrders(): PaymentOrderRecord[] {
    return [...this.data.paymentOrders];
  }

  public findPaymentOrderByGatewayOrderId(gatewayOrderId: string): PaymentOrderRecord | undefined {
    return this.data.paymentOrders.find(o => o.gatewayOrderId === gatewayOrderId);
  }

  public updatePaymentOrderStatus(id: string, status: PaymentOrderStatus, gatewayPaymentId?: string): PaymentOrderRecord | null {
    const o = this.data.paymentOrders.find(x => x.id === id);
    if (!o) return null;
    o.status = status;
    if (status === 'PAID') {
      o.paidAt = new Date().toISOString();
      if (gatewayPaymentId) o.gatewayPaymentId = gatewayPaymentId;
    }
    this.persistSync();
    return o;
  }

  // CORPORATE ORGANIZATIONS
  public createOrganization(data: Omit<OrganizationRecord, 'id' | 'createdAt'>): OrganizationRecord {
    const record: OrganizationRecord = {
      ...data,
      id: `org_${crypto.randomBytes(10).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.organizations.push(record);
    this.persistSync();
    return record;
  }

  public getOrganizationById(id: string): OrganizationRecord | undefined {
    return this.data.organizations.find(o => o.id === id);
  }

  public listOrganizations(): OrganizationRecord[] {
    return [...this.data.organizations];
  }

  public addCorporateSponsorship(data: Omit<CorporateSponsorshipRecord, 'id' | 'sponsoredAt'>): CorporateSponsorshipRecord {
    const record: CorporateSponsorshipRecord = {
      ...data,
      id: `spons_${crypto.randomBytes(10).toString('hex')}`,
      sponsoredAt: new Date().toISOString(),
    };
    this.data.corporateSponsorships.push(record);
    this.persistSync();
    return record;
  }

  public getCorporateSponsorshipsByOrg(orgId: string): CorporateSponsorshipRecord[] {
    return this.data.corporateSponsorships.filter(s => s.orgId === orgId);
  }

  public getCorporateSponsorshipByAccount(accountId: string): CorporateSponsorshipRecord | undefined {
    return this.data.corporateSponsorships.find(s => s.accountId === accountId && s.status === 'ACTIVE');
  }

  // APPOINTMENTS
  public createAppointment(data: Omit<AppointmentRecord, 'id' | 'bookedAt' | 'updatedAt'>): AppointmentRecord {
    // Prevent double booking on same provider, doctor, date, and slot
    const conflict = this.checkSlotConflict(data.providerId, data.doctorId, data.appointmentDate, data.timeSlot);
    if (conflict) {
      throw new Error(`Double-booking conflict: Doctor is already booked on ${data.appointmentDate} at ${data.timeSlot}`);
    }

    const record: AppointmentRecord = {
      ...data,
      id: `apt_${crypto.randomBytes(10).toString('hex')}`,
      bookedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.appointments.push(record);
    this.persistSync();
    return record;
  }

  public checkSlotConflict(providerId: string, doctorId: string, appointmentDate: string, timeSlot: string): boolean {
    return this.data.appointments.some(
      a =>
        a.providerId === providerId &&
        a.doctorId === doctorId &&
        a.appointmentDate === appointmentDate &&
        a.timeSlot === timeSlot &&
        !['CANCELLED', 'NO_SHOW'].includes(a.status)
    );
  }

  public getAppointmentsForAccount(accountId: string): AppointmentRecord[] {
    return this.data.appointments
      .filter(a => a.accountId === accountId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  }

  public getAppointmentsForProvider(providerId: string): AppointmentRecord[] {
    return this.data.appointments
      .filter(a => a.providerId === providerId)
      .sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
  }

  public getAppointmentById(id: string): AppointmentRecord | undefined {
    return this.data.appointments.find(a => a.id === id);
  }

  public updateAppointmentStatus(id: string, status: AppointmentStatus, notes?: string): AppointmentRecord | null {
    const a = this.data.appointments.find(x => x.id === id);
    if (!a) return null;
    a.status = status;
    if (notes) a.notes = notes;
    a.updatedAt = new Date().toISOString();
    this.persistSync();
    return a;
  }

  // FAMILY & GUARDIAN
  public addFamilyMember(data: Omit<FamilyMemberRecord, 'id' | 'createdAt'>): FamilyMemberRecord {
    const record: FamilyMemberRecord = {
      ...data,
      id: `fam_${crypto.randomBytes(10).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.familyMembers.push(record);
    this.persistSync();
    return record;
  }

  public getFamilyMembers(primaryAccountId: string): FamilyMemberRecord[] {
    return this.data.familyMembers.filter(f => f.primaryAccountId === primaryAccountId && f.status === 'ACTIVE');
  }

  public updateFamilyPermissions(id: string, permissionLevel: FamilyPermissionLevel): FamilyMemberRecord | null {
    const f = this.data.familyMembers.find(x => x.id === id);
    if (!f) return null;
    f.permissionLevel = permissionLevel;
    this.persistSync();
    return f;
  }

  public revokeFamilyMember(id: string): FamilyMemberRecord | null {
    const f = this.data.familyMembers.find(x => x.id === id);
    if (!f) return null;
    f.status = 'REVOKED';
    this.persistSync();
    return f;
  }

  public canAccessFamilyRecords(requesterAccountId: string, targetAccountId: string, requiredPermission: FamilyPermissionLevel): boolean {
    if (requesterAccountId === targetAccountId) return true;
    const link = this.data.familyMembers.find(
      f => f.primaryAccountId === requesterAccountId && f.memberAccountId === targetAccountId && f.status === 'ACTIVE'
    );
    if (!link) return false;
    if (link.permissionLevel === 'FULL_ACCESS') return true;
    if (link.permissionLevel === requiredPermission) return true;
    if (requiredPermission === 'EMERGENCY_ONLY') return true; // Anyone with any family link can access emergency
    return false;
  }

  // MEDICAL DOCUMENT VAULT
  public uploadVaultDocument(data: Omit<MedicalDocumentVaultRecord, 'id' | 'createdAt'>): MedicalDocumentVaultRecord {
    const record: MedicalDocumentVaultRecord = {
      ...data,
      id: `vlt_${crypto.randomBytes(12).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.vaultDocuments.push(record);
    this.persistSync();
    return record;
  }

  public getVaultDocuments(accountId: string): MedicalDocumentVaultRecord[] {
    return this.data.vaultDocuments
      .filter(v => v.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getVaultDocumentById(id: string): MedicalDocumentVaultRecord | undefined {
    return this.data.vaultDocuments.find(v => v.id === id);
  }

  public deleteVaultDocument(id: string): boolean {
    const idx = this.data.vaultDocuments.findIndex(v => v.id === id);
    if (idx === -1) return false;
    this.data.vaultDocuments.splice(idx, 1);
    this.persistSync();
    return true;
  }

  // MEDICATION SCHEDULES
  public createMedicationSchedule(data: Omit<MedicationScheduleRecord, 'id'>): MedicationScheduleRecord {
    const record: MedicationScheduleRecord = {
      ...data,
      id: `sch_${crypto.randomBytes(10).toString('hex')}`,
    };
    this.data.medicationSchedules.push(record);
    this.persistSync();
    return record;
  }

  public getMedicationSchedules(accountId: string): MedicationScheduleRecord[] {
    return this.data.medicationSchedules.filter(s => s.accountId === accountId);
  }

  public logMedicationAdherence(scheduleId: string, date: string, taken: boolean): MedicationScheduleRecord | null {
    const s = this.data.medicationSchedules.find(x => x.id === scheduleId);
    if (!s) return null;
    s.adherenceLog.push({ date, taken, loggedAt: new Date().toISOString() });
    this.persistSync();
    return s;
  }

  // LAB ORDERS
  public createLabOrder(data: Omit<LabOrderRecord, 'id' | 'createdAt'>): LabOrderRecord {
    const record: LabOrderRecord = {
      ...data,
      id: `lab_${crypto.randomBytes(10).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.labOrders.push(record);
    this.persistSync();
    return record;
  }

  public getLabOrdersForAccount(accountId: string): LabOrderRecord[] {
    return this.data.labOrders
      .filter(l => l.accountId === accountId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getLabOrdersForProvider(providerId: string): LabOrderRecord[] {
    return this.data.labOrders
      .filter(l => l.providerId === providerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateLabOrderStatus(id: string, status: LabOrderStatus, reportDocumentId?: string, doctorId?: string): LabOrderRecord | null {
    const l = this.data.labOrders.find(x => x.id === id);
    if (!l) return null;
    l.status = status;
    if (reportDocumentId) l.reportDocumentId = reportDocumentId;
    if (doctorId) l.verifiedByDoctorId = doctorId;
    if (status === 'COMPLETED') l.completedAt = new Date().toISOString();
    this.persistSync();
    return l;
  }

  // NOTIFICATIONS
  public createNotification(data: Omit<NotificationRecord, 'id' | 'createdAt' | 'isRead'>): NotificationRecord {
    const record: NotificationRecord = {
      ...data,
      id: `notif_${crypto.randomBytes(10).toString('hex')}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.data.notifications.push(record);
    this.persistSync();
    return record;
  }

  public getNotifications(userId: string): NotificationRecord[] {
    return this.data.notifications
      .filter(n => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public markNotificationRead(id: string): boolean {
    const n = this.data.notifications.find(x => x.id === id);
    if (!n) return false;
    n.isRead = true;
    this.persistSync();
    return true;
  }

  // CARD DELIVERY
  public createCardDelivery(data: Omit<CardDeliveryRecord, 'id'>): CardDeliveryRecord {
    const record: CardDeliveryRecord = {
      ...data,
      id: `del_${crypto.randomBytes(10).toString('hex')}`,
    };
    this.data.cardDeliveries.push(record);
    this.persistSync();
    return record;
  }

  public getCardDeliveryByCardId(cardId: string): CardDeliveryRecord | undefined {
    return this.data.cardDeliveries.find(d => d.cardId === cardId);
  }

  public updateCardDeliveryStage(cardId: string, stage: CardDeliveryStage, location: string, note: string): CardDeliveryRecord | null {
    const d = this.data.cardDeliveries.find(x => x.cardId === cardId);
    if (!d) return null;
    d.currentStage = stage;
    d.history.push({
      stage,
      timestamp: new Date().toISOString(),
      location,
      note,
    });
    this.persistSync();
    return d;
  }

  // BENEFIT RULES & CALCULATION
  public getBenefitRules(planId: string): BenefitRuleRecord[] {
    return this.data.benefitRules.filter(b => b.planId === planId);
  }

  public calculateBenefit(
    planId: string,
    category: 'CONSULTATION' | 'DIAGNOSTICS' | 'PHARMACY' | 'EMERGENCY',
    totalBillPaise: number
  ): {
    discountPercent: number;
    discountAmountPaise: number;
    memberPayablePaise: number;
    coveredAmountPaise: number;
    copayPercent: number;
  } {
    const rule = this.data.benefitRules.find(r => r.planId === planId && r.category === category);
    if (!rule) {
      return {
        discountPercent: 0,
        discountAmountPaise: 0,
        memberPayablePaise: totalBillPaise,
        coveredAmountPaise: 0,
        copayPercent: 100,
      };
    }

    const discountAmountPaise = Math.round((totalBillPaise * rule.discountPercent) / 100);
    const discountedBill = totalBillPaise - discountAmountPaise;
    const coveredAmountPaise = Math.min(discountedBill, rule.maxCoveragePaise);
    const memberPayablePaise = discountedBill - coveredAmountPaise + Math.round((coveredAmountPaise * rule.copayPercent) / 100);

    return {
      discountPercent: rule.discountPercent,
      discountAmountPaise,
      memberPayablePaise,
      coveredAmountPaise,
      copayPercent: rule.copayPercent,
    };
  }

  // CLAIMS
  public createClaim(data: Omit<ClaimRecord, 'id' | 'createdAt' | 'updatedAt' | 'approvedAmountPaise'>): ClaimRecord {
    // Check for duplicate claim number from same provider
    const existing = this.data.claims.find(c => c.providerId === data.providerId && c.claimNumber === data.claimNumber);
    if (existing) {
      throw new Error(`Duplicate claim: Claim number ${data.claimNumber} already exists for this provider`);
    }

    const record: ClaimRecord = {
      ...data,
      id: `clm_${crypto.randomBytes(10).toString('hex')}`,
      approvedAmountPaise: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.claims.push(record);
    this.persistSync();
    return record;
  }

  public getClaimsForProvider(providerId: string): ClaimRecord[] {
    return this.data.claims.filter(c => c.providerId === providerId);
  }

  public getClaimsForAccount(accountId: string): ClaimRecord[] {
    return this.data.claims.filter(c => c.accountId === accountId);
  }

  public adjudicateClaim(
    id: string,
    decision: 'APPROVED' | 'REJECTED' | 'SETTLED',
    approvedAmountPaise: number = 0,
    notes?: string
  ): ClaimRecord | null {
    const c = this.data.claims.find(x => x.id === id);
    if (!c) return null;
    c.status = decision;
    if (decision === 'APPROVED' || decision === 'SETTLED') {
      c.approvedAmountPaise = approvedAmountPaise;
    }
    if (notes) c.notes = notes;
    c.updatedAt = new Date().toISOString();
    this.persistSync();
    return c;
  }

  // FRAUD ALERTS
  public createFraudAlert(data: Omit<FraudAlertRecord, 'id' | 'createdAt'>): FraudAlertRecord {
    const record: FraudAlertRecord = {
      ...data,
      id: `frd_${crypto.randomBytes(10).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.fraudAlerts.push(record);
    this.persistSync();
    return record;
  }

  public listFraudAlerts(): FraudAlertRecord[] {
    return [...this.data.fraudAlerts];
  }

  // DEVELOPER API KEYS
  public createApiKey(data: Omit<DeveloperApiKeyRecord, 'id' | 'createdAt'>): DeveloperApiKeyRecord {
    const record: DeveloperApiKeyRecord = {
      ...data,
      id: `key_${crypto.randomBytes(10).toString('hex')}`,
      createdAt: new Date().toISOString(),
    };
    this.data.apiKeys.push(record);
    this.persistSync();
    return record;
  }

  public validateApiKey(apiKey: string, requiredScope: string): DeveloperApiKeyRecord | null {
    const hash = crypto.createHash('sha256').update(apiKey).digest('hex');
    const key = this.data.apiKeys.find(k => k.keyHash === hash && k.status === 'ACTIVE');
    if (!key) return null;
    if (!key.scopes.includes(requiredScope) && !key.scopes.includes('*')) return null;
    return key;
  }
}

// Singleton Export
export const db = new PersistentDataStore();
