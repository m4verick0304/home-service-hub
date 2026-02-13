import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Zap, Shield, Star, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: { name } },
      });
      if (error) toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      else toast({ title: "Check your email", description: "We sent you a verification link." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      else navigate("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left - Branding */}
      <div className="relative lg:w-1/2 h-[260px] lg:h-auto overflow-hidden sh-gradient-blue">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        </div>
        <div className="relative flex flex-col justify-between h-full p-8 lg:p-12">
          <div className="flex items-center gap-2.5">
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white text-xs font-black">SH</div>
              <span className="text-white text-lg font-bold">SmartHelper</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Smart Helper<br />Auto-Assignment
            </h1>
            <p className="mt-3 text-white/70 text-sm lg:text-base max-w-md">
              AI-powered system that matches you with the nearest, best-rated service professional.
            </p>

            <div className="hidden lg:flex items-center gap-8 mt-10">
              {[
                { icon: <Zap className="h-4 w-4" />, text: "15 min response" },
                { icon: <Shield className="h-4 w-4" />, text: "Verified helpers" },
                { icon: <Star className="h-4 w-4" />, text: "4.8+ rated" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-white/60 text-xs font-medium">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 bg-background">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUp ? "Sign up to book home services" : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {isSignUp && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                  <Label htmlFor="name" className="text-xs font-semibold text-foreground">Full Name</Label>
                  <Input id="name" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required className="h-12 rounded-xl" />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-foreground">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-foreground">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl" />
            </div>
            <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl sh-gradient-blue border-0 text-white" disabled={loading}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-primary hover:underline underline-offset-4">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <div className="mt-8 pt-6 border-t text-center">
            <Button variant="outline" className="rounded-xl text-sm font-medium" onClick={() => navigate("/helper/login")}>
              Sign in as Helper →
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
