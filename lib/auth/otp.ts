import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { db } from '../db/store';

export interface SmsProviderInterface {
  sendOtp(mobile: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Gmail SMTP Transporter for Real Email OTPs
const smtpUser = process.env.SMTP_USER || 'abhisheksah98922@gmail.com';
const smtpPass = (process.env.SMTP_PASS || 'sksvxxffjxcaiqgr').replace(/\s+/g, '');

const gmailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

export async function sendEmailOtp(email: string, code: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const info = await gmailTransporter.sendMail({
      from: process.env.SMTP_FROM || `"AHCS Health Security" <${smtpUser}>`,
      to: email,
      subject: `Your AHCS Health Verification Code: ${code}`,
      text: `Your AHCS digital health verification code is: ${code}. Valid for 5 minutes. Do not share this OTP with anyone.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #1d4ed8, #1e40af); padding: 26px 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">AHCS HEALTH PORTAL</h1>
            <p style="color: #bfdbfe; font-size: 13px; margin: 6px 0 0 0;">Digital Identity & Emergency Care System</p>
          </div>
          <div style="padding: 28px 24px;">
            <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0; line-height: 1.5;">
              Use the 6-digit one-time security code below to complete your identity verification.
            </p>
            <div style="background: #f8fafc; border: 2px dashed #3b82f6; border-radius: 12px; padding: 18px; text-align: center; margin: 20px 0;">
              <span style="font-family: monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #1d4ed8; display: inline-block;">${code}</span>
            </div>
            <p style="font-size: 12px; color: #64748b; margin: 0 0 8px 0; line-height: 1.6;">
              • This code is valid for <strong>5 minutes</strong> only.<br />
              • If you did not request this verification code, please ignore this email.
            </p>
          </div>
          <div style="background: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              AHCS Digital Health Infrastructure • Sovereign Citizen Identity
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[GMAIL_OTP] Live email dispatched to ${email}: MessageID=${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[GMAIL_OTP_ERROR] Failed to send email to ${email}:`, err.message);
    return { success: false, error: err.message };
  }
}

// Multi-Provider SMS Gateway implementation (Fast2SMS, Twilio, Console Fallback)
class HybridSmsProvider implements SmsProviderInterface {
  async sendOtp(mobile: string, code: string) {
    const clean10Digit = mobile.replace(/[^0-9]/g, '').slice(-10);

    // 1. Fast2SMS Provider (India DLT/Quick SMS)
    if (process.env.FAST2SMS_API_KEY) {
      try {
        const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            authorization: process.env.FAST2SMS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: code,
            numbers: clean10Digit,
          }),
        });
        const data = await res.json();
        console.log(`[FAST2SMS_GATEWAY] OTP dispatched to ${clean10Digit}:`, data);
        return { success: data.return === true, messageId: data.request_id };
      } catch (err: any) {
        console.error('[FAST2SMS_ERROR] Failed to send SMS:', err.message);
      }
    }

    // 2. Twilio SMS Provider (International)
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_NUMBER) {
      try {
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString('base64');
        const params = new URLSearchParams();
        params.append('To', mobile.startsWith('+') ? mobile : `+91${clean10Digit}`);
        params.append('From', process.env.TWILIO_FROM_NUMBER);
        params.append('Body', `Your AHCS Health Security Verification Code is: ${code}. Valid for 5 minutes.`);

        const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });
        const data = await res.json();
        console.log(`[TWILIO_GATEWAY] OTP dispatched to ${mobile}:`, data.sid);
        return { success: !data.error_code, messageId: data.sid };
      } catch (err: any) {
        console.error('[TWILIO_ERROR] Failed to send SMS:', err.message);
      }
    }

    // 3. Fallback: Log to secure audit log
    console.log(`[SMS_GATEWAY] Dispatched secure OTP to ${mobile}: CODE=${code}`);
    return { success: true, messageId: `msg_${Date.now()}` };
  }
}

interface OtpEntry {
  identifier: string; // phone or email
  email?: string;
  codeHash: string;
  attempts: number;
  expiresAt: number; // timestamp ms
  createdAt: number;
  consumed: boolean;
}

// In-memory store with fast TTL and crypto hashing
const otpStore = new Map<string, OtpEntry>();

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown
const MAX_ATTEMPTS = 3;

export const smsProvider: SmsProviderInterface = new HybridSmsProvider();

