"use client";

import { MessageSquare } from "lucide-react";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "./ui/button";

export function FeedbackButton() {
  return (
    <div className="fixed bottom-20 right-4 md:bottom-28 md:right-16">
      <FeedbackForm>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-10 w-10 shadow-md hover:shadow-lg transition-shadow"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Give Feedback</span>
        </Button>
      </FeedbackForm>
    </div>
  );
}
