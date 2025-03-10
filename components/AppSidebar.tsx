import { Home, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import gistrLogo from "../app/images/icon-32.png";
import { NavUser } from "./NavUser";
import { PlanType, UserMetadata } from "@/app/(protected)/types";
import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { SUMMARY_LIMITS } from "@/lib/billing";
import { ModeToggle } from "./ModeToggle";
import { Suspense } from "react";
import { TagsSidebar } from "./TagsSidebar";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy,
  },
];

const DEFAULT_USER_METADATA: Pick<
  UserMetadata,
  "plan_type" | "summaries_generated" | "stripe_customer_id"
> = {
  plan_type: "free",
  summaries_generated: 0,
  stripe_customer_id: null,
} as const;

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

export async function AppSidebar({ user }: { user: User }) {
  const supabase = await createClient();
  const { data: userMetadata } = await supabase
    .from("user_metadata")
    .select("plan_type, summaries_generated, stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const metadata = userMetadata ?? DEFAULT_USER_METADATA;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-1">
          <Link href="/" className="flex items-center">
            <Image
              src={gistrLogo}
              className="mr-1 flex-shrink-0"
              alt="Gistr Logo"
              width="32"
              height="32"
            />
            <span className="text-2xl font-bold">Gistr</span>
          </Link>
          <ModeToggle />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="pl-2 pr-1">
              {/* <SidebarMenuItem key="projects">
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold">Projects</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </SidebarMenuItem> */}
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
            <NavUser
              email={user.email || ""}
              stripeCustomerId={metadata.stripe_customer_id}
              planType={metadata.plan_type}
              summariesGenerated={metadata.summaries_generated}
              summaryLimit={SUMMARY_LIMITS[metadata.plan_type as PlanType]}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
