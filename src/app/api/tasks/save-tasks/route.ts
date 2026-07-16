import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "~/lib/supabase/admin";
import { getAuthenticatedUserId } from "~/lib/clerk/server-auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

interface IncomingTask {
  id: string;
  text: string;
  isCompleted?: boolean;
}

export async function POST(req: NextRequest) {
  const userId = await getAuthenticatedUserId(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: "Not signed in" },
      { status: 401 }
    );
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase not configured" },
      { status: 500 }
    );
  }

  let body: { tasks?: IncomingTask[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const tasks = Array.isArray(body.tasks) ? body.tasks : [];
  const validTasks = tasks
    .filter((t) => t && typeof t.id === "string" && typeof t.text === "string" && t.text.trim() !== "")
    .map((t) => ({
      id: t.id,
      text: t.text,
      isCompleted: Boolean(t.isCompleted),
    }));

  if (validTasks.length === 0) {
    const { error: clearError } = await supabase
      .from("tasks")
      .update({ deleted_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("deleted_at", null);

    if (clearError) {
      console.error("[save-tasks] clear failed:", clearError);
      return NextResponse.json(
        { success: false, error: clearError.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, saved: 0, softDeleted: "all" });
  }

  const now = new Date().toISOString();
  const currentTaskIds = validTasks.map((t) => t.id);

  const { error: softDeleteError } = await supabase
    .from("tasks")
    .update({ deleted_at: now })
    .eq("user_id", userId)
    .not("notion_task_id", "in", `(${currentTaskIds.map((id) => `'${id}'`).join(",")})`)
    .is("deleted_at", null);

  if (softDeleteError) {
    console.error("[save-tasks] soft delete failed:", softDeleteError);
  }

  const rows = validTasks.map((t) => ({
    user_id: userId,
    text: t.text,
    completed: t.isCompleted,
    notion_task_id: t.id,
    deleted_at: null,
  }));

  const { error: upsertError } = await supabase
    .from("tasks")
    .upsert(rows, { onConflict: "notion_task_id" });

  if (upsertError) {
    console.error("[save-tasks] upsert failed:", upsertError);
    return NextResponse.json(
      { success: false, error: upsertError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, saved: rows.length });
}