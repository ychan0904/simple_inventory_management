import { formatDateTime } from "@/lib/format";
import { movementDelta, movementLabel } from "@/lib/movements";
import type { MovementType } from "@prisma/client";

type MovementItem = {
  id: string;
  type: MovementType;
  quantity: number;
  note: string | null;
  createdAt: Date;
};

export function MovementList({ movements }: { movements: MovementItem[] }) {
  if (movements.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-stone-500">
        이 기간에 수량 변경 기록이 없습니다.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {movements.map((movement) => {
        const delta = movementDelta(movement.type, movement.quantity);
        const plus = delta > 0;
        return (
          <li
            key={movement.id}
            className="rounded-2xl border border-stone-200 bg-white px-4 py-3"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">{movementLabel(movement.type)}</span>
              <span
                className={`tabular-nums font-bold ${
                  plus ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {plus ? "+" : ""}
                {delta}
              </span>
            </div>
            <div className="mt-1 text-xs text-stone-500">
              {formatDateTime(movement.createdAt)}
            </div>
            {movement.note ? (
              <div className="mt-1 text-sm text-stone-600">{movement.note}</div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
