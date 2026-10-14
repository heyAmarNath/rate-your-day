"use client";

export const MOOD_EMOJIS = ["😄", "🙂", "😌", "🥰", "🤩", "😐", "😴", "😔", "😢", "😠", "😰", "🤒"];

type Props = { value?: string; onChange?: (e: string | undefined) => void; disabled?: boolean };

export function EmojiPicker({ value, onChange, disabled }: Props) {
  return (
    <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Mood emoji">
      {MOOD_EMOJIS.map((e) => {
        const selected = value === e;
        return (
          <button
            key={e}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={e}
            disabled={disabled}
            onClick={() => onChange?.(selected ? undefined : e)}
            className={`size-10 rounded-lg text-xl transition disabled:cursor-default ${
              selected ? "bg-accent/15 ring-2 ring-fg" : "enabled:hover:bg-empty"
            }`}
          >
            {e}
          </button>
        );
      })}
    </div>
  );
}
