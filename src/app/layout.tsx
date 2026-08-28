import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Meal Prep — Life OS",
  description: "Recipes, meal planning, shopping lists, and a food diary.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
