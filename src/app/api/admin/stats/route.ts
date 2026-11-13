import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();
  try {
    const [
      userCount,
      verifiedUserCount,
      postCount,
      videoCount,
      imageCount,
      commentCount,
      likeCount,
      bookmarkCount,
      paidEarnings,
      recentUsers,
      recentPosts,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isVerified: true } }),
      prisma.post.count(),
      prisma.post.count({ where: { mediaType: "VIDEO" } }),
      prisma.post.count({ where: { mediaType: "IMAGE" } }),
      prisma.comment.count(),
      prisma.like.count(),
      prisma.bookmark.count(),
      prisma.earning.aggregate({
        _sum: { amountNaira: true },
        where: { status: "PAID" },
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      prisma.post.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              username: true,
              displayName: true,
              avatarUrl: true,
            },
          },
        },
      }),
    ]);

    const latencyMs = Date.now() - startTime;

    // Aggregate engagement
    const aggregations = await prisma.post.aggregate({
      _sum: {
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
        sharesCount: true,
      },
    });

    return NextResponse.json({
      metrics: {
        totalUsers: userCount,
        verifiedUsers: verifiedUserCount,
        totalPosts: postCount,
        videoPosts: videoCount,
        imagePosts: imageCount,
        totalComments: commentCount,
        totalLikes: likeCount,
        totalBookmarks: bookmarkCount,
        totalViews: aggregations._sum.viewsCount || 0,
        totalEngagementLikes: aggregations._sum.likesCount || 0,
        totalEngagementShares: aggregations._sum.sharesCount || 0,
        totalPaidEarnings: paidEarnings._sum.amountNaira || 0,
      },
      recentUsers,
      recentPosts,
      health: {
        status: "healthy",
        database: "PostgreSQL (Supabase Pooler)",
        latencyMs,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch admin stats",
        details: error.message,
        health: { status: "degraded", latencyMs: Date.now() - startTime },
      },
      { status: 500 }
    );
  }
}
