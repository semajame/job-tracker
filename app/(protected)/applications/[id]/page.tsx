import { AttachmentUploader } from "@/app/(protected)/applications/[id]/attachment-uploader";
import { AttachmentsPanel } from "@/app/(protected)/applications/[id]/attachments-panel";
import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Application Details | Aaplio",
  description: "View application details and manage attachments.",
};

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

type JobAttachment = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
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
    <div className="rounded-[8px] border border-white/10 bg-black p-4">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </p>
      <p className="mt-3 break-words text-sm leading-6 text-zinc-200 capitalize">
        {value}
      </p>
    </div>
  );
}

export default async function ApplicationDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (applicationError || !application) {
    notFound();
  }

  const { data: attachments, error: attachmentsError } = await supabase
    .from("job_attachments")
    .select("id, file_name, file_path, file_size, mime_type, created_at")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (attachmentsError) {
    throw new Error(attachmentsError.message);
  }

  const currentApplication = application as JobApplication;
  const currentAttachments = (attachments ?? []) as JobAttachment[];

  return (
    <section className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-5 border-b border-white/10 pb-8">
        <Link
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-white"
          href="/applications"
        >
          Back to applications
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
              Application
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {currentApplication.role}
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {currentApplication.company}
              {currentApplication.location
                ? ` - ${currentApplication.location}`
                : ""}
            </p>
          </div>

          <span className="w-fit rounded-[8px] border border-white/10 bg-zinc-950 px-3 py-2 text-sm font-medium capitalize text-zinc-200">
            {currentApplication.status}
          </span>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_380px]">
        <Reveal>
          <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-lg font-semibold text-white">Details</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* <DetailItem
                label="Application ID"
                value={currentApplication.id}
              /> */}
              <DetailItem label="Status" value={currentApplication.status} />
              <DetailItem label="Company" value={currentApplication.company} />
              <DetailItem label="Role" value={currentApplication.role} />
              <DetailItem
                label="Location"
                value={currentApplication.location ?? "Not set"}
              />
              <DetailItem
                label="Salary"
                value={formatSalary(
                  currentApplication.salary_min,
                  currentApplication.salary_max,
                )}
              />
              <DetailItem
                label="Applied date"
                value={formatDate(currentApplication.applied_at)}
              />
              <DetailItem
                label="Follow-up date"
                value={formatDate(currentApplication.follow_up_at)}
              />
              <DetailItem
                label="Created"
                value={formatDateTime(currentApplication.created_at)}
              />
              <DetailItem
                label="Updated"
                value={formatDateTime(currentApplication.updated_at)}
              />
              <div className="rounded-[8px] border border-white/10 bg-black p-4">
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                  Job URL
                </p>
                {currentApplication.job_url ? (
                  <a
                    className="mt-3 inline-block break-all text-sm font-medium leading-6 text-zinc-200 underline-offset-4 hover:text-white hover:underline"
                    href={currentApplication.job_url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {currentApplication.job_url}
                  </a>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-zinc-200">
                    Not set
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[8px] border border-white/10 bg-black p-4">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Notes
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-zinc-200">
                {currentApplication.notes ?? "No notes yet."}
              </p>
            </div>
          </section>
        </Reveal>

        <div className="grid gap-6">
          <Reveal delay={0.05}>
            <AttachmentUploader applicationId={currentApplication.id} />
          </Reveal>

          <Reveal delay={0.1}>
            <AttachmentsPanel
              applicationId={currentApplication.id}
              attachments={currentAttachments}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
