"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useEffect, useMemo, useState } from "react";
import { todayKey } from "./dates";
import { getEntry, getRange, type DayEntry } from "./entries";

/**
 * Today's key; updates after local midnight and when the tab regains focus.
 * Empty string until mounted: pages are prerendered at build time, so the
 * server must not bake in the build date.
 */
export function useToday(): string {
  const [today, setToday] = useState("");
  useEffect(() => {
    const refresh = () => setToday(todayKey());
    refresh();
    const id = setInterval(refresh, 30_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);
  return today;
}

/**
 * undefined while loading, null when the day has no entry.
 * useLiveQuery keeps returning the previous result after `date` changes, so the
 * result is tagged with its date and discarded if it belongs to another day.
 */
export function useEntry(date: string): DayEntry | null | undefined {
  const res = useLiveQuery(
    async () => ({ date, entry: date ? ((await getEntry(date)) ?? null) : null }),
    [date],
  );
  return res && res.date === date ? res.entry : undefined;
}

/** Map of date key -> entry for the inclusive range. Undefined while loading. */
export function useRange(from: string, to: string): Map<string, DayEntry> | undefined {
  const list = useLiveQuery(() => getRange(from, to), [from, to]);
  return useMemo(() => (list ? new Map(list.map((e) => [e.date, e])) : undefined), [list]);
}
