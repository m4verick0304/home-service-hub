import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, Clock, Star, MapPin, ArrowRight,
  Wrench, Sparkles, ChefHat, Paintbrush, Hammer,
  Users, CheckCircle2, Headphones, Search,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera, ChevronRight, X,
  ShoppingCart, History, Globe
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import ucSalon from "@/assets/uc-salon.jpg";
import ucCleaning from "@/assets/uc-cleaning.jpg";
import ucAcRepair from "@/assets/uc-ac-repair.jpg";
import ucPlumber from "@/assets/uc-plumber.jpg";

type Service = Tables<"services">;

const iconMap: Record<string, any> = {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera,
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

const reviews = [
  { name: "Priya S.", rating: 5, text: "Amazing service! The plumber arrived in 12 minutes and fixed everything perfectly.", service: "Plumber" },
  { name: "Rahul M.", rating: 5, text: "Best cleaning service I've used. Professional, thorough and on time.", service: "Deep Cleaning" },
  { name: "Anita K.", rating: 4, text: "Quick AC repair. The technician was knowledgeable and friendly.", service: "AC Repair" },
  { name: "Vikram P.", rating: 5, text: "Pest control was very effective. No cockroaches since the treatment!", service: "Pest Control" },
];

const Index = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [locationName, setLocationName] = useState("Detect Location");
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [langOpen, setLangOpen] = useState(false);

  const languages = [
    { code: "EN", label: "English" },
    { code: "HI", label: "हिन्दी" },
    { code: "TA", label: "தமிழ்" },
    { code: "TE", label: "తెలుగు" },
    { code: "BN", label: "বাংলা" },
  ];

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.suburb || data.address?.state_district || "Your Area";
          setLocationName(city);
        } catch {
          setLocationName("Location detected");
        }
        setDetectingLocation(false);
      },
      () => {
        setLocationName("Location unavailable");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  // Sequential character matching: search filters services whose name starts with typed letters in sequence
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return services.filter((s) => {
      const name = s.name.toLowerCase();
      // Check if name starts with the query (prefix match)
      if (name.startsWith(q)) return true;
      // Also check word-start matching (e.g. "ac" matches "AC Repair")
      const words = name.split(/\s+/);
      return words.some(w => w.startsWith(q));
    });
  }, [searchQuery, services]);

  const handleServiceClick = (serviceId?: string) => {
    if (session) {
      navigate(serviceId ? `/book/${serviceId}` : "/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl sh-gradient-blue text-white text-[10px] font-black tracking-wider">SH</div>
              <span className="text-lg font-extrabold tracking-tight text-foreground hidden sm:block">SmartHelper</span>
            </div>
            <button
              onClick={detectLocation}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border hover:bg-muted transition-colors text-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground truncate max-w-[140px]">
                {detectingLocation ? "Detecting…" : locationName}
              </span>
              <ChevronRight className="h-3 w-3 text-muted-foreground rotate-90" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border hover:bg-muted transition-colors text-sm font-medium text-foreground"
              >
                <Globe className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold">{language}</span>
                <ChevronRight className={`h-3 w-3 text-muted-foreground transition-transform ${langOpen ? "rotate-[270deg]" : "rotate-90"}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-card border rounded-xl sh-shadow-lg overflow-hidden z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-3.5 py-2 text-sm hover:bg-muted transition-colors flex items-center justify-between ${language === lang.code ? "font-bold text-primary" : "text-foreground"}`}
                    >
                      <span>{lang.label}</span>
                      <span className="text-[10px] text-muted-foreground">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => session ? navigate("/history") : navigate("/auth")}
              title="Cart"
            >
              <ShoppingCart className="h-4 w-4 text-foreground" />
            </Button>

            {/* History */}
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full h-9 w-9"
              onClick={() => session ? navigate("/history") : navigate("/auth")}
              title="Booking History"
            >
              <History className="h-4 w-4 text-foreground" />
            </Button>

            <ThemeToggle variant="white" />
            {session ? (
              <Button className="rounded-full text-sm font-bold sh-gradient-blue border-0 text-white px-5" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-semibold rounded-full hidden sm:flex" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button className="rounded-full text-sm font-bold sh-gradient-blue border-0 text-white px-5" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl sm:text-5xl md:text-[56px] font-black text-foreground leading-[1.1] tracking-tight"
              >
                Home services,{" "}
                <span className="text-primary">delivered.</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-4 text-lg text-muted-foreground max-w-md leading-relaxed"
              >
                Book trusted professionals for any home service. Auto-matched. GPS-tracked. Done.
              </motion.p>

              {/* Search bar with live results */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 relative max-w-lg"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Search services… e.g. 'plumber', 'cleaning'"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="h-14 pl-12 pr-12 rounded-2xl border-2 border-border bg-card text-base sh-shadow-md focus-visible:ring-primary focus-visible:border-primary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground z-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Live search dropdown */}
                <AnimatePresence>
                  {searchQuery.trim() && searchFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="absolute top-full mt-2 left-0 right-0 bg-card border rounded-2xl sh-shadow-lg overflow-hidden z-50"
                    >
                      {filteredServices.length > 0 ? (
                        filteredServices.map((svc) => {
                          const IconComp = iconMap[svc.icon || ""] || Sparkles;
                          return (
                            <button
                              key={svc.id}
                              onMouseDown={() => handleServiceClick(svc.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
                            >
                              <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${colorMap[svc.icon || ""] || "bg-muted text-foreground"}`}>
                                <IconComp className="h-5 w-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-foreground">{svc.name}</p>
                                <p className="text-xs text-muted-foreground">{svc.price_range}</p>
                              </div>
                              <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <p className="text-sm text-muted-foreground">No services matching "<span className="font-semibold text-foreground">{searchQuery}</span>"</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-8 mt-10"
              >
                {[
                  { icon: Star, value: "4.8", label: "Service Rating" },
                  { icon: Users, value: "12M+", label: "Happy Customers" },
                  { icon: Clock, value: "~15 min", label: "Avg. Response" },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2.5">
                    <stat.icon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-lg font-black text-foreground leading-none">{stat.value}</p>
                      <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Image collage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-3 h-[480px]"
            >
              <div className="space-y-3">
                <div className="rounded-3xl overflow-hidden h-[55%]">
                  <img src={ucSalon} alt="Salon services" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden h-[calc(45%-12px)]">
                  <img src={ucCleaning} alt="Cleaning services" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="rounded-3xl overflow-hidden h-[calc(45%-12px)]">
                  <img src={ucPlumber} alt="Plumbing services" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-3xl overflow-hidden h-[55%]">
                  <img src={ucAcRepair} alt="AC repair services" className="w-full h-full object-cover" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid — bold, clean */}
      {services.length > 0 && (
        <section className="py-14 md:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Our Services</h2>
                <p className="text-sm text-muted-foreground mt-1">Professional help for every need</p>
              </div>
              <button
                onClick={() => handleServiceClick()}
                className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                View all <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04 } } }}
              className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3"
            >
              {services.map((svc) => {
                const IconComp = iconMap[svc.icon || ""] || Sparkles;
                return (
                  <motion.button
                    key={svc.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-shadow group cursor-pointer"
                    onClick={() => handleServiceClick(svc.id)}
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colorMap[svc.icon || ""] || "bg-muted text-foreground"} group-hover:scale-110 transition-transform`}>
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold text-foreground text-center leading-tight">{svc.name}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-14 md:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">How it works</h2>
            <p className="text-sm text-muted-foreground mt-2">3 simple steps to get help</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "1", icon: Search, title: "Choose a Service", desc: "Pick what you need and share your GPS location." },
              { step: "2", icon: Zap, title: "AI Auto-Match", desc: "We instantly assign the nearest, top-rated helper." },
              { step: "3", icon: CheckCircle2, title: "Track & Pay", desc: "Track live on map. Rate after completion." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative p-8 rounded-3xl bg-card border sh-shadow text-center"
              >
                <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                <span className="absolute top-5 right-6 text-4xl font-black text-muted-foreground/10">{item.step}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Loved by customers</h2>
            <p className="text-sm text-muted-foreground mt-2">Real reviews from verified users</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-card border sh-shadow"
              >
                <div className="flex items-center gap-0.5 mb-3">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-[hsl(var(--sh-orange))] text-[hsl(var(--sh-orange))]" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed mb-3">"{review.text}"</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">{review.name}</span>
                  <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{review.service}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-14 md:py-20 bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Pros", desc: "Every helper is background-checked and skill-verified." },
              { icon: Star, title: "Rated & Reviewed", desc: "Transparent ratings so you always know who's coming." },
              { icon: Headphones, title: "24/7 Support", desc: "Round-the-clock help for any issue during service." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="sh-gradient-blue rounded-3xl p-10 md:p-16 text-center text-white sh-shadow-lg"
          >
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Ready to get started?</h2>
            <p className="mt-3 text-white/70 text-base max-w-md mx-auto">Join thousands getting reliable help at their doorstep.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold bg-white text-primary hover:bg-white/90" onClick={() => navigate("/auth")}>
                Book a Service
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-base font-bold border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/helper/login")}>
                Become a Helper
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg sh-gradient-blue text-white text-[10px] font-black">SH</div>
            <span className="text-sm font-bold text-foreground">SmartHelper</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SmartHelper. Built for SIH.</p>
        </div>
      </footer>

      {/* Chatbot */}
      <ChatbotWidget />
    </div>
  );
};

export default Index;
