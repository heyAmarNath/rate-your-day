import { describe, expect, it } from "vitest";
import { dayStatus, fromKey, isValidKey, monthGridDays, toKey, weekDays, yearWeeks } from "./dates";

describe("dates", () => {
  it("round-trips local keys", () => {
    expect(toKey(fromKey("2026-03-29"))).toBe("2026-03-29");
    expect(isValidKey("2026-02-30")).toBe(false);
    expect(isValidKey("2026-2-3")).toBe(false);
    expect(isValidKey("2024-02-29")).toBe(true);
  });

  it("weeks start on Monday", () => {
    const days = weekDays(fromKey("2026-10-14")); // Wednesday
    expect(days.map(toKey)).toEqual([
      "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15",
      "2026-10-16", "2026-10-17", "2026-10-18",
    ]);
  });

  it("month grid covers full Mon–Sun weeks", () => {
    const days = monthGridDays(fromKey("2026-02-10"));
    expect(days.length % 7).toBe(0);
    expect(toKey(days[0])).toBe("2026-01-26");
    expect(toKey(days[days.length - 1])).toBe("2026-03-01");
  });

  it("year heatmap includes every day exactly once", () => {
    for (const year of [2024, 2026, 2027]) {
      const cells = yearWeeks(year).flat().filter(Boolean) as Date[];
      const expected = year % 4 === 0 ? 366 : 365;
      expect(cells.length).toBe(expected);
      expect(new Set(cells.map(toKey)).size).toBe(expected);
      expect(yearWeeks(year).length).toBeLessThanOrEqual(54);
    }
  });

  it("classifies day status", () => {
    expect(dayStatus("2026-10-13", "2026-10-14")).toBe("past");
    expect(dayStatus("2026-10-14", "2026-10-14")).toBe("today");
    expect(dayStatus("2026-10-15", "2026-10-14")).toBe("future");
  });
});
