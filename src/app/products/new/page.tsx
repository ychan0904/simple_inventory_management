import { AppShell } from "@/components/app-shell";
import { CreateProductForm } from "@/components/create-product-form";
import { requireUser } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  await requireUser();
  return (
    <AppShell title="상품 추가" backHref="/">
      <CreateProductForm />
    </AppShell>
  );
}
