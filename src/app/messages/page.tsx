"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Image as ImageIcon, Sparkles, Circle, ArrowLeft } from "lucide-react";
import { MOCK_CONVERSATIONS } from "@/lib/mock-data";
import { formatTimeAgo } from "@/lib/utils";

interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

export default function MessagesPage() {
  const [selectedConvId, setSelectedConvId] = useState<string>("conv-1");
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      senderId: "creator-1",
      text: "Hey Alex! Loved your new video reel. The color grading is insane! 🎬",
      time: "10:14 AM",
    },
    {
      id: "2",
      senderId: "user-me",
      text: "Thank you Elena! I spent days perfecting that Tokyo neon LUT.",
      time: "10:16 AM",
    },
    {
      id: "3",
      senderId: "creator-1",
      text: "Collab next week? We could do a duo dance-sync in Shibuya!",
      time: "10:18 AM",
    },
  ]);

  const activeConversation = MOCK_CONVERSATIONS.find((c) => c.id === selectedConvId);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      senderId: "user-me",
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setMessageText("");
  };

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-3.5rem)] md:h-screen p-0 md:p-6 pb-16 md:pb-6 flex">
      <div className="w-full h-full bg-[#121212] md:rounded-2xl border border-[#262626] overflow-hidden flex">
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 border-r border-[#262626] flex flex-col bg-black/40">
          <div className="p-4 border-b border-[#262626] flex items-center justify-between">
            <h2 className="font-extrabold text-lg text-white">Direct Messages</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FE2C55]/20 text-[#FE2C55]">
              Realtime
            </span>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {MOCK_CONVERSATIONS.map((c) => {
              const isSelected = c.id === selectedConvId;
              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedConvId(c.id)}
                  className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                    isSelected ? "bg-[#1f1f1f]" : "hover:bg-neutral-900"
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-neutral-700">
                    <Image
                      src={c.participant.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                      alt={c.participant.displayName}
                      fill
                      className="object-cover"
                    />
                    {c.participant.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white truncate">
                        {c.participant.displayName}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {formatTimeAgo(c.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {c.lastMessage?.content}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FE2C55] text-white text-[11px] font-bold flex items-center justify-center">
                      {c.unreadCount}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Area: Active Chat Window */}
        <div className="hidden md:flex flex-1 flex-col bg-[#161616]">
          {activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-black/30">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden border border-neutral-700">
                    <Image
                      src={activeConversation.participant.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200"}
                      alt={activeConversation.participant.displayName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">
                      {activeConversation.participant.displayName}
                    </h3>
                    <p className="text-[11px] text-neutral-400">
                      @{activeConversation.participant.username} •{" "}
                      {activeConversation.participant.isOnline ? "Active now" : "Offline"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 no-scrollbar">
                {messages.map((m) => {
                  const isMe = m.senderId === "user-me";
                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-gradient-to-r from-[#FE2C55] to-[#E02447] text-white rounded-br-none"
                            : "bg-[#252525] text-neutral-100 rounded-bl-none"
                        }`}
                      >
                        {m.text}
                      </div>
                      <span className="text-[10px] text-neutral-500 mt-1 px-1">
                        {m.time}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <form
                onSubmit={handleSendMessage}
                className="p-3 border-t border-[#262626] bg-black/40 flex items-center gap-3"
              >
                <button
                  type="button"
                  className="p-2 text-neutral-400 hover:text-white transition-colors"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Send a direct message..."
                  className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] rounded-full px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="p-2.5 bg-[#FE2C55] disabled:opacity-40 text-white rounded-full hover:brightness-110 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <Sparkles className="w-10 h-10 text-neutral-500 mb-3" />
              <h3 className="text-lg font-bold text-white mb-1">Your Direct Messages</h3>
              <p className="text-sm text-neutral-400 max-w-sm">
                Select a chat from the left or connect with creators on Blip.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
