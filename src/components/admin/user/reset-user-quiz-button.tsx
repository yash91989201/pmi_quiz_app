"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { resetUserQuiz } from "@/server/actions/quiz";
// SCHEMAS
import { ResetUserQuizFormSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { ResetUserQuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2, Undo2 } from "lucide-react";

export default function ResetUserQuizButton({
  userQuizId,
  userQuizStatus,
}: {
  userQuizId: string;
  userQuizStatus: UserQuizStatus;
}) {
  const deleteQuizForm = useForm<ResetUserQuizFormSchemaType>({
    defaultValues: {
      userQuizId,
    },
    resolver: zodResolver(ResetUserQuizFormSchema),
  });
  const { handleSubmit, formState } = deleteQuizForm;

  const deleteUserQuizAction: SubmitHandler<
    ResetUserQuizFormSchemaType
  > = async (data) => {
    console.log(data);
    const actionResponse = await resetUserQuiz(data);
    if (actionResponse.status === "SUCCESS") {
      toast.success(actionResponse.message);
    } else {
      toast.error(actionResponse.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(deleteUserQuizAction)} className="w-fit">
      <Button
        title="Reset user quiz"
        variant="ghost"
        className="hover:bg-blue-100 hover:text-blue-500 [&>svg]:size-4"
        disabled={userQuizStatus === "NOT_STARTED"}
      >
        {formState.isSubmitting ? (
          <Loader2 className="animate-spin text-blue-500" />
        ) : (
          <Undo2 />
        )}
      </Button>
    </form>
  );
}
