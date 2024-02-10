"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
// ACTIONS
import { updateUser } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// UTILS
import { api } from "@/trpc/react";
import { editActionToast } from "@/lib/utils";
// SCHEMAS
import { UpdateUserFormSchema } from "@/lib/schema";
// TYPES
import type {
  UpdateUserFormSchemaType,
  UserOrderSchemaType,
} from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
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
import OrdersField from "@/components/admin/user/orders-field";
import AvailableQuizzesField from "@/components/admin/user/available-quizzes-field";
// ICONS
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  RotateCcw,
  UserRound,
  XCircle,
} from "lucide-react";

type UpdateUserFormProps = {
  defaultValues: {
    id: string;
    name: string;
    email: string;
    password: string;
    quizzesId: string[];
    orders: UserOrderSchemaType[];
  };
};

export default function UpdateUserForm({ defaultValues }: UpdateUserFormProps) {
  const router = useRouter();

  const [actionResponse, setActionResponse] =
    useState<UpdateUserFormStatusType>();

  const showPasswordToggle = useToggle(false);

  const { data, isLoading } = api.quiz.getQuizzes.useQuery();
  const availableQuizzes = data ?? [];

  const createNewUserForm = useForm<UpdateUserFormSchemaType>({
    shouldUseNativeValidation: true,
    defaultValues,
    resolver: zodResolver(UpdateUserFormSchema),
  });
  const { control, handleSubmit, formState, reset } = createNewUserForm;

  const updateUserAction: SubmitHandler<UpdateUserFormSchemaType> = async (
    data,
  ) => {
    const actionResponse = await updateUser(data);
    setActionResponse(actionResponse);
    if (actionResponse.status === "SUCCESS") {
      router.replace("/admin/users");
    } else {
      reset();
    }

    if (actionResponse.status === "SUCCESS") {
      const userActions = actionResponse.user;
      const userQuizzesActions = actionResponse.quizzes;
      const userOrdersActions = actionResponse.orders;

      editActionToast(userActions?.update);
      editActionToast(userQuizzesActions?.insert);
      editActionToast(userQuizzesActions?.delete);
      editActionToast(userOrdersActions?.insert);
      editActionToast(userOrdersActions?.update);
      editActionToast(userOrdersActions?.delete);

      setTimeout(() => {
        router.replace("/admin/users");
      }, 4000);
    }
  };

  return (
    <Form {...createNewUserForm}>
      <form
        className="flex flex-col gap-3"
        onSubmit={handleSubmit(updateUserAction)}
        onReset={() => reset()}
      >
        <FormField
          name="name"
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
          name="email"
          control={control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex items-center gap-3">
                  <Input {...field} placeholder="Enter email" />
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
              <FormLabel className="flex items-center gap-3">
                Password
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

        <AvailableQuizzesField
          isLoading={isLoading}
          availableQuizzes={availableQuizzes}
          fieldHeading="Add/Remove quizzes from user."
        />

        <OrdersField />

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

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={formState.isSubmitting}
            className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">Update User Info</h6>
            {formState.isSubmitting && <Loader2 className="animate-spin" />}
          </Button>
          <Button
            type="reset"
            variant="outline"
            disabled={formState.isSubmitting}
            className="flex w-fit items-center justify-center gap-3  disabled:cursor-not-allowed"
          >
            <h6 className="md:text-lg">Reset</h6>
            <RotateCcw size={16} />
          </Button>
        </div>
      </form>
    </Form>
  );
}
