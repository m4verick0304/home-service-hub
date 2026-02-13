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
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer
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
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (searching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="h-28 w-28 rounded-full bg-primary/20 absolute inset-0"
          />
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0.1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            className="h-28 w-28 rounded-full bg-primary/15 absolute inset-0"
          />
          <div className="h-28 w-28 rounded-full gradient-primary flex items-center justify-center relative shadow-glow">
            <Search className="h-12 w-12 text-primary-foreground" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-extrabold text-foreground">Finding providers...</h2>
          <p className="text-muted-foreground mt-2 font-medium">Searching for the best {service.name.toLowerCase()} near you</p>
          <div className="flex justify-center gap-1.5 mt-4">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                className="h-2.5 w-2.5 rounded-full bg-primary"
              />
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b glass">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-extrabold">Book {service.name}</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-4 py-6 space-y-6"
      >
        {/* Service Info */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-1 gradient-primary" />
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-lg text-foreground">{service.name}</h2>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <p className="text-base font-bold text-primary mt-1">{service.price_range}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 font-semibold">
            <MapPin className="h-4 w-4 text-primary" /> Service Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="h-13 rounded-xl bg-muted/50 border-0 text-base focus-visible:ring-primary/30"
          />
        </div>

        {/* Scheduling */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 font-semibold">
            <Clock className="h-4 w-4 text-primary" /> When do you need it?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                variant={scheduling === "now" ? "default" : "outline"}
                className={`w-full h-13 rounded-xl font-bold ${scheduling === "now" ? "gradient-primary shadow-glow" : "border-primary/20"}`}
                onClick={() => setScheduling("now")}
              >
                ⚡ Right Now
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button
                variant={scheduling === "later" ? "default" : "outline"}
                className={`w-full h-13 rounded-xl font-bold ${scheduling === "later" ? "gradient-primary shadow-glow" : "border-primary/20"}`}
                onClick={() => setScheduling("later")}
              >
                <Calendar className="mr-2 h-4 w-4" /> Schedule
              </Button>
            </motion.div>
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
                  className="h-13 rounded-xl bg-muted/50 border-0"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Book Button */}
        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-14 text-lg font-extrabold rounded-2xl gradient-primary shadow-glow hover:opacity-90 transition-opacity"
            onClick={handleBook}
          >
            Book Now
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default BookService;
