import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "/configs/db";
import { PERSONAL_NOTES_TABLE } from "/configs/schema";
import { getOwnedNote } from "/lib/noteAccess";

export async function GET(_req, { params }) {
  try {
    const { noteId } = await params;
    const owned = await getOwnedNote(noteId);
    if (owned.error) return owned.error;

    return NextResponse.json({ note: owned.note });
  } catch (error) {
    console.error("Error fetching note:", error);
    return NextResponse.json(
      { error: "Failed to fetch note." },
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    const { noteId } = await params;
    const owned = await getOwnedNote(noteId);
    if (owned.error) return owned.error;

    const { title, content } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    const [note] = await db
      .update(PERSONAL_NOTES_TABLE)
      .set({
        title: title.trim(),
        content: content ?? "",
        updatedAt: new Date(),
      })
      .where(eq(PERSONAL_NOTES_TABLE.noteId, noteId))
      .returning();

    return NextResponse.json({ note });
  } catch (error) {
    console.error("Error updating note:", error);
    return NextResponse.json(
      { error: "Failed to update note." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req, { params }) {
  try {
    const { noteId } = await params;
    const owned = await getOwnedNote(noteId);
    if (owned.error) return owned.error;

    await db
      .delete(PERSONAL_NOTES_TABLE)
      .where(eq(PERSONAL_NOTES_TABLE.noteId, noteId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting note:", error);
    return NextResponse.json(
      { error: "Failed to delete note." },
      { status: 500 }
    );
  }
}
