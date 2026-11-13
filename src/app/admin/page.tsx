"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Film,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Trash2,
  Plus,
  Search,
  RefreshCw,
  Database,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Play,
  Image as ImageIcon,
  Share2,
  Server,
  Layers,
  Activity,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsMetrics {
  totalUsers: number;
  verifiedUsers: number;
  totalPosts: number;
  videoPosts: number;
  imagePosts: number;
  totalComments: number;
  totalLikes: number;
  totalBookmarks: number;
  totalViews: number;
  totalEngagementLikes: number;
  totalEngagementShares: number;
  totalPaidEarnings?: number;
}

interface AdminUser {
  id: string;
  username: string;
  displayName: string | null;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  website: string | null;
  isVerified: boolean;
  createdAt: string;
  _count: {
    posts: number;
    followers: number;
    following: number;
    likes: number;
  };
}

interface AdminPost {
  id: string;
  userId: string;
  caption: string | null;
  mediaType: "VIDEO" | "IMAGE";
  mediaUrl: string;
  thumbnailUrl: string | null;
  audioTitle: string | null;
  audioAuthor: string | null;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
    isVerified: boolean;
  };
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "posts" | "database">("overview");
  const [metrics, setMetrics] = useState<StatsMetrics | null>(null);
  const [health, setHealth] = useState<{ status: string; latencyMs: number; database: string } | null>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Users tab state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userVerifiedFilter, setUserVerifiedFilter] = useState<string>("all");
  const [usersLoading, setUsersLoading] = useState(false);

  // Posts tab state
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [postSearch, setPostSearch] = useState("");
  const [postTypeFilter, setPostTypeFilter] = useState<string>("all");
  const [postsLoading, setPostsLoading] = useState(false);

  // Actions state
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Create User modal
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [newUserData, setNewUserData] = useState({
    username: "",
    email: "",
    displayName: "",
    bio: "",
    isVerified: true,
  });
  const [creatingUser, setCreatingUser] = useState(false);

  // Toast auto-clear
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Fetch Stats Overview
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (res.ok) {
        setMetrics(data.metrics);
        setHealth(data.health);
        setRecentUsers(data.recentUsers || []);
        setRecentPosts(data.recentPosts || []);
      }
    } catch (err: any) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      let url = `/api/admin/users?q=${encodeURIComponent(userSearch)}`;
      if (userVerifiedFilter !== "all") {
        url += `&verified=${userVerifiedFilter === "verified" ? "true" : "false"}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err: any) {
      console.error("Failed to load users:", err);
    } finally {
      setUsersLoading(false);
    }
  }, [userSearch, userVerifiedFilter]);

  // Fetch Posts
  const fetchPosts = useCallback(async () => {
    try {
      setPostsLoading(true);
      let url = `/api/admin/posts?q=${encodeURIComponent(postSearch)}`;
      if (postTypeFilter !== "all") {
        url += `&type=${postTypeFilter.toUpperCase()}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (err: any) {
      console.error("Failed to load posts:", err);
    } finally {
      setPostsLoading(false);
    }
  }, [postSearch, postTypeFilter]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else if (activeTab === "posts") {
      fetchPosts();
    }
  }, [activeTab, fetchUsers, fetchPosts]);

  // Toggle user verified badge
  const handleToggleVerified = async (user: AdminUser) => {
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isVerified: !user.isVerified }),
      });
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isVerified: !u.isVerified } : u))
        );
        setNotification({
          type: "success",
          message: `@${user.username} verification status updated to ${!user.isVerified ? "Verified" : "Unverified"}.`,
        });
        fetchStats();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to update verification." });
    }
  };

  // Delete user
  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(`Are you sure you want to delete user @${user.username}? This cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id));
        setNotification({
          type: "success",
          message: `User @${user.username} deleted.`,
        });
        fetchStats();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to delete user." });
    }
  };

  // Delete post
  const handleDeletePost = async (post: AdminPost) => {
    if (!confirm("Are you sure you want to delete this post?")) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
        setNotification({
          type: "success",
          message: "Post removed from platform.",
        });
        fetchStats();
      }
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to delete post." });
    }
  };

  // Create User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserData.username || !newUserData.email) return;

    try {
      setCreatingUser(true);
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserData),
      });
      const data = await res.json();
      if (res.ok) {
        setNotification({
          type: "success",
          message: `Creator @${data.username} created successfully!`,
        });
        setShowCreateUser(false);
        setNewUserData({ username: "", email: "", displayName: "", bio: "", isVerified: true });
        fetchUsers();
        fetchStats();
      } else {
        setNotification({ type: "error", message: data.error || "Failed to create user" });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message });
    } finally {
      setCreatingUser(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-6">
      {/* Toast Notification */}
      {notification && (
        <div
          className={cn(
            "fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border transition-all animate-in slide-in-from-bottom-3",
            notification.type === "success"
              ? "bg-[#0f2418] border-emerald-500/40 text-emerald-300"
              : "bg-[#291212] border-rose-500/40 text-rose-300"
          )}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-400" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#A855F7] via-[#6366F1] to-[#06B6D4] p-[2px]">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#00FF88]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-white">Admin Control Center</h1>
              <span className="bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,255,136,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-pulse" />
                Live Supabase DB
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Super Admin management, real creator metrics, content moderation &amp; automated disbursements.
            </p>
          </div>
        </div>

        {/* Global Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/payouts"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#00FF88]/10 hover:bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] rounded-xl text-sm font-bold shadow-[0_0_15px_rgba(0,255,136,0.18)] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
          >
            <Sparkles className="w-4 h-4 text-[#00FF88]" />
            <span>Creator Payouts</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00FF88] text-black font-extrabold uppercase">
              ₦ Payouts
            </span>
          </Link>

          <button
            onClick={() => {
              fetchStats();
              if (activeTab === "users") fetchUsers();
              if (activeTab === "posts") fetchPosts();
            }}
            disabled={loading}
            className="p-2.5 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] rounded-xl text-neutral-300 hover:text-white transition-colors"
            title="Refresh statistics"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-[#00FF88]")} />
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#121212] hover:bg-[#1A1A1A] border border-[#262626] text-neutral-200 hover:text-white rounded-xl text-sm font-semibold transition-colors"
          >
            <span>View App</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1F1F1F] pb-1 overflow-x-auto">
        <Link
          href="/admin/payouts"
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 hover:bg-[#00FF88]/20 transition-all shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.1)]"
        >
          <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
          Creator Payouts (₦)
        </Link>
        <button
          onClick={() => setActiveTab("overview")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
            activeTab === "overview"
              ? "bg-[#1f1f1f] text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-[#121212]"
          )}
        >
          <Activity className="w-4 h-4 text-[#FE2C55]" />
          Overview & Metrics
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
            activeTab === "users"
              ? "bg-[#1f1f1f] text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-[#121212]"
          )}
        >
          <Users className="w-4 h-4 text-[#25F4EE]" />
          Users & Creators
          {metrics && (
            <span className="ml-1 px-1.5 py-0.5 bg-neutral-800 text-[11px] rounded-full text-neutral-300">
              {metrics.totalUsers}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
            activeTab === "posts"
              ? "bg-[#1f1f1f] text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-[#121212]"
          )}
        >
          <Film className="w-4 h-4 text-purple-400" />
          Reels & Posts
          {metrics && (
            <span className="ml-1 px-1.5 py-0.5 bg-neutral-800 text-[11px] rounded-full text-neutral-300">
              {metrics.totalPosts}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("database")}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors",
            activeTab === "database"
              ? "bg-[#1f1f1f] text-white shadow-sm"
              : "text-neutral-400 hover:text-white hover:bg-[#121212]"
          )}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          Database & System
        </button>
      </div>

      {/* TAB 1: OVERVIEW & METRICS */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Creator Payouts Card */}
            <Link
              href="/admin/payouts"
              className="p-5 rounded-2xl bg-[#080808] border border-[#00FF88]/40 shadow-[0_0_20px_rgba(0,255,136,0.12)] relative overflow-hidden group hover:border-[#00FF88] transition-all block"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00FF88]">
                  Total Disbursed
                </span>
                <div className="p-2 rounded-xl bg-[#00FF88]/15 text-[#00FF88]">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <div className="text-2xl font-black tracking-tight text-[#00FF88]">
                ₦{metrics?.totalPaidEarnings ? metrics.totalPaidEarnings.toLocaleString() : "0"}
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-neutral-400">
                <span className="text-[#00FF88] font-semibold group-hover:underline">Payouts Hub →</span>
                <span className="text-[10px] text-neutral-500 font-mono">₦200/1K views</span>
              </div>
            </Link>
            {/* Users Card */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Total Users
                </span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold tracking-tight">
                {metrics ? metrics.totalUsers.toLocaleString() : "..."}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  <strong className="text-white">{metrics?.verifiedUsers || 0}</strong> verified creators
                </span>
              </div>
            </div>

            {/* Posts & Reels Card */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Total Posts & Reels
                </span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Film className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold tracking-tight">
                {metrics ? metrics.totalPosts.toLocaleString() : "..."}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <span>
                  {metrics?.videoPosts || 0} videos · {metrics?.imagePosts || 0} images
                </span>
              </div>
            </div>

            {/* Impressions / Views Card */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Total Video Views
                </span>
                <div className="p-2 rounded-xl bg-[#25F4EE]/10 text-[#25F4EE]">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-[#25F4EE]">
                {metrics ? metrics.totalViews.toLocaleString() : "..."}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Across all creator channels</span>
              </div>
            </div>

            {/* Total Engagements */}
            <div className="p-5 rounded-2xl bg-[#121212] border border-[#262626] relative overflow-hidden group hover:border-neutral-700 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Total Engagements
                </span>
                <div className="p-2 rounded-xl bg-[#FE2C55]/10 text-[#FE2C55]">
                  <Heart className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-[#FE2C55]">
                {metrics ? metrics.totalEngagementLikes.toLocaleString() : "..."}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-neutral-400">
                <MessageCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span>{metrics?.totalComments.toLocaleString() || 0} comments recorded</span>
              </div>
            </div>
          </div>

          {/* Database Health Card */}
          <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>Supabase PostgreSQL Cluster</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300">
                    Online
                  </span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Connected via AWS eu-central-1 pooler (Port 5432 & 6543) · Latency:{" "}
                  <strong className="text-white">{health?.latencyMs || 0}ms</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {metrics && metrics.totalUsers === 0 && (
                <div className="text-xs text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                  <span>Database ready. Real creator registrations will appear in real time.</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Previews: Recent Users and Recent Posts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Latest Creators
                </h3>
                <button
                  onClick={() => setActiveTab("users")}
                  className="text-xs text-[#25F4EE] hover:underline"
                >
                  View all ({metrics?.totalUsers || 0})
                </button>
              </div>

              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  No creators found yet. Real users will appear here after registering on Blip.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-neutral-850 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                          alt={u.username}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-700"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-sm">{u.displayName || u.username}</span>
                            {u.isVerified && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                            )}
                          </div>
                          <span className="text-xs text-neutral-400">@{u.username}</span>
                        </div>
                      </div>
                      <Link
                        href={`/profile/${u.username}`}
                        className="text-xs px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                      >
                        Profile
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Posts */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Film className="w-4 h-4 text-purple-400" />
                  Recent Reels & Uploads
                </h3>
                <button
                  onClick={() => setActiveTab("posts")}
                  className="text-xs text-[#25F4EE] hover:underline"
                >
                  View all ({metrics?.totalPosts || 0})
                </button>
              </div>

              {recentPosts.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                  No posts published yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPosts.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#181818] border border-neutral-850 hover:border-neutral-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-black overflow-hidden flex-shrink-0 relative border border-neutral-800">
                          {p.thumbnailUrl || p.mediaUrl ? (
                            <img
                              src={p.thumbnailUrl || p.mediaUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                          <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[9px] px-1 rounded font-bold uppercase">
                            {p.mediaType === "VIDEO" ? "reel" : "img"}
                          </span>
                        </div>
                        <div className="max-w-[220px] sm:max-w-xs">
                          <p className="text-xs font-medium text-neutral-200 line-clamp-1">
                            {p.caption || "No caption provided"}
                          </p>
                          <span className="text-[11px] text-neutral-400">
                            by @{p.user?.username || "creator"} · {p.viewsCount?.toLocaleString() || 0} views
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 text-[#FE2C55]" />
                          {p.likesCount?.toLocaleString() || 0}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USERS & CREATORS */}
      {activeTab === "users" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by username, display name, email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Filter */}
              <select
                value={userVerifiedFilter}
                onChange={(e) => setUserVerifiedFilter(e.target.value)}
                className="bg-[#121212] border border-[#262626] rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>

            <button
              onClick={() => setShowCreateUser(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FE2C55] to-[#E02447] text-white rounded-xl text-sm font-semibold hover:brightness-110 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Creator
            </button>
          </div>

          {/* Users Table */}
          <div className="rounded-2xl bg-[#121212] border border-[#262626] overflow-hidden">
            {usersLoading ? (
              <div className="p-12 text-center text-neutral-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-[#25F4EE]" />
                <span>Loading creators...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-neutral-400 text-sm">No creators found matching your criteria.</p>
                <p className="text-xs text-neutral-500">New creators will appear here as they register.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#181818] border-b border-[#262626] text-xs uppercase font-semibold text-neutral-400">
                    <tr>
                      <th className="px-4 py-3">Creator</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Verified Badge</th>
                      <th className="px-4 py-3 text-center">Posts</th>
                      <th className="px-4 py-3 text-center">Followers</th>
                      <th className="px-4 py-3">Joined Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#161616] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"}
                              alt={u.username}
                              className="w-9 h-9 rounded-full object-cover border border-neutral-700"
                            />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1">
                                {u.displayName || u.username}
                                {u.isVerified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400/20" />
                                )}
                              </div>
                              <span className="text-xs text-neutral-400">@{u.username}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-neutral-300 text-xs font-mono">{u.email}</td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleVerified(u)}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1",
                              u.isVerified
                                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/30"
                                : "bg-neutral-800 text-neutral-400 hover:bg-blue-500/20 hover:text-blue-300"
                            )}
                            title="Click to toggle verified badge"
                          >
                            {u.isVerified ? (
                              <>
                                <Check className="w-3 h-3" />
                                Verified
                              </>
                            ) : (
                              "Not Verified"
                            )}
                          </button>
                        </td>

                        <td className="px-4 py-3 text-center font-medium">
                          {u._count.posts}
                        </td>

                        <td className="px-4 py-3 text-center font-medium text-neutral-300">
                          {u._count.followers}
                        </td>

                        <td className="px-4 py-3 text-xs text-neutral-400">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/profile/${u.username}`}
                              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                              title="View Public Profile"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-500/10"
                              title="Delete User"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CONTENT / REELS MODERATION */}
      {activeTab === "posts" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search caption or author..."
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              {/* Type Filter */}
              <select
                value={postTypeFilter}
                onChange={(e) => setPostTypeFilter(e.target.value)}
                className="bg-[#121212] border border-[#262626] rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="all">All Formats</option>
                <option value="video">Videos / Reels Only</option>
                <option value="image">Images Only</option>
              </select>
            </div>

            <span className="text-xs text-neutral-400">
              Showing {posts.length} published reels & posts
            </span>
          </div>

          {/* Posts Grid / Table */}
          <div className="rounded-2xl bg-[#121212] border border-[#262626] overflow-hidden">
            {postsLoading ? (
              <div className="p-12 text-center text-neutral-400 flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-purple-400" />
                <span>Loading posts...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Film className="w-10 h-10 text-neutral-600 mx-auto" />
                <p className="text-neutral-400 text-sm">No posts or reels published yet.</p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 text-xs px-3.5 py-2 bg-gradient-to-r from-[#A855F7] to-[#06B6D4] text-white font-bold rounded-xl hover:brightness-110"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Upload First Reel
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#181818] border-b border-[#262626] text-xs uppercase font-semibold text-neutral-400">
                    <tr>
                      <th className="px-4 py-3">Media</th>
                      <th className="px-4 py-3">Creator</th>
                      <th className="px-4 py-3">Caption & Tags</th>
                      <th className="px-4 py-3 text-center">Format</th>
                      <th className="px-4 py-3 text-center">Views</th>
                      <th className="px-4 py-3 text-center">Likes</th>
                      <th className="px-4 py-3 text-center">Comments</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Moderation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1f1f1f]">
                    {posts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#161616] transition-colors">
                        <td className="px-4 py-3">
                          <a
                            href={p.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-14 h-16 rounded-xl overflow-hidden bg-black relative group border border-neutral-800"
                          >
                            {p.thumbnailUrl || p.mediaUrl ? (
                              <img
                                src={p.thumbnailUrl || p.mediaUrl}
                                alt=""
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Film className="w-5 h-5 text-neutral-600" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <ExternalLink className="w-3.5 h-3.5 text-white" />
                            </div>
                          </a>
                        </td>

                        <td className="px-4 py-3">
                          <div className="font-semibold text-white">
                            {p.user?.displayName || p.user?.username || "Unknown"}
                          </div>
                          <span className="text-xs text-neutral-400">@{p.user?.username}</span>
                        </td>

                        <td className="px-4 py-3 max-w-xs">
                          <p className="text-xs text-neutral-200 line-clamp-2">
                            {p.caption || "No caption"}
                          </p>
                          {p.tags && p.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                              p.mediaType === "VIDEO"
                                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            )}
                          >
                            {p.mediaType}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-center font-mono text-xs text-[#25F4EE]">
                          {p.viewsCount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-center font-mono text-xs text-[#FE2C55]">
                          {p.likesCount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-center font-mono text-xs text-neutral-300">
                          {p.commentsCount.toLocaleString()}
                        </td>

                        <td className="px-4 py-3 text-xs text-neutral-400">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>

                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeletePost(p)}
                            className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete Post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: DATABASE & SYSTEM */}
      {activeTab === "database" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Supabase Connection */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Supabase Database & Pooling</h3>
                  <p className="text-xs text-neutral-400">PostgreSQL instance connected</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400">Project Reference:</span>
                  <span className="text-emerald-400">gqmemokpvafikrkyqpai</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400">Direct Pooler (Migrations):</span>
                  <span className="text-neutral-200">aws-0-eu-central-1 (Port 5432)</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400">Supavisor Transaction Pooler:</span>
                  <span className="text-neutral-200">Port 6543 (pgbouncer=true)</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400">Prisma Client ORM:</span>
                  <span className="text-purple-400">v5.22.0 (Active)</span>
                </div>
              </div>
            </div>

            {/* Storage & Environment */}
            <div className="p-6 rounded-2xl bg-[#121212] border border-[#262626] space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400">
                  <Server className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Storage & Media Bucket</h3>
                  <p className="text-xs text-neutral-400">Supabase Media Storage</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Bucket Target:</span>
                  <span className="text-white font-mono font-bold">media (Public)</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Next.js Framework:</span>
                  <span className="text-white font-mono font-bold">v14.2 (App Router)</span>
                </div>
                <div className="p-3 rounded-xl bg-black border border-neutral-850 flex items-center justify-between">
                  <span className="text-neutral-400 font-mono">Node.js Runtime:</span>
                  <span className="text-emerald-400 font-mono font-bold">v20.20.2 LTS</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/admin/payouts"
                  className="w-full py-2.5 bg-[#00FF88]/10 hover:bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_12px_rgba(0,255,136,0.15)]"
                >
                  <Sparkles className="w-4 h-4 text-[#00FF88]" />
                  Open Creator Payouts &amp; Monetization Hub
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {showCreateUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-[#25F4EE]" />
                Add New Creator
              </h3>
              <button
                onClick={() => setShowCreateUser(false)}
                className="text-neutral-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="text-xs text-neutral-400 block mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. sarah_dancer"
                  value={newUserData.username}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, username: e.target.value })
                  }
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="sarah@example.com"
                  value={newUserData.email}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, email: e.target.value })
                  }
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="Sarah Jenkins"
                  value={newUserData.displayName}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, displayName: e.target.value })
                  }
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 block mb-1">Bio</label>
                <textarea
                  rows={2}
                  placeholder="Creator bio..."
                  value={newUserData.bio}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, bio: e.target.value })
                  }
                  className="w-full bg-black border border-neutral-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#25F4EE]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="verified-check"
                  checked={newUserData.isVerified}
                  onChange={(e) =>
                    setNewUserData({ ...newUserData, isVerified: e.target.checked })
                  }
                  className="rounded bg-black border-neutral-700 text-blue-500 focus:ring-0"
                />
                <label htmlFor="verified-check" className="text-xs text-neutral-300">
                  Grant Verified Creator Badge
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateUser(false)}
                  className="px-4 py-2 rounded-xl text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-4 py-2 bg-gradient-to-r from-[#FE2C55] to-[#E02447] text-white rounded-xl text-xs font-semibold hover:brightness-110 disabled:opacity-50"
                >
                  {creatingUser ? "Creating..." : "Save Creator"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
