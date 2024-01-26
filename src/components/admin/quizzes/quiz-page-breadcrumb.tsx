"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// ICONS
import { ChevronRight, Home } from "lucide-react";

export default function QuizPageBreadcrumb({
  quizId,
  quizTitle,
}: {
  quizId: string;
  quizTitle: string;
}) {
  const pathname = usePathname();
  const isOnEditPage = pathname.endsWith("edit-quiz");
  const isOnQuizResultPage = pathname.endsWith("quiz-result");

  return (
    <nav className="flex w-fit items-center justify-center gap-2  [&>svg]:size-4 [&>svg]:text-gray-600">
      <Link
        href="/admin"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 rounded-full px-3 py-1",
        )}
      >
        <Home size={14} />
      </Link>
      <ChevronRight />
      <Link
        href="/admin/quizzes"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 rounded-full px-3 py-1 last:pointer-events-none",
        )}
      >
        Quizzes
      </Link>
      <ChevronRight />
      <Link
        href={`/admin/quizzes/${quizId}`}
        className={cn(
          buttonVariants({ variant: "outline" }),
          "h-8 rounded-full px-3 py-1 last:pointer-events-none",
        )}
      >
        {quizTitle}
      </Link>
      {isOnEditPage && (
        <>
          <ChevronRight />
          <Link
            href={`/admin/quizzes/${quizId}/edit-quiz`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 rounded-full px-3 py-1 last:pointer-events-none",
            )}
          >
            Edit Quiz
          </Link>
        </>
      )}
      {isOnQuizResultPage && (
        <>
          <ChevronRight />
          <Link
            href={`/admin/quizzes/${quizId}/view-result`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-8 rounded-full px-3 py-1",
            )}
          >
            Quiz Result
          </Link>
        </>
      )}
    </nav>
  );
}
