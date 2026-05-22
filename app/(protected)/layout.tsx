import { AppSidebar } from "@/app/components/app-sidebar";
import { PageTransition } from "@/app/components/motion-effects";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <PageTransition className="min-h-screen lg:grid lg:grid-cols-[280px_1fr]">
        <AppSidebar userEmail={user.email ?? ""} />
        {children}
      </PageTransition>
    </main>
  );
}
