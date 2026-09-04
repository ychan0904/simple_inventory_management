export function formatMoney(value: number) {
  return value.toLocaleString("ko-KR");
}

export function formatQty(value: number) {
  return `${value.toLocaleString("ko-KR")}개`;
}

export function formatDateTime(value: Date) {
  return value.toLocaleString("ko-KR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
