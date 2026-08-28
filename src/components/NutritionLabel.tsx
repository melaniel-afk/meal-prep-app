import { DAILY_VALUES, type Nutrition } from "@/lib/types";

function pctDV(amount: number, dv: number) {
  return Math.round((amount / dv) * 100);
}

function Row({
  label,
  amount,
  unit,
  dvPercent,
  bold,
  indent,
}: {
  label: string;
  amount: number;
  unit: string;
  dvPercent?: number;
  bold?: boolean;
  indent?: boolean;
}) {
  return (
    <div
      className="flex items-baseline justify-between border-b border-[#3A3245] py-1 text-[13px]"
      style={{ paddingLeft: indent ? 16 : 0 }}
    >
      <span className={bold ? "font-bold" : ""}>
        {label} {amount}
        {unit}
      </span>
      {dvPercent !== undefined && <span className="font-bold">{dvPercent}%</span>}
    </div>
  );
}

export default function NutritionLabel({ n }: { n: Nutrition }) {
  return (
    <div className="border-[3px] border-[#3A3245] rounded-md p-3 max-w-[280px] bg-white font-sans text-[#3A3245]">
      <h3 className="font-black text-2xl leading-none mb-1">Nutrition Facts</h3>
      <div className="border-b-8 border-[#3A3245] pb-1 mb-1 text-[13px]">
        Serving size {n.serving_size || "—"}
      </div>

      <div className="border-b-4 border-[#3A3245] pb-1 mb-1 flex items-end justify-between">
        <span className="font-bold text-base">Calories</span>
        <span className="font-black text-3xl">{Math.round(n.calories)}</span>
      </div>

      <div className="text-right text-[11px] font-bold border-b border-[#3A3245] pb-0.5 mb-0.5">
        % Daily Value*
      </div>

      <Row label="Total Fat" amount={n.total_fat_g} unit="g" bold dvPercent={pctDV(n.total_fat_g, DAILY_VALUES.total_fat_g)} />
      <Row label="Saturated Fat" amount={n.saturated_fat_g} unit="g" indent dvPercent={pctDV(n.saturated_fat_g, DAILY_VALUES.saturated_fat_g)} />
      <Row label="Cholesterol" amount={n.cholesterol_mg} unit="mg" bold dvPercent={pctDV(n.cholesterol_mg, DAILY_VALUES.cholesterol_mg)} />
      <Row label="Sodium" amount={n.sodium_mg} unit="mg" bold dvPercent={pctDV(n.sodium_mg, DAILY_VALUES.sodium_mg)} />
      <Row label="Total Carbohydrate" amount={n.total_carbs_g} unit="g" bold dvPercent={pctDV(n.total_carbs_g, DAILY_VALUES.total_carbs_g)} />
      <Row label="Dietary Fiber" amount={n.fiber_g} unit="g" indent dvPercent={pctDV(n.fiber_g, DAILY_VALUES.fiber_g)} />
      <Row label="Total Sugars" amount={n.sugars_g} unit="g" indent />
      <div className="flex items-baseline justify-between py-1 text-[13px] border-b-8 border-[#3A3245]">
        <span className="font-bold">Protein {n.protein_g}g</span>
        <span className="font-bold">{pctDV(n.protein_g, DAILY_VALUES.protein_g)}%</span>
      </div>

      <p className="text-[10px] mt-1.5 leading-snug">
        *% Daily Value tells you how much a nutrient contributes to a daily diet. 2,000 calories a
        day is used for general nutrition advice.
      </p>
    </div>
  );
}
