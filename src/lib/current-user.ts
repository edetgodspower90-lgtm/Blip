import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Resolves the signed-in Clerk user's row in the local database.
 * Returns null when unauthenticated or when the webhook has not synced yet.
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  return prisma.user.findUnique({ where: { clerkId: userId } });
}
