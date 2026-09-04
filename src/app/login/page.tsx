import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-dvh flex-col justify-center px-5 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">재고 관리</h1>
      <p className="mt-2 text-sm text-stone-500">아이디와 비밀번호로 로그인하세요.</p>
      <div className="mt-8">
        <LoginForm />
      </div>
    </div>
  );
}
