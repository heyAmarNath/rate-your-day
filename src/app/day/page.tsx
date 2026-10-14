"use client";

import { addDays, format } from "date-fns";
import { useState } from "react";
import { EmojiPicker } from "@/components/EmojiPicker";
import { PeriodNav } from "@/components/PeriodNav";
import { RatingPicker } from "@/components/RatingPicker";
import { ratingColor, RATING_LABELS, type Rating } from "@/lib/colors";
import { fromKey, toKey } from "@/lib/dates";
import { NOTE_MAX, upsertToday, type DayEntry } from "@/lib/entries";
import { useEntry, useToday } from "@/lib/useEntries";

export default function DayPage() {
  const today = useToday();
  return today ? <DayView today={today} /> : null;
}

function DayView({ today }: { today: string }) {
  // null = follow today (also rolls over at midnight)
  const [picked, setPicked] = useState<string | null>(null);
  const date = picked ?? today;
  const isToday = date === today;
  const entry = useEntry(date);

  const go = (delta: number) => {
    const next = toKey(addDays(fromKey(date), delta));
    setPicked(next >= today ? null : next);
  };

  return (
    <div className="mx-auto max-w-xl">
      <PeriodNav
        label={isToday ? "Today" : format(fromKey(date), "EEE, MMM d, yyyy")}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        onToday={() => setPicked(null)}
        nextDisabled={isToday}
        isCurrent={isToday}
      />
      {entry === undefined ? null : isToday ? (
        <TodayForm key={date} date={date} entry={entry ?? undefined} />
      ) : (
        <PastDay date={date} entry={entry ?? undefined} />
      )}
    </div>
  );
}

function DayCard({ date, rating, emoji }: { date: string; rating?: Rating; emoji?: string }) {
  const color = ratingColor(rating);
  return (
    <div
      className={`mb-6 flex h-36 items-center gap-4 rounded-2xl px-6 transition-colors ${color ? "text-black/80" : "bg-empty text-muted"}`}
      style={color ? { backgroundColor: color } : undefined}
    >
      <div className="flex-1">
        <p className="text-sm font-medium opacity-80">{format(fromKey(date), "EEEE, MMMM d")}</p>
        <p className="text-3xl font-bold">{rating ? RATING_LABELS[rating] : "Not rated"}</p>
      </div>
      {emoji && <span className="text-5xl">{emoji}</span>}
    </div>
  );
}

function TodayForm({ date, entry }: { date: string; entry?: DayEntry }) {
  const [rating, setRating] = useState<Rating | undefined>(entry?.rating);
  const [emoji, setEmoji] = useState<string | undefined>(entry?.emoji);
  const [note, setNote] = useState(entry?.note ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Every change is written immediately: IndexedDB writes are cheap and run in
  // order, and nothing is lost if the tab is closed right after typing.
  const save = async (next: { rating?: Rating; emoji?: string; note: string }) => {
    if (!next.rating) return; // nothing to save until a rating is picked
    setStatus("saving");
    try {
      await upsertToday(date, { rating: next.rating, emoji: next.emoji, note: next.note });
      setStatus("saved");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  };

  return (
    <>
      <DayCard date={date} rating={rating} emoji={emoji} />
      <section className="space-y-6 rounded-2xl border border-border bg-surface p-5">
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted">How was your day?</h2>
          <RatingPicker
            value={rating}
            onChange={(r) => {
              setRating(r);
              void save({ rating: r, emoji, note });
            }}
          />
        </div>
        <div>
          <h2 className="mb-3 text-sm font-medium text-muted">Mood (optional)</h2>
          <EmojiPicker
            value={emoji}
            onChange={(e) => {
              setEmoji(e);
              void save({ rating, emoji: e, note });
            }}
          />
        </div>
        <div>
          <label htmlFor="note" className="mb-3 block text-sm font-medium text-muted">
            Note (optional)
          </label>
          <textarea
            id="note"
            value={note}
            maxLength={NOTE_MAX}
            onChange={(e) => {
              setNote(e.target.value);
              void save({ rating, emoji, note: e.target.value });
            }}
            rows={4}
            placeholder="What made today what it was?"
            className="w-full resize-y rounded-lg border border-border bg-bg p-3 outline-none focus:border-fg"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>
              {!rating
                ? "Pick a rating to save."
                : status === "saving"
                  ? "Saving…"
                  : status === "error"
                    ? "Couldn't save. Try again."
                    : status === "saved"
                      ? "Saved"
                      : "You can change this until midnight."}
            </span>
            <span>
              {note.length}/{NOTE_MAX}
            </span>
          </div>
        </div>
      </section>
    </>
  );
}

function PastDay({ date, entry }: { date: string; entry?: DayEntry }) {
  return (
    <>
      <DayCard date={date} rating={entry?.rating} emoji={entry?.emoji} />
      <section className="rounded-2xl border border-border bg-surface p-5">
        {entry?.note ? (
          <p className="whitespace-pre-wrap break-words">{entry.note}</p>
        ) : (
          <p className="text-muted">{entry ? "No note." : "This day wasn't rated."}</p>
        )}
        <p className="mt-4 text-xs text-muted">Past days are read-only.</p>
      </section>
    </>
  );
}
