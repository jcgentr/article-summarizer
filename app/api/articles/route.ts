import { PlanType } from "@/app/(protected)/types";
import { generateSummary } from "@/lib/ai";
import { SUMMARY_LIMITS } from "@/lib/billing";
import { shouldResetBillingCycle } from "@/lib/billing";
import { createClient } from "@/utils/supabase/server";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": `chrome-extension://${process.env.NEXT_PUBLIC_EXTENSION_ID}`,
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
    const { data: existingArticle } = await supabase
      .from("articles")
      .select()
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

    // Check user's plan and summary limit
    const { data: userMetadata, error: metadataError } = await supabase
      .from("user_metadata")
      .select("plan_type, summaries_generated, billing_cycle_start")
      .eq("user_id", user.id)
      .single();

    if (metadataError) {
      throw new Error(
        `Failed to fetch user metadata: ${metadataError.message}`
      );
    }

    // Check if billing cycle needs reset (monthly)
    const now = new Date();
    const cycleStart = new Date(userMetadata.billing_cycle_start);
    const { shouldReset, nextBillingDate } = shouldResetBillingCycle(
      cycleStart,
      now
    );

    if (shouldReset) {
      // Reset cycle
      await supabase
        .from("user_metadata")
        .update({
          summaries_generated: 0,
          billing_cycle_start: nextBillingDate.toISOString(),
        })
        .eq("user_id", user.id);

      userMetadata.summaries_generated = 0;
    }

    const limit =
      SUMMARY_LIMITS[userMetadata.plan_type as PlanType] ?? SUMMARY_LIMITS.free;

    if (userMetadata.summaries_generated >= limit) {
      const resetText = `Resets on ${nextBillingDate.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      )}.`;

      return NextResponse.json(
        {
          error:
            userMetadata.plan_type === "free"
              ? `You've reached your free plan limit. Please upgrade to Pro for more summaries. Free plan: ${userMetadata.summaries_generated}/${limit} summaries used. ${resetText}`
              : `You've reached your monthly summary limit. Pro plan: ${userMetadata.summaries_generated}/${limit} summaries used. ${resetText}`,
          code: "quota_exceeded",
          plan: userMetadata.plan_type,
          limit,
          used: userMetadata.summaries_generated,
        },
        {
          status: 402, // Payment Required
          headers: corsHeaders,
        }
      );
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

    const wordCount = article.textContent?.trim().split(/\s+/).length || 0;
    const cleanContent = article.textContent?.replace(/\s+/g, " ").trim() || "";
    const result = await generateSummary(cleanContent, wordCount);

    // Insert into articles table
    const { data: newArticle, error: articleError } = await supabase
      .from("articles")
      .insert({
        url,
        title: article.title,
        author: article.byline,
        published_time: article.publishedTime,
        content: cleanContent,
        formatted_content: article.content,
        word_count: wordCount,
        summary: result.summary,
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

    await supabase
      .from("user_metadata")
      .update({
        summaries_generated: userMetadata.summaries_generated + 1,
      })
      .eq("user_id", user.id);

    return NextResponse.json(newArticle, { status: 201, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create article summary" },
      { status: 500, headers: corsHeaders }
    );
  }
}
