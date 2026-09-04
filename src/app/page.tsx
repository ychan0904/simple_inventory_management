import { AppShell } from "@/components/app-shell";
import { ProductList } from "@/components/product-list";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await requireUser();
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AppShell title="상품 목록">
      <div className="pb-24">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-stone-300 px-4 py-16 text-center">
            <p className="text-stone-600">아직 상품이 없습니다.</p>
          </div>
        ) : (
          <ProductList products={products} />
        )}
      </div>
      <a
        href="/products/new"
        className="fixed bottom-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-stone-900 text-white shadow-lg right-[max(1rem,calc((100vw-430px)/2+1rem))]"
        aria-label="상품 추가"
      >
        <svg
          viewBox="0 0 24 24"
          className="block h-6 w-6"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10.5 3.5h3v7h7v3h-7v7h-3v-7h-7v-3h7v-7Z" />
        </svg>
      </a>
    </AppShell>
  );
}
