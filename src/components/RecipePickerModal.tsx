"use client";

import { useState, useTransition } from "react";
import Modal from "./Modal";
import { TAG_STYLES, type Day, type Recipe, type Tag } from "@/lib/types";
import { assignMealPlanSlot } from "@/app/(app)/actions";

function RecipeRow({
  r,
  pending,
  onPick,
}: {
  r: Recipe;
  pending: boolean;
  onPick: () => void;
}) {
  const style = TAG_STYLES[r.tag];
  return (
    <button
      disabled={pending}
      onClick={onPick}
      className="cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-[10px] min-h-11 text-left disabled:opacity-60 w-full"
    >
      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: style.color }} />
      <span className="text-sm text-[#3A3245]">{r.name}</span>
    </button>
  );
}

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
  const [showOthers, setShowOthers] = useState(false);

  const matching = recipes.filter((r) => r.tag === slot);
  const others = recipes.filter((r) => r.tag !== slot);

  function pick(id: string) {
    startTransition(async () => {
      await assignMealPlanSlot(day, slot, id);
      onClose();
    });
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="font-script text-2xl text-accent mb-1">Choose a Recipe</h2>
      <p className="font-serif text-[13px] text-[#8A8195] mb-4.5" style={{ marginBottom: 18 }}>
        for {slot} on {day}
      </p>

      <div className="flex flex-col gap-1.5 mb-2">
        {matching.map((r) => (
          <RecipeRow key={r.id} r={r} pending={pending} onPick={() => pick(r.id)} />
        ))}
        {matching.length === 0 && (
          <p className="font-serif text-sm text-[#8A8195] px-1">
            No {slot} recipes yet — add one from the Recipes tab, or pick from another category
            below.
          </p>
        )}
      </div>

      {others.length > 0 && (
        <>
          <button
            onClick={() => setShowOthers((v) => !v)}
            className="cursor-pointer text-[12.5px] text-accent underline mb-2 mt-1"
          >
            {showOthers ? "Hide other categories" : "Show recipes from other categories"}
          </button>
          {showOthers && (
            <div className="flex flex-col gap-1.5 mb-2 pt-2 border-t border-[#F0EAF7]">
              {others.map((r) => (
                <RecipeRow key={r.id} r={r} pending={pending} onPick={() => pick(r.id)} />
              ))}
            </div>
          )}
        </>
      )}

      {recipes.length === 0 && (
        <p className="font-serif text-sm text-[#8A8195]">No recipes yet — add one from the Recipes tab.</p>
      )}
    </Modal>
  );
}
