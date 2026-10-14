"use client";

import { addMonths, format, isSameMonth } from "date-fns";
import { useState } from "react";
import { DayTile } from "@/components/DayTile";
import { Legend } from "@/components/Legend";
import { PeriodNav } from "@/components/PeriodNav";
import { useDayClick } from "@/components/useDayClick";
import { dayStatus, fromKey, monthGridDays, toKey } from "@/lib/dates";
import { useRange, useToday } from "@/lib/useEntries";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function MonthPage() {
  const today = useToday();
  return today ? <MonthView today={today} /> : null;
}

function MonthView({ today }: { today: string }) {
  const [offset, setOffset] = useState(0);
  const anchor = addMonths(fromKey(today), offset);
  const days = monthGridDays(anchor);
  const entries = useRange(toKey(days[0]), toKey(days[days.length - 1]));
  const { onDayClick, sheet } = useDayClick(today);

  return (
    <>
      <PeriodNav
        label={format(anchor, "MMMM yyyy")}
        onPrev={() => setOffset((o) => o - 1)}
        onNext={() => setOffset((o) => o + 1)}
        onToday={() => setOffset(0)}
        nextDisabled={offset >= 0}
        isCurrent={offset === 0}
      />
      <div className="mx-auto max-w-xl">
        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center text-xs text-muted">
          {WEEKDAYS.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {days.map((d) => {
            const key = toKey(d);
            return (
              <DayTile
                key={key}
                date={d}
                entry={entries?.get(key)}
                status={dayStatus(key, today)}
                dimmed={!isSameMonth(d, anchor)}
                onClick={() => onDayClick(key)}
              />
            );
          })}
        </div>
        <Legend />
      </div>
      {sheet}
    </>
  );
}
