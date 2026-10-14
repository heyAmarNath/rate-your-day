"use client";

import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { ratingColor, RATING_LABELS } from "@/lib/colors";
import { fromKey } from "@/lib/dates";
import { useEntry } from "@/lib/useEntries";

type Props = { date: string | null; onClose: () => void };

/** Read-only view of a past day. */
export function DayDetailSheet({ date, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const entry = useEntry(date ?? "");

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (date && !d.open) d.showModal();
    if (!date && d.open) d.close();
  }, [date]);

  const color = ratingColor(entry?.rating);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(26rem,calc(100%-2rem))] rounded-xl border border-border bg-surface p-0 text-fg backdrop:bg-black/50"
    >
      {date && (
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-muted">{format(fromKey(date), "EEEE")}</p>
              <h2 className="text-lg font-semibold">{format(fromKey(date), "MMMM d, yyyy")}</h2>
            </div>
            <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-muted hover:bg-empty" aria-label="Close">
              ✕
            </button>
          </div>
          {entry === undefined ? (
            <div className="h-20" />
          ) : entry ? (
            <>
              <div className="flex items-center gap-3 rounded-lg p-4 text-black/80" style={{ backgroundColor: color }}>
                <span className="text-2xl font-bold">{RATING_LABELS[entry.rating]}</span>
                {entry.emoji && <span className="ml-auto text-3xl">{entry.emoji}</span>}
              </div>
              {entry.note ? (
                <p className="mt-4 whitespace-pre-wrap break-words">{entry.note}</p>
              ) : (
                <p className="mt-4 text-sm text-muted">No note.</p>
              )}
            </>
          ) : (
            <p className="rounded-lg bg-empty p-4 text-muted">This day wasn&apos;t rated.</p>
          )}
          <p className="mt-4 text-xs text-muted">Past days are read-only.</p>
        </div>
      )}
    </dialog>
  );
}
