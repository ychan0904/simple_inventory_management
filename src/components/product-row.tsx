import type { Product } from "@prisma/client";
import { formatMoney, formatQty } from "@/lib/format";

export function ProductRow({ product }: { product: Product }) {
  return (
    <a
      href={`/products/${product.id}`}
      className="block rounded-2xl border border-stone-200 bg-white px-4 py-3.5 active:bg-stone-50"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-[15px] font-semibold text-stone-900">
            {product.name}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-stone-500">
            <span>원가 {formatMoney(product.costPrice)}</span>
            <span>판매 {formatMoney(product.sellPrice)}</span>
          </div>
        </div>
        <div className="shrink-0 text-right text-base font-bold tabular-nums text-stone-900">
          {formatQty(product.quantity)}
        </div>
      </div>
    </a>
  );
}
