"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  currentMonthRange,
  formatRangeLabel,
  formatYmd,
  monthLabel,
  parseYmd,
} from "@/lib/dates";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function buildCells(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startOffset = first.getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: { date: Date; inMonth: boolean }[] = [];

  for (let i = 0; i < startOffset; i += 1) {
    const date = new Date(year, monthIndex, i - startOffset + 1);
    cells.push({ date, inMonth: false });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ date: new Date(year, monthIndex, day), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    });
  }
  return cells;
}

export function HistoryCalendar({
  productId,
  from,
  to,
}: {
  productId: string;
  from: string;
  to: string;
}) {
  const router = useRouter();
  const initial = parseYmd(from);
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [draftStart, setDraftStart] = useState<string | null>(null);

  const cells = useMemo(
    () => buildCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function openPicker() {
    const start = parseYmd(from);
    setViewYear(start.getFullYear());
    setViewMonth(start.getMonth());
    setDraftStart(null);
    setOpen(true);
  }

  function closePicker() {
    setDraftStart(null);
    setOpen(false);
  }

  function goToRange(nextFrom: string, nextTo: string) {
    const start = nextFrom <= nextTo ? nextFrom : nextTo;
    const end = nextFrom <= nextTo ? nextTo : nextFrom;
    router.replace(
      `/products/${productId}?tab=history&from=${start}&to=${end}`,
    );
  }

  function selectDay(date: Date) {
    const ymd = formatYmd(date);
    if (!draftStart) {
      setDraftStart(ymd);
      return;
    }
    goToRange(draftStart, ymd);
    setDraftStart(null);
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  }

  function selectThisMonth() {
    const range = currentMonthRange();
    setDraftStart(null);
    goToRange(range.from, range.to);
    setOpen(false);
  }

  const today = formatYmd(new Date());
  const rangeStart = draftStart ?? from;
  const rangeEnd = draftStart ?? to;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => (open ? closePicker() : openPicker())}
        className="relative flex h-12 w-full items-center justify-center rounded-xl border border-stone-300 bg-white px-10"
      >
        <span className="text-center text-[15px] tabular-nums text-stone-800">
          {formatRangeLabel(from, to)}
        </span>
        <span className="absolute right-3 text-stone-400" aria-hidden>
          ▾
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 z-20"
            aria-label="닫기"
            onClick={closePicker}
          />
          <div className="absolute left-0 right-0 top-full z-30 mt-1 rounded-2xl border border-stone-200 bg-white px-3 py-3 shadow-lg">
            <div className="flex items-center justify-between gap-2 px-1">
              <p className="text-sm font-semibold">기간 선택</p>
              <button
                type="button"
                onClick={selectThisMonth}
                className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-700"
              >
                이번 달
              </button>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-stone-600 active:bg-stone-100"
                aria-label="이전 달"
              >
                ‹
              </button>
              <div className="text-sm font-semibold">
                {monthLabel(viewYear, viewMonth)}
              </div>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-lg text-stone-600 active:bg-stone-100"
                aria-label="다음 달"
              >
                ›
              </button>
            </div>

            <div className="mt-1 grid grid-cols-7 text-center text-[11px] font-medium text-stone-400">
              {WEEKDAYS.map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {cells.map(({ date, inMonth }) => {
                const ymd = formatYmd(date);
                const start = rangeStart <= rangeEnd ? rangeStart : rangeEnd;
                const end = rangeStart <= rangeEnd ? rangeEnd : rangeStart;
                const selected = ymd >= start && ymd <= end;
                const isStart = ymd === start;
                const isEnd = ymd === end;
                const isToday = ymd === today;

                return (
                  <button
                    key={ymd + String(inMonth)}
                    type="button"
                    onClick={() => selectDay(date)}
                    className={`h-10 text-sm tabular-nums ${
                      selected && !isStart && !isEnd ? "bg-stone-100" : ""
                    } ${isStart && isEnd ? "rounded-full bg-stone-900 text-white" : ""} ${
                      isStart && !isEnd ? "rounded-l-full bg-stone-900 text-white" : ""
                    } ${isEnd && !isStart ? "rounded-r-full bg-stone-900 text-white" : ""} ${
                      !selected && isToday ? "font-bold text-stone-900" : ""
                    } ${!selected && !inMonth ? "text-stone-300" : ""} ${
                      !selected && inMonth ? "text-stone-800" : ""
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            <p className="mt-2 px-1 text-center text-xs text-stone-500">
              {draftStart
                ? "끝나는 날을 눌러 주세요"
                : formatRangeLabel(from, to)}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
