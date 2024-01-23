import React from "react";
import { SessionProvider } from "next-auth/react";
// UTILS
import { auth } from "@/server/utils/auth";

export default async function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return <SessionProvider session={session}>{children}</SessionProvider>;
}
