import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "available" | "busy" | "assigned" | "searching" | "online" | "offline" | "confirmed" | "ongoing" | "completed" | "cancelled" | "on_the_way" | "working";
  className?: string;
  pulse?: boolean;
}

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
  available: { bg: "bg-[hsl(var(--sh-green-light))]", text: "text-[hsl(var(--sh-green))]", dot: "bg-[hsl(var(--sh-green))]" },
  online: { bg: "bg-[hsl(var(--sh-green-light))]", text: "text-[hsl(var(--sh-green))]", dot: "bg-[hsl(var(--sh-green))]" },
  busy: { bg: "bg-[hsl(var(--sh-orange-light))]", text: "text-[hsl(var(--sh-orange))]", dot: "bg-[hsl(var(--sh-orange))]" },
  assigned: { bg: "bg-[hsl(var(--sh-blue-light))]", text: "text-[hsl(var(--sh-blue))]", dot: "bg-[hsl(var(--sh-blue))]" },
  searching: { bg: "bg-[hsl(var(--sh-purple-light))]", text: "text-[hsl(var(--sh-purple))]", dot: "bg-[hsl(var(--sh-purple))]" },
  confirmed: { bg: "bg-[hsl(var(--sh-blue-light))]", text: "text-[hsl(var(--sh-blue))]", dot: "bg-[hsl(var(--sh-blue))]" },
  ongoing: { bg: "bg-[hsl(var(--sh-orange-light))]", text: "text-[hsl(var(--sh-orange))]", dot: "bg-[hsl(var(--sh-orange))]" },
  on_the_way: { bg: "bg-[hsl(var(--sh-orange-light))]", text: "text-[hsl(var(--sh-orange))]", dot: "bg-[hsl(var(--sh-orange))]" },
  working: { bg: "bg-[hsl(var(--sh-purple-light))]", text: "text-[hsl(var(--sh-purple))]", dot: "bg-[hsl(var(--sh-purple))]" },
  completed: { bg: "bg-[hsl(var(--sh-green-light))]", text: "text-[hsl(var(--sh-green))]", dot: "bg-[hsl(var(--sh-green))]" },
  cancelled: { bg: "bg-[hsl(var(--sh-red-light))]", text: "text-[hsl(var(--sh-red))]", dot: "bg-[hsl(var(--sh-red))]" },
  offline: { bg: "bg-muted", text: "text-muted-foreground", dot: "bg-muted-foreground" },
};

const statusLabels: Record<string, string> = {
  available: "Available",
  online: "Online",
  busy: "Busy",
  assigned: "Assigned",
  searching: "Searching",
  confirmed: "Confirmed",
  ongoing: "Ongoing",
  on_the_way: "On the Way",
  working: "Working",
  completed: "Completed",
  cancelled: "Cancelled",
  offline: "Offline",
};

export function StatusBadge({ status, className, pulse = false }: StatusBadgeProps) {
  const style = statusStyles[status] || statusStyles.offline;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold", style.bg, style.text, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", style.dot, pulse && "animate-pulse")} />
      {statusLabels[status] || status}
    </span>
  );
}
