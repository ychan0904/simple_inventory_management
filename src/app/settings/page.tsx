import { logout } from "@/app/actions";
import { AppShell } from "@/components/app-shell";
import { ChangePasswordForm } from "@/components/change-password-form";
import { UserRowActions } from "@/components/user-row-actions";
import { isStaff, requireUser } from "@/lib/authz";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function ProfileSection({
  name,
  loginId,
}: {
  name: string;
  loginId: string;
}) {
  return (
    <>
      <section className="rounded-2xl border border-stone-200 bg-white px-4 py-4">
        <div className="text-sm text-stone-500">로그인 계정</div>
        <div className="mt-1 text-base font-semibold">{name}</div>
        <div className="mt-0.5 text-sm text-stone-500">{loginId}</div>
      </section>

      <section className="mt-5">
        <h2 className="mb-3 text-sm font-semibold text-stone-700">비밀번호 변경</h2>
        <ChangePasswordForm />
      </section>

      <form action={logout} className="mt-8 pb-4">
        <button type="submit" className="w-full text-center text-sm text-stone-400">
          로그아웃
        </button>
      </form>
    </>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const currentUser = await requireUser();
  const { tab } = await searchParams;
  const canManageUsers = isStaff(currentUser.role);
  const currentTab = canManageUsers && tab === "users" ? "users" : "profile";

  const users =
    canManageUsers && currentTab === "users"
      ? await prisma.user.findMany({
          where: { role: { not: "SUPERADMIN" } },
          orderBy: [{ role: "asc" }, { name: "asc" }],
          select: {
            id: true,
            name: true,
            loginId: true,
            role: true,
          },
        })
      : [];

  return (
    <AppShell title="설정" backHref="/">
      {canManageUsers ? (
        <div className="mb-4 grid grid-cols-2 rounded-xl bg-stone-200/70 p-1">
          <a
            href="/settings"
            className={`rounded-lg py-2.5 text-center text-sm font-semibold ${
              currentTab === "profile"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500"
            }`}
          >
            개인정보
          </a>
          <a
            href="/settings?tab=users"
            className={`rounded-lg py-2.5 text-center text-sm font-semibold ${
              currentTab === "users"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-500"
            }`}
          >
            사용자 목록
          </a>
        </div>
      ) : null}

      {currentTab === "users" ? (
        <section>
          <div className="mb-3 flex justify-end">
            <a
              href="/settings/users/new"
              className="rounded-full bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white"
            >
              사용자 추가
            </a>
          </div>
          <ul className="flex flex-col gap-2">
            {users.map((user) => (
              <li
                key={user.id}
                className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-semibold">{user.name}</div>
                    <div className="mt-0.5 text-sm text-stone-500">{user.loginId}</div>
                  </div>
                  <span className="shrink-0 text-xs text-stone-500">
                    {user.role === "ADMIN" ? "관리자" : "일반"}
                  </span>
                </div>
                <UserRowActions
                  userId={user.id}
                  name={user.name}
                  canDelete={user.id !== currentUser.id}
                />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <ProfileSection name={currentUser.name} loginId={currentUser.loginId} />
      )}
    </AppShell>
  );
}
