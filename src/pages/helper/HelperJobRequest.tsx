import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/shared/AppHeader";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { motion } from "framer-motion";
import { Check, X, MapPin, Clock, Zap, Timer } from "lucide-react";

const HelperJobRequest = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(30);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (countdown <= 0) { setExpired(true); return; }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleAccept = () => {
    navigate("/helper/active-job");
  };

  const handleReject = () => {
    navigate("/helper/dashboard");
  };

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
          <Button className="mt-6 rounded-xl font-bold sh-gradient-blue border-0 text-white" onClick={() => navigate("/helper/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Incoming Job" showBack backTo="/helper/dashboard" variant="white" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
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
              <h2 className="text-lg font-black text-foreground">Electrical Repair</h2>
              <p className="text-sm text-muted-foreground">Residential • Wiring issue</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Distance</p>
                <p className="text-sm font-bold text-foreground">1.8 km</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl bg-muted">
              <Clock className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase">Est. Earning</p>
                <p className="text-sm font-bold text-foreground">₹400-600</p>
              </div>
            </div>
          </div>

          {/* Map preview */}
          <MapPlaceholder className="h-[180px]" showHelper helperLabel="You" userLabel="Client" />

          <div className="p-3 rounded-xl bg-muted">
            <p className="text-[10px] text-muted-foreground font-medium uppercase mb-1">Client Location</p>
            <p className="text-sm font-semibold text-foreground">123 MG Road, Sector 45, Gurugram</p>
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
          >
            <Check className="h-5 w-5 mr-2" /> Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelperJobRequest;
