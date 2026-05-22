import {
  EmployersClient,
  type Employer,
  type JobApplicationOption,
} from "@/app/(protected)/employers/employers";
import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Employers | Aaplio",
  description: "Manage accepted roles and employment details.",
};

export default async function EmployersPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  const { data: employers, error: employersError } = await supabase
    .from("employers")
    .select(
      "*, job_applications(id, company, role, status, location, applied_at)",
    )
    .eq("user_id", user.id)
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (employersError) {
    throw new Error(employersError.message);
  }

  const { data: applications, error: applicationsError } = await supabase
    .from("job_applications")
    .select("id, company, role, status, location, applied_at")
    .eq("user_id", user.id)
    .eq("status", "offer")
    .order("created_at", { ascending: false });

  if (applicationsError) {
    throw new Error(applicationsError.message);
  }

  return (
    <section className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-4 border-b border-white/10 pb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Employers
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Employment records
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Track accepted roles, start dates, managers, salary, and offboarding
            details.
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-8">
        <EmployersClient
          initialApplications={
            (applications ?? []) as JobApplicationOption[]
          }
          initialEmployers={(employers ?? []) as Employer[]}
        />
      </Reveal>
    </section>
  );
}
