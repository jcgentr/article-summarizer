import { Clock, FileText, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteButton } from "./DeleteButton";
import { ReadCheckbox } from "./ReadCheckbox";
import { Article } from "../app/(protected)/types";
import { Rating } from "./Rating";
import * as motion from "motion/react-client";
import { AnimatePresence } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { PrintButton } from "./PrintButton";

export function ArticleCard({
  id,
  title,
  author,
  summary,
  word_count,
  read_time,
  url,
  has_read,
  rating,
  tags,
  formatted_content,
  handleTagClick,
}: Article & {
  handleTagClick: (tag: string) => void;
}) {
  const formattedTags = tags?.split(",").map((tag, index) => (
    <span
      key={index}
      onClick={() => handleTagClick(tag.trim())}
      className="text-sm cursor-pointer hover:underline bg-secondary/70 hover:bg-secondary/90 transition-colors px-3 py-1 rounded-full"
    >
      {tag.trim()}
    </span>
  ));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <TooltipWrapper text={url}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {title}
            </a>
          </TooltipWrapper>
        </CardTitle>
        {author && (
          <p className="pt-2 text-sm text-muted-foreground flex items-center gap-1">
            <User className="h-4 w-4" />
            {author}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-base pt-0">
              Summary
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground text-base leading-relaxed">
                {summary}
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
          <div className="flex gap-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-4 py-2"
            >
              <FileText className="h-4 w-4 flex-shrink-0" />
              {word_count.toLocaleString("en-US")} words
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 px-4 py-2"
            >
              <Clock className="h-4 w-4 flex-shrink-0" />
              {read_time} min read
            </Badge>
          </div>
          <div className="flex items-center gap-4 justify-end">
            <AnimatePresence>
              {has_read && (
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 50, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <Rating id={id} initialRating={rating} />
                </motion.div>
              )}
            </AnimatePresence>
            <ReadCheckbox id={id} initialReadStatus={has_read} />
            {formatted_content && <PrintButton id={id} />}
            <DeleteButton id={id} />
          </div>
        </div>
        <div className="text-muted-foreground flex gap-2 flex-wrap">
          {formattedTags}
        </div>
      </CardContent>
    </Card>
  );
}

interface TooltipWrapperProps {
  children: React.ReactNode;
  text: string;
}

function TooltipWrapper({ children, text }: TooltipWrapperProps) {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="truncate max-w-[400px]">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
