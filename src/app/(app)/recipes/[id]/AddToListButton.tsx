"use client";

import { useState, useTransition } from "react";
import { addIngredientsToList } from "@/app/(app)/actions";

export default function AddToListButton({ recipeId }: { recipeId: string }) {
  const [pending, startTransition] = useTransition();
  const [done, setDone] = useState(false);

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await addIngredientsToList(recipeId);
          setDone(true);
          setTimeout(() => setDone(false), 2200);
        })
      }
      className="cursor-pointer min-h-11 px-5 rounded-full bg-accent text-white text-sm font-semibold disabled:opacity-60"
    >
      {pending ? "Adding…" : done ? "Added ✓" : "Add ingredients to Shopping List"}
    </button>
  );
}
