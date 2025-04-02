"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function CollapsedTrigger() {
  const { state, isMobile, openMobile } = useSidebar();

  // Show trigger on mobile when sheet is closed, or on desktop when sidebar is collapsed
  const shouldShow =
    (isMobile && !openMobile) || (!isMobile && state === "collapsed");

  return (
    <div
      className={cn(
        "fixed z-50 transition-all duration-300",
        // Position the trigger in the header area
        "left-4 top-[0.875rem] md:left-6 md:top-4",
        shouldShow
          ? "opacity-100 visible translate-x-0"
          : "opacity-0 invisible -translate-x-2",
        // Add a delay when showing the trigger
        shouldShow && "delay-150"
      )}
    >
      <SidebarTrigger />
    </div>
  );
}
