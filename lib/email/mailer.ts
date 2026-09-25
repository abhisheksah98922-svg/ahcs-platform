import nodemailer from 'nodemailer';

const smtpUser = process.env.SMTP_USER || 'abhisheksah98922@gmail.com';
const smtpPass = (process.env.SMTP_PASS || 'sksvxxffjxcaiqgr').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://ahcs.in';

/**
 * 1. Application Received & Under Review Email
 */
export async function sendApplicationReceivedEmail(
  toEmail: string,
  details: { fullName: string; requestId: string; docType: string }
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"AHCS Health Desk" <${smtpUser}>`,
      to: toEmail,
      subject: `[AHCS] Application Received — Verification Request ${details.requestId}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #1e3a8a, #2563eb); padding: 26px 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">AHCS HEALTH PORTAL</h1>
            <p style="color: #bfdbfe; font-size: 13px; margin: 6px 0 0 0;">Official Identity & Health Records Desk</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0;">Hello, ${details.fullName}!</h2>
            <p style="font-size: 14px; color: #334155; margin: 0 0 18px 0; line-height: 1.6;">
              Your application for an <strong>AHCS Digital Health ID</strong> has been successfully received and cryptographically secured in our verification queue.
            </p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <table style="width: 100%; font-size: 13px; color: #334155;">
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Applicant Name:</td>
                  <td style="padding: 4px 0; font-weight: 600; text-align: right;">${details.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Document Type:</td>
                  <td style="padding: 4px 0; font-weight: 600; text-align: right;">${details.docType}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Tracking ID:</td>
                  <td style="padding: 4px 0; font-family: monospace; font-weight: 700; color: #2563eb; text-align: right;">${details.requestId}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #64748b;">Status:</td>
                  <td style="padding: 4px 0; font-weight: 700; color: #d97706; text-align: right;">PENDING_OFFICER_REVIEW</td>
                </tr>
              </table>
            </div>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
              An authorized Verification Officer will inspect your identity document against official standards. As soon as a decision is made, you will receive an email update right here.
            </p>
            <div style="text-align: center; margin: 24px 0 12px 0;">
              <a href="${APP_URL}/dashboard" style="background: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 700; display: inline-block;">
                Track Status in Member Dashboard &rarr;
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              AHCS Digital Health Infrastructure • Sovereign Citizen Identity
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[MAILER] Application received email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[MAILER_ERROR] Failed to send submission email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 2. Application Approved & Card Issued Email
 */
export async function sendApplicationApprovedEmail(
  toEmail: string,
  details: { fullName: string; clientId: string; cardNumber: string }
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"AHCS Health Desk" <${smtpUser}>`,
      to: toEmail,
      subject: `🎉 Congratulations! Your AHCS Digital Health ID has been Verified & Approved`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 26px 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">APPLICATION APPROVED</h1>
            <p style="color: #d1fae5; font-size: 13px; margin: 6px 0 0 0;">Official Verification Complete • ID Active</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0;">Congratulations, ${details.fullName}!</h2>
            <p style="font-size: 14px; color: #334155; margin: 0 0 18px 0; line-height: 1.6;">
              Great news! Your uploaded identity documents have been inspected and <strong>officially approved</strong> by the AHCS Verification Desk.
            </p>
            <div style="background: #f0fdf4; border: 2px solid #86efac; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
              <span style="font-size: 11px; font-weight: 700; color: #166534; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 6px;">Your Permanent AHCS Client ID</span>
              <span style="font-family: monospace; font-size: 24px; font-weight: 900; color: #065f46; letter-spacing: 2px;">${details.clientId}</span>
              <div style="margin-top: 10px; font-size: 12px; color: #15803d;">
                Card Number: <strong>${details.cardNumber}</strong> • 24x7 Emergency Break-Glass QR Active
              </div>
            </div>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
              Your permanent digital health card is now ready. You can log into your account anytime to view your digital card, display your emergency QR code, and manage your health records.
            </p>
            <div style="text-align: center; margin: 24px 0 12px 0;">
              <a href="${APP_URL}/dashboard" style="background: #059669; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 700; display: inline-block;">
                View & Download Your Health Card &rarr;
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              AHCS Digital Health Infrastructure • Sovereign Citizen Identity
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[MAILER] Approval email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[MAILER_ERROR] Failed to send approval email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}

/**
 * 3. Application Rejected Email
 */
export async function sendApplicationRejectedEmail(
  toEmail: string,
  details: { fullName: string; reason: string }
) {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || `"AHCS Health Desk" <${smtpUser}>`,
      to: toEmail,
      subject: `[AHCS] Action Required: Document Verification Update`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <div style="background: linear-gradient(135deg, #b91c1c, #dc2626); padding: 26px 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; margin: 0; letter-spacing: 0.5px;">VERIFICATION UPDATE</h1>
            <p style="color: #fecaca; font-size: 13px; margin: 6px 0 0 0;">Document Review Notice</p>
          </div>
          <div style="padding: 28px 24px;">
            <h2 style="font-size: 18px; color: #0f172a; margin: 0 0 12px 0;">Hello, ${details.fullName}</h2>
            <p style="font-size: 14px; color: #334155; margin: 0 0 18px 0; line-height: 1.6;">
              During the official audit of your AHCS Health ID application, our verification team was unable to verify the submitted identity document.
            </p>
            <div style="background: #fef2f2; border-left: 4px solid #ef4444; border-radius: 4px; padding: 16px; margin: 20px 0;">
              <span style="font-size: 11px; font-weight: 700; color: #991b1b; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Officer Review Remark:</span>
              <p style="font-size: 13px; color: #7f1d1d; margin: 0; font-weight: 500;">
                "${details.reason}"
              </p>
            </div>
            <p style="font-size: 13px; color: #475569; line-height: 1.6; margin: 0 0 20px 0;">
              Don't worry — you can easily re-upload a clear, legible copy of your government identity document (Aadhaar, PAN, Voter ID, or Passport) to complete your enrollment.
            </p>
            <div style="text-align: center; margin: 24px 0 12px 0;">
              <a href="${APP_URL}/apply" style="background: #dc2626; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 9999px; font-size: 13px; font-weight: 700; display: inline-block;">
                Update & Re-Submit Document &rarr;
              </a>
            </div>
          </div>
          <div style="background: #f8fafc; padding: 14px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              AHCS Digital Health Infrastructure • Sovereign Citizen Identity
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[MAILER] Rejection email sent to ${toEmail}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (err: any) {
    console.error(`[MAILER_ERROR] Failed to send rejection email to ${toEmail}:`, err.message);
    return { success: false, error: err.message };
  }
}
