"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { categorize, type Day, type Nutrition, type Tag } from "@/lib/types";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  return { supabase, user };
}

export async function signOut() {
  const { supabase } = await requireUser();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}

// ---------- Recipes ----------
export interface AddRecipeInput extends Nutrition {
  name: string;
  tag: Tag;
  time: string;
  description: string;
  ingredients: string; // one per line, raw textarea value
  instructions: string; // one per line, raw textarea value
  prepVideoUrl: string | null;
  prepVideoIsVideo: boolean;
}

export async function addRecipe(input: AddRecipeInput) {
  const { supabase, user } = await requireUser();
  const name = input.name.trim();
  if (!name) return;

  const ingredients = input.ingredients.split("\n").map((s) => s.trim()).filter(Boolean);
  const instructions = input.instructions.split("\n").map((s) => s.trim()).filter(Boolean);

  await supabase.from("recipes").insert({
    user_id: user.id,
    name,
    tag: input.tag,
    time: input.time.trim() || "—",
    description: input.description.trim(),
    ingredients: ingredients.length ? ingredients : ["No ingredients listed"],
    instructions: instructions.length ? instructions : ["No instructions added yet"],
    prep_video_url: input.prepVideoUrl,
    prep_video_is_video: input.prepVideoIsVideo,
    serving_size: input.serving_size,
    calories: input.calories,
    total_fat_g: input.total_fat_g,
    saturated_fat_g: input.saturated_fat_g,
    cholesterol_mg: input.cholesterol_mg,
    sodium_mg: input.sodium_mg,
    total_carbs_g: input.total_carbs_g,
    fiber_g: input.fiber_g,
    sugars_g: input.sugars_g,
    protein_g: input.protein_g,
  });

  revalidatePath("/recipes");
}

export async function deleteRecipe(recipeId: string) {
  const { supabase, user } = await requireUser();
  await supabase.from("recipes").delete().eq("id", recipeId).eq("user_id", user.id);
  revalidatePath("/recipes");
  revalidatePath("/plan");
}

export async function addIngredientsToList(recipeId: string) {
  const { supabase, user } = await requireUser();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("ingredients")
    .eq("id", recipeId)
    .single();
  if (!recipe) return;

  const { data: existingItems } = await supabase
    .from("shopping_list_items")
    .select("name");
  const existing = new Set((existingItems || []).map((i) => i.name.toLowerCase()));

  const fresh = (recipe.ingredients as string[]).filter(
    (name) => !existing.has(name.toLowerCase())
  );

  if (fresh.length > 0) {
    await supabase.from("shopping_list_items").insert(
      fresh.map((name) => ({
        user_id: user.id,
        name,
        category: categorize(name),
        checked: false,
      }))
    );
  }

  revalidatePath("/list");
  revalidatePath("/recipes/" + recipeId);
}

// ---------- Meal Plan ----------
export async function assignMealPlanSlot(day: Day, slot: Tag, recipeId: string) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("meal_plan_entries")
    .upsert(
      { user_id: user.id, day, slot, recipe_id: recipeId },
      { onConflict: "user_id,day,slot" }
    );
  revalidatePath("/plan");
}

export async function clearMealPlanSlot(day: Day, slot: Tag) {
  const { supabase, user } = await requireUser();
  await supabase
    .from("meal_plan_entries")
    .delete()
    .eq("user_id", user.id)
    .eq("day", day)
    .eq("slot", slot);
  revalidatePath("/plan");
}

// ---------- Shopping List ----------
export async function toggleShoppingItem(id: string, checked: boolean) {
  const { supabase } = await requireUser();
  await supabase.from("shopping_list_items").update({ checked }).eq("id", id);
  revalidatePath("/list");
}

// ---------- Food Diary ----------
export async function saveDiaryEntry(input: {
  day: string;
  slot: string;
  recipeId: string;
  recipeName: string;
  eatenUrl: string;
  eatenIsVideo: boolean;
  actualEaten: string;
}) {
  const { supabase, user } = await requireUser();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("calories, protein_g, total_carbs_g, total_fat_g")
    .eq("id", input.recipeId)
    .single();

  await supabase.from("food_diary_entries").insert({
    user_id: user.id,
    day: input.day,
    slot: input.slot,
    recipe_id: input.recipeId,
    recipe_name: input.recipeName,
    eaten_url: input.eatenUrl,
    eaten_is_video: input.eatenIsVideo,
    actual_eaten: input.actualEaten,
    calories: recipe?.calories ?? 0,
    protein_g: recipe?.protein_g ?? 0,
    total_carbs_g: recipe?.total_carbs_g ?? 0,
    total_fat_g: recipe?.total_fat_g ?? 0,
  });

  revalidatePath("/diary");
  revalidatePath("/plan");
}
