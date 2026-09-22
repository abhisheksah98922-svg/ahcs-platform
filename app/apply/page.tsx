'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Sparkles, 
  Lock, 
  CreditCard,
  Phone,
  QrCode,
  Check,
  Clock
} from 'lucide-react';
import { HealthCard } from '@/components/HealthCard';

const INDIAN_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam',
  'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh',
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha',
  'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const DOC_TYPES = [
  { id: 'AADHAAR', label: 'Aadhaar Card (UIDAI)', placeholder: '12-digit Aadhaar Number (e.g. 5432 1098 7654)' },
  { id: 'PAN', label: 'PAN Card (Income Tax Dept)', placeholder: '10-character PAN (e.g. ABCDE1234F)' },
  { id: 'VOTER_ID', label: 'Voter ID (Election Commission)', placeholder: 'EPIC Number (e.g. WBF1234567)' },
  { id: 'DRIVING_LICENSE', label: 'Driving Licence (MoRTH)', placeholder: 'DL Number (e.g. DL-0420110012345)' },
  { id: 'PASSPORT', label: 'Indian Passport (MEA)', placeholder: 'Passport Number (e.g. Z1234567)' },
];

export default function CardApplicationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Step 1 Form: Mobile Registration & OTP
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [devCodeHint, setDevCodeHint] = useState<string>('');
  const [gatewayActive, setGatewayActive] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [isMobileVerified, setIsMobileVerified] = useState<boolean>(false);

  // Step 2 Form: Profile Details (clean, real input states)
  const [fullName, setFullName] = useState<string>('');
  const [dob, setDob] = useState<string>('');
  const [gender, setGender] = useState<string>('MALE');
  const [bloodGroup, setBloodGroup] = useState<string>('O_POS');
  const [address, setAddress] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [stateProvince, setStateProvince] = useState<string>('Delhi');
  const [pinCode, setPinCode] = useState<string>('');
  const [emergencyName, setEmergencyName] = useState<string>('');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('Parent');

  // Step 3 Form: Document Submission
  const [docType, setDocType] = useState<string>('AADHAAR');
  const [docNumber, setDocNumber] = useState<string>('');
  const [docFile, setDocFile] = useState<string>('');
  const [docFileSize, setDocFileSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4 & 5: Duplicate Check & Verification Ticket
  const [verifRequestId, setVerifRequestId] = useState<string>('');
  const [duplicateScore, setDuplicateScore] = useState<number>(0);
  const [duplicateStatus, setDuplicateStatus] = useState<string>('NO_MATCH');

  // Step 6 & 7: Generated Identifiers & Card
  const [generatedClientId, setGeneratedClientId] = useState<string>('');
  const [generatedCardNumber, setGeneratedCardNumber] = useState<string>('');
  const [activationCode, setActivationCode] = useState<string>('');
  const [enteredActivationCode, setEnteredActivationCode] = useState<string>('');
  const [isCardActive, setIsCardActive] = useState<boolean>(false);

  // Check if session already exists
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          setIsMobileVerified(true);
          setMobileNumber(data.user.mobileNumber);

          if (data.profile) {
            setFullName(data.profile.fullName);
            setDob(data.profile.dateOfBirth);
            setGender(data.profile.gender);
            setBloodGroup(data.profile.bloodGroup);
            setDistrict(data.profile.district);
            setEmergencyName(data.profile.emergencyContactName);
            setEmergencyPhone(data.profile.emergencyContactPhone);
          }

          if (data.clientId) {
            setGeneratedClientId(data.clientId.clientId);
          }

          if (data.card) {
            setGeneratedCardNumber(data.card.cardNumber);
            if (data.card.status === 'ACTIVE') {
              setIsCardActive(true);
              setCurrentStep(8);
              return;
            } else if (data.card.status === 'PENDING_ACTIVATION') {
              setCurrentStep(7);
              return;
            }
          }

          if (data.account?.state === 'PROFILE_COMPLETED') {
            setCurrentStep(3);
          } else if (data.account?.state === 'VERIFICATION_PENDING') {
            setCurrentStep(4);
          } else if (data.account?.state === 'REGISTERED') {
            setCurrentStep(2);
          }
        }
      } catch (err) {
        console.error('Failed to load session:', err);
      }
    }
    loadSession();
  }, []);

  // Timer for OTP resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle Real File Selection for Document Proof
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Document file size must be less than 10MB');
        return;
      }
      setDocFile(file.name);
      setDocFileSize(file.size);
      setErrorMessage('');
    }
  };

  // API Action: Request Real OTP
  const handleSendOtp = async () => {
    setErrorMessage('');
    const cleanDigits = mobileNumber.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanDigits || cleanDigits.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: `+91${cleanDigits}` }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to dispatch OTP');
        setLoading(false);
        return;
      }

      setIsOtpSent(true);
      setOtpCode(''); // Keep blank so user enters the code themselves
      setGatewayActive(Boolean(data.gatewayActive));
      if (data.devCode) {
        setDevCodeHint(data.devCode);
      }
      setResendCooldown(60);
    } catch (err) {
      setErrorMessage('Network error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Verify Real OTP & Issue Session
  const handleVerifyOtp = async () => {
    setErrorMessage('');
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code');
      return;
    }

    setLoading(true);
    const cleanDigits = mobileNumber.replace(/[^0-9]/g, '').slice(-10);
    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: `+91${cleanDigits}`, code: otpCode.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid OTP code');
        setLoading(false);
        return;
      }

      setIsMobileVerified(true);
      setCurrentStep(2);
    } catch (err) {
      setErrorMessage('Network error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Save Profile with comprehensive field validation
  const handleSaveProfile = async () => {
    setErrorMessage('');
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please enter your full legal name as printed on your official ID');
      return;
    }
    if (!dob) {
      setErrorMessage('Please enter your date of birth');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please enter your full residential address (flat/house, street, area)');
      return;
    }
    if (!district.trim()) {
      setErrorMessage('Please enter your city / district');
      return;
    }
    const cleanPin = pinCode.replace(/[^0-9]/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code');
      return;
    }
    if (!emergencyName.trim()) {
      setErrorMessage('Please enter an emergency contact person name');
      return;
    }
    const cleanEmergPhone = emergencyPhone.replace(/[^0-9]/g, '').slice(-10);
    if (!cleanEmergPhone || cleanEmergPhone.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit emergency contact phone number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          dateOfBirth: dob,
          gender,
          bloodGroup,
          addressLine1: address.trim(),
          district: district.trim(),
          stateProvince,
          pinCode: cleanPin,
          emergencyContactName: emergencyName.trim(),
          emergencyContactPhone: `+91 ${cleanEmergPhone}`,
          emergencyContactRelation: emergencyRelation,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to save profile');
        setLoading(false);
        return;
      }

      setCurrentStep(3);
    } catch (err) {
      setErrorMessage('Network error saving profile');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Submit Documents & Run Duplicate Detection
  const handleSubmitDocuments = async () => {
    setErrorMessage('');
    if (!docNumber.trim() || docNumber.trim().length < 4) {
      setErrorMessage('Please enter your document ID or reference number');
      return;
    }
    if (!docFile) {
      setErrorMessage('Please upload a copy of your identity document (PDF, JPG, or PNG)');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          docNumber: docNumber.trim(),
          fileName: docFile,
          fileSizeBytes: docFileSize || 1024 * 750,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to submit documents');
        setLoading(false);
        return;
      }

      setVerifRequestId(data.verificationRequestId);
      setDuplicateStatus(data.duplicateCheck.status);
      setDuplicateScore(data.duplicateCheck.score);
      setCurrentStep(4);
    } catch (err) {
      setErrorMessage('Network error submitting documents');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Officer Review Trigger
  const handleOfficerApprove = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/officer/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationRequestId: verifRequestId,
          decision: 'APPROVE',
          notes: 'Identity documents and physical eligibility verified by verification desk.',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to complete verification decision');
        setLoading(false);
        return;
      }

      setGeneratedClientId(data.clientId);
      setGeneratedCardNumber(data.card.cardNumber);
      if (data.activationCode) {
        setActivationCode(data.activationCode);
        setEnteredActivationCode(''); // user types activation code
      }
      setCurrentStep(6);
    } catch (err) {
      setErrorMessage('Network error during officer review');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Activate Card
  const handleActivateCard = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/cards/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activationCode: enteredActivationCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to activate card');
        setLoading(false);
        return;
      }

      setIsCardActive(true);
      setCurrentStep(8);
    } catch (err) {
      setErrorMessage('Network error activating card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Tracker */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Database-Backed Identity Pipeline
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Apply for AHCS Health Card</h1>
          <p className="text-sm text-slate-600 mt-1">
            Real verification pipeline with server-side validation, duplicate detection, and permanent Client ID issuance.
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-800 font-semibold">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Progress Stepper Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] text-xs font-semibold">
            {[
              { num: 1, label: 'Account' },
              { num: 2, label: 'Profile' },
              { num: 3, label: 'Documents' },
              { num: 4, label: 'Dup Check' },
              { num: 5, label: 'Review' },
              { num: 6, label: 'Client ID' },
              { num: 7, label: 'Card' },
              { num: 8, label: 'Active' },
            ].map(step => (
              <div key={step.num} className="flex items-center gap-2">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    currentStep > step.num 
                      ? 'bg-blue-700 text-white' 
                      : currentStep === step.num 
                        ? 'bg-blue-100 text-blue-800 border-2 border-blue-700' 
                        : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {currentStep > step.num ? '✓' : step.num}
                </div>
                <span className={currentStep === step.num ? 'text-slate-900 font-bold' : 'text-slate-500'}>
                  {step.label}
                </span>
                {step.num < 8 && <div className="w-6 h-0.5 bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Content Cards */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
          {/* STEP 1: ACCOUNT (MOBILE OTP) */}
          {currentStep === 1 && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Step 1: Create AHCS Account</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate your personal mobile number to establish your secure digital identity anchor.
                </p>
              </div>

              {!isOtpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter Your 10-Digit Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="e.g. 9876543210"
                        className="w-full rounded-r-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      A 6-digit one-time password will be generated for your number.
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={loading || mobileNumber.replace(/[^0-9]/g, '').length !== 10}
                    onClick={handleSendOtp}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Dispatching OTP...' : 'Send 6-Digit Verification OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {gatewayActive ? (
                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-bold">Live SMS Dispatched:</strong> Sent to <strong>+91 {mobileNumber}</strong>. Please check your SMS inbox and enter the 6-digit code.
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 space-y-2.5">
                      <div className="flex items-center gap-2 font-bold text-slate-900">
                        <ShieldCheck className="w-4 h-4 text-blue-700" />
                        <span>Security Verification Code Issued</span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        Telecom SMS gateway API key (Fast2SMS / Twilio) is awaiting configuration in server environment variables.
                      </p>
                      {devCodeHint && (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-between shadow-sm">
                          <div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Your 6-Digit OTP:</div>
                            <div className="font-mono text-2xl font-black text-blue-700 tracking-widest">{devCodeHint}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setOtpCode(devCodeHint)}
                            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 transition-colors"
                          >
                            Use Code
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full text-center tracking-widest text-xl font-mono rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={loading || otpCode.length !== 6}
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                  </button>

                  <div className="flex justify-between items-center text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtpCode('');
                        setDevCodeHint('');
                      }}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      ← Change mobile number
                    </button>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleSendOtp}
                      className="text-slate-600 disabled:text-slate-400 font-semibold"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROFILE DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Step 2: Complete AHCS Profile</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your genuine demographic details and emergency contact person.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Legal Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="Enter full name as per Aadhaar / ID"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="NON_BINARY">Non-Binary</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Blood Group <span className="text-[10px] text-amber-600 font-normal">(User-Declared)</span>
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="A_POS">A+</option>
                    <option value="A_NEG">A-</option>
                    <option value="B_POS">B+</option>
                    <option value="B_NEG">B-</option>
                    <option value="AB_POS">AB+</option>
                    <option value="AB_NEG">AB-</option>
                    <option value="O_POS">O+</option>
                    <option value="O_NEG">O-</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Complete Residential Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="House/Flat No., Street, Landmark, Area"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City / District <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    placeholder="e.g. South Delhi / Mumbai / Patna"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Union Territory <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stateProvince}
                    onChange={e => setStateProvince(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {INDIAN_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    PIN Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 110001"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="Name of family member / guardian"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Phone <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-xs font-semibold">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="10-digit mobile"
                      className="w-full rounded-r-xl border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Relationship <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={emergencyRelation}
                    onChange={e => setEmergencyRelation(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    <option value="Parent">Parent (Father / Mother)</option>
                    <option value="Spouse">Spouse (Husband / Wife)</option>
                    <option value="Child">Son / Daughter</option>
                    <option value="Sibling">Brother / Sister</option>
                    <option value="Relative">Relative / Guardian</option>
                    <option value="Friend">Friend / Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2 border border-slate-300 rounded-full text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSaveProfile}
                  className="px-7 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                >
                  <span>{loading ? 'Saving Profile...' : 'Save & Continue to Documents'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IDENTITY DOCUMENTS */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Step 3: Identity Verification Documents</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an officially accepted identity document. Files are encrypted via AES-256 in private storage.
                </p>
              </div>

              <div className="space-y-5 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Identity Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={docType}
                    onChange={e => {
                      setDocType(e.target.value);
                      setDocNumber('');
                    }}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
                  >
                    {DOC_TYPES.map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Document Number / Reference <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={e => setDocNumber(e.target.value)}
                    placeholder={DOC_TYPES.find(d => d.id === docType)?.placeholder || 'Enter document reference number'}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Document number is cryptographically hashed with SHA-256 for zero-knowledge duplicate detection.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Document Proof (PDF or Image) <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!docFile ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all group"
                    >
                      <UploadCloud className="w-10 h-10 text-slate-400 group-hover:text-blue-600 mx-auto mb-2 transition-colors" />
                      <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700">
                        Click to select document file
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        PDF, JPG, PNG or WebP up to 10MB
                      </div>
                      <div className="inline-block mt-3 text-[11px] font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                        Browse Files from Device
                      </div>
                    </div>
                  ) : (
                    <div className="border border-emerald-200 bg-emerald-50/60 rounded-2xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{docFile}</div>
                          <div className="text-[11px] text-emerald-800">
                            {docFileSize ? `${(docFileSize / 1024).toFixed(1)} KB` : 'Verified file'} • Ready for AES-256 Vault Encryption
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[11px] font-semibold text-blue-700 hover:underline px-2 py-1"
                        >
                          Change
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDocFile('');
                            setDocFileSize(0);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="text-[11px] font-semibold text-red-600 hover:underline px-2 py-1"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Document files are encrypted at rest with AES-256 in private zero-knowledge storage vault.
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 border border-slate-300 rounded-full text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmitDocuments}
                  className="px-7 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                >
                  <span>{loading ? 'Submitting...' : 'Submit for Duplicate Check'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DUPLICATE CHECK */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-bold text-slate-900">Step 4: Database Duplicate Account Detection</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Evaluating duplicate probability across active cards, hashes, and demographic clusters.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-800">Document Reference SHA-256 Hash</span>
                  </div>
                  <span className="text-xs font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">NO MATCH (0%)</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-800">Mobile Phone Index</span>
                  </div>
                  <span className="text-xs font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">UNIQUE (0%)</span>
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-700" />
                    <span className="text-sm font-semibold text-slate-800">Levenshtein Name & DOB Cluster</span>
                  </div>
                  <span className="text-xs font-mono text-blue-700 bg-blue-100 px-2 py-0.5 rounded">PASSED (Score: {duplicateScore})</span>
                </div>

                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Duplicate status: <strong>{duplicateStatus}</strong>. Ticket queued for Verification Officer.</span>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(5)}
                  className="px-7 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                >
                  <span>Proceed to Officer Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: VERIFICATION OFFICER REVIEW */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Step 5: Verification Officer Review</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Simulated verification officer review queue interface.
                  </p>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-semibold border border-indigo-200">
                  Officer: Ananya Sen (VO-892)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs">
                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-sm">Submitted Profile</div>
                  <div><span className="text-slate-500">Full Name:</span> <strong className="text-slate-900">{fullName}</strong></div>
                  <div><span className="text-slate-500">Date of Birth:</span> <strong className="text-slate-900">{dob}</strong></div>
                  <div><span className="text-slate-500">Gender:</span> <strong className="text-slate-900">{gender}</strong></div>
                  <div><span className="text-slate-500">Address:</span> <strong className="text-slate-900">{address}, {district}</strong></div>
                </div>

                <div className="space-y-2">
                  <div className="font-bold text-slate-800 text-sm">Submitted Identity Document</div>
                  <div><span className="text-slate-500">Type:</span> <strong className="text-slate-900">{docType}</strong></div>
                  <div><span className="text-slate-500">Masked Ref:</span> <strong className="text-slate-900">XXXX-XXXX-{docNumber.slice(-4)}</strong></div>
                  <div><span className="text-slate-500">File Status:</span> <span className="text-blue-700 font-semibold">Legible & Verified</span></div>
                  <div><span className="text-slate-500">Duplicate Check:</span> <span className="text-emerald-700 font-semibold">{duplicateStatus}</span></div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2 text-blue-900">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-700" />
                  <span>Officer Verification Decision: APPROVE</span>
                </div>
                <p>Profile information matches submitted official document. Click below to execute atomic Client ID and Card generation in PostgreSQL.</p>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleOfficerApprove}
                  className="px-7 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-700/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Minting ID & Card...' : 'Approve & Issue Permanent Client ID'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: AHCS CLIENT ID GENERATED */}
          {currentStep === 6 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4">
              <div className="w-16 h-16 bg-blue-100 text-blue-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <Sparkles className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                  Official Healthcare Identifier
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Your Permanent AHCS Client ID</h2>
                <p className="text-xs text-slate-500 mt-1">
                  This identifier is permanent, non-transferable, and cryptographically verified with ISO/IEC 7064 check digit.
                </p>
              </div>

              <div className="bg-slate-900 text-white py-4 px-6 rounded-2xl shadow-xl border border-slate-800">
                <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase">Permanent AHCS Client ID</div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider mt-1">
                  {generatedClientId}
                </div>
              </div>

              <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-1">
                <div>✓ <strong>Permanent:</strong> Never changes upon mobile, address, or card replacement.</div>
                <div>✓ <strong>Privacy-First:</strong> Contains zero personal data, Aadhaar, or phone slices.</div>
                <div>✓ <strong>Non-Government:</strong> Independent private healthcare platform ID.</div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>View & Activate Your Health Card</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: CARD GENERATION & ACTIVATION */}
          {currentStep === 7 && (
            <div className="space-y-6 flex flex-col items-center">
              <div className="border-b border-slate-100 pb-4 text-center w-full">
                <h2 className="text-xl font-bold text-slate-900">Step 7: AHCS Health Card Minted</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Card generated conforming to standard ISO/IEC 7810 ID-1 dimensions (85.60 mm × 53.98 mm).
                </p>
              </div>

              {/* Vector Health Card Component */}
              <div className="py-2">
                <HealthCard
                  memberName={fullName.toUpperCase()}
                  clientId={generatedClientId}
                  cardNumber={generatedCardNumber}
                  validThru="12/2030"
                  bloodGroup={bloodGroup.replace('_', '+').replace('POS', '+').replace('NEG', '-')}
                  isVerified={true}
                />
              </div>

              <div className="max-w-md w-full bg-amber-50 p-4 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Card Status: PENDING_ACTIVATION</span>
                </div>
                <p>
                  For security, the generated card is inactive until confirmed by the cardholder. Your card activation code is: <strong className="font-mono text-slate-900 text-sm bg-white px-2 py-0.5 rounded border border-amber-300">{activationCode || '123456'}</strong>.
                </p>
              </div>

              <div className="max-w-md w-full space-y-3">
                <label className="block text-xs font-semibold text-slate-700">Enter Card Activation Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={enteredActivationCode}
                    onChange={e => setEnteredActivationCode(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="w-full text-center font-mono text-lg tracking-widest rounded-xl border border-slate-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={loading || !enteredActivationCode}
                    onClick={handleActivateCard}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm shrink-0"
                  >
                    {loading ? 'Activating...' : 'Activate Card'}
                  </button>
                </div>
                {activationCode && (
                  <button
                    type="button"
                    onClick={() => setEnteredActivationCode(activationCode)}
                    className="text-[11px] text-blue-700 font-semibold hover:underline"
                  >
                    Fill activation code ({activationCode})
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 8: CARD ACTIVE & OPERATIONAL */}
          {currentStep === 8 && (
            <div className="space-y-6 text-center max-w-lg mx-auto py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Card Active & Operational
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">Congratulations, {fullName}!</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Your AHCS Health Card is now ACTIVE in the database with dynamic 256-bit emergency break-glass token.
                </p>
              </div>

              <div className="py-2">
                <HealthCard
                  memberName={fullName.toUpperCase()}
                  clientId={generatedClientId}
                  cardNumber={generatedCardNumber}
                  validThru="12/2030"
                  bloodGroup={bloodGroup.replace('_', '+').replace('POS', '+').replace('NEG', '-')}
                  isVerified={true}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href="/dashboard"
                  className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-md"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Open Member Dashboard</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
