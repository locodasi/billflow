// actions/project-cookie.ts
"use server";

import { cookies } from "next/headers";

export async function setProjectCookieAction(projectId: string) {
  const cookieStore = await cookies();
  cookieStore.set("project_id", projectId, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}

export async function clearProjectCookie() {
    const cookieStore = await cookies();
    cookieStore.delete("project_id");
}

import { createServerClient } from "@/lib/supabase.server";

export async function getCurrentProjectId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieProjectId = cookieStore.get("project_id")?.value;

  if (cookieProjectId) return cookieProjectId;

  const supabase = await createServerClient();

  const { data, error } = await supabase
    .from("projects")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;

  return data.id;
}
