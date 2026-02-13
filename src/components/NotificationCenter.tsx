import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: Date;
  read: boolean;
  status: string;
}

const statusEmoji: Record<string, string> = {
  confirmed: "✅",
  en_route: "🚗",
  arrived: "📍",
  ongoing: "🔧",
  completed: "🎉",
  cancelled: "❌",
};

const statusLabel: Record<string, string> = {
  confirmed: "Helper Assigned",
  en_route: "Helper En Route",
  arrived: "Helper Arrived",
  ongoing: "Service Started",
  completed: "Service Completed",
  cancelled: "Booking Cancelled",
};

export function NotificationCenter() {
  const { profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const prevStatuses = useRef<Map<string, string>>(new Map());
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!profile) return;

    // Seed current statuses
    supabase
      .from("bookings")
      .select("id, status")
      .eq("user_id", profile.id)
      .then(({ data }) => {
        data?.forEach((b) => prevStatuses.current.set(b.id, b.status));
      });

    const channel = supabase
      .channel("notification-center")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings" },
        (payload) => {
          const booking = payload.new as { id: string; status: string; provider_name: string | null };
          const oldStatus = prevStatuses.current.get(booking.id);

          if (oldStatus && oldStatus !== booking.status && statusLabel[booking.status]) {
            const newNotif: NotificationItem = {
              id: `${booking.id}-${booking.status}-${Date.now()}`,
              title: `${statusEmoji[booking.status] || "📋"} ${statusLabel[booking.status]}`,
              description: booking.provider_name
                ? `${booking.provider_name} — Booking #${booking.id.slice(0, 6).toUpperCase()}`
                : `Booking #${booking.id.slice(0, 6).toUpperCase()}`,
              time: new Date(),
              read: false,
              status: booking.status,
            };
            setNotifications(prev => [newNotif, ...prev].slice(0, 20));
          }
          prevStatuses.current.set(booking.id, booking.status);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-xl h-9 w-9 text-white/80 hover:text-white hover:bg-white/10"
        onClick={() => { setOpen(o => !o); }}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-card border sh-shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-primary font-semibold hover:underline">
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-10 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-0.5">You'll see booking updates here</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors",
                      !notif.read && "bg-primary/5"
                    )}
                  >
                    <div className="flex-shrink-0 text-lg mt-0.5">
                      {statusEmoji[notif.status] || "📋"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm truncate", !notif.read ? "font-bold text-foreground" : "font-medium text-foreground")}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{notif.description}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">
                      {timeAgo(notif.time)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
