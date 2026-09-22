export type Role = 
  | 'PATIENT' 
  | 'VERIFICATION_OFFICER' 
  | 'DOCTOR' 
  | 'PROVIDER_ADMIN' 
  | 'ADMIN' 
  | 'SUPER_ADMIN';

export type UserStatus = 
  | 'PENDING_VERIFICATION' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'LOCKED';

export type AuthProvider = 
  | 'MOBILE_OTP' 
  | 'GOOGLE' 
  | 'HYBRID';

export type AccountState = 
  | 'REGISTERED' 
  | 'PROFILE_COMPLETED' 
  | 'VERIFICATION_PENDING' 
  | 'UNDER_REVIEW'
  | 'CORRECTION_REQUIRED'
  | 'APPROVED_FOR_ID_GENERATION' 
  | 'CLIENT_ID_ACTIVE' 
  | 'SUSPENDED';

export type Gender = 
  | 'MALE' 
  | 'FEMALE' 
  | 'NON_BINARY' 
  | 'OTHER' 
  | 'PREFER_NOT_TO_SAY';

export type BloodGroup = 
  | 'A_POS' 
  | 'A_NEG' 
  | 'B_POS' 
  | 'B_NEG' 
  | 'AB_POS' 
  | 'AB_NEG' 
  | 'O_POS' 
  | 'O_NEG' 
  | 'UNKNOWN';

export type BloodGroupSource = 
  | 'USER_DECLARED' 
  | 'DOCUMENT_VERIFIED' 
  | 'LAB_VERIFIED' 
  | 'PROVIDER_VERIFIED' 
  | 'UNKNOWN';

export type VerificationStatus = 
  | 'DRAFT' 
  | 'SUBMITTED' 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'EXPIRED' 
  | 'RE_VERIFICATION_REQUIRED';

export type DuplicateCheckResult = 
  | 'NO_MATCH' 
  | 'POSSIBLE_DUPLICATE' 
  | 'CONFIRMED_DUPLICATE';

export type DocumentType = 
  | 'AADHAAR' 
  | 'PASSPORT' 
  | 'DRIVING_LICENSE' 
  | 'VOTER_ID' 
  | 'PAN' 
  | 'OTHER_OFFICIAL';

export type DocumentStatus = 
  | 'PENDING' 
  | 'VERIFIED' 
  | 'REJECTED' 
  | 'RE_UPLOAD_REQUIRED';

export type CardStatus = 
  | 'GENERATED' 
  | 'PENDING_ACTIVATION' 
  | 'ACTIVE' 
  | 'SUSPENDED' 
  | 'LOST' 
  | 'STOLEN' 
  | 'EXPIRED' 
  | 'REVOKED' 
  | 'REPLACEMENT_REQUESTED' 
  | 'REPLACED';

