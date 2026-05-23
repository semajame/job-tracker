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

type Employer = {
  id: string;
  application_id: string | null;
  department: string | null;
  manager_name: string | null;
  manager_email: string | null;
  office_address: string | null;
  employment_type: string | null;
  start_date: string | null;
  end_date: string | null;
  salary: number | null;
  currency: string | null;
  is_current: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  job_applications: JobApplication | null;
};

type EmployerDetailsTabsProps = {
  employer: Employer;
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

function formatEmploymentType(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return value.replace("_", " ");
}

function formatSalary(value: number | null, currency: string | null) {
  if (!value) {
    return "Not set";
  }

  return `${currency ?? "PHP"} ${value.toLocaleString()}`;
}

function formatApplicationSalary(min: number | null, max: number | null) {
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
    <div className="rounded-[8px] border border-white/10 bg-black p-4">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 break-words text-sm leading-6 text-zinc-200">
        {value}
      </p>
    </div>
  );
}

export function EmployerDetailsTabs({ employer }: EmployerDetailsTabsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(true);
  const linkedApplication = employer.job_applications;

  return (
    <section
      aria-label="Employer detail sections"
      className="overflow-hidden rounded-[8px] border border-white/10 bg-zinc-950"
    >
      <h2>
        <button
          aria-controls="employer-details-panel"
          aria-expanded={isOpen}
          className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/[0.03]"
          id="employer-details-header"
          onClick={() => setIsOpen((current) => !current)}
          type="button"
        >
          <span className="text-lg font-semibold text-white">Details</span>
          <span
            aria-hidden="true"
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-[8px] border border-white/10 text-lg font-medium transition bg-black textt-white`}
          >
            {isOpen ? "-" : "+"}
          </span>
        </button>
      </h2>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            animate={{ height: "auto", opacity: 1 }}
            className="overflow-hidden border-t border-white/10 flex justify-between gap-6 xl:gap-8 "
            exit={{ height: 0, opacity: 0 }}
            id="employer-details-panel"
            initial={{ height: 0, opacity: 0 }}
            role="region"
            aria-labelledby="employer-details-header"
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.24, ease: [0.22, 1, 0.36, 1] }
            }
          >
            <div className="w-full p-5">
              <h3 className="text-lg font-semibold text-white">
                Job application
              </h3>
              {linkedApplication ? (
                <>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <DetailItem
                      label="Company"
                      value={linkedApplication.company}
                    />
                    <DetailItem label="Role" value={linkedApplication.role} />
                    <DetailItem
                      label="Status"
                      value={linkedApplication.status}
                    />
                    <DetailItem
                      label="Location"
                      value={linkedApplication.location ?? "Not set"}
                    />
                    <DetailItem
                      label="Salary range"
                      value={formatApplicationSalary(
                        linkedApplication.salary_min,
                        linkedApplication.salary_max,
                      )}
                    />
                    <DetailItem
                      label="Applied date"
                      value={formatDate(linkedApplication.applied_at)}
                    />
                    <DetailItem
                      label="Follow-up date"
                      value={formatDate(linkedApplication.follow_up_at)}
                    />
                    <DetailItem
                      label="Updated"
                      value={formatDateTime(linkedApplication.updated_at)}
                    />
                  </div>

                  <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                      Job URL
                    </p>
                    {linkedApplication.job_url ? (
                      <a
                        className="mt-3 inline-block break-all text-sm font-medium leading-6 text-zinc-200 underline-offset-4 hover:text-white hover:underline"
                        href={linkedApplication.job_url}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {linkedApplication.job_url}
                      </a>
                    ) : (
                      <p className="mt-3 text-sm leading-6 text-zinc-200">
                        Not set
                      </p>
                    )}
                  </div>

                  <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
                    <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                      Application notes
                    </p>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                      {linkedApplication.notes ?? "No notes yet."}
                    </p>
                  </div>
                </>
              ) : (
                <div className="mt-5 rounded-[8px] border border-white/10 bg-black px-4 py-8 text-sm text-zinc-400">
                  This employer is not linked to an application yet.
                </div>
              )}
            </div>
            <div className="p-5 w-full">
              <h3 className="text-lg font-semibold text-white">
                Employment details
              </h3>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <DetailItem
                  label="Employment type"
                  value={formatEmploymentType(employer.employment_type)}
                />
                <DetailItem
                  label="Department"
                  value={employer.department ?? "Not set"}
                />
                <DetailItem
                  label="Manager"
                  value={employer.manager_name ?? "Not set"}
                />
                <DetailItem
                  label="Manager email"
                  value={employer.manager_email ?? "Not set"}
                />
                <DetailItem
                  label="Office address"
                  value={employer.office_address ?? "Not set"}
                />
                <DetailItem
                  label="Final salary"
                  value={formatSalary(employer.salary, employer.currency)}
                />
                <DetailItem
                  label="Start date"
                  value={formatDate(employer.start_date)}
                />
                <DetailItem
                  label="End date"
                  value={formatDate(employer.end_date)}
                />
                <DetailItem
                  label="Created"
                  value={formatDateTime(employer.created_at)}
                />
                <DetailItem
                  label="Updated"
                  value={formatDateTime(employer.updated_at)}
                />
              </div>

              <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Notes
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                  {employer.notes ?? "No notes yet."}
                </p>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
