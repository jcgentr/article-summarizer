import { createClient } from "@/utils/supabase/server";
import { Article } from "./types";
import { ArticleList } from "@/components/ArticleList";

export const maxDuration = 60; // Applies to the server actions

export default async function Home() {
  const supabase = await createClient();

  // Join user_articles with articles to get all user's saved articles
  const { data: userArticles } = await supabase
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
      formatted_content
    )
  `
    )
    .order("created_at", { ascending: false });

  // Transform while maintaining existing Article type structure
  const articles: Article[] = (userArticles ?? []).map((ua) => ({
    id: ua.article.id,
    url: ua.article.url,
    title: ua.article.title,
    summary: ua.article.summary,
    created_at: ua.article.created_at,
    updated_at: ua.article.updated_at,
    tags: ua.article.tags,
    author: ua.article.author,
    has_read: ua.has_read,
    rating: ua.rating,
    formatted_content: ua.article.formatted_content,
    word_count: ua.article.word_count,
    read_time: Math.ceil(ua.article.word_count / 238), // Assuming 238 words per minute reading speed for adults reading non-fiction
  }));

  return (
    <main className="max-w-2xl mx-auto px-4">
      <h1 className="sr-only">Article Summaries</h1>
      <ArticleList initialArticles={articles} />
    </main>
  );
}
