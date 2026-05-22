import { createClient } from "@/supabase/server";
import { type NextRequest } from "next/server";

const employmentTypes = new Set(["full_time", "part_time", "contract"]);

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

function cleanBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
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

async function validateApplication(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  applicationId: string | null,
) {
  if (!applicationId) {
    return null;
  }

  const { data, error } = await supabase
    .from("job_applications")
    .select("id")
    .eq("id", applicationId)
    .eq("user_id", userId)
    .eq("status", "offer")
    .single();

  if (error || !data) {
    return "Only offer-stage applications can be linked.";
  }

  return null;
}

function parsePayload(payload: Record<string, unknown>) {
  const applicationId = cleanString(payload.application_id);
  const employmentType = cleanString(payload.employment_type);
  const startDate = cleanDate(payload.start_date);
  const endDate = cleanDate(payload.end_date);
  const salary = cleanInteger(payload.salary);
  const isCurrent = cleanBoolean(payload.is_current);

  if (employmentType && !employmentTypes.has(employmentType)) {
    return { error: "Employment type is not valid." };
  }

  if (startDate === undefined || endDate === undefined) {
    return { error: "Dates must use YYYY-MM-DD format." };
  }

  if (salary === undefined) {
    return { error: "Salary must be a positive whole number." };
  }

  if (isCurrent === undefined) {
    return { error: "Current employer value is not valid." };
  }

  return {
    data: {
      application_id: applicationId,
      department: cleanString(payload.department),
      manager_name: cleanString(payload.manager_name),
      manager_email: cleanString(payload.manager_email),
      office_address: cleanString(payload.office_address),
      employment_type: employmentType,
      start_date: startDate,
      end_date: endDate,
      salary,
      currency: cleanString(payload.currency) ?? "PHP",
      is_current: isCurrent,
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
    .from("employers")
    .select(
      "*, job_applications(id, company, role, status, location, applied_at)",
    )
    .eq("user_id", user.id)
    .order("is_current", { ascending: false })
    .order("start_date", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ employers: data });
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

  const applicationError = await validateApplication(
    supabase,
    user.id,
    parsed.data.application_id,
  );

  if (applicationError) {
    return jsonResponse({ error: applicationError }, 400);
  }

  const { data, error } = await supabase
    .from("employers")
    .insert({ ...parsed.data, user_id: user.id })
    .select(
      "*, job_applications(id, company, role, status, location, applied_at)",
    )
    .single();

  if (error) {
    return jsonResponse({ error: error.message }, 500);
  }

  return jsonResponse({ employer: data }, 201);
}
