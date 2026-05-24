"use client";

import { SignOutButton } from "@/app/components/sign-out-button";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Applications", href: "/applications" },
  { label: "Employers", href: "/employers" },
  // { label: "Offers", href: "#" },
  { label: "Settings", href: "/settings" },
];

type AppSidebarProps = {
  userEmail: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="border-b border-emerald-300/10 bg-zinc-950/85 px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-6">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link
          href="/dashboard"
          className="flex items-center gap-3"
          aria-label="Tracklio home"
        >
          <span className="text-sm font-semibold text-white">Tracklio</span>
        </Link>

        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigationItems.map((item) => {
          const isActive =
            item.href !== "#" &&
            (pathname === item.href ||
              (item.href !== "/dashboard" &&
                pathname.startsWith(`${item.href}/`)));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative whitespace-nowrap rounded-[8px] px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-black"
                  : "text-zinc-400 hover:bg-emerald-300/5 hover:text-emerald-100"
              }`}
            >
              {isActive ? (
                <motion.span
                  className="absolute inset-0 rounded-[8px] bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.24)]"
                  layoutId="app-sidebar-active-link"
                  transition={
                    shouldReduceMotion
                      ? { duration: 0 }
                      : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
                  }
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 hidden border-t border-emerald-300/10 pt-5 lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-300/70">
          Account
        </p>
        <p className="mt-3 break-words text-sm leading-6 text-zinc-300">
          {userEmail}
        </p>
      </div>

      <div className="mt-auto hidden pt-6 lg:block">
        <SignOutButton className="w-full cursor-pointer" />
      </div>
    </aside>
  );
}
