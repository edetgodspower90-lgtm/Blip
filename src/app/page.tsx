"use client";

import { useState, useRef, useEffect } from "react";
import { ReelCard } from "@/components/feed/ReelCard";
import { CommentDrawer } from "@/components/feed/CommentDrawer";
import { ShareModal } from "@/components/feed/ShareModal";
import { MOCK_POSTS } from "@/lib/mock-data";
import { PostItem } from "@/types";
import { Search, Tv } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function HomePage() {
  const [feedTab, setFeedTab] = useState<"forYou" | "following">("forYou");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedCommentPost, setSelectedCommentPost] = useState<PostItem | null>(null);
  const [selectedSharePost, setSelectedSharePost] = useState<PostItem | null>(null);
  const feedContainerRef = useRef<HTMLDivElement>(null);

  // Monitor scroll position to determine which reel is centered & active
  useEffect(() => {
    const container = feedContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const children = Array.from(container.children) as HTMLElement[];
      const containerHeight = container.clientHeight;
      const scrollTop = container.scrollTop;

      let closestIndex = 0;
      let minDistance = Infinity;

      children.forEach((child, index) => {
        const offsetTop = child.offsetTop;
        const distance = Math.abs(offsetTop - scrollTop);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  const displayedPosts = feedTab === "forYou" ? MOCK_POSTS : MOCK_POSTS.slice(0, 2);

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] md:h-screen bg-black overflow-hidden flex flex-col items-center">
      {/* Top Floating Feed Navigation Tabs ("Following" | "For You") */}
      <header className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 md:py-4 pointer-events-none">
        {/* Left Live Icon / Blip TV */}
        <div className="pointer-events-auto">
          <Link
            href="/explore"
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <Tv className="w-6 h-6" />
          </Link>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-6 pointer-events-auto">
          <button
            onClick={() => setFeedTab("following")}
            className={cn(
              "text-base transition-all font-semibold relative py-1",
              feedTab === "following"
                ? "text-white scale-105"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            Following
            {feedTab === "following" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-white rounded-full" />
            )}
          </button>

          <span className="text-neutral-600 text-sm">|</span>

          <button
            onClick={() => setFeedTab("forYou")}
            className={cn(
              "text-base transition-all font-semibold relative py-1",
              feedTab === "forYou"
                ? "text-white scale-105 font-bold"
                : "text-neutral-400 hover:text-neutral-200"
            )}
          >
            For You
            {feedTab === "forYou" && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-7 h-0.5 bg-white rounded-full" />
            )}
          </button>
        </div>

        {/* Right Search Button */}
        <div className="pointer-events-auto">
          <Link
            href="/explore"
            className="p-2 text-white/80 hover:text-white transition-colors"
          >
            <Search className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Snap Scroll Vertical Feed */}
      <div
        ref={feedContainerRef}
        className="w-full h-full snap-feed-container overflow-y-scroll no-scrollbar"
      >
        {displayedPosts.map((post, index) => (
          <div key={post.id} className="w-full h-full flex items-center justify-center">
            <ReelCard
              post={post}
              isActive={index === activeIndex}
              onOpenComments={(p) => setSelectedCommentPost(p)}
              onOpenShare={(p) => setSelectedSharePost(p)}
            />
          </div>
        ))}
      </div>

      {/* Comment Drawer Sheet */}
      <CommentDrawer
        post={selectedCommentPost}
        isOpen={Boolean(selectedCommentPost)}
        onClose={() => setSelectedCommentPost(null)}
      />

      {/* Share Modal */}
      <ShareModal
        post={selectedSharePost}
        isOpen={Boolean(selectedSharePost)}
        onClose={() => setSelectedSharePost(null)}
      />
    </div>
  );
}
