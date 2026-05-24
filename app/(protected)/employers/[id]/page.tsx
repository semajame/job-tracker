import { AttachmentsPanel } from "@/app/(protected)/applications/[id]/attachments-panel";
import {
  JobNotesPanel,
  type JobNote,
} from "@/app/(protected)/applications/[id]/job-notes-panel";
import { EmployerDetailsTabs } from "@/app/(protected)/employers/[id]/employer-details-tabs";
import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Employer Details | Tracklio",
  description: "View employer details and manage related attachments.",
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

type JobAttachment = {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

export default async function EmployerDetailsPage(props: {
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

  const { data: employer, error: employerError } = await supabase
    .from("employers")
    .select("*, job_applications(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (employerError || !employer) {
    notFound();
  }

  const currentEmployer = employer as Employer;
  const linkedApplication = currentEmployer.job_applications;
  const applicationId = currentEmployer.application_id;

  const { data: attachments, error: attachmentsError } = applicationId
    ? await supabase
        .from("job_attachments")
        .select("id, file_name, file_path, file_size, mime_type, created_at")
        .eq("application_id", applicationId)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [], error: null };

  if (attachmentsError) {
    throw new Error(attachmentsError.message);
  }

  const { data: notes, error: notesError } = applicationId
    ? await supabase
        .from("job_notes")
        .select("id, title, content, is_pinned, created_at, updated_at")
        .eq("application_id", applicationId)
        .eq("user_id", user.id)
        .order("is_pinned", { ascending: false })
        .order("updated_at", { ascending: false })
    : { data: [], error: null };

  if (notesError) {
    throw new Error(notesError.message);
  }

  const currentAttachments = (attachments ?? []) as JobAttachment[];
  const currentNotes = (notes ?? []) as JobNote[];
  const employerName = linkedApplication?.company ?? "Unlinked employer";
  const employerSubtitle = linkedApplication
    ? `${linkedApplication.role}${
        linkedApplication.location ? ` - ${linkedApplication.location}` : ""
      }`
    : "No application selected";

  return (
    <section className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-5 border-b border-emerald-300/10 pb-8">
        <Link
          className="w-fit text-sm font-medium text-zinc-400 transition hover:text-emerald-100"
          href="/employers"
        >
          Back to employers
        </Link>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300/80">
              Employer
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {employerName}
            </h1>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              {employerSubtitle}
            </p>
          </div>

          <span className="w-fit rounded-[8px] border border-emerald-300/20 bg-emerald-300/5 px-3 py-2 text-sm font-medium text-emerald-100">
            {currentEmployer.is_current ? "Current" : "Past"}
          </span>
        </div>
      </Reveal>

      <div className="mt-8">
        <Reveal>
          <EmployerDetailsTabs employer={currentEmployer} />
        </Reveal>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px] xl:items-start">
          {applicationId ? (
            <>
              <div className="grid gap-6">
                <Reveal delay={0.15}>
                  <JobNotesPanel
                    applicationId={applicationId}
                    notes={currentNotes}
                  />
                </Reveal>
              </div>

              <Reveal delay={0.2}>
                <AttachmentsPanel
                  applicationId={applicationId}
                  attachments={currentAttachments}
                />
              </Reveal>
            </>
          ) : (
            <Reveal delay={0.1}>
              <section className="rounded-[8px] border border-white/10 bg-zinc-950 p-5">
                <h2 className="text-lg font-semibold text-white">
                  Attachments
                </h2>
                <p className="mt-3 text-sm leading-6 text-zinc-400">
                  Link this employer to an offer application before adding
                  files.
                </p>
              </section>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
