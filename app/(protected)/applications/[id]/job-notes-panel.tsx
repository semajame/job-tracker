"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type JobNote = {
  id: string;
  title: string | null;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
};

type JobNotesPanelProps = {
  applicationId: string;
  notes: JobNote[];
};

type NoteFormState = {
  title: string;
  content: string;
  is_pinned: boolean;
};

const emptyForm: NoteFormState = {
  title: "",
  content: "",
  is_pinned: false,
};

const noteContentMaxLength = 500;

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function sortNotes(notes: JobNote[]) {
  return [...notes].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) {
      return a.is_pinned ? -1 : 1;
    }

    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  });
}

function getNoteRotation(index: number) {
  const rotations = ["-1deg", "0.75deg", "-0.5deg", "1deg"];
  return rotations[index % rotations.length];
}

export function JobNotesPanel({ applicationId, notes }: JobNotesPanelProps) {
  const router = useRouter();
  const [currentNotes, setCurrentNotes] = useState(() => sortNotes(notes));
  const [form, setForm] = useState<NoteFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyNoteId, setBusyNoteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isEditing = Boolean(editingId);
  const shouldScrollNotes = currentNotes.length >= 6;

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);

    const endpoint = editingId
      ? `/api/job-applications/${applicationId}/notes/${editingId}`
      : `/api/job-applications/${applicationId}/notes`;
    const method = editingId ? "PATCH" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not save note.");
      }

      setCurrentNotes((existingNotes) =>
        sortNotes(
          editingId
            ? existingNotes.map((note) =>
                note.id === data.note.id ? data.note : note,
              )
            : [data.note, ...existingNotes],
        ),
      );
      resetForm();
      setMessage(editingId ? "Note updated." : "Note added.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not save note.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const editNote = (note: JobNote) => {
    setEditingId(note.id);
    setForm({
      title: note.title ?? "",
      content: note.content,
      is_pinned: note.is_pinned,
    });
    setMessage(null);
  };

  const updateNote = async (note: JobNote, updates: Partial<NoteFormState>) => {
    setBusyNoteId(note.id);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/job-applications/${applicationId}/notes/${note.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: note.title ?? "",
            content: note.content,
            is_pinned: note.is_pinned,
            ...updates,
          }),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not update note.");
      }

      setCurrentNotes((existingNotes) =>
        sortNotes(
          existingNotes.map((currentNote) =>
            currentNote.id === data.note.id ? data.note : currentNote,
          ),
        ),
      );
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not update note.",
      );
    } finally {
      setBusyNoteId(null);
    }
  };

  const deleteNote = async (noteId: string) => {
    setBusyNoteId(noteId);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/job-applications/${applicationId}/notes/${noteId}`,
        { method: "DELETE" },
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Could not delete note.");
      }

      setCurrentNotes((existingNotes) =>
        existingNotes.filter((note) => note.id !== noteId),
      );

      if (editingId === noteId) {
        resetForm();
      }

      setMessage("Note deleted.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Could not delete note.",
      );
    } finally {
      setBusyNoteId(null);
    }
  };

  return (
    <section className="rounded-[8px] border border-white/10 bg-zinc-950">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Notes</h2>
        <p className="mt-1 text-sm text-zinc-500">
          {currentNotes.length} {currentNotes.length === 1 ? "note" : "notes"}
        </p>
      </div>

      <form className="border-b border-white/10 p-5" onSubmit={submitNote}>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
            Title
          </span>
          <input
            className="mt-2 h-11 w-full rounded-[8px] border border-white/10 bg-black px-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
            onChange={(event) =>
              setForm((current) => ({ ...current, title: event.target.value }))
            }
            placeholder="Phone screen notes"
            value={form.title}
          />
        </label>

        <label className="mt-4 block">
          <span className="flex items-center justify-between gap-4">
            <span className="text-xs font-medium uppercase tracking-[0.1em] text-zinc-500">
              Content
            </span>
            <span className="text-xs text-zinc-500">
              {form.content.length}/{noteContentMaxLength}
            </span>
          </span>
          <textarea
            className="mt-2 min-h-32 w-full resize-y rounded-[8px] border border-white/10 bg-black px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-zinc-600 focus:border-white/30"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                content: event.target.value,
              }))
            }
            maxLength={noteContentMaxLength}
            placeholder="Interview feedback, recruiter details, next steps"
            required
            value={form.content}
          />
        </label>

        <label className="mt-4 flex items-center gap-3 text-sm text-zinc-300">
          <input
            checked={form.is_pinned}
            className="h-4 w-4 accent-white"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                is_pinned: event.target.checked,
              }))
            }
            type="checkbox"
          />
          Pin this note
        </label>

        {message ? (
          <p className="mt-4 rounded-[8px] border border-white/10 bg-black px-4 py-3 text-sm text-zinc-200">
            {message}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            className="h-11 rounded-[8px] bg-white px-4 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : isEditing ? "Update note" : "Add note"}
          </button>
          {isEditing ? (
            <button
              className="h-11 rounded-[8px] border border-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/5"
              onClick={resetForm}
              type="button"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div
        className={`bg-black/30 p-5 ${
          shouldScrollNotes ? "max-h-[720px] overflow-y-auto pr-3" : ""
        }`}
      >
        {currentNotes.length > 0 ? (
          <div className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {currentNotes.map((note, index) => (
              <article
                className="relative overflow-hidden rounded-[8px] border border-amber-300/70 bg-amber-100 p-4 pt-6 text-zinc-950 shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition-transform hover:rotate-0"
                key={note.id}
                style={{ transform: `rotate(${getNoteRotation(index)})` }}
              >
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-2 h-5 w-20 -translate-x-1/2 rounded-[4px] bg-white/55 shadow-sm"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="break-words text-base font-semibold text-zinc-950">
                        {note.title ?? "Untitled note"}
                      </h3>
                      {note.is_pinned ? (
                        <span className="rounded-[8px] border border-black/10 bg-zinc-950 px-2 py-1 text-xs font-semibold text-white">
                          Pinned
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-zinc-700">
                      Updated {formatDateTime(note.updated_at)}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    <button
                      className="h-9 rounded-[8px] border border-black/10 bg-white/45 px-3 text-xs font-semibold text-zinc-950 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:text-zinc-500"
                      disabled={busyNoteId === note.id}
                      onClick={() =>
                        updateNote(note, { is_pinned: !note.is_pinned })
                      }
                      type="button"
                    >
                      {note.is_pinned ? "Unpin" : "Pin"}
                    </button>
                    <button
                      className="h-9 rounded-[8px] border border-black/10 bg-white/45 px-3 text-xs font-semibold text-zinc-950 transition hover:bg-white/70"
                      onClick={() => editNote(note)}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="h-9 rounded-[8px] border border-black/10 bg-white/45 px-3 text-xs font-semibold text-zinc-800 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:text-zinc-500"
                      disabled={busyNoteId === note.id}
                      onClick={() => deleteNote(note.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-6 text-zinc-900">
                  {note.content}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-[8px] border border-dashed border-white/10 px-5 py-10 text-sm text-zinc-400">
            No notes yet.
          </div>
        )}
      </div>
    </section>
  );
}
