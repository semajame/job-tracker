import { createAdminClient } from "@/supabase/admin";
import { createClient } from "@/supabase/server";
import { type NextRequest } from "next/server";

const attachmentsBucket = "job-attachments";
const deleteConfirmationPhrase = "delete my account";

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

function chunkValues<T>(values: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < values.length; index += size) {
    chunks.push(values.slice(index, index + size));
  }

  return chunks;
}

async function parseJson(request: NextRequest) {
  try {
    return (await request.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export async function DELETE(request: NextRequest) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const payload = await parseJson(request);
  const confirmation =
    typeof payload?.confirmation === "string" ? payload.confirmation.trim() : "";

  if (confirmation !== deleteConfirmationPhrase) {
    return jsonResponse(
      { error: `Type "${deleteConfirmationPhrase}" to delete your account.` },
      400,
    );
  }

  let admin;

  try {
    admin = createAdminClient();
  } catch {
    return jsonResponse(
      {
        error:
          "Account deletion is not configured. Add SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY on the server.",
      },
      500,
    );
  }

  const { data: attachments, error: attachmentsError } = await admin
    .from("job_attachments")
    .select("file_path")
    .eq("user_id", user.id);

  if (attachmentsError) {
    return jsonResponse({ error: attachmentsError.message }, 500);
  }

  const attachmentPaths = (
    (attachments ?? []) as { file_path: string | null }[]
  )
    .map((attachment) => attachment.file_path)
    .filter((filePath): filePath is string => Boolean(filePath));

  for (const paths of chunkValues(attachmentPaths, 100)) {
    const { error: storageError } = await admin.storage
      .from(attachmentsBucket)
      .remove(paths);

    if (storageError) {
      return jsonResponse({ error: storageError.message }, 500);
    }
  }

  const tablesToDelete = [
    "job_attachments",
    "job_notes",
    "employers",
    "job_applications",
  ];

  for (const table of tablesToDelete) {
    const { error } = await admin.from(table).delete().eq("user_id", user.id);

    if (error) {
      return jsonResponse({ error: error.message }, 500);
    }
  }

  const { error: deleteUserError } = await admin.auth.admin.deleteUser(user.id);

  if (deleteUserError) {
    return jsonResponse({ error: deleteUserError.message }, 500);
  }

  await supabase.auth.signOut();

  return jsonResponse({ success: true });
}
