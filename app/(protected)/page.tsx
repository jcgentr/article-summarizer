import { createClient } from "@/utils/supabase/server";
import { Article, Tag } from "./types";
import { ArticleList } from "@/components/ArticleList";
import { redirect } from "next/navigation";

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

  // Join user_articles with articles to get all user's saved articles
  const { data: userArticles, error } = await supabase
    .from("user_articles")
    .select(
      `
    *,
    article:articles (
      id,
      url,
      title,
      summary,
      created_at,
      updated_at,
      tags,
      author,
      word_count,
      published_time,
      user_article_tags (id, tag, created_at)
    )
  `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) console.log("Error fetching user articles:", error);

  const { data: allTagsData, error: tagsError } = await supabase
    .from("user_article_tags")
    .select("tag, created_at")
    .eq("user_id", user.id);

  if (tagsError) console.log("Error fetching tags:", tagsError);

  // Transform while maintaining existing Article type structure
  const articles: Article[] = (userArticles ?? []).map((ua) => ({
    id: ua.article.id,
    url: ua.article.url,
    title: ua.article.title,
    published_time: ua.article.published_time,
    summary: ua.article.summary,
    created_at: ua.created_at,
    updated_at: ua.updated_at,
    tags:
      ua.article.user_article_tags
        .sort(
          (a: Tag, b: Tag) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((tag: Tag) => tag.tag) ?? [],
    author: ua.article.author,
    has_read: ua.has_read,
    rating: ua.rating,
    formatted_content: null,
    word_count: ua.article.word_count,
    read_time: Math.ceil(ua.article.word_count / 238), // Assuming 238 words per minute reading speed for adults reading non-fiction
  }));

  const allTags = [
    ...new Set(
      allTagsData
        ?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((tag) => tag.tag) ?? []
    ),
  ];

  return (
    <div className="max-w-3xl mx-auto px-4">
      <ArticleList initialArticles={articles} allTags={allTags} />
    </div>
  );
}
