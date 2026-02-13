import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Calendar, Clock, MapPin, Loader2, Search,
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer, Check
} from "lucide-react";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ChefHat: <ChefHat className="h-6 w-6" />,
  Paintbrush: <Paintbrush className="h-6 w-6" />,
  Hammer: <Hammer className="h-6 w-6" />,
};

const providerNames = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh"];

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [address, setAddress] = useState(profile?.address || "");
  const [scheduling, setScheduling] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (serviceId) {
      supabase.from("services").select("*").eq("id", serviceId).maybeSingle().then(({ data }) => {
        setService(data);
      });
    }
  }, [serviceId]);

  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
  }, [profile]);

  const handleBook = async () => {
    if (!profile || !service) return;
    if (!address.trim()) {
      toast({ title: "Address required", description: "Please enter your address.", variant: "destructive" });
      return;
    }

    setSearching(true);
    await new Promise((r) => setTimeout(r, 2500));

    const providerName = providerNames[Math.floor(Math.random() * providerNames.length)];
    const eta = Math.floor(Math.random() * 30) + 15;

    const { data, error } = await supabase.from("bookings").insert({
      user_id: profile.id,
      service_id: service.id,
      address,
      provider_name: providerName,
      provider_phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      status: "confirmed",
      eta_minutes: eta,
      scheduled_at: scheduling === "later" && scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
    }).select().single();

    setSearching(false);

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else if (data) {
      navigate(`/confirmation/${data.id}`);
    }
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-foreground" />
      </div>
    );
  }

  if (searching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 bg-background">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-24 w-24 rounded-full bg-muted absolute inset-0"
          />
          <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center relative">
            <Search className="h-10 w-10 text-primary-foreground" />
          </div>
        </motion.div>
        <div className="text-center">
          <h2 className="text-xl font-black text-foreground">Finding professionals...</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Searching for the best {service.name.toLowerCase()} near you
          </p>
          <div className="flex justify-center gap-1 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="h-2 w-2 rounded-full bg-foreground"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* UC-style header */}
      <header className="uc-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-lg"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold text-white">Book {service.name}</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-6 py-8 space-y-6"
      >
        {/* Service Info Card */}
        <Card className="border shadow-uc rounded-xl overflow-hidden">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted text-foreground flex-shrink-0">
              {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-base text-foreground">{service.name}</h2>
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{service.description}</p>
              <p className="text-sm font-bold text-foreground mt-1">{service.price_range}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5" /> Service Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="h-12 rounded-lg"
          />
        </div>

        {/* Scheduling */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wide">
            <Clock className="h-3.5 w-3.5" /> When do you need it?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              className={`h-12 rounded-lg font-semibold text-sm border-2 transition-all ${
                scheduling === "now"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/30"
              }`}
              onClick={() => setScheduling("now")}
            >
              {scheduling === "now" && <Check className="inline h-4 w-4 mr-1" />}
              Right Now
            </button>
            <button
              className={`h-12 rounded-lg font-semibold text-sm border-2 transition-all flex items-center justify-center gap-1.5 ${
                scheduling === "later"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-foreground hover:border-foreground/30"
              }`}
              onClick={() => setScheduling("later")}
            >
              {scheduling === "later" && <Check className="h-4 w-4" />}
              <Calendar className="h-4 w-4" /> Schedule
            </button>
          </div>
          <AnimatePresence>
            {scheduling === "later" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Input
                  type="datetime-local"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="h-12 rounded-lg"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Book Button */}
        <Button
          className="w-full h-14 text-base font-bold rounded-xl"
          onClick={handleBook}
        >
          Book Now
        </Button>
      </motion.main>
    </div>
  );
};

export default BookService;
