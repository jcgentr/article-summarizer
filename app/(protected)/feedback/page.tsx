import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Feedback } from "../types";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id !== "f9fcfdb3-34dd-44fc-9791-31478c1a3628") {
    redirect("/");
  }

  const { data: feedback, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<Feedback[]>();

  console.log(error);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>
      <div className="space-y-6">
        {feedback?.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                {item.category && (
                  <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                    {item.category}
                  </span>
                )}
                <span className="ml-2 text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.user_email}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{item.message}</p>
          </div>
        ))}
        {!feedback?.length && (
          <p className="text-muted-foreground">No feedback yet.</p>
        )}
      </div>
    </div>
  );
}
