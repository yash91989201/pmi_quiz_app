import { useDebouncedCallback } from "@react-hookz/web";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function useUrlSearch(searchParamKey: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultSearchParamsValue = searchParams.get(searchParamKey)?.toString();

  const handleSearchInput = useDebouncedCallback(
    (searchText: string) => {
      const params = new URLSearchParams(searchParams);

      if (searchText.length > 0) params.set(searchParamKey, searchText);
      else params.delete(searchParamKey);

      router.replace(`${pathname}?${params.toString()}`);
    },
    [router],
    500,
  );

  return {
    defaultSearchParamsValue,
    handleSearchInput,
  };
}
