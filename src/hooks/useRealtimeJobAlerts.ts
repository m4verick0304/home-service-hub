import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface JobAlert {
  id: string;
  service_id: string;
  address: string | null;
  status: string;
  created_at: string;
  scheduled_at: string | null;
  serviceName?: string;
}

export function useRealtimeJobAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([]);
  const [latestAlert, setLatestAlert] = useState<JobAlert | null>(null);

  const fetchServiceName = useCallback(async (serviceId: string): Promise<string> => {
    const { data } = await supabase
      .from("services")
      .select("name")
      .eq("id", serviceId)
      .maybeSingle();
    return data?.name || "Service Request";
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("helper-job-alerts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookings",
        },
        async (payload) => {
          const booking = payload.new as any;
          const serviceName = await fetchServiceName(booking.service_id);

          const alert: JobAlert = {
            id: booking.id,
            service_id: booking.service_id,
            address: booking.address,
            status: booking.status,
            created_at: booking.created_at,
            scheduled_at: booking.scheduled_at,
            serviceName,
          };

          setAlerts((prev) => [alert, ...prev]);
          setLatestAlert(alert);

          toast({
            title: "🔔 New Job Request!",
            description: `${serviceName} — ${booking.address || "No address"}`,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchServiceName]);

  const dismissAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    setLatestAlert((prev) => (prev?.id === id ? null : prev));
  }, []);

  return { alerts, latestAlert, dismissAlert };
}
