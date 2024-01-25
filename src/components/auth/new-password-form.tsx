"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { newPassword } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { NewPasswordSchema } from "@/lib/schema";
// TYPES
import type { NewPasswordSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AuthCardWrapper from "@/components/auth/auth-card-wrapper";
// ICONS
import { CheckCircle2, Eye, EyeOff, Loader2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newPasswordToken = searchParams.get("token") ?? "";
  const showPasswordToggle = useToggle(false);
  const [actionResponse, setActionResponse] = useState<NewPasswordStatusType>();

  const newPasswordForm = useForm<NewPasswordSchemaType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      token: newPasswordToken,
    },
  });
  const { control, handleSubmit, formState } = newPasswordForm;

  const newPasswordAction: SubmitHandler<NewPasswordSchemaType> = async (
    data,
  ) => {
    const actionResponse = await newPassword(data);
    setActionResponse(actionResponse);

    if (actionResponse.status === "SUCCESS") {
      const verificationSuccessRedirect =
        actionResponse.role === "ADMIN" ? "/auth/admin/login" : "/auth/login";
      setTimeout(() => {
        router.replace(verificationSuccessRedirect);
      }, 2000);
    }
  };

  return (
    <AuthCardWrapper headerLabel="Enter a new password">
      <Form {...newPasswordForm}>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(newPasswordAction)}
        >
          <FormField
            name="password"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-3 [&>svg]:size-5 md:[&>svg]:size-6">
                    <Input
                      {...field}
                      type={showPasswordToggle.isOn ? "text" : "password"}
                      placeholder="********"
                    />
                    {showPasswordToggle.isOn ? (
                      <Eye
                        className="cursor-pointer select-none"
                        onClick={showPasswordToggle.off}
                      />
                    ) : (
                      <EyeOff
                        className="cursor-pointer select-none"
                        onClick={showPasswordToggle.on}
                      />
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
          />

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

          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="flex items-center justify-center gap-3 disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">Reset Password</h6>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
