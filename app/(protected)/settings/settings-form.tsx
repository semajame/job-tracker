"use client";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SettingsFormProps = {
  userEmail: string;
};

type PasswordFieldProps = {
  autoComplete: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  value: string;
};

const deleteConfirmationPhrase = "delete my account";

function PasswordField({
  autoComplete,
  label,
  name,
  onChange,
  value,
}: PasswordFieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
        {label}
      </span>
      <input
        autoComplete={autoComplete}
        className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-emerald-300/45"
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required
        type="password"
        value={value}
      />
    </label>
  );
}

export function SettingsForm({ userEmail }: SettingsFormProps) {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"error" | "success" | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const canDeleteAccount = deleteConfirmation === deleteConfirmationPhrase;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage("");
    setStatus(null);

    if (newPassword.length < 6) {
      setMessage("New password must be at least 6 characters long.");
      setStatus("error");
      setIsSaving(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New password and confirmation do not match.");
      setStatus("error");
      setIsSaving(false);
      return;
    }

    if (currentPassword === newPassword) {
      setMessage(
        "Choose a new password that is different from your current one.",
      );
      setStatus("error");
      setIsSaving(false);
      return;
    }

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: currentPassword,
      });

      if (signInError) {
        setMessage("Current password is incorrect.");
        setStatus("error");
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        setMessage(updateError.message);
        setStatus("error");
        return;
      }

      resetForm();
      setMessage("Password updated successfully.");
      setStatus("success");
    } catch {
      setMessage("An unexpected error occurred while updating your password.");
      setStatus("error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!canDeleteAccount) {
      setDeleteMessage(`Type "${deleteConfirmationPhrase}" to continue.`);
      return;
    }

    setIsDeleting(true);
    setDeleteMessage("");

    try {
      const response = await fetch("/api/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ confirmation: deleteConfirmation }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete your account.");
      }

      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/sign-in");
      router.refresh();
    } catch (error) {
      setDeleteMessage(
        error instanceof Error
          ? error.message
          : "Could not delete your account.",
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-[8px] border border-emerald-300/10 bg-zinc-950 p-5">
        <div className="border-b border-emerald-300/10 pb-5">
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Confirm your current password before setting a new one.
          </p>
        </div>

        <form className="mt-5 grid gap-4" onSubmit={handleSubmit}>
          <PasswordField
            autoComplete="current-password"
            label="Current password"
            name="currentPassword"
            onChange={setCurrentPassword}
            value={currentPassword}
          />
          <PasswordField
            autoComplete="new-password"
            label="New password"
            name="newPassword"
            onChange={setNewPassword}
            value={newPassword}
          />
          <PasswordField
            autoComplete="new-password"
            label="Confirm new password"
            name="confirmPassword"
            onChange={setConfirmPassword}
            value={confirmPassword}
          />

          {message ? (
            <p
              className={`rounded-[8px] border px-4 py-3 text-sm ${
                status === "success"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                  : "border-white/10 bg-black text-zinc-200"
              }`}
            >
              {message}
            </p>
          ) : null}

          <button
            className="mt-1 h-11 w-full rounded-[8px] bg-white px-4 text-sm font-semibold text-black shadow-[0_0_18px_rgba(16,185,129,0.12)] transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 sm:w-fit"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Updating..." : "Update password"}
          </button>
        </form>
      </section>

      {/* <section className="rounded-[8px] border border-red-400/30 bg-zinc-950 p-5">
        <div className="border-b border-red-400/20 pb-5">
          <h2 className="text-lg font-semibold text-white">Delete account</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-400">
            Permanently delete your user account, applications, employers,
            notes, and attachments.
          </p>
        </div>

        {!isDeleteOpen ? (
          <button
            className="mt-5 h-11 w-full rounded-[8px] bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 sm:w-fit"
            onClick={() => {
              setIsDeleteOpen(true);
              setDeleteMessage("");
            }}
            type="button"
          >
            Delete user
          </button>
        ) : (
          <form className="mt-5 grid gap-4" onSubmit={handleDeleteAccount}>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
                Type &quot;{deleteConfirmationPhrase}&quot; to continue
              </span>
              <input
                autoComplete="off"
                className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-300/60"
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder={deleteConfirmationPhrase}
                value={deleteConfirmation}
              />
            </label>

            {deleteMessage ? (
              <p className="rounded-[8px] border border-white/10 bg-black px-4 py-3 text-sm text-zinc-200">
                {deleteMessage}
              </p>
            ) : null}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="h-11 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 disabled:cursor-not-allowed disabled:text-zinc-600"
                disabled={isDeleting}
                onClick={() => {
                  setIsDeleteOpen(false);
                  setDeleteConfirmation("");
                  setDeleteMessage("");
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className="h-11 rounded-[8px] bg-red-500 px-4 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-red-300"
                disabled={!canDeleteAccount || isDeleting}
                type="submit"
              >
                {isDeleting ? "Deleting..." : "Delete my account"}
              </button>
            </div>
          </form>
        )}
      </section> */}
    </div>
  );
}
