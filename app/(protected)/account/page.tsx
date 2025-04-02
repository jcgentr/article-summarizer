import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { createPortalSession } from "../actions";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { UserMetadata } from "../types";
import Link from "next/link";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();

  // Get auth user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError) {
    redirect("/login");
  }

  // Get user metadata
  const { data: userMetadata, error: metadataError } = await supabase
    .from("user_metadata")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (metadataError) {
    console.error("Error fetching user metadata:", metadataError);
  }

  const metadata = (userMetadata as UserMetadata) || {
    plan_type: "free",
    summaries_generated: 0,
    billing_cycle_start: new Date().toISOString(),
    stripe_customer_id: null,
  };

  // https://nextjs.org/docs/app/api-reference/file-conventions/page#handling-filtering-with-searchparams
  const { success, canceled } = await searchParams;

  // Show success or canceled state
  if (success === "true" || canceled === "true") {
    return (
      <div className="container max-w-md py-16 mx-auto">
        <Card className="text-center">
          <CardHeader>
            {success === "true" ? (
              <>
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
                <CardTitle className="mt-4">Subscription Successful!</CardTitle>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <CardTitle className="mt-4">Subscription Canceled</CardTitle>
              </>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {success === "true" ? (
              <>
                <p className="text-muted-foreground mb-6">
                  Thank you for subscribing to Gistr Pro! Your account has been
                  upgraded.
                </p>
                <div className="flex flex-col gap-4">
                  {metadata.stripe_customer_id && (
                    <form action={createPortalSession}>
                      <Button type="submit" className="w-full">
                        Manage Billing
                      </Button>
                    </form>
                  )}
                  <Link href="/" passHref>
                    <Button variant="outline" className="w-full">
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Your subscription was canceled. You can try again whenever
                  you&apos;re ready.
                </p>
                <Link href="/" passHref>
                  <Button className="w-full" variant="outline">
                    Return to Homepage
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default account view (when no success/canceled params)
  return (
    <div className="container max-w-2xl py-8 px-4 mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium">Email</h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div>
            <h3 className="font-medium">Plan Type</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {metadata.plan_type}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Summaries This Cycle</h3>
            <p className="text-sm text-muted-foreground">
              {`${metadata.summaries_generated} ${
                metadata.plan_type === "free" ? "/ 15" : "/ 100"
              }`}
            </p>
          </div>
          <div>
            <h3 className="font-medium">Billing Cycle Started</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(metadata.billing_cycle_start).toLocaleDateString()}
            </p>
          </div>
          <div className="flex justify-between flex-wrap gap-2">
            {metadata.stripe_customer_id && (
              <form action={createPortalSession}>
                <Button type="submit">Manage Billing</Button>
              </form>
            )}
            <Link href="/" passHref>
              <Button variant="outline">Return to Homepage</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
