"use client";

import { useTransition } from "react";
import { toggleShoppingItem } from "@/app/(app)/actions";
import type { ShoppingListItem } from "@/lib/types";

export default function ShoppingItemRow({ item }: { item: ShoppingListItem }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      onClick={() => startTransition(() => toggleShoppingItem(item.id, !item.checked))}
      className="cursor-pointer flex items-center gap-3.5 py-3 border-b border-[#F0EAF7] last:border-b-0 min-h-11"
      style={{ opacity: pending ? 0.6 : 1 }}
    >
      <div
        className="w-[22px] h-[22px] rounded-md flex items-center justify-center flex-shrink-0"
        style={{
          border: `2px solid ${item.checked ? "#8E6FBE" : "#D8C6EC"}`,
          background: item.checked ? "#8E6FBE" : "transparent",
        }}
      >
        {item.checked && (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      <span
        className="mp-text"
        style={{
          color: item.checked ? "#A79CB5" : "#1c1c1c",
          textDecoration: item.checked ? "line-through" : "none",
        }}
      >
        {item.name}
      </span>
    </div>
  );
}
