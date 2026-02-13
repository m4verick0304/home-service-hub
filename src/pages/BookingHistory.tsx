import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2, Inbox, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  confirmed: "uc-badge-blue",
  ongoing: "uc-badge-gold",
  completed: "uc-badge-green",
  cancelled: "bg-destructive/10 text-destructive",
};

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

    supabase
      .from("bookings")
      .select("*, services(*)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookings(data || []);
        setLoading(false);
      });

    const channel = supabase
      .channel("bookings-history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            supabase.from("bookings").select("*, services(*)").eq("id", (payload.new as any).id).maybeSingle().then(({ data }) => {
              if (data) setBookings((prev) => [data, ...prev]);
            });
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) => (b.id === (payload.new as any).id ? { ...b, ...payload.new } : b))
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((b) => b.id !== (payload.old as any).id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profile]);

  return (
    <div className="min-h-screen bg-background">
      <header className="uc-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-lg"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold text-white">Booking History</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8 space-y-3">
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-foreground" />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-black text-foreground">No bookings yet</h2>
            <p className="text-muted-foreground mt-1 text-sm">Book your first service to get started!</p>
            <Button className="mt-6 rounded-xl font-bold" onClick={() => navigate("/")}>
              Browse Services
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.05 }}
            className="space-y-3"
          >
            {bookings.map((booking) => (
              <motion.div key={booking.id} variants={item}>
                <Card
                  className="border shadow-uc cursor-pointer hover:shadow-uc-hover transition-all duration-300 hover:-translate-y-0.5 group rounded-xl overflow-hidden"
                  onClick={() => navigate(`/confirmation/${booking.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-sm text-foreground">{booking.services?.name || "Service"}</h3>
                      <Badge className={`border-0 font-bold text-[11px] ${statusColors[booking.status] || "bg-muted text-muted-foreground"}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </span>
                        {booking.provider_name && (
                          <span className="font-medium">{booking.provider_name}</span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default BookingHistory;
