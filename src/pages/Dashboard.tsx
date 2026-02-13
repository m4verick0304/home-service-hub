import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { AppHeader } from "@/components/shared/AppHeader";
import { NotificationCenter } from "@/components/NotificationCenter";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  MapPin, History, Search, ChevronRight, Clock,
  Shield, Star, ArrowRight, Snowflake, Bug, Scissors,
  Settings, SprayCan, Droplets, User, GlassWater, Truck, Camera
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
      // Find matching service and navigate
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

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--sh-blue-light))] via-background to-background" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-10 md:py-16">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-muted-foreground text-sm mb-1">
              Hello, <span className="font-semibold text-foreground">{profile?.name?.split(" ")[0] || "there"}</span> 👋
            </p>
            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
              What service do you need?
            </h1>

            {/* Search bar */}
            <div className="mt-6 relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Describe your problem (e.g., 'my tap is leaking')..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSmartSearch()}
                className="h-14 pl-12 pr-28 rounded-2xl border-2 border-border bg-card text-base sh-shadow focus-visible:ring-primary"
              />
              <Button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 rounded-xl sh-gradient-blue border-0 text-white text-xs font-bold px-4"
                onClick={handleSmartSearch}
                disabled={aiLoading}
              >
                {aiLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <><Sparkles className="h-3.5 w-3.5 mr-1" /> AI Match</>}
              </Button>
            </div>

            {/* AI Suggestion */}
            <AnimatePresence>
              {aiSuggestion && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-3 max-w-lg p-4 rounded-2xl bg-primary/5 border border-primary/20"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-bold text-primary">AI Recommendation: {aiSuggestion.service_name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{aiSuggestion.explanation}</p>
                  {aiSuggestion.tips && <p className="text-xs text-muted-foreground mt-1 italic">💡 {aiSuggestion.tips}</p>}
                  {(() => {
                    const match = services.find(s => s.name.toLowerCase() === aiSuggestion.service_name?.toLowerCase());
                    return match ? (
                      <Button size="sm" className="mt-2 h-8 rounded-xl sh-gradient-blue border-0 text-white text-xs font-bold" onClick={() => navigate(`/book/${match.id}`)}>
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

      {/* Quick Info Banner */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-2 mb-6">
        <div className="flex items-center gap-6 p-4 rounded-2xl bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Clock className="h-4 w-4" />
            <span>~15 min response</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Shield className="h-4 w-4" />
            <span>Verified helpers</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-primary">
            <Star className="h-4 w-4" />
            <span>4.8+ rated</span>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">All Services</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} available</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Search className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No services found</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Try a different search term</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {filtered.map((service) => (
              <motion.div
                key={service.id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              >
                <button
                  className="w-full group cursor-pointer text-left"
                  onClick={() => navigate(`/book/${service.id}`)}
                >
                  <div className="p-5 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col items-center gap-3">
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colorMap[service.icon || ""] || "bg-muted text-foreground"} group-hover:scale-110 transition-transform`}>
                      {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-bold text-foreground block">{service.name}</span>
                      {service.price_range && (
                        <span className="text-xs text-muted-foreground mt-0.5 block">{service.price_range}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Book Now <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Quick Actions */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-10">
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/history")}
            className="flex items-center gap-4 p-5 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-all group text-left"
          >
            <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--sh-blue-light))] flex items-center justify-center flex-shrink-0">
              <History className="h-6 w-6 text-[hsl(var(--sh-blue))]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">Booking History</p>
              <p className="text-xs text-muted-foreground mt-0.5">View past & active bookings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-4 p-5 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-all group text-left"
          >
            <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--sh-purple-light))] flex items-center justify-center flex-shrink-0">
              <MapPin className="h-6 w-6 text-[hsl(var(--sh-purple))]" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-foreground text-sm">My Profile</p>
              <p className="text-xs text-muted-foreground mt-0.5">Manage address & details</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 mt-8">
        <div className="mx-auto max-w-5xl px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md sh-gradient-blue text-white text-[8px] font-black flex items-center justify-center">SH</div>
            <span className="text-xs font-semibold text-muted-foreground">SmartHelper</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SIH Project</p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
