import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${env.FRONTEND_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"IoT Copilot AI" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Reset your IoT Copilot password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#000;text-decoration:none;border-radius:8px;">Reset Password</a>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  await transporter.sendMail({
    from: `"IoT Copilot AI" <${env.SMTP_USER}>`,
    to: email,
    subject: 'Welcome to IoT Copilot AI!',
    html: `
      <h2>Welcome, ${name}! 🚀</h2>
      <p>Your journey to becoming an IoT expert starts now.</p>
      <p>Get started by:</p>
      <ul>
        <li>Completing your skill assessment</li>
        <li>Exploring AI Mentor for guidance</li>
        <li>Building your first project</li>
      </ul>
      <a href="${env.FRONTEND_URL}/dashboard" style="display:inline-block;padding:12px 24px;background:#00d4ff;color:#000;text-decoration:none;border-radius:8px;">Go to Dashboard</a>
    `,
  });
};
