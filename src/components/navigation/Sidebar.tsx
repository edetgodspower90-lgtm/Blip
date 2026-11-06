"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  PlusSquare,
  MessageCircle,
  Bell,
  User,
  Film,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export function Sidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { label: "For You", href: "/", icon: Home },
    { label: "Explore", href: "/explore", icon: Compass },
    { label: "Reels", href: "/reels", icon: Film },
    { label: "Messages", href: "/messages", icon: MessageCircle, badge: 2 },
    { label: "Notifications", href: "/notifications", icon: Bell, badge: 3 },
    { label: "Create", href: "/create", icon: PlusSquare },
    { label: "Profile", href: "/profile/alexcreator", icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-[#262626] bg-black px-4 py-6 z-50 justify-between">
      <div>
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-8 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FE2C55] via-[#FD1D1D] to-[#25F4EE] p-[2px] transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="font-extrabold text-2xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-[#FE2C55]">
            blip
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3.5 py-3 rounded-xl font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-[#181818] text-white font-semibold shadow-sm"
                    : "text-neutral-400 hover:text-white hover:bg-[#121212]"
                )}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-transform group-hover:scale-110",
                      isActive ? "text-[#FE2C55]" : "text-neutral-400 group-hover:text-white"
                    )}
                  />
                  <span className="text-[15px]">{item.label}</span>
                </div>
                {item.badge && item.badge > 0 && (
                  <span className="bg-[#FE2C55] text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Quick Create Action Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181818] to-[#121212] border border-[#262626]">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-[#25F4EE] animate-pulse" />
          <p className="text-xs font-semibold text-neutral-300">Creator Hub</p>
        </div>
        <p className="text-xs text-neutral-400 mb-3">
          Share your short clips & photos with millions of viewers.
        </p>
        <Link
          href="/create"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-[#FE2C55] to-[#E02447] hover:brightness-110 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
        >
          <PlusSquare className="w-4 h-4" />
          Upload Post
        </Link>
      </div>
    </aside>
  );
}
