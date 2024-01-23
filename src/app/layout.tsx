import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
// UTILS
import { TRPCReactProvider } from "@/trpc/react";
// CUSTOM COMPONENT
import AuthSessionProvider from "@/components/shared/auth-session-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Quiz | PMI",
  description: "Quiz app for PMI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <AuthSessionProvider>
          <TRPCReactProvider cookies={cookies().toString()}>
            {children}
          </TRPCReactProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
