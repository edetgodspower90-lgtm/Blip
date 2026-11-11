import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const results: any = {
    database: { status: "unknown", latencyMs: 0 },
    storage: { status: "unknown", buckets: [], hasMediaBucket: false },
    auth: { status: "unknown", usersCount: 0 },
  };

  // 1. Check PostgreSQL Database
  const dbStart = Date.now();
  try {
    const userCount = await prisma.user.count();
    const postCount = await prisma.post.count();
    results.database = {
      status: "online",
      latencyMs: Date.now() - dbStart,
      counts: { users: userCount, posts: postCount },
    };
  } catch (err: any) {
    results.database = {
      status: "error",
      error: err.message,
      latencyMs: Date.now() - dbStart,
    };
  }

  // 2. Check Supabase Storage
  try {
    const supabase = createAdminClient();
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error) {
      results.storage = { status: "error", error: error.message };
    } else {
      const hasMedia = buckets?.some((b) => b.name === "media") || false;
      results.storage = {
        status: "online",
        buckets: buckets?.map((b) => ({ name: b.name, public: b.public })) || [],
        hasMediaBucket: hasMedia,
      };
    }
  } catch (err: any) {
    results.storage = { status: "error", error: err.message };
  }

  // 3. Check Supabase Auth
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1 });
    if (error) {
      results.auth = { status: "error", error: error.message };
    } else {
      results.auth = {
        status: "online",
        usersCount: data.users.length,
      };
    }
  } catch (err: any) {
    results.auth = { status: "error", error: err.message };
  }

  return NextResponse.json(results);
}

export async function POST() {
  // Ensure public storage bucket 'media' exists
  try {
    const supabase = createAdminClient();
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = buckets?.some((b) => b.name === "media");

    if (!exists) {
      const { data, error } = await supabase.storage.createBucket("media", {
        public: true,
        fileSizeLimit: 104857600, // 100MB
      });
      if (error) throw error;
      return NextResponse.json({
        success: true,
        message: "Public storage bucket 'media' created successfully in Supabase!",
        bucket: data,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Public storage bucket 'media' already exists and is ready.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create/ensure media bucket", details: err.message },
      { status: 500 }
    );
  }
}
