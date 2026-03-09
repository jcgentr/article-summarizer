"use client";

import {
  BookOpen,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleOff,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Article } from "@/app/(protected)/types";

export const FILTER_OPTIONS = {
  none: {
    label: "None",
    icon: <CircleOff className="h-4 w-4 shrink-0" />,
    filter: (articles: Article[]) => articles,
  },
  read: {
    label: "Read",
    icon: <BookOpenCheck className="h-4 w-4 shrink-0" />,
    filter: (articles: Article[]) =>
      articles.filter((article) => article.has_read),
  },
  unread: {
    label: "Unread",
    icon: <BookOpen className="h-4 w-4 shrink-0" />,
    filter: (articles: Article[]) =>
      articles.filter((article) => !article.has_read),
  },
  "under-5-min": {
    label: "< 5 min read",
    icon: <Timer className="h-4 w-4 shrink-0" />,
    filter: (articles: Article[]) =>
      articles.filter((article) => (article.read_time || 0) < 5),
  },
} as const;

export type FilterId = keyof typeof FILTER_OPTIONS;

interface FilterDropdownProps {
  value: FilterId;
  onValueChange: (value: FilterId) => void;
}

export default function FilterDropdown({
  value,
  onValueChange,
}: FilterDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="bg-background/50 backdrop-blur-sm">
          <span className="text-muted-foreground">Filter by:</span>{" "}
          {FILTER_OPTIONS[value].label}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-44" align="start">
        <DropdownMenuGroup>
          {Object.entries(FILTER_OPTIONS).map(([id, option]) => (
            <DropdownMenuItem
              key={id}
              onClick={() => onValueChange(id as FilterId)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2 flex-1">
                {option.icon}
                <span>{option.label}</span>
              </div>
              {value === id && <Check className="h-4 w-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
