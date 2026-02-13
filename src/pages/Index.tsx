import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  Zap, Shield, Clock, Star, MapPin, ArrowRight,
  Wrench, Sparkles, ChefHat, Paintbrush, Hammer,
  Users, CheckCircle2, Headphones, Search,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera, ChevronRight
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
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

const promoCards = [
  { image: ucSalon, title: "Shine your look", subtitle: "Salon for Women", color: "from-pink-600/80" },
  { image: ucCleaning, title: "Deep clean your home", subtitle: "Professional Cleaning", color: "from-emerald-600/80" },
  { image: ucAcRepair, title: "Beat the heat", subtitle: "AC Service & Repair", color: "from-sky-600/80" },
];

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
  const [locationName, setLocationName] = useState("Detect Location");
  const [detectingLocation, setDetectingLocation] = useState(false);

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

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    const match = services.find(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (match) {
      handleServiceClick(match.id);
    } else {
      handleServiceClick(); // go to dashboard/auth
    }
  };

  const handleServiceClick = (serviceId?: string) => {
    if (session) {
      navigate(serviceId ? `/book/${serviceId}` : "/dashboard");
    } else {
      navigate("/auth");
    }
  };

  // Top 6 for the hero grid, rest for horizontal row
  const topServices = services.slice(0, 3);
  const bottomServices = services.slice(3, 7);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar — UC style: clean white, location, search */}
      <header className="sticky top-0 z-50 bg-card border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 h-16">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sh-gradient-blue text-white text-[10px] font-black">SH</div>
              <span className="text-base font-extrabold tracking-tight text-foreground hidden sm:block">SmartHelper</span>
            </div>
            {/* Location pill */}
            <button
              onClick={detectLocation}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border hover:bg-muted transition-colors text-sm"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              <span className="font-medium text-foreground truncate max-w-[160px]">
                {detectingLocation ? "Detecting…" : locationName}
              </span>
              <ChevronRight className="h-3 w-3 text-muted-foreground rotate-90" />
            </button>
          </div>

          {/* Search bar in header */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for 'Kitchen cleaning'"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                className="h-10 pl-10 pr-20 rounded-lg border bg-muted/50 text-sm"
              />
              <Button
                size="sm"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 rounded-md text-xs font-semibold sh-gradient-blue border-0 text-white"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle variant="white" />
            {session ? (
              <Button className="rounded-lg text-sm font-semibold sh-gradient-blue border-0 text-white" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-medium" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button className="rounded-lg text-sm font-semibold sh-gradient-blue border-0 text-white" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero — UC split layout */}
      <section className="py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left: headline + service grid */}
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-[42px] font-black text-foreground leading-tight tracking-tight"
              >
                Home services at your doorstep
              </motion.h1>

              {/* Service category card */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-8 p-6 rounded-2xl bg-card border sh-shadow"
              >
                <p className="text-sm font-semibold text-muted-foreground mb-5">What are you looking for?</p>

                {/* Top row — icon cards */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {topServices.map((svc) => {
                    const IconComp = iconMap[svc.icon || ""] || Sparkles;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => handleServiceClick(svc.id)}
                        className="flex flex-col items-center gap-3 p-4 rounded-xl hover:bg-muted transition-colors group cursor-pointer"
                      >
                        <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${colorMap[svc.icon || ""] || "bg-muted text-foreground"} group-hover:scale-110 transition-transform`}>
                          <IconComp className="h-7 w-7" />
                        </div>
                        <span className="text-xs font-semibold text-foreground text-center leading-tight">{svc.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom rows — horizontal list cards */}
                <div className="space-y-2">
                  {bottomServices.map((svc) => {
                    const IconComp = iconMap[svc.icon || ""] || Sparkles;
                    return (
                      <button
                        key={svc.id}
                        onClick={() => handleServiceClick(svc.id)}
                        className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors group cursor-pointer"
                      >
                        <div className="flex-1 text-left">
                          <span className="text-sm font-semibold text-foreground">{svc.name}</span>
                          {svc.price_range && (
                            <span className="text-xs text-muted-foreground ml-2">{svc.price_range}</span>
                          )}
                        </div>
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${colorMap[svc.icon || ""] || "bg-muted text-foreground"} group-hover:scale-110 transition-transform`}>
                          <IconComp className="h-5 w-5" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* View all */}
                <button
                  onClick={() => handleServiceClick()}
                  className="w-full mt-4 text-sm font-semibold text-primary flex items-center justify-center gap-1 hover:underline"
                >
                  View all services <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>

              {/* Stats bar — like UC */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-8 mt-8"
              >
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-foreground" />
                  <div>
                    <p className="text-xl font-black text-foreground">4.8</p>
                    <p className="text-xs text-muted-foreground">Service Rating*</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-foreground" />
                  <div>
                    <p className="text-xl font-black text-foreground">12M+</p>
                    <p className="text-xs text-muted-foreground">Customers Globally*</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Image collage — UC style 2x2 grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:grid grid-cols-2 gap-3 h-[520px]"
            >
              <div className="rounded-2xl overflow-hidden">
                <img src={ucSalon} alt="Salon services" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={ucPlumber} alt="Plumbing services" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={ucCleaning} alt="Cleaning services" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={ucAcRepair} alt="AC repair services" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Promo cards — horizontal scroll like UC */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {promoCards.map((card, i) => (
              <motion.button
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => handleServiceClick()}
                className="relative h-48 rounded-2xl overflow-hidden group cursor-pointer"
              >
                <img src={card.image} alt={card.subtitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${card.color} to-transparent`} />
                <div className="absolute bottom-0 left-0 p-5">
                  <p className="text-lg font-black text-white">{card.title}</p>
                  <p className="text-xs text-white/80 mt-0.5">{card.subtitle}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* All services grid */}
      {services.length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-xl font-black text-foreground mb-6">All Services</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {services.map((svc, i) => {
                const IconComp = iconMap[svc.icon || ""] || Sparkles;
                return (
                  <motion.button
                    key={svc.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-shadow group cursor-pointer"
                    onClick={() => handleServiceClick(svc.id)}
                  >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${colorMap[svc.icon || ""] || "bg-muted text-foreground"} group-hover:scale-110 transition-transform`}>
                      <IconComp className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-semibold text-foreground text-center leading-tight">{svc.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">How SmartHelper works</h2>
            <p className="text-muted-foreground mt-2 text-sm">Get professional help in 3 simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: Search, title: "Select & Locate", desc: "Choose your service and share your location via GPS. We'll find helpers near you." },
              { step: "02", icon: Zap, title: "Smart Auto-Assign", desc: "Our AI system instantly matches you with the nearest, best-rated, available professional." },
              { step: "03", icon: CheckCircle2, title: "Track & Complete", desc: "Track your helper live on the map. Rate them after service completion." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-7 rounded-3xl bg-card border sh-shadow">
                <span className="text-5xl font-black text-muted/60 absolute top-4 right-5">{item.step}</span>
                <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1.5">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">What customers say</h2>
            <p className="text-muted-foreground mt-2 text-sm">Real reviews from verified customers</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-5 rounded-2xl bg-card border sh-shadow">
                <div className="flex items-center gap-1 mb-3">
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
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified Professionals", desc: "Every helper is background-checked and skill-verified before onboarding." },
              { icon: Star, title: "Rated & Reviewed", desc: "Transparent ratings help you trust the helper assigned to you." },
              { icon: Headphones, title: "24/7 Support", desc: "Our support team is always available for any issues during service." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
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
        <div className="mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sh-gradient-blue rounded-3xl p-10 md:p-16 text-center text-white sh-shadow-lg">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Ready to get started?</h2>
            <p className="mt-3 text-white/70 text-base max-w-md mx-auto">Join thousands of happy customers who get reliable help at their doorstep.</p>
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
      <footer className="border-t py-10">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg sh-gradient-blue text-white text-[10px] font-black">SH</div>
            <span className="text-sm font-bold text-foreground">SmartHelper</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SmartHelper Auto-Assignment System. Built for SIH.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
