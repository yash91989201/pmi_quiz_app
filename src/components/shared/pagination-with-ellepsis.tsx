"use client";
// CUSTOM HOOKS
import { useSearchParams } from "next/navigation";
// UTILS
import { cn, paginationWithEllepsis } from "@/lib/utils";
// CUSTOM COMPONENTS
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationWtihEllepsis({
  hasPreviousPage,
  hasNextPage,
  total_page,
}: {
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  total_page: number;
}) {
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const per_page = Number(searchParams.get("per_page") ?? "5");

  const generateRouteParams = (page: number) => {
    const params = new URLSearchParams(searchParams);

    params.set("page", page.toString());
    params.set("per_page", per_page.toString());

    return `?${params?.toString()}`;
  };

  const paginatedItems = paginationWithEllepsis({
    current: page,
    max: total_page,
  }).items;

  return (
    <Pagination className="mx-0 w-fit">
      <PaginationContent>
        {hasPreviousPage && (
          <PaginationPrevious href={generateRouteParams(page - 1)} />
        )}

        {paginatedItems.map((item, index) => {
          if (item === "...")
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );

          return (
            <PaginationLink
              key={index}
              href={generateRouteParams(index + 1)}
              className={cn(
                "bg-white",
                index + 1 === page && "bg-primary text-white",
              )}
            >
              {index + 1}
            </PaginationLink>
          );
        })}

        {hasNextPage && <PaginationNext href={generateRouteParams(page + 1)} />}
      </PaginationContent>
    </Pagination>
  );
}
