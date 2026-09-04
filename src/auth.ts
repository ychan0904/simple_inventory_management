import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hashSync } from "bcryptjs";
import { authConfig } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { cleanText, validateLoginId } from "@/lib/validation";

const dummyHash = hashSync("invalid-password-placeholder", 10);

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        loginId: { label: "아이디", type: "text" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        const loginId =
          typeof credentials.loginId === "string"
            ? cleanText(credentials.loginId)
            : "";
        const password =
          typeof credentials.password === "string" ? credentials.password : "";

        if (validateLoginId(loginId) || password.length < 1 || password.length > 72) {
          await compare(password || "x", dummyHash);
          return null;
        }

        const user = await prisma.user.findUnique({ where: { loginId } });
        const matches = await compare(password, user?.passwordHash ?? dummyHash);
        if (!user || !matches) {
          return null;
        }

        return {
          id: user.id,
          loginId: user.loginId,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.loginId = user.loginId;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub && token.loginId && token.name && token.role) {
        session.user.id = token.sub;
        session.user.loginId = token.loginId;
        session.user.name = token.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
