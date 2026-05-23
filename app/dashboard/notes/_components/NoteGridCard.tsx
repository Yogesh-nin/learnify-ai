"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import DeleteNoteButton from "./DeleteNoteButton";
import { formatNoteDate } from "./notesUtils";

export interface NoteGridCardProps {
  noteId: string;
  title: string;
  content: string | null;
  createdAt: string | Date | null;
  onDelete: (noteId: string) => void;
}

function NoteGridCard({
  noteId,
  title,
  content,
  createdAt,
  onDelete,
}: NoteGridCardProps) {
  const formattedDate = useMemo(
    () => formatNoteDate(createdAt),
    [createdAt]
  );

  return (
    <Link
      href={`/dashboard/notes/${noteId}`}
      className="border rounded-lg shadow-md bg-surface-muted p-4 h-full flex flex-col relative hover:ring-1 hover:ring-border transition-shadow"
    >
      <div className="absolute top-3 right-3 z-10">
        <DeleteNoteButton noteId={noteId} onDelete={onDelete} />
      </div>
      <h3 className="font-semibold pr-10 line-clamp-2">{title}</h3>
      <p className="text-sm text-muted line-clamp-3 mt-2 flex-1 whitespace-pre-wrap">
        {content || "No content"}
      </p>
      <p className="text-xs text-muted mt-auto pt-3">{formattedDate}</p>
    </Link>
  );
}

export default memo(NoteGridCard);
