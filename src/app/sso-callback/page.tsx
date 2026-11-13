"use client";

import { useEffect, useState } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#FE2C55] border-t-transparent animate-spin" />
        <p className="text-xs text-neutral-400">Completing sign in...</p>
        {mounted && <AuthenticateWithRedirectCallback />}
      </div>
    </div>
  );
}
