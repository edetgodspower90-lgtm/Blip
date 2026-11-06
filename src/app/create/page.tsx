"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Film,
  Image as ImageIcon,
  Music,
  CheckCircle2,
  X,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

export default function CreatePostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"VIDEO" | "IMAGE">("VIDEO");
  const [caption, setCaption] = useState("");
  const [audioTitle, setAudioTitle] = useState("Original Sound - alexcreator");
  const [tags, setTags] = useState<string[]>(["fyp", "trending", "blip"]);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const isVideo = selectedFile.type.startsWith("video/");
    setMediaType(isVideo ? "VIDEO" : "IMAGE");

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const cleaned = tagInput.replace(/^#/, "").trim();
      if (cleaned && !tags.includes(cleaned)) {
        setTags([...tags, cleaned]);
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!previewUrl) return;

    setIsUploading(true);

    // Simulate Supabase Storage upload and Prisma Post creation
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/");
      }, 1200);
    }, 1500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#262626] mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Create New Post</h1>
            <p className="text-xs text-neutral-400">
              Upload high-definition reels or photos to your audience
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#25F4EE]" />
          <span className="text-xs font-semibold text-neutral-300">Creator Studio</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Media Uploader & Preview */}
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="relative w-full max-w-[340px] aspect-[9/16] bg-[#141414] border-2 border-dashed border-neutral-700 hover:border-[#FE2C55] transition-colors rounded-2xl overflow-hidden flex flex-col items-center justify-center p-4 group">
            {previewUrl ? (
              mediaType === "VIDEO" ? (
                <video
                  src={previewUrl}
                  controls
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                </div>
              )
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center cursor-pointer p-6"
              >
                <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-[#FE2C55]" />
                </div>
                <h3 className="font-semibold text-white text-base mb-1">
                  Select video or photo
                </h3>
                <p className="text-xs text-neutral-400 mb-4">
                  MP4, WebM, JPG or PNG up to 100MB
                </p>
                <button
                  type="button"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#FE2C55] to-[#FD1D1D] text-white text-xs font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
                >
                  Choose File
                </button>
              </div>
            )}

            {/* Clear Media Button */}
            {previewUrl && (
              <button
                type="button"
                onClick={() => {
                  setPreviewUrl(null);
                  setFile(null);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Right Column: Post Metadata & Settings */}
        <div className="md:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Caption */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-neutral-200">
                  Caption
                </label>
                <span className="text-xs text-neutral-500">
                  {caption.length}/2200
                </span>
              </div>
              <textarea
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={2200}
                placeholder="Write a catchy caption, add details, and tag your favorite creators..."
                className="w-full bg-[#181818] border border-[#262626] rounded-xl p-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#FE2C55] transition-colors resize-none leading-relaxed"
              />
            </div>

            {/* Hashtags */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-2">
                Hashtags
              </label>
              <div className="flex flex-wrap gap-2 mb-2 p-2.5 bg-[#181818] border border-[#262626] rounded-xl min-h-[48px] items-center">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-[#25F4EE] rounded-lg text-xs font-semibold"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Type tag & press Enter..."
                  className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none flex-1 min-w-[120px]"
                />
              </div>
            </div>

            {/* Audio Track */}
            <div>
              <label className="block text-sm font-semibold text-neutral-200 mb-2">
                Audio Track
              </label>
              <div className="relative">
                <Music className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#25F4EE]" />
                <input
                  type="text"
                  value={audioTitle}
                  onChange={(e) => setAudioTitle(e.target.value)}
                  placeholder="Original Audio or Track Title"
                  className="w-full pl-10 pr-4 py-3 bg-[#181818] border border-[#262626] rounded-xl text-sm text-white focus:outline-none focus:border-[#FE2C55] transition-colors"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="px-6 py-3 rounded-xl border border-neutral-700 text-neutral-300 font-semibold text-sm hover:bg-neutral-800 transition-colors"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={!previewUrl || isUploading}
                className="flex-1 py-3 bg-gradient-to-r from-[#FE2C55] via-[#FD1D1D] to-[#E02447] disabled:opacity-50 text-white font-bold text-sm rounded-xl hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-950/40"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-300" />
                    Published Successfully!
                  </>
                ) : isUploading ? (
                  "Uploading to Supabase..."
                ) : (
                  "Post Reel"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
