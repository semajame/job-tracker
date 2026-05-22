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
      ? "bg-white text-black hover:bg-zinc-200"
      : "bg-zinc-900 text-white ring-1 ring-white/10 hover:bg-zinc-800";

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
        <a
          href="#"
          className="flex items-center gap-3"
          aria-label="Aaplio home"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border border-white/15 bg-white text-sm font-bold text-black">
            T
          </span>
          <span className="text-sm font-semibold text-white">Aaplio</span>
        </a>

        <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a className="transition hover:text-white" href="#features">
            Features
          </a>
          <a className="transition hover:text-white" href="#workflow">
            Workflow
          </a>
          <a className="transition hover:text-white" href="#pricing">
            Pricing
          </a>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/sign-in"
            className="hidden rounded-[8px] px-4 py-2 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="inline-flex h-10 items-center rounded-[8px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
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
    <span className="rounded-[8px] border border-white/10 bg-white/10 px-2 py-1 text-xs font-medium text-zinc-100">
      {children}
    </span>
  );
}

function DashboardPreview() {
  return (
    <div className="relative mx-auto mt-12 w-full max-w-6xl overflow-hidden rounded-[8px] border border-white/10 bg-black shadow-2xl shadow-black/60">
      <div className="flex min-h-[520px] flex-col lg:flex-row">
        <aside className="hidden w-56 border-r border-white/10 bg-zinc-950 p-4 lg:block">
          <div className="mb-8 flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-[8px] bg-white text-xs font-bold text-black">
              T
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Aaplio</p>
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
                      ? "bg-white text-black"
                      : "text-zinc-400 hover:bg-white/10"
                  }`}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </aside>

        <div className="flex-1 bg-zinc-950/70 p-4 sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
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
                className="rounded-[8px] border border-white/10 bg-black p-4"
              >
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-semibold text-white">
                  {item.value}
                </p>
                <p className="mt-1 text-sm text-zinc-400">{item.change}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1fr_280px]">
            <section className="rounded-[8px] border border-white/10 bg-black">
              <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                <h3 className="text-sm font-semibold text-white">
                  Priority roles
                </h3>
                <span className="text-xs text-zinc-500">3 updates</span>
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

            <section className="rounded-[8px] border border-white/10 bg-black p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Focus</h3>
                <span className="text-xs text-zinc-500">This week</span>
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
                        className="h-2 rounded-[8px] bg-white"
                        style={{ width: value }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-[8px] border border-white/10 bg-zinc-950 p-3">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
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
    <section className="relative isolate overflow-hidden border-b border-white/10 bg-black">
      <div
        className="absolute inset-0 -z-10 opacity-35"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-20 sm:px-8 sm:pb-14 lg:pt-24">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400">
            Job tracker for focused searches
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.05] text-white sm:text-6xl lg:text-7xl">
            Track every application from save to signed offer.
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
    <section id="features" className="bg-black py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Built for momentum
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Everything that matters stays attached to the opportunity.
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.title} delay={index * 0.08}>
              <article className="h-full rounded-[8px] border border-white/10 bg-zinc-950 p-5">
                <div className="mb-6 h-10 w-10 rounded-[8px] border border-white/10 bg-white/10" />
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
      className="border-y border-white/10 bg-[linear-gradient(200deg,#262626_0%,#000000_70%)] py-20 sm:py-24"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400">
            Daily operating system
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Turn scattered job hunting into a repeatable review.
          </h2>
          <p className="mt-5 text-base leading-8 text-zinc-400">
            Aaplio keeps the process quiet and structured, so every role has a
            state, a date, and a reason to stay in your pipeline.
          </p>
        </Reveal>

        <div className="grid gap-3">
          {workflow.map((item, index) => (
            <Reveal key={item} delay={index * 0.06}>
              <div className="grid grid-cols-[48px_1fr] items-center gap-4 rounded-[8px] border border-white/10 bg-black/70 p-4">
                <span className="grid size-12 place-items-center rounded-[8px] bg-white text-sm font-bold text-black">
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
        <Reveal className="grid gap-8 rounded-[8px] border border-white/10 bg-zinc-950 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
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
        <p>Aaplio</p>
        <div className="flex gap-5">
          <a className="hover:text-white" href="#">
            Privacy
          </a>
          <a className="hover:text-white" href="#">
            Terms
          </a>
          <a className="hover:text-white" href="#">
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
