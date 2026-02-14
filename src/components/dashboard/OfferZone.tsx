import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, Clock, Percent, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  endsAt: Date;
  gradient: string;
}

const offers: Offer[] = [
  {
    id: "1",
    title: "Deep Cleaning",
    subtitle: "Full home sanitization",
    discount: "40% OFF",
    code: "CLEAN40",
    endsAt: new Date(Date.now() + 4 * 60 * 60 * 1000),
    gradient: "from-[hsl(var(--sh-blue))] to-[hsl(var(--sh-purple))]",
  },
  {
    id: "2",
    title: "AC Service",
    subtitle: "Summer special deal",
    discount: "₹199 Only",
    code: "COOL199",
    endsAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
    gradient: "from-[hsl(var(--sh-green))] to-[hsl(152,60%,35%)]",
  },
  {
    id: "3",
    title: "Plumbing Fix",
    subtitle: "Emergency repairs",
    discount: "25% OFF",
    code: "PIPE25",
    endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    gradient: "from-[hsl(var(--sh-orange))] to-[hsl(var(--sh-red))]",
  },
];

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(target));

  function getTimeLeft(t: Date) {
    const diff = Math.max(0, t.getTime() - Date.now());
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: diff === 0 };
  }

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return timeLeft;
}

const OfferCard = ({ offer }: { offer: Offer }) => {
  const { h, m, s, expired } = useCountdown(offer.endsAt);
  const navigate = useNavigate();

  if (expired) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-w-[260px] p-5 rounded-2xl bg-gradient-to-br ${offer.gradient} text-white relative overflow-hidden flex-shrink-0`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-x-6 -translate-y-6" />
      <div className="relative z-10">
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="h-3.5 w-3.5" />
          <span className="text-xs font-bold opacity-90">{offer.code}</span>
        </div>
        <p className="text-lg font-black leading-tight">{offer.discount}</p>
        <p className="text-sm font-bold mt-0.5">{offer.title}</p>
        <p className="text-xs opacity-80">{offer.subtitle}</p>

        <div className="flex items-center gap-2 mt-3">
          <Clock className="h-3 w-3 opacity-80" />
          <div className="flex items-center gap-1 text-xs font-bold">
            <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(h).padStart(2, "0")}</span>
            <span>:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(m).padStart(2, "0")}</span>
            <span>:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded">{String(s).padStart(2, "0")}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-3 flex items-center gap-1 text-xs font-bold bg-white/20 hover:bg-white/30 transition-colors px-3 py-1.5 rounded-xl"
        >
          Book Now <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};

export const OfferZone = () => (
  <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Percent className="h-5 w-5 text-primary" />
      <h3 className="text-sm font-black text-foreground uppercase tracking-wide">🔥 Offer Zone</h3>
      <span className="text-xs text-destructive font-bold ml-auto animate-pulse">LIVE</span>
    </div>
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} />
      ))}
    </div>
  </section>
);
