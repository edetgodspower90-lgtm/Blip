import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor");
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatarUrl: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({
      posts,
      nextCursor: posts.length === limit ? posts[posts.length - 1].id : null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { caption, mediaUrl, mediaType, audioTitle, audioAuthor, tags } = body;

    // Use logged in user or fallback user
    const userId = user?.id || body.userId;

    if (!mediaUrl) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        userId: userId || "user-me",
        caption,
        mediaType: mediaType === "IMAGE" ? "IMAGE" : "VIDEO",
        mediaUrl,
        audioTitle: audioTitle || "Original Sound",
        audioAuthor: audioAuthor || "Creator",
        tags: tags || [],
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}
