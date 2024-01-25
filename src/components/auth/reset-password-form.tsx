"use client";
import { useState } from "react";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// ACTIONS
import { resetPassword } from "@/server/actions/user";
// SCHEMAS
import { ResetPasswordSchema } from "@/lib/schema";
// TYPES
import type { ResetPasswordSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// ICONS
import { CheckCircle2, Loader2, Mail, XCircle } from "lucide-react";

export default function ResetPasswordForm() {
  const [actionResponse, setActionResponse] =
    useState<ResetPasswordStatusType>();

  const signInForm = useForm<ResetPasswordSchemaType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { control, handleSubmit, formState } = signInForm;

  const resetPasswordAction: SubmitHandler<ResetPasswordSchemaType> = async (
    data,
  ) => {
    const actionResponse = await resetPassword(data);
    setActionResponse(actionResponse);
  };

  return (
    <Card className="max-w-[480px] bg-white ">
      <CardHeader className="gap-3 text-center text-gray-700">
        <CardTitle>🔐 Next Auth v5</CardTitle>
        <CardDescription className="text-gray-600">
          Forgot your Password?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...signInForm}>
          <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit(resetPasswordAction)}
          >
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input {...field} placeholder="Enter your email" />
                      <Mail />
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
              <h6 className="md:text-lg">Send Reset Email</h6>
              {formState.isSubmitting && <Loader2 className="animate-spin" />}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="w-full gap-3">
        <Button variant="link" asChild>
          <Link href="/auth/login" className="w-full text-center text-gray-700">
            Back to Login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
