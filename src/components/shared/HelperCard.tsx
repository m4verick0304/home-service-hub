import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Clock } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";

interface HelperCardProps {
  name: string;
  rating: number;
  distance?: string;
  eta?: string;
  skill?: string;
  status?: "available" | "busy" | "assigned" | "on_the_way" | "working";
  className?: string;
  compact?: boolean;
}

export function HelperCard({ name, rating, distance, eta, skill, status, className, compact = false }: HelperCardProps) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className={cn("flex items-center gap-4 p-4 rounded-2xl bg-card border sh-shadow", compact && "p-3", className)}>
      <Avatar className={cn("border-2 border-primary/10", compact ? "h-10 w-10" : "h-12 w-12")}>
        <AvatarFallback className="bg-primary/5 text-primary font-bold text-sm">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h4 className={cn("font-bold text-foreground truncate", compact ? "text-sm" : "text-base")}>{name}</h4>
          {status && <StatusBadge status={status} />}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[hsl(var(--sh-orange))] text-[hsl(var(--sh-orange))]" />
            {rating.toFixed(1)}
          </span>
          {distance && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {distance}
            </span>
          )}
          {eta && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {eta}
            </span>
          )}
          {skill && (
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{skill}</span>
          )}
        </div>
      </div>
    </div>
  );
}
