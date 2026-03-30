import { getNextTransporter } from "./mailTransporters";

export async function sendOtpMail(email, otp) {
  const tInfo = getNextTransporter();
  if (!tInfo) {
    throw new Error("No mail transporters available for OTP.");
  }
  
  const { transporter, account } = tInfo;

  await transporter.sendMail({
    from: `"MLBB Topup Support" <${account.user}>`,
    to: email,
    subject: `${otp} is your verification code`,
    html: `
      <div style="background-color: #ffffff; color: #1a1a1a; font-family: 'Inter', -apple-system, system-ui, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border-radius: 16px; border: 1px solid #f0f0f0;">
        <!-- Logo -->
        <div style="margin-bottom: 32px; text-align: left;">
          <img src="https://mlbbtopup.in/logoBB.png" alt="MLBB Topup" style="width: 48px; height: 48px;">
        </div>

        <!-- Content -->
        <h1 style="font-size: 24px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 8px;">Verification Code</h1>
        <p style="color: #666666; font-size: 15px; line-height: 1.5; margin-bottom: 32px;">Please use the following code to complete your login. This code will expire in 10 minutes.</p>

        <!-- Code Box -->
        <div style="background-color: #f8f9ff; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <div style="font-family: ui-monospace, 'Cascadia Code', monospace; font-size: 36px; font-weight: 700; color: #4f46e5; letter-spacing: 8px;">${otp}</div>
        </div>

        <p style="color: #888888; font-size: 13px; margin-bottom: 40px;">If you didn't request this code, you can safely ignore this email.</p>

        <!-- Footer Info -->
        <div style="border-top: 1px solid #f0f0f0; padding-top: 24px;">
          <p style="font-size: 13px; font-weight: 600; margin-bottom: 4px;">MLBB Topup Support</p>
          <p style="font-size: 13px; color: #666666; margin-bottom: 16px;">
            <a href="tel:+919178521537" style="color: #4f46e5; text-decoration: none;">+91 9178521537</a> • 
            <a href="https://mlbbtopup.in" style="color: #4f46e5; text-decoration: none;">mlbbtopup.in</a>
          </p>
          <p style="font-size: 11px; color: #999999; line-height: 1.4;">
            © 2026 mlbbtopup.in. India's trusted gaming partner. All rights reserved.
          </p>
        </div>
      </div>
    `,
  });
}
