import { formatMoney, formatQty } from "@/lib/format";
import type { InventoryStats, PeriodCounts } from "@/lib/stats";

function profitClass(value: number) {
  if (value < 0) {
    return "text-red-600";
  }
  return "text-blue-500";
}

function EditIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m13.5 6.5 3 3" />
    </svg>
  );
}

export function StatsOverview({
  stats,
  costPrice,
  sellPrice,
  editHref,
}: {
  stats: InventoryStats;
  costPrice: number;
  sellPrice: number;
  editHref?: string;
}) {
  const counts = [
    { label: "현재", value: formatQty(stats.stock) },
    { label: "판매량", value: formatQty(stats.sold) },
    { label: "불량", value: formatQty(stats.defective) },
    { label: "환불", value: formatQty(stats.refunded) },
  ];
  const money = [
    { label: "총매출", value: formatMoney(stats.revenue), valueClass: "text-neutral-900" },
    { label: "순이익", value: formatMoney(stats.profit), valueClass: profitClass(stats.profit) },
    { label: "원가", value: formatMoney(costPrice), valueClass: "text-neutral-900" },
    { label: "판매가", value: formatMoney(sellPrice), valueClass: "text-neutral-900" },
  ];

  return (
    <section className="rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-neutral-900">수량</h2>
        {editHref ? (
          <a
            href={editHref}
            className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400"
            aria-label="수정"
          >
            <EditIcon />
          </a>
        ) : null}
      </div>

      <div className="mt-1.5 grid grid-cols-4 gap-1.5">
        {counts.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between gap-1 rounded-lg bg-[#f4f5f7] px-1.5 py-1.5"
          >
            <span className="shrink-0 text-[10px] leading-none text-neutral-400">{item.label}</span>
            <span className="min-w-0 truncate text-right text-[13px] font-bold leading-none tabular-nums text-neutral-900">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      <h2 className="mt-3 text-[13px] font-bold text-neutral-900">금액</h2>
      <div className="mt-1.5 overflow-hidden rounded-lg bg-[#f4f5f7]">
        <div className="grid grid-cols-2">
          {money.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${
                index % 2 === 1 ? "border-l border-neutral-200" : ""
              } ${index >= 2 ? "border-t border-neutral-200" : ""}`}
            >
              <span className="shrink-0 text-[10px] leading-none text-neutral-400">
                {item.label}
              </span>
              <span
                className={`min-w-0 truncate text-right text-[13px] font-bold leading-none tabular-nums ${item.valueClass}`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PeriodStats({ counts }: { counts: PeriodCounts }) {
  const items = [
    { label: "입고", value: formatQty(counts.inbound) },
    { label: "판매", value: formatQty(counts.sold) },
    { label: "불량", value: formatQty(counts.defective) },
    { label: "환불", value: formatQty(counts.refunded) },
  ];

  return (
    <section className="rounded-2xl bg-white px-3 py-2.5 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
      <h2 className="text-[13px] font-bold text-neutral-900">기간 수량</h2>
      <div className="mt-1.5 overflow-hidden rounded-lg bg-[#f4f5f7]">
        <div className="grid grid-cols-2">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`flex items-center justify-between gap-2 px-2.5 py-1.5 ${
                index % 2 === 1 ? "border-l border-neutral-200" : ""
              } ${index >= 2 ? "border-t border-neutral-200" : ""}`}
            >
              <span className="shrink-0 text-[10px] leading-none text-neutral-400">
                {item.label}
              </span>
              <span className="min-w-0 truncate text-right text-[13px] font-bold leading-none tabular-nums text-neutral-900">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
