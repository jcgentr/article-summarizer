"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import {
  createArticleSummary,
  createCheckoutSession,
} from "../app/(protected)/actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const initialState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div>
      <Button type="submit" disabled={pending} className="w-28">
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading
          </>
        ) : (
          "Summarize"
        )}
      </Button>
    </div>
  );
}

function URLInput() {
  const { pending } = useFormStatus();

  return (
    <Input
      type="url"
      name="url"
      placeholder="Enter article URL"
      required
      disabled={pending}
    />
  );
}

export function AddForm({ currentTag }: { currentTag: string | undefined }) {
  // useActionState is available with React 19 (Next.js App Router)
  const [state, formAction] = useActionState(
    createArticleSummary,
    initialState
  );

  useEffect(() => {
    if (state.message) {
      if (state.message.startsWith("Failed")) {
        toast.error(state.message);
      } else if (state.message.startsWith("You've")) {
        if (state.message.includes("free")) {
          toast.warning(state.message, {
            description: (
              <button
                onClick={() => createCheckoutSession()}
                className="font-medium underline hover:no-underline"
              >
                Please upgrade to Pro for more summaries.
              </button>
            ),
          });
        } else {
          toast.warning(state.message);
        }
      } else {
        toast.success(state.message);
      }
    }
  }, [state]);

  return (
    <form action={formAction}>
      <div className="flex gap-2">
        <URLInput />
        <input type="hidden" name="currentTag" value={currentTag || ""} />
        <SubmitButton />
      </div>
      <p aria-live="polite" className="sr-only" role="status">
        {state.message}
      </p>
    </form>
  );
}
