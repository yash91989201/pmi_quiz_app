"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { deleteQuiz } from "@/server/actions/quiz";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { DeleteQuizFormSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type { DeleteQuizFormSchemaType } from "@/lib/schema";
// CUSTOM COMPONENTS
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// ICONS
import { CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";

export function DeleteQuizModal({ quizId }: { quizId: string }) {
  const [actionResponse, setActionResponse] =
    useState<DeleteQuizFormStatusType>();
  const deleteQuizModal = useToggle(false);
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
    setActionResponse(actionResponse);
    setTimeout(() => {
      setActionResponse({
        status: "UNINITIALIZED",
        message: "",
        errors: { message: "" },
      });
      deleteQuizModal.close();
    }, 3000);
  };

  return (
    <Dialog open={deleteQuizModal.isOpen} onOpenChange={deleteQuizModal.toggle}>
      <DialogTrigger asChild>
        <Button
          className="hover:bg-red-100 hover:text-red-500 [&>svg]:size-4"
          variant="ghost"
        >
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Quiz</DialogTitle>
          <DialogDescription>
            This action will delete the quiz, all its questions and options.
          </DialogDescription>
        </DialogHeader>
        <p className="my-3 text-gray-700">
          You will not be able to delete this quiz, if some user is currently
          taking this quiz.
        </p>
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
        <DialogFooter>
          <DialogTrigger asChild>
            <Button type="submit" variant="outline">
              Go Back
            </Button>
          </DialogTrigger>
          <form onSubmit={handleSubmit(deleteQuizAction)}>
            <Button
              className="w-full justify-between gap-3 [&>svg]:size-4"
              variant="destructive"
              type="submit"
            >
              <span>Delete Quiz</span>
              {formState.isSubmitting && (
                <Loader2 className="animate-spin text-white" />
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
