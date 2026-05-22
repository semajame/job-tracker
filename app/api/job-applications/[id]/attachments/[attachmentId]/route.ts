import { createClient } from "@/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const attachmentsBucket = "job-attachments";

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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; attachmentId: string }> },
) {
  const { id, attachmentId } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const { data: attachment, error: attachmentError } = await supabase
    .from("job_attachments")
    .select("file_name, file_path")
    .eq("id", attachmentId)
    .eq("application_id", id)
    .eq("user_id", user.id)
    .single();

  if (attachmentError || !attachment) {
    return jsonResponse({ error: "Attachment not found." }, 404);
  }

  const shouldDownload = request.nextUrl.searchParams.get("download") === "1";
  const { data, error } = await supabase.storage
    .from(attachmentsBucket)
    .createSignedUrl(
      attachment.file_path,
      60,
      shouldDownload ? { download: attachment.file_name } : undefined,
    );

  if (error || !data?.signedUrl) {
    return jsonResponse(
      { error: error?.message ?? "Could not create file URL." },
      500,
    );
  }

  return NextResponse.redirect(data.signedUrl);
}
