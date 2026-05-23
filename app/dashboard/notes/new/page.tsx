"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import NotesBackButton from "../_components/NotesBackButton";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const isDirty = title.length > 0 || content.length > 0;
  const canSave = isDirty && title.trim().length > 0 && !saving;

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      const { data } = await axios.post("/api/notes", {
        title: title.trim(),
        content,
      });
      toast.success("Note created.");
      router.replace(`/dashboard/notes/${data.note.noteId}`);
    } catch {
      toast.error("Failed to create note.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <NotesBackButton />
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave}
          className="btn btn-primary min-w-[100px] flex items-center justify-center"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save"}
        </button>
      </div>

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
            className="input w-full border border-border rounded-lg bg-surface text-foreground px-3 py-2 text-lg font-semibold"
            placeholder="Note title"
            autoFocus
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
            className="textarea w-full border border-border rounded-lg bg-surface text-foreground px-3 py-2 min-h-[20rem] resize-y"
            placeholder="Write your note..."
          />
        </div>
      </div>
    </div>
  );
}
