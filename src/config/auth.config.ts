import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
// UTILS
import { getUserByEmail } from "@/server/utils/user";
// SCHEMAS
import { AuthorizeLoginSchema } from "@/lib/schema";
// TYPES
import type { NextAuthConfig } from "next-auth";

const authConfig = {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = AuthorizeLoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { password, email } = validatedFields.data;

          const user = await getUserByEmail(email);

          if (!user?.password || !user) return null;

          const isPasswordMatching = await bcrypt.compare(
            password,
            user.password,
          );
          if (isPasswordMatching) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export { authConfig };
