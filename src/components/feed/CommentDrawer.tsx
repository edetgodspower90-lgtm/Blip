"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Heart, Send } from "lucide-react";
import { PostItem, CommentItem } from "@/types";
import { formatTimeAgo, formatCompactNumber, cn } from "@/lib/utils";

interface CommentDrawerProps {
  post: PostItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_COMMENTS: CommentItem[] = [
  {
    id: "c-1",
    postId: "post-1",
    userId: "u-1",
    user: {
      id: "u-1",
      username: "sarah_k",
      displayName: "Sarah Jenkins",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80",
    },
    content: "The lighting and choreography here is unreal! What camera did you use?",
    likesCount: 142,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "c-2",
    postId: "post-1",
    userId: "u-2",
    user: {
      id: "u-2",
      username: "david_visuals",
      displayName: "David Chen",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80",
    },
    content: "This audio match is perfection 🔥 Adding to my favorites right now.",
    likesCount: 89,
    isLiked: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "c-3",
    postId: "post-1",
    userId: "u-3",
    user: {
      id: "u-3",
      username: "mia_beats",
      displayName: "Mia Robinson",
      avatarUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80",
    },
    content: "Need the full choreography tutorial ASAP please!! 💃✨",
    likesCount: 34,
    isLiked: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

export function CommentDrawer({ post, isOpen, onClose }: CommentDrawerProps) {
  const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
  const [newCommentText, setNewCommentText] = useState("");

  if (!isOpen || !post) return null;

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      postId: post.id,
      userId: "user-me",
      user: {
        id: "user-me",
        username: "alexcreator",
        displayName: "Alex Rivera",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      },
      content: newCommentText.trim(),
      likesCount: 0,
      isLiked: false,
      createdAt: new Date().toISOString(),
    };

    setComments([newComment, ...comments]);
    setNewCommentText("");
  };

  const toggleCommentLike = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likesCount: isLiked ? c.likesCount + 1 : c.likesCount - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Sheet Modal */}
      <div className="relative w-full max-w-[480px] h-[65vh] bg-[#121212] rounded-t-3xl border-t border-[#262626] flex flex-col z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#262626]">
          <span className="text-sm font-semibold text-white">
            {comments.length} Comments
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 no-scrollbar">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3 group">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0">
                <Image
                  src={comment.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                  alt={comment.user.username}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-300">
                    @{comment.user.username}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-neutral-100 mt-0.5 leading-snug break-words">
                  {comment.content}
                </p>
                <button className="text-[11px] font-semibold text-neutral-400 hover:text-white mt-1">
                  Reply
                </button>
              </div>

              {/* Comment Heart Like */}
              <div className="flex flex-col items-center shrink-0">
                <button
                  onClick={() => toggleCommentLike(comment.id)}
                  className="p-1 text-neutral-500 hover:text-white transition-colors"
                >
                  <Heart
                    className={cn(
                      "w-4 h-4",
                      comment.isLiked
                        ? "fill-[#FE2C55] text-[#FE2C55]"
                        : "text-neutral-500"
                    )}
                  />
                </button>
                {comment.likesCount > 0 && (
                  <span className="text-[10px] text-neutral-400 font-medium">
                    {formatCompactNumber(comment.likesCount)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comment Input Footer */}
        <form
          onSubmit={handleAddComment}
          className="p-3 border-t border-[#262626] bg-[#181818] flex items-center gap-2"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-700">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"
              alt="My Avatar"
              fill
              className="object-cover"
            />
          </div>
          <input
            type="text"
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 bg-black/60 border border-neutral-800 rounded-full px-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55] transition-colors"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="p-2 bg-[#FE2C55] disabled:opacity-40 text-white rounded-full hover:brightness-110 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
