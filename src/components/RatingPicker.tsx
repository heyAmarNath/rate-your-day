"use client";

import { RATING_COLORS, RATING_LABELS, RATINGS, type Rating } from "@/lib/colors";

type Props = { value?: Rating; onChange?: (r: Rating) => void; disabled?: boolean };

export function RatingPicker({ value, onChange, disabled }: Props) {
  return (
    <div role="radiogroup" aria-label="Rating" className="grid grid-cols-5 gap-2">
      {RATINGS.map((r) => {
        const selected = value === r;
        return (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled}
            onClick={() => onChange?.(r)}
            className={`flex items-center justify-center rounded-lg py-4 text-black/80 transition enabled:hover:brightness-105 disabled:cursor-default ${
              selected ? "ring-2 ring-fg ring-offset-2 ring-offset-surface" : value && "opacity-50"
            }`}
            style={{ backgroundColor: RATING_COLORS[r] }}
          >
            <span className="text-sm font-semibold sm:text-base">{RATING_LABELS[r]}</span>
          </button>
        );
      })}
    </div>
  );
}
