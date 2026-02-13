import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  MapPin, History, Edit2, Check, ArrowRight
} from "lucide-react";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-7 w-7" />,
  Wrench: <Wrench className="h-7 w-7" />,
  Zap: <Zap className="h-7 w-7" />,
  ChefHat: <ChefHat className="h-7 w-7" />,
  Paintbrush: <Paintbrush className="h-7 w-7" />,
  Hammer: <Hammer className="h-7 w-7" />,
};

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  cleaning: { bg: "bg-blue-50", text: "text-blue-600", glow: "shadow-blue-200/50" },
  plumbing: { bg: "bg-orange-50", text: "text-orange-600", glow: "shadow-orange-200/50" },
  electrical: { bg: "bg-amber-50", text: "text-amber-600", glow: "shadow-amber-200/50" },
  cooking: { bg: "bg-rose-50", text: "text-rose-600", glow: "shadow-rose-200/50" },
  painting: { bg: "bg-purple-50", text: "text-purple-600", glow: "shadow-purple-200/50" },
  carpentry: { bg: "bg-emerald-50", text: "text-emerald-600", glow: "shadow-emerald-200/50" },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

const Dashboard = () => {
  const { profile, refreshProfile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [location, setLocation] = useState(profile?.address || "Set your location");
  const [editingLocation, setEditingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  useEffect(() => {
    if (profile?.address) setLocation(profile.address);
  }, [profile]);

  const saveLocation = async () => {
    if (profile) {
      await supabase.from("profiles").update({ address: location }).eq("id", profile.id);
      await refreshProfile();
    }
    setEditingLocation(false);
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b glass">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-glow"
            >
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </motion.div>
            <span className="text-xl font-extrabold tracking-tight text-foreground">HomeServ</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/history")}>
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/profile")}>
              <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-7">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 text-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          {editingLocation ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-9 text-sm rounded-lg bg-muted/50 border-0"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-9 w-9 rounded-lg" onClick={saveLocation}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setEditingLocation(true)}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="truncate max-w-[220px] font-medium">{location}</span>
              <Edit2 className="h-3 w-3 opacity-50" />
            </button>
          )}
        </motion.div>

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl gradient-hero p-6 text-primary-foreground relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4" />
          <div className="relative z-10">
            <h1 className="text-2xl font-extrabold tracking-tight">
              Hi, {profile?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="mt-1 opacity-90 text-sm font-medium">What service do you need today?</p>
            <Button
              className="mt-4 bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold rounded-xl h-11 px-6 shadow-elevated"
              onClick={() => navigate("/book/" + (services[0]?.id || ""))}
            >
              <Zap className="mr-2 h-4 w-4" /> Instant Book
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Service Grid */}
        <div>
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Services</h2>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-3 gap-3"
          >
            {services.map((service) => {
              const colors = colorMap[service.category] || { bg: "bg-muted", text: "text-muted-foreground", glow: "" };
              return (
                <motion.div key={service.id} variants={item}>
                  <Card
                    className={`cursor-pointer border-0 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 group`}
                    onClick={() => navigate(`/book/${service.id}`)}
                  >
                    <CardContent className="flex flex-col items-center gap-2.5 p-4">
                      <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg} ${colors.text} group-hover:shadow-lg ${colors.glow} transition-shadow`}>
                        {iconMap[service.icon || ""] || <Sparkles className="h-7 w-7" />}
                      </div>
                      <span className="text-xs font-semibold text-center text-foreground leading-tight">{service.name}</span>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            className="w-full h-13 font-semibold rounded-2xl border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-all"
            onClick={() => navigate("/history")}
          >
            <History className="mr-2 h-4 w-4 text-primary" />
            View Booking History
            <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
