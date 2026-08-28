"use client";

import { useTransition } from "react";
import Modal from "./Modal";
import { TAG_STYLES, type Day, type Recipe, type Tag } from "@/lib/types";
import { assignMealPlanSlot } from "@/app/(app)/actions";

export default function RecipePickerModal({
  day,
  slot,
  recipes,
  onClose,
}: {
  day: Day;
  slot: Tag;
  recipes: Recipe[];
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Modal onClose={onClose}>
      <h2 className="font-script text-2xl text-accent mb-1">Choose a Recipe</h2>
      <p className="font-serif text-[13px] text-[#8A8195] mb-4.5" style={{ marginBottom: 18 }}>
        for {slot} on {day}
      </p>

      <div className="flex flex-col gap-1.5 mb-4">
        {recipes.map((r) => {
          const style = TAG_STYLES[r.tag];
          return (
            <button
              key={r.id}
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await assignMealPlanSlot(day, slot, r.id);
                  onClose();
                })
              }
              className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-[10px] min-h-11 text-left disabled:opacity-60"
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ background: style.color }}
              />
              <span className="text-sm text-[#3A3245]">{r.name}</span>
            </button>
          );
        })}
        {recipes.length === 0 && (
          <p className="font-serif text-sm text-[#8A8195]">No recipes yet — add one from the Recipes tab.</p>
        )}
      </div>
    </Modal>
  );
}
