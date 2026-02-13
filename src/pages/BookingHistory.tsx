import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Loader2, Inbox, ArrowRight, ChevronRight } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  ongoing: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
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
      <header className="sticky top-0 z-10 border-b glass">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-extrabold">Booking History</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-3">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-20 w-20 rounded-full bg-muted/60 flex items-center justify-center mb-4">
              <Inbox className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h2 className="text-xl font-extrabold text-foreground">No bookings yet</h2>
            <p className="text-muted-foreground mt-2 font-medium">Book your first service to get started!</p>
            <Button className="mt-6 rounded-xl gradient-primary shadow-glow font-bold" onClick={() => navigate("/")}>
              Browse Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ staggerChildren: 0.06 }}
            className="space-y-3"
          >
            {bookings.map((booking) => (
              <motion.div key={booking.id} variants={item}>
                <Card
                  className="border-0 shadow-card cursor-pointer hover:shadow-elevated transition-all duration-300 hover:-translate-y-0.5 group"
                  onClick={() => navigate(`/confirmation/${booking.id}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-foreground">{booking.services?.name || "Service"}</h3>
                      <Badge className={`border-0 font-bold text-xs ${statusColors[booking.status] || "bg-muted text-muted-foreground"}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(booking.created_at), "MMM d, yyyy")}
                        </span>
                        {booking.provider_name && (
                          <span className="font-medium">{booking.provider_name}</span>
                        )}
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
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
