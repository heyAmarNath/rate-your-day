import { isRating, type Rating } from "./colors";
import { db, type DayEntry } from "./db";
import { isValidKey, todayKey } from "./dates";

export type { DayEntry };

export const NOTE_MAX = 500;

export function getEntry(date: string): Promise<DayEntry | undefined> {
  return db.entries.get(date);
}

/** Entries with from <= date <= to (inclusive keys). */
export function getRange(from: string, to: string): Promise<DayEntry[]> {
  return db.entries.where("date").between(from, to, true, true).toArray();
}

export class LockedDayError extends Error {
  constructor(date: string) {
    super(`Future days can't be rated (tried ${date})`);
    this.name = "LockedDayError";
  }
}

export type DayInput = { rating: Rating; emoji?: string; note?: string };

/** The only write path from the UI: today and any past day; future days are rejected. */
export async function upsertDay(
  date: string,
  input: DayInput,
  now: Date = new Date(),
): Promise<DayEntry> {
  if (!isValidKey(date)) throw new Error(`Invalid date: ${date}`);
  if (date > todayKey(now)) throw new LockedDayError(date);
  if (!isRating(input.rating)) throw new Error("Rating must be 1–5");

  const ts = now.getTime();
  return db.transaction("rw", db.entries, async () => {
    const existing = await db.entries.get(date);
    const entry: DayEntry = {
      date,
      rating: input.rating,
      emoji: input.emoji || undefined,
      note: input.note?.slice(0, NOTE_MAX) || undefined,
      createdAt: existing?.createdAt ?? ts,
      updatedAt: ts,
    };
    await db.entries.put(entry);
    return entry;
  });
}

// ---------- Export / import ----------

export type ExportFile = { version: 1; exportedAt: string; entries: DayEntry[] };

export async function exportAll(now: Date = new Date()): Promise<ExportFile> {
  const entries = await db.entries.orderBy("date").toArray();
  return { version: 1, exportedAt: now.toISOString(), entries };
}

export type ImportResult = { added: number; updated: number; skipped: number; invalid: number };

function parseEntry(raw: unknown): DayEntry | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.date !== "string" || !isValidKey(r.date)) return null;
  if (!isRating(r.rating)) return null;
  const updatedAt = typeof r.updatedAt === "number" ? r.updatedAt : 0;
  const createdAt = typeof r.createdAt === "number" ? r.createdAt : updatedAt;
  return {
    date: r.date,
    rating: r.rating,
    emoji: typeof r.emoji === "string" && r.emoji ? r.emoji : undefined,
    note: typeof r.note === "string" && r.note ? r.note.slice(0, NOTE_MAX) : undefined,
    createdAt,
    updatedAt,
  };
}

/**
 * Restores a backup. Merges by date: the entry with the newer updatedAt wins.
 */
export async function importAll(data: unknown): Promise<ImportResult> {
  if (!data || typeof data !== "object" || !Array.isArray((data as ExportFile).entries)) {
    throw new Error("Not a Rate Your Day backup file");
  }
  const result: ImportResult = { added: 0, updated: 0, skipped: 0, invalid: 0 };
  const incoming: DayEntry[] = [];
  for (const raw of (data as ExportFile).entries) {
    const e = parseEntry(raw);
    if (e) incoming.push(e);
    else result.invalid++;
  }

  await db.transaction("rw", db.entries, async () => {
    const existing = await db.entries.bulkGet(incoming.map((e) => e.date));
    const toPut: DayEntry[] = [];
    incoming.forEach((e, i) => {
      const cur = existing[i];
      if (!cur) {
        result.added++;
        toPut.push(e);
      } else if (e.updatedAt > cur.updatedAt) {
        result.updated++;
        toPut.push(e);
      } else {
        result.skipped++;
      }
    });
    await db.entries.bulkPut(toPut);
  });
  return result;
}
