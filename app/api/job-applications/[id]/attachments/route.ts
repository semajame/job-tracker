import { createClient } from "@/supabase/server";
import { randomUUID } from "node:crypto";
import { type NextRequest } from "next/server";

const attachmentsBucket = "job-attachments";
const maxFileSize = 10 * 1024 * 1024;

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function getFileExtension(fileName: string) {
  const extension = fileName.split(".").pop();

  if (!extension || extension === fileName) {
    return "";
  }

  return `.${extension.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()}`;
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

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const { data: application, error: applicationError } = await supabase
    .from("job_applications")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (applicationError || !application) {
    return jsonResponse({ error: "Application not found." }, 404);
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return jsonResponse({ error: "A file is required." }, 400);
  }

  if (file.size <= 0) {
    return jsonResponse({ error: "File cannot be empty." }, 400);
  }

  if (file.size > maxFileSize) {
    return jsonResponse({ error: "File must be 10MB or smaller." }, 400);
  }

  const filePath = `${user.id}/${id}/${randomUUID()}${getFileExtension(file.name)}`;
  const mimeType = file.type || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from(attachmentsBucket)
    .upload(filePath, file, {
      contentType: mimeType,
      upsert: false,
    });

  if (uploadError) {
    return jsonResponse({ error: uploadError.message }, 500);
  }

  const { data: attachment, error: insertError } = await supabase
    .from("job_attachments")
    .insert({
      user_id: user.id,
      application_id: id,
      file_name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: mimeType,
    })
    .select("*")
    .single();

  if (insertError) {
    await supabase.storage.from(attachmentsBucket).remove([filePath]);
    return jsonResponse({ error: insertError.message }, 500);
  }

  return jsonResponse({ attachment }, 201);
}
