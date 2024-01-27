import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteQuizModal } from "@/components/admin/quizzes/delete-quiz-modal";
// ICONS
import { Edit2, Eye, FileCheck2, MoreVertical } from "lucide-react";

export default function QuizTableActionMenu({ quizId }: { quizId: string }) {
  return (
    <div className="lg:hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="size-4 md:size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="bottom"
          align="end"
          sideOffset={8}
          alignOffset={8}
          className="space-y-2 p-0.5"
        >
          <DropdownMenuLabel>Quiz Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link
              href={`/admin/quizzes/${quizId}`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-fit w-full items-center justify-start space-x-2 p-0 [&>svg]:size-4",
              )}
            >
              <Eye />
              <span>Quiz Info</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/quizzes/${quizId}/quiz-result`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-fit w-full items-center justify-start space-x-2 p-0 [&>svg]:size-4",
              )}
            >
              <FileCheck2 />
              <span>Quiz Results</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/quizzes/${quizId}/edit-quiz`}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-fit w-full items-center justify-start space-x-2 p-0 [&>svg]:size-4",
              )}
            >
              <Edit2 />
              <span>Edit Quiz</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DeleteQuizModal quizId={quizId} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
