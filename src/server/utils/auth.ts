import NextAuth from "next-auth";
import { eq } from "drizzle-orm";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
// ACTIONS
// CUSTOM HOOKS
// UTILS
import { env } from "@/env";
import { db } from "@/server/db";
import { authConfig } from "@/config/auth.config";
import { getUserById } from "@/server/utils/user";
import { mysqlTable, twoFactorConfimation, users } from "@/server/db/schema";
import { getTwoFactorConfirmationByUserId } from "@/server/utils/token";
// TYPES
import type { DefaultSession } from "next-auth";
// CONSTANTS
import { DUMMY_EMAIL_PREFIX } from "@/config/constants";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      emailVerified: Date | null;
      isTwoFactorEnabled: boolean;
    } & DefaultSession["user"];
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db
        .update(users)
        .set({ emailVerified: new Date() })
        .where(eq(users.id, user.id!));
    },
  },
  callbacks: {
    async signIn({ user }) {
      const existingUser = await getUserById(user.id!);

      if (
        !existingUser?.emailVerified &&
        !existingUser?.email.startsWith(DUMMY_EMAIL_PREFIX)
      ) {
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

      const newToken = {
        ...token,
        ...existingUser,
      };

      return newToken;
    },

    // @ts-expect-error: next auth session function type is not working
    async session({ session, token }) {
      // eslint-disable-next-line
      if (token.sub && session.user) session.user.id = token.sub;

      // eslint-disable-next-line
      if (token.role && session.user) {
        // eslint-disable-next-line
        session.user.id = token.id as string;
        // eslint-disable-next-line
        session.user.role = token.role as UserRole;
        // eslint-disable-next-line
        session.user.emailVerified = token.emailVerified as Date | null;
        // eslint-disable-next-line
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db, mysqlTable),
  secret: env.AUTH_SECRET,
  ...authConfig,
});

export const currentUser = async () => {
  const session = await auth();

  return session?.user;
};

export const currentRole = async () => {
  const session = await auth();

  return session?.user?.role;
};
