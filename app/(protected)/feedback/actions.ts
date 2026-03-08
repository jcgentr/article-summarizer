"use server";

import config from "@/app/config";
import { createClient } from "@supabase/supabase-js";
import { Feedback } from "../types";

export async function getFeedback(password: string) {
  if (password !== process.env.FEEDBACK_PASSWORD) {
    return { error: "Invalid password", feedback: null };
  }

  const supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Feedback[]>();

  if (error) {
    return { error: error.message, feedback: null };
  }

  return { error: null, feedback };
}
