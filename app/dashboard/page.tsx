import { SignOutButton } from "@/app/components/sign-out-button";
import { PageTransition, Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Trackdesk",
  description: "Your protected Trackdesk job search dashboard.",
};

const stats = [
  { label: "Saved roles", value: "24", note: "6 added this week" },
  { label: "Applications", value: "18", note: "4 awaiting replies" },
  { label: "Interviews", value: "7", note: "2 scheduled soon" },
  { label: "Offers", value: "2", note: "1 decision pending" },
];

const tasks = [
  {
    title: "Send follow-up",
    company: "Northstar Labs",
    due: "Today",
    stage: "Interview",
  },
  {
    title: "Prepare portfolio notes",
    company: "Signal Works",
    due: "Tomorrow",
    stage: "Screen",
  },
  {
    title: "Review offer details",
    company: "Vector Studio",
    due: "May 27",
    stage: "Offer",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <PageTransition>
        <header className="border-b border-white/10 bg-black">
          <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Trackdesk home"
            >
              <span className="grid size-8 place-items-center rounded-[8px] border border-white/15 bg-white text-sm font-bold text-black">
                T
              </span>
              <span className="text-sm font-semibold text-white">
                Trackdesk
              </span>
            </Link>
            <SignOutButton />
          </div>
        </header>

        <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
          <Reveal className="flex flex-col gap-4 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
                Protected dashboard
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Welcome back.
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Signed in as {user.email}
              </p>
            </div>
            <a
              className="inline-flex h-12 items-center justify-center rounded-[8px] bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200"
              href="#"
            >
              Add application
            </a>
          </Reveal>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((item, index) => (
              <Reveal key={item.label} delay={index * 0.06}>
                <article className="h-full rounded-[8px] border border-white/10 bg-zinc-950 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                    {item.label}
                  </p>
                  <p className="mt-4 text-4xl font-semibold text-white">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">{item.note}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
            <Reveal>
              <section className="rounded-[8px] border border-white/10 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                  <h2 className="text-lg font-semibold text-white">
                    Today&apos;s queue
                  </h2>
                  <span className="text-sm text-zinc-500">3 active items</span>
                </div>
                <div className="divide-y divide-white/10">
                  {tasks.map((task) => (
                    <article
                      key={`${task.company}-${task.title}`}
                      className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_auto] md:items-center"
                    >
                      <div>
                        <h3 className="font-medium text-white">
                          {task.title}
                        </h3>
                        <p className="mt-1 text-sm text-zinc-500">
                          {task.company}
                        </p>
                      </div>
                      <span className="w-fit rounded-[8px] border border-white/10 bg-black px-3 py-1 text-xs font-medium text-zinc-200">
                        {task.stage}
                      </span>
                      <span className="text-sm text-zinc-400">
                        {task.due}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            </Reveal>

            <Reveal delay={0.1}>
              <aside className="rounded-[8px] border border-white/10 bg-[linear-gradient(200deg,#262626_0%,#000000_72%)] p-5">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Search health
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-white">
                  Your pipeline is moving.
                </h2>
                <p className="mt-4 text-sm leading-6 text-zinc-400">
                  Keep your highest intent roles warm by closing follow-ups
                  before adding more applications.
                </p>
                <div className="mt-6 space-y-4">
                  {[
                    ["Follow-up coverage", "78%"],
                    ["Interview readiness", "64%"],
                    ["Offer comparison", "52%"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-zinc-400">{label}</span>
                        <span className="text-white">{value}</span>
                      </div>
                      <div className="h-2 rounded-[8px] bg-zinc-900">
                        <div
                          className="h-2 rounded-[8px] bg-white"
                          style={{ width: value }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </aside>
            </Reveal>
          </div>
        </section>
      </PageTransition>
    </main>
  );
}
