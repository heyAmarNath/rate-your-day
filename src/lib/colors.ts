export type Rating = 1 | 2 | 3 | 4 | 5;

export const RATINGS: Rating[] = [1, 2, 3, 4, 5];

export const RATING_COLORS: Record<Rating, string> = {
  1: "#ef4444",
  2: "#f97316",
  3: "#eab308",
  4: "#84cc16",
  5: "#22c55e",
};

export const RATING_LABELS: Record<Rating, string> = {
  1: "Awful",
  2: "Bad",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export function isRating(n: unknown): n is Rating {
  return typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= 5;
}

/** Background color for a tile; undefined means "unrated" (styled via CSS). */
export function ratingColor(rating?: number): string | undefined {
  return isRating(rating) ? RATING_COLORS[rating] : undefined;
}
