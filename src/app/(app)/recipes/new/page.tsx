"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { addRecipe } from "@/app/(app)/actions";
import { SLOTS, type Tag } from "@/lib/types";

const NUTRITION_FIELDS: { key: string; label: string; unit: string }[] = [
  { key: "calories", label: "Calories", unit: "" },
  { key: "total_fat_g", label: "Total Fat", unit: "g" },
  { key: "saturated_fat_g", label: "Saturated Fat", unit: "g" },
  { key: "cholesterol_mg", label: "Cholesterol", unit: "mg" },
  { key: "sodium_mg", label: "Sodium", unit: "mg" },
  { key: "total_carbs_g", label: "Total Carbohydrate", unit: "g" },
  { key: "fiber_g", label: "Dietary Fiber", unit: "g" },
  { key: "sugars_g", label: "Total Sugars", unit: "g" },
  { key: "protein_g", label: "Protein", unit: "g" },
];

export default function NewRecipePage() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [userId, setUserId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [tag, setTag] = useState<Tag>("Dinner");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [servingSize, setServingSize] = useState("");
  const [nutrition, setNutrition] = useState<Record<string, string>>(
    Object.fromEntries(NUTRITION_FIELDS.map((f) => [f.key, ""]))
  );

  const [video, setVideo] = useState<{ url: string; isVideo: boolean; uploading: boolean } | null>(
    null
  );

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  async function handleVideoFile(file: File) {
    const isVideo = file.type.startsWith("video");
    setVideo({ url: "", isVideo, uploading: true });
    const supabase = createClient();
    const path = `${userId}/recipe-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabase.storage.from("meal-media").upload(path, file);
    if (error) {
      setVideo({ url: "", isVideo, uploading: false });
      return;
    }
    const { data } = supabase.storage.from("meal-media").getPublicUrl(path);
    setVideo({ url: data.publicUrl, isVideo, uploading: false });
  }

  function submit() {
    startTransition(async () => {
      await addRecipe({
        name,
        tag,
        time,
        description,
        ingredients,
        instructions,
        prepVideoUrl: video?.url || null,
        prepVideoIsVideo: !!video?.isVideo,
        serving_size: servingSize,
        calories: Number(nutrition.calories) || 0,
        total_fat_g: Number(nutrition.total_fat_g) || 0,
        saturated_fat_g: Number(nutrition.saturated_fat_g) || 0,
        cholesterol_mg: Number(nutrition.cholesterol_mg) || 0,
        sodium_mg: Number(nutrition.sodium_mg) || 0,
        total_carbs_g: Number(nutrition.total_carbs_g) || 0,
        fiber_g: Number(nutrition.fiber_g) || 0,
        sugars_g: Number(nutrition.sugars_g) || 0,
        protein_g: Number(nutrition.protein_g) || 0,
      });
      router.push("/recipes");
    });
  }

  const inputCls = "w-full min-h-11 rounded-[10px] border border-[#E6DBF2] px-3.5 text-sm";
  const labelCls = "block text-xs font-semibold text-[#8A8195] mb-1.5";

  return (
    <div className="max-w-2xl">
      <Link href="/recipes" className="text-[13px] text-accent no-underline mb-4 inline-block">
        ← Back to recipes
      </Link>
      <h1 className="mp-title mb-6">Add a Recipe</h1>

      <div className="flex flex-col gap-5">
        <div>
          <label className={labelCls}>Name</label>
          <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className={labelCls}>Meal</label>
            <select
              className={inputCls}
              value={tag}
              onChange={(e) => setTag(e.target.value as Tag)}
            >
              {SLOTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className={labelCls}>Time</label>
            <input
              className={inputCls}
              placeholder="30 min"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Description</label>
          <textarea
            className="w-full rounded-[10px] border border-[#E6DBF2] px-3.5 py-2.5 text-sm resize-y"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className={labelCls}>Ingredients (one per line)</label>
          <textarea
            className="w-full rounded-[10px] border border-[#E6DBF2] px-3.5 py-2.5 text-sm resize-y"
            rows={4}
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>

        <div className="bg-[#FFFDFB] rounded-2xl p-5">
          <h3 className="mp-subheading uppercase tracking-wide mb-3">
            Instructions
          </h3>
          <label className={labelCls}>Steps (one per line)</label>
          <textarea
            className="w-full rounded-[10px] border border-[#E6DBF2] px-3.5 py-2.5 text-sm resize-y mb-4"
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />

          <label className={labelCls}>Prep video or photo (optional)</label>
          <label className="flex flex-col items-center justify-center gap-2 min-h-[100px] rounded-2xl border-[1.5px] border-dashed border-[#D8C6EC] bg-[#FBF7F2] p-3 text-center cursor-pointer">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              disabled={!userId}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleVideoFile(file);
              }}
            />
            {video?.uploading && <span className="text-xs text-[#8A7A9C]">Uploading…</span>}
            {!video?.uploading && video?.url && video.isVideo && (
              <video src={video.url} muted className="max-h-24 rounded-lg bg-black" />
            )}
            {!video?.uploading && video?.url && !video.isVideo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.url} alt="" className="max-h-24 rounded-lg object-cover" />
            )}
            {!video && (
              <span className="text-xs font-semibold text-[#8A7A9C]">
                Tap to show how it&rsquo;s made
              </span>
            )}
          </label>
        </div>

        <div className="bg-[#FFFDFB] rounded-2xl p-5">
          <h3 className="mp-subheading uppercase tracking-wide mb-3">
            Nutrition Facts (per serving)
          </h3>
          <div className="mb-3">
            <label className={labelCls}>Serving size</label>
            <input
              className={inputCls}
              placeholder="1 bowl (400g)"
              value={servingSize}
              onChange={(e) => setServingSize(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {NUTRITION_FIELDS.map((f) => (
              <div key={f.key}>
                <label className={labelCls}>
                  {f.label} {f.unit && `(${f.unit})`}
                </label>
                <input
                  type="number"
                  min={0}
                  step="0.1"
                  className={inputCls}
                  value={nutrition[f.key]}
                  onChange={(e) =>
                    setNutrition((prev) => ({ ...prev, [f.key]: e.target.value }))
                  }
                />
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={submit}
          disabled={pending || !name.trim() || !!video?.uploading}
          className="min-h-11 rounded-full bg-accent text-white text-sm font-semibold disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save Recipe"}
        </button>
      </div>
    </div>
  );
}
