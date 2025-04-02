"use client";

import Image from "next/image";
import Link from "next/link";
import { useSidebar } from "@/components/ui/sidebar";
import { ModeToggle } from "./ModeToggle";
import {
  SidebarHeader as SidebarHeaderBase,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import gistrLogo from "../app/images/icon-32.png";

export function SidebarHeader() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarHeaderBase>
      <div className="flex items-center justify-between p-1">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setOpenMobile(false)}
        >
          <Image
            src={gistrLogo}
            className="mr-1 flex-shrink-0"
            alt="Gistr Logo"
            width="32"
            height="32"
          />
          <span className="text-2xl font-bold">Gistr</span>
        </Link>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <SidebarTrigger />
        </div>
      </div>
    </SidebarHeaderBase>
  );
}
