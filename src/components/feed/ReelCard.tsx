"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Volume2,
  VolumeX,
  Play,
  Music,
  CheckCircle,
  Plus,
} from "lucide-react";
import { PostItem } from "@/types";
import { formatCompactNumber, cn } from "@/lib/utils";

interface ReelCardProps {
  post: PostItem;
  isActive: boolean;
  onOpenComments: (post: PostItem) => void;
  onOpenShare: (post: PostItem) => void;
}

export function ReelCard({
  post,
  isActive,
  onOpenComments,
  onOpenShare,
}: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked ?? false);
  const [likesCount, setLikesCount] = useState<number>(post.likesCount);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(post.isBookmarked ?? false);
  const [bookmarksCount, setBookmarksCount] = useState<number>(1420);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);
  const [heartBurstPos, setHeartBurstPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isExpandedCaption, setIsExpandedCaption] = useState<boolean>(false);

  // Play / Pause video based on viewport activity
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };

  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHeartBurstPos({ x, y });
    setShowHeartBurst(true);

    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setShowHeartBurst(false);
    }, 800);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isBookmarked) {
      setIsBookmarked(false);
      setBookmarksCount((prev) => prev - 1);
    } else {
      setIsBookmarked(true);
      setBookmarksCount((prev) => prev + 1);
    }
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(true);
  };

  return (
    <div className="relative w-full h-[calc(100vh-3.5rem)] md:h-[calc(100vh-2rem)] max-w-[480px] mx-auto rounded-none md:rounded-2xl overflow-hidden bg-black select-none snap-feed-item flex items-center justify-center">
      {/* Video or Image Container */}
      <div
        className="relative w-full h-full cursor-pointer flex items-center justify-center bg-neutral-900"
        onClick={togglePlay}
        onDoubleClick={handleDoubleTap}
      >
        {post.mediaType === "VIDEO" ? (
          <video
            ref={videoRef}
            src={post.mediaUrl}
            poster={post.thumbnailUrl}
            loop
            playsInline
            muted={isMuted}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            <Image
              src={post.mediaUrl}
              alt={post.caption || "Blip post"}
              fill
              className="object-cover"
              priority={isActive}
            />
          </div>
        )}

        {/* Center Play Icon Indicator when paused */}
        {!isPlaying && post.mediaType === "VIDEO" && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/20">
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
              <Play className="w-8 h-8 fill-white translate-x-0.5" />
            </div>
          </div>
        )}

        {/* Floating Heart Burst Animation on Double Click */}
        {showHeartBurst && (
          <div
            className="absolute pointer-events-none z-40 animate-heart-burst"
            style={{ left: heartBurstPos.x - 40, top: heartBurstPos.y - 40 }}
          >
            <Heart className="w-24 h-24 text-[#FE2C55] fill-[#FE2C55] filter drop-shadow-lg" />
          </div>
        )}

        {/* Sound Toggle (Top Right) */}
        {post.mediaType === "VIDEO" && (
          <button
            onClick={toggleMute}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-all"
            aria-label="Toggle Mute"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
        )}

        {/* Dark Vignette Gradients for Text Readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent to-black/85" />
      </div>

      {/* Right-Side Floating Actions Bar */}
      <div className="absolute right-3 bottom-20 md:bottom-12 flex flex-col items-center gap-5 z-30">
        {/* Creator Avatar & Follow Button */}
        <div className="relative mb-2">
          <Link
            href={`/profile/${post.user.username}`}
            className="block w-12 h-12 rounded-full border-2 border-white overflow-hidden relative shadow-md transition-transform hover:scale-105"
          >
            <Image
              src={post.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
              alt={post.user.username}
              fill
              className="object-cover"
            />
          </Link>
          {!isFollowing && (
            <button
              onClick={handleFollow}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#FE2C55] rounded-full flex items-center justify-center text-white shadow-md hover:scale-110 active:scale-90 transition-transform"
              title="Follow"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </button>
          )}
        </div>

        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className="p-2 transition-transform active:scale-75 group"
            aria-label="Like"
          >
            <Heart
              className={cn(
                "w-8 h-8 transition-colors drop-shadow-md",
                isLiked
                  ? "fill-[#FE2C55] text-[#FE2C55]"
                  : "text-white group-hover:text-red-400"
              )}
            />
          </button>
          <span className="text-white text-xs font-semibold text-shadow-sm">
            {formatCompactNumber(likesCount)}
          </span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments(post);
            }}
            className="p-2 transition-transform active:scale-75 group"
            aria-label="Comments"
          >
            <MessageCircle className="w-8 h-8 text-white drop-shadow-md group-hover:text-neutral-200" />
          </button>
          <span className="text-white text-xs font-semibold text-shadow-sm">
            {formatCompactNumber(post.commentsCount)}
          </span>
        </div>

        {/* Bookmark / Save Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleBookmark}
            className="p-2 transition-transform active:scale-75 group"
            aria-label="Bookmark"
          >
            <Bookmark
              className={cn(
                "w-8 h-8 transition-colors drop-shadow-md",
                isBookmarked
                  ? "fill-[#FD1D1D] text-[#FD1D1D]"
                  : "text-white group-hover:text-yellow-400"
              )}
            />
          </button>
          <span className="text-white text-xs font-semibold text-shadow-sm">
            {formatCompactNumber(bookmarksCount)}
          </span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenShare(post);
            }}
            className="p-2 transition-transform active:scale-75 group"
            aria-label="Share"
          >
            <Share2 className="w-8 h-8 text-white drop-shadow-md group-hover:text-neutral-200" />
          </button>
          <span className="text-white text-xs font-semibold text-shadow-sm">
            {formatCompactNumber(post.sharesCount)}
          </span>
        </div>

        {/* Rotating Vinyl Record for Audio */}
        <div className="mt-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neutral-800 to-neutral-900 border-2 border-neutral-700 flex items-center justify-center p-1.5 animate-spin-slow shadow-xl">
            <div className="w-full h-full rounded-full bg-[#181818] flex items-center justify-center overflow-hidden relative">
              <Image
                src={post.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"}
                alt="Vinyl record"
                fill
                className="object-cover opacity-80"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content Overlay (Caption, Audio, Creator Info) */}
      <div className="absolute left-0 bottom-4 right-16 px-4 z-20 pointer-events-auto">
        {/* Creator Name */}
        <Link
          href={`/profile/${post.user.username}`}
          className="inline-flex items-center gap-1.5 font-bold text-base text-white hover:underline drop-shadow-md mb-2"
        >
          <span>@{post.user.username}</span>
          {post.user.isVerified && (
            <CheckCircle className="w-4 h-4 text-[#25F4EE] fill-[#25F4EE]/20" />
          )}
        </Link>

        {/* Caption */}
        <div className="text-sm text-neutral-100 drop-shadow-md mb-3 leading-relaxed">
          <p className={cn(!isExpandedCaption && "line-clamp-2")}>
            {post.caption}
          </p>
          {post.caption.length > 70 && (
            <button
              onClick={() => setIsExpandedCaption(!isExpandedCaption)}
              className="text-neutral-400 font-semibold hover:text-white text-xs mt-0.5 ml-1 inline-block"
            >
              {isExpandedCaption ? "less" : "more"}
            </button>
          )}
        </div>

        {/* Audio Marquee */}
        <div className="flex items-center gap-2 text-xs text-neutral-200 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full w-fit max-w-[260px] truncate border border-white/10">
          <Music className="w-3.5 h-3.5 shrink-0 text-[#25F4EE]" />
          <span className="truncate">
            {post.audioTitle} • {post.audioAuthor}
          </span>
        </div>
      </div>
    </div>
  );
}
