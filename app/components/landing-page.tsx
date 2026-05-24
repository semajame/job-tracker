import Link from "next/link";
import type { ReactNode } from "react";
import { PageTransition, Reveal } from "./motion-effects";

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary";
};

const pipeline = [
  { label: "Saved", value: "24", change: "+6 this week" },
  { label: "Applied", value: "18", change: "72% complete" },
  { label: "Interview", value: "7", change: "3 follow-ups" },
  { label: "Offer", value: "2", change: "1 pending" },
];

const jobs = [
  {
    role: "Product Designer",
    company: "Northstar Labs",
    stage: "Interview",
    due: "Today",
  },
  {
    role: "Frontend Engineer",
    company: "Signal Works",
    stage: "Applied",
    due: "May 24",
  },
  {
    role: "Growth Analyst",
    company: "Vector Studio",
    stage: "Follow-up",
    due: "May 27",
  },
];

const features = [
  {
    title: "Pipeline clarity",
    description:
      "Track every role by stage, priority, owner, and next step without losing the thread between job boards and notes.",
  },
  {
    title: "Follow-up rhythm",
    description:
      "Surface overdue replies, upcoming interviews, and high-intent roles before they go quiet.",
  },
  {
    title: "Decision memory",
    description:
      "Keep salary ranges, fit notes, contacts, and interview signals beside each opportunity.",
  },
];

const workflow = [
  "Clip the job and company details",
  "Set the target stage and next action",
  "Review active opportunities every morning",
  "Close the loop with notes, outcomes, and contacts",
];

function Button({ children, href, variant = "primary" }: ButtonProps) {
  const classes =
    variant === "primary"
      ? "bg-emerald-300 text-black shadow-[0_0_28px_rgba(110,231,183,0.34)] hover:bg-emerald-200"
      : "bg-zinc-900 text-white ring-1 ring-emerald-300/20 hover:bg-emerald-300/10 hover:ring-emerald-300/40";

  return (
    <Link
      href={href}
      className={`inline-flex h-12 items-center justify-center rounded-[8px] px-5 text-sm font-semibold transition ${classes}`}
    >
      {children}
    </Link>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Tracklio home"
        >
          <span className="text-sm font-semibold text-white">Tracklio</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-[8px] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-emerald-300/10 hover:text-emerald-100 sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center rounded-[8px] bg-emerald-300 px-4 text-sm font-semibold text-black shadow-[0_0_24px_rgba(110,231,183,0.3)] transition hover:bg-emerald-200"
          >
            Start free
          </Link>
        </div>
      </nav>
    </header>
  );
}

function StageBadge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[8px] border border-emerald-300/30 bg-emerald-300/10 px-2 py-1 text-xs font-medium text-emerald-100 shadow-[0_0_18px_rgba(110,231,183,0.14)]">
      {children}
    </span>
  );
}

