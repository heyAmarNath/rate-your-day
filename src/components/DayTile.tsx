"use client";

import { format } from "date-fns";
import { ratingColor, RATING_LABELS } from "@/lib/colors";
import type { DayStatus } from "@/lib/dates";
import type { DayEntry } from "@/lib/entries";

type Props = {
  date: Date;
  entry?: DayEntry;
  status: DayStatus;
  onClick?: () => void;
  /** "lg" week tiles, "md" month cells, "sm" year heatmap squares */
  size?: "sm" | "md" | "lg";
  dimmed?: boolean;
};

export function DayTile({ date, entry, status, onClick, size = "md", dimmed }: Props) {
  const color = ratingColor(entry?.rating);
  const isFuture = status === "future";
  const isToday = status === "today";
  const label = `${format(date, "EEEE, MMM d, yyyy")}${
    entry ? ` — ${RATING_LABELS[entry.rating]}` : isFuture ? "" : " — not rated"
  }`;

  const base =
    "relative flex items-center justify-center transition-transform disabled:cursor-default enabled:hover:scale-[1.04] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";
  const sizeCls =
    size === "sm"
      ? "aspect-square w-full rounded-[3px]"
      : size === "md"
        ? "aspect-square w-full rounded-md text-sm"
        : "aspect-[3/4] w-full flex-col gap-1 rounded-md sm:aspect-square";
  const ring = !isToday ? "" : size === "sm" ? "ring-2 ring-fg" : "ring-2 ring-fg ring-offset-2 ring-offset-bg";
  const fade = dimmed ? "opacity-35" : isFuture ? "opacity-40" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFuture || !onClick}
      title={label}
      aria-label={label}
      className={`${base} ${sizeCls} ${ring} ${fade} ${color ? "text-black/75" : "bg-empty text-muted"}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      {size === "md" && <span className="font-medium">{format(date, "d")}</span>}
      {size === "lg" && (
        <>
          <span className="text-xs font-medium uppercase opacity-80">{format(date, "EEE")}</span>
          <span className="text-xl font-semibold">{format(date, "d")}</span>
          <span className="h-6 text-lg leading-6">{entry?.emoji ?? ""}</span>
        </>
      )}
    </button>
  );
}
