/**
 * AHCS Healthcare Interoperability Layer
 * Transforms internal AHCS database entities into standard HL7/FHIR R4 JSON resources.
 */

import { ProfileRecord, ClientIdRecord, MedicalRecord, ProviderRecord, ConsentRecord } from '@/lib/db/types';

export interface FhirPatient {
  resourceType: 'Patient';
  id: string;
  identifier: Array<{
    system: string;
    value: string;
    use: 'official';
  }>;
  active: boolean;
  name: Array<{
    use: 'official';
    text: string;
  }>;
  gender: string;
  birthDate: string;
  telecom: Array<{
    system: string;
    value: string;
    use: 'mobile' | 'emergency';
  }>;
}

export interface FhirOrganization {
  resourceType: 'Organization';
  id: string;
  identifier: Array<{
    system: string;
    value: string;
  }>;
  active: boolean;
  name: string;
  type: Array<{
    text: string;
  }>;
  telecom: Array<{
    system: string;
    value: string;
  }>;
}

export interface FhirEncounter {
  resourceType: 'Encounter';
  id: string;
  status: 'finished';
  class: {
    system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode';
    code: 'AMB';
    display: 'ambulatory';
  };
  subject: {
    reference: string;
    display: string;
  };
  serviceProvider: {
    reference: string;
    display: string;
  };
  period: {
    start: string;
  };
}

export interface FhirConsent {
  resourceType: 'Consent';
  id: string;
  status: 'active' | 'rejected' | 'inactive';
  scope: {
    coding: Array<{
      system: 'http://terminology.hl7.org/CodeSystem/consentscope';
      code: 'patient-privacy';
    }>;
  };
  patient: {
    reference: string;
  };
  dateTime: string;
}

export function transformToFhirPatient(profile: ProfileRecord, clientId: ClientIdRecord): FhirPatient {
  return {
    resourceType: 'Patient',
    id: clientId.clientId,
    identifier: [
      {
        system: 'https://ahcs.in/identifiers/client-id',
        value: clientId.clientId,
        use: 'official',
      },
    ],
    active: clientId.isActive,
    name: [
      {
        use: 'official',
        text: profile.fullName,
      },
    ],
    gender: profile.gender.toLowerCase(),
    birthDate: profile.dateOfBirth.split('T')[0],
    telecom: [
      {
        system: 'phone',
        value: profile.emergencyContactPhone,
        use: 'emergency',
      },
    ],
  };
}

export function transformToFhirOrganization(provider: ProviderRecord): FhirOrganization {
  return {
    resourceType: 'Organization',
    id: provider.id,
    identifier: [
      {
        system: 'https://ahcs.in/providers/registration',
        value: provider.registrationNumber,
      },
    ],
    active: provider.status === 'VERIFIED',
    name: provider.name,
    type: [{ text: provider.category }],
    telecom: [
      { system: 'phone', value: provider.phone },
      { system: 'email', value: provider.email },
    ],
  };
}

export function transformToFhirEncounter(record: MedicalRecord, clientId: string): FhirEncounter {
  return {
    resourceType: 'Encounter',
    id: record.id,
    status: 'finished',
    class: {
      system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
      code: 'AMB',
      display: 'ambulatory',
    },
    subject: {
      reference: `Patient/${clientId}`,
      display: 'AHCS Cardholder',
    },
    serviceProvider: {
      reference: `Organization/${record.authorProviderId}`,
      display: record.authorProviderName,
    },
    period: {
      start: record.recordDate || record.createdAt,
    },
  };
}

export function transformToFhirConsent(consent: ConsentRecord, clientId: string): FhirConsent {
  return {
    resourceType: 'Consent',
    id: consent.id,
    status: consent.status === 'GRANTED' ? 'active' : 'inactive',
    scope: {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/consentscope',
          code: 'patient-privacy',
        },
      ],
    },
    patient: {
      reference: `Patient/${clientId}`,
    },
    dateTime: consent.grantedAt || consent.createdAt,
  };
}
