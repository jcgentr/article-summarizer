import { AppSidebar } from "@/components/AppSidebar";
import { FeedbackButton } from "@/components/FeedbackButton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={data.user} />
      <main className="w-full">
        <SidebarTrigger className="sm:fixed sm:mx-2 sm:my-3" />
        {children}
      </main>
      <FeedbackButton />
    </SidebarProvider>
  );
}
