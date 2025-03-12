"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Tag {
  tag: string;
  count: number;
}

export function TagsList({ tags }: { tags: Tag[] }) {
  const pathname = usePathname();

  return (
    <>
      {tags.map(({ tag, count }) => {
        const tagPath = `/tags/${encodeURIComponent(tag)}`;
        const isActive = pathname === tagPath;

        return (
          <SidebarMenuItem key={tag}>
            <SidebarMenuButton
              asChild
              className={cn("flex items-center justify-between", {
                "bg-accent text-accent-foreground font-medium": isActive,
              })}
            >
              <Link href={tagPath}>
                <span className="text-sm">{tag}</span>
                <span className="text-sm text-muted-foreground font-mono">
                  {count}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </>
  );
}
