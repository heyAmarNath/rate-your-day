import {
  addDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  parse,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

export const WEEK_OPTS = { weekStartsOn: 1 as const };

/** Local calendar date key, e.g. "2026-10-14". */
export function toKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function fromKey(key: string): Date {
  return parse(key, "yyyy-MM-dd", new Date());
}

export function isValidKey(key: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const d = fromKey(key);
  return !isNaN(d.getTime()) && toKey(d) === key;
}

export function todayKey(now: Date = new Date()): string {
  return toKey(now);
}

export function weekDays(anchor: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(anchor, WEEK_OPTS),
    end: endOfWeek(anchor, WEEK_OPTS),
  });
}

/** Full weeks (Mon–Sun) covering the month, for a calendar grid. */
export function monthGridDays(anchor: Date): Date[] {
  return eachDayOfInterval({
    start: startOfWeek(startOfMonth(anchor), WEEK_OPTS),
    end: endOfWeek(endOfMonth(anchor), WEEK_OPTS),
  });
}

/**
 * Columns of 7 (Mon–Sun) covering the year. Cells outside the year are null.
 */
export function yearWeeks(year: number): (Date | null)[][] {
  const first = startOfYear(new Date(year, 0, 1));
  const last = endOfYear(first);
  const weeks: (Date | null)[][] = [];
  let cursor = startOfWeek(first, WEEK_OPTS);
  while (cursor <= last) {
    const col: (Date | null)[] = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(cursor, i);
      col.push(d.getFullYear() === year ? d : null);
    }
    weeks.push(col);
    cursor = addDays(cursor, 7);
  }
  return weeks;
}

export type DayStatus = "past" | "today" | "future";

export function dayStatus(key: string, today: string): DayStatus {
  if (key === today) return "today";
  return key < today ? "past" : "future";
}
