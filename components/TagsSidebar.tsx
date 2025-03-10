import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

async function getTags() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_article_tags")
    .select("tag")
    .order("tag");

  if (error) {
    console.error("Error fetching tags:", error);
    return [];
  }

  // Count unique tags
  const tagCounts = data.reduce((acc, { tag }) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array of objects and sort by count (descending)
  return Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export async function TagsSidebar() {
  const tags = await getTags();

  return (
    <>
      <SidebarMenuItem key="tags">
        <div className="flex items-center justify-between w-full">
          <span className="font-bold">Tags</span>
        </div>
      </SidebarMenuItem>
      {tags.map(({ tag, count }) => (
        <SidebarMenuItem key={tag}>
          <SidebarMenuButton
            asChild
            className="flex items-center justify-between"
          >
            <Link href={`/tags/${encodeURIComponent(tag)}`}>
              <span className="text-sm">{tag}</span>
              <span className="text-sm text-muted-foreground font-mono">
                {count}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </>
  );
}