function hashOtp(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export async function requestOtp(identifier: string, email?: string): Promise<{
  success: boolean;
  cooldownRemaining?: number;
  expiresAt?: string;
  error?: string;
  devCode?: string;
  gatewayActive?: boolean;
  channel?: 'EMAIL' | 'SMS';
  recipient?: string;
}> {
  const isEmail = identifier.includes('@');
  const targetEmail = (isEmail ? identifier : email)?.trim().toLowerCase();
  const cleanMobile = !isEmail ? identifier.replace(/[^0-9+]/g, '') : '';

  const lookupKey = isEmail ? targetEmail! : cleanMobile;

  if (!lookupKey || (cleanMobile && cleanMobile.length < 10)) {
    return { success: false, error: 'Valid mobile number or email address is required' };
  }

  const existing = otpStore.get(lookupKey);
  const now = Date.now();

  if (existing && !existing.consumed && now - existing.createdAt < RESEND_COOLDOWN_MS) {
    const remaining = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.createdAt)) / 1000);
    return {
      success: false,
      cooldownRemaining: remaining,
      error: `Please wait ${remaining}s before requesting a new OTP`,
    };
  }

  // Generate 6-digit cryptographically secure OTP
  const rawCode = Math.floor(100000 + crypto.randomInt(900000)).toString();
  const codeHash = hashOtp(rawCode);

  otpStore.set(lookupKey, {
    identifier: lookupKey,
    email: targetEmail,
    codeHash,
    attempts: 0,
    expiresAt: now + OTP_TTL_MS,
    createdAt: now,
    consumed: false,
  });

  // Also bind to email key if provided alongside mobile
  if (targetEmail && lookupKey !== targetEmail) {
    otpStore.set(targetEmail, {
      identifier: lookupKey,
      email: targetEmail,
      codeHash,
      attempts: 0,
      expiresAt: now + OTP_TTL_MS,
      createdAt: now,
      consumed: false,
    });
  }

  let channel: 'EMAIL' | 'SMS' = 'SMS';
  let emailDispatched = false;

  // 1. Dispatch via Gmail SMTP if email is provided
  if (targetEmail) {
    const emailResult = await sendEmailOtp(targetEmail, rawCode);
    if (emailResult.success) {
      emailDispatched = true;
      channel = 'EMAIL';
    }
  }

  // 2. Dispatch via SMS if mobile is provided
  if (cleanMobile) {
    smsProvider.sendOtp(cleanMobile, rawCode);
  }

  // Log audit event
  try {
    db.logAudit({
      actorId: null,
      actorRole: 'ANONYMOUS',
      action: 'OTP_REQUESTED',
      targetResource: 'MOBILE_AUTH',
      targetId: lookupKey,
      ipAddress: null,
      userAgent: null,
      metadata: { identifier: lookupKey, email: targetEmail, channel },
    });
  } catch (err) {
    // Non-blocking audit log
  }

  const hasLiveSmsGateway = Boolean(process.env.FAST2SMS_API_KEY || process.env.TWILIO_ACCOUNT_SID);
  const isGatewayActive = emailDispatched || hasLiveSmsGateway;

  // In production, NEVER expose devCode if live email or SMS gateway is active
  const shouldExposeDevCode = process.env.ALLOW_TEST_OTP === 'true' || (!isGatewayActive && process.env.NODE_ENV !== 'production');

  return {
    success: true,
    expiresAt: new Date(now + OTP_TTL_MS).toISOString(),
    devCode: shouldExposeDevCode ? rawCode : undefined,
    gatewayActive: isGatewayActive,
    channel,
    recipient: targetEmail || cleanMobile,
  };
}

export function verifyOtp(identifier: string, enteredCode: string): {
  success: boolean;
  error?: string;
  email?: string;
} {
  const isEmail = identifier.includes('@');
  const cleanKey = isEmail ? identifier.trim().toLowerCase() : identifier.replace(/[^0-9+]/g, '');

  // Master testing bypass for automated test suites — strictly restricted to NODE_ENV === 'test'
  if (process.env.NODE_ENV === 'test' && enteredCode.trim() === '999999' && cleanKey.startsWith('+9199999')) {
    return { success: true };
  }

  const entry = otpStore.get(cleanKey);

  if (!entry) {
    return { success: false, error: 'No active OTP request found. Please request a new code.' };
  }

  if (entry.consumed) {
    return { success: false, error: 'This OTP has already been used. Please request a new code.' };
  }

  if (Date.now() > entry.expiresAt) {
    otpStore.delete(cleanKey);
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(cleanKey);
    return { success: false, error: 'Maximum verification attempts exceeded. Please request a new OTP.' };
  }

  const enteredHash = hashOtp(enteredCode.trim());
  if (enteredHash !== entry.codeHash) {
    entry.attempts++;
    return {
      success: false,
      error: `Invalid OTP. ${MAX_ATTEMPTS - entry.attempts} attempt(s) remaining.`,
    };
  }

  // OTP verified successfully -> Invalidate immediately
  entry.consumed = true;
  otpStore.delete(cleanKey);
  if (entry.email && cleanKey !== entry.email) {
    otpStore.delete(entry.email);
  }

  db.logAudit({
    actorId: null,
    actorRole: 'ANONYMOUS',
    action: 'OTP_VERIFIED',
    targetResource: 'AUTH',
    targetId: cleanKey,
    ipAddress: null,
    userAgent: null,
    metadata: { identifier: cleanKey, email: entry.email },
  });

  return { success: true, email: entry.email };
}
