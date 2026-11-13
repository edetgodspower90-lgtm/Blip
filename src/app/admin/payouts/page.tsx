"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  DollarSign,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  Eye,
  Filter,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Check,
  Award,
} from "lucide-react";

interface PayoutCreator {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  email: string;
  isVerified: boolean;
  createdAt: string;
  followersCount: number;
  postsCount: number;
  totalViews: number;
  isEligible: boolean;
  calculatedAmountNaira: number;
  status: "PAID" | "PENDING" | "INELIGIBLE";
  earningRecord: {
    id: string;
    status: "PAID" | "PENDING";
    amountNaira: number;
    totalViews: number;
    totalFollowers: number;
    paidAt: string | null;
    paidByAdminId: string | null;
    periodLabel: string;
  } | null;
}

interface PayoutSummary {
  period: string;
  totalCreators: number;
  eligibleCount: number;
  totalPaidNaira: number;
  totalPendingNaira: number;
}

export default function CreatorPayoutsPage() {
  const [summary, setSummary] = useState<PayoutSummary | null>(null);
  const [creators, setCreators] = useState<PayoutCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "eligible" | "pending" | "paid">("all");
  const [notification, setNotification] = useState<string | null>(null);

  const fetchPayouts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payouts?filter=${filter}`);
      if (!res.ok) throw new Error("Failed to fetch payouts");
      const data = await res.json();
      setSummary(data.summary);
      setCreators(data.creators || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchPayouts();
  }, [fetchPayouts]);

  const handleMarkAsPaid = async (creator: PayoutCreator) => {
    setUpdatingId(creator.id);
    try {
      const res = await fetch(`/api/admin/payouts/${creator.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "MARK_AS_PAID",
          amountNaira: creator.calculatedAmountNaira,
          totalViews: creator.totalViews,
          totalFollowers: creator.followersCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to mark as paid");

      setNotification(`Marked @${creator.username} as PAID (₦${creator.calculatedAmountNaira.toLocaleString()})`);
      setTimeout(() => setNotification(null), 4000);
      await fetchPayouts();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white p-4 sm:p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Toast Notification */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 bg-[#001A0E] border border-[#00FF88] text-[#00FF88] px-5 py-3 rounded-2xl shadow-[0_0_25px_rgba(0,255,136,0.3)] flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="w-5 h-5 text-[#00FF88]" />
            <span className="text-sm font-semibold">{notification}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link
                href="/admin"
                className="p-2 rounded-xl bg-[#0F0F0F] border border-[#222222] hover:border-[#00FF88] text-neutral-400 hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#A855F7] via-[#6366F1] to-[#06B6D4] p-[2px] flex items-center justify-center">
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#00FF88]" />
                </div>
              </div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Creator Payouts
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 font-semibold tracking-normal">
                  Super Admin
                </span>
              </h1>
            </div>
            <p className="text-sm text-neutral-400">
              Automated eligibility screening (≥100 followers, ≥1,000 views) and ₦ (Views / 1000) * 200 formula disbursements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchPayouts()}
              className="px-4 py-2.5 bg-[#0F0F0F] hover:bg-[#181818] border border-[#262626] rounded-xl text-sm font-medium text-neutral-300 flex items-center gap-2 transition-all"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#00FF88]" : ""}`} />
              Refresh
            </button>
            <Link
              href="/admin"
              className="px-4 py-2.5 bg-gradient-to-r from-[#A855F7] to-[#06B6D4] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-900/20 hover:brightness-110 transition-all flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Home
            </Link>
          </div>
        </div>

        {/* Formula Rule Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#070F0A] via-[#050B08] to-[#0D0514] border border-[#00FF88]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_0_30px_rgba(0,255,136,0.05)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00FF88]/10 border border-[#00FF88]/30 flex items-center justify-center text-[#00FF88] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Blip Creator Monetization Rules
                <span className="text-[11px] font-mono text-[#00FF88] bg-[#00FF88]/10 px-2 py-0.5 rounded">
                  Active Formula
                </span>
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Creators qualify with <strong className="text-neutral-200">≥100 Followers</strong> AND{" "}
                <strong className="text-neutral-200">≥1,000 Views</strong>. Earnings calculated at{" "}
                <span className="text-[#00FF88] font-bold">₦200 per 1,000 Total Views</span>.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0 px-4 py-2 rounded-xl bg-black/60 border border-[#222222]">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 block">Calculation</span>
            <code className="text-sm font-mono text-[#00FF88] font-semibold">
              ₦ (Total Views / 1000) * 200
            </code>
          </div>
        </div>

        {/* Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Paid */}
          <div className="p-5 rounded-2xl bg-[#080808] border border-[#00FF88]/30 shadow-[0_0_20px_rgba(0,255,136,0.08)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#00FF88]/5 rounded-full blur-2xl group-hover:bg-[#00FF88]/10 transition-all" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Total Disbursed</span>
              <div className="p-2 rounded-xl bg-[#00FF88]/10 text-[#00FF88]">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#00FF88] tracking-tight">
              ₦{summary ? summary.totalPaidNaira.toLocaleString() : "0"}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Confirmed Super Admin payouts</p>
          </div>

          {/* Card 2: Pending Payouts */}
          <div className="p-5 rounded-2xl bg-[#080808] border border-[#262626] hover:border-[#F59E0B]/50 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Pending Payouts</span>
              <div className="p-2 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-[#F59E0B] tracking-tight">
              ₦{summary ? summary.totalPendingNaira.toLocaleString() : "0"}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Eligible creators ready for payment</p>
          </div>

          {/* Card 3: Eligible Creators */}
          <div className="p-5 rounded-2xl bg-[#080808] border border-[#262626] hover:border-[#00FF88]/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Eligible Creators</span>
              <div className="p-2 rounded-xl bg-[#00FF88]/10 text-[#00FF88]">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {summary ? summary.eligibleCount : 0}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Met followers &amp; views threshold</p>
          </div>

          {/* Card 4: Total Creators */}
          <div className="p-5 rounded-2xl bg-[#080808] border border-[#262626]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Registered Creators</span>
              <div className="p-2 rounded-xl bg-neutral-800 text-neutral-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-black text-white tracking-tight">
              {summary ? summary.totalCreators : 0}
            </div>
            <p className="text-[11px] text-neutral-500 mt-1">Total user accounts in Supabase</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 p-1 bg-[#0D0D0D] border border-[#1F1F1F] rounded-xl">
            {(
              [
                { key: "all", label: "All Creators" },
                { key: "eligible", label: "Eligible Only" },
                { key: "pending", label: "Pending Payout" },
                { key: "paid", label: "Paid" },
              ] as const
            ).map((t) => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === t.key
                    ? "bg-[#00FF88] text-black shadow-[0_0_12px_rgba(0,255,136,0.3)]"
                    : "text-neutral-400 hover:text-white hover:bg-[#181818]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-neutral-400">
            Showing <strong className="text-white">{creators.length}</strong> creator records
          </div>
        </div>

        {/* Creators Payout Table */}
        <div className="bg-[#080808] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#0D0D0D] text-[11px] uppercase tracking-wider text-neutral-400 border-b border-[#1F1F1F]">
                <tr>
                  <th className="py-4 px-6 font-semibold">Creator</th>
                  <th className="py-4 px-4 font-semibold">Followers</th>
                  <th className="py-4 px-4 font-semibold">Total Views</th>
                  <th className="py-4 px-4 font-semibold">Eligibility</th>
                  <th className="py-4 px-4 font-semibold">Calculated Earnings</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 text-right font-semibold">Super Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#161616]">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-500">
                      <div className="flex items-center justify-center gap-3">
                        <RefreshCw className="w-5 h-5 animate-spin text-[#00FF88]" />
                        <span>Loading creator payout data from Supabase...</span>
                      </div>
                    </td>
                  </tr>
                ) : creators.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                      <div className="max-w-sm mx-auto space-y-2">
                        <Users className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-neutral-300">No creators found</p>
                        <p className="text-xs text-neutral-500">
                          As new users sign up and publish posts on Blip, their real views, followers, and earnings will appear here.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  creators.map((c) => {
                    const isPaid = c.status === "PAID";
                    const isEligible = c.isEligible;
                    const isUpdating = updatingId === c.id;

                    return (
                      <tr key={c.id} className="hover:bg-[#0D0D0D] transition-colors">
                        {/* Creator Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#A855F7] to-[#06B6D4] p-[1.5px] shrink-0">
                              <div className="w-full h-full bg-black rounded-full overflow-hidden flex items-center justify-center text-xs font-bold text-white">
                                {c.avatarUrl ? (
                                  <img
                                    src={c.avatarUrl}
                                    alt={c.username}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  c.username.slice(0, 2).toUpperCase()
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-white">
                                <span>{c.displayName || c.username}</span>
                                {c.isVerified && (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
                                )}
                              </div>
                              <span className="text-xs text-neutral-500 font-mono">@{c.username}</span>
                            </div>
                          </div>
                        </td>

                        {/* Followers */}
                        <td className="py-4 px-4 font-mono font-medium">
                          <span className={c.followersCount >= 100 ? "text-[#00FF88]" : "text-neutral-400"}>
                            {c.followersCount.toLocaleString()}
                          </span>
                          <span className="text-neutral-600 text-xs ml-1">/ 100</span>
                        </td>

                        {/* Total Views */}
                        <td className="py-4 px-4 font-mono font-medium">
                          <span className={c.totalViews >= 1000 ? "text-[#00FF88]" : "text-neutral-400"}>
                            {c.totalViews.toLocaleString()}
                          </span>
                          <span className="text-neutral-600 text-xs ml-1">/ 1K</span>
                        </td>

                        {/* Eligibility Badge */}
                        <td className="py-4 px-4">
                          {isEligible ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30">
                              <Check className="w-3 h-3" />
                              ELIGIBLE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-neutral-900 text-neutral-500 border border-neutral-800">
                              <AlertCircle className="w-3 h-3" />
                              INELIGIBLE
                            </span>
                          )}
                        </td>

                        {/* Calculated Earnings */}
                        <td className="py-4 px-4">
                          <div className="font-mono font-black text-base text-[#00FF88]">
                            ₦{c.calculatedAmountNaira.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-neutral-500">
                            {c.totalViews > 0 ? `${Math.floor(c.totalViews / 1000)} units @ ₦200` : "0 units"}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {isPaid ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/40 shadow-[0_0_10px_rgba(0,255,136,0.15)]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              PAID
                            </span>
                          ) : isEligible ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/40">
                              <Clock className="w-3.5 h-3.5" />
                              PENDING
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-500">—</span>
                          )}
                        </td>

                        {/* Super Admin Action Button */}
                        <td className="py-4 px-6 text-right">
                          {isPaid ? (
                            <span className="text-xs font-semibold text-[#00FF88] bg-[#00FF88]/5 px-3 py-1.5 rounded-xl border border-[#00FF88]/20 inline-block">
                              Disbursed
                            </span>
                          ) : isEligible ? (
                            <button
                              onClick={() => handleMarkAsPaid(c)}
                              disabled={isUpdating}
                              className="px-4 py-2 bg-gradient-to-r from-[#00FF88] to-[#00CC6A] text-black font-extrabold text-xs rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,255,136,0.25)] disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                            >
                              {isUpdating ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              MARK AS PAID
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-3.5 py-1.5 bg-[#121212] text-neutral-600 font-medium text-xs rounded-xl cursor-not-allowed border border-[#1A1A1A]"
                            >
                              Threshold Unmet
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
