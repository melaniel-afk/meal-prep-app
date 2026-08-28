import { createClient } from "@/lib/supabase/server";
import type { FoodDiaryEntry } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default async function DiaryPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("food_diary_entries")
    .select("*")
    .order("logged_date", { ascending: false })
    .order("created_at", { ascending: false });

  const entries = (data as FoodDiaryEntry[]) || [];

  const byDate = new Map<string, FoodDiaryEntry[]>();
  for (const e of entries) {
    const list = byDate.get(e.logged_date) || [];
    list.push(e);
    byDate.set(e.logged_date, list);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="mp-title mb-1">Food Diary</h1>
      <p className="mp-text mb-7">
        What you actually ate — logged straight from your Meal Plan, with nutrition totaled per day.
      </p>

      {!entries.length && (
        <div className="bg-[#FFFDFB] rounded-2xl p-10 text-center mp-text">
          No meals logged yet — tap the camera icon on a planned meal in your Meal Plan to add your
          first entry.
        </div>
      )}

      {Array.from(byDate.entries()).map(([date, dayEntries]) => {
        const totals = dayEntries.reduce(
          (acc, e) => ({
            calories: acc.calories + Number(e.calories),
            protein: acc.protein + Number(e.protein_g),
            carbs: acc.carbs + Number(e.total_carbs_g),
            fat: acc.fat + Number(e.total_fat_g),
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        );

        return (
          <div key={date} className="mb-9">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="mp-heading">{formatDate(date)}</h2>
            </div>

            <div className="bg-[#1E1B22] rounded-2xl px-5 py-4 mb-4 flex gap-6 flex-wrap">
              <div>
                <div className="text-[11px] text-[#B9AFC7] uppercase tracking-wide">Calories</div>
                <div className="text-xl font-bold text-white">{Math.round(totals.calories)}</div>
              </div>
              <div>
                <div className="text-[11px] text-[#B9AFC7] uppercase tracking-wide">Protein</div>
                <div className="text-xl font-bold text-white">{Math.round(totals.protein)}g</div>
              </div>
              <div>
                <div className="text-[11px] text-[#B9AFC7] uppercase tracking-wide">Carbs</div>
                <div className="text-xl font-bold text-white">{Math.round(totals.carbs)}g</div>
              </div>
              <div>
                <div className="text-[11px] text-[#B9AFC7] uppercase tracking-wide">Fat</div>
                <div className="text-xl font-bold text-white">{Math.round(totals.fat)}g</div>
              </div>
            </div>

            {dayEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-[#FFFDFB] rounded-2xl p-5 mb-4 shadow-[0_4px_14px_rgba(80,60,110,0.07)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="mp-heading" style={{ fontSize: 18 }}>{entry.recipe_name}</span>
                  <span className="text-[11px] font-semibold text-[#8A7A9C] tracking-wide">
                    {entry.day} · {entry.slot}
                  </span>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-32 flex-shrink-0">
                    {entry.eaten_is_video ? (
                      <video
                        src={entry.eaten_url}
                        controls
                        muted
                        className="w-full max-h-32 rounded-[10px] bg-black"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={entry.eaten_url}
                        alt=""
                        className="w-full max-h-32 object-cover rounded-[10px]"
                      />
                    )}
                    <span className="block text-[10px] text-[#8A8195] uppercase tracking-wide text-center mt-1">
                      What I Ate
                    </span>
                  </div>

                  <div className="flex-grow">
                    {entry.actual_eaten && (
                      <p className="mp-text mb-3" style={{ fontStyle: "italic" }}>
                        &ldquo;{entry.actual_eaten}&rdquo;
                      </p>
                    )}
                    <div className="flex gap-4 flex-wrap mp-small" style={{ fontStyle: "normal" }}>
                      <span>{Math.round(entry.calories)} cal</span>
                      <span>{Math.round(entry.protein_g)}g protein</span>
                      <span>{Math.round(entry.total_carbs_g)}g carbs</span>
                      <span>{Math.round(entry.total_fat_g)}g fat</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
