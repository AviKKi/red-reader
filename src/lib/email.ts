import { render } from '@react-email/render';
import Plunk from '@plunk/node';
import VerifyEmail from '@/emails/verify-email';

const plunk = new Plunk(process.env.PLUNK_API_KEY || '');

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/confirm?token=${token}`;
  
  const emailHtml = await render(VerifyEmail({ verificationLink }));

  try {
    await plunk.emails.send({
      to: email,
      subject: 'Verify your email',
      body: emailHtml,
    });
    console.log('Verification email sent to', email);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
