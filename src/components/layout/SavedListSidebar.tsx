import { useState } from "react";
import { useStore } from "@/store/useStore";
import { X, Trash2, Users } from "lucide-react";
import { Button } from "../ui/Button";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { UserProfileSummary } from "@/types";

interface SavedListSidebarProps {
  isOpen: boolean;
  onClose: () => void;
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

function SavedAvatar({ profile }: { profile: UserProfileSummary }) {
  const [fallbackLevel, setFallbackLevel] = useState(0);

  const platform = profile.url.includes("instagram.com") ? "instagram" :
                   profile.url.includes("youtube.com") ? "youtube" :
                   profile.url.includes("tiktok.com") ? "tiktok" : "github";

  const initials = (profile.fullname || profile.username || "?")
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleImageError = () => {
    setFallbackLevel(prev => prev + 1);
  };

  const currentSrc = fallbackLevel === 0 
    ? (profile.picture?.includes("googleusercontent.com")
        ? `https://images.weserv.nl/?url=${encodeURIComponent(profile.picture)}&w=150&h=150&fit=cover`
        : (profile.picture?.includes("tiktokcdn.com") ? null : profile.picture))
    : fallbackLevel === 1 
      ? `https://unavatar.io/${platform}/${profile.handle || profile.username}` 
      : null;

  if (!currentSrc) {
    return (
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${getInitialsColor(profile.username || profile.handle || "")}`}>
        {initials}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={profile.fullname}
      className="w-9 h-9 rounded-full object-cover border border-white/80 shrink-0"
      referrerPolicy="no-referrer"
      onError={handleImageError}
    />
  );
}

export function SavedListSidebar({ isOpen, onClose }: SavedListSidebarProps) {
  const { selectedProfiles, removeProfile, clearProfiles } = useStore();

  const handleRemove = (id: string, name: string) => {
    removeProfile(id);
    toast.success(`Removed @${name} from list`);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your saved list?")) {
      clearProfiles();
      toast.success("List cleared");
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-white/85 border-l border-white/60 z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col backdrop-blur-xl shadow-2xl`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-slate-800">My List</h3>
            <span className="bg-purple-100 text-purple-600 font-bold px-2 py-0.5 rounded-full text-xs">
              {selectedProfiles.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 lg:hidden cursor-pointer"
            aria-label="Close List"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-400 space-y-3">
              <Users className="w-12 h-12 stroke-[1.5] text-slate-300" />
              <p className="text-sm font-semibold">No creators added yet.</p>
              <p className="text-xs max-w-[200px]">Click 'Add to List' on search results to compare creators here.</p>
            </div>
          ) : (
            selectedProfiles.map((profile) => {
              const platform = profile.url.includes("instagram.com") ? "instagram" :
                               profile.url.includes("youtube.com") ? "youtube" :
                               profile.url.includes("tiktok.com") ? "tiktok" : "github";
              return (
                <div
                  key={profile.user_id}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/80 bg-white/40 hover:bg-white/80 transition-colors shadow-sm group/item"
                >
                  <Link
                    to={`/profile/${profile.username || profile.handle}?platform=${platform}`}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 text-left cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <SavedAvatar profile={profile} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover/item:text-purple-600 transition-colors truncate max-w-[130px]">
                        @{profile.username || profile.handle}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[130px]">
                        {profile.fullname}
                      </div>
                      <div className="mt-1">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                          platform === "instagram" ? "bg-pink-500/10 text-pink-500 border border-pink-500/20" :
                          platform === "youtube" ? "bg-red-500/10 text-red-500 border border-red-500/20" :
                          "bg-purple-500/10 text-purple-600 border border-purple-500/20"
                        }`}>
                          {platform}
                        </span>
                      </div>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleRemove(profile.user_id, profile.username || profile.handle || "")}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
                      title="Remove from list"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Sidebar Footer */}
        {selectedProfiles.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <Button
              variant="danger"
              size="sm"
              className="w-full gap-2 rounded-xl"
              onClick={handleClearAll}
            >
              <Trash2 className="w-4 h-4" /> Clear All List
            </Button>
          </div>
        )}
      </aside>
    </>
  );
}
