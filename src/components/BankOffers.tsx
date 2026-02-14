import { motion } from "framer-motion";
import { CreditCard, DollarSign, Gift, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BankOffer {
  id: string;
  bank: string;
  logo: string;
  offers: {
    title: string;
    description: string;
    discount: string;
    code: string;
    terms: string;
  }[];
}

const bankOffers: BankOffer[] = [
  {
    id: "hdfc",
    bank: "HDFC Bank",
    logo: "🏦",
    offers: [
      {
        title: "10% Cashback",
        description: "On all home services using HDFC Credit Card",
        discount: "Max ₹500",
        code: "HDFC10",
        terms: "Min purchase ₹1000. Valid till 31 March 2026",
      },
      {
        title: "5% EMI Discount",
        description: "3-6 month EMI on purchases above ₹5000",
        discount: "No interest",
        code: "HDFC_EMI",
        terms: "HDFC Credit Card only",
      },
      {
        title: "Weekend Special",
        description: "15% off every Saturday & Sunday",
        discount: "Up to ₹1000",
        code: "WEEKEND15",
        terms: "Saturdays & Sundays only",
      },
    ],
  },
  {
    id: "icici",
    bank: "ICICI Bank",
    logo: "🏧",
    offers: [
      {
        title: "20% Cashback",
        description: "ICICI Debit Card holders get instant 20% cashback",
        discount: "Max ₹750",
        code: "ICICI20",
        terms: "First 5 transactions. Min ₹500",
      },
      {
        title: "Flat ₹200 OFF",
        description: "On every ICICI Bank payment",
        discount: "₹200",
        code: "FLAT200ICICI",
        terms: "Minimum order ₹999",
      },
      {
        title: "Birthday Month Offer",
        description: "Extra 25% discount during your birthday month",
        discount: "Up to ₹1500",
        code: "BIRTHDAY25",
        terms: "For registered members",
      },
    ],
  },
  {
    id: "axis",
    bank: "Axis Bank",
    logo: "💳",
    offers: [
      {
        title: "12% Cashback",
        description: "On Axis Bank Credit & Debit Cards",
        discount: "Max ₹600",
        code: "AXIS12",
        terms: "Valid till 30 June 2026",
      },
      {
        title: "Loyalty Points",
        description: "Earn 5X rewards points on every booking",
        discount: "Redeemable",
        code: "AXIS_POINTS",
        terms: "Axis Bank account holders",
      },
      {
        title: "No Cost EMI",
        description: "Pay in 3, 6, or 12 month EMI at 0% cost",
        discount: "Full amount",
        code: "AXIS_EMI",
        terms: "Purchases above ₹3000",
      },
    ],
  },
  {
    id: "sbi",
    bank: "SBI Bank",
    logo: "🏛️",
    offers: [
      {
        title: "₹300 Instant Discount",
        description: "Every SBI card user gets automatic discount",
        discount: "₹300",
        code: "SBI300",
        terms: "Minimum purchase ₹2000",
      },
      {
        title: "Reward Points",
        description: "1 point per rupee on home services",
        discount: "Redeemable",
        code: "SBI_REWARDS",
        terms: "SBI card members",
      },
      {
        title: "Senior Citizen Benefit",
        description: "Additional 10% discount for senior citizens",
        discount: "10% OFF",
        code: "SBI_SENIOR",
        terms: "Age 60 & above",
      },
    ],
  },
];

export function BankOffers() {
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code "${code}" copied to clipboard!`);
  };

  return (
    <section className="py-14 md:py-20 bg-gradient-to-r from-slate-50 to-cyan-50 dark:from-slate-950 dark:to-cyan-950/20 border-y">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-3">
            <CreditCard className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-full">
              BANK PARTNERSHIPS
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
            Exclusive Bank Offers
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Get extra savings with your favorite bank or card
          </p>
        </motion.div>

        {/* Bank Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="hdfc" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-2 h-auto p-2 bg-white dark:bg-slate-900 rounded-2xl border">
              {bankOffers.map((bank) => (
                <TabsTrigger
                  key={bank.id}
                  value={bank.id}
                  className="rounded-xl data-[state=active]:bg-blue-100 dark:data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-700 dark:data-[state=active]:text-blue-400 font-bold text-xs sm:text-sm"
                >
                  <span className="mr-1">{bank.logo}</span>
                  {bank.bank.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {bankOffers.map((bank) => (
              <TabsContent key={bank.id} value={bank.id} className="mt-6 space-y-3">
                {bank.offers.map((offer, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900/50 border-2 border-blue-200 dark:border-blue-900/30 hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-black text-base text-foreground flex items-center gap-2">
                          <Gift className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          {offer.title}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{offer.description}</p>
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="shrink-0 ml-3 px-3 py-1 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-black"
                      >
                        {offer.discount}
                      </motion.div>
                    </div>

                    {/* Code Box */}
                    <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                      <DollarSign className="h-4 w-4 text-slate-600 dark:text-slate-400 flex-shrink-0" />
                      <code className="font-mono font-bold text-sm text-foreground flex-1 break-all">
                        {offer.code}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 px-2 rounded-lg text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        onClick={() => copyToClipboard(offer.code)}
                      >
                        Copy
                      </Button>
                    </div>

                    {/* Terms */}
                    <p className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2">
                      <span className="font-bold">Terms:</span> {offer.terms}
                    </p>
                  </motion.div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl border-2 border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-start gap-3"
        >
          <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-foreground">Combine Offers</p>
            <p className="text-xs text-muted-foreground mt-1">
              Stack bank offers with our seasonal discounts for maximum savings. Some exclusions may apply.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
