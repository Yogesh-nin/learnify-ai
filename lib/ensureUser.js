import { eq } from "drizzle-orm";
import { db } from "/configs/db";
import { USER_TABLE } from "/configs/schema";

/**
 * Ensures a Clerk user exists in the users table (server-only).
 * @param {import("@clerk/nextjs/server").User | { fullName?: string | null; primaryEmailAddress?: { emailAddress?: string } | null }} user
 */
export async function ensureUserInDb(user) {
  const email = user?.primaryEmailAddress?.emailAddress;
  if (!email) {
    return { created: false, user: null };
  }

  const existing = await db
    .select()
    .from(USER_TABLE)
    .where(eq(USER_TABLE.email, email))
    .limit(1);

  if (existing.length > 0) {
    return { created: false, user: existing[0] };
  }

  const [inserted] = await db
    .insert(USER_TABLE)
    .values({
      name: user?.fullName ?? "",
      email,
    })
    .returning();

  return { created: true, user: inserted };
}
