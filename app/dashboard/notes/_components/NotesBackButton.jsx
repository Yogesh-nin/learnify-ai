"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotesBackButton({ className = "" }) {
  return (
    <Link
      href="/dashboard/notes"
      className={`inline-flex items-center gap-2 btn btn-outline-primary text-sm ${className}`}
    >
      <ArrowLeft size={18} strokeWidth={2} />
      Back to notes
    </Link>
  );
}
