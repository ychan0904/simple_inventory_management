"use client";

import { useActionState } from "react";
import { createProduct, type ActionState } from "@/app/actions";

const initialState: ActionState = {};

export function CreateProductForm() {
  const [state, formAction, pending] = useActionState(createProduct, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">상품 이름</span>
        <input
          name="name"
          required
          maxLength={80}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">초기 재고</span>
        <input
          name="quantity"
          inputMode="numeric"
          required
          defaultValue={0}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">개당 원가</span>
        <input
          name="costPrice"
          inputMode="numeric"
          required
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">판매가</span>
        <input
          name="sellPrice"
          inputMode="numeric"
          required
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
        {pending ? "저장 중..." : "상품 추가"}
      </button>
    </form>
  );
}
