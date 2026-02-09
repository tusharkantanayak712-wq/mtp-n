import nodemailer from "nodemailer";

export async function sendOtpMail(email, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // 🔐 App Password
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Login Access OTP",
    html: `
      <h2>Login Access</h2>
      <p>Your secure access code is:</p>
      <h1 style="color: #6366f1; letter-spacing: 5px;">${otp}</h1>
      <p>Enter this code in the app to complete your login.</p>
      <p>This code is valid for 10 minutes.</p>
    `,
  });
}
