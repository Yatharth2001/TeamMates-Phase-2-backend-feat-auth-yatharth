import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create reusable transporter
export const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// Send email function
export const sendEmail = async (
  to: string | string[],
  subject: string,
  content: string,
  htmlContent?: string,
  from?: string
) => {
  try {
    const transporter = createEmailTransporter();
    
    const mailOptions = {
      from: from || process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: content,
      html: htmlContent || content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Verify email configuration
export const verifyEmailConfig = async () => {
  try {
    const transporter = createEmailTransporter();
    await transporter.verify();
    console.log('Email server is ready to take messages');
    return true;
  } catch (error) {
    console.error('Email server verification failed:', error);
    return false;
  }
};
