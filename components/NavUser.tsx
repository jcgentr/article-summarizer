"use client";

import {
  CreditCard,
  LogOut,
  MessageSquare,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  createCheckoutSession,
  createPortalSession,
  logout,
} from "@/app/(protected)/actions";
import { PlanType } from "@/app/(protected)/types";
import Link from "next/link";
import { useChromeExtension } from "@/lib/hooks/useChromeExtension";
import { useThemeShortcut } from "@/lib/hooks/useThemeShortcut";
import { FeedbackForm } from "./FeedbackForm";

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
        <Button variant="outline">
          <User className="h-5 w-5 flex-shrink-0" />
          <span className="hidden sm:inline truncate">{email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg">
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <User className="h-5 w-5 mr-1 flex-shrink-0" />
            <span className="truncate">{email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <FeedbackForm>
              <div className="flex items-center cursor-pointer gap-2">
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
