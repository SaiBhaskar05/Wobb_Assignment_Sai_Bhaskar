import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

interface AppState {
  searchQuery: string;
  selectedPlatform: Platform;
  selectedProfiles: UserProfileSummary[];
  setSearchQuery: (query: string) => void;
  setSelectedPlatform: (platform: Platform) => void;
  addProfile: (profile: UserProfileSummary) => void;
  removeProfile: (userId: string) => void;
  clearProfiles: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      searchQuery: "",
      selectedPlatform: "instagram",
      selectedProfiles: [],

      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),

      addProfile: (profile) =>
        set((state) => {
          const exists = state.selectedProfiles.some((p) => p.user_id === profile.user_id);
          if (exists) return state;
          return { selectedProfiles: [...state.selectedProfiles, profile] };
        }),

      removeProfile: (userId) =>
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter((p) => p.user_id !== userId),
        })),

      clearProfiles: () => set({ selectedProfiles: [] }),
    }),
    {
      name: "wobb-influencer-store",
    }
  )
);
