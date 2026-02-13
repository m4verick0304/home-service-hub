import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useRealtimeJobAlerts } from "@/hooks/useRealtimeJobAlerts";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star, Briefcase, Bell, ChevronRight,
  ToggleLeft, ToggleRight, Wrench, Zap, X, Home,
  Wallet, User, TrendingUp, Calendar, Award
} from "lucide-react";

const mockHelper = {
  name: "Rajesh Kumar",
  skills: ["Electrician", "Plumber"],
  rating: 4.8,
  totalJobs: 156,
  earnings: "₹24,500",
  todayEarnings: "₹1,200",
  weekEarnings: "₹8,400",
  joined: "Jan 2025",
  completionRate: 94,
};

const recentJobs = [
  { id: 1, service: "Electrical Repair", client: "Amit S.", date: "Feb 12", status: "completed" as const, amount: "₹450" },
  { id: 2, service: "Plumbing Fix", client: "Priya M.", date: "Feb 11", status: "completed" as const, amount: "₹350" },
  { id: 3, service: "Wiring Work", client: "Vikram P.", date: "Feb 10", status: "cancelled" as const, amount: "—" },
];

const HelperBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: "Home", path: "/helper/dashboard" },
    { icon: Briefcase, label: "Jobs", path: "/helper/job-request" },
    { icon: Wallet, label: "Earnings", path: "/helper/dashboard" },
    { icon: User, label: "Profile", path: "/helper/dashboard" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
              isActive(item.path) && item.label === "Home"
                ? "text-foreground"
                : "text-muted-foreground"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const { alerts, dismissAlert } = useRealtimeJobAlerts();

  const initials = mockHelper.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      {/* UC-style top header */}
      <div className="bg-foreground text-background px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11 border-2 border-background/20">
              <AvatarFallback className="bg-background/10 text-background font-bold text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-base font-bold text-background">{mockHelper.name}</h2>
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 fill-[hsl(var(--sh-orange))] text-[hsl(var(--sh-orange))]" />
                <span className="text-xs font-semibold text-background/80">{mockHelper.rating}</span>
                <span className="text-xs text-background/50">• {mockHelper.totalJobs} jobs</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate("/helper/job-request")}
            className="relative p-2 rounded-full hover:bg-background/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-background/80" />
            {(alerts.length > 0) && (
              <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--sh-orange))] border border-foreground" />
            )}
          </button>
        </div>

        {/* Availability toggle - UC style */}
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
            isAvailable
              ? "bg-[hsl(var(--sh-green))]/20 border border-[hsl(var(--sh-green))]/40"
              : "bg-background/10 border border-background/20"
          }`}
        >
          <div className="flex items-center gap-3">
            {isAvailable ? (
              <ToggleRight className="h-7 w-7 text-[hsl(var(--sh-green))]" />
            ) : (
              <ToggleLeft className="h-7 w-7 text-background/40" />
            )}
            <div className="text-left">
              <p className="text-sm font-bold text-background">
                {isAvailable ? "You're Online" : "You're Offline"}
              </p>
              <p className="text-[11px] text-background/50">
                {isAvailable ? "Accepting new leads" : "Go online to receive leads"}
              </p>
            </div>
          </div>
          <div className={`h-3 w-3 rounded-full ${isAvailable ? "bg-[hsl(var(--sh-green))] animate-pulse" : "bg-background/30"}`} />
        </button>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-3 space-y-4">
        {/* Earnings Card - UC signature */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border sh-shadow-md overflow-hidden">
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Today's Summary</h3>
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Feb 13
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xl font-black text-foreground">{mockHelper.todayEarnings}</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Today's Earnings</p>
              </div>
              <div>
                <p className="text-xl font-black text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Jobs Done</p>
              </div>
              <div>
                <p className="text-xl font-black text-[hsl(var(--sh-green))]">{mockHelper.completionRate}%</p>
                <p className="text-[10px] text-muted-foreground font-medium mt-0.5">Completion</p>
              </div>
            </div>
          </div>
          <div className="flex border-t divide-x">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <TrendingUp className="h-3.5 w-3.5" /> View Earnings
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <Award className="h-3.5 w-3.5" /> My Ratings
            </button>
          </div>
        </motion.div>

        {/* Skills badges */}
        <div className="flex items-center gap-2">
          {mockHelper.skills.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border text-xs font-semibold text-foreground">
              {skill === "Electrician" ? <Zap className="h-3 w-3 text-[hsl(var(--sh-orange))]" /> : <Wrench className="h-3 w-3 text-primary" />}
              {skill}
            </span>
          ))}
        </div>

        {/* New Lead Alerts - UC style */}
        <AnimatePresence>
          {isAvailable && alerts.length > 0 && alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
              <button
                onClick={() => navigate("/helper/job-request")}
                className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border-l-4 border-l-[hsl(var(--sh-orange))] border sh-shadow hover:sh-shadow-md transition-shadow group relative"
              >
                <div
                  className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors z-10"
                  onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                >
                  <X className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="h-10 w-10 rounded-xl bg-[hsl(var(--sh-orange))]/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-[hsl(var(--sh-orange))]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold text-sm text-foreground">New Lead!</p>
                  <p className="text-xs text-muted-foreground">{alert.serviceName} • {alert.address || "Nearby"}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Static demo alert */}
        {isAvailable && alerts.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button
              onClick={() => navigate("/helper/job-request")}
              className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border-l-4 border-l-[hsl(var(--sh-orange))] border sh-shadow hover:sh-shadow-md transition-shadow group"
            >
              <div className="h-10 w-10 rounded-xl bg-[hsl(var(--sh-orange))]/10 flex items-center justify-center flex-shrink-0 relative">
                <Bell className="h-5 w-5 text-[hsl(var(--sh-orange))]" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--sh-orange))] animate-pulse" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-foreground">New Lead!</p>
                <p className="text-xs text-muted-foreground">Electrical Repair • 1.8 km away</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </motion.div>
        )}

        {/* Weekly Earnings - UC style horizontal scroll */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">This Week</h3>
            <span className="text-xs font-semibold text-primary">See All →</span>
          </div>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const amounts = [800, 1500, 1200, 950, 1800, 900, 0];
              const jobs = [2, 4, 3, 2, 5, 2, 0];
              const isToday = i === 3;
              return (
                <div key={day} className={`flex-shrink-0 w-[72px] p-2.5 rounded-xl border text-center ${isToday ? "bg-foreground text-background border-foreground" : "bg-card"}`}>
                  <p className={`text-[10px] font-bold ${isToday ? "text-background/60" : "text-muted-foreground"}`}>{day}</p>
                  <p className={`text-sm font-black mt-0.5 ${isToday ? "text-background" : "text-foreground"}`}>₹{amounts[i]}</p>
                  <p className={`text-[9px] mt-0.5 ${isToday ? "text-background/50" : "text-muted-foreground"}`}>{jobs[i]} jobs</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Jobs - UC style */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Jobs</h3>
            <span className="text-xs font-semibold text-primary">View All →</span>
          </div>
          <div className="space-y-2">
            {recentJobs.map(job => (
              <div key={job.id} className="flex items-center justify-between p-3.5 rounded-xl bg-card border sh-shadow">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{job.service}</p>
                    <p className="text-[11px] text-muted-foreground">{job.client} • {job.date}</p>
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

      <HelperBottomNav />
    </div>
  );
};

export default HelperDashboard;
