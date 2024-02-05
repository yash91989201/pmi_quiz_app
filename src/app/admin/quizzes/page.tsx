import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import URLSearchBox from "@/components/shared/url-search-box";
import QuizTable from "@/components/admin/quizzes/quiz-table";
import { Plus } from "lucide-react";

export default function QuizzesPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">All Exams</h2>
      <div className="flex  gap-3">
        <URLSearchBox />
        <Link
          href="/admin/quizzes/create-new-quiz"
          className={cn(
            buttonVariants(),
            "flex  w-fit items-center gap-2 md:h-full md:text-lg",
          )}
        >
          <Plus className="size-6 md:size-5" />
          <span className="hidden sm:block">New Exam</span>
        </Link>
      </div>

      <QuizTable searchParams={searchParams} />
    </div>
  );
}
