import { SUMMARY_LIMITS } from "@/lib/billing";

export interface Article {
  id: string;
  url: string;
  summary: string;
  tags: string | null;
  author: string | null;
  published_time: string | null;
  title: string;
  word_count: number;
  read_time: number;
  has_read: boolean;
  rating: number | null;
  created_at: string;
  updated_at: string;
  formatted_content: string | null;
}

export interface UserMetadata {
  user_id: string;
  plan_type: PlanType;
  stripe_customer_id: string | null;
  summaries_generated: number;
  billing_cycle_start: string;
  created_at: string;
  updated_at: string;
}

export type PlanType = keyof typeof SUMMARY_LIMITS;

export interface BillingCycleInfo {
  shouldReset: boolean;
  nextBillingDate: Date;
}

export interface HNStory {
  by: string; // Username of submitter
  descendants: number; // Number of comments
  id: number; // Story ID
  kids: number[]; // IDs of comments
  score: number; // Upvote count
  time: number; // Unix timestamp
  title: string; // Story title
  type: "story"; // Type of item
  url: string; // URL of the story
}

export interface ArticleWithRank extends Article {
  rank: number;
}

export type Feedback = {
  id: string;
  user_id: string;
  user_email: string;
  category: string;
  message: string;
  created_at: string;
};
