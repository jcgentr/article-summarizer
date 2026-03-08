import { ArticleList } from "@/components/ArticleList";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { fetchArticles, fetchAllTags } from "./fetch-articles";

export const maxDuration = 60; // Applies to the server actions

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect("/login");
  }

  const [{ articles, totalCount }, allTags] = await Promise.all([
    fetchArticles({ page: 0 }),
    fetchAllTags(),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ArticleList
        initialArticles={articles}
        initialTotalCount={totalCount}
        allTags={allTags}
      />
    </div>
  );
}
