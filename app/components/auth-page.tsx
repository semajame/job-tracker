"use client";

import { createClient } from "@/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PageTransition, Reveal } from "./motion-effects";

const supabase = createClient();

type AuthPageProps = {
  mode: "sign-in" | "sign-up";
};

const authCopy = {
  "sign-in": {
    eyebrow: "Welcome back",
    title: "Sign in to Aaplio",
    description:
      "Return to your job search workspace and review the next action for every active opportunity.",
    submitLabel: "Sign in",
    alternateLabel: "New to Aaplio?",
    alternateAction: "Create an account",
    alternateHref: "/sign-up",
  },
  "sign-up": {
    eyebrow: "Start your workspace",
    title: "Create your Aaplio account",
    description:
      "Set up a focused pipeline for applications, interviews, follow-ups, and offers.",
    submitLabel: "Create account",
    alternateLabel: "Already have an account?",
    alternateAction: "Sign in",
    alternateHref: "/sign-in",
  },
};

function Field({
  autoComplete,
  label,
  name,
  onChange,
  type,
  value,
}: {
  autoComplete: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  type: string;
  value: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-zinc-200">
      <span>{label}</span>
      <input
        autoComplete={autoComplete}
        className="h-12 rounded-[8px] border border-white/10 bg-black px-4 text-base text-white outline-none transition placeholder:text-zinc-600 focus:border-white/40 focus:ring-2 focus:ring-white/10"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required
        type={type}
        value={value}
      />
    </label>
  );
}

export function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");

  const copy = authCopy[mode];
  const isSignUp = mode === "sign-up";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    // Password match validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (data?.user?.identities && data.user.identities.length === 0) {
        setError("Email is already registered");
        return;
      }

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      setSuccess(
        "Registration successful! Please check your email to confirm your account.",
      );
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-black text-white lg:grid-cols-[1fr_520px]">
      <div
        className="absolute inset-0 opacity-30"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <section className="relative hidden border-r border-white/10 bg-[linear-gradient(200deg,#262626_0%,#000000_72%)] px-10 py-8 lg:flex lg:flex-col lg:justify-between">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Aaplio home"
        >
          <span className="grid size-8 place-items-center rounded-[8px] border border-white/15 bg-white text-sm font-bold text-black">
            T
          </span>
          <span className="text-sm font-semibold text-white">Aaplio</span>
        </Link>

        <Reveal className="max-w-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-400">
            {copy.eyebrow}
          </p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] text-white">
            Keep your search organized before the next opportunity moves.
          </h1>
          <p className="mt-6 max-w-lg text-base leading-8 text-zinc-400">
            Track roles, deadlines, recruiter conversations, and interview prep
            in one quiet command center built for momentum.
          </p>
        </Reveal>

        <Reveal className="grid max-w-xl grid-cols-3 gap-3" delay={0.12}>
          {["Roles", "Follow-ups", "Offers"].map((item) => (
            <div
              key={item}
              className="rounded-[8px] border border-white/10 bg-black/60 p-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                {item}
              </p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {item === "Roles" ? "24" : item === "Follow-ups" ? "9" : "2"}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="relative flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <PageTransition className="w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-3 lg:hidden"
            aria-label="Aaplio home"
          >
            <span className="grid size-8 place-items-center rounded-[8px] border border-white/15 bg-white text-sm font-bold text-black">
              T
            </span>
            <span className="text-sm font-semibold text-white">Aaplio</span>
          </Link>

          <div className="rounded-[8px] border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/60 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.1em] text-zinc-500">
              {copy.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">
              {copy.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {copy.description}
            </p>

            <form
              className="mt-8 grid gap-5"
              onSubmit={isSignUp ? handleRegister : handleLogin}
            >
              <Field
                autoComplete="email"
                label="Email"
                name="email"
                onChange={setEmail}
                type="email"
                value={email}
              />
              <Field
                autoComplete={isSignUp ? "new-password" : "current-password"}
                label="Password"
                name="password"
                onChange={setPassword}
                type="password"
                value={password}
              />
              {isSignUp ? (
                <Field
                  autoComplete="new-password"
                  label="Confirm password"
                  name="confirmPassword"
                  onChange={setConfirmPassword}
                  type="password"
                  value={confirmPassword}
                />
              ) : null}

              {error ? (
                <p className="rounded-[8px] border border-white/10 bg-black px-4 py-3 text-sm text-zinc-200">
                  {error}
                </p>
              ) : null}
              {success ? (
                <p className="rounded-[8px] border border-white/10 bg-black px-4 py-3 text-sm text-zinc-200">
                  {success}
                </p>
              ) : null}

              <button
                className="mt-2 h-12 rounded-[8px] bg-white px-5 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-500"
                disabled={loading}
                type="submit"
              >
                {loading ? "Please wait..." : copy.submitLabel}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              {copy.alternateLabel}{" "}
              <Link
                href={copy.alternateHref}
                className="font-semibold text-white hover:text-zinc-300"
              >
                {copy.alternateAction}
              </Link>
            </p>
          </div>
        </PageTransition>
      </section>
    </main>
  );
}
