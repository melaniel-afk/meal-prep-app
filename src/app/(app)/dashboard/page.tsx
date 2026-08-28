import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="mp-title mb-1">Good to see you, Melanie</h1>
      <p className="mp-text mb-9 max-w-lg">
        Here&rsquo;s your Life OS. Meal Prep is fully open below — more modules are on their way.
      </p>

      <div className="flex gap-7 flex-wrap">
        <Link
          href="/recipes"
          className="w-64 bg-[#FFFDFB] rounded-[20px] p-7 flex flex-col items-center text-center shadow-[0_6px_20px_rgba(80,60,110,0.08)]"
        >
          <div className="w-24 h-24 rounded-full bg-[#FBF7F2] border-[3px] border-[#C9AEE0] flex items-center justify-center mb-4">
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#8E6FBE" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2v7a2 2 0 0 0 2 2a2 2 0 0 0 2-2V2" />
              <path d="M8 11v11" />
              <path d="M17 2c-1.7 0-3 1.7-3 4v3c0 1.1.9 2 2 2h1v9" />
            </svg>
          </div>
          <span className="mp-heading">Meal Prep</span>
          <span className="mp-small mt-1.5">
            Recipes, weekly planning, your shopping list, and a food diary — all in one place.
          </span>
        </Link>

        <Link
          href="/habits"
          className="w-64 bg-[#FFFDFB] rounded-[20px] p-7 flex flex-col items-center text-center shadow-[0_6px_20px_rgba(80,60,110,0.08)] opacity-75"
        >
          <div className="w-24 h-24 rounded-full bg-[#FBF7F2] border-[3px] border-[#E2D5EF] flex items-center justify-center mb-4">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B39DDB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
            </svg>
          </div>
          <span className="mp-heading" style={{ color: "#8A7A9C" }}>Habits &amp; Health</span>
          <span className="mp-small mt-1.5">Coming soon to your Life OS.</span>
        </Link>
      </div>
    </div>
  );
}
