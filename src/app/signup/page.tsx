"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sparkles, KeyRound } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

const clerkAppearance = {
  variables: {
    colorPrimary: "#FE2C55",
    colorBackground: "#121212",
    colorText: "#ffffff",
    colorTextSecondary: "#a3a3a3",
    colorInputBackground: "#181818",
    colorInputText: "#ffffff",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
  },
  elements: {
    card: "bg-[#121212] border border-[#262626] shadow-none rounded-3xl",
    socialButtonsBlockButton:
      "bg-[#181818] border border-[#262626] text-white hover:bg-[#222] rounded-xl text-sm",
    socialButtonsBlockButtonText: "font-semibold",
    formFieldLabel: "text-neutral-300 text-xs font-semibold",
    formFieldInput:
      "bg-[#181818] border border-[#262626] text-white text-sm rounded-xl focus:border-[#FE2C55]",
    formButtonPrimary:
      "bg-gradient-to-r from-[#FE2C55] to-[#E02447] text-white font-bold text-sm rounded-xl shadow-lg shadow-red-950/50 hover:brightness-110",
    footerActionLink: "text-white font-semibold hover:underline",
    identityPreviewText: "text-white",
    dividerLine: "bg-[#262626]",
    dividerText: "text-neutral-500 text-xs",
    formFieldLabelRow: "mb-1.5",
    alertText: "text-red-200",
    otpCodeFieldInput: "text-white",
  },
} as const;

export default function SignupPage() {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#121212] border border-[#262626] rounded-3xl p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#FE2C55] via-[#FD1D1D] to-[#25F4EE] p-[2px] mb-3">
            <div className="w-full h-full bg-black rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white">Join Blip</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create your account to start sharing and exploring
          </p>
        </div>

        {!hasClerkKey ? (
          <div className="p-4 rounded-xl bg-yellow-950/40 border border-yellow-800 text-yellow-200 text-xs flex gap-3 items-start">
            <KeyRound className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Clerk is not configured yet. Add{" "}
              <code className="text-white">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code>{" "}
              and <code className="text-white">CLERK_SECRET_KEY</code> to{" "}
              <code className="text-white">.env.local</code> (from{" "}
              <a
                href="https://dashboard.clerk.com"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                dashboard.clerk.com
              </a>
              ) to enable Google sign-in.
            </span>
          </div>
        ) : !mounted ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-[#FE2C55] border-t-transparent animate-spin" />
          </div>
        ) : (
          <SignUp
            signInUrl="/login"
            forceRedirectUrl="/"
            appearance={clerkAppearance}
          />
        )}

        <p className="text-center text-xs text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-white font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
