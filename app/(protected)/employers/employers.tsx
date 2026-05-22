"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";

export type EmploymentType = "full_time" | "part_time" | "contract";

export type JobApplicationOption = {
  id: string;
  company: string;
  role: string;
  status: string;
  location: string | null;
  applied_at: string | null;
};

export type Employer = {
  id: string;
  user_id: string;
  application_id: string | null;
  department: string | null;
  manager_name: string | null;
  manager_email: string | null;
  office_address: string | null;
  employment_type: EmploymentType | null;
  start_date: string | null;
  end_date: string | null;
  salary: number | null;
  currency: string | null;
  is_current: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  job_applications: JobApplicationOption | null;
};

type EmployerFormState = {
  application_id: string;
  department: string;
  manager_name: string;
  manager_email: string;
  office_address: string;
  employment_type: "" | EmploymentType;
  start_date: string;
  end_date: string;
  salary: string;
  currency: string;
  is_current: boolean;
  notes: string;
};

type EmployersClientProps = {
  initialApplications: JobApplicationOption[];
  initialEmployers: Employer[];
};

const emptyForm: EmployerFormState = {
  application_id: "",
  department: "",
  manager_name: "",
  manager_email: "",
  office_address: "",
  employment_type: "",
  start_date: "",
  end_date: "",
  salary: "",
  currency: "PHP",
  is_current: true,
  notes: "",
};

const employmentTypeOptions: { label: string; value: EmploymentType }[] = [
  { label: "Full time", value: "full_time" },
  { label: "Part time", value: "part_time" },
  { label: "Contract", value: "contract" },
];

