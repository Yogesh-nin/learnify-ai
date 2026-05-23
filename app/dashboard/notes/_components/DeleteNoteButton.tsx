"use client";

import { memo } from "react";
import { Trash2 } from "lucide-react";

interface DeleteNoteButtonProps {
  noteId: string;
  onDelete: (noteId: string) => void;
}

function DeleteNoteButton({ noteId, onDelete }: DeleteNoteButtonProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onDelete(noteId);
      }}
      className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      aria-label="Delete note"
    >
      <Trash2 size={18} />
    </button>
  );
}

export default memo(DeleteNoteButton);
