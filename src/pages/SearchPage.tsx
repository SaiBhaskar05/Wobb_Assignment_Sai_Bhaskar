import { useMemo, useTransition } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PlatformFilter } from "@/components/search/PlatformFilter";
import { ProfileList } from "@/components/profile/ProfileList";
import { extractProfiles } from "@/utils/dataHelpers";
import { useStore } from "@/store/useStore";
import type { Platform } from "@/types";

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [, startTransition] = useTransition();
  
  const { searchQuery, setSearchQuery } = useStore();

  // Single source of truth for platform tab from the URL query params
  const platform = useMemo(() => {
    const qPlatform = searchParams.get("platform") as Platform;
    return qPlatform && ["instagram", "youtube", "tiktok"].includes(qPlatform)
      ? qPlatform
      : "instagram";
  }, [searchParams]);

  const allProfiles = useMemo(() => {
    return extractProfiles(platform);
  }, [platform]);

  const filteredProfiles = useMemo(() => {
    if (!searchQuery) return allProfiles;
    const lowerQuery = searchQuery.toLowerCase();
    return allProfiles.filter((p) => {
      const username = (p.username || "").toLowerCase();
      const fullname = (p.fullname || "").toLowerCase();
      const handle = (p.handle || "").toLowerCase();
      return (
        username.includes(lowerQuery) ||
        fullname.includes(lowerQuery) ||
        handle.includes(lowerQuery)
      );
    });
  }, [allProfiles, searchQuery]);

  const handlePlatformChange = (p: Platform) => {
    startTransition(() => {
      setSearchQuery("");
      setSearchParams({ platform: p }, { replace: true });
    });
  };

  return (
    <Layout title="Find Influencers">
      <div className="space-y-6">
        <p className="text-slate-500 text-sm max-w-md mx-auto text-center leading-relaxed font-semibold">
          Search and find top content creators across Instagram, YouTube, and TikTok. Analyze follower counts and save them to lists.
        </p>

        <PlatformFilter
          selected={platform}
          onChange={handlePlatformChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 pt-4">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Search Results
          </span>
          <span className="text-xs font-bold text-purple-650 bg-purple-50 border border-purple-100/60 px-3 py-1 rounded-full shadow-sm">
            {filteredProfiles.length} of {allProfiles.length} on {platform}
          </span>
        </div>

        <ProfileList
          profiles={filteredProfiles}
          platform={platform}
          searchQuery={searchQuery}
        />
      </div>
    </Layout>
  );
}
