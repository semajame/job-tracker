"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { createPortal } from "react-dom";
import { AttachmentUploader } from "./attachment-uploader";

type JobAttachment = {
  id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  created_at: string;
};

type AttachmentsPanelProps = {
  applicationId: string;
  attachments: JobAttachment[];
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getAttachmentUrl(applicationId: string, attachmentId: string) {
  return `/api/job-applications/${applicationId}/attachments/${attachmentId}`;
}

function isPreviewable(mimeType: string) {
  return (
    mimeType.startsWith("image/") ||
    mimeType === "application/pdf" ||
    mimeType.startsWith("text/")
  );
}

export function AttachmentsPanel({
  applicationId,
  attachments,
}: AttachmentsPanelProps) {
  const shouldReduceMotion = useReducedMotion();
  const [previewAttachment, setPreviewAttachment] =
    useState<JobAttachment | null>(null);

  const previewUrl = previewAttachment
    ? getAttachmentUrl(applicationId, previewAttachment.id)
    : "";
  const downloadUrl = previewAttachment ? `${previewUrl}?download=1` : "";
  const shouldScrollAttachments = attachments.length >= 4;

  return (
    <>
      <section className="rounded-[8px] border border-white/10 bg-zinc-950">
        <AttachmentUploader applicationId={applicationId} />
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">Attachments</h2>
          <p className="mt-1 text-sm text-zinc-500">
            {attachments.length} {attachments.length === 1 ? "file" : "files"}
          </p>
        </div>

        {attachments.length > 0 ? (
          <div
            className={`divide-y divide-white/10 ${
              shouldScrollAttachments ? "max-h-[520px] overflow-y-auto" : ""
            }`}
          >
            {attachments.map((attachment) => (
              <article className="px-5 py-4" key={attachment.id}>
                <p className="break-words text-sm font-medium text-white">
                  {attachment.file_name}
                </p>
                <p className="mt-2 text-xs leading-5 text-zinc-500">
                  {formatFileSize(attachment.file_size)} -{" "}
                  {attachment.mime_type}
                </p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">
                  Uploaded {formatDateTime(attachment.created_at)}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="h-9 rounded-[8px] border border-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/5 cursor-pointer"
                    onClick={() => setPreviewAttachment(attachment)}
                    type="button"
                  >
                    View
                  </button>
                  <Link
                    className="grid h-9 place-items-center rounded-[8px] border border-white/10 px-3 text-xs font-semibold text-white transition hover:bg-white/5 cursor-pointer"
                    href={`${getAttachmentUrl(applicationId, attachment.id)}?download=1`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="px-5 py-10 text-sm text-zinc-400">
            No attachments yet.
          </div>
        )}
      </section>

      {typeof document !== "undefined"
        ? createPortal(
            <AnimatePresence>
              {previewAttachment ? (
                <motion.div
                  animate={{ opacity: 1 }}
                  aria-labelledby="attachment-dialog-title"
                  aria-modal="true"
                  className="fixed inset-0 z-50 grid min-h-screen place-items-center bg-black/70 px-5 py-6 "
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  key="attachment-dialog"
                  onClick={() => setPreviewAttachment(null)}
                  role="dialog"
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <motion.div
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="flex max-h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-[8px] border border-white/10 bg-zinc-950 shadow-2xl"
                    exit={
                      shouldReduceMotion
                        ? undefined
                        : { opacity: 0, scale: 0.96, y: 12 }
                    }
                    initial={
                      shouldReduceMotion
                        ? false
                        : { opacity: 0, scale: 0.96, y: 16 }
                    }
                    onClick={(event) => event.stopPropagation()}
                    transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="flex flex-col gap-4 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2
                          className="break-words text-lg font-semibold text-white"
                          id="attachment-dialog-title"
                        >
                          {previewAttachment.file_name}
                        </h2>
                        <p className="mt-2 text-xs leading-5 text-zinc-500">
                          {formatFileSize(previewAttachment.file_size)} -{" "}
                          {previewAttachment.mime_type}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Link
                          className="grid h-10 place-items-center rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5"
                          href={previewUrl}
                          rel="noreferrer"
                          target="_blank"
                        >
                          Open
                        </Link>
                        <Link
                          className="grid h-10 place-items-center rounded-[8px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200"
                          href={downloadUrl}
                        >
                          Download
                        </Link>
                        <button
                          className="h-10 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5 cursor-pointer"
                          onClick={() => setPreviewAttachment(null)}
                          type="button"
                        >
                          Close
                        </button>
                      </div>
                    </div>

                    <div className="min-h-[55vh] bg-black">
                      {isPreviewable(previewAttachment.mime_type) ? (
                        <iframe
                          className="h-[70vh] max-h-[70vh] w-full bg-black"
                          src={previewUrl}
                          title={previewAttachment.file_name}
                        />
                      ) : (
                        <div className="grid min-h-[55vh] place-items-center px-6 text-center">
                          <div>
                            <p className="text-base font-semibold text-white">
                              Preview is not available for this file type.
                            </p>
                            <p className="mt-3 text-sm leading-6 text-zinc-400">
                              You can open it in a new tab or download it.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              ) : null}
            </AnimatePresence>,
            document.body,
          )
        : null}
    </>
  );
}
