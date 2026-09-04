"use client";

import { useActionState, useEffect, useState } from "react";
import type { MovementType } from "@prisma/client";
import { addStockMovement, type ActionState } from "@/app/actions";
import { MOVEMENT_OPTIONS } from "@/lib/movements";

const initialState: ActionState = {};

export function QuantityForm({ productId }: { productId: string }) {
  const [type, setType] = useState<MovementType>("SALE");
  const action = addStockMovement.bind(null, productId);
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (state.success) {
      window.alert(state.success);
    }
  }, [state.success, state.at]);

  return (
    <form action={formAction} className="flex flex-col gap-4 pb-24">
      <input type="hidden" name="type" value={type} />
      <div className="grid grid-cols-2 gap-2">
        {MOVEMENT_OPTIONS.map((option) => {
          const selected = type === option.type;
          return (
            <button
              key={option.type}
              type="button"
              onClick={() => setType(option.type)}
              className={`rounded-2xl border px-3 py-3 text-left ${
                selected
                  ? "border-stone-900 bg-stone-900 text-white"
                  : "border-stone-200 bg-white text-stone-800"
              }`}
            >
              <div className="text-base font-semibold">{option.label}</div>
              <div className={`mt-0.5 text-xs ${selected ? "text-stone-300" : "text-stone-500"}`}>
                {option.hint}
              </div>
            </button>
          );
        })}
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">수량</span>
        <input
          name="quantity"
          inputMode="numeric"
          required
          defaultValue={1}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-stone-600">메모 (선택)</span>
        <input
          name="note"
          maxLength={200}
          className="h-12 rounded-xl border border-stone-300 bg-white px-3 text-base outline-none focus:border-stone-500"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600">{state.error}</p>
      ) : null}
      <div className="fixed bottom-0 z-20 w-full max-w-[430px] bg-[#faf8f5]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 left-[max(0px,calc((100vw-430px)/2))]">
        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-xl bg-stone-900 text-base font-semibold text-white disabled:opacity-60"
        >
          {pending ? "반영 중..." : "수량 변경"}
        </button>
      </div>
    </form>
  );
}
