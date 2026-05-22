"use client";

import { SignOutButton } from "@/app/components/sign-out-button";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "Applications", href: "/applications" },
  { label: "Interviews", href: "#" },
  { label: "Offers", href: "#" },
];

type AppSidebarProps = {
  userEmail: string;
};

export function AppSidebar({ userEmail }: AppSidebarProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <aside className="border-b border-white/10 bg-zinc-950/80 px-5 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:border-b-0 lg:border-r lg:px-6">
      <div className="flex items-center justify-between gap-4 lg:block">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Trackdesk home"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border border-white/15 bg-white text-sm font-bold text-black">
            T
          </span>
          <span className="text-sm font-semibold text-white">Trackdesk</span>
        </Link>

        <div className="lg:hidden">
          <SignOutButton />
        </div>
      </div>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {navigationItems.map((item) => {
          const isActive = item.href !== "#" && pathname === item.href;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`relative whitespace-nowrap rounded-[8px] px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-black"
                  : "text-zinc-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive ? (
                <motion.span
                  className="absolute inset-0 rounded-[8px] bg-white"
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

      <div className="mt-6 hidden border-t border-white/10 pt-5 lg:block">
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
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
