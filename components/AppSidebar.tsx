import { Suspense } from "react";
import { User } from "@supabase/supabase-js";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./NavUser";
import { TagsSidebar } from "./TagsSidebar";
import { CollapsedTrigger } from "./CollapsedTrigger";
import { NavLinks } from "./NavLinks";
import { SidebarHeader } from "./SidebarHeader";

function TagsSidebarFallback() {
  return (
    <SidebarMenuItem key="tags">
      <div className="flex items-center justify-between w-full">
        <span>Tags</span>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    </SidebarMenuItem>
  );
}

export function AppSidebar({ user }: { user: User }) {
  return (
    <>
      <CollapsedTrigger />
      <Sidebar>
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <NavLinks />
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="pl-2 pr-1">
                <Suspense fallback={<TagsSidebarFallback />}>
                  <TagsSidebar />
                </Suspense>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <NavUser email={user.email || ""} userId={user.id} />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
