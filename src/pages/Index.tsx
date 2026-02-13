import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Zap, Shield, Clock, Star, MapPin, ArrowRight,
  Wrench, Sparkles, ChefHat, Paintbrush, Hammer,
  Users, CheckCircle2, Headphones
} from "lucide-react";

const services = [
  { icon: Wrench, name: "Plumber", color: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]" },
  { icon: Zap, name: "Electrician", color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]" },
  { icon: Sparkles, name: "Cleaner", color: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]" },
  { icon: Paintbrush, name: "Painter", color: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]" },
  { icon: Hammer, name: "Carpenter", color: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]" },
  { icon: ChefHat, name: "Cook", color: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]" },
];

const stats = [
  { value: "10K+", label: "Bookings Completed" },
  { value: "2K+", label: "Verified Helpers" },
  { value: "4.8", label: "Average Rating" },
  { value: "15min", label: "Avg Response Time" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-50 sh-glass border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-16">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl sh-gradient-blue text-white text-xs font-black sh-shadow">
              SH
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">SmartHelper</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-sm font-medium" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
            <Button className="rounded-xl text-sm font-bold sh-gradient-blue border-0 text-white sh-shadow" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--sh-blue-light))] via-background to-[hsl(var(--sh-purple-light))] opacity-50" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
          <div className="max-w-2xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
                <Zap className="h-3.5 w-3.5" />
                Smart Auto-Assignment System
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-foreground leading-[1.1] tracking-tight">
                Get help in<span className="text-primary"> 15 minutes</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-lg">
                Our AI-powered system automatically finds and assigns the nearest, best-rated service professional to your doorstep.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold sh-gradient-blue border-0 text-white sh-shadow-md hover:opacity-90 transition-opacity" onClick={() => navigate("/auth")}>
                  Book Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-base font-semibold" onClick={() => navigate("/helper/login")}>
                  <Users className="mr-2 h-5 w-5" /> Join as Helper
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Floating card */}
          <motion.div initial={{ opacity: 0, x: 40, y: 20 }} animate={{ opacity: 1, x: 0, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:block absolute top-20 right-8 w-80">
            <div className="bg-card border rounded-3xl p-6 sh-shadow-lg sh-float">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-2xl bg-[hsl(var(--sh-green-light))] flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-[hsl(var(--sh-green))]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Helper Assigned!</p>
                  <p className="text-xs text-muted-foreground">Rajesh K. • 4.9 ★ • 2.3 km</p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div className="h-full rounded-full bg-[hsl(var(--sh-green))]" initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 2, delay: 1 }} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">Arriving in ~12 min</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">What do you need?</h2>
            <p className="text-muted-foreground mt-3 text-base">Choose a service and we'll match you with the best professional nearby</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {services.map((svc, i) => (
              <motion.button key={svc.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} whileHover={{ y: -4 }} whileTap={{ scale: 0.97 }} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border sh-shadow hover:sh-shadow-md transition-shadow group cursor-pointer" onClick={() => navigate("/auth")}>
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${svc.color} group-hover:scale-110 transition-transform`}>
                  <svc.icon className="h-7 w-7" />
                </div>
                <span className="text-sm font-semibold text-foreground">{svc.name}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">How it works</h2>
            <p className="text-muted-foreground mt-3">Get professional help in 3 simple steps</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", icon: MapPin, title: "Select & Locate", desc: "Choose your service and share your location. We'll find helpers near you." },
              { step: "02", icon: Zap, title: "Auto-Assign", desc: "Our smart system instantly finds the best available helper based on proximity and ratings." },
              { step: "03", icon: CheckCircle2, title: "Track & Complete", desc: "Track your helper in real-time. Rate them after service completion." },
            ].map((item, i) => (
              <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative p-8 rounded-3xl bg-card border sh-shadow group hover:sh-shadow-md transition-shadow">
                <span className="text-6xl font-black text-muted/80 absolute top-4 right-6">{item.step}</span>
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-6 rounded-2xl bg-card border sh-shadow">
                <p className="text-3xl md:text-4xl font-black text-primary">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Verified Professionals", desc: "Every helper is background-checked and skill-verified before onboarding." },
              { icon: Star, title: "Rated & Reviewed", desc: "Transparent ratings help you trust the helper assigned to you." },
              { icon: Headphones, title: "24/7 Support", desc: "Our support team is always available for any issues during service." },
            ].map((item, i) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="sh-gradient-blue rounded-3xl p-10 md:p-16 text-center text-white sh-shadow-lg">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Ready to get started?</h2>
            <p className="mt-3 text-white/70 text-base max-w-md mx-auto">Join thousands of happy customers who get reliable help at their doorstep.</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="h-14 px-8 rounded-2xl text-base font-bold bg-white text-primary hover:bg-white/90" onClick={() => navigate("/auth")}>
                Book a Service
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-2xl text-base font-bold border-white/30 text-white hover:bg-white/10" onClick={() => navigate("/helper/login")}>
                Become a Helper
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg sh-gradient-blue text-white text-[10px] font-black">SH</div>
            <span className="text-sm font-bold text-foreground">SmartHelper</span>
          </div>
          <p className="text-xs text-muted-foreground">© 2026 SmartHelper Auto-Assignment System. Built for SIH.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
