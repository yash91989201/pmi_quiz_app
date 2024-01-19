import * as React from "react";
import {
  Body,
  Container,
  Heading,
  Html,
  Tailwind,
  Text,
} from "@react-email/components";

export default function TwoFactorAuthEmail({
  twoFactorCode,
}: {
  twoFactorCode: string;
}) {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-indigo-500">
          <Container className="mx-auto my-16 flex min-w-[400px] flex-col items-center  rounded-md border bg-white p-6 shadow-md ">
            <Heading>🔐 Next Auth V5</Heading>
            <Text className="text-center text-gray-500 ">
              2FA Code for login
            </Text>
            <Text className="rounded bg-gray-100 px-3 py-6 text-center align-middle text-4xl tracking-widest text-gray-700 ">
              {twoFactorCode}
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
