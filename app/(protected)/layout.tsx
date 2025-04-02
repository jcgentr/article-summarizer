import { AppSidebar } from "@/components/AppSidebar";
import { FeedbackButton } from "@/components/FeedbackButton";
import { SidebarProvider } from "@/components/ui/sidebar";
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
      <main className="w-full flex flex-col">
        {/* Header area that maintains space for trigger */}
        <div className="h-14 px-4 md:h-16 md:px-6 bg-background" />
        <div className="flex-1">{children}</div>
      </main>
      <FeedbackButton />
    </SidebarProvider>
  );
}
