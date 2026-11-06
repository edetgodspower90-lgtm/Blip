"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Copy, Check, MessageSquare, Send } from "lucide-react";
import { PostItem } from "@/types";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";

interface ShareModalProps {
  post: PostItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ post, isOpen, onClose }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [sentTo, setSentTo] = useState<string[]>([]);

  if (!isOpen || !post) return null;

  const handleCopyLink = () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/post/${post.id}` : "";
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendDM = (username: string) => {
    setSentTo((prev) => [...prev, username]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm bg-[#121212] border border-[#262626] rounded-2xl p-5 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
          <h3 className="font-semibold text-white text-base">Share to</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Send to Friends */}
        <div className="py-4">
          <p className="text-xs font-medium text-neutral-400 mb-3 uppercase tracking-wider">
            Send via Direct Message
          </p>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {MOCK_CONVERSATIONS.map((c) => {
              const isSent = sentTo.includes(c.participant.username);
              return (
                <div
                  key={c.id}
                  onClick={() => !isSent && handleSendDM(c.participant.username)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group min-w-[64px]"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-700 group-hover:border-white transition-colors">
                    <Image
                      src={c.participant.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                      alt={c.participant.displayName}
                      fill
                      className="object-cover"
                    />
                    {isSent && (
                      <div className="absolute inset-0 bg-[#FE2C55]/80 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-neutral-300 truncate max-w-[64px] text-center">
                    {c.participant.displayName.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-semibold">
                    {isSent ? "Sent" : "Send"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Copy Link Option */}
        <div className="pt-2">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-between px-4 py-3 bg-[#1e1e1e] hover:bg-[#282828] rounded-xl text-sm font-medium text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              {copied ? (
                <Check className="w-5 h-5 text-green-400" />
              ) : (
                <Copy className="w-5 h-5 text-neutral-400" />
              )}
              <span>{copied ? "Link Copied to Clipboard!" : "Copy Link"}</span>
            </div>
            <span className="text-xs text-neutral-500">Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
