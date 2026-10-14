"use client";

import { format } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { DayTile } from "@/components/DayTile";
import { RATING_LABELS, type Rating } from "@/lib/colors";
import { Legend } from "@/components/Legend";
import { PeriodNav } from "@/components/PeriodNav";
import { useDayClick } from "@/components/useDayClick";
import { dayStatus, fromKey, toKey, yearWeeks } from "@/lib/dates";
import { useRange, useToday } from "@/lib/useEntries";

const ROW_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

export default function YearPage() {
  const today = useToday();
  return today ? <YearView today={today} /> : null;
}

function YearView({ today }: { today: string }) {
  const currentYear = fromKey(today).getFullYear();
  const [year, setYear] = useState(currentYear);
  const weeks = useMemo(() => yearWeeks(year), [year]);
  const entries = useRange(`${year}-01-01`, `${year}-12-31`);
  const { onDayClick, sheet } = useDayClick(today);
  const scroller = useRef<HTMLDivElement>(null);

  // On narrow screens the heatmap scrolls; bring the current week into view.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    if (year !== currentYear) {
      el.scrollLeft = 0;
      return;
    }
    const tile = el.querySelector<HTMLElement>(`[data-key="${today}"]`);
    if (tile) el.scrollLeft = Math.max(0, tile.offsetLeft - el.clientWidth / 2);
  }, [year, currentYear, today]);

  // Month label goes on the first week column that contains the 1st of that month.
  const monthLabels = weeks.map((col) => {
    const first = col.find((d) => d && d.getDate() === 1);
    return first ? format(first, "MMM") : "";
  });

  const rated = entries ? entries.size : 0;
  const avg = entries && rated ? [...entries.values()].reduce((s, e) => s + e.rating, 0) / rated : 0;

  return (
    <>
      <PeriodNav
        label={String(year)}
        onPrev={() => setYear((y) => y - 1)}
        onNext={() => setYear((y) => y + 1)}
        onToday={() => setYear(currentYear)}
        nextDisabled={year >= currentYear}
        isCurrent={year === currentYear}
      />
      <p className="-mt-3 mb-5 text-sm text-muted">
        {rated} {rated === 1 ? "day" : "days"} rated{rated ? ` · on average ${RATING_LABELS[Math.round(avg) as Rating]}` : ""}
      </p>

      <div ref={scroller} className="relative overflow-x-auto pb-2">
        {/* Columns stretch to fill the width; below ~10px per cell it scrolls instead. */}
        <div
          className="grid min-w-[620px] gap-[3px]"
          style={{ gridTemplateColumns: `2rem repeat(${weeks.length}, minmax(0, 1fr))` }}
        >
          {monthLabels.map((m, w) =>
            m ? (
              <span
                key={`m${w}`}
                className="pb-1 text-[10px] whitespace-nowrap text-muted"
                style={{ gridColumn: w + 2, gridRow: 1 }}
              >
                {m}
              </span>
            ) : null,
          )}
          {ROW_LABELS.map((label, row) => (
            <span
              key={`r${row}`}
              className="flex items-center pr-1 text-[10px] leading-none text-muted"
              style={{ gridColumn: 1, gridRow: row + 2 }}
            >
              {label}
            </span>
          ))}
          {weeks.flatMap((col, w) =>
            col.map((d, row) => {
              if (!d) return null;
              const key = toKey(d);
              return (
                <div key={key} data-key={key} style={{ gridColumn: w + 2, gridRow: row + 2 }}>
                  <DayTile
                    date={d}
                    size="sm"
                    entry={entries?.get(key)}
                    status={dayStatus(key, today)}
                    onClick={() => onDayClick(key)}
                  />
                </div>
              );
            }),
          )}
        </div>
      </div>
      <Legend />
      {sheet}
    </>
  );
}
