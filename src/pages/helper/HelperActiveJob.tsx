import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/shared/AppHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { motion } from "framer-motion";
import { Phone, MapPin, MessageSquare, CheckCircle2, Navigation, Zap } from "lucide-react";

type JobStatus = "on_the_way" | "working" | "completed";

const statusSteps: { key: JobStatus; label: string }[] = [
  { key: "on_the_way", label: "On the Way" },
  { key: "working", label: "Working" },
  { key: "completed", label: "Completed" },
];

const HelperActiveJob = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<JobStatus>("on_the_way");

  const currentIdx = statusSteps.findIndex(s => s.key === status);

  const advanceStatus = () => {
    if (currentIdx < statusSteps.length - 1) {
      setStatus(statusSteps[currentIdx + 1].key);
    } else {
      navigate("/helper/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Active Job" showBack backTo="/helper/dashboard" variant="white" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2">
          {statusSteps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-2">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full text-xs font-bold transition-colors ${
                i <= currentIdx
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}>
                {i < currentIdx ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${
                i <= currentIdx ? "text-foreground" : "text-muted-foreground"
              }`}>{step.label}</span>
              {i < statusSteps.length - 1 && (
                <div className={`h-[2px] w-8 sm:w-16 ${i < currentIdx ? "bg-primary" : "bg-border"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Map */}
        <MapPlaceholder className="h-[240px]" showHelper helperLabel="You" userLabel="Client" />

        {/* Job Info */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border sh-shadow space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--sh-orange-light))] flex items-center justify-center">
                <Zap className="h-6 w-6 text-[hsl(var(--sh-orange))]" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Electrical Repair</h3>
                <p className="text-xs text-muted-foreground">Residential • Wiring</p>
              </div>
            </div>
            <StatusBadge status={status} pulse={status !== "completed"} />
          </div>

          <div className="space-y-3 pt-3 border-t">
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Client Address</p>
                <p className="text-sm font-semibold text-foreground">123 MG Road, Sector 45, Gurugram</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Client Phone</p>
                <p className="text-sm font-semibold text-foreground">+91 98765 43210</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-12 rounded-xl font-semibold">
            <Phone className="h-4 w-4 mr-2" /> Call Client
          </Button>
          <Button variant="outline" className="h-12 rounded-xl font-semibold">
            <Navigation className="h-4 w-4 mr-2" /> Navigate
          </Button>
        </div>

        {/* Status Action Button */}
        <Button
          className={`w-full h-14 rounded-2xl font-bold text-base border-0 text-white transition-colors ${
            status === "on_the_way" ? "bg-[hsl(var(--sh-orange))] hover:bg-[hsl(var(--sh-orange))]/90" :
            status === "working" ? "bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90" :
            "sh-gradient-blue"
          }`}
          onClick={advanceStatus}
        >
          {status === "on_the_way" && "Arrived — Start Working"}
          {status === "working" && "Mark as Completed"}
          {status === "completed" && "Back to Dashboard"}
        </Button>
      </div>
    </div>
  );
};

export default HelperActiveJob;
