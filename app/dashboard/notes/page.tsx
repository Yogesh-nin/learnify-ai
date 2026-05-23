"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { LayoutGrid, LayoutList } from "lucide-react";
import { toast } from "sonner";
import PaginationControls from "../../_components/PaginationControls";
import type { PaginationMeta } from "../../_components/PaginationControls";
import NoteDeleteModal from "./_components/NoteDeleteModal";
import NoteGridCard from "./_components/NoteGridCard";
import NoteListRow from "./_components/NoteListRow";
import NotesViewSkeleton from "./_components/NotesViewSkeleton";

const VIEW_STORAGE_KEY = "learnify-notes-view";
const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 6;

const defaultPagination: PaginationMeta = {
  page: DEFAULT_PAGE,
  size: DEFAULT_SIZE,
  total: 0,
  totalPages: 1,
  hasMore: false,
};

export default function DashboardNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pagination, setPagination] =
    useState<PaginationMeta>(defaultPagination);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);

  const notesRef = useRef(notes);
  notesRef.current = notes;
  const pageRef = useRef(page);
  pageRef.current = page;

  useEffect(() => {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "list" || stored === "grid") {
      setView(stored);
    }
  }, []);

  const fetchNotes = useCallback(async (pageNum = DEFAULT_PAGE) => {
    try {
      setLoading(true);
      pageRef.current = pageNum;
      setPage(pageNum);
      const { data } = await axios.get("/api/notes", {
        params: { page: pageNum, size: DEFAULT_SIZE },
      });
      setNotes(data.notes ?? []);
      setPagination(data.pagination ?? defaultPagination);
    } catch {
      toast.error("Failed to load notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes(DEFAULT_PAGE);
  }, [fetchNotes]);

  const setViewPreference = (next: "list" | "grid") => {
    setView(next);
    localStorage.setItem(VIEW_STORAGE_KEY, next);
  };

  const handleRequestDelete = useCallback((noteId) => {
    const note = notesRef.current.find((n) => n.noteId === noteId);
    if (note) {
      setDeletingNote(note);
      setDeleteOpen(true);
    }
  }, []);

  const handleDelete = async () => {
    if (!deletingNote) return;
    const snapshot = deletingNote;
    const noteId = deletingNote.noteId;

    setNotes((prev) => prev.filter((n) => n.noteId !== noteId));
    setDeleteOpen(false);
    setDeletingNote(null);
    setDeleting(true);

    try {
      await axios.delete(`/api/notes/${noteId}`);
      toast.success("Note deleted.");
      const remaining = notesRef.current.filter((n) => n.noteId !== noteId);
      if (remaining.length === 0 && pageRef.current > 1) {
        await fetchNotes(pageRef.current - 1);
      } else {
        setPagination((prev) => ({
          ...prev,
          total: Math.max(0, prev.total - 1),
        }));
      }
    } catch {
      setNotes((prev) => {
        const exists = prev.some((n) => n.noteId === noteId);
        return exists ? prev : [snapshot, ...prev];
      });
      toast.error("Failed to delete note.");
    } finally {
      setDeleting(false);
    }
  };

  const closeDeleteModal = useCallback(() => {
    setDeleteOpen(false);
    setDeletingNote(null);
  }, []);

  const showEmpty = !loading && notes.length === 0 && pagination.total === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Link href="/dashboard/notes/new" className="btn btn-primary">
          New Note
        </Link>

        <div className="flex rounded-lg border border-border overflow-hidden">
          <button
            type="button"
            onClick={() => setViewPreference("list")}
            className={`p-2.5 transition-colors ${
              view === "list"
                ? "bg-surface-hover text-foreground"
                : "bg-surface text-muted hover:bg-surface-hover"
            }`}
            aria-label="List view"
          >
            <LayoutList size={20} />
          </button>
          <button
            type="button"
            onClick={() => setViewPreference("grid")}
            className={`p-2.5 transition-colors border-l border-border ${
              view === "grid"
                ? "bg-surface-hover text-foreground"
                : "bg-surface text-muted hover:bg-surface-hover"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid size={20} />
          </button>
        </div>
      </div>

      {loading ? (
        <NotesViewSkeleton view={view} />
      ) : showEmpty ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <img
            src="/notes.png"
            alt=""
            width={80}
            height={80}
            className="opacity-80 mb-4"
          />
          <p className="text-lg font-medium text-foreground mb-2">
            No notes yet
          </p>
          <p className="text-muted text-sm mb-6 max-w-sm">
            Create your first personal note to capture ideas and study reminders.
          </p>
          <Link href="/dashboard/notes/new" className="btn btn-primary">
            New Note
          </Link>
        </div>
      ) : view === "list" ? (
        <>
          <div className="border border-border rounded-lg overflow-hidden bg-surface">
            {notes.map((note) => (
              <NoteListRow
                key={note.noteId}
                noteId={note.noteId}
                title={note.title}
                createdAt={note.createdAt}
                onDelete={handleRequestDelete}
              />
            ))}
          </div>
          <PaginationControls
            pagination={pagination}
            onPageChange={fetchNotes}
            loading={loading}
          />
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {notes.map((note) => (
              <NoteGridCard
                key={note.noteId}
                noteId={note.noteId}
                title={note.title}
                content={note.content}
                createdAt={note.createdAt}
                onDelete={handleRequestDelete}
              />
            ))}
          </div>
          <PaginationControls
            pagination={pagination}
            onPageChange={fetchNotes}
            loading={loading}
          />
        </>
      )}

      <NoteDeleteModal
        open={deleteOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
