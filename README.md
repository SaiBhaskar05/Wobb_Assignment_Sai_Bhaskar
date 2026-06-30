# Wobb Assignment - Submission

This repository contains the fully refactored, optimized, and redesigned Influencer Search Application for the Wobb Frontend Assignment.

## 🛠️ Key Improvements & Features Implemented

### 1. Robust State Management (Zustand Store)
- Completely replaced React Context with **Zustand** (`src/store/useStore.ts`).
- Integrated **Zustand Persist Middleware** to serialize the state directly into `localStorage`. 
- Selection counts, platform selections, and search queries remain preserved across page reloads.

### 2. Claymorphic Light Theme Redesign
- Redesigned the entire application from a dark background to a modern, tactile **Claymorphism Light Theme** (`#f2f5fa` backdrop base).
- Added inflated clay panels and dual-inner-shadow cards (`.glass-card`, `.glass-panel` in `index.css`) that give elements a 3D, pillowy aesthetic.
- Configured double-shadow gradients:
  - **Inner shadows** (`inset 4px 4px 10px rgba(255, 255, 255, 0.95), inset -4px -4px 10px rgba(165, 180, 252, 0.15)`) create the inflated look.
  - **Outer drop-shadows** (`12px 12px 28px rgba(165, 180, 252, 0.22)`) create a soft depth floating offset.
- Audited and updated typography to **Slate shades** (`text-slate-800`, `text-slate-600`) to guarantee contrast and visual clarity on light cards.

### 3. Performance & Network Optimizations
- **Static List Caching:** Cached static creator arrays on startup in `dataHelpers.ts` to prevent redundant mapping allocations during filter updates.
- **Component Memoization:** Wrapped `ProfileCard.tsx` inside React's `memo` wrapper to skip virtual DOM calculations when search inputs change.
- **Image Proxying:** Wrapped YouTube profile pictures (`googleusercontent.com` URLs) in a high-speed Cloudflare-backed proxy (`images.weserv.nl`), bypassing Google's hotlinking blocks and ensuring pictures load instantly.
- **Expired CDN Bypass:** Explicitly skipped requesting expired `tiktokcdn.com` URLs to prevent browser connection timeouts (`net::ERR_CONNECTION_TIMED_OUT`) and console error logs.
- **Image Fallback Chain:** Implemented a stateful image fallback chain (Original URL ➔ Unavatar universal resolver ➔ Initials fallback circle).

### 4. Responsiveness & UX Polish
- **Segmented Control Wrapping:** Configured the segmented platform selector to wrap responsively on ultra-narrow mobile viewports, avoiding layout overflows.
- **Saved List Navigation:** Clicking anywhere on a creator item card in the sidebar drawer routes to their profile details page and automatically auto-collapses the drawer.
- **Empty States:** Redesigned empty states (search empty state & saved list empty state) into pillowy clay containers with animated Lucide icons.

---

## 📦 Libraries Added
- **`zustand`**: Lightweight, fast state management store.
- **`react-hot-toast`**: Sleek, glassmorphic toaster notifications.
- **`lucide-react`**: Set of icons.
- **`react-router-dom`**: Frontend client routing.

---

## 💡 Assumptions Made
- The search datasets (`youtube.json`, `instagram.json`, `tiktok.json`) and creator details JSONs are mock static datasets loaded locally.
- TikTok/YouTube CDN links can expire or block hotlinking, meaning fallback solutions (like Unavatar and proxy caches) are required to ensure continuous service.

---

## ⚖️ Trade-offs
- **Third-Party CDN Proxies:** Using free third-party proxies (`images.weserv.nl`, `unavatar.io`) solves referrer and cache blocks immediately without server setup, but introduces light dependencies on external API uptime.

---

## 🔮 Remaining Improvements
- **Backend Image Resolver:** In a real production scale, routing images through a proprietary backend media proxy will remove third-party CDN dependency.
- **Search Debouncing:** Useful if search data scales to live API fetches in the future.

---

## 🚀 Getting Started

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
