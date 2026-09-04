import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "재고 관리",
  description: "심플 재고 관리",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full bg-stone-200 text-stone-900 antialiased">
        <div className="mx-auto min-h-dvh w-full max-w-[430px] bg-[#faf8f5] shadow-sm">
          {children}
        </div>
      </body>
    </html>
  );
}
