"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_RECIPES } from "@/lib/types";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/dashboard");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  // Seed the starter recipes for a brand-new account so the app isn't empty on first login.
  if (data.user) {
    const { count } = await supabase
      .from("recipes")
      .select("id", { count: "exact", head: true });
    if (!count) {
      await supabase.from("recipes").insert(
        DEFAULT_RECIPES.map((r) => ({ ...r, user_id: data.user!.id }))
      );
    }
  }

  redirect("/dashboard");
}
