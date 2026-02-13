import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, Phone, User, MapPin, Hash } from "lucide-react";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [service, setService] = useState<any>(null);

  useEffect(() => {
    if (bookingId) {
      supabase.from("bookings").select("*, services(*)").eq("id", bookingId).maybeSingle().then(({ data }) => {
        if (data) {
          setBooking(data);
          setService(data.services);
        }
      });
    }
  }, [bookingId]);

  if (!booking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-6 text-center">
        {/* Success Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-12 w-12 text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Booking Confirmed!</h1>
          <p className="text-muted-foreground mt-1">Your service provider is on the way</p>
        </div>

        {/* Booking Details */}
        <Card className="border-0 shadow-md text-left">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-0">
                Confirmed
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
