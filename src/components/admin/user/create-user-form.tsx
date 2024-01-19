"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { createNewUser } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { CreateNewUserSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { CreateNewUserSchemaType, SignUpSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// ICONS
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Loader2,
  UserRound,
  XCircle,
} from "lucide-react";

export default function CreateNewUserForm() {
  const showPasswordToggle = useToggle(false);
  const [actionResponse, setActionResponse] =
    useState<CreateNewUserFormStatusType>();

  const createNewUserForm = useForm<CreateNewUserSchemaType>({
    shouldUseNativeValidation: true,
    defaultValues: {
      email: "example@gmail.com",
      password: "password",
      role: "USER",
    },
    resolver: zodResolver(CreateNewUserSchema),
  });
  const { control, handleSubmit, formState } = createNewUserForm;

  const signInAction: SubmitHandler<SignUpSchemaType> = async (data) => {
    const actionResponse = await createNewUser(data);
    setActionResponse(actionResponse);
  };

  return (
    <Form {...createNewUserForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(signInAction)}
      >
        <FormField
          name="userName"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input {...field} placeholder="Enter username" />
                  <UserRound />
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
              <FormLabel className="flex items-center gap-3">
                <span>Password</span>
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                      <Info size={14} />
                    </TooltipTrigger>
                    <TooltipContent align="start">
                      <p className="max-w-56">
                        Password is set to &apos;password&apos; by default.
                        After logging in for the first time users will need to
                        change it.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>
              <FormControl>
                <div className="flex items-center gap-3 [&>svg]:size-5 md:[&>svg]:size-6">
                  <Input
                    {...field}
                    type={showPasswordToggle.isOn ? "text" : "password"}
                    placeholder="********"
                    readOnly
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
              <FormMessage />
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
          <h6 className="md:text-lg">Create New User</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
