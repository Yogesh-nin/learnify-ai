function NoteListRowSkeleton() {
  return (
    <div
      className="flex justify-between items-center gap-4 p-3 border-b border-border last:border-b-0 animate-pulse"
      aria-hidden
    >
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-4 bg-surface-hover rounded w-2/5" />
        <div className="h-3 bg-surface-hover rounded w-1/4" />
      </div>
      <div className="w-9 h-9 rounded-lg bg-surface-hover shrink-0" />
    </div>
  );
}

export default NoteListRowSkeleton;
