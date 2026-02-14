import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { LeafletMap } from "@/components/shared/LeafletMap";
import { motion } from "framer-motion";
import { Phone, MapPin, Navigation, CheckCircle2, Zap, ChevronLeft, MessageSquare } from "lucide-react";

type JobStatus = "on_the_way" | "working" | "completed";

const statusSteps: { key: JobStatus; label: string }[] = [
  { key: "on_the_way", label: "On the Way" },
  { key: "working", label: "Working" },
  { key: "completed", label: "Completed" },
];

const HelperActiveJob = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<JobStatus>("on_the_way");
  const [activeJob, setActiveJob] = useState<any>(null);

  useEffect(() => {
    // In a real app, we'd fetch the active job from Supabase based on provider ID
    // For demo, we'll try to find a confirmed booking
    const fetchActiveJob = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("bookings")
        .select("*, services(*)")
        .eq("status", "confirmed")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (data) setActiveJob(data);
    };
    fetchActiveJob();
  }, []);

  const currentIdx = statusSteps.findIndex(s => s.key === status);

  const advanceStatus = () => {
    if (currentIdx < statusSteps.length - 1) {
      setStatus(statusSteps[currentIdx + 1].key);
    } else {
      navigate("/helper/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-muted/50">
      {/* UC-style header */}
      <div className="sticky top-0 z-40 bg-card border-b">
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/helper/dashboard")} className="p-1 -ml-1">
              <ChevronLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-base font-bold text-foreground">Active Job</h1>
          </div>
          <StatusBadge status={status} pulse={status !== "completed"} />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* Progress Steps - UC minimal */}
        <div className="flex items-center justify-between bg-card rounded-xl border p-3">
          {statusSteps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-1.5">
              <div className={`flex items-center justify-center h-7 w-7 rounded-full text-[10px] font-bold transition-colors ${i <= currentIdx
                ? "bg-foreground text-background"
                : "bg-muted text-muted-foreground"
                }`}>
                {i < currentIdx ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={`text-[11px] font-semibold hidden sm:block ${i <= currentIdx ? "text-foreground" : "text-muted-foreground"
                }`}>{step.label}</span>
              {i < statusSteps.length - 1 && (
                <div className={`h-[1.5px] w-6 sm:w-10 mx-1 ${i < currentIdx ? "bg-foreground" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Map */}
        <LeafletMap
          className="h-[200px] rounded-xl overflow-hidden border"
          showHelper
          helperLabel="You"
          userLabel="Client"
          userLat={activeJob?.latitude}
          userLng={activeJob?.longitude}
        />

        {/* Job Info - UC card style */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-[hsl(var(--sh-orange))]/10 flex items-center justify-center">
                <Zap className="h-5 w-5 text-[hsl(var(--sh-orange))]" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{activeJob?.services?.name || "Service"}</h3>
                <p className="text-[11px] text-muted-foreground">{activeJob?.services?.category || "General"} • {activeJob?.services?.price_range || "—"}</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/70">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Client Address</p>
                  <p className="text-xs font-semibold text-foreground">{activeJob?.address || "Address not provided"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/70">
                <Phone className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-[9px] text-muted-foreground font-semibold uppercase">Client Phone</p>
                  <p className="text-xs font-semibold text-foreground">+91 98765 43210</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick actions row */}
          <div className="flex border-t divide-x">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <Phone className="h-3.5 w-3.5" /> Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <MessageSquare className="h-3.5 w-3.5" /> Message
            </button>
            <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-primary hover:bg-muted/50 transition-colors">
              <Navigation className="h-3.5 w-3.5" /> Navigate
            </button>
          </div>
        </motion.div>

        {/* Status Action Button */}
        <Button
          className={`w-full h-13 rounded-xl font-bold text-sm border-0 text-white transition-colors ${status === "on_the_way" ? "bg-[hsl(var(--sh-orange))] hover:bg-[hsl(var(--sh-orange))]/90" :
            status === "working" ? "bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90" :
              "bg-foreground hover:bg-foreground/90"
            }`}
          onClick={advanceStatus}
        >
          {status === "on_the_way" && "I've Arrived — Start Job"}
          {status === "working" && "Mark as Completed"}
          {status === "completed" && "Back to Dashboard"}
        </Button>
      </div>
    </div>
  );
};

export default HelperActiveJob;
