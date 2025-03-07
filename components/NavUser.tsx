"use client";

import {
  createCheckoutSession,
  createPortalSession,
  logout,
} from "@/app/(protected)/actions";
import { PlanType } from "@/app/(protected)/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChromeExtension } from "@/lib/hooks/useChromeExtension";
import { useThemeShortcut } from "@/lib/hooks/useThemeShortcut";
import {
  ChevronUp,
  Chrome,
  CreditCard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { FeedbackForm } from "./FeedbackForm";
import { SidebarMenuButton } from "./ui/sidebar";

interface NavUserProps {
  email: string;
  planType: PlanType;
  stripeCustomerId: string | null;
  summariesGenerated: number;
  summaryLimit: number;
}

export function NavUser({
  email,
  planType,
  stripeCustomerId,
  summariesGenerated,
  summaryLimit,
}: NavUserProps) {
  useThemeShortcut();
  useChromeExtension();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton>
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{email}</span>
          <ChevronUp className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
        <DropdownMenuLabel className="px-2 py-1.5">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-medium">
                {planType === "free" ? "Free" : "Pro"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Usage</span>
              <span className="text-sm font-medium">
                {summariesGenerated} / {summaryLimit}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account" className="flex items-center cursor-pointer">
              <Settings className="h-5 w-5 mr-1 flex-shrink-0" />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {planType === "free" && (
          <>
            <DropdownMenuGroup>
              <form action={createCheckoutSession}>
                <DropdownMenuItem
                  asChild
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <button className="w-full flex items-center cursor-pointer">
                    <Sparkles className="h-5 w-5 mr-1 flex-shrink-0" />
                    Upgrade to Pro
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        {stripeCustomerId && (
          <>
            <DropdownMenuGroup>
              <form action={createPortalSession}>
                <DropdownMenuItem
                  asChild
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                >
                  <button className="w-full flex items-center cursor-pointer">
                    <CreditCard className="h-5 w-5 mr-1 flex-shrink-0" />
                    Billing
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href="https://chromewebstore.google.com/detail/gistr/ncjimfkmindojmhmempanidjnlfjhfoo"
              target="_blank"
              className="flex items-center cursor-pointer"
            >
              <Chrome className="h-5 w-5 mr-1 flex-shrink-0" />
              Chrome Extension
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FeedbackForm>
              <div className="w-full flex items-center cursor-pointer gap-2">
                <MessageSquare className="h-4 w-4 mr-1 flex-shrink-0" />
                Give Feedback
              </div>
            </FeedbackForm>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <form action={logout}>
          <DropdownMenuItem
            asChild
            onSelect={(e) => {
              e.preventDefault();
            }}
          >
            <button className="w-full cursor-pointer">
              <LogOut className="h-5 w-5 mr-1 flex-shrink-0" />
              Log out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
