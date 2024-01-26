import Link from "next/link";
// UTILS
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
// CUSTOM COMPONENTS
import URLSearchBox from "@/components/shared/url-search-box";
import QuizTable from "@/components/admin/quizzes/quiz-table";

export default function QuizzesPage({
  searchParams,
}: {
  searchParams: { query?: string; page?: string; per_page?: string };
}) {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-base  md:text-3xl">All Quizzes</h2>
      <div className="flex gap-3">
        <URLSearchBox />
        <Link
          href="/admin/quizzes/create-new-quiz"
          className={cn(buttonVariants(), "h-full w-36 md:text-lg")}
        >
          New Quiz
        </Link>
      </div>

      <QuizTable searchParams={searchParams} />
    </div>
  );
}
