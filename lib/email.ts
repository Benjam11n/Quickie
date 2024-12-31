import { Resend } from 'resend';

import { Waitlist } from '@/database/waitlist.model';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not set in environment variables');
  }

  try {
    const result = await resend.emails.send({
      from: from || 'Quickie <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendWaitlistNotification(email: string, name?: string) {
  try {
    const waitlist = await Waitlist.findOne({ email: email.toLowerCase() });
    if (!waitlist) {
      throw new Error('Waitlist entry not found');
    }

    // Generate verification token
    const verificationToken = waitlist.generateVerificationToken();
    await waitlist.save();

    const subject =
      'Welcome to Our Exclusive Perfume Vending Machines Waitlist!';

    // Create verification URL with token
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${verificationToken}&email=${encodeURIComponent(email)}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #000;
              color: #fff !important;
              text-decoration: none;
              border-radius: 4px;
              margin: 20px 0;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #eee;
              font-size: 0.875rem;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Welcome${name ? `, ${name}` : ''}!</h1>
            <p>Thank you for joining our exclusive waitlist. We're thrilled to have you as one of our early supporters!</p>
            
            <p>As a member of our waitlist, you'll be among the first to:</p>
            <ul>
              <li>Access our collection when we launch</li>
              <li>Receive exclusive early-bird offers</li>
              <li>Get personalized fragrance recommendations</li>
            </ul>

            <p>Please verify your email to ensure you don't miss any updates:</p>
            <a href="${verificationUrl}" class="button">Verify Email</a>

            <p style="color: #666; font-size: 0.875rem;">
              Or copy this link: ${verificationUrl}
            </p>

            <p>What's next?</p>
            <ul>
              <li>Complete your profile to get personalized recommendations</li>
              <li>Follow us on social media for behind-the-scenes content</li>
              <li>Keep an eye on your inbox for exclusive updates</li>
            </ul>

            <div class="footer">
              <p>If you didn't sign up for our waitlist, you can safely ignore this email.</p>
              <p>This verification link will expire in 24 hours.</p>
              <p>Have questions? Simply reply to this email - we're here to help!</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await sendEmail({
      to: email,
      subject,
      html,
    });

    return result;
  } catch (error) {
    console.error('Error sending waitlist notification:', error);
    throw error;
  }
}

export async function sendBatchWaitlistNotifications(
  emails: { email: string; name?: string }[]
) {
  const results = await Promise.allSettled(
    emails.map(({ email, name }) => sendWaitlistNotification(email, name))
  );

  return {
    success: true,
    data: {
      total: emails.length,
      successful: results.filter(
        (result) => result.status === 'fulfilled' && result.value.success
      ).length,
      failed: results.filter(
        (result) =>
          result.status === 'rejected' ||
          (result.status === 'fulfilled' && !result.value.success)
      ).length,
    },
  };
}

// Add more email types as needed
export async function sendUpdateNotification(
  email: string,
  name?: string,
  updateDetails?: string
) {
  const subject = 'Important Update About Our Launch!';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${subject}</title>
      </head>
      <body>
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1>Hello ${name || 'there'}!</h1>
          <p>We have an exciting update about our upcoming launch!</p>
          ${updateDetails ? `<p>${updateDetails}</p>` : ''}
          <p>Stay tuned for more updates!</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}

export async function sendVerificationEmail(
  email: string,
  name: string | undefined,
  token: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verify?token=${token}&email=${encodeURIComponent(email)}`;

  const subject = 'Verify your email address';
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
            line-height: 1.5;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #000;
            color: #fff !important;
            text-decoration: none;
            border-radius: 4px;
            margin: 20px 0;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 0.875rem;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Verify your email${name ? `, ${name}` : ''}</h1>
          <p>Thanks for signing up! Please verify your email address to complete your registration.</p>
          
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          
          <p>Or copy and paste this URL into your browser:</p>
          <p style="word-break: break-all;">${verificationUrl}</p>

          <div class="footer">
            <p>This verification link will expire in 24 hours.</p>
            <p>If you didn't sign up for our waitlist, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject,
    html,
  });
}
