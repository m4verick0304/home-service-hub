import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, CreditCard, Smartphone, ChevronDown, ChevronUp, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const bankOffers = [
  {
    id: "1", bank: "HDFC Bank", type: "Credit Card", icon: CreditCard,
    discount: "10% Cashback", maxDiscount: "Up to ₹200", minOrder: "Min ₹499",
    color: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
    code: "HDFC10", terms: "Valid on HDFC credit cards only. Max cashback ₹200. Applicable once per user.",
  },
  {
    id: "2", bank: "SBI Card", type: "Debit Card", icon: Building2,
    discount: "15% OFF", maxDiscount: "Up to ₹300", minOrder: "Min ₹599",
    color: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
    code: "SBI15", terms: "Valid on SBI debit/credit cards. Max discount ₹300. Valid till month end.",
  },
  {
    id: "3", bank: "Paytm", type: "UPI", icon: Smartphone,
    discount: "₹75 Cashback", maxDiscount: "Flat cashback", minOrder: "Min ₹299",
    color: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
    code: "PAYTM75", terms: "Cashback credited within 24 hours. Valid on Paytm UPI only.",
  },
  {
    id: "4", bank: "ICICI Bank", type: "Net Banking", icon: Building2,
    discount: "12% OFF", maxDiscount: "Up to ₹250", minOrder: "Min ₹499",
    color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
    code: "ICICI12", terms: "Valid on ICICI net banking and cards. Max discount ₹250.",
  },
];

export const BankOffers = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const copyCode = (code: string, offerId: string) => {
    navigator.clipboard.writeText(code);
    setCopied(offerId);
    toast({ title: "Code copied!", description: `${code} — use at checkout` });
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-6">
      <h3 className="text-sm font-bold text-foreground mb-3">Bank offers</h3>
      <div className="space-y-2">
        {bankOffers.map((offer, i) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl bg-card border sh-shadow overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === offer.id ? null : offer.id)}
              className="w-full flex items-center gap-3 p-3 text-left"
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 ${offer.color}`}>
                <offer.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-bold text-foreground">{offer.discount}</p>
                  <span className="text-[9px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{offer.type}</span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {offer.bank} • {offer.maxDiscount} • {offer.minOrder}
                </p>
              </div>
              {expanded === offer.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              )}
            </button>

            <AnimatePresence>
              {expanded === offer.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-3 pt-0 space-y-2">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{offer.terms}</p>
                    <button
                      onClick={() => copyCode(offer.code, offer.id)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors"
                    >
                      <span className="text-xs font-bold text-primary tracking-wider">{offer.code}</span>
                      {copied === offer.id ? (
                        <Check className="h-3 w-3 text-[hsl(var(--sh-green))]" />
                      ) : (
                        <span className="text-[10px] text-primary font-medium">TAP TO COPY</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
