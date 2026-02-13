import { useState } from "react";
import { HelperBottomNav } from "@/components/helper/HelperBottomNav";
import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight, ArrowDownRight, IndianRupee, Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

type Period = "today" | "week" | "month";

const earningsData = {
  today: { total: 1200, jobs: 3, avg: 400, change: 15 },
  week: { total: 8400, jobs: 18, avg: 467, change: 8 },
  month: { total: 24500, jobs: 56, avg: 438, change: 12 },
};

const dailyBreakdown = [
  { day: "Mon", amount: 800, jobs: 2 },
  { day: "Tue", amount: 1500, jobs: 4 },
  { day: "Wed", amount: 1200, jobs: 3 },
  { day: "Thu", amount: 950, jobs: 2 },
  { day: "Fri", amount: 1800, jobs: 5 },
  { day: "Sat", amount: 900, jobs: 2 },
  { day: "Sun", amount: 0, jobs: 0 },
];

const transactions = [
  { id: 1, type: "credit" as const, desc: "Electrical Repair — Amit S.", amount: 450, date: "Feb 12" },
  { id: 2, type: "credit" as const, desc: "Plumbing Fix — Priya M.", amount: 350, date: "Feb 11" },
  { id: 3, type: "debit" as const, desc: "Platform fee", amount: 80, date: "Feb 11" },
  { id: 4, type: "credit" as const, desc: "AC Repair — Neha K.", amount: 800, date: "Feb 9" },
  { id: 5, type: "credit" as const, desc: "Fan Installation — Ravi T.", amount: 300, date: "Feb 8" },
  { id: 6, type: "debit" as const, desc: "Platform fee", amount: 55, date: "Feb 8" },
  { id: 7, type: "credit" as const, desc: "Pipe Leak Fix — Sunita D.", amount: 500, date: "Feb 7" },
];

const HelperEarnings = () => {
  const [period, setPeriod] = useState<Period>("week");
  const data = earningsData[period];
  const maxDayAmount = Math.max(...dailyBreakdown.map(d => d.amount), 1);

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      {/* Header */}
      <div className="bg-foreground text-background px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-lg font-bold text-background">Earnings</h1>
          <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-background/10 text-xs gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>

        {/* Period tabs */}
        <div className="flex rounded-xl bg-background/10 p-1 mb-5">
          {(["today", "week", "month"] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                period === p ? "bg-background text-foreground shadow-sm" : "text-background/60"
              }`}
            >
              {p === "today" ? "Today" : p === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>

        {/* Big number */}
        <div className="text-center">
          <p className="text-3xl font-black text-background">₹{data.total.toLocaleString()}</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-xs text-background/60">{data.jobs} jobs</span>
            <span className="text-xs text-background/40">•</span>
            <span className="text-xs text-background/60">₹{data.avg} avg</span>
            <span className="text-xs text-background/40">•</span>
            <span className={`text-xs font-semibold flex items-center gap-0.5 ${data.change >= 0 ? "text-[hsl(var(--sh-green))]" : "text-destructive"}`}>
              {data.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(data.change)}%
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-3 space-y-4">
        {/* Daily chart — liquid flow bars */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border sh-shadow-md p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Daily Breakdown</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {dailyBreakdown.map((d, i) => {
              const heightPct = maxDayAmount > 0 ? (d.amount / maxDayAmount) * 100 : 0;
              const isToday = i === 3;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] font-bold text-muted-foreground">₹{d.amount}</span>
                  <div className="w-full relative" style={{ height: `${Math.max(heightPct, 4)}%` }}>
                    <motion.div
                      className="absolute inset-x-0 bottom-0 rounded-full overflow-hidden"
                      initial={{ height: 0 }}
                      animate={{ height: "100%" }}
                      transition={{
                        duration: 1.2,
                        delay: i * 0.1,
                        ease: [0.34, 1.56, 0.64, 1],
                      }}
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: isToday
                            ? "linear-gradient(180deg, hsl(var(--sh-blue)) 0%, hsl(var(--foreground)) 100%)"
                            : "linear-gradient(180deg, hsl(var(--primary) / 0.4) 0%, hsl(var(--primary) / 0.15) 100%)",
                        }}
                      />
                      {/* Liquid shimmer */}
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)",
                          backgroundSize: "100% 200%",
                        }}
                        animate={{ backgroundPosition: ["0% 0%", "0% 200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                      />
                    </motion.div>
                  </div>
                  <span className={`text-[10px] font-bold ${isToday ? "text-foreground" : "text-muted-foreground"}`}>{d.day}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-card border sh-shadow">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-[hsl(var(--sh-green))]/10 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-[hsl(var(--sh-green))]" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Best Day</span>
            </div>
            <p className="text-lg font-black text-foreground">₹1,800</p>
            <p className="text-[10px] text-muted-foreground">Friday • 5 jobs</p>
          </div>
          <div className="p-3.5 rounded-xl bg-card border sh-shadow">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">Payout</span>
            </div>
            <p className="text-lg font-black text-foreground">₹7,150</p>
            <p className="text-[10px] text-muted-foreground">Next: Feb 15</p>
          </div>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Transactions</h3>
          <div className="space-y-1.5">
            {transactions.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 rounded-xl bg-card border"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                    t.type === "credit" ? "bg-[hsl(var(--sh-green))]/10" : "bg-destructive/10"
                  }`}>
                    <IndianRupee className={`h-3.5 w-3.5 ${t.type === "credit" ? "text-[hsl(var(--sh-green))]" : "text-destructive"}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{t.desc}</p>
                    <p className="text-[10px] text-muted-foreground">{t.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${t.type === "credit" ? "text-[hsl(var(--sh-green))]" : "text-destructive"}`}>
                  {t.type === "credit" ? "+" : "−"}₹{t.amount}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <HelperBottomNav />
    </div>
  );
};

export default HelperEarnings;
