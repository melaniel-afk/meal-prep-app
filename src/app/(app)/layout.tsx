import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="flex w-full min-h-screen bg-bg text-ink">
      <Sidebar email={user.email ?? ""} />
      <div className="flex-grow p-10 md:p-12 overflow-y-auto">{children}</div>
    </div>
  );
}
