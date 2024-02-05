"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// ACTIONS
import { updateCertificate } from "@/server/actions/user";
// CUSTOM HOOKS
import useToggle from "@/hooks/use-toggle";
// SCHEMAS
import { UpdateCertificateSchema } from "@/lib/schema";
// TYPES
import type { SubmitHandler } from "react-hook-form";
import type {
  UpdateCertificateSchemaType,
  UserQuizStatusType,
} from "@/lib/schema";
// CUSTOM COMPONENTS
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// ICONS
import { Loader2, ScrollText } from "lucide-react";

export function UpdateCertificateModal({
  userQuizId,
  userQuizStatus,
}: {
  userQuizId: string;
  userQuizStatus: UserQuizStatusType;
}) {
  const updateCertificateModal = useToggle(false);
  const updateCertificateForm = useForm<{
    certificateId: string;
    userQuizId: string;
  }>({
    defaultValues: {
      userQuizId,
      certificateId: "",
    },
    resolver: zodResolver(UpdateCertificateSchema),
    shouldUseNativeValidation: true,
  });
  const { handleSubmit, formState, control } = updateCertificateForm;

  const updateCertificateAction: SubmitHandler<
    UpdateCertificateSchemaType
  > = async (data) => {
    const actionResponse = await updateCertificate(data);
    if (actionResponse.status === "SUCCESS") {
      updateCertificateModal.close();
      toast.success(actionResponse.message);
    }
    if (actionResponse.status === "FAILED") {
      toast.error(actionResponse.message);
    }
  };

  return (
    <Dialog
      open={updateCertificateModal.isOpen}
      onOpenChange={updateCertificateModal.toggle}
    >
      <DialogTrigger disabled={userQuizStatus === "NOT_STARTED"} asChild>
        <Button
          title="Update exam certificate"
          className="h-fit gap-2 space-x-2  px-4 py-2 hover:bg-blue-100 hover:text-blue-500 lg:h-10"
          variant="ghost"
        >
          <ScrollText className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update exam certificate</DialogTitle>
          <DialogDescription>
            This action will delete the user, all its data.
          </DialogDescription>
        </DialogHeader>
        <Form {...updateCertificateForm}>
          <form
            onSubmit={handleSubmit(updateCertificateAction)}
            className="flex flex-col gap-6"
          >
            <FormField
              name="certificateId"
              control={control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Id</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Input {...field} placeholder="Enter certificate id" />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              className="flex w-fit gap-3  [&>svg]:size-4"
              type="submit"
              disabled={formState.isSubmitting}
            >
              <span>Update</span>
              {formState.isSubmitting && (
                <Loader2 className="animate-spin text-white" />
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
