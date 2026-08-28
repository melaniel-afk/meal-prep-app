"use client";

import { useState, useTransition } from "react";
import { TAG_STYLES, type Day, type MealPlanEntry, type Recipe, type Tag } from "@/lib/types";
import { clearMealPlanSlot } from "@/app/(app)/actions";
import RecipePickerModal from "./RecipePickerModal";
import LogMealModal from "./LogMealModal";

export default function PlanGrid({
  days,
  slots,
  recipes,
  entries,
  loggedKeys,
  userId,
}: {
  days: Day[];
  slots: Tag[];
  recipes: Recipe[];
  entries: MealPlanEntry[];
  loggedKeys: string[];
  userId: string;
}) {
  const [picker, setPicker] = useState<{ day: Day; slot: Tag } | null>(null);
  const [log, setLog] = useState<{ day: Day; slot: Tag; recipeId: string; recipeName: string } | null>(
    null
  );
  const [, startTransition] = useTransition();

  const logged = new Set(loggedKeys);
  const byKey = new Map(entries.map((e) => [`${e.day}-${e.slot}`, e]));
  const recipeById = new Map(recipes.map((r) => [r.id, r]));

  return (
    <>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `128px repeat(${days.length}, minmax(0,1fr))` }}
      >
        <div />
        {days.map((d) => (
          <div key={d} className="text-center text-[12.5px] font-semibold text-[#6E6579] py-2">
            {d}
          </div>
        ))}

        {slots.map((slot) => (
          <div key={slot} className="contents">
            <div className="flex items-center text-[12.5px] font-semibold text-[#6E6579]">
              {slot}
            </div>
            {days.map((day) => {
              const key = `${day}-${slot}`;
              const entry = byKey.get(key);
              const recipe = entry ? recipeById.get(entry.recipe_id) : undefined;
              const style = recipe ? TAG_STYLES[recipe.tag] : null;
              const isLogged = logged.has(key);

              return (
                <div
                  key={key}
                  onClick={() => {
                    if (recipe) {
                      startTransition(() => clearMealPlanSlot(day, slot));
                    } else {
                      setPicker({ day, slot });
                    }
                  }}
                  className="cursor-pointer relative min-h-[72px] rounded-xl flex items-center justify-center p-2"
                  style={{
                    background: recipe ? style!.bg : "#FFFDFB",
                    border: recipe ? "1.5px solid transparent" : "1.5px dashed #D8C6EC",
                  }}
                >
                  {recipe ? (
                    <>
                      <span
                        className="text-xs font-semibold text-center leading-tight px-4.5"
                        style={{ color: style!.text, padding: "0 18px" }}
                      >
                        {recipe.name}
                      </span>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setLog({ day, slot, recipeId: recipe.id, recipeName: recipe.name });
                        }}
                        className="absolute top-1 right-1 w-[22px] h-[22px] rounded-full flex items-center justify-center"
                        style={{ background: isLogged ? "#8E6FBE" : "rgba(255,255,255,0.7)" }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={isLogged ? "#fff" : style!.text}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 8a2 2 0 0 1 2-2h1.2a1 1 0 0 0 .87-.5L9 4h6l.93 1.5a1 1 0 0 0 .87.5H18a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
                          <circle cx="12" cy="13" r="3" />
                        </svg>
                      </div>
                    </>
                  ) : (
                    <span className="text-lg text-[#C9BBDD]">+</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {picker && (
        <RecipePickerModal
          day={picker.day}
          slot={picker.slot}
          recipes={recipes}
          onClose={() => setPicker(null)}
        />
      )}

      {log && (
        <LogMealModal
          day={log.day}
          slot={log.slot}
          recipeId={log.recipeId}
          recipeName={log.recipeName}
          userId={userId}
          initial={{ actualEaten: log.recipeName }}
          onClose={() => setLog(null)}
        />
      )}
    </>
  );
}
