# Email Configuration Guide

## Gmail SMTP Setup

The application uses Gmail's SMTP server to send emails. Due to Google's security requirements, you **cannot** use your regular Gmail password. Instead, you must use an **App Password**.

### Prerequisites
- A Gmail account
- 2-Step Verification enabled on your Google account

### Step-by-Step Instructions

#### 1. Enable 2-Step Verification (if not already enabled)
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Under "Signing in to Google," select **2-Step Verification**
3. Follow the prompts to enable it

#### 2. Generate an App Password
1. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
   - Alternatively: Google Account → Security → 2-Step Verification → App passwords
2. You may need to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Enter a name like "TeamMates Backend"
6. Click **Generate**
7. Google will display a 16-character password (without spaces)
8. **Copy this password** - you won't be able to see it again

#### 3. Configure Your .env File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and update the email configuration:
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=abcdefghijklmnop  # Your 16-character App Password (no spaces)
   EMAIL_FROM=your-email@gmail.com
   ```

   Replace:
   - `your-email@gmail.com` with your actual Gmail address
   - `abcdefghijklmnop` with the 16-character App Password you generated

#### 4. Test the Configuration
After updating your `.env` file, restart the server:
```bash
npm run dev
```

The server will attempt to verify the email configuration on startup. You should see:
```
Email server is ready to take messages
```

If you see an authentication error, double-check that:
- 2-Step Verification is enabled
- You're using the App Password, not your regular password
- The email address is correct
- There are no extra spaces in the App Password

### Common Issues

#### "Invalid login: Username and Password not accepted"
- **Cause**: Using regular Gmail password instead of App Password
- **Solution**: Generate and use an App Password as described above

#### "Connection timeout"
- **Cause**: Firewall or network blocking SMTP port
- **Solution**: Check firewall settings, ensure port 587 is open

#### "Self-signed certificate"
- **Cause**: SSL/TLS certificate issues
- **Solution**: Ensure `EMAIL_SECURE=false` for port 587, or use `EMAIL_SECURE=true` with port 465

### Alternative Email Providers

If you prefer not to use Gmail, you can configure other SMTP providers:

#### SendGrid
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
```

#### Mailgun
```env
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-mailgun-username
EMAIL_PASSWORD=your-mailgun-password
```

#### Outlook/Office365
```env
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use different App Passwords** for different applications
3. **Revoke App Passwords** for applications you no longer use
4. **Regularly rotate** your App Passwords
5. **Keep your `.env` file secure** with appropriate file permissions

### Troubleshooting

If emails are still not sending after configuration:

1. **Check the server logs** for specific error messages
2. **Verify database connection** - the emails table must exist
3. **Test with a simple email** first before complex templates
4. **Check spam folders** - test emails might be filtered
5. **Verify recipient addresses** are valid and accessible

For more help, see the [Nodemailer documentation](https://nodemailer.com/).
