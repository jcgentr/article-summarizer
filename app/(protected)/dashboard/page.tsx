"use client";

import { useMemo, useState } from "react";
import { DashboardUser, getDashboardUsers } from "./actions";

type SortKey = "email" | "plan_type" | "summaries_generated" | "created_at" | "updated_at";
type SortDir = "asc" | "desc";

export default function DashboardPage() {
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<DashboardUser[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sortedUsers = useMemo(() => {
    if (!users) return null;
    return [...users].sort((a, b) => {
      const aVal = a[sortKey] ?? "";
      const bVal = b[sortKey] ?? "";
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDir === "asc" ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [users, sortKey, sortDir]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await getDashboardUsers(password);

    if (result.error) {
      setError(result.error);
      setUsers(null);
    } else {
      setUsers(result.users);
    }

    setLoading(false);
  }

  if (!users) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
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
            {loading ? "Loading..." : "View Dashboard"}
          </button>
        </form>
      </div>
    );
  }

  const totalUsers = users.length;
  const proUsers = users.filter((u) => u.plan_type === "pro").length;
  const freeUsers = users.filter((u) => u.plan_type === "free").length;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{totalUsers}</p>
          <p className="text-sm text-muted-foreground">Total Users</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{proUsers}</p>
          <p className="text-sm text-muted-foreground">Pro Users</p>
        </div>
        <div className="border rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{freeUsers}</p>
          <p className="text-sm text-muted-foreground">Free Users</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              {([
                ["email", "Email"],
                ["plan_type", "Plan"],
                ["summaries_generated", "Summaries"],
                ["created_at", "Joined"],
                ["updated_at", "Last Active"],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="text-left p-3 text-sm font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground"
                >
                  {label} {sortKey === key ? (sortDir === "asc" ? "\u2191" : "\u2193") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUsers?.map((user) => (
              <tr key={user.user_id} className="border-b">
                <td className="p-3 text-sm">{user.email ?? "\u2014"}</td>
                <td className="p-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.plan_type === "pro"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    {user.plan_type}
                  </span>
                </td>
                <td className="p-3 text-sm">{user.summaries_generated}</td>
                <td className="p-3 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-sm">
                  {new Date(user.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
