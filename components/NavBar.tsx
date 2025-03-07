import { User } from "@supabase/supabase-js";
import { ModeToggle } from "./ModeToggle";
import Image from "next/image";
import gistrLogo from "../app/images/icon-32.png";
import Link from "next/link";
import { NavUser } from "./NavUser";
import { createClient } from "@/utils/supabase/server";
import { SUMMARY_LIMITS } from "@/lib/billing";
import { PlanType, UserMetadata } from "@/app/(protected)/types";

const DEFAULT_USER_METADATA: Pick<
  UserMetadata,
  "plan_type" | "summaries_generated" | "stripe_customer_id"
> = {
  plan_type: "free",
  summaries_generated: 0,
  stripe_customer_id: null,
} as const;

export default async function NavBar({ user }: { user: User }) {
  const supabase = await createClient();
  const { data: userMetadata } = await supabase
    .from("user_metadata")
    .select("plan_type, summaries_generated, stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  const metadata = userMetadata ?? DEFAULT_USER_METADATA;

  return (
    <nav className="w-full border-b">
      <div className="flex h-16 items-center justify-between mx-4">
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

        <div className="flex gap-4 items-center">
          <nav className="flex items-center space-x-4">
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Leaderboard
            </Link>
          </nav>
          <NavUser
            email={user.email || ""}
            stripeCustomerId={metadata.stripe_customer_id}
            planType={metadata.plan_type}
            summariesGenerated={metadata.summaries_generated}
            summaryLimit={SUMMARY_LIMITS[metadata.plan_type as PlanType]}
          />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
