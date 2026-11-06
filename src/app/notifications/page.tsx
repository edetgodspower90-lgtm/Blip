"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageCircle, UserPlus, Bell, Check } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";
import { formatTimeAgo } from "@/lib/utils";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"ALL" | "LIKE" | "COMMENT" | "FOLLOW">("ALL");
  const [followedBack, setFollowedBack] = useState<string[]>([]);

  const filteredNotifs =
    filter === "ALL"
      ? MOCK_NOTIFICATIONS
      : MOCK_NOTIFICATIONS.filter((n) => n.type === filter);

  const handleFollowBack = (username: string) => {
    setFollowedBack((prev) => [...prev, username]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 pb-24">
      <div className="flex items-center justify-between pb-4 border-b border-[#262626] mb-6">
        <div className="flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-[#FE2C55]" />
          <h1 className="font-extrabold text-2xl text-white">Notifications</h1>
        </div>
        <button className="text-xs font-semibold text-neutral-400 hover:text-white">
          Mark all as read
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar mb-4">
        {[
          { label: "All Activity", value: "ALL" },
          { label: "Likes", value: "LIKE" },
          { label: "Comments", value: "COMMENT" },
          { label: "Followers", value: "FOLLOW" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === tab.value
                ? "bg-white text-black"
                : "bg-[#181818] text-neutral-400 hover:bg-[#222222]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifs.map((notif) => {
          const isFollowed = followedBack.includes(notif.sender.username);

          return (
            <div
              key={notif.id}
              className="flex items-center justify-between p-3.5 bg-[#141414] hover:bg-[#1a1a1a] border border-[#262626] rounded-2xl transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* User Avatar with Event Badge */}
                <div className="relative shrink-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-700">
                    <Image
                      src={notif.sender.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                      alt={notif.sender.username}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white border-2 border-black">
                    {notif.type === "LIKE" && (
                      <span className="w-full h-full bg-[#FE2C55] rounded-full flex items-center justify-center">
                        <Heart className="w-2.5 h-2.5 fill-white" />
                      </span>
                    )}
                    {notif.type === "COMMENT" && (
                      <span className="w-full h-full bg-blue-500 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-2.5 h-2.5 fill-white" />
                      </span>
                    )}
                    {notif.type === "FOLLOW" && (
                      <span className="w-full h-full bg-[#25F4EE] text-black rounded-full flex items-center justify-center">
                        <UserPlus className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Message Text */}
                <div className="min-w-0">
                  <p className="text-sm text-neutral-200 leading-snug">
                    <span className="font-bold text-white hover:underline cursor-pointer">
                      {notif.sender.displayName}
                    </span>{" "}
                    {notif.message}
                  </p>
                  <span className="text-[11px] text-neutral-500">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action Button or Post Thumbnail Preview */}
              <div className="shrink-0 ml-3">
                {notif.type === "FOLLOW" ? (
                  <button
                    onClick={() => handleFollowBack(notif.sender.username)}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isFollowed
                        ? "bg-neutral-800 text-neutral-300"
                        : "bg-[#FE2C55] hover:brightness-110 text-white"
                    }`}
                  >
                    {isFollowed ? "Following" : "Follow Back"}
                  </button>
                ) : notif.postThumbnail ? (
                  <div className="relative w-11 h-14 rounded-lg overflow-hidden border border-neutral-700">
                    <Image
                      src={notif.postThumbnail}
                      alt="Post preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
