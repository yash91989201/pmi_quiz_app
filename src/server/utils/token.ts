import { db } from "@/server/db";
import {
  passwordResetTokens,
  twoFactorConfimation,
  twoFactorTokens,
  verificationTokens,
} from "@/server/db/schema";
import { createId } from "@paralleldrive/cuid2";
import crypto from "crypto";
import { eq } from "drizzle-orm";

async function generateVerificationToken(email: string) {
  const token = createId();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, existingToken.id));
  }

  await db.insert(verificationTokens).values({
    token,
    expires,
    email,
  });

  return {
    token,
    expires,
    email,
  };
}

async function getVerificationTokenByEmail(email: string) {
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.email, email),
  });
  return verificationToken;
}

async function getVerificationTokenByToken(token: string) {
  const verificationToken = await db.query.verificationTokens.findFirst({
    where: eq(verificationTokens.token, token),
  });
  return verificationToken;
}

async function getPasswordResetTokenByToken(token: string) {
  const resetToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.token, token),
  });
  return resetToken;
}

async function getPasswordResetTokenByEmail(email: string) {
  const resetToken = await db.query.passwordResetTokens.findFirst({
    where: eq(passwordResetTokens.email, email),
  });
  return resetToken;
}

async function generatePasswordResetToken(email: string) {
  const resetToken = createId();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id));
  }

  await db.insert(passwordResetTokens).values({
    email,
    token: resetToken,
    expires,
  });

  return {
    token: resetToken,
    expires,
    email,
  };
}

async function getTwoFactorTokenByToken(token: string) {
  const existingToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.token, token),
  });
  return existingToken;
}

async function getTwoFactorTokenByEmail(email: string) {
  const existingToken = await db.query.twoFactorTokens.findFirst({
    where: eq(twoFactorTokens.email, email),
  });
  return existingToken;
}

async function getTwoFactorConfirmationByUserId(userId: string) {
  const existingConfirmation = await db.query.twoFactorConfimation.findFirst({
    where: eq(twoFactorConfimation.userId, userId),
  });
  return existingConfirmation;
}

async function generateTwoFactorToken(email: string) {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);
  if (existingToken) {
    await db
      .delete(twoFactorTokens)
      .where(eq(twoFactorTokens.id, existingToken.id));
  }

  await db.insert(twoFactorTokens).values({
    email,
    token,
    expires,
  });

  return {
    email,
    token,
    expires,
  };
}

export {
  generatePasswordResetToken,
  generateTwoFactorToken,
  generateVerificationToken,
  getPasswordResetTokenByEmail,
  getPasswordResetTokenByToken,
  getTwoFactorConfirmationByUserId,
  getTwoFactorTokenByEmail,
  getTwoFactorTokenByToken,
  getVerificationTokenByEmail,
  getVerificationTokenByToken,
};
