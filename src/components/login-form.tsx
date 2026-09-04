"use client";

import { useActionState } from "react";
import { login, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4" autoComplete="on">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">아이디</span>
        <input
          name="loginId"
          type="text"
          inputMode="text"
          required
          autoComplete="username"
          maxLength={40}
          spellCheck={false}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">비밀번호</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          maxLength={72}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-xl bg-stone-900 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
