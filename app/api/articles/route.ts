import { generateSummaryAndTags } from "@/lib/ai";
import { createClient } from "@/utils/supabase/server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "chrome-extension://ncjiionllbclcpjbdflkhjffkiakpcmc",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Refresh-Token",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders });
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const token = headersList.get("Authorization")?.split("Bearer ")[1];
    const refreshToken = headersList.get("X-Refresh-Token");

    console.log({ access_token: token, refresh_token: refreshToken });

    if (!token || !refreshToken) {
      return NextResponse.json(
        { error: "Missing authorization tokens" },
        { status: 401, headers: corsHeaders }
      );
    }

    const supabase = await createClient();

    // Set full session with both tokens
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: refreshToken,
    });

    console.log(user);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401, headers: corsHeaders }
      );
    }

    const { url } = await request.json();

    // Validate required fields
    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // First check if article already exists
    const { data: existingArticle, error: existingArticleError } =
      await supabase.from("articles").select().eq("url", url).single();

    console.log("Query response:", {
      data: existingArticle,
      error: existingArticleError,
      queriedUrl: url,
    });

    if (existingArticle) {
      // Check if user already has this article saved
      const { data: existingUserArticle } = await supabase
        .from("user_articles")
        .select()
        .eq("user_id", user.id)
        .eq("article_id", existingArticle.id)
        .single();

      if (existingUserArticle) {
        console.log("returning user's existing article...");
        return NextResponse.json(existingArticle, {
          status: 200,
          headers: corsHeaders,
        });
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

      console.log("added existing article...");
      return NextResponse.json(existingArticle, {
        status: 201,
        headers: corsHeaders,
      });
    }

    // If article doesn't exist, fetch and create it
    const response = await fetch(url);
    const html = await response.text();

    const doc = new JSDOM(html, { url });
    const reader = new Readability(doc.window.document);
    const article = reader.parse();

    if (!article) {
      return NextResponse.json(
        { error: "Failed to parse article" },
        { status: 500, headers: corsHeaders }
      );
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
      console.log(articleError);
      return NextResponse.json(
        { error: `Failed to create article: ${articleError?.message}` },
        { status: 500, headers: corsHeaders }
      );
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

    return NextResponse.json(newArticle, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create article summary" },
      { status: 500, headers: corsHeaders }
    );
  }
}
