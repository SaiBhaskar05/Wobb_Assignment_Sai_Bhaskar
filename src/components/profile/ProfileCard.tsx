import { useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import type { Platform, UserProfileSummary } from "@/types";
import { VerifiedBadge } from "../ui/VerifiedBadge";
import { Button } from "../ui/Button";
import { useStore } from "@/store/useStore";
import { toast } from "react-hot-toast";
import { Plus, Check, ArrowRight } from "lucide-react";

interface ProfileCardProps {
  profile: UserProfileSummary;
  platform: Platform;
  searchQuery: string;
}

function formatFollowersLocal(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + "M followers";
  if (count >= 1000) return (count / 1000).toFixed(0) + "K followers";
  return count + " followers";
}

function getInitialsColor(name: string) {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-600',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export const ProfileCard = memo(function ProfileCard({
  profile,
  platform,
  searchQuery,
}: ProfileCardProps) {
  const navigate = useNavigate();
  const [fallbackLevel, setFallbackLevel] = useState(0);
  const { selectedProfiles, addProfile, removeProfile } = useStore();

  const isAdded = selectedProfiles.some((p) => p.user_id === profile.user_id);

  const handleCardClick = () => {
    navigate(`/profile/${profile.username || profile.handle}?platform=${platform}`);
  };

  const handleListAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isAdded) {
      removeProfile(profile.user_id);
      toast.success(`Removed @${profile.username || profile.handle} from list`);
    } else {
      addProfile(profile);
      toast.success(`Added @${profile.username || profile.handle} to list`);
    }
  };

  const initials = (profile.fullname || profile.username || "?")
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleImageError = () => {
    setFallbackLevel((prev) => prev + 1);
  };

  const currentSrc = fallbackLevel === 0 
    ? (profile.picture?.includes("googleusercontent.com")
        ? `https://images.weserv.nl/?url=${encodeURIComponent(profile.picture)}&w=150&h=150&fit=cover`
        : (profile.picture?.includes("tiktokcdn.com") ? null : profile.picture))
    : fallbackLevel === 1 
      ? `https://unavatar.io/${platform}/${profile.handle || profile.username}` 
      : null;

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 glass-card rounded-2xl cursor-pointer w-full animate-fade-in-up"
      data-search={searchQuery}
    >
      {/* Influencer Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 font-bold text-base overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
          {!currentSrc ? (
            <div className={`w-full h-full flex items-center justify-center text-white text-base ${getInitialsColor(profile.username || profile.handle || "?")}`}>
              {initials}
            </div>
          ) : (
            <img
              src={currentSrc}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={handleImageError}
              alt=""
            />
          )}
        </div>

        {/* Username/Fullname */}
        <div className="text-left space-y-0.5">
          <div className="font-bold text-slate-800 flex items-center gap-1 group-hover:text-purple-600 transition-colors">
            @{profile.username || profile.handle}
            <VerifiedBadge verified={profile.is_verified} />
          </div>
          <div className="text-sm text-slate-500">{profile.fullname}</div>
          <div className="text-xs text-slate-400 font-semibold">{formatFollowersLocal(profile.followers)}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          onClick={handleCardClick}
          className="text-xs font-bold text-purple-600 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all duration-200 mr-2 sm:block hidden"
        >
          View Profile <ArrowRight className="w-3.5 h-3.5 inline" />
        </button>

        <Button
          variant={isAdded ? "outline" : "primary"}
          size="sm"
          onClick={handleListAction}
          className="rounded-xl w-full sm:w-auto"
        >
          {isAdded ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500 stroke-[3]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>Add to List</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
});
