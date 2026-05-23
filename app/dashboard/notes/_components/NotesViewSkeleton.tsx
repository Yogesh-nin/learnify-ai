import { memo } from "react";
import NoteGridCardSkeleton from "./NoteGridCardSkeleton";
import NoteListRowSkeleton from "./NoteListRowSkeleton";

const SKELETON_COUNT = 6;

interface NotesViewSkeletonProps {
  view: "list" | "grid";
}

function NotesViewSkeleton({ view }: NotesViewSkeletonProps) {
  if (view === "list") {
    return (
      <div className="border border-border rounded-lg overflow-hidden bg-surface">
        {Array.from({ length: SKELETON_COUNT }, (_, i) => (
          <NoteListRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
      {Array.from({ length: SKELETON_COUNT }, (_, i) => (
        <NoteGridCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default memo(NotesViewSkeleton);
