import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email: string, code: string) {
  await transporter.sendMail({
    from: `"CodeHarem" <${env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email - CodeHarem",
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <div style="background: #f4f4f4; padding: 16px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; border-radius: 8px;">
          ${code}
        </div>
        <p style="color: #666; font-size: 14px; margin-top: 16px;">This code expires in 10 minutes.</p>
      </div>
    `,
  });
}
