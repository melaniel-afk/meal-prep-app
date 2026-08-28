"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteRecipe } from "@/app/(app)/actions";

export default function DeleteRecipeButton({
  recipeId,
  recipeName,
}: {
  recipeId: string;
  recipeName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex items-center gap-2.5 min-h-11 px-4 rounded-full bg-[#FBEFF2] shadow-[inset_0_0_0_1.5px_#E7C3CD]">
        <span className="text-[12.5px] text-[#8A3E52]">Delete &ldquo;{recipeName}&rdquo;?</span>
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteRecipe(recipeId);
              router.push("/recipes");
            })
          }
          className="cursor-pointer text-[12.5px] font-semibold text-white bg-[#B9758F] rounded-full px-3 py-1.5 disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          disabled={pending}
          onClick={() => setConfirming(false)}
          className="cursor-pointer text-[12.5px] font-semibold text-[#8A7A9C]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="cursor-pointer min-h-11 px-5 rounded-full bg-[#FFFDFB] text-[#B9758F] text-sm font-semibold shadow-[inset_0_0_0_1.5px_#E7C3CD]"
    >
      Delete Recipe
    </button>
  );
}
