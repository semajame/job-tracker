import { createClient } from "@/supabase/server";
import { type NextRequest } from "next/server";

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

const noteContentMaxLength = 800;

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
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

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; noteId: string }> },
) {
  const { id, noteId } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const payload = await request.json();
  const content = cleanString(payload.content);

  if (!content) {
    return jsonResponse({ error: "Note content is required." }, 400);
  }

  if (content.length > noteContentMaxLength) {
    return jsonResponse(
      { error: `Note content must be ${noteContentMaxLength} characters or fewer.` },
      400,
    );
  }

  const { data, error } = await supabase
    .from("job_notes")
    .update({
      title: cleanString(payload.title),
      content,
      is_pinned: Boolean(payload.is_pinned),
      updated_at: new Date().toISOString(),
    })
    .eq("id", noteId)
    .eq("application_id", id)
    .eq("user_id", user.id)
    .select("id, title, content, is_pinned, created_at, updated_at")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ note: data });
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string; noteId: string }> },
) {
  const { id, noteId } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const { error } = await supabase
    .from("job_notes")
    .delete()
    .eq("id", noteId)
    .eq("application_id", id)
    .eq("user_id", user.id);

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ success: true });
}
