"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

export default function RowsPerPage({ per_page }: { per_page: number }) {
  const rows = [5, 10, 15, 20, 25, 30];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRowsPerPageChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    const currentPage = params.get("page");

    if (currentPage == null) {
      params.set("page", "1");
    }

    params.set("per_page", value);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <p className="text-sm text-gray-800">Rows per page</p>
      <Select
        onValueChange={handleRowsPerPageChange}
        defaultValue={per_page.toString()}
      >
        <SelectTrigger className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {rows.map((row, index) => (
            <SelectItem key={index} value={row.toString()}>
              {row}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
