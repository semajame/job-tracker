"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type AttachmentUploaderProps = {
  applicationId: string;
};

export function AttachmentUploader({ applicationId }: AttachmentUploaderProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"error" | "success" | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setMessage("");
    setStatus(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `/api/job-applications/${applicationId}/attachments`,
        {
          method: "POST",
          body: formData,
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not upload attachment.");
      }

      formRef.current?.reset();
      setStatus("success");
      setMessage("Attachment uploaded.");
      router.refresh();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Could not upload attachment.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      className="rounded-[8px] p-5"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      ref={formRef}
    >
      <h2 className="text-lg font-semibold text-white">Add attachment</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-400">
        Upload resumes, cover letters, offer letters, or notes for this role.
      </p>

      <label className="mt-5 block">
        <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
          File
        </span>
        <input
          className="mt-2 w-full rounded-[8px] border border-white/10 bg-black px-3 py-3 text-sm text-zinc-300 file:mr-4 file:rounded-[8px] file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:bg-zinc-200 cursor-pointer"
          name="file"
          required
          type="file"
        />
      </label>

      {message ? (
        <p
          className={`mt-4 rounded-[8px] border px-4 py-3 text-sm ${
            status === "success"
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
              : "border-white/10 bg-black text-zinc-200"
          }`}
        >
          {message}
        </p>
      ) : null}

      <button
        className="mt-5 h-11 w-full rounded-[8px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 cursor-pointer disabled:text-zinc-400 sm:w-fit"
        disabled={isUploading}
        type="submit"
      >
        {isUploading ? "Uploading..." : "Upload file"}
      </button>
    </form>
  );
}
