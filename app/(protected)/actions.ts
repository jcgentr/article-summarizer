"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { generateSummaryGpt } from "@/lib/ai";
import { redirect } from "next/navigation";
import { shouldResetBillingCycle, SUMMARY_LIMITS } from "@/lib/billing";
import { PlanType } from "./types";
import { stripe } from "@/lib/stripe";
import config from "../config";

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
    const currentTag = formData.get("currentTag") as string;

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
        // User has already saved this article, but we still want to add the new tag if provided
        if (currentTag) {
          const { data: existingTag } = await supabase
            .from("user_article_tags")
            .select()
            .eq("user_id", user.id)
            .eq("article_id", existingArticle.id)
            .eq("tag", currentTag)
            .single();

          if (!existingTag) {
            // Tag doesn't exist for this article, so add it
            const { error: tagInsertError } = await supabase
              .from("user_article_tags")
              .insert({
                user_id: user.id,
                article_id: existingArticle.id,
                tag: currentTag,
              });

            if (tagInsertError) {
              throw new Error(
                `Failed to add new tag: ${tagInsertError.message}`
              );
            }

            return {
              message: `Added new tag "${currentTag}" to existing article`,
            };
          }
        }
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

      // Add the currentTag if it exists
      if (currentTag) {
        const { error: tagError } = await supabase
          .from("user_article_tags")
          .insert({
            user_id: user.id,
            article_id: existingArticle.id,
            tag: currentTag,
          });

        if (tagError) {
          throw new Error(`Failed to add tag: ${tagError.message}`);
        }
      }

      revalidatePath("/");
      return {
        message: currentTag
          ? `Added existing article summary with tag: ${currentTag}`
          : "Added existing article summary",
      };
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

    if (shouldReset && nextBillingDate) {
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
      return {
        message:
          userMetadata.plan_type === "free"
            ? "You've reached your free plan limit."
            : "You've reached your monthly summary limit.",
      };
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

    const wordCount = article.textContent?.trim().split(/\s+/).length || 0;
    const cleanContent = article.textContent?.replace(/\s+/g, " ").trim() || "";
    const result = await generateSummaryGpt(cleanContent, wordCount);

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

    if (currentTag) {
      const { error: tagError } = await supabase
        .from("user_article_tags")
        .insert({
          user_id: user.id,
          article_id: newArticle.id,
          tag: currentTag,
        });

      if (tagError) {
        console.error(`Failed to add tag: ${tagError.message}`);
      }
    }

    await supabase
      .from("user_metadata")
      .update({
        summaries_generated: userMetadata.summaries_generated + 1,
      })
      .eq("user_id", user.id);

    revalidatePath("/");
    return {
      message: currentTag
        ? `Added article summary with tag: ${currentTag}`
        : "Added article summary",
    };
  } catch (error) {
    console.error(error);
    return { message: "Failed to create article summary" };
  }
}

export async function deleteArticle(id: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to delete summaries");
    }

    // Start a transaction
    const { error: transactionError } = await supabase.rpc(
      "delete_article_and_tags",
      {
        p_article_id: id,
        p_user_id: user.id,
      }
    );

    if (transactionError) {
      throw new Error(`Transaction error: ${transactionError.message}`);
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

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to update read status");
    }

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: config.stripePriceId, // Your price ID from Stripe dashboard
          quantity: 1,
        },
      ],
      mode: "subscription",
      customer_email: user.email, // Automatically creates or links the customer
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/account?canceled=true`,
      // automatic_tax: { enabled: true },
    });

    if (!session.url) {
      throw new Error("Failed to create checkout session");
    }

    redirect(session.url);
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

export async function createPortalSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to access billing portal");
    }

    // Get user's Stripe customer ID
    const { data: userData, error: userError } = await supabase
      .from("user_metadata")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      throw new Error("No Stripe customer found for user");
    }

    const returnUrl = process.env.NEXT_PUBLIC_APP_URL;

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userData.stripe_customer_id,
      return_url: returnUrl,
    });

    redirect(portalSession.url);
  } catch (error) {
    console.error("Error creating portal session:", error);
    throw error;
  }
}

export async function addTag(articleId: string, tag: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to add tags");
    }

    const normalizedTag = tag.toLowerCase().trim();

    const { error } = await supabase
      .from("user_article_tags")
      .insert({
        user_id: user.id,
        article_id: articleId,
        tag: normalizedTag,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    revalidatePath("/");

    return { success: true, tag: normalizedTag };
  } catch (error) {
    console.error("Error adding tag:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteTag(articleId: string, tag: string) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User must be logged in to delete tags");
    }

    const { error } = await supabase.from("user_article_tags").delete().match({
      user_id: user.id,
      article_id: articleId,
      tag: tag.toLowerCase().trim(),
    });

    if (error) {
      throw error;
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Error deleting tag:", error);
    return { success: false, error: (error as Error).message };
  }
}
