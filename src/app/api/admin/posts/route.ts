import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q") || "";
    const mediaType = searchParams.get("type"); // "VIDEO" | "IMAGE"

    const where: any = {};

    if (search.trim()) {
      where.OR = [
        { caption: { contains: search, mode: "insensitive" } },
        { user: { username: { contains: search, mode: "insensitive" } } },
        { user: { displayName: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (mediaType === "VIDEO" || mediaType === "IMAGE") {
      where.mediaType = mediaType;
    }

    const posts = await prisma.post.findMany({
      where,
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
        _count: {
          select: {
            likes: true,
            comments: true,
            bookmarks: true,
          },
        },
      },
    });

    return NextResponse.json({ posts });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error.message },
      { status: 500 }
    );
  }
}
