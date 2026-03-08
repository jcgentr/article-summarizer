"use server";

import config from "@/app/config";
import { createClient } from "@supabase/supabase-js";

export type DashboardUser = {
  user_id: string;
  email: string | null;
  plan_type: string;
  summaries_generated: number;
  billing_cycle_start: string;
  created_at: string;
  updated_at: string;
};

export async function getDashboardUsers(password: string) {
  if (password !== process.env.FEEDBACK_PASSWORD) {
    return { error: "Invalid password", users: null };
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

  const { data: users, error } = await supabase
    .from("user_metadata")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<DashboardUser[]>();

  if (error) {
    return { error: error.message, users: null };
  }

  return { error: null, users };
}
