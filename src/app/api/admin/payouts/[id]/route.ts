import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/current-user";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const creatorId = params.id;
    const authUser = await getCurrentUser();

    if (authUser && !authUser.isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Super Admin access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      action = "MARK_AS_PAID",
      periodLabel = new Date().toISOString().slice(0, 7),
      amountNaira,
      totalViews,
      totalFollowers,
    } = body;

    // Verify creator exists
    const creator = await prisma.user.findUnique({
      where: { id: creatorId },
      include: {
        _count: { select: { followers: true } },
        posts: { select: { viewsCount: true } },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const calculatedViews =
      typeof totalViews === "number"
        ? totalViews
        : creator.posts.reduce((sum, p) => sum + (p.viewsCount || 0), 0);

    const calculatedFollowers =
      typeof totalFollowers === "number" ? totalFollowers : creator._count.followers;

    // Formula: ₦ (Total Views / 1000) * 200
    const finalAmount =
      typeof amountNaira === "number"
        ? amountNaira
        : Math.floor(calculatedViews / 1000) * 200;

    const newStatus = action === "MARK_AS_PAID" ? "PAID" : "PENDING";
    const paidAt = newStatus === "PAID" ? new Date() : null;
    const paidByAdminId = newStatus === "PAID" ? (authUser?.id || "super-admin") : null;

    const earning = await prisma.earning.upsert({
      where: {
        creatorId_periodLabel: {
          creatorId,
          periodLabel,
        },
      },
      create: {
        creatorId,
        periodLabel,
        totalViews: calculatedViews,
        totalFollowers: calculatedFollowers,
        amountNaira: finalAmount,
        status: newStatus,
        paidAt,
        paidByAdminId,
      },
      update: {
        status: newStatus,
        amountNaira: finalAmount,
        totalViews: calculatedViews,
        totalFollowers: calculatedFollowers,
        paidAt,
        paidByAdminId,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Creator ${creator.username} payout marked as ${newStatus}`,
      earning,
    });
  } catch (error: any) {
    console.error("Payout PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update payout status", details: error.message },
      { status: 500 }
    );
  }
}
