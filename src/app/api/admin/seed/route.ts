import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    // 1. Seed demo creators
    const creators = [
      {
        id: "creator-alex",
        email: "alex@blip.social",
        username: "alexcreator",
        displayName: "Alex Rivera",
        bio: "Creator & visual designer 🎬 Exploring new horizons with Next.js & Supabase ✨",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        website: "https://blip.social/alex",
        isVerified: true,
      },
      {
        id: "creator-elena",
        email: "elena@blip.social",
        username: "elena_dance",
        displayName: "Elena Vance",
        bio: "Choreographer & dancer 💃 Living in Tokyo 🌃",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        website: "https://youtube.com/@elenadance",
        isVerified: true,
      },
      {
        id: "creator-marcus",
        email: "marcus@blip.social",
        username: "chef_marcus",
        displayName: "Chef Marcus",
        bio: "Smash burgers, sourdough, and street foods 🍔 Chef in NYC",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        website: "https://marcusrecipes.com",
        isVerified: true,
      },
      {
        id: "creator-neo",
        email: "neo@blip.social",
        username: "cyber_aesthetic",
        displayName: "Neo Studio",
        bio: "Cyberpunk visuals, 3D blender art & street tech ⚡️",
        avatarUrl:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
        website: "https://behance.net/neostudio",
        isVerified: false,
      },
      {
        id: "creator-kate",
        email: "kate@blip.social",
        username: "wander_kate",
        displayName: "Kate Travels",
        bio: "Solo adventurer & photographer 🇮🇹 Amalfi, Bali & beyond ✈️",
        avatarUrl:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
        website: "https://katetravels.blog",
        isVerified: true,
      },
    ];

    const seededUsers = [];
    for (const c of creators) {
      const user = await prisma.user.upsert({
        where: { username: c.username },
        update: {
          displayName: c.displayName,
          bio: c.bio,
          avatarUrl: c.avatarUrl,
          website: c.website,
          isVerified: c.isVerified,
        },
        create: c,
      });
      seededUsers.push(user);
    }

    // 2. Seed demo posts
    const samplePosts = [
      {
        userId: seededUsers.find((u) => u.username === "elena_dance")!.id,
        caption:
          "Midnight vibes in Tokyo 🌃 Can't stop listening to this beat! Who wants the tutorial? #tokyo #dance #reels #viral #blip",
        mediaType: "VIDEO" as const,
        mediaUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-dancing-in-a-studio-41484-large.mp4",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80",
        audioTitle: "Midnight City (Remix)",
        audioAuthor: "M83",
        tags: ["tokyo", "dance", "reels", "viral", "blip"],
        likesCount: 148200,
        commentsCount: 2314,
        sharesCount: 18400,
        viewsCount: 940000,
      },
      {
        userId: seededUsers.find((u) => u.username === "chef_marcus")!.id,
        caption:
          "The secret 60-second smash burger crust 🍔 Melted cheddar, caramelized onions and spicy mayo sauce. Try this tonight! #foodporn #burger #cooking #recipe",
        mediaType: "VIDEO" as const,
        mediaUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-chef-preparing-a-dish-43306-large.mp4",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
        audioTitle: "Cooking In Style - LoFi Chill",
        audioAuthor: "Marcus Beats",
        tags: ["foodporn", "burger", "cooking", "recipe"],
        likesCount: 89400,
        commentsCount: 945,
        sharesCount: 12400,
        viewsCount: 420000,
      },
      {
        userId: seededUsers.find((u) => u.username === "cyber_aesthetic")!.id,
        caption:
          "Futuristic street fashion photoshoot in Cyberpunk aesthetics ⚡️ Captured on 35mm lens. Swipe right for raw cuts. #cyberpunk #fashion #aesthetic #streetwear",
        mediaType: "VIDEO" as const,
        mediaUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-futuristic-young-woman-with-neon-lights-42587-large.mp4",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        audioTitle: "Cyber Synth - 2088",
        audioAuthor: "FutureSounds",
        tags: ["cyberpunk", "fashion", "aesthetic", "streetwear"],
        likesCount: 231900,
        commentsCount: 4520,
        sharesCount: 38200,
        viewsCount: 1450000,
      },
      {
        userId: seededUsers.find((u) => u.username === "wander_kate")!.id,
        caption:
          "Golden hour in Amalfi coast 🇮🇹 Nothing beats coastal Italian sunsets with freshly made gelato. Tag someone you want to take here! #amalfi #italy #travel #summer",
        mediaType: "IMAGE" as const,
        mediaUrl:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&auto=format&fit=crop&q=80",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80",
        audioTitle: "La Dolce Vita",
        audioAuthor: "Amalfi Breeze",
        tags: ["amalfi", "italy", "travel", "summer"],
        likesCount: 64200,
        commentsCount: 812,
        sharesCount: 5400,
        viewsCount: 310000,
      },
      {
        userId: seededUsers.find((u) => u.username === "alexcreator")!.id,
        caption:
          "Behind the scenes of our new visual set 🎬 Creative lighting, anamorphic glass and raw energy. What do you think? #bts #filmmaking #creator #cinematic",
        mediaType: "VIDEO" as const,
        mediaUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-photographer-taking-pictures-of-a-model-41584-large.mp4",
        thumbnailUrl:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
        audioTitle: "Cinematic Glow",
        audioAuthor: "Alex Rivera",
        tags: ["bts", "filmmaking", "creator", "cinematic"],
        likesCount: 112000,
        commentsCount: 1840,
        sharesCount: 9200,
        viewsCount: 680000,
      },
    ];

    let createdPostsCount = 0;
    for (const postData of samplePosts) {
      const existing = await prisma.post.findFirst({
        where: {
          userId: postData.userId,
          caption: postData.caption,
        },
      });

      if (!existing) {
        await prisma.post.create({
          data: postData,
        });
        createdPostsCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${seededUsers.length} creators and ${createdPostsCount} new posts into Supabase database.`,
      creatorsCount: seededUsers.length,
      postsCreated: createdPostsCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to seed database", details: error.message },
      { status: 500 }
    );
  }
}
