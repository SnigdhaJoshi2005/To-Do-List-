const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendMail({ to, subject, html }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn(
      "[mailer] SMTP credentials not configured — skipping email to",
      to
    );
    return { skipped: true };
  }
  return transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    html,
  });
}

function shell(inner) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f5f3ec; padding:24px; border-radius:16px; max-width:480px; margin:0 auto; color:#3c3a34;">
      <div style="text-align:center; font-size:40px; line-height:1;">🌿</div>
      <h1 style="text-align:center; font-size:22px; font-weight:600; color:#2f6f4e; margin:8px 0 4px;">Questify</h1>
      <div style="background:#ffffff; border-radius:12px; padding:20px; margin-top:12px; border:1px solid #e6e0d3;">
        ${inner}
      </div>
      <p style="text-align:center; font-size:11px; color:#9a9588; margin-top:16px;">Turn your tasks into adventures 🌱</p>
    </div>
  `;
}

function reminderEmail({ title, kind, dueDate, dueLabel }) {
  return shell(`
    <p style="margin:0 0 12px; font-size:14px;">Hey there,</p>
    <p style="margin:0 0 12px; font-size:14px;">Just a friendly nudge — your <strong>${kind}</strong> is <strong>${dueLabel}</strong>:</p>
    <p style="margin:0 0 16px; padding:12px 16px; background:#f2f7f1; border-radius:8px; font-size:15px; font-weight:600; color:#2f6f4e;">${title}</p>
    <p style="margin:0 0 16px; font-size:13px; color:#6b675e;">Due: <strong>${dueDate}</strong></p>
    <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/quests" style="display:inline-block; background:#b8a472; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600;">Open Questify</a>
  `);
}

function passwordResetEmail({ resetLink }) {
  return shell(`
    <p style="margin:0 0 12px; font-size:14px;">You requested a password reset for your Questify account.</p>
    <p style="margin:0 0 16px; font-size:14px;">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
    <a href="${resetLink}" style="display:inline-block; background:#2f6f4e; color:#ffffff; text-decoration:none; padding:10px 18px; border-radius:8px; font-size:13px; font-weight:600;">Reset Password</a>
    <p style="margin:16px 0 0; font-size:12px; color:#9a9588;">If you didn't request this, you can safely ignore this email.</p>
  `);
}

module.exports = {
  sendMail,
  reminderEmail,
  passwordResetEmail,
};
