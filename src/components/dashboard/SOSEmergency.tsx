import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, Droplets, Flame, Zap, Wind, Bug } from "lucide-react";

const emergencies = [
  { id: "pipe-burst", label: "Pipe Burst", icon: Droplets, color: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]", desc: "Water flooding" },
  { id: "roof-leak", label: "Roof Leakage", icon: Wind, color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]", desc: "Ceiling dripping" },
  { id: "gas-leak", label: "Gas Leak", icon: Flame, color: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]", desc: "Smell of gas" },
  { id: "power-outage", label: "Power Outage", icon: Zap, color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]", desc: "No electricity" },
  { id: "pest-invasion", label: "Pest Invasion", icon: Bug, color: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]", desc: "Urgent pest control" },
];

export const SOSEmergency = () => {
  const navigate = useNavigate();

  const handleSOS = (emergencyId: string) => {
    // Navigate to dashboard with search pre-filled based on emergency type
    const searchMap: Record<string, string> = {
      "pipe-burst": "Plumbing",
      "roof-leak": "Plumbing",
      "gas-leak": "Plumbing",
      "power-outage": "Electrician",
      "pest-invasion": "Pest Control",
    };
    const serviceQuery = searchMap[emergencyId] || "";
    // For now, scroll to services section on dashboard
    navigate(`/dashboard?sos=${serviceQuery}`);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 mb-8">
      <div className="p-5 rounded-2xl border-2 border-destructive/20 bg-destructive/5">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 w-8 rounded-xl bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-4.5 w-4.5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-wide">🚨 SOS Emergency</h3>
            <p className="text-xs text-muted-foreground">Instant help for urgent issues</p>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {emergencies.map((e, i) => (
            <motion.button
              key={e.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => handleSOS(e.id)}
              className="flex flex-col items-center gap-2 min-w-[90px] p-3 rounded-2xl border border-border bg-card hover:border-destructive/40 hover:bg-destructive/5 transition-all group"
            >
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${e.color} group-hover:scale-110 transition-transform`}>
                <e.icon className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold text-foreground leading-tight">{e.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{e.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};
