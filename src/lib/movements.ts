import { MovementType } from "@prisma/client";

export const MOVEMENT_OPTIONS: {
  type: MovementType;
  label: string;
  hint: string;
  sign: 1 | -1;
}[] = [
  { type: "INBOUND", label: "입고", hint: "물건 들어옴", sign: 1 },
  { type: "SALE", label: "판매", hint: "팔아서 나감", sign: -1 },
  { type: "DEFECTIVE", label: "불량", hint: "못 팔아서 빼기", sign: -1 },
  { type: "REFUND", label: "환불", hint: "다시 들어옴", sign: 1 },
];

export function movementDelta(type: MovementType, quantity: number) {
  const option = MOVEMENT_OPTIONS.find((item) => item.type === type);
  if (!option) {
    throw new Error("알 수 없는 수량 변경 유형입니다.");
  }
  return option.sign * quantity;
}

export function movementLabel(type: MovementType) {
  return MOVEMENT_OPTIONS.find((item) => item.type === type)?.label ?? type;
}
