import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, Phone, User, MapPin, Hash, AlertCircle, CircleDot, ArrowLeft } from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  confirmed: { icon: <CheckCircle2 className="h-10 w-10" style={{ color: "hsl(145, 63%, 42%)" }} />, label: "Confirmed", color: "text-foreground", bgColor: "uc-badge-green" },
  ongoing: { icon: <CircleDot className="h-10 w-10 animate-pulse" style={{ color: "hsl(43, 96%, 56%)" }} />, label: "Ongoing", color: "text-foreground", bgColor: "uc-badge-gold" },
  completed: { icon: <CheckCircle2 className="h-10 w-10 text-primary" />, label: "Completed", color: "text-foreground", bgColor: "uc-badge-blue" },
  cancelled: { icon: <AlertCircle className="h-10 w-10 text-destructive" />, label: "Cancelled", color: "text-destructive", bgColor: "bg-destructive/10" },
};

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) return;

    supabase.from("bookings").select("*, services(*)").eq("id", bookingId).maybeSingle().then(({ data }) => {
      if (data) {
        setBooking(data);
        setService(data.services);
      }
    });

    const channel = supabase
      .channel(`booking-${bookingId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "bookings", filter: `id=eq.${bookingId}` },
        (payload) => {
          setBooking((prev: any) => (prev ? { ...prev, ...payload.new } : prev));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-foreground" />
      </div>
    );
  }

  const status = statusConfig[booking.status] || statusConfig.confirmed;

  const infoItems = [
    { icon: Hash, label: "Booking ID", value: booking.id.slice(0, 8).toUpperCase(), mono: true },
    { icon: User, label: "Service Provider", value: booking.provider_name },
    { icon: Phone, label: "Contact", value: booking.provider_phone },
    { icon: Clock, label: "Estimated Arrival", value: `${booking.eta_minutes} minutes` },
    { icon: MapPin, label: "Service Address", value: booking.address },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="uc-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-lg"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold text-white">Booking Details</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Status Card */}
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4"
            >
              {status.icon}
            </motion.div>
            <h1 className="text-2xl font-black text-foreground tracking-tight">
              {booking.status === "confirmed" ? "Booking Confirmed!" : `Booking ${status.label}`}
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              {booking.status === "confirmed" && "Your service provider is on the way"}
              {booking.status === "ongoing" && "Service is in progress"}
              {booking.status === "completed" && "Service has been completed"}
              {booking.status === "cancelled" && "This booking was cancelled"}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted rounded-full px-3 py-1.5 font-medium">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-foreground animate-pulse" style={{ backgroundColor: "hsl(145, 63%, 42%)" }} />
              Live updates enabled
            </div>
          </div>

          {/* Details Card */}
          <Card className="border shadow-uc rounded-xl overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</span>
                <Badge className={`${status.bgColor} border-0 font-bold text-xs`}>
                  {status.label}
                </Badge>
              </div>

              <motion.div
                initial="hidden"
                animate="show"
                transition={{ staggerChildren: 0.04, delayChildren: 0.2 }}
                className="space-y-4"
              >
                {infoItems.map(({ icon: Icon, label, value, mono }) => (
                  <motion.div
                    key={label}
                    variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted flex-shrink-0">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">{label}</p>
                      <p className={`text-sm font-bold text-foreground ${mono ? "font-mono" : ""} truncate`}>{value}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {service && (
                <div className="pt-4 border-t">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Service</p>
                  <p className="text-sm font-bold text-foreground">{service.name}</p>
                  <p className="text-sm font-bold text-foreground">{service.price_range}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full h-12 font-bold rounded-xl"
              onClick={() => navigate("/history")}
            >
              Go to Booking History
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 font-semibold rounded-xl"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
