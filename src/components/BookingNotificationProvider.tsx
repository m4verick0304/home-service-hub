import { useBookingNotifications } from "@/hooks/useBookingNotifications";

/**
 * Mounts the realtime booking notification listener.
 * Place inside AuthProvider so it has access to the user profile.
 */
export function BookingNotificationProvider() {
  useBookingNotifications();
  return null;
}
