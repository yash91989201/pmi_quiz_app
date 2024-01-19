import { LoginSchema } from "@/lib/schema";
import { getUserByEmail } from "@/server/utils/user";
import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;
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
