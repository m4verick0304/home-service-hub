import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/shared/AppHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { HelperCard } from "@/components/shared/HelperCard";
import { LeafletMap } from "@/components/shared/LeafletMap";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, Phone, MapPin, Hash, AlertCircle, CircleDot, MessageSquare } from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; title: string; subtitle: string }> = {
  confirmed: {
    icon: <CheckCircle2 className="h-8 w-8 text-[hsl(var(--sh-green))]" />,
    title: "Helper Assigned!",
    subtitle: "Your service provider is on the way",
  },
  ongoing: {
    icon: <CircleDot className="h-8 w-8 text-[hsl(var(--sh-orange))] animate-pulse" />,
    title: "Service in Progress",
    subtitle: "Your helper is currently working",
  },
  completed: {
    icon: <CheckCircle2 className="h-8 w-8 text-primary" />,
    title: "Service Completed",
    subtitle: "Thank you for using SmartHelper",
  },
  cancelled: {
    icon: <AlertCircle className="h-8 w-8 text-destructive" />,
    title: "Booking Cancelled",
    subtitle: "This booking was cancelled",
  },
};

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) return;
    supabase.from("bookings").select("*, services(*)").eq("id", bookingId).maybeSingle().then(({ data }) => {
      if (data) { setBooking(data); setService(data.services); }
    });
    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${bookingId}` }, (payload) => {
        setBooking((prev: any) => prev ? { ...prev, ...payload.new } : prev);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const status = statusConfig[booking.status] || statusConfig.confirmed;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Live Status" showBack backTo="/" variant="primary" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Status hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mb-3">
            {status.icon}
          </motion.div>
          <h1 className="text-xl font-black text-foreground tracking-tight">{status.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{status.subtitle}</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-primary bg-primary/10 rounded-full px-3 py-1.5 font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Live tracking enabled
          </div>
        </motion.div>

        {/* Live Map */}
        <LeafletMap
          className="h-[280px]"
          showHelper={booking.status !== "cancelled"}
          helperLabel={booking.provider_name?.split(" ")[0] || "Helper"}
        />

        {/* Helper Card */}
        {booking.provider_name && (
          <HelperCard
            name={booking.provider_name}
            rating={4.8}
            distance="2.3 km"
            eta={`${booking.eta_minutes} min`}
            status={booking.status === "confirmed" ? "on_the_way" : booking.status === "ongoing" ? "working" : undefined}
          />
        )}

        {/* Details */}
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.04, delayChildren: 0.2 }} className="p-5 rounded-2xl bg-card border sh-shadow space-y-4">
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Booking Details</span>
            <StatusBadge status={booking.status as any} />
          </div>
          {[
            { icon: Hash, label: "Booking ID", value: booking.id.slice(0, 8).toUpperCase(), mono: true },
            { icon: Phone, label: "Contact", value: booking.provider_phone },
            { icon: Clock, label: "ETA", value: `${booking.eta_minutes} minutes` },
            { icon: MapPin, label: "Address", value: booking.address },
          ].map(({ icon: Icon, label, value, mono }) => (
            <motion.div key={label} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }} className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted flex-shrink-0">
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                <p className={`text-sm font-bold text-foreground ${mono ? "font-mono" : ""} truncate`}>{value}</p>
              </div>
            </motion.div>
          ))}
          {service && (
            <div className="pt-3 border-t">
              <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Service</p>
              <p className="text-sm font-bold text-foreground">{service.name} — {service.price_range}</p>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-xl font-semibold" onClick={() => navigate("/history")}>
            <Clock className="h-4 w-4 mr-2" /> History
          </Button>
          <Button className="h-12 rounded-xl font-bold sh-gradient-blue border-0 text-white" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
