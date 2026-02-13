import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Loader2, Wrench, ArrowLeft } from "lucide-react";

const HelperLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Demo: simulate login
    setTimeout(() => {
      setLoading(false);
      navigate("/helper/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left */}
      <div className="relative lg:w-1/2 h-[240px] lg:h-auto overflow-hidden sh-gradient-dark">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-10 h-64 w-64 rounded-full bg-[hsl(var(--sh-green))]/20 blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between h-full p-8 lg:p-12">
          <button onClick={() => navigate("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity w-fit">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white text-xs font-black">SH</div>
            <span className="text-white text-lg font-bold">SmartHelper</span>
          </button>
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[hsl(var(--sh-green))]/20 px-3 py-1 text-xs font-semibold text-[hsl(var(--sh-green))] mb-4">
              <Wrench className="h-3.5 w-3.5" /> Helper Portal
            </div>
            <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Start earning<br />as a Helper
            </h1>
            <p className="mt-3 text-white/60 text-sm max-w-md">
              Accept jobs, manage your availability, and grow your reputation.
            </p>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <h2 className="text-2xl font-black text-foreground tracking-tight mb-1">Helper Sign In</h2>
          <p className="text-muted-foreground text-sm mb-8">Access your helper dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Email</Label>
              <Input type="email" placeholder="helper@example.com" value={email} onChange={e => setEmail(e.target.value)} className="h-12 rounded-xl" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="h-12 rounded-xl" required minLength={6} />
            </div>
            <Button type="submit" className="w-full h-12 font-bold rounded-xl sh-gradient-dark border-0 text-white" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Sign In
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center">
            <Button variant="outline" className="rounded-xl text-sm font-medium" onClick={() => navigate("/auth")}>
              ← Sign in as Client
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HelperLogin;