export interface UserRecord {
  id: string;
  mobileNumber: string;
  mobileVerifiedAt: string | null;
  email: string | null;
  emailVerifiedAt: string | null;
  role: Role;
  status: UserStatus;
  authProvider: AuthProvider;
  googleSub: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserSessionRecord {
  id: string;
  userId: string;
  sessionTokenHash: string;
  ipAddress: string | null;
  userAgent: string | null;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
}

export interface AccountRecord {
  id: string;
  userId: string;
  accountNumber: string;
  state: AccountState;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileRecord {
  id: string;
  accountId: string;
  fullName: string;
  dateOfBirth: string;
  gender: Gender;
  bloodGroup: BloodGroup;
  bloodGroupSource: BloodGroupSource;
  addressLine1: string;
  addressLine2?: string;
  district: string;
  stateProvince: string;
  pinCode: string;
  countryCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationRequestRecord {
  id: string;
  accountId: string;
  status: VerificationStatus;
  assignedOfficerId: string | null;
  duplicateCheckResult: DuplicateCheckResult;
  duplicateScore: number;
  duplicateMatchDetails: any;
  reviewNotes: string | null;
  reviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationDocumentRecord {
  id: string;
  verificationRequestId: string;
  documentType: DocumentType;
  documentNumberHash: string;
  documentNumberMasked: string;
  s3ObjectKey: string;
  fileMimeType: string;
  fileSizeBytes: number;
  status: DocumentStatus;
  verificationNotes: string | null;
  verifiedBy: string | null;
  verifiedAt: string | null;
  createdAt: string;
}

export interface ClientIdRecord {
  id: string;
  accountId: string;
  clientId: string;
  checksum: string;
  issuedAt: string;
  isActive: boolean;
}

export interface CardRecord {
  id: string;
  clientIdFk: string;
  accountId: string;
  cardNumber: string;
  version: number;
  status: CardStatus;
  activationCodeHash: string;
  activatedAt: string | null;
  activatedByUserId: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface QrTokenRecord {
  id: string;
  cardId: string;
  tokenHash: string; // Stored as SHA-256 hash for security
  tokenRaw: string; // Ephemeral token for lookups
  tokenType: 'EMERGENCY_QR' | 'PORTAL_ACCESS_NFC';
  isRevoked: boolean;
  scanCount: number;
  lastScannedAt: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface EmergencyProfileRecord {
  id: string;
  accountId: string;
  isActive: boolean;
  allergies: string[];
  criticalConditions: string[];
  currentMedications: string[];
  organDonor: boolean;
  preferredHospital: string | null;
  updatedAt: string;
}

export interface AuditLogRecord {
  id: string;
  actorId: string | null;
  actorRole: string;
  action: string;
  targetResource: string;
  targetId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: any;
  createdAt: string;
}

export type ProviderCategory = 'HOSPITAL' | 'CLINIC' | 'LAB' | 'PHARMACY' | 'DOCTOR';
export type ProviderStatus = 'PENDING_VERIFICATION' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';

export interface ProviderRecord {
  id: string;
  name: string;
  category: ProviderCategory;
  registrationNumber: string;
  medicalCouncil: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  phone: string;
  email: string;
  services: string[];
  partnerTier: 'STANDARD' | 'PREMIUM_NETWORK';
  operatingHours: string;
  status: ProviderStatus;
  latitude?: number;
  longitude?: number;
  emergency24x7?: boolean;
  specialities?: string[];
  rating?: number;
  verifiedAt: string | null;
  verifiedByOfficerId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MedicalRecordType = 'CONSULTATION' | 'PRESCRIPTION' | 'LAB_REPORT' | 'DISCHARGE_SUMMARY';

export interface MedicationItem {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface MedicalRecord {
  id: string;
  accountId: string;
  authorProviderId: string;
  authorProviderName: string;
  authorDoctorName: string;
  recordType: MedicalRecordType;
  title: string;
  clinicalDiagnosis: string;
  clinicalNotes: string;
  medications: MedicationItem[];
  labObservations?: string;
  recordDate: string;
  createdAt: string;
}

export type ConsentPurpose = 'GENERAL_CONSULTATION' | 'DIAGNOSIS' | 'SECOND_OPINION' | 'EMERGENCY_REVIEW';
export type ConsentScope = 'ALL_RECORDS' | 'PRESCRIPTIONS_ONLY' | 'LABS_ONLY';
export type ConsentStatus = 'REQUESTED' | 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'REJECTED';

export interface ConsentRecord {
  id: string;
  accountId: string;
  providerId: string;
  providerName: string;
  doctorName: string;
  purpose: ConsentPurpose;
  scope: ConsentScope;
  status: ConsentStatus;
  requestedAt: string;
  grantedAt: string | null;
  expiresAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export type PaymentOrderStatus = 'CREATED' | 'PAID' | 'FAILED';
export type PaymentGateway = 'RAZORPAY' | 'STRIPE' | 'DIRECT';

export interface PaymentOrderRecord {
  id: string;
  accountId: string;
  planId: string;
  planName: string;
  amountPaise: number;
  currency: string;
  status: PaymentOrderStatus;
  gateway: PaymentGateway;
  gatewayOrderId: string;
  gatewayPaymentId: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface OrganizationRecord {
  id: string;
  orgName: string;
  registrationNumber: string;
  contactEmail: string;
  contactPhone: string;
  domain: string;
  activePlan: string;
  createdAt: string;
}

export interface CorporateSponsorshipRecord {
  id: string;
  orgId: string;
  accountId: string;
  employeeId: string;
  status: 'ACTIVE' | 'REVOKED';
  sponsoredAt: string;
}

// APPOINTMENTS
export type AppointmentStatus = 'REQUESTED' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface AppointmentRecord {
  id: string;
  accountId: string;
  providerId: string;
  providerName: string;
  doctorId: string;
  doctorName: string;
  appointmentDate: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  bookedAt: string;
  updatedAt: string;
}

// FAMILY & GUARDIAN
export type FamilyRelationship = 'SPOUSE' | 'CHILD' | 'PARENT' | 'SIBLING' | 'DEPENDENT';
export type FamilyPermissionLevel = 'EMERGENCY_ONLY' | 'MEDICAL_RECORD' | 'PRESCRIPTION' | 'FULL_ACCESS';

export interface FamilyMemberRecord {
  id: string;
  primaryAccountId: string;
  memberAccountId: string;
  memberName: string;
  memberClientId: string;
  relationship: FamilyRelationship;
  permissionLevel: FamilyPermissionLevel;
  isGuardian: boolean;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}

// MEDICAL DOCUMENT VAULT
export type VaultDocumentType = 'LAB_REPORT' | 'PRESCRIPTION' | 'DISCHARGE_SUMMARY' | 'IMAGING_REPORT' | 'VACCINATION' | 'OTHER';

export interface MedicalDocumentVaultRecord {
  id: string;
  accountId: string;
  documentType: VaultDocumentType;
  title: string;
  documentKey: string;
  fileMimeType: string;
  fileSizeBytes: number;
  documentHash: string;
  uploadedByUserId: string;
  createdAt: string;
}

// MEDICATION SCHEDULE & ADHERENCE
export interface MedicationScheduleRecord {
  id: string;
  accountId: string;
  prescriptionId?: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DISCONTINUED';
  adherenceLog: { date: string; taken: boolean; loggedAt: string }[];
}

// DIAGNOSTIC LAB ORDERS
export type LabOrderStatus = 'ORDERED' | 'SAMPLE_COLLECTED' | 'PROCESSING' | 'COMPLETED';

export interface LabOrderRecord {
  id: string;
  accountId: string;
  patientClientId?: string;
  providerId: string;
  providerName: string;
  orderNumber: string;
  testName: string;
  status: LabOrderStatus;
  reportDocumentId?: string;
  verifiedByDoctorId?: string;
  createdAt: string;
  completedAt?: string;
}

// NOTIFICATIONS
export type NotificationCategory = 'APPOINTMENT' | 'PRESCRIPTION' | 'LAB' | 'CONSENT' | 'CARD' | 'SECURITY' | 'PAYMENT' | 'SYSTEM';

export interface NotificationRecord {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  channel: 'IN_APP' | 'SMS' | 'EMAIL';
  isRead: boolean;
  createdAt: string;
}

// CARD DELIVERY TRACKING
export type CardDeliveryStage = 'REQUESTED' | 'PRINTING' | 'DISPATCHED' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'ACTIVATED';

export interface CardDeliveryHistoryItem {
  stage: CardDeliveryStage;
  timestamp: string;
  location: string;
  note: string;
}

export interface CardDeliveryRecord {
  id: string;
  cardId: string;
  cardNumber: string;
  trackingNumber: string;
  courierPartner: string;
  currentStage: CardDeliveryStage;
  estimatedDelivery: string;
  history: CardDeliveryHistoryItem[];
}

// BENEFITS & CLAIMS
export interface BenefitRuleRecord {
  id: string;
  planId: string;
  planName: string;
  category: 'CONSULTATION' | 'DIAGNOSTICS' | 'PHARMACY' | 'EMERGENCY';
  discountPercent: number;
  maxCoveragePaise: number;
  copayPercent: number;
}

export type ClaimStatus = 'CLAIM_CREATED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'SETTLED';

export interface ClaimRecord {
  id: string;
  providerId: string;
  providerName: string;
  accountId: string;
  claimNumber: string;
  serviceDate: string;
  serviceType: string;
  totalBillPaise: number;
  claimedAmountPaise: number;
  approvedAmountPaise: number;
  status: ClaimStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// FRAUD & ABUSE ALERTS
export interface FraudAlertRecord {
  id: string;
  targetType: 'QR_SCAN' | 'OTP' | 'ACCOUNT' | 'PAYMENT' | 'PROVIDER';
  targetId: string;
  riskScore: number;
  reasons: string[];
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  createdAt: string;
}

// DEVELOPER API KEYS
export interface DeveloperApiKeyRecord {
  id: string;
  accountId: string;
  keyHash: string;
  keyPrefix: string;
  name: string;
  scopes: string[];
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}


