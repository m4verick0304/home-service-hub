import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Wrench, Zap, Shield, IndianRupee } from "lucide-react";
import DarkVeil from "@/components/DarkVeil";
import CountryCodeSelect from "@/components/CountryCodeSelect";

const HelperLogin = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("phone");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const fullPhone = `${countryCode}${phone.replace(/^0+/, "")}`;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin, data: { name, phone: fullPhone, role: "helper" } },
      });
      if (error) toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      else toast({ title: "Check your email", description: "We sent you a verification link." });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      else navigate("/helper/dashboard");
    }
    setLoading(false);
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!otpSent) {
        const res = await fetch(`${supabaseUrl}/functions/v1/twilio-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "send", phone: fullPhone }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send OTP");
        setOtpSent(true);
        toast({ title: "OTP sent!", description: "Check your phone for the verification code." });
      } else {
        const res = await fetch(`${supabaseUrl}/functions/v1/twilio-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "verify", phone: fullPhone, code: otp }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Verification failed");
        if (data.session?.access_token && data.session?.refresh_token) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
          });
          navigate("/helper/dashboard");
        } else {
          throw new Error("No session returned");
        }
      }
    } catch (err: any) {
      toast({ title: otpSent ? "Verification failed" : "Failed to send OTP", description: err.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative">
      {/* Full-screen DarkVeil background with green hue shift */}
      <div className="absolute inset-0 z-0">
        <DarkVeil speed={0.25} hueShift={120} warpAmount={0.3} resolutionScale={0.75} />
      </div>

      {/* Left - Helper Branding */}
      <div className="relative lg:w-1/2 h-[280px] lg:h-auto overflow-hidden z-10">
        <div className="relative flex flex-col justify-between h-full p-8 lg:p-12">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 text-white text-[10px] font-bold tracking-tight">HS</div>
              <span className="text-white text-base font-semibold tracking-tight">homeserv</span>
            </button>
            <span className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--sh-green))]/20 border border-[hsl(var(--sh-green))]/30 px-2.5 py-0.5 text-[10px] font-bold text-[hsl(var(--sh-green))]">
              <Wrench className="h-3 w-3" /> HELPER
            </span>
          </div>

          <div>
            <h1 className="text-2xl lg:text-4xl font-black text-white leading-tight tracking-tight">
              Earn on your<br />own schedule
            </h1>
            <p className="mt-3 text-white/70 text-sm lg:text-base max-w-md">
              Join thousands of skilled professionals earning with homeserv. Accept jobs, build your reputation, grow your income.
            </p>

            <div className="hidden lg:flex items-center gap-8 mt-10">
              {[
                { icon: <IndianRupee className="h-4 w-4" />, text: "₹25k+ avg/month" },
                { icon: <Zap className="h-4 w-4" />, text: "Instant payouts" },
                { icon: <Shield className="h-4 w-4" />, text: "Insurance covered" },
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
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:py-0 z-10">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-sm bg-background/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-border/50">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-foreground tracking-tight">
              {isSignUp ? "Become a Helper" : "Helper Sign In"}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isSignUp ? "Create your helper account to start earning" : "Access your helper dashboard"}
            </p>
          </div>

          {/* Auth Method Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-6">
            <button
              type="button"
              onClick={() => { setAuthMethod("phone"); setOtpSent(false); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${authMethod === "phone" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Phone
            </button>
            <button
              type="button"
              onClick={() => { setAuthMethod("email"); setOtpSent(false); }}
              className={`flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all ${authMethod === "email" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Email
            </button>
          </div>

          {authMethod === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isSignUp && (
                  <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                    <Label htmlFor="helper-name" className="text-xs font-semibold text-foreground">Full Name</Label>
                    <Input id="helper-name" placeholder="Rajesh Kumar" value={name} onChange={e => setName(e.target.value)} required className="h-12 rounded-xl" />
                  </motion.div>
                )}
                {isSignUp && (
                  <motion.div key="phone-field" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                    <Label htmlFor="helper-phone-email" className="text-xs font-semibold text-foreground">Phone Number</Label>
                    <div className="flex">
                      <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                      <Input id="helper-phone-email" type="tel" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} className="h-12 rounded-l-none rounded-r-xl flex-1" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="space-y-1.5">
                <Label htmlFor="helper-email" className="text-xs font-semibold text-foreground">Email</Label>
                <Input id="helper-email" type="email" placeholder="helper@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-12 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="helper-password" className="text-xs font-semibold text-foreground">Password</Label>
                <Input id="helper-password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} className="h-12 rounded-xl" />
              </div>
              <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl border-0 text-white bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {isSignUp ? "Create Helper Account" : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="helper-phone-auth" className="text-xs font-semibold text-foreground">Phone Number</Label>
                <div className="flex">
                  <CountryCodeSelect value={countryCode} onChange={setCountryCode} />
                  <Input id="helper-phone-auth" type="tel" placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} required className="h-12 rounded-l-none rounded-r-xl flex-1" />
                </div>
              </div>
              <AnimatePresence mode="popLayout">
                {otpSent && (
                  <motion.div key="otp" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-1.5 overflow-hidden">
                    <Label htmlFor="helper-otp" className="text-xs font-semibold text-foreground">Verification Code</Label>
                    <Input id="helper-otp" type="text" inputMode="numeric" placeholder="123456" value={otp} onChange={e => setOtp(e.target.value)} required maxLength={6} className="h-12 rounded-xl tracking-[0.3em] text-center font-mono" />
                  </motion.div>
                )}
              </AnimatePresence>
              <Button type="submit" className="w-full h-12 text-sm font-bold rounded-xl border-0 text-white bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90" disabled={loading}>
                {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {otpSent ? "Verify & Sign In" : "Send OTP"}
              </Button>
            </form>
          )}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background/80 px-2 text-muted-foreground">Or continue with</span></div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-medium"
              onClick={async () => {
                localStorage.setItem("auth_redirect", "/helper/dashboard");
                const { error } = await lovable.auth.signInWithOAuth("google", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast({ title: "Google sign in failed", description: String(error), variant: "destructive" });
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Continue with Google
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full h-12 rounded-xl text-sm font-medium"
              onClick={async () => {
                localStorage.setItem("auth_redirect", "/helper/dashboard");
                const { error } = await lovable.auth.signInWithOAuth("apple", {
                  redirect_uri: window.location.origin,
                });
                if (error) toast({ title: "Apple sign in failed", description: String(error), variant: "destructive" });
              }}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
              Continue with Apple
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Already a helper?" : "New to homeserv?"}{" "}
            <button onClick={() => setIsSignUp(!isSignUp)} className="font-bold text-[hsl(var(--sh-green))] hover:underline underline-offset-4">
              {isSignUp ? "Sign In" : "Become a Helper"}
            </button>
          </p>

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
