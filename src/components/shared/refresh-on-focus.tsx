// src/app/components/refresh-on-focus.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RefreshOnFocus() {
  const router = useRouter();

  useEffect(() => {
    const onFocus = () => {
      router.refresh();
    };

    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, [router]);

  return null;
}
