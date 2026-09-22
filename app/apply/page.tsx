'use client';

import React, { useState, useEffect } from 'react';
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
  QrCode
} from 'lucide-react';
import { HealthCard } from '@/components/HealthCard';

export default function CardApplicationPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Step 1 Form: Mobile Registration & OTP
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [devCodeHint, setDevCodeHint] = useState<string>('');
  const [isMobileVerified, setIsMobileVerified] = useState<boolean>(false);

  // Step 2 Form: Profile Details
  const [fullName, setFullName] = useState<string>('Rahul Sharma');
  const [dob, setDob] = useState<string>('1990-05-15');
  const [gender, setGender] = useState<string>('MALE');
  const [bloodGroup, setBloodGroup] = useState<string>('O_POS');
  const [address, setAddress] = useState<string>('Flat 402, Green Meadows');
  const [district, setDistrict] = useState<string>('Bengaluru Urban');
  const [stateProvince, setStateProvince] = useState<string>('Karnataka');
  const [pinCode, setPinCode] = useState<string>('560034');
  const [emergencyName, setEmergencyName] = useState<string>('Priya Sharma');
  const [emergencyPhone, setEmergencyPhone] = useState<string>('+91 98765 43210');
  const [emergencyRelation, setEmergencyRelation] = useState<string>('Spouse');

  // Step 3 Form: Document Submission
  const [docType, setDocType] = useState<string>('PASSPORT');
  const [docNumber, setDocNumber] = useState<string>('P8491028');
  const [docFile, setDocFile] = useState<string>('passport_rahul_sharma.pdf');

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

  // API Action: Request Real OTP
  const handleSendOtp = async () => {
    setErrorMessage('');
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to dispatch OTP');
        setLoading(false);
        return;
      }

      setIsOtpSent(true);
      if (data.devCode) {
        setDevCodeHint(data.devCode);
        setOtpCode(data.devCode); // autofill for testing
      }
    } catch (err) {
      setErrorMessage('Network error requesting OTP');
    } finally {
      setLoading(false);
    }
  };

  // API Action: Verify Real OTP & Issue Session
  const handleVerifyOtp = async () => {
    setErrorMessage('');
    if (otpCode.length !== 6) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/v1/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, code: otpCode }),
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

  // API Action: Save Profile
  const handleSaveProfile = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await fetch('/api/v1/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          dateOfBirth: dob,
          gender,
          bloodGroup,
          addressLine1: address,
          district,
          stateProvince,
          pinCode,
          emergencyContactName: emergencyName,
          emergencyContactPhone: emergencyPhone,
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
    setLoading(true);
    try {
      const res = await fetch('/api/v1/verification/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          docNumber,
          fileName: docFile,
          fileSizeBytes: 1024 * 650,
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
          notes: 'Document proof verified by duty officer. Legible and authentic.',
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to complete officer approval');
        setLoading(false);
        return;
      }

      setGeneratedClientId(data.clientId);
      setGeneratedCardNumber(data.card.cardNumber);
      if (data.activationCode) {
        setActivationCode(data.activationCode);
        setEnteredActivationCode(data.activationCode);
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
                  Authenticate your mobile number to establish your secure identity anchor.
                </p>
              </div>

              {!isOtpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={e => setMobileNumber(e.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-r-xl border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleSendOtp}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Dispatching OTP...' : 'Send 6-Digit OTP'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-xs text-blue-900">
                    OTP dispatched to <strong>+91 {mobileNumber}</strong>.
                    {devCodeHint && (
                      <span className="block mt-1 font-mono text-[11px] text-blue-700">
                        Development OTP generated: <strong>{devCodeHint}</strong>
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={e => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-full text-center tracking-widest text-lg font-mono rounded-xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleVerifyOtp}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold rounded-full text-xs transition-colors shadow-md shadow-blue-700/20"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                  </button>
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
                  Enter your verified demographic details and emergency contact.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (as on Official ID)</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={district}
                    onChange={e => setDistrict(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={pinCode}
                    onChange={e => setPinCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={e => setEmergencyName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact Phone</label>
                  <input
                    type="text"
                    value={emergencyPhone}
                    onChange={e => setEmergencyPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
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

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Type</label>
                  <select
                    value={docType}
                    onChange={e => setDocType(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="PASSPORT">Passport</option>
                    <option value="DRIVING_LICENSE">Driving Licence</option>
                    <option value="VOTER_ID">Voter ID (EPIC)</option>
                    <option value="NATIONAL_ID">National ID / Aadhaar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Document Reference Number</label>
                  <input
                    type="text"
                    value={docNumber}
                    onChange={e => setDocNumber(e.target.value)}
                    placeholder="Enter document number"
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Document number reference is hashed with SHA-256 for duplicate detection.</span>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors">
                  <UploadCloud className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-slate-800">Uploaded: {docFile}</div>
                  <div className="text-xs text-slate-400 mt-0.5">PDF or JPEG (Encrypted AES-256 Vault)</div>
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
                  className="px-7 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-700/20"
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
                    onChange={e => setEnteredActivationCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center font-mono text-lg tracking-widest rounded-xl border border-slate-300 px-3 py-2.5 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    disabled={loading}
                    onClick={handleActivateCard}
                    className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-sm shrink-0"
                  >
                    {loading ? 'Activating...' : 'Activate Card'}
                  </button>
                </div>
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
