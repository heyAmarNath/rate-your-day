"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { DayDetailSheet } from "./DayDetailSheet";

/** Today → Day page for editing; past → read-only sheet. Future tiles are disabled. */
export function useDayClick(today: string) {
  const router = useRouter();
  const [detail, setDetail] = useState<string | null>(null);

  const onDayClick = useCallback(
    (key: string) => {
      if (key === today) router.push("/day");
      else if (key < today) setDetail(key);
    },
    [today, router],
  );

  const sheet = <DayDetailSheet date={detail} onClose={() => setDetail(null)} />;
  return { onDayClick, sheet };
}
