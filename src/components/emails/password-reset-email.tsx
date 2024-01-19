import * as React from "react";
import {
  Body,
  Container,
  Heading,
  Html,
  Tailwind,
  Text,
  Link,
} from "@react-email/components";

export default function PasswordResetEmail({
  passwordResetLink,
}: {
  passwordResetLink: string;
}) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-indigo-500">
          <Container className="mx-auto my-16 flex min-w-[400px] flex-col items-center  rounded-md border bg-white p-6 shadow-md ">
            <Heading>🔐 Next Auth V5</Heading>
            <Text className="text-center text-gray-500">
              Reset Your Password
            </Text>
            <Text className="text-center text-lg text-gray-700 ">
              Click
              <Link href={passwordResetLink} className="mx-1 underline">
                here
              </Link>
              to reset your password.
            </Text>
            <Text className="text-center text-gray-500">
              Email sent from resend for auth.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
