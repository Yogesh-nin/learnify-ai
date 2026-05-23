"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import DeleteNoteButton from "./DeleteNoteButton";
import { formatNoteDate } from "./notesUtils";

export interface NoteListRowProps {
  noteId: string;
  title: string;
  createdAt: string | Date | null;
  onDelete: (noteId: string) => void;
}

function NoteListRow({ noteId, title, createdAt, onDelete }: NoteListRowProps) {
  const formattedDate = useMemo(
    () => formatNoteDate(createdAt),
    [createdAt]
  );

  return (
    <Link
      href={`/dashboard/notes/${noteId}`}
      className="flex justify-between items-center gap-4 p-3 border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors"
    >
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{title}</p>
        <p className="text-sm text-muted mt-0.5">{formattedDate}</p>
      </div>
      <DeleteNoteButton noteId={noteId} onDelete={onDelete} />
    </Link>
  );
}

export default memo(NoteListRow);
