"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "@/app/(app)/actions";

const mealPrepLinks = [
  { href: "/recipes", label: "Recipes" },
  { href: "/plan", label: "Meal Plan" },
  { href: "/list", label: "Shopping List" },
  { href: "/diary", label: "Food Diary" },
];

export default function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const inMealPrep = mealPrepLinks.some((l) => pathname.startsWith(l.href));

  return (
    <div className="w-[250px] min-w-[250px] bg-sidebar text-[#EFE9F6] flex flex-col p-7">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-11 h-11 rounded-full bg-accent flex items-center justify-center font-script text-xl text-white flex-shrink-0">
          M
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-base font-semibold text-[#F6F2FA] truncate">Melanie</span>
          <span className="text-[11px] text-[#B9AFC7] italic truncate">{email}</span>
        </div>
      </div>

      <div className="h-px bg-[#33303B] my-5" />

      <nav className="flex flex-col gap-0.5">
        <Link
          href="/dashboard"
          className={`flex items-center gap-3 px-3 py-3 rounded-[10px] min-h-11 text-[14.5px] font-medium ${
            pathname === "/dashboard" ? "bg-accent text-white" : "text-[#C7BDD6]"
          }`}
        >
          Dashboard
        </Link>

        <button
          onClick={() => setExpanded((v) => !v)}
          className={`flex items-center gap-3 px-3 py-3 rounded-[10px] min-h-11 text-[14.5px] font-medium text-left ${
            inMealPrep ? "text-[#F6F2FA]" : "text-[#C7BDD6]"
          }`}
        >
          <span className="flex-grow">Meal Prep</span>
          <span className={expanded ? "rotate-180" : ""}>▾</span>
        </button>

        {expanded && (
          <div className="flex flex-col gap-0.5 ml-4 pl-4 border-l border-[#33303B]">
            {mealPrepLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-2.5 rounded-lg min-h-10 flex items-center text-[13.5px] ${
                  pathname.startsWith(l.href) ? "bg-[#33303B] text-[#F6F2FA]" : "text-[#C7BDD6]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}

        <Link
          href="/habits"
          className={`flex items-center gap-3 px-3 py-3 rounded-[10px] min-h-11 mt-0.5 text-[14.5px] font-medium ${
            pathname === "/habits" ? "bg-accent text-white" : "text-[#C7BDD6]"
          }`}
        >
          Habits &amp; Health
        </Link>
      </nav>

      <div className="flex-grow" />
      <form action={signOut}>
        <button className="text-[12px] text-[#8A7A9C] text-left hover:text-[#C7BDD6]">
          Sign out
        </button>
      </form>
      <div className="text-[11px] text-[#726B82] mt-3">Life OS · Meal Prep module</div>
      <a
        href="https://sites.google.com/view/melanie-lukehart/chronicles-of-mom"
        target="_blank"
        rel="noopener noreferrer"
        className="text-[11px] text-[#8A7A9C] mt-1 no-underline hover:text-[#C7BDD6]"
      >
        ← Back to Chronicles of Mom
      </a>
    </div>
  );
}
