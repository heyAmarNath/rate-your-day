"use client";

import { addWeeks, endOfWeek, format, isSameMonth, startOfWeek } from "date-fns";
import { useState } from "react";
import { DayTile } from "@/components/DayTile";
import { Legend } from "@/components/Legend";
import { PeriodNav } from "@/components/PeriodNav";
import { useDayClick } from "@/components/useDayClick";
import { dayStatus, fromKey, toKey, weekDays, WEEK_OPTS } from "@/lib/dates";
import { useRange, useToday } from "@/lib/useEntries";

export default function WeekPage() {
  const today = useToday();
  return today ? <WeekView today={today} /> : null;
}

function WeekView({ today }: { today: string }) {
  const [offset, setOffset] = useState(0);
  const anchor = addWeeks(fromKey(today), offset);
  const days = weekDays(anchor);
  const entries = useRange(toKey(days[0]), toKey(days[6]));
  const onDayClick = useDayClick(today);

  const start = startOfWeek(anchor, WEEK_OPTS);
  const end = endOfWeek(anchor, WEEK_OPTS);
  const label = isSameMonth(start, end)
    ? `${format(start, "MMM d")} – ${format(end, "d, yyyy")}`
    : `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;

  return (
    <>
      <PeriodNav
        label={offset === 0 ? "This week" : label}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        onToday={() => setOffset(0)}
        nextDisabled={offset >= 0}
        isCurrent={offset === 0}
      />
      {offset === 0 && <p className="-mt-3 mb-5 text-sm text-muted">{label}</p>}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {days.map((d) => {
          const key = toKey(d);
          return (
            <DayTile
              key={key}
              date={d}
              size="lg"
              entry={entries?.get(key)}
              status={dayStatus(key, today)}
              onClick={() => onDayClick(key)}
            />
          );
        })}
      </div>
      <Legend />
    </>
  );
}
