import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { db } from "/configs/db";
import { PERSONAL_NOTES_TABLE } from "/configs/schema";
import { parsePagination } from "/lib/pagination";
import {
  getAuthenticatedUserEmail,
  listNotesForUser,
} from "/lib/noteAccess";

export async function GET(req) {
  try {
    const email = await getAuthenticatedUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const { page, size, offset } = parsePagination(searchParams, {
      defaultSize: 12,
    });

    const { notes, pagination } = await listNotesForUser(email, {
      page,
      size,
      offset,
    });

    return NextResponse.json({ notes, pagination });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes." },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const email = await getAuthenticatedUserEmail();
    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    const noteId = uuidv4();
    const now = new Date();

    const [note] = await db
      .insert(PERSONAL_NOTES_TABLE)
      .values({
        noteId,
        title: title.trim(),
        content: content ?? "",
        createdBy: email,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json(
      { error: "Failed to create note." },
      { status: 500 }
    );
  }
}
