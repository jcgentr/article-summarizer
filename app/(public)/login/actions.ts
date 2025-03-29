"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  console.log("logging in...");
  const plan = formData.get("plan") as string | undefined;
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    console.error(error);
    return { message: `${error.message}` };
  }

  console.log("logged in successfully");
  revalidatePath("/", "layout");

  // Instead of calling createCheckoutSession directly,
  // redirect to a page that will handle the checkout
  if (plan === "pro") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/");
    }

    const { data: userMetadata, error: metadataError } = await supabase
      .from("user_metadata")
      .select("plan_type")
      .eq("user_id", user.id)
      .single();

    if (metadataError) {
      console.error("Error fetching user metadata:", metadataError);
      redirect("/");
    }

    if (userMetadata?.plan_type === "pro") {
      // User already has pro plan, redirect to home
      redirect("/");
    }

    redirect("/checkout");
  }

  redirect("/");
}

export async function signInWithGithub() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return { message: `${error.message}` };
  }

  redirect(data.url ?? "/");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    return { message: `${error.message}` };
  }

  redirect(data.url ?? "/");
}
