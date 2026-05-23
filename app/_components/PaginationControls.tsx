"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  loading?: boolean;
  className?: string;
}

export default function PaginationControls({
  pagination,
  onPageChange,
  loading = false,
  className = "",
}: PaginationControlsProps) {
  const { page, totalPages, total, hasMore } = pagination;
  const canPrev = page > 1;
  const canNext = hasMore;

  if (total === 0) return null;

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 mt-6 ${className}`}
    >
      <p className="text-sm text-muted">
        Page {page} of {totalPages} · {total} total
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev || loading}
          className="btn btn-outline-primary inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext || loading}
          className="btn btn-outline-primary inline-flex items-center gap-1 px-3 py-2 text-sm disabled:opacity-40"
          aria-label="Next page"
        >
          Next
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
