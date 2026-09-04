"use client";

import { useActionState } from "react";
import { changePassword, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(
    changePassword,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">현재 비밀번호</span>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          maxLength={72}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">새 비밀번호</span>
        <input
          name="newPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">새 비밀번호 확인</span>
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          minLength={8}
          maxLength={72}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="text-sm text-emerald-700">{state.success}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-xl bg-stone-900 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? "변경 중..." : "비밀번호 변경"}
      </button>
    </form>
  );
}
