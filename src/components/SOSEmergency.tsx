import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, MapPin, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const emergencyServices = [
  {
    id: "pipe-burst",
    name: "Pipe Burst",
    icon: "💧",
    description: "Immediate plumbing assistance",
    eta: "10 mins",
    price: "₹299+",
    color: "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-900"
  },
  {
    id: "roof-leakage",
    name: "Roof Leakage",
    icon: "🏠",
    description: "Urgent roofing repair",
    eta: "15 mins",
    price: "₹399+",
    color: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-950 dark:text-orange-400 dark:border-orange-900"
  },
  {
    id: "electrical-hazard",
    name: "Electrical Hazard",
    icon: "⚡",
    description: "Emergency electrical fix",
    eta: "8 mins",
    price: "₹249+",
    color: "bg-yellow-50 text-yellow-600 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-900"
  },
  {
    id: "gas-leak",
    name: "Gas Leak",
    icon: "🔥",
    description: "Gas safety emergency",
    eta: "5 mins",
    price: "₹199+",
    color: "bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-900"
  },
  {
    id: "water-blocked",
    name: "Blocked Drain",
    icon: "🚰",
    description: "Clogged pipes & drains",
    eta: "12 mins",
    price: "₹249+",
    color: "bg-cyan-50 text-cyan-600 border-cyan-200 dark:bg-cyan-950 dark:text-cyan-400 dark:border-cyan-900"
  },
  {
    id: "pest-control",
    name: "Pest Control",
    icon: "🦟",
    description: "Urgent pest infestation",
    eta: "20 mins",
    price: "₹349+",
    color: "bg-green-50 text-green-600 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-900"
  },
];

export function SOSEmergency() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [services, setServices] = useState<any[]>([]);

  // Fetch services on mount to map IDs
  useState(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  });

  const handleEmergencyBook = async (emergencyId: string) => {
    if (!session) {
      navigate("/auth");
      return;
    }

    // Map emergency type to service category
    let categoryKeyword = "";
    switch (emergencyId) {
      case "pipe-burst":
      case "water-blocked":
      case "gas-leak":
        categoryKeyword = "Plumbing";
        break;
      case "electrical-hazard":
        categoryKeyword = "Electrical";
        break;
      case "pest-control":
        categoryKeyword = "Pest";
        break;
      case "roof-leakage":
        categoryKeyword = "Carpentry";
        break;
      default:
        categoryKeyword = "Cleaning";
    }

    // Find matching service from DB
    const service = services.find(s => s.name.includes(categoryKeyword) || s.category.includes(categoryKeyword.toLowerCase()));

    if (!service) {
      toast({
        variant: "destructive",
        title: "Service Unavailable",
        description: "Could not find a matching service provider at this moment."
      });
      return;
    }

    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: session.user.id,
        service_id: service.id,
        status: "pending",
        scheduled_at: new Date().toISOString(),
        address: "Emergency Location (GPS)", // In real app, get real location
        provider_name: "Searching...",
        eta_minutes: 15
      });

      if (error) throw error;

      toast({
        title: "🚨 Emergency Booking Confirmed!",
        description: `Help is on the way! A ${service.name} professional has been assigned.`,
        className: "bg-red-50 border-red-200 text-red-900 dark:bg-red-900/50 dark:text-red-100"
      });

      // Optional: Navigate to bookings page after delay
      setTimeout(() => navigate("/history"), 2000);

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: err.message || "Something went wrong. Please call our hotline."
      });
    }
  };

  return (
    <section className="py-14 md:py-20 bg-red-50/50 dark:bg-red-950/20 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <span className="text-sm font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-full">Emergency Services</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Emergency Help Available 24/7
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Immediate assistance for urgent home issues. Average response time: 8 minutes.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -4 }}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${service.color}`}
              onClick={() => handleEmergencyBook(service.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{service.icon}</span>
                <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-lg">EMERGENCY</span>
              </div>

              <h3 className="font-black text-base mb-1">{service.name}</h3>
              <p className="text-xs opacity-75 mb-3">{service.description}</p>

              <div className="flex items-center gap-2 text-xs font-bold mb-3">
                <Clock className="h-3.5 w-3.5" />
                <span>{service.eta}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-black text-lg">{service.price}</span>
                <Zap className="h-4 w-4 opacity-60" />
              </div>

              <Button
                size="sm"
                className="w-full mt-3 rounded-lg font-bold h-9 bg-white/20 hover:bg-white/30 text-current border-0"
              >
                Book Now
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 rounded-2xl border-2 border-red-200 dark:border-red-900/50 bg-white dark:bg-card flex items-start gap-3"
        >
          <Phone className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">Emergency Support Available</p>
            <p className="text-xs text-muted-foreground mt-1">
              Can't wait for online? Call our 24/7 emergency hotline: <span className="font-bold text-foreground">1-800-HELPER-1</span>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
