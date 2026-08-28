import Link from "next/link";

export default function HabitsPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-20">
      <div className="w-[88px] h-[88px] rounded-full bg-[#FBF7F2] border-[3px] border-[#E2D5EF] flex items-center justify-center mb-5">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#B39DDB" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
        </svg>
      </div>
      <h2 className="mp-heading mb-2" style={{ color: "#8A7A9C" }}>Mind, Body, Soul</h2>
      <p className="mp-text max-w-xs">
        Habit and wellness tracking is coming soon to your Life OS.
      </p>
      <Link href="/dashboard" className="mt-5 text-[13.5px] text-accent underline">
        Back to Dashboard
      </Link>
    </div>
  );
}
