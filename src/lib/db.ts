import Dexie, { type EntityTable } from "dexie";
import type { Rating } from "./colors";

export type DayEntry = {
  /** "YYYY-MM-DD" local date; primary key */
  date: string;
  rating: Rating;
  emoji?: string;
  note?: string;
  createdAt: number;
  /** Used for last-write-wins merging (import now, sync later). */
  updatedAt: number;
};

export const db = new Dexie("rate-your-day") as Dexie & {
  entries: EntityTable<DayEntry, "date">;
};

db.version(1).stores({
  entries: "date, updatedAt",
});
