import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const targetUser = await prisma.user.findUnique({
      where: { username: params.username },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => ({}));
    const currentUserId = user?.id || body.userId || "user-me";

    if (currentUserId === targetUser.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
    }

    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      },
    });

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: { id: existingFollow.id },
      });
      return NextResponse.json({ following: false });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUser.id,
        },
      });

      // Trigger notification
      await prisma.notification.create({
        data: {
          recipientId: targetUser.id,
          senderId: currentUserId,
          type: "FOLLOW",
          message: "started following you.",
        },
      }).catch(() => {});

      return NextResponse.json({ following: true });
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to toggle follow", details: error.message },
      { status: 500 }
    );
  }
}
