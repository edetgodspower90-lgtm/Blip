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
  ShieldCheck,
  DollarSign,
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
    { label: "Admin", href: "/admin", icon: ShieldCheck },
    { label: "Payouts", href: "/admin/payouts", icon: DollarSign },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 border-r border-[#8B5CF6]/10 bg-[#07080E]/85 backdrop-blur-2xl px-4 py-6 z-50 justify-between">
      <div>
        {/* Brand Logo - BLIP 2050 */}
        <Link href="/" className="flex items-center gap-3 px-3 mb-8 group">
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#6366F1] to-[#06B6D4] p-[1.5px] transition-all duration-300 group-hover:scale-105 shadow-[0_0_20px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full bg-[#07080E] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#22D3EE] transition-transform duration-300 group-hover:rotate-12" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-black text-2xl tracking-tight text-gradient-2050">
              blip
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#8B5CF6]/15 text-[#A78BFA] border border-[#8B5CF6]/25 tracking-normal">
              2050
            </span>
          </div>
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
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                  isActive
                    ? "bg-[#0F1326] text-white font-semibold border border-[#8B5CF6]/30 shadow-[0_0_15px_rgba(139,92,246,0.12)]"
                    : "text-neutral-400 hover:text-white hover:bg-[#0D101C]/80"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                      isActive
                        ? "text-[#A78BFA]"
                        : "text-neutral-400 group-hover:text-[#22D3EE]"
                    )}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && item.badge > 0 && (
                    <span className="bg-[#8B5CF6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_6px_#22D3EE]" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer: User Account & Creator Hub */}
      <div className="space-y-3">
        {/* User Account Capsule */}
        <div className="p-2.5 rounded-2xl bg-[#0D101C]/90 border border-[#8B5CF6]/15 hover:border-[#8B5CF6]/30 transition-all shadow-sm">
          <Link
            href="/login"
            className="flex items-center gap-3 w-full hover:opacity-95 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#06B6D4] p-[1.5px] flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#07080E] rounded-full flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-neutral-300" />
              </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-xs font-bold text-white truncate">Sign In / Account</p>
              <p className="text-[10px] text-neutral-400 truncate">Creator Network 2050</p>
            </div>
          </Link>
        </div>

        {/* Creator Hub Action Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#0F1326] to-[#0A0D18] border border-[#8B5CF6]/15 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE] animate-pulse" />
              <p className="text-xs font-bold text-neutral-200">Creator Studio</p>
            </div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-[#A78BFA] bg-[#8B5CF6]/10 px-1.5 py-0.5 rounded border border-[#8B5CF6]/20">
              Monetized
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
            Publish next-gen reels and receive automated disbursements.
          </p>
          <Link
            href="/create"
            className="flex items-center justify-center gap-2 w-full py-2 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#06B6D4] hover:brightness-110 text-white rounded-xl font-bold text-xs shadow-md shadow-violet-950/40 transition-all active:scale-[0.98]"
          >
            <PlusSquare className="w-4 h-4" />
            Upload Reel
          </Link>
        </div>
      </div>
    </aside>
  );
}
