import { beforeEach, describe, expect, it } from "vitest";
import { db } from "./db";
import { exportAll, getEntry, getRange, importAll, LockedDayError, upsertToday } from "./entries";
import { ratingColor } from "./colors";

const now = new Date(2026, 9, 14, 12, 0, 0); // 2026-10-14 local noon

beforeEach(async () => {
  await db.entries.clear();
});

describe("upsertToday", () => {
  it("saves and updates today's entry", async () => {
    await upsertToday("2026-10-14", { rating: 2, note: "meh" }, now);
    const later = new Date(2026, 9, 14, 23, 59);
    await upsertToday("2026-10-14", { rating: 5, emoji: "😄" }, later);
    const e = await getEntry("2026-10-14");
    expect(e?.rating).toBe(5);
    expect(e?.emoji).toBe("😄");
    expect(e?.note).toBeUndefined();
    expect(e?.createdAt).toBe(now.getTime());
    expect(e?.updatedAt).toBe(later.getTime());
  });

  it("rejects past and future days", async () => {
    await expect(upsertToday("2026-10-13", { rating: 3 }, now)).rejects.toBeInstanceOf(LockedDayError);
    await expect(upsertToday("2026-10-15", { rating: 3 }, now)).rejects.toBeInstanceOf(LockedDayError);
  });

  it("locks the day after midnight", async () => {
    const afterMidnight = new Date(2026, 9, 15, 0, 0, 1);
    await expect(upsertToday("2026-10-14", { rating: 3 }, afterMidnight)).rejects.toBeInstanceOf(LockedDayError);
  });

  it("rejects invalid ratings", async () => {
    // @ts-expect-error testing runtime validation
    await expect(upsertToday("2026-10-14", { rating: 6 }, now)).rejects.toThrow();
  });
});

describe("import/export", () => {
  it("round-trips and merges by updatedAt", async () => {
    await upsertToday("2026-10-14", { rating: 4 }, now);
    const backup = await exportAll(now);
    await db.entries.clear();

    const res1 = await importAll(backup);
    expect(res1).toEqual({ added: 1, updated: 0, skipped: 0, invalid: 0 });

    const res2 = await importAll({
      version: 1,
      entries: [
        { date: "2026-10-14", rating: 1, updatedAt: now.getTime() - 1 }, // older -> skipped
        { date: "2026-10-01", rating: 3, updatedAt: 5 }, // new past day -> added
        { date: "2026-10-02", rating: 9 }, // invalid
        { date: "nope", rating: 2 }, // invalid
      ],
    });
    expect(res2).toEqual({ added: 1, updated: 0, skipped: 1, invalid: 2 });
    expect((await getEntry("2026-10-14"))?.rating).toBe(4);

    const res3 = await importAll({ entries: [{ date: "2026-10-14", rating: 1, updatedAt: now.getTime() + 1 }] });
    expect(res3.updated).toBe(1);
    expect((await getRange("2026-10-01", "2026-10-31")).length).toBe(2);
  });

  it("rejects non-backup files", async () => {
    await expect(importAll({ foo: 1 })).rejects.toThrow();
  });
});

describe("colors", () => {
  it("maps ratings to colors", () => {
    expect(ratingColor(1)).toBe("#ef4444");
    expect(ratingColor(5)).toBe("#22c55e");
    expect(ratingColor(undefined)).toBeUndefined();
    expect(ratingColor(0)).toBeUndefined();
  });
});
