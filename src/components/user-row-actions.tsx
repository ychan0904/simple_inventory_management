"use client";

import { deleteUser } from "@/app/actions";

export function UserRowActions({
  userId,
  name,
  canDelete,
}: {
  userId: string;
  name: string;
  canDelete: boolean;
}) {
  return (
    <div className="mt-2 flex justify-end gap-2">
      <a
        href={`/settings/users/${userId}/reset`}
        className="rounded-lg px-2 py-1 text-xs font-medium text-stone-500"
      >
        비밀번호 초기화
      </a>
      {canDelete ? (
        <form
          action={deleteUser}
          onSubmit={(event) => {
            if (!window.confirm(`${name} 계정을 삭제할까요?`)) {
              event.preventDefault();
            }
          }}
        >
          <input type="hidden" name="userId" value={userId} />
          <button type="submit" className="rounded-lg px-2 py-1 text-xs font-medium text-red-600">
            삭제
          </button>
        </form>
      ) : null}
    </div>
  );
}
