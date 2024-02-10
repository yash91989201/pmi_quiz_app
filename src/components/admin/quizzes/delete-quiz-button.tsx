"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { deleteQuiz } from "@/server/actions/quiz";
// SCHEMAS
import { DeleteQuizFormSchema } from "@/lib/schema";
// TYPES
import type { DeleteQuizFormSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
// ICONS
import { Loader2, Trash2 } from "lucide-react";

export function DeleteQuizButton({ quizId }: { quizId: string }) {
  const router = useRouter();
  const deleteQuizForm = useForm<DeleteQuizFormSchemaType>({
    defaultValues: {
      quizId,
    },
    resolver: zodResolver(DeleteQuizFormSchema),
  });
  const { handleSubmit, formState } = deleteQuizForm;

  const deleteQuizAction: SubmitHandler<DeleteQuizFormSchemaType> = async (
    data,
  ) => {
    const actionResponse = await deleteQuiz(data);
    if (actionResponse.status === "SUCCESS") {
      router.replace("/admin/quizzes");
    } else {
      toast.error(actionResponse.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(deleteQuizAction)} className="w-fit">
      <Button
        className="flex gap-3 [&>svg]:size-4"
        variant="destructive"
        size="sm"
      >
        {formState.isSubmitting ? (
          <Loader2 className="animate-spin text-white" />
        ) : (
          <Trash2 />
        )}
        <span>Delete Exam</span>
      </Button>
    </form>
  );
}
