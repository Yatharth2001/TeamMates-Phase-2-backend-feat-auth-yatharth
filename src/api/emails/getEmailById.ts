import express from 'express';
import { db } from '../../db/client.js';
import { emails, emailRecipients } from '../../db/emails.js';
import { eq } from 'drizzle-orm';

const router = express.Router();

// GET /api/emails/:id - Get a specific email by ID with recipients
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the email
    const [email] = await db
      .select()
      .from(emails)
      .where(eq(emails.id, Number(id)));

    if (!email) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    // Fetch recipients for this email
    const recipients = await db
      .select()
      .from(emailRecipients)
      .where(eq(emailRecipients.email_id, Number(id)));

    res.status(200).json({
      success: true,
      email: {
        ...email,
        attachments: email.attachments ? JSON.parse(email.attachments) : [],
        recipients,
        recipientCount: recipients.length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching email:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch email',
    });
  }
});

export default router;
