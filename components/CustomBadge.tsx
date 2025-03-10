import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

interface CustomBadgeProps {
  tag: string;
  onDelete: (tag: string) => void;
  onClick: (e: React.MouseEvent, tag: string) => void;
}

export function CustomBadge({ tag, onDelete, onClick }: CustomBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="text-sm cursor-pointer hover:bg-secondary/90 transition-colors px-3 py-1 rounded-full relative group"
    >
      <span className="hover:underline" onClick={(e) => onClick(e, tag)}>
        {tag}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(tag);
        }}
        className="absolute -top-1 -right-2 bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:shadow-lg"
      >
        <X size={12} />
      </button>
    </Badge>
  );
}
