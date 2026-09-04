import type { MovementType } from "@prisma/client";

type MovementLike = {
  type: MovementType;
  quantity: number;
};

type ProductLike = {
  quantity: number;
  costPrice: number;
  sellPrice: number;
  movements: MovementLike[];
};

export type InventoryStats = {
  stock: number;
  sold: number;
  defective: number;
  refunded: number;
  revenue: number;
  profit: number;
};

export type PeriodCounts = {
  inbound: number;
  sold: number;
  defective: number;
  refunded: number;
};

export function countsForMovements(movements: MovementLike[]): PeriodCounts {
  let inbound = 0;
  let sold = 0;
  let refunded = 0;
  let defective = 0;

  for (const movement of movements) {
    if (movement.type === "INBOUND") {
      inbound += movement.quantity;
    } else if (movement.type === "SALE") {
      sold += movement.quantity;
    } else if (movement.type === "REFUND") {
      refunded += movement.quantity;
    } else if (movement.type === "DEFECTIVE") {
      defective += movement.quantity;
    }
  }

  return { inbound, sold, defective, refunded };
}

export function statsForProduct(product: ProductLike): InventoryStats {
  let sold = 0;
  let refunded = 0;
  let defective = 0;

  for (const movement of product.movements) {
    if (movement.type === "SALE") {
      sold += movement.quantity;
    } else if (movement.type === "REFUND") {
      refunded += movement.quantity;
    } else if (movement.type === "DEFECTIVE") {
      defective += movement.quantity;
    }
  }

  const netSold = sold - refunded;
  const revenue = netSold * product.sellPrice;
  const profit = (product.sellPrice - product.costPrice) * netSold;

  return {
    stock: product.quantity,
    sold,
    defective,
    refunded,
    revenue,
    profit,
  };
}
