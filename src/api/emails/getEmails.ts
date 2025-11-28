import express from 'express';
import { db } from '../../db/client.js';
import { emails, emailRecipients } from '../../db/emails.js';
import { eq, desc } from 'drizzle-orm';

const router = express.Router();

// GET /api/emails - Get all emails with recipients
router.get('/', async (req, res) => {
  try {
    const { sender_id, limit = 50, offset = 0 } = req.query;

    // Build query conditionally
    let allEmails;
    if (sender_id) {
      allEmails = await db
        .select()
        .from(emails)
        .where(eq(emails.sender_id, sender_id as string))
        .orderBy(desc(emails.sent_at))
        .limit(Number(limit))
        .offset(Number(offset));
    } else {
      allEmails = await db
        .select()
        .from(emails)
        .orderBy(desc(emails.sent_at))
        .limit(Number(limit))
        .offset(Number(offset));
    }

    // Fetch recipients for each email
    const emailsWithRecipients = await Promise.all(
      allEmails.map(async (email) => {
        const recipients = await db
          .select()
          .from(emailRecipients)
          .where(eq(emailRecipients.email_id, email.id));

        return {
          ...email,
          attachments: email.attachments ? JSON.parse(email.attachments) : [],
          recipients,
          recipientCount: recipients.length,
        };
      })
    );

    res.status(200).json({
      success: true,
      emails: emailsWithRecipients,
      total: emailsWithRecipients.length,
    });
  } catch (error: any) {
    console.error('Error fetching emails:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch emails',
    });
  }
});

export default router;
