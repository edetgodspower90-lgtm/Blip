"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#07080E]/90 backdrop-blur-2xl border-t border-[#8B5CF6]/15 flex items-center justify-around px-2 z-50 shadow-[0_-4px_25px_rgba(0,0,0,0.5)]">
      {/* Home / Feed */}
      <Link
        href="/"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200",
          pathname === "/" ? "text-[#A78BFA]" : "text-neutral-500 hover:text-neutral-300"
        )}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Feed</span>
        {pathname === "/" && (
          <span className="w-1 h-1 rounded-full bg-[#22D3EE] mt-0.5 shadow-[0_0_4px_#22D3EE]" />
        )}
      </Link>

      {/* Explore / Discover */}
      <Link
        href="/explore"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200",
          pathname === "/explore" ? "text-[#A78BFA]" : "text-neutral-500 hover:text-neutral-300"
        )}
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Explore</span>
        {pathname === "/explore" && (
          <span className="w-1 h-1 rounded-full bg-[#22D3EE] mt-0.5 shadow-[0_0_4px_#22D3EE]" />
        )}
      </Link>

      {/* Center BLIP 2050 Illuminated Create (+) Action */}
      <Link
        href="/create"
        className="flex items-center justify-center px-2 group active:scale-95 transition-transform"
      >
        <div className="relative w-12 h-8 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#06B6D4] p-[1.5px] shadow-[0_0_18px_rgba(139,92,246,0.4)]">
          <div className="w-full h-full bg-[#07080E] rounded-full flex items-center justify-center group-hover:bg-transparent transition-colors">
            <Plus className="w-5 h-5 text-white stroke-[2.6]" />
          </div>
        </div>
      </Link>

      {/* Inbox / Messages */}
      <Link
        href="/messages"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 relative transition-all duration-200",
          pathname === "/messages" ? "text-[#A78BFA]" : "text-neutral-500 hover:text-neutral-300"
        )}
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_6px_#8B5CF6]" />
        </div>
        <span className="text-[10px] mt-0.5 font-medium">Inbox</span>
        {pathname === "/messages" && (
          <span className="w-1 h-1 rounded-full bg-[#22D3EE] mt-0.5 shadow-[0_0_4px_#22D3EE]" />
        )}
      </Link>

      {/* Profile */}
      <Link
        href="/profile/alexcreator"
        className={cn(
          "flex flex-col items-center justify-center py-1 flex-1 transition-all duration-200",
          pathname.startsWith("/profile") ? "text-[#A78BFA]" : "text-neutral-500 hover:text-neutral-300"
        )}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5 font-medium">Profile</span>
        {pathname.startsWith("/profile") && (
          <span className="w-1 h-1 rounded-full bg-[#22D3EE] mt-0.5 shadow-[0_0_4px_#22D3EE]" />
        )}
      </Link>
    </nav>
  );
}
