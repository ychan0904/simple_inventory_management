import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ProductForm } from "@/components/product-form";
import { requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    notFound();
  }

  return (
    <AppShell title="상품 수정" backHref={`/products/${product.id}`}>
      <ProductForm product={product} />
    </AppShell>
  );
}
