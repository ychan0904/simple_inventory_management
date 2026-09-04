"use client";

import { useMemo, useState } from "react";
import type { Product } from "@prisma/client";
import { ProductRow } from "@/components/product-row";

export function ProductList({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(keyword),
      ),
    [products, keyword],
  );

  return (
    <div className="flex flex-col gap-3">
      <label className="block">
        <span className="sr-only">상품명 검색</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="상품명 검색"
          className="h-12 w-full rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 px-4 py-10 text-center text-sm text-stone-500">
          검색 결과가 없습니다.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((product) => (
            <ProductRow key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
