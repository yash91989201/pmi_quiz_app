"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
// ACTIONS
import { createNewUser } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// UTILS
import { generateRandomDummyEmail } from "@/lib/utils";
import { api } from "@/trpc/react";
// SCHEMAS
import { CreateUserFormSchema } from "@/lib/schema";
// TYPES
import type { CreateUserFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import AvailableQuizzesField from "@/components/admin/user/available-quizzes-field";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// ICONS
import OrdersField from "@/components/admin/user/orders-field";
import { Eye, EyeOff, Info, Loader2, UserRound } from "lucide-react";

export default function CreateNewUserForm({
  availableOrders,
}: {
  availableOrders: {
    orderId: string;
    orderText: string;
    orderPriority: number;
    isCompleted: boolean;
  }[];
}) {
  const router = useRouter();

  const showPasswordToggle = useToggle(false);

  const { data: quizzesData, isLoading: quizzesLoading } =
    api.quiz.getQuizzes.useQuery();
  const availableQuizzes = quizzesData ?? [];

  const dummyEmail = generateRandomDummyEmail();

  const createNewUserForm = useForm<CreateUserFormSchemaType>({
    shouldUseNativeValidation: true,
    defaultValues: {
      name: "",
      email: dummyEmail,
      password: "password",
      role: "USER",
      quizzesId: [],
      orders: availableOrders,
    },
    resolver: zodResolver(CreateUserFormSchema),
  });
  const { control, handleSubmit, formState } = createNewUserForm;

  const signInAction: SubmitHandler<CreateUserFormSchemaType> = async (
    data,
  ) => {
    const actionResponse = await createNewUser(data);
    if (actionResponse.status === "SUCCESS") {
      router.replace("/admin/users");
    }
  };

  return (
    <Form {...createNewUserForm}>
      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit(signInAction)}
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

        <AvailableQuizzesField
          isLoading={quizzesLoading}
          availableQuizzes={availableQuizzes}
          fieldHeading="Add quizzes for user."
        />

        <OrdersField />
        <Button
          type="submit"
          disabled={formState.isSubmitting}
          className="flex w-fit items-center justify-center gap-3 disabled:cursor-not-allowed"
        >
          <h6 className="md:text-lg">Create New User</h6>
          {formState.isSubmitting && <Loader2 className="animate-spin" />}
        </Button>
      </form>
    </Form>
  );
}
