"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface PrintableArticleProps {
  title: string;
  author?: string;
  published_time: string | null;
  content: string;
}

export function PrintableArticle({
  title,
  author,
  published_time,
  content,
}: PrintableArticleProps) {
  useEffect(() => {
    window.print();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <article className="print-article max-w-3xl mx-auto pb-8">
      <div className="flex justify-end">
        <Button onClick={handlePrint}>Print</Button>
      </div>
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <div className="flex justify-between flex-wrap gap-2 text-muted-foreground mb-8">
        {author && <div>{author}</div>}
        {published_time && (
          <div>
            {new Date(published_time).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        )}
      </div>
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
