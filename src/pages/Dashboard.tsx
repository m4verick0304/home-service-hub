import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  MapPin, History, Shield, Star, Briefcase, ChevronRight,
  Menu
} from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ChefHat: <ChefHat className="h-6 w-6" />,
  Paintbrush: <Paintbrush className="h-6 w-6" />,
  Hammer: <Hammer className="h-6 w-6" />,
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const Dashboard = () => {
  const { profile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      {/* UC-style black header */}
      <header className="uc-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-black">
              HC
            </div>
            <span className="text-white text-lg font-bold tracking-tight hidden sm:block">
              HomeServ
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <button onClick={() => navigate("/history")} className="hover:text-white transition-colors">
              My Bookings
            </button>
            <button onClick={() => navigate("/profile")} className="hover:text-white transition-colors">
              Profile
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 hidden sm:flex"
              onClick={() => navigate("/history")}
            >
              <History className="h-4 w-4 mr-1.5" />
              Bookings
            </Button>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Avatar className="h-8 w-8 border border-white/20">
                <AvatarFallback className="bg-white/10 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white md:hidden hover:bg-white/10"
              onClick={() => navigate("/profile")}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* UC-style Hero Section */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#1a1a1a" }}>
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            {/* Hero Image - Left side */}
            <div className="w-full md:w-1/2 relative h-[300px] md:h-[480px]">
              <img
                src={heroBanner}
                alt="Professional home service provider"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a] hidden md:block" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent md:hidden" />
            </div>

            {/* Hero Content - Right side */}
            <div className="w-full md:w-1/2 px-6 md:px-12 py-8 md:py-0 relative z-10 -mt-16 md:mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 font-semibold mb-3">
                  HomeServ
                </p>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight">
                  Quality home services, on demand
                </h1>
                <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
                  Experienced, hand-picked Professionals to serve you at your doorstep
                </p>
                <div className="mt-8 bg-white rounded-xl p-5 max-w-sm shadow-uc">
                  <p className="text-foreground font-semibold text-sm mb-3">
                    {profile?.name ? `Welcome back, ${profile.name.split(" ")[0]}!` : "Where do you need a service?"}
                  </p>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/50">
                    <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-muted-foreground truncate">
                      {profile?.address || "Select your location"}
                    </span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto flex-shrink-0" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Why HomeServ Section - UC style */}
      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16">
            {/* Left: Benefits */}
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-10"
              >
                Why HomeServ?
              </motion.h2>

              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={container}
                className="space-y-8"
              >
                {[
                  {
                    icon: <Shield className="h-8 w-8 text-muted-foreground" />,
                    title: "Transparent pricing",
                    desc: "See fixed prices before you book. No hidden charges."
                  },
                  {
                    icon: <Star className="h-8 w-8 text-muted-foreground" />,
                    title: "Experts only",
                    desc: "Our professionals are well trained and have on-job expertise."
                  },
                  {
                    icon: <Briefcase className="h-8 w-8 text-muted-foreground" />,
                    title: "Fully equipped",
                    desc: "We bring everything needed to get the job done well."
                  },
                ].map((item) => (
                  <motion.div
                    key={item.title}
                    variants={{
                      hidden: { opacity: 0, x: -16 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
                    }}
                    className="flex items-start gap-5"
                  >
                    <div className="flex-shrink-0 h-14 w-14 rounded-xl bg-muted flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{item.title}</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Quality Assured Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex-1 flex items-center"
            >
              <div className="w-full rounded-2xl bg-muted p-10 md:p-14 text-center">
                <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Shield className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
                  100% Quality Assured
                </h3>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed max-w-xs mx-auto">
                  If you don't love our service, we will make it right.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-20 uc-section-gray">
        <div className="mx-auto max-w-6xl px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-black text-foreground tracking-tight mb-10"
          >
            Services Offered
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {services.map((service) => (
              <motion.div key={service.id} variants={item}>
                <button
                  className="w-full group cursor-pointer"
                  onClick={() => navigate(`/book/${service.id}`)}
                >
                  <div className="bg-card rounded-2xl p-5 shadow-uc hover:shadow-uc-hover transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
                    </div>
                    <span className="text-xs font-semibold text-center text-foreground leading-tight">
                      {service.name}
                    </span>
                    {service.price_range && (
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {service.price_range}
                      </span>
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl bg-muted"
          >
            <div>
              <h3 className="text-xl font-bold text-foreground">Ready to get started?</h3>
              <p className="text-muted-foreground text-sm mt-1">Book a service in just a few taps.</p>
            </div>
            <Button
              size="lg"
              className="rounded-xl font-bold px-8"
              onClick={() => navigate("/book/" + (services[0]?.id || ""))}
            >
              Book a Service
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="uc-header py-8">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-white text-[10px] font-black">
                HC
              </div>
              <span className="text-white/80 text-sm font-semibold">HomeServ</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/40">
              <button onClick={() => navigate("/history")} className="hover:text-white/70 transition-colors">
                My Bookings
              </button>
              <button onClick={() => navigate("/profile")} className="hover:text-white/70 transition-colors">
                Profile
              </button>
            </div>
            <p className="text-xs text-white/30">© 2026 HomeServ. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
