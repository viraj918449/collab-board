const nodemailer = require('nodemailer');

const sendPasswordResetPin = async ({ email, pin }) => {
  const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

  if (!hasSmtpConfig) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Password reset email service is not configured');
    }
    console.log(`Password reset PIN for ${email}: ${pin}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_PORT) === '465',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: 'CollabBoard password reset PIN',
    text: `Your CollabBoard password reset PIN is ${pin}. It expires in 10 minutes. Do not share this PIN with anyone.`,
  });
};

module.exports = { sendPasswordResetPin };
