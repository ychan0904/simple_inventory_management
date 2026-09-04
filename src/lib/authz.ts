import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    redirect("/login");
  }
  return user;
}

export function isStaff(role: string) {
  return role === "ADMIN" || role === "SUPERADMIN";
}

export async function requireAdmin() {
  const user = await requireUser();
  if (!isStaff(user.role)) {
    redirect("/");
  }
  return user;
}
