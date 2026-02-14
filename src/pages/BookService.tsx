import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/shared/AppHeader";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, Clock, MapPin, Loader2, Search,
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer, Check, Shield,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets, User, GlassWater, Truck, Camera,
  LocateFixed, ShoppingCart
} from "lucide-react";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ChefHat: <ChefHat className="h-6 w-6" />,
  Paintbrush: <Paintbrush className="h-6 w-6" />,
  Hammer: <Hammer className="h-6 w-6" />,
  Snowflake: <Snowflake className="h-6 w-6" />,
  Bug: <Bug className="h-6 w-6" />,
  Scissors: <Scissors className="h-6 w-6" />,
  Settings: <Settings className="h-6 w-6" />,
  SprayCan: <SprayCan className="h-6 w-6" />,
  Droplets: <Droplets className="h-6 w-6" />,
  User: <User className="h-6 w-6" />,
  GlassWater: <GlassWater className="h-6 w-6" />,
  Truck: <Truck className="h-6 w-6" />,
  Camera: <Camera className="h-6 w-6" />,
};

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [service, setService] = useState<Service | null>(null);
  const [address, setAddress] = useState(profile?.address || "");
  const [scheduling, setScheduling] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [searching, setSearching] = useState(false);
  const [waitingForHelper, setWaitingForHelper] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "GPS not supported", description: "Your browser doesn't support geolocation.", variant: "destructive" });
      return;
    }
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          if (data.display_name) {
            setAddress(data.display_name);
            toast({ title: "Location detected", description: "Your address has been auto-filled." });
          }
        } catch {
          setAddress(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        toast({ title: "Location error", description: error.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (serviceId) {
      supabase.from("services").select("*").eq("id", serviceId).maybeSingle().then(({ data }) => setService(data));
    }
  }, [serviceId]);

  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
  }, [profile]);

  // Listen for helper acceptance (status change from pending to confirmed)
  useEffect(() => {
    if (!currentBookingId || !waitingForHelper) return;

    const channel = supabase
      .channel(`booking-accept-${currentBookingId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "bookings",
        filter: `id=eq.${currentBookingId}`,
      }, (payload) => {
        const newStatus = (payload.new as any).status;
        if (newStatus === "confirmed") {
          setWaitingForHelper(false);
          setSearching(false);
          navigate(`/confirmation/${currentBookingId}`);
        } else if (newStatus === "cancelled") {
          setWaitingForHelper(false);
          setSearching(false);
          toast({ title: "Booking cancelled", description: "The booking was cancelled.", variant: "destructive" });
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentBookingId, waitingForHelper, navigate]);

  const handleBook = async () => {
    if (!profile || !service) return;
    if (!address.trim()) {
      toast({ title: "Address required", description: "Please enter your address.", variant: "destructive" });
      return;
    }
    setSearching(true);

    // Create booking with "pending" status — waits for helper to accept
    const bookingPayload: any = {
      user_id: profile.id,
      service_id: service.id,
      address,
      status: "pending",
      scheduled_at: scheduling === "later" && scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
    };

    if (userCoords) {
      bookingPayload.latitude = userCoords.lat;
      bookingPayload.longitude = userCoords.lng;
    }

    const { data, error } = await supabase.from("bookings").insert(bookingPayload).select().single();

    if (error) {
      setSearching(false);
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else if (data) {
      setCurrentBookingId(data.id);
      setWaitingForHelper(true);
    }
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (searching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-background">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative">
          <motion.div animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="h-28 w-28 rounded-full bg-primary/20 absolute inset-0" />
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} className="h-28 w-28 rounded-full bg-primary/10 absolute inset-0" />
          <div className="h-28 w-28 rounded-full sh-gradient-blue flex items-center justify-center relative sh-shadow-lg">
            <Search className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-black text-foreground">
            {waitingForHelper ? "Waiting for helper to accept..." : "Finding nearest helper..."}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            {waitingForHelper
              ? "A helper has been notified. They'll accept your request shortly."
              : `Searching for the best ${service.name.toLowerCase()} near you`}
          </p>
          <div className="flex justify-center gap-1.5 mt-5">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} className="h-2.5 w-2.5 rounded-full bg-primary" />
            ))}
          </div>
          {waitingForHelper && (
            <Button
              variant="outline"
              className="mt-6 rounded-xl"
              onClick={async () => {
                if (currentBookingId) {
                  await supabase.from("bookings").update({ status: "cancelled" }).eq("id", currentBookingId);
                }
                setSearching(false);
                setWaitingForHelper(false);
                setCurrentBookingId(null);
                toast({ title: "Booking cancelled" });
              }}
            >
              Cancel Request
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title={`Book ${service.name}`} showBack variant="primary" />

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Service Card */}
        <div className="flex items-center gap-4 p-5 rounded-2xl bg-card border sh-shadow">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-base text-foreground">{service.name}</h2>
            <p className="text-sm text-muted-foreground truncate">{service.description}</p>
            <p className="text-sm font-bold text-primary mt-1">{service.price_range}</p>
          </div>
        </div>

        {/* Map */}
        <div className="relative">
          <MapPlaceholder className="h-[200px]" />
          {userCoords && (
            <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs font-medium text-foreground border sh-shadow">
              📍 {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
            </div>
          )}
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Service Address
          </Label>
          <div className="flex gap-2">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full address" className="h-12 rounded-xl flex-1" />
            <Button
              type="button"
              variant="outline"
              className="h-12 px-4 rounded-xl shrink-0"
              onClick={detectLocation}
              disabled={detectingLocation}
            >
              {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Scheduling */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
            <Clock className="h-3.5 w-3.5 text-primary" /> When do you need it?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            {(["now", "later"] as const).map(opt => (
              <button
                key={opt}
                className={`h-12 rounded-xl font-semibold text-sm border-2 transition-all flex items-center justify-center gap-2 ${scheduling === opt
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-primary/30"
                  }`}
                onClick={() => setScheduling(opt)}
              >
                {scheduling === opt && <Check className="h-4 w-4" />}
                {opt === "now" ? "Right Now" : <><Calendar className="h-4 w-4" /> Schedule</>}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {scheduling === "later" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Input type="datetime-local" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="h-12 rounded-xl" min={new Date().toISOString().slice(0, 16)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sh-green-light))] border border-[hsl(var(--sh-green))]/20">
          <Shield className="h-5 w-5 text-[hsl(var(--sh-green))] flex-shrink-0" />
          <p className="text-xs text-[hsl(var(--sh-green))] font-medium">All helpers are verified and background-checked</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 text-base font-bold rounded-2xl"
            onClick={() => {
              if (service) {
                addToCart(service);
                toast({ title: "Added to cart!", description: `${service.name} has been added.` });
              }
            }}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
          <Button className="flex-1 h-14 text-base font-bold rounded-2xl sh-gradient-blue border-0 text-white sh-shadow-md hover:opacity-90 transition-opacity" onClick={handleBook}>
            Book Now
          </Button>
        </div>
      </motion.main>
    </div>
  );
};

export default BookService;
