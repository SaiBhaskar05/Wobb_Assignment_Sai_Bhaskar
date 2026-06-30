import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import type { FullUserProfile, ProfileDetailResponse } from "@/types";
import { loadProfileByUsername } from "@/utils/profileLoader";
import { findProfileSummary } from "@/utils/dataHelpers";
import { useStore } from "@/store/useStore";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Users, BarChart3, Film, Heart, MessageSquare, Eye, Plus, Check } from "lucide-react";

function formatFollowersDetail(count: number) {
  if (count >= 1000000) return (count / 1000000).toFixed(2) + "M";
  if (count >= 1000) return (count / 1000).toFixed(1) + "K";
  return String(count);
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

export function ProfileDetailPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const queryPlatform = searchParams.get("platform") || "unknown";
  const [profileData, setProfileData] = useState<ProfileDetailResponse | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { selectedProfiles, addProfile, removeProfile } = useStore();

  useEffect(() => {
    if (!username) return;

    loadProfileByUsername(username).then((data) => {
      const summaryData = findProfileSummary(username);
      const pic = summaryData?.profile.picture || data?.data.user_profile.picture;
      const cleanPic = pic?.includes("tiktokcdn.com") ? null : pic;
      const finalPic = cleanPic?.includes("googleusercontent.com")
        ? `https://images.weserv.nl/?url=${encodeURIComponent(cleanPic)}&w=150&h=150&fit=cover`
        : cleanPic;

      if (data) {
        setProfileData(data);
        setImageSrc(finalPic || null);
      } else {
        if (summaryData) {
          setProfileData({
            cached: false,
            data: {
              success: true,
              user_profile: {
                ...summaryData.profile,
                description: "Detailed analytics report is currently not cached for this creator. Basic platform metrics are shown below.",
              },
            },
          });
          setImageSrc(finalPic || null);
        } else {
          setProfileData(null);
          setImageSrc(null);
        }
      }
      setLoaded(true);
    });
  }, [username]);

  if (!username) {
    return (
      <Layout>
        <p>Invalid profile</p>
        <Link to="/">Back</Link>
      </Layout>
    );
  }

  if (!loaded) {
    return (
      <Layout title={`@${username}`}>
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Loading creator data...</p>
        </div>
      </Layout>
    );
  }

  if (!profileData) {
    return (
      <Layout title={`@${username}`}>
        <div className="text-center py-12 space-y-4">
          <p className="text-red-500 font-semibold mb-4">
            Could not load profile details for {username}
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to search
          </Link>
        </div>
      </Layout>
    );
  }

  const user: FullUserProfile = profileData.data.user_profile;

  // Determine platform
  const platform = queryPlatform !== "unknown" ? queryPlatform : (
    user.url.includes("instagram.com") ? "instagram" :
    user.url.includes("youtube.com") ? "youtube" :
    user.url.includes("tiktok.com") ? "tiktok" : "github"
  );

  const isAdded = selectedProfiles.some((p) => p.user_id === user.user_id);

  const handleListAction = () => {
    if (isAdded) {
      removeProfile(user.user_id);
      toast.success(`Removed @${user.username || user.handle} from list`);
    } else {
      const summaryData = findProfileSummary(username || "");
      const profileToAdd = {
        ...user,
        picture: summaryData?.profile.picture || user.picture
      };
      addProfile(profileToAdd);
      toast.success(`Added @${user.username || user.handle} to list`);
    }
  };

  const initials = (user.fullname || user.username || "?")
    .trim()
    .split(/\s+/)
    .map(word => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getFallbackUrls = () => {
    if (!profileData) return [];
    const list: string[] = [];
    
    const getProxy = (url: string) => {
      return url.includes("googleusercontent.com")
        ? `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=150&h=150&fit=cover`
        : url;
    };

    // Prioritize search summary picture URL if available
    const summaryData = findProfileSummary(username || "");
    if (summaryData?.profile.picture && !summaryData.profile.picture.includes("tiktokcdn.com")) {
      list.push(getProxy(summaryData.profile.picture));
    }
    
    if (user.picture && !user.picture.includes("tiktokcdn.com")) {
      const p = getProxy(user.picture);
      if (!list.includes(p)) list.push(p);
    }
    
    // 1. Primary unavatar fallback
    const unavatarUrl = `https://unavatar.io/${platform}/${user.handle || user.username}`;
    if (!list.includes(unavatarUrl)) list.push(unavatarUrl);

    // 2. Secondary unavatar fallback via contacts (e.g. Instagram / YouTube)
    const instagramContact = user.contacts?.find(c => c.type === "instagram")?.value;
    if (instagramContact) {
      const igUrl = `https://unavatar.io/instagram/${instagramContact}`;
      if (!list.includes(igUrl)) list.push(igUrl);
    }

    const youtubeContact = user.contacts?.find(c => c.type === "youtube")?.value;
    if (youtubeContact) {
      const ytUrl = `https://unavatar.io/youtube/${youtubeContact}`;
      if (!list.includes(ytUrl)) list.push(ytUrl);
    }

    return list;
  };

  const handleImageError = () => {
    const urls = getFallbackUrls();
    const currentIndex = urls.indexOf(imageSrc || "");
    if (currentIndex !== -1 && currentIndex < urls.length - 1) {
      setImageSrc(urls[currentIndex + 1]);
    } else {
      setImageSrc(null);
    }
  };

  return (
    <Layout title={user.fullname}>
      <div className="space-y-6">
        {/* Back Link */}
        <Link
          to={`/?platform=${platform}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to search
        </Link>

        {/* Profile Card details header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-slate-700 font-bold text-3xl overflow-hidden border border-white/80 shrink-0 shadow-inner">
              {!imageSrc ? (
                <div className={`w-full h-full flex items-center justify-center text-white ${getInitialsColor(user.username || user.handle || "?")}`}>
                  {initials}
                </div>
              ) : (
                <img
                  src={imageSrc}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  alt=""
                />
              )}
            </div>

            {/* Info */}
            <div className="space-y-2 pt-1">
              <h2 className="text-2xl font-extrabold text-slate-800 flex items-center justify-center sm:justify-start gap-1.5">
                @{user.username || user.handle}
                <VerifiedBadge verified={user.is_verified} />
              </h2>
              <p className="text-slate-500 text-sm font-semibold">{user.fullname}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-600 border border-purple-100">
                {platform}
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-center md:justify-end shrink-0">
            <Button
              variant={isAdded ? "outline" : "primary"}
              onClick={handleListAction}
              className="w-full sm:w-auto"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-green-500 stroke-[3]" />
                  <span>Added to List</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add to List</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Description / Bio */}
        {user.description && (
          <div className="text-left space-y-2">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Bio</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line glass-card p-4 rounded-2xl">
              {user.description}
            </p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="text-left space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Creator Performance</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Followers */}
            <div className="p-4 glass-card rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Followers</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {formatFollowersDetail(user.followers)}
              </div>
            </div>

            {/* Engagement */}
            <div className="p-4 glass-card rounded-2xl space-y-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>Engagement Rate</span>
              </div>
              <div className="text-2xl font-bold text-slate-800">
                {user.engagement_rate !== undefined
                  ? (user.engagement_rate * 100).toFixed(2) + "%"
                  : "N/A"}
              </div>
            </div>

            {/* Posts */}
            {user.posts_count !== undefined && (
              <div className="p-4 glass-card rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <Film className="w-4 h-4 text-pink-400" />
                  <span>Posts</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {user.posts_count}
                </div>
              </div>
            )}

            {/* Avg Likes */}
            {user.avg_likes !== undefined && (
              <div className="p-4 glass-card rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <Heart className="w-4 h-4 text-rose-400" />
                  <span>Avg Likes</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {formatFollowersDetail(user.avg_likes)}
                </div>
              </div>
            )}

            {/* Avg Comments */}
            {user.avg_comments !== undefined && (
              <div className="p-4 glass-card rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <MessageSquare className="w-4 h-4 text-teal-400" />
                  <span>Avg Comments</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {formatFollowersDetail(user.avg_comments)}
                </div>
              </div>
            )}

            {/* Avg Views */}
            {user.avg_views !== undefined && user.avg_views > 0 && (
              <div className="p-4 glass-card rounded-2xl space-y-2">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                  <Eye className="w-4 h-4 text-amber-400" />
                  <span>Avg Views</span>
                </div>
                <div className="text-2xl font-bold text-slate-800">
                  {formatFollowersDetail(user.avg_views)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View on Platform External Link */}
        {user.url && (
          <div className="flex justify-center pt-2">
            <a
              href={user.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-purple-600 transition-colors"
            >
              Verify & View on social platform
              <ArrowLeft className="w-3 h-3 rotate-180" />
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
