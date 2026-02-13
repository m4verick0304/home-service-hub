import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

interface BookingPayload {
  id: string;
  status: string;
  provider_name: string | null;
  eta_minutes: number | null;
  address: string | null;
  service_id: string;
}

const statusMessages: Record<string, { title: string; description: (b: BookingPayload) => string; icon: string }> = {
  confirmed: {
    title: "✅ Helper Assigned!",
    description: (b) => `${b.provider_name || "A helper"} has been assigned and is preparing to head your way.`,
    icon: "confirmed",
  },
  en_route: {
    title: "🚗 Helper En Route!",
    description: (b) => `${b.provider_name || "Your helper"} is on the way — ETA ${b.eta_minutes || "~15"} min.`,
    icon: "en_route",
  },
  arrived: {
    title: "📍 Helper Arrived!",
    description: (b) => `${b.provider_name || "Your helper"} has arrived at ${b.address || "your location"}.`,
    icon: "arrived",
  },
  ongoing: {
    title: "🔧 Service Started",
    description: (b) => `${b.provider_name || "Your helper"} has started working on your service.`,
    icon: "ongoing",
  },
  completed: {
    title: "🎉 Service Completed!",
    description: () => "Your service has been completed. Please rate your experience!",
    icon: "completed",
  },
  cancelled: {
    title: "❌ Booking Cancelled",
    description: () => "Your booking has been cancelled.",
    icon: "cancelled",
  },
};

export function useBookingNotifications() {
  const { profile } = useAuth();
  const prevStatuses = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    if (!profile) return;

    // Seed current statuses to avoid false alerts on mount
    supabase
      .from("bookings")
      .select("id, status")
      .eq("user_id", profile.id)
      .then(({ data }) => {
        data?.forEach((b) => prevStatuses.current.set(b.id, b.status));
      });

    const channel = supabase
      .channel("booking-status-notifications")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const booking = payload.new as BookingPayload;
          const oldStatus = prevStatuses.current.get(booking.id);

          // Only notify if the status actually changed
          if (oldStatus && oldStatus !== booking.status) {
            const msg = statusMessages[booking.status];
            if (msg) {
              toast({
                title: msg.title,
                description: msg.description(booking),
                duration: 6000,
              });

              // Browser notification if permitted
              if ("Notification" in window && Notification.permission === "granted") {
                new Notification(msg.title, {
                  body: msg.description(booking),
                  icon: "/favicon.ico",
                });
              }
            }
          }
          prevStatuses.current.set(booking.id, booking.status);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        (payload) => {
          const booking = payload.new as BookingPayload;
          prevStatuses.current.set(booking.id, booking.status);
        }
      )
      .subscribe();

    // Request browser notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);
}
