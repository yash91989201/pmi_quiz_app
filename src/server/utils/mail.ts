import nodemailer from "nodemailer";
import { render } from "@react-email/render";
// UTILS
import { env } from "@/env";
// CUSTOM COMPONENTS
import VerificationEmail from "@/components/emails/verfication-form";
import PasswordResetEmail from "@/components/emails/password-reset-email";
import TwoFactorAuthEmail from "@/components/emails/two-factor-auth-email";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  secure: env.NODE_ENV === "production",
  port: 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

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
  const confirmationLink = `${env.AUTH_URL}/auth/new-verification?token=${token}`;
  const verificationEmailHTML = render(
    VerificationEmail({ confirmationLink, userName }),
  );
  const res = await transporter.sendMail({
    from: "mail@exam.pmiusa.info",
    to: email,
    subject,
    html: verificationEmailHTML,
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
  const passwordResetLink = `${env.AUTH_URL}/auth/new-password?token=${token}`;
  const sendPasswordResetEmailHTML = render(
    PasswordResetEmail({
      passwordResetLink,
    }),
  );
  const res = await transporter.sendMail({
    from: "mail@exam.pmiusa.info",
    to: email,
    subject: "Reset your password",
    html: sendPasswordResetEmailHTML,
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
  const twoFactorAuthEmailHTML = render(
    TwoFactorAuthEmail({
      twoFactorCode: token,
    }),
  );
  const res = await transporter.sendMail({
    from: "mail@exam.pmiusa.info",
    to: email,
    subject: "2FA Code For Login",
    html: twoFactorAuthEmailHTML,
  });
  console.log(res);
}

export {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendTwoFactorTokenEmail,
};
