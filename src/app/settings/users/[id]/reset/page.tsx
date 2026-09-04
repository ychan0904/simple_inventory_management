import { notFound } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { ResetUserPasswordForm } from "@/components/reset-user-password-form";
import { requireAdmin } from "@/lib/authz";
import { prisma } from "@/lib/prisma";
import { isRecordId } from "@/lib/validation";

export const dynamic = "force-dynamic";

export default async function ResetUserPasswordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!isRecordId(id)) {
    notFound();
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { name: true, loginId: true, role: true },
  });
  if (!user || user.role === "SUPERADMIN") {
    notFound();
  }

  return (
    <AppShell title="비밀번호 초기화" backHref="/settings?tab=users">
      <p className="mb-4 text-sm text-stone-500">
        {user.name} ({user.loginId}) 비밀번호를 관리자가 지정한 값으로 바꿉니다.
      </p>
      <ResetUserPasswordForm userId={id} />
    </AppShell>
  );
}
