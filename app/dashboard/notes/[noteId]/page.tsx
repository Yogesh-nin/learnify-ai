"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import NotesBackButton from "../_components/NotesBackButton";
import NoteDeleteModal from "../_components/NoteDeleteModal";
import { formatNoteDate } from "../_components/notesUtils";

export default function NoteDetailPage() {
  const { noteId } = useParams();
  const router = useRouter();
  const id = typeof noteId === "string" ? noteId : noteId?.[0];

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saved, setSaved] = useState({ title: "", content: "" });
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  const fetchNote = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/notes/${id}`);
      const note = data.note;
      setTitle(note.title ?? "");
      setContent(note.content ?? "");
      setSaved({ title: note.title ?? "", content: note.content ?? "" });
      setCreatedAt(note.createdAt ?? null);
    } catch {
      toast.error("Note not found or you do not have access.");
      router.replace("/dashboard/notes");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const isDirty = useMemo(
    () => title !== saved.title || content !== saved.content,
    [title, content, saved]
  );

  const canSave = isDirty && title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!id || !canSave) return;
    setSaving(true);
    try {
      const { data } = await axios.patch(`/api/notes/${id}`, {
        title: title.trim(),
        content,
      });
      const note = data.note;
      setTitle(note.title);
      setContent(note.content ?? "");
      setSaved({ title: note.title, content: note.content ?? "" });
      toast.success("Note saved.");
    } catch {
      toast.error("Failed to save note.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/notes/${id}`);
      toast.success("Note deleted.");
      router.replace("/dashboard/notes");
    } catch {
      toast.error("Failed to delete note.");
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-muted" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <NotesBackButton />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDeleteOpen(true)}
            className="btn btn-outline-primary inline-flex items-center gap-2"
            disabled={deleting}
          >
            <Trash2 size={18} />
            Delete
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="btn btn-primary min-w-[100px] flex items-center justify-center"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
          </button>
        </div>
      </div>

      {createdAt && (
        <p className="text-sm text-muted mb-4">{formatNoteDate(createdAt)}</p>
      )}

      <div className="border border-border rounded-lg shadow-md bg-surface-muted p-4 md:p-6 space-y-4">
        <div>
          <label
            htmlFor="note-title"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Title
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input max-w-full border border-border rounded-lg bg-surface text-foreground px-3 py-2 text-lg font-semibold"
            placeholder="Note title"
          />
        </div>

        <div>
          <label
            htmlFor="note-content"
            className="block text-sm font-medium text-foreground mb-1"
          >
            Content
          </label>
          <textarea
            id="note-content"
            rows={16}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea max-w-full border border-border rounded-lg bg-surface text-foreground px-3 py-2 min-h-[20rem] resize-y"
            placeholder="Write your note..."
          />
        </div>
      </div>

      <NoteDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
