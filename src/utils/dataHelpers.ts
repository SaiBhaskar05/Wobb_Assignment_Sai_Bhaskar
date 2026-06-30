import instagramData from "@/assets/data/search/instagram.json";
import youtubeData from "@/assets/data/search/youtube.json";
import tiktokData from "@/assets/data/search/tiktok.json";
import type { Platform, SearchData, UserProfileSummary } from "@/types";

const platformData: Record<Platform, SearchData> = {
  instagram: instagramData as SearchData,
  youtube: youtubeData as SearchData,
  tiktok: tiktokData as SearchData,
};

const cachedProfiles: Record<Platform, UserProfileSummary[]> = {
  instagram: (instagramData as SearchData).accounts.map((item) => item.account.user_profile),
  youtube: (youtubeData as SearchData).accounts.map((item) => item.account.user_profile),
  tiktok: (tiktokData as SearchData).accounts.map((item) => item.account.user_profile),
};

export function getSearchData(platform: Platform): SearchData {
  return platformData[platform];
}

export function extractProfiles(platform: Platform): UserProfileSummary[] {
  return cachedProfiles[platform];
}

export function filterProfiles(
  profiles: UserProfileSummary[],
  query: string
): UserProfileSummary[] {
  if (!query) return profiles;
  const lowerQuery = query.toLowerCase();
  return profiles.filter((p) => {
    const username = (p.username || "").toLowerCase();
    const fullname = (p.fullname || "").toLowerCase();
    const handle = (p.handle || "").toLowerCase();
    return (
      username.includes(lowerQuery) ||
      fullname.includes(lowerQuery) ||
      handle.includes(lowerQuery)
    );
  });
}

export const PLATFORMS: Platform[] = ["instagram", "youtube", "tiktok"];

export function getPlatformLabel(platform: Platform): string {
  if (platform === "instagram") return "Instagram";
  if (platform === "youtube") return "YouTube";
  return "TikTok";
}

export function findProfileSummary(username: string): { profile: UserProfileSummary; platform: Platform } | null {
  for (const platform of PLATFORMS) {
    const profiles = extractProfiles(platform);
    const found = profiles.find(p => p.username === username || p.handle === username);
    if (found) {
      return { profile: found, platform };
    }
  }
  return null;
}
