import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, ArrowRight, Copy, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";

type Service = Tables<"services">;

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  endsAt: Date;
  gradient: string;
  serviceMatch: string;
}

const offers: Offer[] = [
  {
    id: "1", title: "Deep Cleaning", subtitle: "Full home sanitization", discount: "40% OFF",
    code: "CLEAN40", endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    gradient: "from-[hsl(220,90%,56%)] to-[hsl(262,80%,58%)]", serviceMatch: "Deep Cleaning",
  },
  {
    id: "2", title: "AC Service", subtitle: "Summer special", discount: "₹199 Only",
    code: "COOL199", endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    gradient: "from-[hsl(152,60%,45%)] to-[hsl(152,60%,32%)]", serviceMatch: "AC Repair",
  },
  {
    id: "3", title: "Plumbing Fix", subtitle: "Emergency repairs", discount: "25% OFF",
    code: "PIPE25", endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    gradient: "from-[hsl(32,95%,55%)] to-[hsl(0,84%,60%)]", serviceMatch: "Plumber",
  },
  {
    id: "4", title: "Salon at Home", subtitle: "Beauty services", discount: "₹149 OFF",
    code: "BEAUTY149", endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000),
    gradient: "from-[hsl(262,80%,58%)] to-[hsl(320,70%,50%)]", serviceMatch: "Beauty & Salon",
  },
];

function useCountdown(target: Date) {
  const getTimeLeft = useCallback(() => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      h: Math.floor(diff / 3600000),
      m: Math.floor((diff % 3600000) / 60000),
      s: Math.floor((diff % 60000) / 1000),
      expired: diff === 0,
    };
  }, [target]);

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, [getTimeLeft]);

  return timeLeft;
}

const OfferCard = ({ offer, services }: { offer: Offer; services: Service[] }) => {
  const { h, m, s, expired } = useCountdown(offer.endsAt);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  if (expired) return null;

  const matchedService = services.find(sv => sv.name.toLowerCase() === offer.serviceMatch.toLowerCase());

  const copyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(offer.code);
    setCopied(true);
    toast({ title: "Code copied!", description: `${offer.code} copied to clipboard` });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBook = () => {
    if (matchedService) {
      navigate(`/book/${matchedService.id}`);
    } else {
      toast({ title: "Service not available", variant: "destructive" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`min-w-[220px] max-w-[220px] p-4 rounded-xl bg-gradient-to-br ${offer.gradient} text-white relative overflow-hidden flex-shrink-0 cursor-pointer active:scale-[0.98] transition-transform`}
      onClick={handleBook}
    >
      <div className="absolute -top-8 -right-8 w-20 h-20 bg-white/10 rounded-full" />
      <div className="relative z-10">
        <p className="text-base font-black leading-tight">{offer.discount}</p>
        <p className="text-xs font-bold mt-0.5 opacity-95">{offer.title}</p>
        <p className="text-[10px] opacity-75">{offer.subtitle}</p>

        {/* Coupon code - tap to copy */}
        <button onClick={copyCode} className="mt-2 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 transition-colors px-2 py-1 rounded-lg">
          <Tag className="h-3 w-3" />
          <span className="text-[10px] font-bold tracking-wide">{offer.code}</span>
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3 opacity-70" />}
        </button>

        {/* Countdown */}
        <div className="flex items-center gap-1.5 mt-2">
          <Clock className="h-3 w-3 opacity-70" />
          <div className="flex items-center gap-0.5 text-[10px] font-bold">
            <span className="bg-white/20 px-1 py-0.5 rounded text-[9px]">{String(h).padStart(2, "0")}</span>
            <span className="opacity-60">:</span>
            <span className="bg-white/20 px-1 py-0.5 rounded text-[9px]">{String(m).padStart(2, "0")}</span>
            <span className="opacity-60">:</span>
            <span className="bg-white/20 px-1 py-0.5 rounded text-[9px]">{String(s).padStart(2, "0")}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const OfferZone = () => {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">Deals for you</h3>
        <span className="text-[10px] text-white bg-destructive px-2 py-0.5 rounded-full font-bold animate-pulse">LIVE</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} services={services} />
        ))}
      </div>
    </section>
  );
};
