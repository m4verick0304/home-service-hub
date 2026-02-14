import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { AppHeader } from "@/components/shared/AppHeader";
import { NotificationCenter } from "@/components/NotificationCenter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  MapPin, History, Search, ChevronRight, Clock,
  Shield, Star, ArrowRight, Snowflake, Bug, Scissors,
  Settings, SprayCan, Droplets, User, GlassWater, Truck, Camera
} from "lucide-react";
import { SOSEmergency } from "@/components/dashboard/SOSEmergency";
import { OfferZone } from "@/components/dashboard/OfferZone";
import { BankOffers } from "@/components/dashboard/BankOffers";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-5 w-5" />,
  Wrench: <Wrench className="h-5 w-5" />,
  Zap: <Zap className="h-5 w-5" />,
  ChefHat: <ChefHat className="h-5 w-5" />,
  Paintbrush: <Paintbrush className="h-5 w-5" />,
  Hammer: <Hammer className="h-5 w-5" />,
  Snowflake: <Snowflake className="h-5 w-5" />,
  Bug: <Bug className="h-5 w-5" />,
  Scissors: <Scissors className="h-5 w-5" />,
  Settings: <Settings className="h-5 w-5" />,
  SprayCan: <SprayCan className="h-5 w-5" />,
  Droplets: <Droplets className="h-5 w-5" />,
  User: <User className="h-5 w-5" />,
  GlassWater: <GlassWater className="h-5 w-5" />,
  Truck: <Truck className="h-5 w-5" />,
  Camera: <Camera className="h-5 w-5" />,
};

const colorMap: Record<string, string> = {
  Sparkles: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
  Wrench: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Zap: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  ChefHat: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]",
  Paintbrush: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  Hammer: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  Snowflake: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Bug: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]",
  Scissors: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  Settings: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  SprayCan: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
  Droplets: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  User: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  GlassWater: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Truck: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  Camera: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
};

const Dashboard = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<{ service_name: string; explanation: string; tips: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle SOS redirect — pre-fill search
  useEffect(() => {
    const sos = searchParams.get("sos");
    if (sos) setSearchQuery(sos);
  }, [searchParams]);

  const handleSmartSearch = async () => {
    if (!searchQuery.trim() || searchQuery.length < 5) return;
    setAiLoading(true);
    setAiSuggestion(null);
    try {
      const { data, error } = await supabase.functions.invoke("smart-match", {
        body: { description: searchQuery },
      });
      if (error) throw error;
      setAiSuggestion(data);
      const match = services.find(s => s.name.toLowerCase() === data.service_name?.toLowerCase());
      if (match) {
        toast({ title: `AI recommends: ${match.name}`, description: data.explanation });
      }
    } catch (err) {
      console.error(err);
    }
    setAiLoading(false);
  };

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const filtered = services.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        rightContent={
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <NotificationCenter />
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl hidden sm:flex"
              onClick={() => navigate("/history")}
            >
              <History className="h-4 w-4 mr-1.5" />
              Bookings
            </Button>
          </div>
        }
        initials={initials}
        profilePath="/profile"
      />

      {/* Compact Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--sh-blue-light))]/50 to-background" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-6 md:py-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className="text-muted-foreground text-xs">
              Hello, <span className="font-semibold text-foreground">{profile?.name?.split(" ")[0] || "there"}</span> 👋
            </p>
            <h1 className="text-xl md:text-3xl font-black text-foreground tracking-tight mt-0.5">
              What service do you need?
            </h1>

            {/* Search */}
            <div className="mt-4 relative max-w-lg">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a service or describe your problem..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSmartSearch()}
                className="h-11 pl-10 pr-24 rounded-xl border bg-card text-sm sh-shadow focus-visible:ring-primary"
              />
              <Button
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 rounded-lg sh-gradient-blue border-0 text-white text-[10px] font-bold px-3"
                onClick={handleSmartSearch}
                disabled={aiLoading}
              >
                {aiLoading ? <Sparkles className="h-3.5 w-3.5 animate-spin" /> : <><Sparkles className="h-3 w-3 mr-1" /> AI Match</>}
              </Button>
            </div>

            {/* AI Suggestion */}
            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 max-w-lg p-3 rounded-xl bg-primary/5 border border-primary/15"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-bold text-primary">{aiSuggestion.service_name}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{aiSuggestion.explanation}</p>
                  {(() => {
                    const match = services.find(s => s.name.toLowerCase() === aiSuggestion.service_name?.toLowerCase());
                    return match ? (
                      <Button size="sm" className="mt-2 h-7 rounded-lg sh-gradient-blue border-0 text-white text-[10px] font-bold" onClick={() => navigate(`/book/${match.id}`)}>
                        Book {match.name} <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    ) : null;
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Quick Info */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 mb-5">
        <div className="flex items-center gap-4 py-2.5 px-3 rounded-lg bg-primary/[0.04] border border-primary/10">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
            <Clock className="h-3.5 w-3.5" /> ~15 min
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
            <Shield className="h-3.5 w-3.5" /> Verified
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary">
            <Star className="h-3.5 w-3.5" /> 4.8+ rated
          </div>
        </div>
      </div>

      {/* SOS Emergency */}
      <SOSEmergency />

      {/* Offer Zone */}
      <OfferZone />

      {/* Bank Offers */}
      <BankOffers />

      {/* Services Grid */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">All Services</h2>
          <span className="text-[10px] text-muted-foreground">{filtered.length} available</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <Search className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground font-medium">No services found</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
            className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              >
                <button
                  className="w-full group cursor-pointer text-left"
                  onClick={() => navigate(`/book/${service.id}`)}
                >
                  <div className="p-3 rounded-xl bg-card border hover:sh-shadow transition-all duration-200 hover:-translate-y-0.5 flex flex-col items-center gap-2">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${colorMap[service.icon || ""] || "bg-muted text-foreground"} group-hover:scale-105 transition-transform`}>
                      {iconMap[service.icon || ""] || <Sparkles className="h-5 w-5" />}
                    </div>
                    <div className="text-center">
                      <span className="text-[11px] font-semibold text-foreground block leading-tight">{service.name}</span>
                      {service.price_range && (
                        <span className="text-[9px] text-muted-foreground mt-0.5 block">{service.price_range}</span>
                      )}
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-card border hover:sh-shadow transition-all group text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--sh-blue-light))] flex items-center justify-center flex-shrink-0">
              <History className="h-5 w-5 text-[hsl(var(--sh-blue))]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-xs">Bookings</p>
              <p className="text-[10px] text-muted-foreground">View history</p>
            </div>
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-3 p-3.5 rounded-xl bg-card border hover:sh-shadow transition-all group text-left"
          >
            <div className="h-10 w-10 rounded-xl bg-[hsl(var(--sh-purple-light))] flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-[hsl(var(--sh-purple))]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-foreground text-xs">Profile</p>
              <p className="text-[10px] text-muted-foreground">Address & details</p>
            </div>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-4">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="h-5 w-5 rounded sh-gradient-blue text-white text-[7px] font-black flex items-center justify-center">SH</div>
            <span className="text-[10px] font-semibold text-muted-foreground">SmartHelper</span>
          </div>
          <p className="text-[10px] text-muted-foreground">© 2026 SIH Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
