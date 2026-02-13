import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { AppHeader } from "@/components/shared/AppHeader";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calendar, Loader2, Inbox, ChevronRight, User, XCircle } from "lucide-react";
import { format } from "date-fns";

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

const BookingHistory = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    supabase.from("bookings").select("*, services(*)").eq("user_id", profile.id).order("created_at", { ascending: false })
      .then(({ data }) => { setBookings(data || []); setLoading(false); });

    const channel = supabase.channel("bookings-history")
      .on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, (payload) => {
        if (payload.eventType === "INSERT") {
          supabase.from("bookings").select("*, services(*)").eq("id", (payload.new as any).id).maybeSingle().then(({ data }) => {
            if (data) setBookings(prev => [data, ...prev]);
          });
        } else if (payload.eventType === "UPDATE") {
          setBookings(prev => prev.map(b => b.id === (payload.new as any).id ? { ...b, ...payload.new } : b));
        } else if (payload.eventType === "DELETE") {
          setBookings(prev => prev.filter(b => b.id !== (payload.old as any).id));
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Booking History" showBack backTo="/" variant="primary" />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-black text-foreground">No bookings yet</h2>
            <p className="text-muted-foreground mt-1 text-sm">Book your first service to get started!</p>
            <Button className="mt-6 rounded-xl font-bold sh-gradient-blue border-0 text-white" onClick={() => navigate("/")}>
              Browse Services
            </Button>
          </motion.div>
        ) : (
          <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.05 }} className="space-y-3">
            {bookings.map((booking) => (
              <motion.div key={booking.id} variants={item}>
                <button
                  className="w-full text-left p-4 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
                  onClick={() => navigate(`/confirmation/${booking.id}`)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-foreground">{booking.services?.name || "Service"}</h3>
                    <StatusBadge status={booking.status as any} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(booking.created_at), "MMM d, yyyy")}
                      </span>
                      {booking.provider_name && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-3 w-3" />
                          {booking.provider_name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            supabase.from("bookings").update({ status: "cancelled" }).eq("id", booking.id).then(({ error }) => {
                              if (error) {
                                toast({ title: "Cancel failed", description: error.message, variant: "destructive" });
                              } else {
                                toast({ title: "Booking cancelled" });
                              }
                            });
                          }}
                          className="text-destructive hover:bg-destructive/10 rounded-lg p-1 transition-colors"
                          title="Cancel booking"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;
