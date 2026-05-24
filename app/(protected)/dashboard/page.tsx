import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard | Tracklio",
  description: "Your protected Tracklio job search dashboard.",
};

type JobApplication = {
  company: string;
  role: string;
  status: string;
  follow_up_at: string | null;
  created_at: string;
};

function countByStatus(applications: JobApplication[], status: string) {
  return applications.filter((application) => application.status === status)
    .length;
}

function formatDueDate(value: string) {
  const today = new Date();
  const dueDate = new Date(`${value}T00:00:00`);
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const diffDays = Math.round(
    (dueDate.getTime() - todayStart.getTime()) / 86_400_000,
  );

  if (diffDays === 0) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Tomorrow";
  }

  if (diffDays < 0) {
    return "Overdue";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(dueDate);
}

function formatStatus(value: string) {
  return value.replaceAll("_", " ");
}

function percentage(value: number, total: number) {
  if (total === 0) {
    return "0%";
  }

  return `${Math.round((value / total) * 100)}%`;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const { data, error: applicationsError } = await supabase
    .from("job_applications")
    .select("company, role, status, follow_up_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (applicationsError) {
    throw new Error(applicationsError.message);
  }

  const applications = (data ?? []) as JobApplication[];
  const total = applications.length;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const addedThisWeek = applications.filter(
    (application) => new Date(application.created_at) >= weekAgo,
  ).length;
  const applied = countByStatus(applications, "applied");
  const interviews = countByStatus(applications, "interview");
  const offers = countByStatus(applications, "offer");
  const active = applications.filter(
    (application) =>
      application.status !== "rejected" && application.status !== "offer",
  ).length;
  const activeWithFollowUps = applications.filter(
    (application) =>
      application.follow_up_at &&
      application.status !== "rejected" &&
      application.status !== "offer",
  ).length;

  const stats = [
    {
      label: "Saved roles",
      value: total.toString(),
      note: `${addedThisWeek} added this week`,
    },
    {
      label: "Applications",
      value: applied.toString(),
      note: `${active} active roles`,
    },
    {
      label: "Interviews",
      value: interviews.toString(),
      note: "Current interview loops",
    },
    {
      label: "Offers",
      value: offers.toString(),
      note: "Decision stage",
    },
  ];

  const tasks = applications
    .filter((application) => application.follow_up_at)
    .sort((a, b) =>
      String(a.follow_up_at).localeCompare(String(b.follow_up_at)),
    )
    .slice(0, 3)
    .map((application) => ({
      title: application.role,
      company: application.company,
      due: formatDueDate(application.follow_up_at ?? ""),
      stage: formatStatus(application.status),
    }));

  const healthMetrics = [
    ["Follow-up coverage", percentage(activeWithFollowUps, active)],
    ["Interview readiness", percentage(interviews, active)],
    ["Offer comparison", percentage(offers, total)],
  ];

  return (
    <section className="w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-4 border-b border-emerald-300/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300/80">
            Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Welcome back.
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Signed in as {user.email}
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <Reveal key={item.label} delay={index * 0.06}>
            <article className="h-full rounded-[8px] border border-white/10 bg-zinc-950 p-5 transition hover:border-emerald-300/20">
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
          <section className="rounded-[8px] border border-emerald-300/10 bg-zinc-950">
            <div className="flex items-center justify-between border-b border-emerald-300/10 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s queue
              </h2>
              <span className="text-sm text-zinc-500">
                {tasks.length} active {tasks.length === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="divide-y divide-white/10">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <article
                    key={`${task.company}-${task.title}`}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    <div>
                      <h3 className="font-medium text-white">{task.title}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {task.company}
                      </p>
                    </div>
                    <span className="w-fit rounded-[8px] border border-emerald-300/20 bg-emerald-300/5 px-3 py-1 text-xs font-medium text-emerald-100 capitalize">
                      {task.stage}
                    </span>
                    <span className="text-sm text-zinc-400">{task.due}</span>
                  </article>
                ))
              ) : (
                <div className="px-5 py-10 text-sm text-zinc-400">
                  No follow-ups scheduled yet.
                </div>
              )}
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
              Keep your highest intent roles warm by closing follow-ups before
              adding more applications.
            </p>
            <div className="mt-6 space-y-4">
              {healthMetrics.map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-zinc-400">{label}</span>
                    <span className="text-white">{value}</span>
                  </div>
                  <div className="h-2 rounded-[8px] bg-emerald-950/60">
                    <div
                      className="h-2 rounded-[8px] bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.75)]"
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
  );
}
