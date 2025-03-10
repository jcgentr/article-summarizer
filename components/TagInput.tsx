"use client";

import { useState } from "react";
import { addTag, deleteTag } from "@/app/(protected)/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { CustomBadge } from "./CustomBadge";
import { useRouter } from "next/navigation";

export function TagInput({
  articleId,
  initialTags,
  onSearchTag,
}: {
  articleId: string;
  initialTags: string[];
  onSearchTag: (tag: string) => void;
}) {
  const router = useRouter();
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
      console.error(result.error);
      if (result.error?.includes("duplicate")) {
        toast.error("Tag already exists");
      } else {
        toast.error("Failed to add tag");
      }
    }
  };

  const handleTagClick = (event: React.MouseEvent, tag: string) => {
    console.log(event);
    if (event.ctrlKey || event.metaKey) {
      // Ctrl+Click (or Cmd+Click on Mac) to search on current page
      event.preventDefault();
      onSearchTag(tag);
    } else {
      // Regular click navigates to tag page
      router.push(`/tags/${encodeURIComponent(tag)}`);
    }
  };

  const handleDeleteTag = async (tagToDelete: string) => {
    const result = await deleteTag(articleId, tagToDelete);

    if (result.success) {
      setTags(tags.filter((tag) => tag !== tagToDelete));
      toast.success("Tag deleted successfully!");
    } else {
      console.error(result.error);
      toast.error("Failed to delete tag");
    }
  };

  return (
    <div className="space-y-3">
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
          <CustomBadge
            key={tag}
            tag={tag}
            onDelete={handleDeleteTag}
            onClick={handleTagClick}
          />
        ))}
      </div>
    </div>
  );
}
