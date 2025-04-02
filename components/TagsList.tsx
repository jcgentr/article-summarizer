"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Tag {
  tag: string;
  count: number;
}

interface TagsListProps {
  tags: Tag[];
}

export function TagsList({ tags }: TagsListProps) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

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
              <Link href={tagPath} onClick={() => setOpenMobile(false)}>
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
