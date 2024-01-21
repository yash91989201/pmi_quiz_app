import { Resend } from "resend";
// UTILS
import { env } from "@/env";
// CUSTOM COMPONENTS
import VerificationEmail from "@/components/emails/verfication-form";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import TwoFactorAuthEmail from "@/components/emails/two-factor-auth-email";

const resend = new Resend(env.RESEND_API_KEY);

async function sendVerificationEmail({
  email,
  token,
  subject,
  userName,
}: {
  email: string;
  token: string;
  subject: string;
  userName: string;
}) {
  const confirmationLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  const res = await resend.emails.send({
    from: "mail@devopsprojects.pro",
    to: email,
    subject,
    react: VerificationEmail({ confirmationLink, userName }),
  });
  console.log(res);
}

async function sendPasswordResetEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const passwordResetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "Reset your password",
    react: PasswordResetEmail({
      passwordResetLink,
    }),
  });
  console.log(res);
}

async function sendTwoFactorTokenEmail({
  email,
  token,
}: {
  email: string;
  token: string;
}) {
  const res = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "2FA Code For Login",
    react: TwoFactorAuthEmail({
      twoFactorCode: token,
    }),
  });
  console.log(res);
}

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
};
