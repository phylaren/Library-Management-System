import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_AUTH_USER,
    pass: process.env.SMTP_AUTH_PASS,
  },
});

export const sendMail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Library System" <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      text,
      html,
    });

    console.log(`Лист успішно відправлено на ${to}. ID: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('# Помилка відправки листа:', error);
    return false;
  }
};