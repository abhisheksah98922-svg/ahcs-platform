/**
 * AHCS Multi-Language Translation Architecture
 * Supported: English (en), Hindi (hi)
 * Prepared for: Marathi (mr), Bengali (bn), Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml), Gujarati (gu), Punjabi (pa)
 */

export type SupportedLanguage = 'en' | 'hi';

export interface TranslationDictionary {
  common: {
    platformName: string;
    tagline: string;
    verified: string;
    loading: string;
    error: string;
    save: string;
    cancel: string;
    close: string;
    emergencyBanner: string;
    call112: string;
  };
  navigation: {
    home: string;
    directory: string;
    map: string;
    appointments: string;
    dashboard: string;
    security: string;
    logout: string;
  };
  card: {
    healthIdentityCard: string;
    nationalId: string;
    bloodGroup: string;
    emergencyScan: string;
  };
  emergency: {
    breakGlassProtocol: string;
    disclaimer: string;
    triageOnly: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    common: {
      platformName: 'AHCS — Advanced Health Care System',
      tagline: "India's Sovereign Digital Health Identity & Verified Care Network",
      verified: 'Verified',
      loading: 'Loading...',
      error: 'An error occurred',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      emergencyBanner: 'National Emergency Helpline: Dial 112',
      call112: 'Call 112',
    },
    navigation: {
      home: 'Home',
      directory: 'Healthcare Directory',
      map: 'Live Hospital Map',
      appointments: 'Appointments',
      dashboard: 'Patient Dashboard',
      security: 'Security Center',
      logout: 'Sign Out',
    },
    card: {
      healthIdentityCard: 'Health Identity Smart Card',
      nationalId: 'Client ID',
      bloodGroup: 'Blood Group',
      emergencyScan: 'Scan in Emergency',
    },
    emergency: {
      breakGlassProtocol: 'Break-Glass Emergency Protocol',
      disclaimer: '112 is operated by Government of India emergency response services. AHCS provides cryptographic identity verification only.',
      triageOnly: 'Minimal necessary dataset disclosed. Full clinical records are strictly withheld.',
    },
  },
  hi: {
    common: {
      platformName: 'एएचसीएस — एडवांस्ड हेल्थ केयर सिस्टम',
      tagline: 'भारत का संप्रभु डिजिटल स्वास्थ्य पहचान एवं सत्यापित चिकित्सा नेटवर्क',
      verified: 'सत्यापित',
      loading: 'लोड हो रहा है...',
      error: 'त्रुटि हुई',
      save: 'सुरक्षित करें',
      cancel: 'रद्द करें',
      close: 'बंद करें',
      emergencyBanner: 'राष्ट्रीय आपातकालीन हेल्पलाइन: 112 डायल करें',
      call112: '112 पर कॉल करें',
    },
    navigation: {
      home: 'होम',
      directory: 'चिकित्सा निर्देशिका',
      map: 'अस्पताल नक्शा',
      appointments: 'अपॉइंटमेंट्स',
      dashboard: 'मरीज डैशबोर्ड',
      security: 'सुरक्षा केंद्र',
      logout: 'लॉग आउट',
    },
    card: {
      healthIdentityCard: 'स्वास्थ्य पहचान स्मार्ट कार्ड',
      nationalId: 'क्लाइंट आईडी',
      bloodGroup: 'रक्त समूह',
      emergencyScan: 'आपातकाल में स्कैन करें',
    },
    emergency: {
      breakGlassProtocol: 'आपातकालीन ब्रेक-ग्लास प्रोटोकॉल',
      disclaimer: '112 का संचालन भारत सरकार की आपातकालीन सेवाओं द्वारा किया जाता है। एएचसीएस केवल पहचान सत्यापन प्रदान करता है।',
      triageOnly: 'केवल न्यूनतम आवश्यक जीवन रक्षक डेटा दिखाया गया है। संपूर्ण मेडिकल रिकॉर्ड सुरक्षित हैं।',
    },
  },
};

export function getTranslation(lang: SupportedLanguage = 'en'): TranslationDictionary {
  return translations[lang] || translations.en;
}
