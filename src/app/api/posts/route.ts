import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

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
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    const body = await request.json();
    const { caption, mediaUrl, thumbnailUrl, mediaType, audioTitle, audioAuthor, tags } = body;

    if (!mediaUrl) {
      return NextResponse.json({ error: "Media URL is required" }, { status: 400 });
    }

    // Resolve valid user in DB
    let targetUserId = authUser?.id || body.userId;
    let existingUser = null;

    if (targetUserId) {
      existingUser = await prisma.user.findUnique({
        where: { id: targetUserId },
      });
    }

    if (!existingUser) {
      // Find default or first user in DB
      existingUser = await prisma.user.findFirst({
        where: { username: "alexcreator" },
      });

      if (!existingUser) {
        existingUser = await prisma.user.findFirst();
      }

      // If database has 0 users, create default creator
      if (!existingUser) {
        existingUser = await prisma.user.create({
          data: {
            id: "creator-alex",
            username: "alexcreator",
            email: "alex@blip.social",
            displayName: "Alex Rivera",
            bio: "Creator & visual designer 🎬 Exploring new horizons with Next.js & Supabase ✨",
            avatarUrl:
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
            isVerified: true,
          },
        });
      }

      targetUserId = existingUser.id;
    }

    const newPost = await prisma.post.create({
      data: {
        userId: targetUserId,
        caption,
        mediaType: mediaType === "IMAGE" ? "IMAGE" : "VIDEO",
        mediaUrl,
        thumbnailUrl: thumbnailUrl || mediaUrl,
        audioTitle: audioTitle || "Original Sound - alexcreator",
        audioAuthor: audioAuthor || existingUser.displayName || existingUser.username,
        tags: tags || [],
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        viewsCount: 1,
      },
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

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create post", details: error.message },
      { status: 500 }
    );
  }
}