function FeatureIcon({ index }: { index: number }) {
  const iconClass = "h-6 w-6 text-emerald-200";

  const icons = [
    <svg
      aria-hidden="true"
      className={iconClass}
      fill="none"
      key="pipeline"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 7h14M5 12h10M5 17h7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M17 12l2 2 3-4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>,
    <svg
      aria-hidden="true"
      className={iconClass}
      fill="none"
      key="rhythm"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4v3M17 4v3M5 9h14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M6.5 6h11A2.5 2.5 0 0 1 20 8.5v9A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-9A2.5 2.5 0 0 1 6.5 6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M9 14h4l-2 3"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M15.5 14.5a2.5 2.5 0 1 0-2.1-3.85"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>,
    <svg
      aria-hidden="true"
      className={iconClass}
      fill="none"
      key="memory"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 4h7l3 3v13H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
      <path
        d="M14 4v4h4M8.5 12h7M8.5 16h5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>,
  ];

  return (
    <div className="mb-6 grid size-12 place-items-center rounded-[8px] border border-emerald-300/25 bg-emerald-300/10 shadow-[0_0_24px_rgba(110,231,183,0.18)]">
      {icons[index] ?? icons[0]}
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden rounded-[8px] border border-emerald-300/20 bg-black shadow-[0_0_60px_rgba(16,185,129,0.16)]">
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent"
        aria-hidden="true"
      />
      <div className="flex min-h-[520px] flex-col lg:flex-row">
        <aside className="hidden w-56 border-r border-emerald-300/10 bg-zinc-950 p-4 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Tracklio</p>
              <p className="text-xs text-zinc-500">May search sprint</p>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            {["Pipeline", "Companies", "Calendar", "Contacts", "Reports"].map(
              (item, index) => (
                <div
                  key={item}
                  className={`rounded-[8px] px-3 py-2 ${
                    index === 0
                      ? "bg-emerald-300 text-black shadow-[0_0_18px_rgba(110,231,183,0.26)]"
                      : "text-zinc-400 hover:bg-emerald-300/10 hover:text-emerald-100"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </aside>

        <div className="flex-1 bg-[linear-gradient(180deg,rgba(16,185,129,0.08),rgba(9,9,11,0.7)_42%)] p-4 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-emerald-300/10 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-300/80">
                Active job search
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-white">
                Opportunity command center
              </h2>
            </div>
            <Button href="/sign-up" variant="secondary">
              Add application
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {pipeline.map((item) => (
              <div
                key={item.label}
                className="rounded-[8px] border border-white/10 bg-black p-4 transition hover:border-emerald-300/30 hover:shadow-[0_0_24px_rgba(16,185,129,0.12)]"
              >
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-emerald-200/80">
                  {item.change}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_280px]">
            <section className="rounded-[8px] border border-white/10 bg-black">
              <div className="flex items-center justify-between border-b border-emerald-300/10 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">
                  Priority roles
                </h3>
                <span className="text-xs text-emerald-300/80">3 updates</span>
              </div>
              <div className="divide-y divide-white/10">
                {jobs.map((job) => (
                  <div
                    key={`${job.company}-${job.role}`}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                  >
                    <div>
                      <p className="font-medium text-white">{job.role}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {job.company}
                      </p>
                    </div>
                    <StageBadge>{job.stage}</StageBadge>
                    <span className="text-sm text-zinc-400">{job.due}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[8px] border border-emerald-300/15 bg-black p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Focus</h3>
                <span className="text-xs text-emerald-300/80">This week</span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  ["Interview prep", "84%"],
                  ["Follow-ups", "62%"],
                  ["New sourcing", "48%"],
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-zinc-400">{label}</span>
                      <span className="text-white">{value}</span>
                    </div>
                    <div className="h-2 rounded-[8px] bg-zinc-900">
                      <div
                        className="h-2 rounded-[8px] bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.45)]"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] border border-emerald-300/15 bg-emerald-300/5 p-3">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-300/80">
                  Next action
                </p>
                <p className="mt-2 text-sm leading-6 text-zinc-200">
                  Send tailored follow-up to Northstar Labs before 4 PM.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-emerald-300/10 bg-black">
      <div
        className="absolute inset-0 -z-10 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(110,231,183,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-14 lg:pt-24">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300">
            Job tracker for focused searches
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Track every application from save to{" "}
            <span className="text-emerald-200 drop-shadow-[0_0_18px_rgba(110,231,183,0.42)]">
              signed offer.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg">
            A precise workspace for managing roles, recruiter notes, deadlines,
            interview loops, and the next action that actually moves your search
            forward.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/sign-up">Start tracking</Button>
            <Button href="#features" variant="secondary">
              View features
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <DashboardPreview />
        </Reveal>
      </div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section
      id="features"
      className="bg-[linear-gradient(180deg,#000000_0%,rgba(6,78,59,0.16)_55%,#000000_100%)] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300">
            Built for momentum
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Everything that matters stays attached to the opportunity.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <article className="h-full rounded-[8px] border border-emerald-300/15 bg-zinc-950 p-5 shadow-[0_0_34px_rgba(16,185,129,0.08)] transition hover:border-emerald-300/35 hover:shadow-[0_0_38px_rgba(16,185,129,0.16)]">
                <FeatureIcon index={index} />
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Workflow() {
  return (
    <section
      id="workflow"
      className="border-y border-emerald-300/10 bg-[linear-gradient(200deg,rgba(6,78,59,0.28)_0%,#000000_70%)] py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300">
            Daily operating system
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Turn scattered job hunting into a repeatable review.
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            Tracklio keeps the process quiet and structured, so every role has a
            state, a date, and a reason to stay in your pipeline.
          </p>
        </Reveal>

        <div className="grid gap-3">
          {workflow.map((item, index) => (
            <Reveal key={item} delay={index * 0.06}>
              <div className="grid grid-cols-[48px_1fr] items-center gap-4 rounded-[8px] border border-emerald-300/15 bg-black/70 p-4 transition hover:border-emerald-300/35">
                <span className="grid size-12 place-items-center rounded-[8px] bg-emerald-300 text-sm font-bold text-black shadow-[0_0_22px_rgba(110,231,183,0.3)]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base font-medium text-white">{item}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCta() {
  return (
    <section id="pricing" className="bg-black py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="grid gap-8 rounded-[8px] border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(6,78,59,0.22),#09090b_45%)] p-6 shadow-[0_0_36px_rgba(16,185,129,0.12)] sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300">
              Free private beta
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
              Build your next offer pipeline today.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">
              Start with unlimited roles, notes, deadlines, company contacts,
              and pipeline stages while the beta is open.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Button href="/sign-up">Create workspace</Button>
            <Button href="#features" variant="secondary">
              Compare features
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-5 text-sm text-zinc-500 sm:flex-row sm:items-center sm:px-8">
        <p>Tracklio</p>
        <div className="flex gap-5">
          <a className="hover:text-emerald-200" href="#">
            Privacy
          </a>
          <a className="hover:text-emerald-200" href="#">
            Terms
          </a>
          <a className="hover:text-emerald-200" href="#">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <PageTransition className="min-h-screen bg-black text-white">
      <Header />
      <main>
        <Hero />
        <FeatureGrid />
        <Workflow />
        <PricingCta />
      </main>
      <Footer />
    </PageTransition>
  );
}
