import { ArticleList } from "@/components/ArticleList";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { fetchArticles, fetchAllTags } from "../../fetch-articles";

export const maxDuration = 60;

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect("/login");
  }

  const [{ articles, totalCount }, allTags] = await Promise.all([
    fetchArticles({ page: 0, tag: decodedTag }),
    fetchAllTags(),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4">
      <h1 className="text-2xl font-bold">
        Articles tagged with &quot;{decodedTag}&quot;
      </h1>
      <ArticleList
        initialArticles={articles}
        initialTotalCount={totalCount}
        currentTag={decodedTag}
        allTags={allTags}
      />
    </div>
  );
}
