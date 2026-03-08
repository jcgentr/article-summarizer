"use client";

import { useState } from "react";
import { Feedback } from "../types";
import { getFeedback } from "./actions";

export default function FeedbackPage() {
  const [password, setPassword] = useState("");
  const [feedback, setFeedback] = useState<Feedback[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await getFeedback(password);

    if (result.error) {
      setError(result.error);
      setFeedback(null);
    } else {
      setFeedback(result.feedback);
    }

    setLoading(false);
  }

  if (!feedback) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Feedback</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full border rounded-lg px-4 py-2"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground rounded-lg px-4 py-2 disabled:opacity-50"
          >
            {loading ? "Loading..." : "View Feedback"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Feedback</h1>
      <div className="space-y-6">
        {feedback.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                {item.category && (
                  <span className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-sm">
                    {item.category}
                  </span>
                )}
                <span className="ml-2 text-sm text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {item.user_email}
              </div>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{item.message}</p>
          </div>
        ))}
        {!feedback.length && (
          <p className="text-muted-foreground">No feedback yet.</p>
        )}
      </div>
    </div>
  );
}
