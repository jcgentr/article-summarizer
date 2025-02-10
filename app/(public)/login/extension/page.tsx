"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ExtensionCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // middleware should redirect to login page if no user session found
        return router.replace("/");
      }

      if (session?.access_token && window.chrome?.runtime) {
        try {
          // Send tokens to chrome extension
          const resp = await window.chrome.runtime.sendMessage(
            process.env.NEXT_PUBLIC_EXTENSION_ID,
            {
              type: "LOGIN_SUCCESS",
              access_token: session.access_token,
              refresh_token: session.refresh_token,
            }
          );
          console.log({ resp });
          window.close();
        } catch (error) {
          console.error("Extension message error:", error);
        }
      }
    };

    handleCallback();
  }, [router]);

  return <div>Completing login...</div>;
}
