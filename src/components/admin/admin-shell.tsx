import Link from "next/link";
import { GitBranch, LayoutDashboard } from "lucide-react";
import type { ReactNode } from "react";

import { BrandLogo } from "@/components/brand-logo";
import { SignOutButton } from "@/components/admin/sign-out-button";

type AdminShellProps = {
  adminEmail: string;
  children: ReactNode;
};

export function AdminShell({ adminEmail, children }: AdminShellProps) {
  return (
    <div className="min-h-dvh bg-transparent">
      <div className="mx-auto flex min-h-dvh w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-dvh w-72 shrink-0 border-r border-[#ead9f0]/80 bg-white/72 px-6 py-6 backdrop-blur md:block">
          <div className="flex items-center gap-3">
            <BrandLogo compact />
            <div>
              <p className="text-sm font-semibold text-[#2b1836]">Mwangiz</p>
              <p className="text-xs text-[#766a7c]">Rating System</p>
            </div>
          </div>

          <nav className="mt-10 space-y-2" aria-label="Admin navigation">
            <Link
              href="/admin"
              className="flex items-center gap-3 rounded-2xl bg-[#fff3c6] px-4 py-3 text-sm font-semibold text-[#4a3155]"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Dashboard
            </Link>
            <Link
              href="/admin/branches"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-[#4a3155] transition hover:bg-[#fbf7fc]"
            >
              <GitBranch className="size-4" aria-hidden="true" />
              Branches
            </Link>
          </nav>

          <div className="absolute inset-x-6 bottom-6 rounded-3xl border border-[#ead9f0] bg-white/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b17]">
              Signed in
            </p>
            <p className="mt-1 truncate text-sm text-[#4a3155]">{adminEmail}</p>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-[#ead9f0]/80 bg-[#fffaf0]/84 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a47b17]">
                  Admin Portal
                </p>
                <h1 className="truncate text-xl font-semibold text-[#2b1836] sm:text-2xl">
                  Customer Feedback Dashboard
                </h1>
              </div>
              <SignOutButton />
            </div>
            <nav className="mt-4 flex gap-2 md:hidden" aria-label="Admin navigation">
              <Link
                href="/admin"
                className="rounded-full bg-[#fff3c6] px-4 py-2 text-sm font-semibold text-[#4a3155]"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/branches"
                className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#4a3155]"
              >
                Branches
              </Link>
            </nav>
          </header>

          <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
