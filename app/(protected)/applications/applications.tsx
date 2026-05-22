"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export type JobApplication = {
  id: string;
  user_id: string;
  company: string;
  role: string;
  location: string | null;
  job_url: string | null;
  salary_min: number | null;
  salary_max: number | null;
  status: ApplicationStatus;
  applied_at: string | null;
  follow_up_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

type ApplicationFormState = {
  company: string;
  role: string;
  location: string;
  job_url: string;
  salary_min: string;
  salary_max: string;
  status: ApplicationStatus;
  applied_at: string;
  follow_up_at: string;
  notes: string;
};

type Props = {
  initialApplications: JobApplication[];
};

const emptyForm: ApplicationFormState = {
  company: "",
  role: "",
  location: "",
  job_url: "",
  salary_min: "",
  salary_max: "",
  status: "wishlist",
  applied_at: "",
  follow_up_at: "",
  notes: "",
};

const statusOptions: { label: string; value: ApplicationStatus }[] = [
  { label: "Wishlist", value: "wishlist" },
  { label: "Applied", value: "applied" },
  { label: "Interview", value: "interview" },
  { label: "Offer", value: "offer" },
  { label: "Rejected", value: "rejected" },
];

function toFormState(application: JobApplication): ApplicationFormState {
  return {
    company: application.company,
    role: application.role,
    location: application.location ?? "",
    job_url: application.job_url ?? "",
    salary_min: application.salary_min?.toString() ?? "",
    salary_max: application.salary_max?.toString() ?? "",
    status: application.status,
    applied_at: application.applied_at ?? "",
    follow_up_at: application.follow_up_at ?? "",
    notes: application.notes ?? "",
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

export function JobApplicationsClient({ initialApplications }: Props) {
  const shouldReduceMotion = useReducedMotion();
  const [applications, setApplications] = useState(initialApplications);
  const [form, setForm] = useState<ApplicationFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(
    null,
  );
  const [message, setMessage] = useState<string | null>(null);

  const formTitle = editingId ? "Edit application" : "Add application";

  const updateField = (field: keyof ApplicationFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage(null);
  };

  const refreshApplications = async () => {
    const response = await fetch("/api/job-applications");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error ?? "Could not load applications.");
    }

    setApplications(data.applications);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const endpoint = editingId
      ? `/api/job-applications/${editingId}`
      : "/api/job-applications";
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
        throw new Error(data.error ?? "Could not save application.");
      }

      if (editingId) {
        setApplications((current) =>
          current.map((item) =>
            item.id === data.application.id ? data.application : item,
          ),
        );
      } else {
        setApplications((current) => [data.application, ...current]);
      }

      resetForm();
      setMessage(editingId ? "Application updated." : "Application created.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save application.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (application: JobApplication) => {
    setEditingId(application.id);
    setForm(toFormState(application));
    setMessage(null);
  };

  const handleDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    setDeletingId(pendingDelete.id);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/job-applications/${pendingDelete.id}`,
        {
          method: "DELETE",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete application.");
      }

      setApplications((current) =>
        current.filter((item) => item.id !== pendingDelete.id),
      );

      if (editingId === pendingDelete.id) {
        resetForm();
      }

      setPendingDelete(null);
      setMessage("Application deleted.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not delete application.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
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
              Company
            </span>
            <input
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) => updateField("company", event.target.value)}
              placeholder="Company name"
              required
              value={form.company}
            />
          </label>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Role
            </span>
            <input
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) => updateField("role", event.target.value)}
              placeholder="Product Designer"
              required
              value={form.role}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Status
              </span>
              <select
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40 cursor-pointer"
                onChange={(event) => updateField("status", event.target.value)}
                value={form.status}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Location
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
                placeholder="Remote"
                value={form.location}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Job URL
            </span>
            <input
              className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) => updateField("job_url", event.target.value)}
              placeholder="https://"
              type="url"
              value={form.job_url}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Salary min
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                min="0"
                onChange={(event) =>
                  updateField("salary_min", event.target.value)
                }
                type="number"
                value={form.salary_min}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Salary max
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
                min="0"
                onChange={(event) =>
                  updateField("salary_max", event.target.value)
                }
                type="number"
                value={form.salary_max}
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Applied at
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
                onChange={(event) =>
                  updateField("applied_at", event.target.value)
                }
                type="date"
                value={form.applied_at}
              />
            </label>

            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Follow up
              </span>
              <input
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition focus:border-white/40"
                onChange={(event) =>
                  updateField("follow_up_at", event.target.value)
                }
                type="date"
                value={form.follow_up_at}
              />
            </label>
          </div>

          <label className="block">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Notes
            </span>
            <textarea
              className="mt-2 min-h-24 w-full rounded-[8px] border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40"
              onChange={(event) => updateField("notes", event.target.value)}
              placeholder="Recruiter names, next steps, fit notes"
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
          <h2 className="text-lg font-semibold text-white">Applications</h2>
          <button
            className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
            onClick={refreshApplications}
            type="button"
          >
            Refresh
          </button>
        </div>

        {applications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-zinc-400">No applications yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.1em] text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Salary</th>
                  <th className="px-5 py-3 font-medium">Applied Date</th>
                  <th className="px-5 py-3 font-medium">Follow Date</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 ">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-5 py-4 align-top ">
                      <div>
                        <p className="font-medium text-white">
                          {application.role}
                        </p>
                        <p className="mt-1 text-zinc-500">
                          {application.company}
                          {application.location
                            ? ` - ${application.location}`
                            : ""}
                        </p>
                        {application.job_url ? (
                          <a
                            className="mt-2 inline-block text-xs font-medium text-zinc-300 underline-offset-4 hover:text-white hover:underline"
                            href={application.job_url}
                            rel="noreferrer"
                            target="_blank"
                          >
                            View posting
                          </a>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex rounded-[8px] border border-white/10 bg-black px-3 py-1 text-xs font-medium capitalize text-zinc-200">
                        {application.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      {formatSalary(
                        application.salary_min,
                        application.salary_max,
                      )}
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      {formatDate(application.applied_at)}
                    </td>
                    <td className="px-5 py-4 align-top text-zinc-400">
                      {formatDate(application.follow_up_at)}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <div className="flex gap-2">
                        <button
                          className="h-9 rounded-[8px] border border-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/5 cursor-pointer"
                          onClick={() => handleEdit(application)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="h-9 rounded-[8px] border border-red-400/30 px-3 text-xs font-semibold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:text-red-900 cursor-pointer"
                          disabled={deletingId === application.id}
                          onClick={() => setPendingDelete(application)}
                          type="button"
                        >
                          {deletingId === application.id
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
                  aria-labelledby="delete-dialog-title"
                  aria-modal="true"
                  className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-black/70 px-5"
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  key="delete-dialog"
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
                      id="delete-dialog-title"
                    >
                      Are you sure you want to delete?
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                      This will permanently remove {pendingDelete.role} at{" "}
                      {pendingDelete.company}.
                    </p>
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        className="h-10 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:text-zinc-600 cursor-pointer"
                        disabled={deletingId === pendingDelete.id}
                        onClick={() => setPendingDelete(null)}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="h-10 rounded-[8px] bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-red-300 cursor-pointer"
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
