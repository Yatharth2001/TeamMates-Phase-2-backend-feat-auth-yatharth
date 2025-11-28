import express from 'express';
import { db } from '../../db/client.js';
import { emails, emailRecipients } from '../../db/emails.js';
import { sendEmail } from '../../db/emailService.js';
import { players } from '../../db/Players.js';
import { user } from '../../../auth-schema.js';
import { eq, inArray } from 'drizzle-orm';

const router = express.Router();

// POST /api/emails/send - Send email to multiple recipients
router.post('/send', async (req, res) => {
  try {
    const {
      sender_id,
      sender_name,
      sender_email,
      recipients, // Array of { type: 'player'|'user'|'external', id?: number, name: string, email: string }
      subject,
      content,
      html_content,
      attachments,
    } = req.body;

    // Validation
    if (!sender_id || !sender_name || !sender_email || !recipients || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Recipients must be a non-empty array',
      });
    }

    // Extract recipient emails for nodemailer
    const recipientEmails = recipients.map((r: any) => r.email);

    // Send email via nodemailer
    let emailStatus = 'sent';
    let emailError = null;

    try {
      await sendEmail(
        recipientEmails,
        subject,
        content,
        html_content || content,
        sender_email
      );
    } catch (error: any) {
      console.error('Failed to send email:', error);
      emailStatus = 'failed';
      emailError = error.message;
    }

    // Store email in database
    const [emailRecord] = await db.insert(emails).values({
      sender_id,
      sender_name,
      sender_email,
      subject,
      content,
      html_content: html_content || null,
      attachments: attachments ? JSON.stringify(attachments) : null,
      status: emailStatus,
    });

    // Store recipients in database
    const emailId = emailRecord.insertId;
    const recipientRecords = recipients.map((recipient: any) => ({
      email_id: emailId,
      recipient_type: recipient.type || 'external',
      recipient_id: recipient.id || null,
      recipient_name: recipient.name,
      recipient_email: recipient.email,
    }));

    await db.insert(emailRecipients).values(recipientRecords);

    if (emailStatus === 'failed') {
      return res.status(500).json({
        success: false,
        message: `Email failed to send: ${emailError}`,
        emailId,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      emailId,
      recipientCount: recipients.length,
    });
  } catch (error: any) {
    console.error('Error in send email endpoint:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email',
    });
  }
});

export default router;
