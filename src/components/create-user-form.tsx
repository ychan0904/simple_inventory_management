"use client";

import { useActionState } from "react";
import { createUser, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function CreateUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">이름</span>
        <input
          name="name"
          required
          maxLength={40}
          autoComplete="name"
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">아이디</span>
        <input
          name="loginId"
          type="text"
          inputMode="text"
          required
          maxLength={40}
          autoComplete="off"
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
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="h-12 rounded-xl bg-stone-900 text-base font-semibold text-white disabled:opacity-60"
      >
        {pending ? "추가 중..." : "사용자 추가"}
      </button>
    </form>
  );
}
