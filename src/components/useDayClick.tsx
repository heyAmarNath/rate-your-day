"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";

/** Opens the Day editor for today or a past day. Future tiles are disabled. */
export function useDayClick(today: string) {
  const router = useRouter();
  return useCallback(
    (key: string) => {
      if (key === today) router.push("/day");
      else if (key < today) router.push(`/day?date=${key}`);
    },
    [today, router],
  );
}
