import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LeafletMap } from "@/components/shared/LeafletMap";
import { motion } from "framer-motion";
import { Check, X, MapPin, Clock, Zap, Timer, Loader2, Inbox, IndianRupee, ChevronLeft } from "lucide-react";

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
  const [clientLat, setClientLat] = useState<number | undefined>();
  const [clientLng, setClientLng] = useState<number | undefined>();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setHelperLat(pos.coords.latitude + 0.005);
          setHelperLng(pos.coords.longitude - 0.008);
        },
        () => { },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  }, []);

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

    const channel = supabase
      .channel("helper-pending-bookings")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bookings" }, async (payload) => {
        const booking = payload.new as any;
        if (booking.status === "pending") {
          const { data } = await supabase.from("bookings").select("*, services(*)").eq("id", booking.id).maybeSingle();
          if (data) {
            setPendingBookings(prev => [data, ...prev]);
            if (!selectedBooking) setSelectedBooking(data);
          }
        }
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "bookings" }, (payload) => {
        const updated = payload.new as any;
        if (updated.status !== "pending") {
          setPendingBookings(prev => prev.filter(b => b.id !== updated.id));
          if (selectedBooking?.id === updated.id) setSelectedBooking(null);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selectedBooking && pendingBookings.length > 0) {
      const booking = pendingBookings[0];
      setSelectedBooking(booking);
      setClientLat(booking.latitude || undefined);
      setClientLng(booking.longitude || undefined);
      setCountdown(30);
      setExpired(false);
    } else if (selectedBooking) {
      setClientLat(selectedBooking.latitude || undefined);
      setClientLng(selectedBooking.longitude || undefined);
    }
  }, [pendingBookings, selectedBooking]);

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
    if (!error) navigate("/helper/active-job");
  };

  const handleReject = () => {
    setPendingBookings(prev => prev.filter(b => b.id !== selectedBooking?.id));
    setSelectedBooking(null);
    setCountdown(30);
    setExpired(false);
  };

  // UC-style minimal header
  const UCHeader = ({ title }: { title: string }) => (
    <div className="sticky top-0 z-40 bg-card border-b">
      <div className="flex items-center h-14 px-4 max-w-lg mx-auto">
        <button onClick={() => navigate("/helper/dashboard")} className="p-1 -ml-1 mr-3">
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
        <h1 className="text-base font-bold text-foreground">{title}</h1>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/50">
        <UCHeader title="Job Requests" />
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!selectedBooking || pendingBookings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/50">
        <UCHeader title="Job Requests" />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center mb-4">
            <Inbox className="h-7 w-7 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">No Pending Leads</h2>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Stay online to receive new service leads in real-time.</p>
          <button onClick={() => navigate("/helper/dashboard")} className="mt-5 text-sm font-bold text-primary">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (expired) {
    return (
      <div className="min-h-screen bg-muted/50">
        <UCHeader title="Lead Expired" />
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <Timer className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-lg font-bold text-foreground">Lead Expired</h2>
          <p className="text-sm text-muted-foreground mt-1.5">This lead was reassigned to another professional.</p>
          <button onClick={handleReject} className="mt-5 text-sm font-bold text-primary">
            {pendingBookings.length > 1 ? "View Next Lead →" : "← Back to Dashboard"}
          </button>
        </div>
      </div>
    );
  }

  const serviceName = selectedBooking.services?.name || "Service Request";
  const serviceDesc = selectedBooking.services?.description || "Service request";
  const priceRange = selectedBooking.services?.price_range || "—";

  return (
    <div className="min-h-screen bg-muted/50">
      <UCHeader title="New Lead" />

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Pending count */}
        {pendingBookings.length > 1 && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground bg-card border rounded-full px-3 py-1">
              {pendingBookings.length} leads waiting
            </span>
          </div>
        )}

        {/* Timer + Service - UC compact card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border sh-shadow overflow-hidden">
          {/* Timer bar */}
          <div className="relative h-1 bg-muted">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[hsl(var(--sh-orange))]"
              initial={{ width: "100%" }}
              animate={{ width: `${(countdown / 30) * 100}%` }}
              transition={{ duration: 1, ease: "linear" }}
            />
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[hsl(var(--sh-orange))]/10 flex items-center justify-center">
                  <Zap className="h-5 w-5 text-[hsl(var(--sh-orange))]" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-foreground">{serviceName}</h2>
                  <p className="text-xs text-muted-foreground">{serviceDesc}</p>
                </div>
              </div>
              <div className="text-center">
                <span className="text-2xl font-black text-foreground">{countdown}</span>
                <p className="text-[9px] text-muted-foreground font-medium">sec</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/70">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Location</p>
                  <p className="text-xs font-bold text-foreground truncate">{selectedBooking.address?.split(",")[0] || "Nearby"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/70">
                <IndianRupee className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Earnings</p>
                  <p className="text-xs font-bold text-foreground">{priceRange}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <LeafletMap
              className="h-[160px] rounded-lg overflow-hidden"
              showHelper
              helperLabel="You"
              userLabel="Client"
              helperLat={helperLat}
              helperLng={helperLng}
              userLat={clientLat}
              userLng={clientLng}
            />

            <div className="flex items-center gap-2 mt-3 p-2.5 rounded-lg bg-muted/70">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
              <p className="text-xs font-medium text-foreground">{selectedBooking.address || "Address not provided"}</p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons - UC style full width stacked */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-12 rounded-xl font-bold text-sm border-destructive/20 text-destructive hover:bg-destructive/5"
            onClick={handleReject}
          >
            <X className="h-4 w-4 mr-1.5" /> Decline
          </Button>
          <Button
            className="h-12 rounded-xl font-bold text-sm bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90 text-white border-0"
            onClick={handleAccept}
            disabled={accepting}
          >
            {accepting ? <Loader2 className="h-4 w-4 animate-spin mr-1.5" /> : <Check className="h-4 w-4 mr-1.5" />}
            Accept Lead
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelperJobRequest;
