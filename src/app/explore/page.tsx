"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Flame, Play, Heart, MessageCircle } from "lucide-react";
import { MOCK_POSTS } from "@/lib/mock-data";
import { formatCompactNumber } from "@/lib/utils";

const CATEGORIES = [
  "🔥 Trending",
  "💃 Dance & Music",
  "🍔 Food & Recipes",
  "✨ Aesthetics",
  "✈️ Travel",
  "🎮 Gaming",
  "💻 Tech & AI",
  "🎨 Art & Design",
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("🔥 Trending");

  const filteredPosts = searchQuery
    ? MOCK_POSTS.filter(
        (p) =>
          p.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : MOCK_POSTS;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-20">
      {/* Top Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search creators, hashtags, sounds, or reels..."
          className="w-full pl-12 pr-4 py-3 bg-[#181818] border border-[#262626] rounded-2xl text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55] transition-colors text-sm"
        />
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-white text-black"
                : "bg-[#181818] text-neutral-300 hover:bg-[#222222] border border-[#262626]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Header Banner */}
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-5 h-5 text-[#FE2C55]" />
        <h2 className="font-bold text-lg text-white">Popular on Blip</h2>
      </div>

      {/* Instagram 3-Column Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 md:gap-3">
        {filteredPosts.concat(filteredPosts).map((post, i) => (
          <Link
            key={`${post.id}-${i}`}
            href="/"
            className="group relative aspect-[9/16] bg-neutral-900 rounded-lg md:rounded-xl overflow-hidden cursor-pointer shadow-md"
          >
            <Image
              src={post.thumbnailUrl || post.mediaUrl}
              alt={post.caption}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />

            {/* Video badge icon */}
            {post.mediaType === "VIDEO" && (
              <div className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white">
                <Play className="w-3.5 h-3.5 fill-white" />
              </div>
            )}

            {/* Hover overlay with engagement stats */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold text-sm">
              <div className="flex items-center gap-1.5">
                <Heart className="w-5 h-5 fill-white" />
                <span>{formatCompactNumber(post.likesCount)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>{formatCompactNumber(post.commentsCount)}</span>
              </div>
            </div>

            {/* Bottom creator handle badge */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-white text-xs drop-shadow-md">
              <span className="font-semibold truncate">@{post.user.username}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
