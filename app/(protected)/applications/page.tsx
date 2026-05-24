import {
  JobApplicationsClient,
  type JobApplication,
} from "@/app/(protected)/applications/applications";
import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications | Tracklio",
  description: "Create, update, and manage your tracked job applications.",
};

export default async function ApplicationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized.");
  }

  const { data: applications, error: applicationsError } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "offer")
    .order("created_at", { ascending: false });

  if (applicationsError) {
    throw new Error(applicationsError.message);
  }

  return (
    <section className="mx-auto min-w-0 w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-4 border-b border-emerald-300/10 pb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-emerald-300/80">
            Job Applications
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Applications
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Create, edit, and track each role in your search.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <JobApplicationsClient
          initialApplications={(applications ?? []) as JobApplication[]}
        />
      </Reveal>
    </section>
  );
}
