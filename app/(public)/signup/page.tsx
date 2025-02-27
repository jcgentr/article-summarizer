"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, UserPlus } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signup } from "./actions";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { signInWithGithub, signInWithGoogle } from "../login/actions";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-1" />
          Signing up...
        </>
      ) : (
        <>
          <UserPlus className="mr-1 h-4 w-4" />
          Sign up
        </>
      )}
    </Button>
  );
}

function EmailInput() {
  const { pending } = useFormStatus();

  return (
    <Input id="email" name="email" type="email" required disabled={pending} />
  );
}

function PasswordInput() {
  const { pending } = useFormStatus();

  return (
    <Input
      id="password"
      name="password"
      type="password"
      required
      disabled={pending}
    />
  );
}

function Signup() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");
  const [state, formAction] = useActionState(signup, initialState);
  const [isGoogleLoading, setGoogleLoading] = useState(false);
  const [isGithubLoading, setGithubLoading] = useState(false);

  useEffect(() => {
    if (state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleGoogleSignup = async () => {
    console.log("google signup triggered...");
    setGoogleLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result?.message) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("An error occurred during Google signup:", error);
      toast.error("An error occurred. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleGithubSignup = async () => {
    console.log("github signup triggered...");
    setGithubLoading(true);
    try {
      const result = await signInWithGithub();
      if (result?.message) {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error("An error occurred during GitHub signup:", error);
      toast.error("An error occurred. Please try again.");
      setGithubLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sign up</h1>
      </div>
      <div className="space-y-4 pb-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isGoogleLoading}
        >
          <FcGoogle className="mr-2 h-4 w-4 flex-shrink-0" />
          Sign up with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGithubSignup}
          disabled={isGithubLoading}
        >
          <FaGithub className="mr-2 h-4 w-4 flex-shrink-0" />
          Sign up with GitHub
        </Button>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator className="w-full" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="plan" value={plan ?? undefined} />
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <EmailInput />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <PasswordInput />
        </div>
        <div className="flex space-x-2 justify-between">
          <SubmitButton />
        </div>
      </form>

      <div className="text-center pt-4">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

function SignupSkeleton() {
  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div>
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4 pb-2">
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
        <div className="h-10 w-full bg-muted animate-pulse rounded" />
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full h-[1px] bg-muted animate-pulse" />
        </div>
        <div className="relative flex justify-center">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 w-12 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-16 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="flex space-x-2 justify-between">
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>

      <div className="text-center pt-4">
        <div className="h-4 w-48 bg-muted animate-pulse rounded mx-auto" />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupSkeleton />}>
      <Signup />
    </Suspense>
  );
}
