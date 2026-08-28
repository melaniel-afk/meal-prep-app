import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TAG_STYLES, type Recipe } from "@/lib/types";
import AddToListButton from "./AddToListButton";
import DeleteRecipeButton from "./DeleteRecipeButton";
import NutritionLabel from "@/components/NutritionLabel";

export default async function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single<Recipe>();

  if (!recipe) notFound();

  const style = TAG_STYLES[recipe.tag];

  return (
    <div className="max-w-3xl">
      <Link href="/recipes" className="text-[13px] text-accent no-underline mb-4 inline-block">
        ← Back to recipes
      </Link>

      <div className="flex items-center gap-4.5 mb-1.5" style={{ gap: 18 }}>
        <div
          className="w-[72px] h-[72px] rounded-full bg-[#FBF7F2] flex items-center justify-center flex-shrink-0"
          style={{ border: `3px solid ${style.color}` }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={style.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2v7a2 2 0 0 0 2 2a2 2 0 0 0 2-2V2" />
            <path d="M8 11v11" />
            <path d="M17 2c-1.7 0-3 1.7-3 4v3c0 1.1.9 2 2 2h1v9" />
          </svg>
        </div>
        <div>
          <h1 className="mp-title" style={{ margin: 0 }}>{recipe.name}</h1>
          <div className="flex items-center gap-2.5 mt-1.5">
            <span
              className="text-[11px] font-semibold tracking-wide px-3 py-1 rounded-full"
              style={{ background: style.bg, color: style.text }}
            >
              {recipe.tag}
            </span>
            <span className="text-[12.5px] text-[#8A8195]">{recipe.time}</span>
          </div>
        </div>
      </div>

      {recipe.description && <p className="mp-small my-5">{recipe.description}</p>}

      <div className="flex gap-8 flex-wrap items-start">
        <div className="flex-1 min-w-[280px]">
          <h3 className="mp-subheading uppercase tracking-wide mb-3">Ingredients</h3>
          <div className="bg-[#FFFDFB] rounded-2xl px-5 mb-6">
            {recipe.ingredients.map((ing, i) => (
              <div
                key={i}
                className="mp-text py-2.5 border-b border-[#F0EAF7] last:border-b-0"
              >
                {ing}
              </div>
            ))}
          </div>

          <h3 className="mp-subheading uppercase tracking-wide mb-3">Instructions</h3>
          <div className="bg-[#FFFDFB] rounded-2xl p-5 mb-6">
            {recipe.prep_video_url && (
              <div className="mb-4">
                {recipe.prep_video_is_video ? (
                  <video
                    src={recipe.prep_video_url}
                    controls
                    className="w-full max-h-64 rounded-xl bg-black"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={recipe.prep_video_url}
                    alt=""
                    className="w-full max-h-64 object-cover rounded-xl"
                  />
                )}
              </div>
            )}
            <ol className="flex flex-col gap-3 list-none m-0 p-0">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="flex gap-3 mp-text">
                  <span className="mp-heading" style={{ fontSize: 16 }}>{i + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="flex gap-3.5 flex-wrap">
            <AddToListButton recipeId={recipe.id} />
            <Link
              href="/plan"
              className="min-h-11 px-5 rounded-full bg-[#FFFDFB] text-accent text-sm font-semibold flex items-center justify-center shadow-[inset_0_0_0_1.5px_#D8C6EC] no-underline"
            >
              View Meal Plan
            </Link>
            <Link
              href={`/recipes/${recipe.id}/edit`}
              className="min-h-11 px-5 rounded-full bg-[#FFFDFB] text-accent text-sm font-semibold flex items-center justify-center shadow-[inset_0_0_0_1.5px_#D8C6EC] no-underline"
            >
              Edit Recipe
            </Link>
            <DeleteRecipeButton recipeId={recipe.id} recipeName={recipe.name} />
          </div>
        </div>

        <div>
          <h3 className="mp-subheading uppercase tracking-wide mb-3">Nutrition</h3>
          <NutritionLabel n={recipe} />
        </div>
      </div>
    </div>
  );
}
