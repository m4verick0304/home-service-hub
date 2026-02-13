import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl text-sm font-medium"
            onClick={async () => {
              const { error } = await lovable.auth.signInWithOAuth("google", {
                redirect_uri: window.location.origin,
              });
              if (error) toast({ title: "Google sign in failed", description: String(error), variant: "destructive" });
            }}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Continue with Google
          </Button>

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
