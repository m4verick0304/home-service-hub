import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { motion } from "framer-motion";
import {
  Star, MapPin, Clock, Briefcase, Bell,
  ChevronRight, ToggleLeft, ToggleRight, Wrench, Zap
} from "lucide-react";

const mockHelper = {
  name: "Rajesh Kumar",
  skills: ["Electrician", "Plumber"],
  rating: 4.8,
  totalJobs: 156,
  earnings: "₹24,500",
  joined: "Jan 2025",
};

const recentJobs = [
  { id: 1, service: "Electrical Repair", client: "Amit S.", date: "Feb 12", status: "completed" as const, amount: "₹450" },
  { id: 2, service: "Plumbing Fix", client: "Priya M.", date: "Feb 11", status: "completed" as const, amount: "₹350" },
  { id: 3, service: "Wiring Work", client: "Vikram P.", date: "Feb 10", status: "cancelled" as const, amount: "—" },
];

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);

  const initials = mockHelper.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        rightContent={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10 rounded-xl h-9 w-9 relative" onClick={() => navigate("/helper/job-request")}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--sh-orange))] border-2 border-primary" />
            </Button>
          </div>
        }
        initials={initials}
        profilePath="/helper/dashboard"
        variant="primary"
      />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-6">
        {/* Profile + Availability */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border sh-shadow">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary font-black text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-black text-foreground">{mockHelper.name}</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <Star className="h-3.5 w-3.5 fill-[hsl(var(--sh-orange))] text-[hsl(var(--sh-orange))]" />
                  <span className="text-sm font-semibold text-foreground">{mockHelper.rating}</span>
                  <span className="text-xs text-muted-foreground">• {mockHelper.totalJobs} jobs</span>
                </div>
              </div>
            </div>
            <StatusBadge status={isAvailable ? "available" : "offline"} pulse={isAvailable} />
          </div>

          {/* Skills */}
          <div className="flex items-center gap-2 mb-5">
            {mockHelper.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/5 text-xs font-semibold text-primary">
                {skill === "Electrician" ? <Zap className="h-3 w-3" /> : <Wrench className="h-3 w-3" />}
                {skill}
              </span>
            ))}
          </div>

          {/* Availability Toggle */}
          <button
            onClick={() => setIsAvailable(!isAvailable)}
            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              isAvailable
                ? "border-[hsl(var(--sh-green))]/30 bg-[hsl(var(--sh-green-light))]"
                : "border-border bg-muted"
            }`}
          >
            <div className="flex items-center gap-3">
              {isAvailable ? (
                <ToggleRight className="h-8 w-8 text-[hsl(var(--sh-green))]" />
              ) : (
                <ToggleLeft className="h-8 w-8 text-muted-foreground" />
              )}
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">
                  {isAvailable ? "You are Online" : "You are Offline"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isAvailable ? "Accepting new job requests" : "Toggle to start receiving jobs"}
                </p>
              </div>
            </div>
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Today's Earnings", value: "₹1,200", color: "text-[hsl(var(--sh-green))]" },
            { label: "Total Earnings", value: mockHelper.earnings, color: "text-primary" },
            { label: "Jobs Done", value: String(mockHelper.totalJobs), color: "text-[hsl(var(--sh-orange))]" },
          ].map((stat) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 rounded-2xl bg-card border sh-shadow text-center">
              <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground font-medium mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Incoming Job Alert */}
        {isAvailable && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <button
              onClick={() => navigate("/helper/job-request")}
              className="w-full flex items-center gap-4 p-5 rounded-2xl bg-[hsl(var(--sh-orange-light))] border border-[hsl(var(--sh-orange))]/20 hover:border-[hsl(var(--sh-orange))]/40 transition-all group"
            >
              <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--sh-orange))]/20 flex items-center justify-center flex-shrink-0 relative">
                <Bell className="h-6 w-6 text-[hsl(var(--sh-orange))]" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[hsl(var(--sh-orange))] animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-foreground">New Job Request!</p>
                <p className="text-xs text-muted-foreground">Electrical Repair • 1.8 km away</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[hsl(var(--sh-orange))] transition-colors" />
            </button>
          </motion.div>
        )}

        {/* Recent Jobs */}
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Recent Jobs</h3>
          <div className="space-y-2">
            {recentJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-card border sh-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                    <Briefcase className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{job.service}</p>
                    <p className="text-xs text-muted-foreground">{job.client} • {job.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{job.amount}</p>
                  <StatusBadge status={job.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelperDashboard;
