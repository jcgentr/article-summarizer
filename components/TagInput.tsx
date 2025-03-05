"use client";

import { useState } from "react";
import { addTag } from "@/app/(protected)/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export function TagInput({
  articleId,
  initialTags,
  handleTagClick,
}: {
  articleId: string;
  initialTags: string[];
  handleTagClick: (tag: string) => void;
}) {
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    const result = await addTag(articleId, newTag);

    if (result.success && result.tag) {
      setTags([result.tag, ...tags]);
      setNewTag("");
      toast.success("Tag added successfully!");
    } else {
      // Handle error, maybe show a toast notification
      console.error(result.error);
      toast.error("Failed to add tag");
    }
  };

  return (
    <div className="space-y-2">
      <form onSubmit={handleAddTag} className="flex items-center gap-1">
        <Input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="Tag name"
          className="w-36"
        />
        <Button type="submit">Add Tag</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            onClick={() => handleTagClick(tag)}
            className="text-sm cursor-pointer hover:underline bg-secondary/70 hover:bg-secondary/90 transition-colors px-3 py-1 rounded-full"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}
