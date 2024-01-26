"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { deleteUserQuiz } from "@/server/actions/quiz";
// SCHEMAS
import { DeleteUserQuizFormSchema } from "@/lib/schema";
// TYPES
import type { DeleteUserQuizFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteUserQuizButton({
  userQuizId,
  userQuizStatus,
}: {
  userQuizId: string;
  userQuizStatus: UserQuizStatus;
}) {
  const deleteQuizForm = useForm<DeleteUserQuizFormSchemaType>({
    defaultValues: {
      userQuizId,
    },
    resolver: zodResolver(DeleteUserQuizFormSchema),
  });
  const { handleSubmit, formState } = deleteQuizForm;

  const deleteUserQuizAction: SubmitHandler<
    DeleteUserQuizFormSchemaType
  > = async (data) => {
    console.log(data);
    const actionResponse = await deleteUserQuiz(data);
    if (actionResponse.status === "SUCCESS") {
      toast.success(actionResponse.message);
    } else {
      toast.error(actionResponse.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(deleteUserQuizAction)} className="w-fit">
      <Button
        className="hover:bg-red-100 hover:text-red-500 [&>svg]:size-4"
        variant="ghost"
        disabled={userQuizStatus === "IN_PROGRESS"}
      >
        {formState.isSubmitting ? (
          <Loader2 className="animate-spin text-red-500" />
        ) : (
          <Trash2 />
        )}
      </Button>
    </form>
  );
}
