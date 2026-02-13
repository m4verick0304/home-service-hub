import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Shield, Clock, Star, MapPin, ArrowRight,
  Wrench, Sparkles, ChefHat, Paintbrush, Hammer,
  Users, CheckCircle2, Headphones, ChevronLeft, ChevronRight,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera, Search
} from "lucide-react";
import heroAcRepair from "@/assets/hero-ac-repair.jpg";
import heroCleaning from "@/assets/hero-cleaning.jpg";
import heroBanner from "@/assets/hero-banner.jpg";

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

const bannerSlides = [
  {
    image: heroAcRepair,
    title: "AC Repair & Service",
    subtitle: "Starting at ₹399 • Expert technicians at your doorstep",
    cta: "Book Now",
  },
  {
    image: heroCleaning,
    title: "Professional Home Cleaning",
    subtitle: "Deep cleaning starting at ₹499 • Trained & verified staff",
    cta: "Book Now",
  },
  {
    image: heroBanner,
    title: "Smart Helper Auto-Assignment",
    subtitle: "AI-powered matching with nearest, best-rated professionals",
    cta: "Get Started",
  },
];

const stats = [
  { value: "10K+", label: "Bookings Completed" },
  { value: "2K+", label: "Verified Helpers" },
  { value: "4.8", label: "Average Rating" },
  { value: "15min", label: "Avg Response Time" },
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
      <header className="sticky top-0 z-50 sh-glass border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl sh-gradient-blue text-white text-xs font-black sh-shadow">
              SH
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">SmartHelper</span>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Button className="rounded-xl text-sm font-bold sh-gradient-blue border-0 text-white sh-shadow" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="text-sm font-medium" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button className="rounded-xl text-sm font-bold sh-gradient-blue border-0 text-white sh-shadow" onClick={() => navigate("/auth")}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner Carousel */}
      <section className="relative h-[360px] md:h-[480px] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0"
          >
            <img
              src={bannerSlides[currentSlide].image}
              alt={bannerSlides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="mx-auto max-w-6xl px-6 w-full">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-lg"
                >
                  <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                    {bannerSlides[currentSlide].title}
                  </h2>
                  <p className="mt-3 text-white/80 text-sm md:text-base">
                    {bannerSlides[currentSlide].subtitle}
                  </p>
                  <Button
                    size="lg"
                    className="mt-6 h-13 px-8 rounded-2xl text-base font-bold sh-gradient-blue border-0 text-white sh-shadow-md"
                    onClick={() => handleServiceClick()}
                  >
                    {bannerSlides[currentSlide].cta} <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
            />
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden md:flex"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/30 transition-colors hidden md:flex"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </section>

      {/* Quick Info Bar */}
      <div className="bg-card border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-center gap-8 md:gap-16 flex-wrap">
          {[
            { icon: <Clock className="h-4 w-4" />, text: "15 min avg response" },
            { icon: <Shield className="h-4 w-4" />, text: "Verified professionals" },
            { icon: <Star className="h-4 w-4" />, text: "4.8+ rated" },
            { icon: <CheckCircle2 className="h-4 w-4" />, text: "Satisfaction guaranteed" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span className="text-primary">{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Services Grid - UC Style */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Home services at your doorstep</h2>
              <p className="text-muted-foreground mt-1 text-sm">Choose a service and we'll match you with the best professional nearby</p>
            </div>
            {session && (
              <Button variant="outline" className="rounded-xl text-sm font-medium hidden sm:flex" onClick={() => navigate("/dashboard")}>
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
            {services.map((svc, i) => {
              const IconComp = iconMap[svc.icon || ""] || Sparkles;
              return (
                <motion.button
                  key={svc.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
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

      {/* How it works */}
      <section className="py-12 md:py-20 bg-muted/50">
        <div className="mx-auto max-w-6xl px-6">
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
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-7 rounded-3xl bg-card border sh-shadow group hover:sh-shadow-md transition-shadow">
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
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">What customers say</h2>
            <p className="text-muted-foreground mt-2 text-sm">Real reviews from verified customers</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {reviews.map((review, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl bg-card border sh-shadow"
              >
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

      {/* Stats */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-card border sh-shadow">
                <p className="text-3xl md:text-4xl font-black text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
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
        <div className="mx-auto max-w-6xl px-6">
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
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
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
