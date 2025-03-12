"use client";

import { addTag, deleteTag } from "@/app/(protected)/actions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CustomBadge } from "./CustomBadge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function TagInput({
  articleId,
  initialTags = [],
  allTags = [],
  onSearchTag,
}: {
  articleId: string;
  initialTags: string[];
  allTags: string[];
  onSearchTag: (tag: string) => void;
}) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [newTag, setNewTag] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter available tags based on input
  const filteredTags = allTags
    .filter(
      (tag) =>
        tag.toLowerCase().includes(newTag.toLowerCase()) && !tags.includes(tag)
    )
    .slice(0, 5); // Limit to 5 suggestions for better UX

  const showDropdown = isInputFocused && filteredTags.length > 0;

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

  const handleAddTagByName = async (tagName: string) => {
    if (!tagName.trim()) return;

    const result = await addTag(articleId, tagName);

    if (result.success && result.tag) {
      setTags([result.tag, ...tags]);
      setNewTag(""); // Clear input after adding
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

  const handleAddTag = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleAddTagByName(newTag);
  };

  // Handle focus and blur events
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    // Small delay to allow for clicking dropdown items
    setTimeout(() => {
      setIsInputFocused(false);
    }, 150);
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleAddTag} className="flex items-center gap-1">
        <div className="relative w-36">
          <Input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Tag name"
            className="w-full"
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute z-10 w-full mt-1 bg-popover rounded-md border shadow-md"
            >
              <Command>
                <CommandList>
                  <CommandEmpty>No matching tags</CommandEmpty>
                  <CommandGroup>
                    {filteredTags.map((tag) => (
                      <CommandItem
                        key={tag}
                        onSelect={() => handleAddTagByName(tag)}
                        className="cursor-pointer"
                      >
                        <span
                          className="truncate max-w-[180px] block"
                          title={tag}
                        >
                          {tag}
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>
          )}
        </div>
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
