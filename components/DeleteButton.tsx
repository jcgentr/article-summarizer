"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteArticleSummary } from "../app/(protected)/actions";
import { toast } from "sonner";

interface DeleteButtonProps {
  id: string;
}

export function DeleteButton({ id }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { message } = await deleteArticleSummary(id);
      toast.success(message);
    } catch (error) {
      console.error("Failed to delete article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="hover:bg-destructive hover:text-destructive-foreground flex items-center gap-1"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
      <span className="hidden sm:inline">
        {isDeleting ? "Deleting..." : "Delete"}
      </span>
    </Button>
  );
}
