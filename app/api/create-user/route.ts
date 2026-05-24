import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { inngest } from "../../../inngest/client";
import { ensureUserInDb } from "@/lib/ensureUser";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const clerkUser = body?.user ?? (await currentUser());

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found." }, { status: 400 });
    }

    const { created, user } = await ensureUserInDb(clerkUser);

    if (created) {
      try {
        await inngest.send({
          name: "user.create",
          data: { user: clerkUser },
        });
      } catch (inngestErr) {
        console.warn("[create-user] Inngest send skipped or failed:", inngestErr);
      }
    }

    return NextResponse.json({ created, user });
  } catch (error) {
    console.error("Error in POST /api/create-user:", error);
    return NextResponse.json(
      { error: "Failed to sync user." },
      { status: 500 }
    );
  }
}
