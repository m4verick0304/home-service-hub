import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/shared/AppHeader";
import { LeafletMap } from "@/components/shared/LeafletMap";
import { motion } from "framer-motion";
import { Check, X, MapPin, Clock, Zap, Timer, Loader2, Inbox } from "lucide-react";

const providerNames = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh"];

const HelperJobRequest = () => {
  const navigate = useNavigate();
  const [pendingBookings, setPendingBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [countdown, setCountdown] = useState(30);
  const [expired, setExpired] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [helperLat, setHelperLat] = useState(28.4595 + 0.012);
  const [helperLng, setHelperLng] = useState(77.0266 - 0.015);

  // Get helper's real GPS
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setHelperLat(pos.coords.latitude + 0.005);
          setHelperLng(pos.coords.longitude - 0.008);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

  // Fetch pending bookings
  useEffect(() => {
    const fetchPending = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, services(*)")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      setPendingBookings(data || []);
      if (data && data.length > 0 && !selectedBooking) {
        setSelectedBooking(data[0]);
      }
      setLoading(false);
    };
    fetchPending();

    // Listen for new pending bookings in realtime
    const channel = supabase
      .channel("helper-pending-bookings")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "bookings",
      }, async (payload) => {
        const booking = payload.new as any;
        if (booking.status === "pending") {
          // Fetch with service info
          const { data } = await supabase
            .from("bookings")
            .select("*, services(*)")
            .eq("id", booking.id)
            .maybeSingle();
          if (data) {
            setPendingBookings(prev => [data, ...prev]);
            if (!selectedBooking) setSelectedBooking(data);
          }
        }
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "bookings",
      }, (payload) => {
        const updated = payload.new as any;
        if (updated.status !== "pending") {
          setPendingBookings(prev => prev.filter(b => b.id !== updated.id));
          if (selectedBooking?.id === updated.id) {
            setSelectedBooking(null);
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  // Select first available if current is removed
  useEffect(() => {
    if (!selectedBooking && pendingBookings.length > 0) {
      setSelectedBooking(pendingBookings[0]);
      setCountdown(30);
      setExpired(false);
    }
  }, [pendingBookings, selectedBooking]);

  // Countdown timer
  useEffect(() => {
    if (!selectedBooking) return;
    if (countdown <= 0) { setExpired(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, selectedBooking]);

  const handleAccept = async () => {
    if (!selectedBooking) return;
    setAccepting(true);
    
    const providerName = providerNames[Math.floor(Math.random() * providerNames.length)];
    const eta = Math.floor(Math.random() * 30) + 15;

    const { error } = await supabase.from("bookings").update({
      status: "confirmed",
      provider_name: providerName,
      provider_phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      eta_minutes: eta,
    }).eq("id", selectedBooking.id);

    setAccepting(false);
    if (error) {
      console.error("Accept error:", error);
    } else {
      navigate("/helper/active-job");
    }
  };

  const handleReject = () => {
    setPendingBookings(prev => prev.filter(b => b.id !== selectedBooking?.id));
    setSelectedBooking(null);
    setCountdown(30);
    setExpired(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Job Requests" showBack backTo="/helper/dashboard" variant="white" />
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!selectedBooking || pendingBookings.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Job Requests" showBack backTo="/helper/dashboard" variant="white" />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Inbox className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-black text-foreground">No Pending Requests</h2>
          <p className="text-sm text-muted-foreground mt-2">New job requests will appear here in real-time.</p>
          <Button className="mt-6 rounded-xl font-bold sh-gradient-blue border-0 text-white" onClick={() => navigate("/helper/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="Job Request" showBack backTo="/helper/dashboard" variant="white" />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-[hsl(var(--sh-red-light))] flex items-center justify-center mb-4">
            <Timer className="h-8 w-8 text-[hsl(var(--sh-red))]" />
          </div>
          <h2 className="text-xl font-black text-foreground">Request Timed Out</h2>
          <p className="text-sm text-muted-foreground mt-2">This job was reassigned to another helper.</p>
          <Button className="mt-6 rounded-xl font-bold sh-gradient-blue border-0 text-white" onClick={() => {
            handleReject();
          }}>
            {pendingBookings.length > 1 ? "Next Request" : "Back to Dashboard"}
          </Button>
        </div>
      </div>
    );
  }

  const serviceName = selectedBooking.services?.name || "Service Request";
  const serviceDesc = selectedBooking.services?.description || "Service request";
  const priceRange = selectedBooking.services?.price_range || "—";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Incoming Job" showBack backTo="/helper/dashboard" variant="white" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Pending count badge */}
        {pendingBookings.length > 1 && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary bg-primary/10 rounded-full px-3 py-1.5">
              {pendingBookings.length} pending requests
            </span>
          </div>
        )}

        {/* Countdown */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative mx-auto h-20 w-20 mb-3">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="36" fill="none" stroke="hsl(var(--border))" strokeWidth="4" />
              <motion.circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke="hsl(var(--sh-orange))"
                strokeWidth="4"
                strokeDasharray={226}
                strokeDashoffset={226 - (226 * countdown) / 30}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-black text-foreground">{countdown}</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium">seconds to respond</p>
        </motion.div>

        {/* Job Details Card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border-2 border-[hsl(var(--sh-orange))]/30 sh-shadow-md space-y-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[hsl(var(--sh-orange-light))] flex items-center justify-center">
              <Zap className="h-7 w-7 text-[hsl(var(--sh-orange))]" />
            </div>
            <div>
              <h2 className="text-lg font-black text-foreground">{serviceName}</h2>
              <p className="text-sm text-muted-foreground">{serviceDesc}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Location</p>
                <p className="text-sm font-bold text-foreground truncate">{selectedBooking.address?.split(",")[0] || "Nearby"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted">
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Est. Earning</p>
                <p className="text-sm font-bold text-foreground">{priceRange}</p>
              </div>
            </div>
          </div>

          {/* Real map preview */}
          <LeafletMap
            className="h-[180px]"
            showHelper
            helperLabel="You"
            userLabel="Client"
            helperLat={helperLat}
            helperLng={helperLng}
          />

          <div className="p-3 rounded-xl bg-muted">
            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Client Location</p>
            <p className="text-sm font-semibold text-foreground">{selectedBooking.address || "Address not provided"}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-14 rounded-2xl font-bold text-base border-destructive/30 text-destructive hover:bg-destructive/5"
            onClick={handleReject}
          >
            <X className="h-5 w-5 mr-2" /> Reject
          </Button>
          <Button
            className="h-14 rounded-2xl font-bold text-base bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90 text-white border-0"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Check className="h-5 w-5 mr-2" />}
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelperJobRequest;
