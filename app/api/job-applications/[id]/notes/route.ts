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

async function applicationExists(
  supabase: Awaited<ReturnType<typeof createClient>>,
  applicationId: string,
  userId: string,
) {
  const { data, error } = await supabase
    .from("job_applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .single();

  return !error && Boolean(data);
}

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  if (!(await applicationExists(supabase, id, user.id))) {
    return jsonResponse({ error: "Application not found." }, 404);
  }

  const { data, error } = await supabase
    .from("job_notes")
    .select("id, title, content, is_pinned, created_at, updated_at")
    .eq("application_id", id)
    .eq("user_id", user.id)
    .order("is_pinned", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ notes: data });
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

  if (!(await applicationExists(supabase, id, user.id))) {
    return jsonResponse({ error: "Application not found." }, 404);
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
    .insert({
      user_id: user.id,
      application_id: id,
      title: cleanString(payload.title),
      content,
      is_pinned: Boolean(payload.is_pinned),
    })
    .select("id, title, content, is_pinned, created_at, updated_at")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ note: data }, 201);
}
