import { FeedbackButton } from "@/components/FeedbackButton";
import NavBar from "@/components/NavBar";
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
    <>
      <NavBar user={data.user} />
      {children}
      <FeedbackButton />
    </>
  );
}
