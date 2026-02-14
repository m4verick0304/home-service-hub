import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Badge, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Offer {
  id: string;
  title: string;
  discount: string;
  services: string[];
  originalPrice: string;
  discountedPrice: string;
  endsIn: number; // seconds
  badge?: string;
  image?: string;
}

const offers: Offer[] = [
  {
    id: "offer-1",
    title: "Spring Cleaning Bonanza",
    discount: "40% OFF",
    services: ["House Cleaning", "Deep Cleaning", "Bathroom Cleaning"],
    originalPrice: "₹1,499",
    discountedPrice: "₹899",
    endsIn: 7200, // 2 hours
    badge: "HOT DEAL",
    image: "🧹"
  },
  {
    id: "offer-2",
    title: "Electrician Special",
    discount: "30% OFF",
    services: ["Electrical Repairs", "Installation", "Maintenance"],
    originalPrice: "₹699",
    discountedPrice: "₹489",
    endsIn: 10800, // 3 hours
    badge: "LIMITED TIME",
    image: "⚡"
  },
  {
    id: "offer-3",
    title: "Plumbing Bundle",
    discount: "35% OFF",
    services: ["Plumbing", "Pipe Repair", "Drain Cleaning"],
    originalPrice: "₹999",
    discountedPrice: "₹649",
    endsIn: 5400, // 1.5 hours
    badge: "FLASH SALE",
    image: "🔧"
  },
  {
    id: "offer-4",
    title: "AC Service Mega Offer",
    discount: "45% OFF",
    services: ["AC Service", "AC Repair", "AC Maintenance"],
    originalPrice: "₹799",
    discountedPrice: "₹439",
    endsIn: 14400, // 4 hours
    badge: "BEST VALUE",
    image: "❄️"
  },
];

function CountdownTimer({ seconds: initialSeconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(remaining / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);
  const seconds = remaining % 60;

  return (
    <div className="flex items-center gap-2 text-xs font-mono font-bold">
      <Clock className="h-3.5 w-3.5" />
      <span>
        {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

export function OfferZone() {
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 bg-gradient-to-br from-purple-50/50 via-transparent to-blue-50/50 dark:from-purple-950/20 dark:via-transparent dark:to-blue-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="h-6 w-6 text-amber-500" />
            <span className="text-sm font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-3 py-1 rounded-full">
              LIMITED TIME OFFERS
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Amazing Deals Ending Soon
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Grab these incredible offers before they're gone!
          </p>
        </motion.div>

        {/* Offers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {offers.map((offer, index) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 16, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              whileHover={{ y: -4, boxShadow: "0 14px 40px rgba(0,0,0,0.1)" }}
              className="relative p-5 rounded-2xl bg-card border sh-shadow overflow-hidden group"
            >
              {/* Badge */}
              {offer.badge && (
                <motion.div
                  animate={{ rotate: -45 }}
                  className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-[10px] font-black text-center"
                >
                  <span className="rotate-45">{offer.badge}</span>
                </motion.div>
              )}

              {/* Content */}
              <div className="relative space-y-3 pr-6">
                {/* Icon & Discount */}
                <div className="flex items-start justify-between">
                  <span className="text-4xl">{offer.image}</span>
                  <div className="text-right">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1 rounded-lg text-xs font-black"
                    >
                      {offer.discount}
                    </motion.div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-black text-base text-foreground">{offer.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium mt-1">
                    {offer.services.join(", ")}
                  </p>
                </div>

                {/* Pricing */}
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground line-through">{offer.originalPrice}</span>
                    <span className="text-lg font-black text-primary">{offer.discountedPrice}</span>
                  </div>
                </div>

                {/* Countdown */}
                <motion.div
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="p-2 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                >
                  <CountdownTimer seconds={offer.endsIn} />
                </motion.div>

                {/* Button */}
                <Button
                  className="w-full rounded-lg font-bold h-10 sh-gradient-orange text-white border-0"
                  onClick={() => navigate("/auth")}
                >
                  Grab Offer
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl border-2 border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 flex items-start gap-3"
        >
          <Badge className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">New Member Bonus</p>
            <p className="text-xs text-muted-foreground mt-1">
              First-time users get an additional <span className="font-bold text-blue-600 dark:text-blue-400">₹200 discount</span> on any service!
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
