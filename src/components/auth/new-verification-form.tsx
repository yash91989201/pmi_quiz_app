"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// ACTIONS
import { newVerification } from "@/server/actions/user";
// CUSTOM COMPONENTS
import AuthCardWrapper from "@/components/auth/auth-card-wrapper";
// ICONS
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

export default function NewVerificationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const newVerificationToken = searchParams.get("token") ?? "";

  const [actionResponse, setActionResponse] =
    useState<NewVerificationStatusType>();

  const newVerificationAction = useCallback(() => {
    if (!newVerificationToken) {
      setActionResponse({
        status: "FAILED",
        message: "Token is missing.",
      });
      return;
    }

    newVerification({ token: newVerificationToken })
      .then((actionResponse) => {
        setActionResponse(actionResponse);
        if (actionResponse.status === "SUCCESS") {
          const verificationSuccessRedirect =
            actionResponse.role === "ADMIN"
              ? "/auth/admin/login"
              : "/auth/login";

          setTimeout(() => {
            router.replace(verificationSuccessRedirect);
          }, 1500);
        }
      })
      .catch(() => {
        setActionResponse({
          status: "FAILED",
          message: "Something Went Wrong.",
        });
      });
  }, [router, newVerificationToken]);

  useEffect(() => {
    newVerificationAction();
  }, [newVerificationAction]);

  return (
    <AuthCardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="my-3 flex items-center justify-center space-x-3 text-gray-700 [&>svg]:size-8">
        {actionResponse?.status === "UNINITIALIZED" && (
          <Loader2 className="animate-spin" />
        )}
      </div>

      {actionResponse?.status === "SUCCESS" && (
        <div className="flex items-center justify-start gap-2 rounded-md bg-green-100 p-3 text-sm text-green-600 [&>svg]:size-4">
          <CheckCircle2 />
          <p>{actionResponse.message}</p>
        </div>
      )}

      {actionResponse?.status === "FAILED" && (
        <div className="flex items-center justify-start gap-3 rounded-md bg-red-100 p-3 text-sm text-red-600 [&>svg]:size-4">
          <XCircle />
          <p>{actionResponse.message}</p>
        </div>
      )}
    </AuthCardWrapper>
  );
}
