import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

interface MapPlaceholderProps {
  className?: string;
  showHelper?: boolean;
  helperLabel?: string;
  userLabel?: string;
}

export function MapPlaceholder({ className, showHelper = false, helperLabel = "Helper", userLabel = "You" }: MapPlaceholderProps) {
  return (
    <div className={cn("relative w-full rounded-2xl overflow-hidden bg-[hsl(var(--sh-blue-light))] border", className)} style={{ minHeight: 200 }}>
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(220, 90%, 56%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Roads */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-[hsl(var(--sh-blue))]/20 -translate-y-1/2" />
        <div className="absolute top-0 bottom-0 left-1/3 w-[2px] bg-[hsl(var(--sh-blue))]/20" />
        <div className="absolute top-0 bottom-0 right-1/3 w-[2px] bg-[hsl(var(--sh-blue))]/20" />
        <div className="absolute top-1/3 left-0 right-0 h-[2px] bg-[hsl(var(--sh-blue))]/10" />
      </div>

      {/* User marker */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="absolute bottom-1/3 right-1/3 flex flex-col items-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-primary/20 sh-pulse-ring" />
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center sh-shadow-md relative z-10">
            <MapPin className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>
        <span className="mt-1 text-[10px] font-bold bg-card px-2 py-0.5 rounded-full sh-shadow text-foreground">{userLabel}</span>
      </motion.div>

      {/* Helper marker */}
      {showHelper && (
        <motion.div
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="absolute top-1/3 left-1/4 flex flex-col items-center"
        >
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--sh-green))] flex items-center justify-center sh-shadow-md">
            <Navigation className="h-5 w-5 text-white" />
          </div>
          <span className="mt-1 text-[10px] font-bold bg-card px-2 py-0.5 rounded-full sh-shadow text-foreground">{helperLabel}</span>
        </motion.div>
      )}

      {/* Dotted route line */}
      {showHelper && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.line
            x1="30%" y1="40%" x2="62%" y2="60%"
            stroke="hsl(220, 90%, 56%)"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        </svg>
      )}
    </div>
  );
}
