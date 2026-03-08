"use server";

import { createClient } from "@/utils/supabase/server";
import { Article, Tag } from "./types";
import { redirect } from "next/navigation";
import type { FilterId } from "@/components/FilterDropdown";
import type { SortOption } from "@/components/SortDropdown";

const PAGE_SIZE = 20;

export async function fetchArticles({
  search = "",
  filter = "none",
  sort = "Newest first",
  page = 0,
  tag,
}: {
  search?: string;
  filter?: FilterId;
  sort?: SortOption;
  page?: number;
  tag?: string;
}): Promise<{ articles: Article[]; totalCount: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If filtering by tag, first get matching article IDs
  let tagArticleIds: string[] | null = null;
  if (tag) {
    const { data: tagMatches } = await supabase
      .from("user_article_tags")
      .select("article_id")
      .eq("user_id", user.id)
      .eq("tag", tag);
    tagArticleIds = tagMatches?.map((t) => t.article_id) ?? [];
    if (tagArticleIds.length === 0) {
      return { articles: [], totalCount: 0 };
    }
  }

  let query = supabase
    .from("user_articles")
    .select(
      `
      *,
      article:articles!inner (
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
    `,
      { count: "exact" }
    )
    .eq("user_id", user.id);

  // Tag filter via pre-fetched IDs
  if (tagArticleIds) {
    query = query.in("article_id", tagArticleIds);
  }

  // Search on articles fields (title, author, url)
  if (search) {
    query = query.or(
      `title.ilike.%${search}%,author.ilike.%${search}%,url.ilike.%${search}%`,
      { referencedTable: "articles" }
    );
  }

  // Read/unread filter
  if (filter === "read") query = query.eq("has_read", true);
  if (filter === "unread") query = query.eq("has_read", false);

  // Under 5 min read filter (238 wpm * 5 = 1190 words)
  if (filter === "under-5-min") {
    query = query.lt("word_count" as string, 1190);
  }

  // Sort
  switch (sort) {
    case "Oldest first":
      query = query.order("created_at", { ascending: true });
      break;
    case "Shortest first":
      query = query.order("word_count", {
        ascending: true,
        referencedTable: "articles",
      });
      break;
    case "Longest first":
      query = query.order("word_count", {
        ascending: false,
        referencedTable: "articles",
      });
      break;
    default: // Newest first
      query = query.order("created_at", { ascending: false });
  }

  // Pagination
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  query = query.range(from, to);

  const { data: userArticles, error, count } = await query;

  if (error) {
    console.error("Error fetching articles:", error);
    return { articles: [], totalCount: 0 };
  }

  const articles: Article[] = (userArticles ?? []).map(// eslint-disable-next-line @typescript-eslint/no-explicit-any
    (ua: any) => ({
    id: ua.article.id,
    url: ua.article.url,
    title: ua.article.title,
    published_time: ua.article.published_time,
    summary: ua.article.summary,
    created_at: ua.created_at,
    updated_at: ua.updated_at,
    tags:
      ua.article.user_article_tags
        ?.sort(
          (a: Tag, b: Tag) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((t: Tag) => t.tag) ?? [],
    author: ua.article.author,
    has_read: ua.has_read,
    rating: ua.rating,
    formatted_content: null,
    word_count: ua.article.word_count,
    read_time: Math.ceil(ua.article.word_count / 238),
  }));

  return { articles, totalCount: count ?? 0 };
}

export async function fetchAllTags(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: allTagsData, error } = await supabase
    .from("user_article_tags")
    .select("tag, created_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  return [
    ...new Set(
      allTagsData
        ?.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .map((tag) => tag.tag) ?? []
    ),
  ];
}
