import { and, count, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "/configs/db";
import { PERSONAL_NOTES_TABLE } from "/configs/schema";
import { getAuthenticatedUserEmail } from "/lib/courseAccess";
import { buildPaginationMeta } from "/lib/pagination";

export { getAuthenticatedUserEmail };

export async function listNotesForUser(email, { page, size, offset }) {
  const where = eq(PERSONAL_NOTES_TABLE.createdBy, email);

  const [notes, [{ total }]] = await Promise.all([
    db
      .select()
      .from(PERSONAL_NOTES_TABLE)
      .where(where)
      .orderBy(desc(PERSONAL_NOTES_TABLE.updatedAt))
      .limit(size)
      .offset(offset),
    db.select({ total: count() }).from(PERSONAL_NOTES_TABLE).where(where),
  ]);

  return {
    notes,
    pagination: buildPaginationMeta(page, size, Number(total)),
  };
}

export async function getOwnedNote(noteId) {
  const email = await getAuthenticatedUserEmail();
  if (!email) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  if (!noteId) {
    return {
      error: NextResponse.json(
        { error: "The 'noteId' field is required." },
        { status: 400 }
      ),
    };
  }

  const rows = await db
    .select()
    .from(PERSONAL_NOTES_TABLE)
    .where(
      and(
        eq(PERSONAL_NOTES_TABLE.noteId, noteId),
        eq(PERSONAL_NOTES_TABLE.createdBy, email)
      )
    )
    .limit(1);

  if (rows.length === 0) {
    return {
      error: NextResponse.json({ error: "Note not found." }, { status: 404 }),
    };
  }

  return { note: rows[0], email };
}
