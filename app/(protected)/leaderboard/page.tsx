import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

interface TopSavedArticle {
  article_id: string;
  save_count: number;
  title: string;
  url: string;
  author: string;
  published_time: string; // Will be returned as ISO string from Postgres timestamp
  summary: string;
  word_count: number;
}

interface TopRatedArticle {
  article_id: string;
  average_rating: number;
  rating_count: number;
  title: string;
  url: string;
  author: string;
  published_time: string;
  summary: string;
  word_count: number;
}

interface SupabaseError {
  message: string;
  details: string;
  hint: string;
  code: string;
}

export default async function Leaderboard() {
  const supabase = await createClient();

  const { data: topRatedArticles, error } = (await supabase.rpc(
    "get_top_rated_articles",
    {
      limit_count: 10,
    }
  )) as {
    data: TopRatedArticle[] | null;
    error: SupabaseError | null;
  };

  if (error) {
    console.error("Error fetching top rated articles:", error);
  }

  const { data: topSavedArticles, error: topSavedError } = (await supabase.rpc(
    "get_top_saved_articles",
    {
      limit_count: 10,
    }
  )) as {
    data: TopSavedArticle[] | null;
    error: SupabaseError | null;
  };

  if (topSavedError) {
    console.error("Error fetching top saved articles:", topSavedError);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-8 space-y-12">
      <div>
        <h2 className="text-2xl font-bold mb-4">Top Rated Articles</h2>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-secondary">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-4 text-left font-medium">Title</th>
                    <th className="p-4 text-left font-medium">Author</th>
                    <th className="p-4 text-left font-medium">
                      Average Rating
                    </th>
                    <th className="p-4 text-left font-medium">
                      Number of Ratings
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topRatedArticles?.map((article) => (
                    <tr key={article.article_id} className="border-b">
                      <td className="p-4">
                        <Link href={article.url} passHref legacyBehavior>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </Link>
                      </td>
                      <td className="p-4">{article.author ?? "Unknown"}</td>
                      <td className="p-4">{article.average_rating}</td>
                      <td className="p-4">{article.rating_count}</td>
                    </tr>
                  ))}
                  {!topRatedArticles?.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Most Saved Articles</h2>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg border overflow-hidden">
              <table className="min-w-full divide-y divide-secondary">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="p-4 text-left font-medium">Title</th>
                    <th className="p-4 text-left font-medium">Author</th>
                    <th className="p-4 text-left font-medium">Times Saved</th>
                    <th className="p-4 text-left font-medium">
                      Published Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topSavedArticles?.map((article) => (
                    <tr key={article.article_id} className="border-b">
                      <td className="p-4">
                        <Link href={article.url} passHref legacyBehavior>
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                          >
                            {article.title}
                          </a>
                        </Link>
                      </td>
                      <td className="p-4">{article.author ?? "Unknown"}</td>
                      <td className="p-4">{article.save_count}</td>
                      <td className="p-4">
                        {article.published_time
                          ? new Date(
                              article.published_time
                            ).toLocaleDateString()
                          : "Unknown"}
                      </td>
                    </tr>
                  ))}
                  {!topSavedArticles?.length && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-4 text-center text-muted-foreground"
                      >
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
