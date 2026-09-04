import { AppShell } from "@/components/app-shell";
import { CreateUserForm } from "@/components/create-user-form";
import { requireAdmin } from "@/lib/authz";

export const dynamic = "force-dynamic";

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <AppShell title="사용자 추가" backHref="/settings">
      <p className="mb-4 text-sm text-stone-500">
        추가한 계정은 일반 사용자입니다. 비밀번호 변경만 할 수 있습니다.
      </p>
      <CreateUserForm />
    </AppShell>
  );
}