function toFormState(employer: Employer): EmployerFormState {
  return {
    application_id: employer.application_id ?? "",
    department: employer.department ?? "",
    manager_name: employer.manager_name ?? "",
    manager_email: employer.manager_email ?? "",
    office_address: employer.office_address ?? "",
    employment_type: employer.employment_type ?? "",
    start_date: employer.start_date ?? "",
    end_date: employer.end_date ?? "",
    salary: employer.salary?.toString() ?? "",
    currency: employer.currency ?? "PHP",
    is_current: employer.is_current,
    notes: employer.notes ?? "",
  };
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatEmploymentType(value: EmploymentType | null) {
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

function getApplicationTitle(employer: Employer) {
  if (!employer.job_applications) {
    return "Unlinked employer";
  }

  return employer.job_applications.company;
}

function getApplicationSubtitle(employer: Employer) {
  if (!employer.job_applications) {
    return "No application selected";
  }

  const location = employer.job_applications.location
    ? ` - ${employer.job_applications.location}`
    : "";

  return `${employer.job_applications.role}${location}`;
}

function applicationOptionLabel(application: JobApplicationOption) {
  return `${application.company} - ${application.role}`;
}

export function EmployersClient({
  initialApplications,
  initialEmployers,
}: EmployersClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const [employers, setEmployers] = useState(initialEmployers);
  const [applications] = useState(initialApplications);
  const [form, setForm] = useState<EmployerFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Employer | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const linkedApplicationIds = new Set(
    employers
      .filter((employer) => employer.id !== editingId)
      .map((employer) => employer.application_id)
      .filter(Boolean),
  );
  const formTitle = editingId ? "Edit employer" : "Add employer";

  const updateField = (
    field: keyof EmployerFormState,
    value: string | boolean,
  ) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  };

  const refreshEmployers = async () => {
    const response = await fetch("/api/employers");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Could not load employers.");
    }

    setEmployers(data.employers);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const endpoint = editingId ? `/api/employers/${editingId}` : "/api/employers";
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save employer.");
      }

      if (editingId) {
        setEmployers((current) =>
          current.map((item) =>
            item.id === data.employer.id ? data.employer : item,
          ),
        );
      } else {
        setEmployers((current) => [data.employer, ...current]);
      }

      resetForm();
      setMessage(editingId ? "Employer updated." : "Employer created.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save employer.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (employer: Employer) => {
    setEditingId(employer.id);
    setForm(toFormState(employer));
    setMessage(null);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeletingId(pendingDelete.id);
    setMessage(null);

    try {
      const response = await fetch(`/api/employers/${pendingDelete.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete employer.");
      }

      setEmployers((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );

      if (editingId === pendingDelete.id) {
        resetForm();
      }

      setPendingDelete(null);
      setMessage("Employer deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete employer.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[400px_1fr]">
      <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-white">{formTitle}</h2>
          {editingId ? (
            <button
              className="text-sm font-medium text-zinc-400 transition hover:text-white"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Linked application
            </span>
            <select
              className="mt-2 h-11 w-full cursor-pointer rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
              onChange={(event) =>
                updateField("application_id", event.target.value)
              }
              value={form.application_id}
            >
              <option value="">No linked application</option>
              {applications.map((application) => (
                <option
                  disabled={linkedApplicationIds.has(application.id)}
                  key={application.id}
                  value={application.id}
                >
                  {applicationOptionLabel(application)}
                  {linkedApplicationIds.has(application.id) ? " (linked)" : ""}
                </option>
              ))}
            </select>
            <span className="mt-2 block text-xs leading-5 text-zinc-500">
              Only applications with Offer status are available.
            </span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Employment type
              </span>
              <select
                className="mt-2 h-11 w-full cursor-pointer rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
                onChange={(event) =>
                  updateField("employment_type", event.target.value)
                }
                value={form.employment_type}
              >
                <option value="">Not set</option>
                {employmentTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Department
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                onChange={(event) =>
                  updateField("department", event.target.value)
                }
                placeholder="Product"
                value={form.department}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Manager name
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                onChange={(event) =>
                  updateField("manager_name", event.target.value)
                }
                placeholder="Hiring manager"
                value={form.manager_name}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Manager email
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                onChange={(event) =>
                  updateField("manager_email", event.target.value)
                }
                placeholder="manager@example.com"
                type="email"
                value={form.manager_email}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Office address
            </span>
            <input
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) =>
                updateField("office_address", event.target.value)
              }
              placeholder="Office or remote details"
              value={form.office_address}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Start date
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
                onChange={(event) =>
                  updateField("start_date", event.target.value)
                }
                type="date"
                value={form.start_date}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                End date
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
                onChange={(event) =>
                  updateField("end_date", event.target.value)
                }
                type="date"
                value={form.end_date}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_96px]">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Salary
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                min="0"
                onChange={(event) => updateField("salary", event.target.value)}
                type="number"
                value={form.salary}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Currency
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm uppercase text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                maxLength={8}
                onChange={(event) =>
                  updateField("currency", event.target.value.toUpperCase())
                }
                value={form.currency}
              />
            </label>
          </div>

          <label className="flex items-center gap-3 rounded-[8px] border border-white/10 bg-black px-3 py-3">
            <input
              checked={form.is_current}
              className="size-4 cursor-pointer accent-white"
              onChange={(event) =>
                updateField("is_current", event.target.checked)
              }
              type="checkbox"
            />
            <span className="text-sm font-medium text-zinc-200">
              Current employer
            </span>
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Notes
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-[8px] border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Benefits, contract details, onboarding notes"
              value={form.notes}
            />
          </label>

          <button
            className="h-11 w-full rounded-[8px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : editingId ? "Save changes" : "Create"}
          </button>
        </form>

        {message ? (
          <p className="mt-4 text-sm leading-6 text-zinc-400">{message}</p>
        ) : null}
      </section>

      <section className="rounded-[8px] border border-white/10 bg-zinc-950">
        <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-white">Employers</h2>
          <button
            className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
            onClick={refreshEmployers}
            type="button"
          >
            Refresh
          </button>
        </div>

        {employers.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-zinc-400">No employers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.1em] text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Employer</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Manager</th>
                  <th className="px-5 py-3 font-medium">Dates</th>
                  <th className="px-5 py-3 font-medium">Salary</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {employers.map((employer) => (
                  <tr key={employer.id}>
                    <td className="px-5 py-4 align-top">
                      <div>
                        <p className="font-medium text-white">
                          {getApplicationTitle(employer)}
                        </p>
                        <p className="mt-1 text-zinc-500">
                          {getApplicationSubtitle(employer)}
                        </p>
                        {employer.department ? (
                          <p className="mt-2 text-xs text-zinc-500">
                            {employer.department}
                          </p>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top capitalize text-zinc-400">
                      {formatEmploymentType(employer.employment_type)}
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      <div>
                        <p>{employer.manager_name ?? "Not set"}</p>
                        {employer.manager_email ? (
                          <a
                            className="mt-1 inline-block text-xs text-zinc-300 underline-offset-4 hover:text-white hover:underline"
                            href={`mailto:${employer.manager_email}`}
                          >
                            {employer.manager_email}
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      {formatDate(employer.start_date)} -{" "}
                      {employer.end_date ? formatDate(employer.end_date) : "Now"}
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      {formatSalary(employer.salary, employer.currency)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex rounded-[8px] border border-white/10 bg-black px-3 py-1 text-xs font-medium text-zinc-200">
                        {employer.is_current ? "Current" : "Past"}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex gap-2">
                        <Link
                          className="grid h-9 place-items-center rounded-[8px] border border-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/5"
                          href={`/employers/${employer.id}`}
                        >
                          View
                        </Link>
                        <button
                          className="h-9 rounded-[8px] border border-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/5"
                          onClick={() => handleEdit(employer)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="h-9 rounded-[8px] border border-red-400/30 px-3 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:text-red-900"
                          disabled={deletingId === employer.id}
                          onClick={() => setPendingDelete(employer)}
                          type="button"
                        >
                          {deletingId === employer.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {pendingDelete ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  aria-labelledby="delete-employer-dialog-title"
                  aria-modal="true"
                  className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-black/70 px-5"
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  key="delete-employer-dialog"
                  role="dialog"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="w-full max-w-md rounded-[8px] border border-white/10 bg-zinc-950 p-5 shadow-2xl"
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 0, scale: 0.96, y: 12 }
                    }
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.96, y: 16 }
                    }
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <h2
                      className="text-lg font-semibold text-white"
                      id="delete-employer-dialog-title"
                    >
                      Delete employer?
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      This will remove the employer record for{" "}
                      {getApplicationTitle(pendingDelete)}.
                    </p>
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        className="h-10 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:text-zinc-600"
                        disabled={deletingId === pendingDelete.id}
                        onClick={() => setPendingDelete(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="h-10 rounded-[8px] bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-red-300"
                        disabled={deletingId === pendingDelete.id}
                        onClick={handleDelete}
                        type="button"
                      >
                        {deletingId === pendingDelete.id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </div>
  );
}
