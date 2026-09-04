import type { ReactNode } from "react";

function SettingsIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.3 3.8 9.8 6.2a7.4 7.4 0 0 0-1.6.9l-2.3-.6-1.9 3.3 1.8 1.5a7 7 0 0 0 0 1.8l-1.8 1.5 1.9 3.3 2.3-.6c.5.4 1 .7 1.6.9l.5 2.4h3.8l.5-2.4c.6-.2 1.1-.5 1.6-.9l2.3.6 1.9-3.3-1.8-1.5a7 7 0 0 0 0-1.8l1.8-1.5-1.9-3.3-2.3.6a7.4 7.4 0 0 0-1.6-.9l-.5-2.4h-3.8Z"
      />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  );
}

export function AppShell({
  title,
  backHref,
  action,
  children,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-stone-200/80 bg-[#faf8f5]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-2">
          {backHref ? (
            <a
              href={backHref}
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 active:bg-stone-200"
              aria-label="뒤로"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 5 8 12l7 7"
                />
              </svg>
            </a>
          ) : (
            <div className="w-10" />
          )}
          <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold tracking-tight">
            {title}
          </h1>
          <div className="flex shrink-0 items-center justify-end">
            {action}
            <a
              href="/settings"
              className="flex h-10 w-10 items-center justify-center rounded-full text-stone-700 active:bg-stone-200"
              aria-label="설정"
            >
              <SettingsIcon />
            </a>
          </div>
        </div>
      </header>
      <main className="flex-1 px-4 py-4">{children}</main>
    </div>
  );
}
