import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HelperBottomNav } from "@/components/helper/HelperBottomNav";
import { useRealtimeJobAlerts } from "@/hooks/useRealtimeJobAlerts";
import { LeafletMap } from "@/components/shared/LeafletMap";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  Star, Briefcase, Bell, ChevronRight,
  ToggleLeft, ToggleRight, Wrench, Zap, X,
  TrendingUp, Calendar, Award
} from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";

const mockHelper = {
  name: "Rajesh Kumar",
  skills: ["Electrician", "Plumber"],
  rating: 4.8,
  totalJobs: 156,
  todayEarnings: "₹1,200",
  completionRate: 94,
};

const recentJobs = [
  { id: 1, service: "Electrical Repair", client: "Amit S.", date: "Feb 12", status: "completed" as const, amount: "₹450" },
  { id: 2, service: "Plumbing Fix", client: "Priya M.", date: "Feb 11", status: "completed" as const, amount: "₹350" },
  { id: 3, service: "Wiring Work", client: "Vikram P.", date: "Feb 10", status: "cancelled" as const, amount: "—" },
];

interface ServiceNotification {
  id: string;
  serviceName: string;
  address: string | null;
  time: Date;
  read: boolean;
}

const HelperDashboard = () => {
  const navigate = useNavigate();
  const [isAvailable, setIsAvailable] = useState(true);
  const { alerts, dismissAlert } = useRealtimeJobAlerts();
  const [userLat, setUserLat] = useState<number | undefined>();
  const [userLng, setUserLng] = useState<number | undefined>();
  const [notifications, setNotifications] = useState<ServiceNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const initials = mockHelper.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  // Get GPS location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLat(pos.coords.latitude);
          setUserLng(pos.coords.longitude);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Listen for new bookings → notifications (only when online)
  const fetchServiceName = useCallback(async (serviceId: string): Promise<string> => {
    const { data } = await supabase
      .from("services")
      .select("name")
      .eq("id", serviceId)
      .maybeSingle();
    return data?.name || "Service Request";
  }, []);

  useEffect(() => {
    if (!isAvailable) return;

    const channel = supabase
      .channel("helper-notif-center")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookings" },
        async (payload) => {
          const booking = payload.new as any;
          const serviceName = await fetchServiceName(booking.service_id);
          const notif: ServiceNotification = {
            id: `${booking.id}-${Date.now()}`,
            serviceName,
            address: booking.address,
            time: new Date(),
            read: false,
          };
          setNotifications(prev => [notif, ...prev].slice(0, 30));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAvailable, fetchServiceName]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      {/* Dark header */}
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
          {/* Notification bell */}
          <button
            onClick={() => setShowNotifications(o => !o)}
            className="relative p-2 rounded-full hover:bg-background/10 transition-colors"
          >
            <Bell className="h-5 w-5 text-background/80" />
            {unreadCount > 0 && (
              <span className="absolute top-0.5 right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[8px] font-bold text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Online/Offline toggle */}
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`w-full flex items-center justify-between p-3.5 rounded-xl transition-all ${
            isAvailable ? "bg-[hsl(var(--sh-green))]/20 border border-[hsl(var(--sh-green))]/40" : "bg-background/10 border border-background/20"
          }`}
        >
          <div className="flex items-center gap-3">
            {isAvailable ? <ToggleRight className="h-7 w-7 text-[hsl(var(--sh-green))]" /> : <ToggleLeft className="h-7 w-7 text-background/40" />}
            <div className="text-left">
              <p className="text-sm font-bold text-background">{isAvailable ? "You're Online" : "You're Offline"}</p>
              <p className="text-[11px] text-background/50">{isAvailable ? "Receiving job notifications" : "Go online to receive notifications"}</p>
            </div>
          </div>
          <div className={`h-3 w-3 rounded-full ${isAvailable ? "bg-[hsl(var(--sh-green))] animate-pulse" : "bg-background/30"}`} />
        </button>
      </div>

      {/* Notification dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-4 top-28 w-80 rounded-2xl bg-card border sh-shadow-lg z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-sm font-bold text-foreground">Notifications</h3>
              <div className="flex gap-2 items-center">
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-primary font-semibold hover:underline">Mark all read</button>
                )}
                <button onClick={() => setShowNotifications(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="h-7 w-7 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {isAvailable ? "You'll see new service requests here" : "Go online to receive notifications"}
                  </p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 transition-colors ${!n.read ? "bg-primary/5" : ""}`}
                  >
                    <div className="h-8 w-8 rounded-lg bg-[hsl(var(--sh-orange))]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Wrench className="h-4 w-4 text-[hsl(var(--sh-orange))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${!n.read ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                        🔔 New: {n.serviceName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{n.address || "Nearby location"}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground flex-shrink-0 mt-0.5">{timeAgo(n.time)}</span>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-lg px-4 -mt-3 space-y-4">
        {/* Live GPS Map */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <LeafletMap
            className="h-48"
            userLat={userLat}
            userLng={userLng}
            showHelper={false}
            userLabel="You"
          />
        </motion.div>

        {/* Earnings Card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="rounded-2xl bg-card border sh-shadow-md overflow-hidden">
          <div className="p-4 pb-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Today's Summary</h3>
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1"><Calendar className="h-3 w-3" /> Feb 13</span>
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
            <button onClick={() => navigate("/helper/earnings")} className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <TrendingUp className="h-3.5 w-3.5" /> View Earnings
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <Award className="h-3.5 w-3.5" /> My Ratings
            </button>
          </div>
        </motion.div>

        {/* Skills */}
        <div className="flex items-center gap-2">
          {mockHelper.skills.map(skill => (
            <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border text-xs font-semibold text-foreground">
              {skill === "Electrician" ? <Zap className="h-3 w-3 text-[hsl(var(--sh-orange))]" /> : <Wrench className="h-3 w-3 text-primary" />}
              {skill}
            </span>
          ))}
        </div>

        {/* Lead Alerts */}
        <AnimatePresence>
          {isAvailable && alerts.length > 0 && alerts.map((alert) => (
            <motion.div key={alert.id} initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 80 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}>
              <button onClick={() => navigate("/helper/job-request")} className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border-l-4 border-l-[hsl(var(--sh-orange))] border sh-shadow hover:sh-shadow-md transition-shadow group relative">
                <div className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors z-10" onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}>
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

        {isAvailable && alerts.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <button onClick={() => navigate("/helper/job-request")} className="w-full flex items-center gap-3 p-4 rounded-xl bg-card border-l-4 border-l-[hsl(var(--sh-orange))] border sh-shadow hover:sh-shadow-md transition-shadow group">
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

        {/* Weekly */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">This Week</h3>
            <button onClick={() => navigate("/helper/earnings")} className="text-xs font-semibold text-primary">See All →</button>
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

        {/* Recent Jobs */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Jobs</h3>
            <button onClick={() => navigate("/helper/jobs")} className="text-xs font-semibold text-primary">View All →</button>
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
