import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, Clock, Phone, User, MapPin, Hash, AlertCircle, CircleDot, ArrowRight } from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  confirmed: { icon: <CheckCircle2 className="h-12 w-12 text-green-600" />, label: "Confirmed", color: "text-green-700", bgColor: "bg-green-100" },
  ongoing: { icon: <CircleDot className="h-12 w-12 text-yellow-600 animate-pulse" />, label: "Ongoing", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  completed: { icon: <CheckCircle2 className="h-12 w-12 text-primary" />, label: "Completed", color: "text-primary", bgColor: "bg-accent" },
  cancelled: { icon: <AlertCircle className="h-12 w-12 text-destructive" />, label: "Cancelled", color: "text-destructive", bgColor: "bg-red-100" },
};

const infoItem = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md space-y-6 text-center"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${status.bgColor}`}
        >
          {status.icon}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-3xl font-extrabold text-foreground">
            {booking.status === "confirmed" ? "Booking Confirmed!" : `Booking ${status.label}`}
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            {booking.status === "confirmed" && "Your service provider is on the way"}
            {booking.status === "ongoing" && "Service is in progress"}
            {booking.status === "completed" && "Service has been completed"}
            {booking.status === "cancelled" && "This booking was cancelled"}
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/60 rounded-full px-3 py-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live updates enabled
          </div>
        </motion.div>

        {/* Booking Details */}
        <Card className="border-0 shadow-elevated text-left overflow-hidden">
          <div className="h-1 gradient-primary" />
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Status</span>
              <Badge className={`${status.bgColor} ${status.color} border-0 font-bold`}>
                {status.label}
              </Badge>
            </div>

            <motion.div
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.05, delayChildren: 0.4 }}
              className="space-y-4"
            >
              {infoItems.map(({ icon: Icon, label, value, mono }) => (
                <motion.div key={label} variants={infoItem} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/60">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-sm font-bold ${mono ? "font-mono" : ""}`}>{value}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {service && (
              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-bold">{service.name}</p>
                <p className="text-sm text-primary font-bold">{service.price_range}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-3">
          <motion.div whileTap={{ scale: 0.98 }}>
            <Button
              className="w-full h-13 font-bold rounded-2xl gradient-primary shadow-glow hover:opacity-90"
              onClick={() => navigate("/history")}
            >
              Go to Booking History
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
          <Button
            variant="outline"
            className="w-full h-12 font-semibold rounded-2xl border-primary/20"
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default BookingConfirmation;
