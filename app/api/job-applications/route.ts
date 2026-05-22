import { createClient } from "@/supabase/server";
import { type NextRequest } from "next/server";

const applicationStatuses = new Set([
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
]);

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status });
}

function cleanString(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function cleanInteger(value: unknown) {
  if (value === "" || value === null || value === undefined) {
    return null;
  }

  const numberValue =
    typeof value === "number" ? value : Number.parseInt(String(value), 10);

  if (!Number.isInteger(numberValue) || numberValue < 0) {
    return undefined;
  }

  return numberValue;
}

function cleanDate(value: unknown) {
  const text = cleanString(value);

  if (!text) {
    return null;
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : undefined;
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

function parsePayload(payload: Record<string, unknown>) {
  const company = cleanString(payload.company);
  const role = cleanString(payload.role);
  const status = cleanString(payload.status) ?? "wishlist";
  const salaryMin = cleanInteger(payload.salary_min);
  const salaryMax = cleanInteger(payload.salary_max);
  const appliedAt = cleanDate(payload.applied_at);
  const followUpAt = cleanDate(payload.follow_up_at);

  if (!company || !role) {
    return { error: "Company and role are required." };
  }

  if (!applicationStatuses.has(status)) {
    return { error: "Status is not valid." };
  }

  if (salaryMin === undefined || salaryMax === undefined) {
    return { error: "Salary values must be positive whole numbers." };
  }

  if (appliedAt === undefined || followUpAt === undefined) {
    return { error: "Dates must use YYYY-MM-DD format." };
  }

  return {
    data: {
      company,
      role,
      location: cleanString(payload.location),
      job_url: cleanString(payload.job_url),
      salary_min: salaryMin,
      salary_max: salaryMax,
      status,
      applied_at: appliedAt,
      follow_up_at: followUpAt,
      notes: cleanString(payload.notes),
    },
  };
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "offer")
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ applications: data });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return jsonResponse({ error: "Unauthorized." }, 401);
  }

  const payload = await request.json();
  const parsed = parsePayload(payload);

  if ("error" in parsed) {
    return jsonResponse({ error: parsed.error }, 400);
  }

  const { data, error } = await supabase
    .from("job_applications")
    .insert({ ...parsed.data, user_id: user.id })
    .select("*")
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ application: data }, 201);
}
