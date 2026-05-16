function CourseCardSkeleton() {
  return (
    <div className="p-4 w-full border rounded-lg shadow-md bg-surface-muted animate-pulse">
      <div className="flex flex-col justify-between">
        {/* Icon + Title row */}
        <div className="flex items-center mb-4">
          <div className="w-[50px] h-[50px] rounded-md bg-surface-hover mr-4 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-surface-hover rounded w-3/4" />
            <div className="h-4 bg-surface-hover rounded w-1/2" />
          </div>
        </div>

        {/* Summary block */}
        <div className="mt-3 bg-[#e0e0e0] py-5 px-3 rounded-lg space-y-2">
          <div className="h-3 bg-surface-hover rounded w-full" />
          <div className="h-3 bg-surface-hover rounded w-full" />
          <div className="h-3 bg-surface-hover rounded w-5/6" />
          <div className="h-3 bg-surface-hover rounded w-4/6" />
        </div>

        {/* Action buttons row */}
        <div className="mt-5 flex justify-end items-center gap-2">
          <div className="h-9 w-16 bg-surface-hover rounded-lg" />
          <div className="h-9 w-9 bg-surface-hover rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default CourseCardSkeleton;
