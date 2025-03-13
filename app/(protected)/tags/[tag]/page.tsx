import { createClient } from "@/utils/supabase/server";
import { Article, Tag } from "../../types";
import { ArticleList } from "@/components/ArticleList";

export const maxDuration = 60;

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const supabase = await createClient();

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
        formatted_content,
        published_time,
        user_article_tags (id, tag, created_at)
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) console.log("Error:", error);

  const { data: allTagsData, error: tagsError } = await supabase
    .from("user_article_tags")
    .select("tag, created_at");

  if (tagsError) console.log("Error fetching tags:", tagsError);

  const articles: Article[] = (userArticles ?? [])
    .map((ua) => ({
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
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          )
          .map((tag: Tag) => tag.tag) ?? [],
      author: ua.article.author,
      has_read: ua.has_read,
      rating: ua.rating,
      formatted_content: ua.article.formatted_content,
      word_count: ua.article.word_count,
      read_time: Math.ceil(ua.article.word_count / 238),
    }))
    .filter((article) => article.tags.includes(decodedTag));

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
      <h1 className="text-2xl font-bold mt-4">
        Articles tagged with &quot;{decodedTag}&quot;
      </h1>
      <ArticleList
        initialArticles={articles}
        currentTag={decodedTag}
        allTags={allTags}
      />
    </div>
  );
}
