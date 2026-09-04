import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { HistoryCalendar } from "@/components/history-calendar";
import { MovementList } from "@/components/movement-list";
import { QuantityForm } from "@/components/quantity-form";
import { PeriodStats, StatsOverview } from "@/components/stats-cards";
import { requireUser } from "@/lib/authz";
import { endOfDay, resolveDateRange, startOfDay } from "@/lib/dates";
import { prisma } from "@/lib/prisma";
import { countsForMovements, statsForProduct } from "@/lib/stats";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string; from?: string; to?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const { tab, from: fromParam, to: toParam } = await searchParams;
  const currentTab = tab === "history" ? "history" : "change";
  const range = resolveDateRange(fromParam, toParam);

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      movements: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product) {
    notFound();
  }

  const rangeStart = startOfDay(range.from);
  const rangeEnd = endOfDay(range.to);
  const historyMovements = product.movements.filter(
    (movement) =>
      movement.createdAt >= rangeStart && movement.createdAt <= rangeEnd,
  );

  const historyHref = `/products/${product.id}?tab=history&from=${range.from}&to=${range.to}`;

  return (
    <AppShell title={product.name} backHref="/">
      <div className="grid grid-cols-2 rounded-xl bg-stone-200/70 p-1">
        <a
          href={`/products/${product.id}`}
          className={`rounded-lg py-2.5 text-center text-sm font-semibold ${
            currentTab === "change" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
          }`}
        >
          수량 변경
        </a>
        <a
          href={historyHref}
          className={`rounded-lg py-2.5 text-center text-sm font-semibold ${
            currentTab === "history" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500"
          }`}
        >
          히스토리
        </a>
      </div>

      <div className="mt-4">
        {currentTab === "history" ? (
          <PeriodStats counts={countsForMovements(historyMovements)} />
        ) : (
          <StatsOverview
            stats={statsForProduct(product)}
            costPrice={product.costPrice}
            sellPrice={product.sellPrice}
            editHref={`/products/${product.id}/edit`}
          />
        )}
      </div>

      <div className="mt-4">
        {currentTab === "change" ? (
          <QuantityForm productId={product.id} />
        ) : (
          <div className="flex flex-col gap-3">
            <HistoryCalendar
              productId={product.id}
              from={range.from}
              to={range.to}
            />
            <MovementList movements={historyMovements} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
