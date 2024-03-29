"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { userLogin } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { UserLoginSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { UserLoginSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AuthCardWrapper from "@/components/auth/auth-card-wrapper";
// ICONS
import {
  CheckCircle2,
  Eye,
  EyeOff,
  FormInput,
  Loader2,
  Mail,
  UserRound,
  XCircle,
} from "lucide-react";

export default function UserLoginForm() {
  const showPasswordToggle = useToggle(false);
  const twoFactorAuthenticationField = useToggle(false);

  const [actionResponse, setActionResponse] =
    useState<UserLoginFormStatusType>();

  const loginForm = useForm<UserLoginSchemaType>({
    shouldUseNativeValidation: true,
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      name: "",
      password: "",
      twoFactorCode: "",
      role: "USER",
    },
  });
  const { control, handleSubmit, formState, getValues } = loginForm;

  const emailInput = getValues("email");
  const userEmail = emailInput ?? "";

  const loginWithCredentialsAction: SubmitHandler<UserLoginSchemaType> = async (
    data,
  ) => {
    const actionResponse = await userLogin(data);
    if (actionResponse) {
      switch (actionResponse.status) {
        case "SUCCESS": {
          if (actionResponse.authType === "PASSWORD_WITH_2FA")
            twoFactorAuthenticationField.show();
          setActionResponse(actionResponse);
          break;
        }
        case "FAILED": {
          setActionResponse(actionResponse);
          break;
        }
      }
    }
  };

  return (
    <AuthCardWrapper headerLabel="Welcome Back">
      <Form {...loginForm}>
        <form
          className="flex flex-col gap-3"
          onSubmit={handleSubmit(loginWithCredentialsAction)}
        >
          {twoFactorAuthenticationField.isHidden ? (
            <>
              <FormField
                name="name"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          {...field}
                          placeholder="Enter your username"
                          type="text"
                          disabled={userEmail.length > 0}
                        />
                        <UserRound />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="relative flex items-center justify-center">
                <Separator className="shrink" />
                <span className="mx-3 select-none text-muted-foreground">
                  OR
                </span>
                <Separator className="shrink" />
              </div>

              <FormField
                name="email"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Email</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input
                          {...field}
                          placeholder="Enter your email"
                          type="email"
                          disabled={getValues("name").length > 0}
                        />
                        <Mail />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Password</FormLabel>
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
            </>
          ) : (
            <FormField
              name="twoFactorCode"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Two Factor Code</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input {...field} placeholder="Enter 2FA Code." />
                      <FormInput />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          )}

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
            disabled={formState.isSubmitting}
            className="mt-3 flex h-12 items-center justify-center gap-3 rounded-full font-medium disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">
              {!twoFactorAuthenticationField.isShowing ? "LOG IN" : "Confirm"}
            </h6>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
          </Button>
        </form>
      </Form>
    </AuthCardWrapper>
  );
}
