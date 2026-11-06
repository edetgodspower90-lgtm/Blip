"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-black/95 backdrop-blur-md border-t border-[#262626] flex items-center justify-around px-2 z-50">
      {/* Home / Feed */}
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-colors",
          pathname === "/" ? "text-white" : "text-neutral-500"
        )}
      >
        <Home className="w-6 h-6" />
        <span className="text-[10px] mt-0.5 font-medium">Home</span>
      </Link>

      {/* Explore / Discover */}
      <Link
        href="/explore"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-colors",
          pathname === "/explore" ? "text-white" : "text-neutral-500"
        )}
      >
        <Compass className="w-6 h-6" />
        <span className="text-[10px] mt-0.5 font-medium">Discover</span>
      </Link>

      {/* Center TikTok Create (+) Button with Cyan & Pink Offset */}
      <Link href="/create" className="flex items-center justify-center px-2 group">
        <div className="relative w-11 h-7 flex items-center justify-center">
          {/* Cyan layer (left) */}
          <div className="absolute inset-0 bg-[#25F4EE] rounded-lg -translate-x-1" />
          {/* Pink/Red layer (right) */}
          <div className="absolute inset-0 bg-[#FE2C55] rounded-lg translate-x-1" />
          {/* White center layer */}
          <div className="relative w-[38px] h-[28px] bg-white rounded-lg flex items-center justify-center text-black transition-transform group-active:scale-95">
            <Plus className="w-5 h-5 stroke-[2.8]" />
          </div>
        </div>
      </Link>

      {/* Inbox / Messages */}
      <Link
        href="/messages"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 relative transition-colors",
          pathname === "/messages" ? "text-white" : "text-neutral-500"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-[10px] mt-0.5 font-medium">Inbox</span>
        <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-[#FE2C55]" />
      </Link>

      {/* Profile */}
      <Link
        href="/profile/alexcreator"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-colors",
          pathname.startsWith("/profile") ? "text-white" : "text-neutral-500"
        )}
      >
        <User className="w-6 h-6" />
        <span className="text-[10px] mt-0.5 font-medium">Profile</span>
      </Link>
    </nav>
  );
}
