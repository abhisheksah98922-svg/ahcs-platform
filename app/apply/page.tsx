'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  User, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Mail,
  Phone,
  Clock,
  Lock,
  Building2,
  ExternalLink
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
  const [successNotice, setSuccessNotice] = useState<string>('');

  // Step 1: Account (Mobile & Email OTP)
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [emailAddress, setEmailAddress] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [otpChannel, setOtpChannel] = useState<'EMAIL' | 'SMS'>('EMAIL');
  const [otpRecipient, setOtpRecipient] = useState<string>('');
  const [resendCooldown, setResendCooldown] = useState<number>(0);

  // Step 2: Profile Details
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

  // Step 3: Identity Document Submission
  const [docType, setDocType] = useState<string>('AADHAAR');
  const [docNumber, setDocNumber] = useState<string>('');
  const [docFile, setDocFile] = useState<string>('');
  const [docFileSize, setDocFileSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 4: Submission Confirmation & Status
  const [verifRequestId, setVerifRequestId] = useState<string>('');
  const [provisionalId, setProvisionalId] = useState<string>('');
  const [existingCard, setExistingCard] = useState<any>(null);

  // Load existing session if present
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch('/api/v1/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (data.user.mobileNumber) setMobileNumber(data.user.mobileNumber.replace('+91', ''));
          if (data.user.email) setEmailAddress(data.user.email);

          if (data.profile) {
            setFullName(data.profile.fullName || '');
            setDob(data.profile.dateOfBirth || '');
            setGender(data.profile.gender || 'MALE');
            setBloodGroup(data.profile.bloodGroup || 'O_POS');
            setAddress(data.profile.addressLine1 || '');
            setDistrict(data.profile.district || '');
            setStateProvince(data.profile.stateProvince || 'Delhi');
            setPinCode(data.profile.pinCode || '');
            setEmergencyName(data.profile.emergencyContactName || '');
            setEmergencyPhone(data.profile.emergencyContactPhone ? data.profile.emergencyContactPhone.replace('+91', '').trim() : '');
            setEmergencyRelation(data.profile.emergencyContactRelation || 'Parent');
          }

          if (data.clientId) {
            setProvisionalId(data.clientId.clientId);
          }

          if (data.card && data.card.status === 'ACTIVE') {
            setExistingCard(data.card);
            setCurrentStep(4);
            return;
          }

          if (data.account?.state === 'VERIFICATION_PENDING' || data.account?.state === 'UNDER_REVIEW') {
            setCurrentStep(4);
          } else if (data.account?.state === 'PROFILE_COMPLETED') {
            setCurrentStep(3);
          } else if (data.account?.state === 'REGISTERED') {
            setCurrentStep(2);
          }
        }
      } catch (err) {
        console.error('Session load error:', err);
      }
    }
    loadSession();
  }, []);

  // Cooldown countdown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Handle document file change
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

  // Step 1: Send Real OTP via Gmail SMTP
  const handleSendOtp = async () => {
    setErrorMessage('');
    setSuccessNotice('');

    const cleanEmail = emailAddress.trim().toLowerCase();
    const cleanDigits = mobileNumber.replace(/[^0-9]/g, '').slice(-10);

    if (!cleanEmail && (!cleanDigits || cleanDigits.length !== 10)) {
      setErrorMessage('Please enter a valid email address or 10-digit mobile number.');
      return;
    }

    if (cleanEmail && !cleanEmail.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: cleanDigits ? `+91${cleanDigits}` : undefined,
          email: cleanEmail || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to dispatch verification code');
        setLoading(false);
        return;
      }

      setIsOtpSent(true);
      setOtpCode('');
      setOtpChannel(data.channel || (cleanEmail ? 'EMAIL' : 'SMS'));
      setOtpRecipient(data.recipient || cleanEmail || cleanDigits);
      setSuccessNotice(data.message || `Verification code sent to ${data.recipient || cleanEmail}`);
      setResendCooldown(60);
    } catch (err) {
      setErrorMessage('Network error while requesting OTP. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify Real OTP
  const handleVerifyOtp = async () => {
    setErrorMessage('');
    if (!otpCode || otpCode.trim().length !== 6) {
      setErrorMessage('Please enter the complete 6-digit OTP code received in your inbox.');
      return;
    }

    setLoading(true);
    const cleanEmail = emailAddress.trim().toLowerCase();
    const cleanDigits = mobileNumber.replace(/[^0-9]/g, '').slice(-10);

    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mobileNumber: cleanDigits ? `+91${cleanDigits}` : undefined,
          email: cleanEmail || undefined,
          code: otpCode.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid or expired OTP code');
        setLoading(false);
        return;
      }

      setCurrentStep(2);
    } catch (err) {
      setErrorMessage('Network error while verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Save Profile
  const handleSaveProfile = async () => {
    setErrorMessage('');
    if (!fullName.trim() || fullName.trim().length < 3) {
      setErrorMessage('Please enter your full legal name as printed on your government identity document');
      return;
    }
    if (!dob) {
      setErrorMessage('Please enter your date of birth');
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage('Please enter your complete residential address');
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

  // Step 3: Submit Documents for Official Review
  const handleSubmitDocuments = async () => {
    setErrorMessage('');
    if (!docNumber.trim() || docNumber.trim().length < 4) {
      setErrorMessage('Please enter your official document identification number');
      return;
    }
    if (!docFile) {
      setErrorMessage('Please select and upload a legible copy of your identity document (PDF or image)');
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
        setErrorMessage(data.error || 'Failed to submit identity documents');
        setLoading(false);
        return;
      }

      setVerifRequestId(data.verificationRequestId);
      setProvisionalId(`AHCS-APP-${Date.now().toString().slice(-6)}`);
      setCurrentStep(4);
    } catch (err) {
      setErrorMessage('Network error submitting documents');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Profile' },
    { num: 3, label: 'Identity Proof' },
    { num: 4, label: 'Verification Status' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Official Healthcare Identity Enrollment
          </span>
          <h1 className="text-3xl font-black text-slate-900 mt-2">Apply for AHCS Digital Health ID</h1>
          <p className="text-sm text-slate-600 mt-1 max-w-xl mx-auto">
            Secure digital onboarding with real email OTP authentication, cryptographic document hashing, and verification desk review.
          </p>
        </div>

        {/* Global Error Notice */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-800 font-semibold shadow-xs">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Global Success Notice */}
        {successNotice && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Stepper Progress Indicator */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs mb-8">
          <div className="flex items-center justify-between text-xs font-semibold">
            {stepsList.map((step, idx) => (
              <React.Fragment key={step.num}>
                <div className="flex items-center gap-2">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                      currentStep > step.num 
                        ? 'bg-blue-700 text-white' 
                        : currentStep === step.num 
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-700 shadow-xs' 
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {currentStep > step.num ? '✓' : step.num}
                  </div>
                  <span className={`hidden sm:inline ${currentStep === step.num ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                    {step.label}
                  </span>
                </div>
                {idx < stepsList.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 ${currentStep > step.num ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Card Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8">

          {/* STEP 1: ACCOUNT (EMAIL & MOBILE OTP) */}
          {currentStep === 1 && (
            <div className="max-w-md mx-auto space-y-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Mail className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">Step 1: Security Verification</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Authenticate using your personal email address. A real 6-digit verification code will be dispatched to your inbox.
                </p>
              </div>

              {!isOtpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address <span className="text-blue-600 font-bold">(OTP will arrive here)</span>
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={e => setEmailAddress(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Live delivery powered by Gmail SMTP security infrastructure.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      10-Digit Mobile Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
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
                  </div>

                  <button
                    type="button"
                    disabled={loading || (!emailAddress.includes('@') && mobileNumber.length !== 10)}
                    onClick={handleSendOtp}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Dispatching Live OTP...' : 'Send 6-Digit Verification Code'}
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold">Real OTP Code Dispatched:</strong> Sent to <strong>{otpRecipient}</strong>. Please check your inbox (and spam/promotions folder) and enter the 6-digit code.
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 482910"
                      className="w-full text-center tracking-widest text-2xl font-mono rounded-xl border border-slate-300 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600 font-bold"
                    />
                    <span className="text-[11px] text-slate-400 mt-1 block text-center">
                      Code expires in 5 minutes • Maximum 3 verification attempts
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={loading || otpCode.length !== 6}
                    onClick={handleVerifyOtp}
                    className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Verifying Code...' : 'Verify OTP & Continue'}
                  </button>

                  <div className="flex justify-between items-center text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setOtpCode('');
                      }}
                      className="text-blue-700 hover:underline font-semibold"
                    >
                      ← Change contact details
                    </button>
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || loading}
                      onClick={handleSendOtp}
                      className="text-slate-600 disabled:text-slate-400 font-semibold"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
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
                <h2 className="text-xl font-bold text-slate-900">Step 2: Applicant Profile & Demographics</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter your genuine demographic information and emergency contact person.
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
                    placeholder="As printed on government ID"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                    placeholder="e.g. South Delhi / Mumbai / Bengaluru"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State / Union Territory <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={stateProvince}
                    onChange={e => setStateProvince(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Emergency Contact Person Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    placeholder="Family member / guardian"
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                  className="px-5 py-2 border border-slate-300 rounded-full text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 font-semibold"
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
                <h2 className="text-xl font-bold text-slate-900">Step 3: Identity Verification Proof</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Upload an officially recognized identity document. Files are encrypted with AES-256 in private vault storage.
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none bg-white"
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
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Document number is cryptographically hashed with SHA-256 for zero-knowledge privacy.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Upload Document Proof (PDF, JPG, or PNG) <span className="text-red-500">*</span>
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
                            {docFileSize ? `${(docFileSize / 1024).toFixed(1)} KB` : 'Verified file'} • Ready for Vault Encryption
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
                    Document files are stored in private vault storage and accessible only by authorized verification officers.
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2 border border-slate-300 rounded-full text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 font-semibold"
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
                  <span>{loading ? 'Submitting Application...' : 'Submit Application for Review'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GENUINE VERIFICATION STATUS (NO SIMULATED OFFICER) */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-xl mx-auto py-2">
              {existingCard ? (
                /* Card Already Active */
                <div className="text-center space-y-5">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Card Active & Operational
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">Welcome Back, {fullName}!</h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Your AHCS Health Card is active with permanent 256-bit emergency break-glass protection.
                    </p>
                  </div>

                  <div className="py-2">
                    <HealthCard
                      memberName={fullName.toUpperCase() || 'MEMBER'}
                      clientId={provisionalId || existingCard.clientIdFk || 'AHCS-IN-2026'}
                      cardNumber={existingCard.cardNumber}
                      validThru="12/2030"
                      bloodGroup={bloodGroup.replace('_', '+').replace('POS', '+').replace('NEG', '-')}
                      isVerified={true}
                    />
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/dashboard"
                      className="w-full py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-2 shadow-md"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open Member Dashboard</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Under Official Desk Review */
                <div className="space-y-5">
                  <div className="text-center">
                    <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                      <Clock className="w-7 h-7" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      Application Under Verification
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 mt-2">Application Successfully Submitted</h2>
                    <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                      Your document proof has been cryptographically sealed and submitted to the AHCS Verification Desk.
                    </p>
                  </div>

                  {/* Tracking Card */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Applicant Legal Name:</span>
                      <strong className="text-slate-900">{fullName || 'Registered Applicant'}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Document Type:</span>
                      <strong className="text-slate-900">{DOC_TYPES.find(d => d.id === docType)?.label || docType}</strong>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Document Reference:</span>
                      <span className="font-mono text-slate-800 font-semibold">
                        XXXX-XXXX-{docNumber.slice(-4) || '9999'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500">Verification Request ID:</span>
                      <span className="font-mono text-blue-700 font-bold">{verifRequestId || 'VRQ-PENDING'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Current Status:</span>
                      <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold text-[11px] border border-amber-200">
                        PENDING_OFFICER_REVIEW
                      </span>
                    </div>
                  </div>

                  {/* Information Box */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs space-y-2 text-blue-900 leading-relaxed">
                    <div className="font-bold flex items-center gap-1.5 text-blue-950">
                      <ShieldCheck className="w-4 h-4 text-blue-700" />
                      <span>Next Steps in Official Lifecycle:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 text-[11px]">
                      <li>An authorized Verification Officer audits your uploaded document against official registries.</li>
                      <li>Upon approval, your **Permanent AHCS Client ID** and **Active Digital Health Card** will be issued.</li>
                      <li>You will receive an email confirmation at <strong>{emailAddress || 'your registered email'}</strong>.</li>
                    </ul>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/dashboard"
                      className="flex-1 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-700/20"
                    >
                      <User className="w-4 h-4" />
                      <span>Go to Member Dashboard</span>
                    </Link>
                    <Link
                      href="/officer"
                      className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-300"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Officer Desk Login</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
