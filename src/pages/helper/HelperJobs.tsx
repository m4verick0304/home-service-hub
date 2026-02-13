import { useState } from "react";
import { HelperBottomNav } from "@/components/helper/HelperBottomNav";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { motion } from "framer-motion";
import { Briefcase, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

type JobFilter = "all" | "completed" | "cancelled" | "ongoing";

const allJobs = [
  { id: 1, service: "Electrical Repair", client: "Amit S.", date: "Feb 12, 2026", status: "completed" as const, amount: "₹450", address: "Sector 45, Gurugram" },
  { id: 2, service: "Plumbing Fix", client: "Priya M.", date: "Feb 11, 2026", status: "completed" as const, amount: "₹350", address: "DLF Phase 3" },
  { id: 3, service: "Wiring Work", client: "Vikram P.", date: "Feb 10, 2026", status: "cancelled" as const, amount: "—", address: "MG Road" },
  { id: 4, service: "AC Repair", client: "Neha K.", date: "Feb 9, 2026", status: "completed" as const, amount: "₹800", address: "Sohna Road" },
  { id: 5, service: "Fan Installation", client: "Ravi T.", date: "Feb 8, 2026", status: "completed" as const, amount: "₹300", address: "Sector 56" },
  { id: 6, service: "Pipe Leak Fix", client: "Sunita D.", date: "Feb 7, 2026", status: "completed" as const, amount: "₹500", address: "Huda City Centre" },
  { id: 7, service: "Switch Repair", client: "Karan M.", date: "Feb 6, 2026", status: "cancelled" as const, amount: "—", address: "Sector 14" },
  { id: 8, service: "Geyser Repair", client: "Meera L.", date: "Feb 5, 2026", status: "completed" as const, amount: "₹650", address: "Palam Vihar" },
];

const HelperJobs = () => {
  const [filter, setFilter] = useState<JobFilter>("all");
  const [search, setSearch] = useState("");

  const filters: { key: JobFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "completed", label: "Completed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const filtered = allJobs.filter(job => {
    if (filter !== "all" && job.status !== filter) return false;
    if (search && !job.service.toLowerCase().includes(search.toLowerCase()) && !job.client.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalEarned = filtered.reduce((sum, j) => {
    const n = parseInt(j.amount.replace(/[₹,—]/g, "")) || 0;
    return sum + n;
  }, 0);

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      {/* Header */}
      <div className="bg-foreground text-background px-4 pt-12 pb-5">
        <h1 className="text-lg font-bold text-background mb-4">My Jobs</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-background/40" />
          <Input
            placeholder="Search jobs or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 pl-9 rounded-xl bg-background/10 border-background/20 text-background placeholder:text-background/40 focus-visible:ring-background/30"
          />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Filter pills */}
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f.key ? "bg-foreground text-background" : "bg-card border text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Summary */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-card border">
          <span className="text-xs text-muted-foreground font-medium">{filtered.length} jobs found</span>
          {totalEarned > 0 && (
            <span className="text-xs font-bold text-[hsl(var(--sh-green))]">Total: ₹{totalEarned.toLocaleString()}</span>
          )}
        </div>

        {/* Job list */}
        <div className="space-y-2">
          {filtered.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="p-4 rounded-xl bg-card border sh-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{job.service}</p>
                    <p className="text-[11px] text-muted-foreground">{job.client}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{job.amount}</p>
                  <StatusBadge status={job.status} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t text-[11px] text-muted-foreground">
                <span>{job.date}</span>
                <span>{job.address}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-bold text-foreground">No jobs found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <HelperBottomNav />
    </div>
  );
};

export default HelperJobs;
