import { createClient } from "@/lib/supabase/server";
import { DAYS, SLOTS, type MealPlanEntry, type Recipe } from "@/lib/types";
import PlanGrid from "@/components/PlanGrid";

export default async function PlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: recipes }, { data: entries }, { data: diary }] = await Promise.all([
    supabase.from("recipes").select("*").order("created_at", { ascending: true }),
    supabase.from("meal_plan_entries").select("*"),
    supabase.from("food_diary_entries").select("day, slot"),
  ]);

  const loggedKeys = new Set((diary || []).map((d) => `${d.day}-${d.slot}`));

  return (
    <div>
      <h1 className="mp-title mb-1">Meal Plan</h1>
      <p className="mp-text mb-6">
        Tap an empty slot to plan a meal, tap a planned meal to clear it, or tap the camera to log
        what you actually made and ate.
      </p>

      <PlanGrid
        days={DAYS}
        slots={SLOTS}
        recipes={(recipes as Recipe[]) || []}
        entries={(entries as MealPlanEntry[]) || []}
        loggedKeys={Array.from(loggedKeys)}
        userId={user?.id || ""}
      />
    </div>
  );
}
