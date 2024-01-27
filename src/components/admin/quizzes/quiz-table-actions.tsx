import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
// CUSTOM COMPONENTS
import { DeleteQuizModal } from "@/components/admin/quizzes/delete-quiz-modal";
import { buttonVariants } from "@/components/ui/button";
// ICONS
import { Edit2, Eye, FileCheck2 } from "lucide-react";

export default function QuizTableActions({ quizId }: { quizId: string }) {
  return (
    <div className="hidden space-x-3 lg:block">
      <Link
        title="View Quiz Info"
        href={`/admin/quizzes/${quizId}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-fit p-3 text-gray-700 hover:bg-amber-100 hover:text-amber-500 [&>svg]:size-4",
        )}
      >
        <Eye />
      </Link>
      <Link
        title="View Quiz Result"
        href={`/admin/quizzes/${quizId}/quiz-result`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-fit p-3 text-gray-700 hover:bg-green-100 hover:text-green-500 [&>svg]:size-4",
        )}
      >
        <FileCheck2 />
      </Link>
      <Link
        title="Edit Quiz"
        href={`/admin/quizzes/${quizId}/edit-quiz`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "h-fit p-3 text-gray-700 hover:bg-blue-100 hover:text-blue-500 [&>svg]:size-4",
        )}
      >
        <Edit2 />
      </Link>
      <DeleteQuizModal quizId={quizId} />
    </div>
  );
}
