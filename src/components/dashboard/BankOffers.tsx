import { motion } from "framer-motion";
import { Building2, CreditCard, Smartphone, BadgePercent } from "lucide-react";

const bankOffers = [
  {
    id: "1",
    bank: "HDFC Bank",
    type: "Credit Card",
    icon: CreditCard,
    discount: "10% Cashback",
    maxDiscount: "Up to ₹200",
    minOrder: "Min order ₹499",
    color: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
    borderColor: "border-[hsl(var(--sh-blue))]/20",
  },
  {
    id: "2",
    bank: "SBI Card",
    type: "Debit Card",
    icon: Building2,
    discount: "15% OFF",
    maxDiscount: "Up to ₹300",
    minOrder: "Min order ₹599",
    color: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
    borderColor: "border-[hsl(var(--sh-green))]/20",
  },
  {
    id: "3",
    bank: "Paytm",
    type: "UPI Payment",
    icon: Smartphone,
    discount: "₹75 Cashback",
    maxDiscount: "Flat cashback",
    minOrder: "Min order ₹299",
    color: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
    borderColor: "border-[hsl(var(--sh-purple))]/20",
  },
  {
    id: "4",
    bank: "ICICI Bank",
    type: "Net Banking",
    icon: Building2,
    discount: "12% OFF",
    maxDiscount: "Up to ₹250",
    minOrder: "Min order ₹499",
    color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
    borderColor: "border-[hsl(var(--sh-orange))]/20",
  },
];

export const BankOffers = () => (
  <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-8">
    <div className="flex items-center gap-2 mb-4">
      <BadgePercent className="h-5 w-5 text-primary" />
      <h3 className="text-sm font-black text-foreground uppercase tracking-wide">🏦 Bank Offers</h3>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {bankOffers.map((offer, i) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`flex items-center gap-4 p-4 rounded-2xl bg-card border ${offer.borderColor} sh-shadow hover:sh-shadow-md transition-all`}
        >
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0 ${offer.color}`}>
            <offer.icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-foreground">{offer.discount}</p>
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{offer.type}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {offer.bank} • {offer.maxDiscount} • {offer.minOrder}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);
