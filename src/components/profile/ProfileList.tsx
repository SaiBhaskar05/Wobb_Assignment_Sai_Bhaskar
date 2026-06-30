import type { Platform, UserProfileSummary } from "@/types";
import { ProfileCard } from "./ProfileCard";
import { Frown } from "lucide-react";

interface ProfileListProps {
  profiles: UserProfileSummary[];
  platform: Platform;
  searchQuery: string;
}

export function ProfileList({
  profiles,
  platform,
  searchQuery,
}: ProfileListProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center border border-white/80 rounded-3xl bg-white/40 shadow-sm space-y-4 max-w-md mx-auto">
        <div className="p-4 bg-purple-50 text-purple-500 rounded-2xl border border-purple-100/60 shadow-inner">
          <Frown className="w-8 h-8 stroke-[1.5]" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-800">No profiles found</h3>
          <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed mx-auto">
            We couldn't find any creators matching your search query. Try typing another name or adjust your filter.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {profiles.map((profile) => (
        <ProfileCard
          key={profile.user_id}
          profile={profile}
          platform={platform}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
}
