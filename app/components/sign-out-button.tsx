"use client";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.push("/sign-in");
    router.refresh();
  };

  return (
    <button
      className={`h-10 rounded-[8px] border border-white/10 bg-zinc-900 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:text-zinc-500 ${className}`}
      disabled={loading}
      onClick={handleSignOut}
      type="button"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}
