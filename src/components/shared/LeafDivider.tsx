import { cn } from "@/lib/utils";

export function LeafDivider({ className }: { className?: string }) {
  return (
    <div
      className={cn("flex items-center justify-center py-8", className)}
      aria-hidden="true"
    >
      <svg
        width="120"
        height="24"
        viewBox="0 0 120 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary-300"
      >
        <path
          d="M0 12h48M72 12h48"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M56 4c4 4 8 8 4 16M64 4c-4 4-8 8-4 16"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="60" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
}
