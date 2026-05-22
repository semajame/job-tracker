import { Reveal } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { SettingsForm } from "./settings-form";

export const metadata: Metadata = {
  title: "Settings | Aaplio",
  description: "Manage your Aaplio account settings.",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <section className="mx-auto w-full px-5 py-8 sm:px-8 sm:py-10">
      <Reveal className="flex flex-col gap-4 border-b border-white/10 pb-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
            Account
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-5xl">
            Settings
          </h1>
          <p className="mt-4 text-sm leading-6 text-zinc-400">
            Signed in as {user.email}
          </p>
        </div>
      </Reveal>

      <Reveal className="mt-8 max-w-2xl">
        <SettingsForm userEmail={user.email ?? ""} />
      </Reveal>
    </section>
  );
}
