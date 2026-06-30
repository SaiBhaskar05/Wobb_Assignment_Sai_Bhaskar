import { Check } from "lucide-react";

export function VerifiedBadge({ verified }: { verified?: boolean }) {
  if (!verified) return null;
  return (
    <span
      className="inline-flex items-center justify-center bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 rounded-full p-0.5 ml-1.5"
      title="Verified Influencer"
    >
      <Check className="w-3.5 h-3.5 stroke-[3]" />
    </span>
  );
}
