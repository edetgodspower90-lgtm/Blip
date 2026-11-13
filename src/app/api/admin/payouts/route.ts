import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const authUser = await getCurrentUser();
    // Allow access if no users configured yet or if authUser is admin
    if (authUser && !authUser.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all"; // "all" | "eligible" | "pending" | "paid"
    const period = searchParams.get("period") || new Date().toISOString().slice(0, 7); // e.g. "2026-11"

    // Fetch all users with their post view counts, followers, and earnings
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        displayName: true,
        avatarUrl: true,
        email: true,
        isVerified: true,
        createdAt: true,
        _count: {
          select: {
            followers: true,
            posts: true,
          },
        },
        posts: {
          select: {
            viewsCount: true,
          },
        },
        earnings: {
          where: {
            periodLabel: period,
          },
          select: {
            id: true,
            status: true,
            amountNaira: true,
            totalViews: true,
            totalFollowers: true,
            paidAt: true,
            paidByAdminId: true,
            periodLabel: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let totalPaidNaira = 0;
    let totalPendingNaira = 0;
    let eligibleCount = 0;

    const creators = users.map((user) => {
      const followersCount = user._count.followers;
      const postsCount = user._count.posts;
      const totalViews = user.posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);
      
      // Eligibility criteria: >= 100 followers and >= 1,000 views
      const isEligible = followersCount >= 100 && totalViews >= 1000;
      
      // Formula: ₦ (Total Views / 1000) * 200
      const calculatedAmountNaira = isEligible ? Math.floor(totalViews / 1000) * 200 : 0;

      const currentEarning = user.earnings[0] || null;
      const status: "PAID" | "PENDING" | "INELIGIBLE" = currentEarning
        ? currentEarning.status
        : isEligible
        ? "PENDING"
        : "INELIGIBLE";

      if (isEligible) {
        eligibleCount++;
        if (status === "PAID") {
          totalPaidNaira += currentEarning?.amountNaira || calculatedAmountNaira;
        } else {
          totalPendingNaira += calculatedAmountNaira;
        }
      }

      return {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        email: user.email,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        followersCount,
        postsCount,
        totalViews,
        isEligible,
        calculatedAmountNaira,
        status,
        earningRecord: currentEarning,
      };
    });

    // Apply filtering if specified
    const filteredCreators = creators.filter((c) => {
      if (filter === "eligible") return c.isEligible;
      if (filter === "pending") return c.status === "PENDING";
      if (filter === "paid") return c.status === "PAID";
      return true;
    });

    return NextResponse.json({
      summary: {
        period,
        totalCreators: users.length,
        eligibleCount,
        totalPaidNaira,
        totalPendingNaira,
      },
      creators: filteredCreators,
    });
  } catch (error: any) {
    console.error("Payouts GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch payouts", details: error.message },
      { status: 500 }
    );
  }
}
