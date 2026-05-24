"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

type JobApplication = {
  id: string;
  company: string;
  role: string;
  location: string | null;
  job_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: string;
  applied_at: string | null;
  follow_up_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ApplicationDetailsTabsProps = {
  application: JobApplication;
};

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value.includes("T") ? value : `${value}T00:00:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatSalary(min: number | null, max: number | null) {
  if (min && max) {
    return `${min.toLocaleString()} - ${max.toLocaleString()}`;
  }

  if (min) {
    return `From ${min.toLocaleString()}`;
  }

  if (max) {
    return `Up to ${max.toLocaleString()}`;
  }

  return "Not set";
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-white/10 bg-black p-4 transition hover:border-emerald-300/20">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-emerald-300/70">
        {label}
      </p>
      <p className="mt-3 break-words text-sm leading-6 text-zinc-200">
        {value}
      </p>
    </div>
  );
}

export function ApplicationDetailsTabs({
  application,
}: ApplicationDetailsTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section
      aria-label="Application detail sections"
      className="overflow-hidden rounded-[8px] border border-emerald-300/10 bg-zinc-950"
    >
      <h2>
        <button
          aria-controls="application-details-panel"
          aria-expanded={isOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-emerald-300/[0.04]"
          id="application-details-header"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="text-lg font-semibold text-white">Details</span>
          <span
            aria-hidden="true"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-emerald-300/20 bg-black text-lg font-medium text-emerald-100 transition"
          >
            {isOpen ? "-" : "+"}
          </span>
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            aria-labelledby="application-details-header"
            className="overflow-hidden border-t border-emerald-300/10"
            exit={{ height: 0, opacity: 0 }}
            id="application-details-panel"
            initial={{ height: 0, opacity: 0 }}
            role="region"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="p-5">
              <h3 className="text-lg font-semibold text-white">
                Application details
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailItem label="Status" value={application.status} />
                <DetailItem label="Company" value={application.company} />
                <DetailItem label="Role" value={application.role} />
                <DetailItem
                  label="Location"
                  value={application.location ?? "Not set"}
                />
                <DetailItem
                  label="Salary"
                  value={formatSalary(
                    application.salary_min,
                    application.salary_max,
                  )}
                />
                <DetailItem
                  label="Applied date"
                  value={formatDate(application.applied_at)}
                />
                <DetailItem
                  label="Follow-up date"
                  value={formatDate(application.follow_up_at)}
                />
                <DetailItem
                  label="Created"
                  value={formatDateTime(application.created_at)}
                />
                <DetailItem
                  label="Updated"
                  value={formatDateTime(application.updated_at)}
                />
              </div>

              <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Job URL
                </p>
                {application.job_url ? (
                  <a
                    className="mt-3 inline-block break-all text-sm font-medium leading-6 text-zinc-200 underline-offset-4 hover:text-white hover:underline"
                    href={application.job_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {application.job_url}
                  </a>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    Not set
                  </p>
                )}
              </div>

              <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Notes
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                  {application.notes ?? "No notes yet."}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
