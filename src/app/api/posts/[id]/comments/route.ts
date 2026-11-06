import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    const comments = await prisma.comment.findMany({
      where: { postId, parentId: null },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(comments);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch comments", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const postId = params.id;
    const body = await request.json();
    const { content, parentId } = body;
    const userId = user?.id || body.userId || "user-me";

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const [newComment] = await prisma.$transaction([
      prisma.comment.create({
        data: {
          postId,
          userId,
          content: content.trim(),
          parentId: parentId || null,
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(newComment, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create comment", details: error.message },
      { status: 500 }
    );
  }
}
