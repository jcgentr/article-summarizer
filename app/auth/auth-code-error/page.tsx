"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthCodeError() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8">
        <h1 className="text-destructive text-2xl font-bold mb-4">
          Authentication Failed
        </h1>
        <p className="text-muted-foreground">
          Redirecting you to login page...
        </p>
      </div>
    </div>
  );
}
