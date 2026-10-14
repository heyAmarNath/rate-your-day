"use client";

type Props = {
  label: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  nextDisabled?: boolean;
  isCurrent?: boolean;
};

const btn =
  "rounded-md border border-border bg-surface px-3 py-1.5 text-sm enabled:hover:bg-empty disabled:opacity-40";

export function PeriodNav({ label, onPrev, onNext, onToday, nextDisabled, isCurrent }: Props) {
  return (
    <div className="mb-5 flex items-center justify-between gap-2">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{label}</h1>
      <div className="flex shrink-0 gap-1.5">
        <button type="button" className={btn} onClick={onToday} disabled={isCurrent}>
          Today
        </button>
        <button type="button" className={btn} onClick={onPrev} aria-label="Previous">
          ‹
        </button>
        <button type="button" className={btn} onClick={onNext} disabled={nextDisabled} aria-label="Next">
          ›
        </button>
      </div>
    </div>
  );
}
