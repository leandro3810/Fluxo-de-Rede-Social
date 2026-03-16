import React from "react";
import { cn } from "@/lib/utils";

const platformConfig = {
  instagram: { color: "from-pink-500 to-purple-600", label: "Instagram", emoji: "📸" },
  tiktok: { color: "from-gray-900 to-gray-700", label: "TikTok", emoji: "🎵" },
  x: { color: "from-gray-800 to-gray-600", label: "X", emoji: "𝕏" },
  facebook: { color: "from-blue-600 to-blue-500", label: "Facebook", emoji: "📘" },
  linkedin: { color: "from-blue-700 to-blue-500", label: "LinkedIn", emoji: "💼" },
  youtube: { color: "from-red-600 to-red-500", label: "YouTube", emoji: "▶️" },
};

export function getPlatformConfig(platform) {
  return platformConfig[platform] || platformConfig.instagram;
}

export default function PlatformIcon({ platform, size = "md", className }) {
  const config = getPlatformConfig(platform);
  const sizes = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-2xl",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
        config.color,
        sizes[size],
        className
      )}
    >
      <span>{config.emoji}</span>
    </div>
  );
}
