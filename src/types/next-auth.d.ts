import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    loginId: string;
    name: string;
    role: "ADMIN" | "USER" | "SUPERADMIN";
  }

  interface Session {
    user: {
      id: string;
      loginId: string;
      name: string;
      role: "ADMIN" | "USER" | "SUPERADMIN";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    loginId?: string;
    name?: string;
    role?: "ADMIN" | "USER" | "SUPERADMIN";
  }
}
