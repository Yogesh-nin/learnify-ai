function NoteGridCardSkeleton() {
  return (
    <div
      className="border rounded-lg shadow-md bg-surface-muted p-4 h-full min-h-[160px] flex flex-col relative animate-pulse"
      aria-hidden
    >
      <div className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-surface-hover" />
      <div className="h-5 bg-surface-hover rounded w-4/5 mb-3" />
      <div className="space-y-2 flex-1 mt-2">
        <div className="h-3 bg-surface-hover rounded w-full" />
        <div className="h-3 bg-surface-hover rounded w-full" />
        <div className="h-3 bg-surface-hover rounded w-3/4" />
      </div>
      <div className="h-3 bg-surface-hover rounded w-1/3 mt-4" />
    </div>
  );
}

export default NoteGridCardSkeleton;
