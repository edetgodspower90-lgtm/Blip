import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/navigation/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";

export const metadata: Metadata = {
  title: "Blip - Next-Gen Short Video & Social Platform",
  description:
    "Discover trending short reels, connect with friends, and share your creative moments on Blip.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-white antialiased min-h-screen">
        {/* Desktop Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="min-h-screen md:pl-64 flex flex-col justify-between">
          <div className="flex-1 w-full max-w-7xl mx-auto">{children}</div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </body>
    </html>
  );
}
