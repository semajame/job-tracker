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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_34%),#000000] text-white">
      <PageTransition className="min-h-screen lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
        <AppSidebar userEmail={user.email ?? ""} />
        {children}
      </PageTransition>
    </main>
  );
}
