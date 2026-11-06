"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Link as LinkIcon,
  Grid,
  Film,
  Bookmark,
  Heart,
  Settings,
  Share2,
  Play,
} from "lucide-react";
import { MOCK_CURRENT_USER, MOCK_POSTS } from "@/lib/mock-data";
import { formatCompactNumber, cn } from "@/lib/utils";

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const [activeTab, setActiveTab] = useState<"reels" | "grid" | "saved" | "liked">("reels");
  const [isFollowing, setIsFollowing] = useState(false);
  const user = MOCK_CURRENT_USER;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 pb-24">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10 pb-8 border-b border-[#262626]">
        {/* Avatar with TikTok/Instagram gradient halo ring */}
        <div className="relative p-1 rounded-full bg-gradient-to-tr from-[#FE2C55] via-[#FD1D1D] to-[#25F4EE]">
          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-black">
            <Image
              src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400"}
              alt={user.displayName}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* User Info & Actions */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <h1 className="text-xl md:text-2xl font-black text-white">
                @{user.username}
              </h1>
              {user.isVerified && (
                <CheckCircle className="w-5 h-5 text-[#25F4EE] fill-[#25F4EE]/20" />
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-center gap-2 mt-2 md:mt-0">
              <button
                onClick={() => setIsFollowing(!isFollowing)}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-bold transition-all",
                  isFollowing
                    ? "bg-neutral-800 text-white hover:bg-neutral-700"
                    : "bg-[#FE2C55] hover:brightness-110 text-white"
                )}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
              <Link
                href="/messages"
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-xs font-bold text-white transition-colors"
              >
                Message
              </Link>
              <button className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Social Stats Counters */}
          <div className="flex items-center justify-center md:justify-start gap-8 mb-4">
            <div className="text-center md:text-left">
              <span className="font-extrabold text-white text-base md:text-lg">
                {formatCompactNumber(user.followingCount)}
              </span>
              <span className="text-xs text-neutral-400 block">Following</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-extrabold text-white text-base md:text-lg">
                {formatCompactNumber(user.followersCount)}
              </span>
              <span className="text-xs text-neutral-400 block">Followers</span>
            </div>
            <div className="text-center md:text-left">
              <span className="font-extrabold text-white text-base md:text-lg">
                {formatCompactNumber(user.likesCount)}
              </span>
              <span className="text-xs text-neutral-400 block">Likes</span>
            </div>
          </div>

          {/* Bio & Links */}
          <div className="text-sm text-neutral-200 leading-relaxed max-w-lg mb-2">
            <p className="font-semibold text-white mb-0.5">{user.displayName}</p>
            <p>{user.bio}</p>
          </div>

          {user.website && (
            <a
              href={user.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#25F4EE] hover:underline"
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>{user.website.replace("https://", "")}</span>
            </a>
          )}
        </div>
      </div>

      {/* Tabs (Reels, Posts Grid, Saved, Liked) */}
      <div className="flex items-center justify-around border-b border-[#262626] my-6">
        <button
          onClick={() => setActiveTab("reels")}
          className={cn(
            "flex items-center gap-2 py-3 px-4 font-semibold text-sm transition-all border-b-2",
            activeTab === "reels"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <Film className="w-4 h-4" />
          <span>Reels</span>
        </button>

        <button
          onClick={() => setActiveTab("grid")}
          className={cn(
            "flex items-center gap-2 py-3 px-4 font-semibold text-sm transition-all border-b-2",
            activeTab === "grid"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <Grid className="w-4 h-4" />
          <span>Posts</span>
        </button>

        <button
          onClick={() => setActiveTab("saved")}
          className={cn(
            "flex items-center gap-2 py-3 px-4 font-semibold text-sm transition-all border-b-2",
            activeTab === "saved"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved</span>
        </button>

        <button
          onClick={() => setActiveTab("liked")}
          className={cn(
            "flex items-center gap-2 py-3 px-4 font-semibold text-sm transition-all border-b-2",
            activeTab === "liked"
              ? "border-white text-white"
              : "border-transparent text-neutral-500 hover:text-neutral-300"
          )}
        >
          <Heart className="w-4 h-4" />
          <span>Liked</span>
        </button>
      </div>

      {/* Media Grid Display */}
      <div className="grid grid-cols-3 gap-1 md:gap-3">
        {MOCK_POSTS.map((post) => (
          <Link
            key={post.id}
            href="/"
            className="group relative aspect-[9/16] bg-neutral-900 rounded-md md:rounded-xl overflow-hidden cursor-pointer"
          >
            <Image
              src={post.thumbnailUrl || post.mediaUrl}
              alt={post.caption}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* View count tag at bottom left */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs font-semibold drop-shadow-md">
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{formatCompactNumber(post.viewsCount)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
