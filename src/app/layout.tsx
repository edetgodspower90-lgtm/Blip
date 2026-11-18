import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

export const metadata: Metadata = {
  title: "BLIP 2050 - Next-Generation Social Media Platform",
  description:
    "Experience the social platform of 2050. Immersive reels, creator monetization, and authentic community on Blip.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerkKey = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  const appShell = (
    <div className="relative min-h-screen bg-[#07080E] text-white selection:bg-[#8B5CF6]/30 selection:text-white">
      {/* Subtle 2050 Atmospheric Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 ambient-glow-violet opacity-75" />
      <div className="fixed inset-0 pointer-events-none z-0 ambient-glow-cyan opacity-50" />

      {/* Desktop Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="relative z-10 min-h-screen md:pl-64 flex flex-col justify-between">
        <div className="flex-1 w-full max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );

  return (
    <html lang="en" className="dark">
      <body className="bg-[#07080E] text-white antialiased min-h-screen">
        {hasClerkKey ? <ClerkProvider>{appShell}</ClerkProvider> : appShell}
      </body>
    </html>
  );
}
