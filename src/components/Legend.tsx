import { RATING_COLORS, RATING_LABELS, RATINGS } from "@/lib/colors";

export function Legend() {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
      <span className="flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-empty" /> Not rated
      </span>
      {RATINGS.map((r) => (
        <span key={r} className="flex items-center gap-1.5">
          <span className="size-3 rounded-sm" style={{ backgroundColor: RATING_COLORS[r] }} /> {RATING_LABELS[r]}
        </span>
      ))}
    </div>
  );
}
