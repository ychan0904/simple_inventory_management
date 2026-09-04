"use server";

import { AuthError } from "next-auth";
import { MovementType } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { requireAdmin, requireUser } from "@/lib/authz";
import { movementDelta } from "@/lib/movements";
import { prisma } from "@/lib/prisma";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import {
  getRequestKey,
  isRecordId,
  readFormInt,
  readFormText,
  validateLoginId,
  validateNote,
  validatePassword,
  validatePersonName,
  validateProductName,
} from "@/lib/validation";

export type ActionState = {
  error?: string;
  success?: string;
  at?: number;
};

const MOVEMENT_TYPES: MovementType[] = [
  "INBOUND",
  "SALE",
  "DEFECTIVE",
  "REFUND",
];

async function limited(prefix: string, limit: number, windowMs: number) {
  const key = clientKey(prefix, await getRequestKey());
  return rateLimit(key, limit, windowMs);
}

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const gate = await limited("login", 5, 10 * 60 * 1000);
  if (!gate.ok) {
    return { error: "로그인 시도가 너무 많습니다. 잠시 후 다시 시도하세요." };
  }

  const loginId = readFormText(formData, "loginId");
  const password = typeof formData.get("password") === "string"
    ? (formData.get("password") as string)
    : "";

  try {
    await signIn("credentials", {
      loginId,
      password,
      redirectTo: "/",
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "아이디 또는 비밀번호가 올바르지 않습니다." };
    }
    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const gate = await limited(`password:${user.id}`, 5, 10 * 60 * 1000);
  if (!gate.ok) {
    return { error: "비밀번호 변경 시도가 너무 많습니다. 잠시 후 다시 시도하세요." };
  }

  const currentPassword =
    typeof formData.get("currentPassword") === "string"
      ? (formData.get("currentPassword") as string)
      : "";
  const nextPassword =
    typeof formData.get("newPassword") === "string"
      ? (formData.get("newPassword") as string)
      : "";
  const confirmPassword =
    typeof formData.get("confirmPassword") === "string"
      ? (formData.get("confirmPassword") as string)
      : "";

  const passwordError = validatePassword(nextPassword);
  if (passwordError) {
    return { error: passwordError };
  }
  if (nextPassword !== confirmPassword) {
    return { error: "새 비밀번호가 서로 다릅니다." };
  }

  const matches = await compare(currentPassword, user.passwordHash);
  if (!matches) {
    return { error: "현재 비밀번호가 올바르지 않습니다." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await hash(nextPassword, 12) },
  });

  return { success: "비밀번호를 변경했습니다." };
}

export async function createUser(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const gate = await limited("create-user", 10, 10 * 60 * 1000);
  if (!gate.ok) {
    return { error: "요청이 너무 많습니다. 잠시 후 다시 시도하세요." };
  }

  const name = readFormText(formData, "name");
  const loginId = readFormText(formData, "loginId");
  const password =
    typeof formData.get("password") === "string"
      ? (formData.get("password") as string)
      : "";

  const nameError = validatePersonName(name);
  if (nameError) {
    return { error: nameError };
  }
  const loginError = validateLoginId(loginId);
  if (loginError) {
    return { error: loginError };
  }
  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  const exists = await prisma.user.findUnique({ where: { loginId } });
  if (exists) {
    return { error: "이미 사용 중인 아이디입니다." };
  }

  await prisma.user.create({
    data: {
      name,
      loginId,
      passwordHash: await hash(password, 12),
      role: "USER",
    },
  });

  revalidatePath("/settings");
  redirect("/settings");
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();

  const name = readFormText(formData, "name");
  const costPrice = readFormInt(formData, "costPrice", 1_000_000_000);
  const sellPrice = readFormInt(formData, "sellPrice", 1_000_000_000);
  const quantityRaw = readFormText(formData, "quantity");
  const quantity =
    quantityRaw === "" ? 0 : readFormInt(formData, "quantity", 1_000_000);
  const nameError = validateProductName(name);
  if (nameError) {
    return { error: nameError };
  }
  if (costPrice === null || costPrice < 0) {
    return { error: "원가를 숫자로 입력하세요." };
  }
  if (sellPrice === null || sellPrice < 0) {
    return { error: "판매가를 숫자로 입력하세요." };
  }
  if (quantity === null || quantity < 0) {
    return { error: "초기 재고는 0 이상 숫자로 입력하세요." };
  }

  const product = await prisma.product.create({
    data: {
      name,
      costPrice,
      sellPrice,
      quantity,
      movements:
        quantity > 0
          ? {
              create: {
                type: "INBOUND",
                quantity,
                note: "초기 재고",
              },
            }
          : undefined,
    },
  });

  redirect(`/products/${product.id}`);
}

export async function updateProduct(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();
  if (!isRecordId(productId)) {
    return { error: "잘못된 요청입니다." };
  }

  const name = readFormText(formData, "name");
  const costPrice = readFormInt(formData, "costPrice", 1_000_000_000);
  const sellPrice = readFormInt(formData, "sellPrice", 1_000_000_000);
  const nameError = validateProductName(name);
  if (nameError) {
    return { error: nameError };
  }
  if (costPrice === null || costPrice < 0) {
    return { error: "원가를 숫자로 입력하세요." };
  }
  if (sellPrice === null || sellPrice < 0) {
    return { error: "판매가를 숫자로 입력하세요." };
  }

  await prisma.product.update({
    where: { id: productId },
    data: { name, costPrice, sellPrice },
  });

  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  redirect(`/products/${productId}`);
}

export async function addStockMovement(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireUser();
  if (!isRecordId(productId)) {
    return { error: "잘못된 요청입니다." };
  }

  const type = readFormText(formData, "type") as MovementType;
  const quantity = readFormInt(formData, "quantity", 1_000_000);
  const note = readFormText(formData, "note");
  const noteError = validateNote(note);
  if (noteError) {
    return { error: noteError };
  }

  if (!MOVEMENT_TYPES.includes(type)) {
    return { error: "수량 변경 유형을 선택하세요." };
  }
  if (quantity === null || quantity <= 0) {
    return { error: "수량은 1 이상이어야 합니다." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new Error("상품을 찾을 수 없습니다.");
      }

      const nextQuantity = product.quantity + movementDelta(type, quantity);
      if (nextQuantity < 0) {
        throw new Error("재고가 부족합니다.");
      }

      await tx.stockMovement.create({
        data: {
          productId,
          type,
          quantity,
          note: note || null,
        },
      });

      await tx.product.update({
        where: { id: productId },
        data: { quantity: nextQuantity },
      });
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "수량 변경에 실패했습니다.",
    };
  }

  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  return { success: "수량이 변경되었습니다.", at: Date.now() };
}
