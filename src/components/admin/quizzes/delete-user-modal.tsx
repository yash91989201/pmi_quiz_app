"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
// ACTIONS
import { deleteUser } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { DeleteUserSchema } from "@/lib/schema";
// TYPES
import type { DeleteUserSchemaType } from "@/lib/schema";
import type { SubmitHandler } from "react-hook-form";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// ICONS
import { CheckCircle2, Loader2, Trash2, XCircle } from "lucide-react";

export function DeleteUserModal({ id }: { id: string }) {
  const [actionResponse, setActionResponse] =
    useState<DeleteUserFormStatusType>();
  const deleteQuizModal = useToggle(false);
  const deleteQuizForm = useForm<DeleteUserSchemaType>({
    defaultValues: {
      id,
    },
    resolver: zodResolver(DeleteUserSchema),
  });
  const { handleSubmit, formState } = deleteQuizForm;

  const deleteUserAction: SubmitHandler<DeleteUserSchemaType> = async (
    data,
  ) => {
    const actionResponse = await deleteUser(data);
    setActionResponse(actionResponse);
    setTimeout(() => {
      setActionResponse(actionResponse);
      deleteQuizModal.close();
    }, 2000);
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
          <DialogTitle>Delete User</DialogTitle>
          <DialogDescription>
            This action will delete the user, all its data.
          </DialogDescription>
        </DialogHeader>
        <p className="my-3 text-gray-700">
          You will not be able to delete this user, if user is currently taking
          a quiz.
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
          <form onSubmit={handleSubmit(deleteUserAction)}>
            <Button
              className="w-full justify-between gap-3 [&>svg]:size-4"
              variant="destructive"
              type="submit"
            >
              <span>Delete User</span>
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
