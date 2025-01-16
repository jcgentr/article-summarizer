"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { generateSummaryAndTags } from "@/lib/ai";
import { redirect } from "next/navigation";

export async function createArticleSummary(
  prevState: {
    message: string;
  },
  formData: FormData
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to create summaries");
    }

    const url = formData.get("url") as string;

    // First check if article already exists
    const { data: existingArticle } = await supabase
      .from("articles")
      .select("id")
      .eq("url", url)
      .single();

    if (existingArticle) {
      // Check if user already has this article saved
      const { data: existingUserArticle } = await supabase
        .from("user_articles")
        .select()
        .eq("user_id", user.id)
        .eq("article_id", existingArticle.id)
        .single();

      if (existingUserArticle) {
        return { message: "You've already saved this article" };
      }

      // Article exists but user hasn't saved it yet, create user_articles entry
      const { error: userArticleError } = await supabase
        .from("user_articles")
        .insert({
          user_id: user.id,
          article_id: existingArticle.id,
        });

      if (userArticleError) {
        throw new Error(`Supabase error: ${userArticleError.message}`);
      }

      revalidatePath("/");
      return { message: "Added existing article summary" };
    }

    // If article doesn't exist, fetch and create it
    const response = await fetch(url);
    const html = await response.text();

    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      throw new Error("Failed to parse article");
    }

    const wordCount = article.textContent.trim().split(/\s+/).length;
    const cleanContent = article.textContent.replace(/\s+/g, " ").trim();
    const result = await generateSummaryAndTags(
      cleanContent,
      wordCount,
      "groq"
    );

    // Insert into articles table
    const { data: newArticle, error: articleError } = await supabase
      .from("articles")
      .insert({
        url,
        title: article.title,
        author: article.byline,
        content: cleanContent,
        word_count: wordCount,
        summary: result.summary,
        tags: result.tags,
      })
      .select()
      .single();

    if (articleError || !newArticle) {
      throw new Error(`Failed to create article: ${articleError?.message}`);
    }

    // Create user_articles entry
    const { error: userArticleError } = await supabase
      .from("user_articles")
      .insert({
        user_id: user.id,
        article_id: newArticle.id,
      });

    if (userArticleError) {
      throw new Error(`Supabase error: ${userArticleError.message}`);
    }

    revalidatePath("/");
    return { message: "Added article summary" };
  } catch (error) {
    console.error(error);
    return { message: "Failed to create article summary" };
  }
}

export async function deleteArticleSummary(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to delete summaries");
    }

    // Only delete the user_articles entry, keep the article in articles table
    const { error } = await supabase
      .from("user_articles")
      .delete()
      .eq("article_id", id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    revalidatePath("/");
    return { message: "Article removed from your library" };
  } catch (error) {
    console.error(error);
    return { message: "Failed to remove article" };
  }
}

export async function updateArticleReadStatus(id: string, has_read: boolean) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to update read status");
    }

    const { error } = await supabase
      .from("user_articles")
      .update({ has_read })
      .eq("article_id", id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    revalidatePath("/");
    return { message: "Article read status updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update article read status");
  }
}

export async function updateArticleRating(id: string, rating: number) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to rate articles");
    }

    const { error } = await supabase
      .from("user_articles")
      .update({ rating })
      .eq("article_id", id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Supabase error: ${error.message}`);
    }

    revalidatePath("/");
    return { message: "Article rating updated successfully" };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update article rating");
  }
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error);
    throw new Error("Failed to log out");
  }

  revalidatePath("/");
  redirect("/login");
}
