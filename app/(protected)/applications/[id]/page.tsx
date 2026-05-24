import { ApplicationDetailsTabs } from "@/app/(protected)/applications/[id]/application-details-tabs";
import { AttachmentsPanel } from "@/app/(protected)/applications/[id]/attachments-panel";
import {
  JobNotesPanel,
  type JobNote,
} from "@/app/(protected)/applications/[id]/job-notes-panel";
import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Application Details | Tracklio",
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

  const { data: notes, error: notesError } = await supabase
    .from("job_notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (notesError) {
    throw new Error(notesError.message);
  }

  const currentApplication = application as JobApplication;
  const currentAttachments = (attachments ?? []) as JobAttachment[];
  const currentNotes = (notes ?? []) as JobNote[];

  return (
    <section className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-5 border-b border-emerald-300/10 pb-8">
        <Link
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-emerald-100"
          href="/applications"
        >
          Back to applications
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300/80">
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

          <span className="w-fit rounded-[8px] border border-emerald-300/20 bg-emerald-300/5 px-3 py-2 text-sm font-medium capitalize text-emerald-100">
            {currentApplication.status}
          </span>
        </div>
      </Reveal>

      <div className="mt-8">
        <Reveal>
          <ApplicationDetailsTabs application={currentApplication} />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px] xl:items-start">
          <div className="grid gap-6">
            <Reveal delay={0.15}>
              <JobNotesPanel
                applicationId={currentApplication.id}
                notes={currentNotes}
              />
            </Reveal>
          </div>

          <Reveal delay={0.2}>
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
