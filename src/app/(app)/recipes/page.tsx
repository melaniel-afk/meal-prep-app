import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TAG_STYLES, type Recipe } from "@/lib/types";

export default async function RecipesPage() {
  const supabase = await createClient();
  const { data: recipes } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div>
      <div className="flex items-start justify-between gap-5 mb-7">
        <div>
          <h1 className="font-script text-4xl font-bold text-accent mb-1">Recipes</h1>
          <p className="font-serif text-sm text-[#5A5266]">
            Your saved recipes. Tap one to see ingredients and add them to your shopping list.
          </p>
        </div>
        <Link
          href="/recipes/new"
          className="cursor-pointer min-h-11 px-5 rounded-full bg-accent text-white text-[13.5px] font-semibold whitespace-nowrap flex items-center justify-center no-underline"
        >
          + Add Recipe
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {(recipes as Recipe[] | null)?.map((r) => {
          const style = TAG_STYLES[r.tag];
          return (
            <Link
              key={r.id}
              href={`/recipes/${r.id}`}
              className="bg-[#FFFDFB] rounded-[18px] p-[22px] flex flex-col items-center text-center shadow-[0_4px_14px_rgba(80,60,110,0.07)]"
            >
              <div
                className="w-16 h-16 rounded-full bg-[#FBF7F2] flex items-center justify-center mb-3.5"
                style={{ border: `2.5px solid ${style.color}` }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2v7a2 2 0 0 0 2 2a2 2 0 0 0 2-2V2" />
                  <path d="M8 11v11" />
                  <path d="M17 2c-1.7 0-3 1.7-3 4v3c0 1.1.9 2 2 2h1v9" />
                </svg>
              </div>
              <span className="font-script text-xl font-bold text-[#3A3245]">{r.name}</span>
              <span
                className="mt-2.5 text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full"
                style={{ background: style.bg, color: style.text }}
              >
                {r.tag}
              </span>
              <span className="mt-2.5 text-[12.5px] text-[#8A8195]">{r.time}</span>
            </Link>
          );
        })}
      </div>

      {!recipes?.length && (
        <p className="font-serif text-sm text-[#8A8195] mt-8">
          No recipes yet — add your first one above.
        </p>
      )}
    </div>
  );
}
