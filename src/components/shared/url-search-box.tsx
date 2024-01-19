"use client";
// CUSTOM HOOKS
import useUrlSearch from "@/hooks/use-url-search";
// CUSTOM COMPONENT
import { Input } from "@/components/ui/input";
// ICONS
import { Search } from "lucide-react";

export default function URLSearchBox() {
  const { defaultSearchParamsValue, handleSearchInput } = useUrlSearch("query");

  return (
    <div className="flex w-full items-center rounded-lg border border-gray-400 p-3 py-0.5  focus-within:border-primary">
      <Search className="size-5" />
      <Input
        className="w-full border-0 focus-visible:ring-0 focus-visible:ring-transparent"
        placeholder="Search ..."
        onChange={(e) => handleSearchInput(e.target.value)}
        defaultValue={defaultSearchParamsValue}
      />
    </div>
  );
}
