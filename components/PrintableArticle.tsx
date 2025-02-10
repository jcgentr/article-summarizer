"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface PrintableArticleProps {
  title: string;
  author?: string;
  content: string;
}

export function PrintableArticle({
  title,
  author,
  content,
}: PrintableArticleProps) {
  useEffect(() => {
    // Auto-print when the component mounts
    window.print();
  }, []);

  return (
    <article className="print-article max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      {author && <p className="text-muted-foreground mb-8">{author}</p>}
      <div
        className={cn(
          "prose lg:prose-xl",
          // Print-friendly styles that also work on web
          "[&_p]:mb-[1em] [&_p]:leading-[1.6]",
          "[&_h1+p]:mt-[18pt] [&_h2+p]:mt-[18pt] [&_h3+p]:mt-[18pt]",
          "[&_p+p]:mt-[1em]",
          "[&_h2]:text-[18pt] [&_h2]:mt-[36pt] [&_h2]:mb-[18pt]",
          "[&_h3]:text-[16pt] [&_h3]:mt-[24pt] [&_h3]:mb-[12pt]"
        )}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
}
