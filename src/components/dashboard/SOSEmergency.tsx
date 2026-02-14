import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Flame, Zap, Wind, Bug, ArrowRight, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Service = Tables<"services">;

const emergencies = [
  { id: "pipe-burst", label: "Pipe Burst", icon: Droplets, color: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]", desc: "Water flooding", serviceMatch: "Plumber" },
  { id: "roof-leak", label: "Roof Leakage", icon: Wind, color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]", desc: "Ceiling dripping", serviceMatch: "Plumber" },
  { id: "gas-leak", label: "Gas Leak", icon: Flame, color: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]", desc: "Smell of gas", serviceMatch: "Plumber" },
  { id: "power-outage", label: "Power Outage", icon: Zap, color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]", desc: "No electricity", serviceMatch: "Electrician" },
  { id: "pest-invasion", label: "Pest Invasion", icon: Bug, color: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]", desc: "Urgent pest control", serviceMatch: "Pest Control" },
];

export const SOSEmergency = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { addToCart } = useCart();
  const [services, setServices] = useState<Service[]>([]);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  const handleSOS = async (emergencyId: string) => {
    const emergency = emergencies.find(e => e.id === emergencyId);
    if (!emergency) return;

    const matchedService = services.find(s => 
      s.name.toLowerCase() === emergency.serviceMatch.toLowerCase()
    );

    if (!matchedService) {
      toast({ title: "Service not found", description: "Please try booking manually.", variant: "destructive" });
      return;
    }

    if (!profile) {
      // Not logged in, navigate to book page
      navigate(`/book/${matchedService.id}`);
      return;
    }

    // Quick book: create urgent booking immediately
    setLoading(true);
    const { data, error } = await supabase.from("bookings").insert({
      user_id: profile.id,
      service_id: matchedService.id,
      address: profile.address || "Location to be shared",
      status: "pending",
      scheduled_at: new Date().toISOString(),
    }).select().single();

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data) {
      setBookingId(data.id);
      toast({ 
        title: `🚨 SOS: ${emergency.label}`, 
        description: `Emergency ${matchedService.name} request placed! A helper will be assigned shortly.` 
      });
      setLoading(false);
      navigate(`/confirmation/${data.id}`);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-6">
      <div className="p-4 rounded-xl border border-destructive/15 bg-destructive/[0.03]">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="h-7 w-7 rounded-lg bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-bold text-foreground tracking-wide">SOS Emergency</h3>
            <p className="text-[10px] text-muted-foreground">One-tap instant booking</p>
          </div>
          {loading && <Loader2 className="h-4 w-4 animate-spin text-destructive" />}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {emergencies.map((e, i) => (
            <motion.button
              key={e.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => handleSOS(e.id)}
              disabled={loading}
              className="flex flex-col items-center gap-1.5 min-w-[72px] p-2.5 rounded-xl border border-border bg-card hover:border-destructive/30 hover:shadow-sm transition-all group active:scale-95"
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${e.color} group-hover:scale-105 transition-transform`}>
                <e.icon className="h-4 w-4" />
              </div>
              <p className="text-[10px] font-semibold text-foreground leading-tight text-center">{e.label}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
