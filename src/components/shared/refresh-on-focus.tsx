// src/app/components/refresh-on-focus.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RefreshOnFocus() {
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
