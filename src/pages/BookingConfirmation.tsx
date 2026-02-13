import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, Phone, User, MapPin, Hash, AlertCircle, CircleDot } from "lucide-react";

const statusConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bgColor: string }> = {
  confirmed: { icon: <CheckCircle2 className="h-12 w-12 text-green-600" />, label: "Confirmed", color: "text-green-700", bgColor: "bg-green-100" },
  ongoing: { icon: <CircleDot className="h-12 w-12 text-yellow-600 animate-pulse" />, label: "Ongoing", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  completed: { icon: <CheckCircle2 className="h-12 w-12 text-primary" />, label: "Completed", color: "text-primary", bgColor: "bg-accent" },
  cancelled: { icon: <AlertCircle className="h-12 w-12 text-destructive" />, label: "Cancelled", color: "text-destructive", bgColor: "bg-red-100" },
};

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (!bookingId) return;

    // Initial fetch
    supabase.from("bookings").select("*, services(*)").eq("id", bookingId).maybeSingle().then(({ data }) => {
      if (data) {
        setBooking(data);
        setService(data.services);
      }
    });

    // Realtime subscription
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Status Icon */}
        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${status.bgColor}`}>
          {status.icon}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {booking.status === "confirmed" ? "Booking Confirmed!" : `Booking ${status.label}`}
          </h1>
          <p className="text-muted-foreground mt-1">
            {booking.status === "confirmed" && "Your service provider is on the way"}
            {booking.status === "ongoing" && "Service is in progress"}
            {booking.status === "completed" && "Service has been completed"}
            {booking.status === "cancelled" && "This booking was cancelled"}
          </p>
          <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Live updates enabled
          </p>
        </div>

        {/* Booking Details */}
        <Card className="border-0 shadow-md text-left">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className={`${status.bgColor} ${status.color} hover:${status.bgColor} border-0`}>
                {status.label}
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Booking ID</p>
                <p className="text-sm font-mono font-semibold">{booking.id.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Service Provider</p>
                <p className="text-sm font-semibold">{booking.provider_name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm font-semibold">{booking.provider_phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Estimated Arrival</p>
                <p className="text-sm font-semibold">{booking.eta_minutes} minutes</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Service Address</p>
                <p className="text-sm font-semibold">{booking.address}</p>
              </div>
            </div>

            {service && (
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="text-sm font-semibold">{service.name}</p>
                <p className="text-xs text-primary font-medium">{service.price_range}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          className="w-full h-12 font-semibold rounded-2xl"
          onClick={() => navigate("/history")}
        >
          Go to Booking History
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 font-medium rounded-2xl"
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default BookingConfirmation;
