export function formatYmd(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function isYmd(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && formatYmd(date) === value;
}

export function parseYmd(value: string) {
  return new Date(`${value}T00:00:00`);
}

export function startOfDay(value: string) {
  return parseYmd(value);
}

export function endOfDay(value: string) {
  return new Date(`${value}T23:59:59.999`);
}

export function currentMonthRange(now = new Date()) {
  const from = new Date(now.getFullYear(), now.getMonth(), 1);
  const to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { from: formatYmd(from), to: formatYmd(to) };
}

export function resolveDateRange(fromParam?: string, toParam?: string) {
  const fallback = currentMonthRange();
  const from = isYmd(fromParam) ? fromParam : fallback.from;
  const to = isYmd(toParam) ? toParam : fallback.to;
  return from <= to ? { from, to } : { from: to, to: from };
}

export function formatDotDate(value: string) {
  const date = parseYmd(value);
  return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}`;
}

export function formatRangeLabel(from: string, to: string) {
  return `${formatDotDate(from)} ~ ${formatDotDate(to)}`;
}

export function monthLabel(year: number, monthIndex: number) {
  return `${year}년 ${monthIndex + 1}월`;
}

export function isSameMonthRange(from: string, to: string, now = new Date()) {
  const current = currentMonthRange(now);
  return from === current.from && to === current.to;
}
