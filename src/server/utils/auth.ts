import { DrizzleAdapter } from "@auth/drizzle-adapter";
//
import { db } from "@/server/db";
import { mysqlTable, twoFactorConfimation, users } from "@/server/db/schema";
import { getTwoFactorConfirmationByUserId } from "@/server/utils/token";
import { getUserById } from "@/server/utils/user";
import { eq } from "drizzle-orm";

import authConfig from "@/config/auth.config";
import { env } from "@/env";
import NextAuth, { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      emailVerified: Date | null;
      isTwoFactorEnabled: boolean;
      role: UserRole;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id));
    },
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(user.id);

      if (!existingUser?.emailVerified) {
        return false;
      }

      if (existingUser?.isTwoFactorEnabled) {
        const existing2FAConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!existing2FAConfirmation) {
          return false;
        }

        await db
          .delete(twoFactorConfimation)
          .where(eq(twoFactorConfimation.id, existing2FAConfirmation.id));
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      token.emailVerified = existingUser.emailVerified;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      return token;
    },

    async session({ session, token }) {
      if (token.sub && session.user) session.user.id = token.sub;

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
        session.user.emailVerified = token.emailVerified as Date;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  session: { strategy: "jwt" },
  secret: env.AUTH_SECRET,
  ...authConfig,
});
