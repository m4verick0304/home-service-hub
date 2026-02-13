import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  CreditCard, Banknote, Smartphone, Building2,
  Check, MapPin, LocateFixed, Loader2, Shield
} from "lucide-react";

type PaymentMethod = "cod" | "upi" | "card" | "netbanking";

const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: any }[] = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when service is done", icon: Banknote },
  { id: "upi", label: "UPI Payment", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks supported", icon: Building2 },
];

const providerNames = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh"];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [address, setAddress] = useState(profile?.address || "");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  const grandTotal = totalAmount + 49;

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
          );
          const data = await res.json();
          if (data.display_name) setAddress(data.display_name);
        } catch {
          setAddress(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        }
        setDetectingLocation(false);
      },
      () => setDetectingLocation(false),
      { timeout: 8000 }
    );
  };

  const handlePlaceOrder = async () => {
    if (!profile) return;
    if (!address.trim()) {
      toast({ title: "Address required", description: "Please enter your service address.", variant: "destructive" });
      return;
    }
    if (paymentMethod === "upi" && !upiId.trim()) {
      toast({ title: "UPI ID required", description: "Please enter your UPI ID.", variant: "destructive" });
      return;
    }

    setProcessing(true);

    // Create bookings for each cart item
    let lastBookingId = "";
    for (const item of items) {
      const providerName = providerNames[Math.floor(Math.random() * providerNames.length)];
      const eta = Math.floor(Math.random() * 30) + 15;

      const { data, error } = await supabase.from("bookings").insert({
        user_id: profile.id,
        service_id: item.service.id,
        address,
        provider_name: providerName,
        provider_phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        status: "confirmed",
        eta_minutes: eta,
        scheduled_at: new Date().toISOString(),
      }).select().single();

      if (error) {
        toast({ title: "Booking failed", description: error.message, variant: "destructive" });
        setProcessing(false);
        return;
      }
      if (data) lastBookingId = data.id;
    }

    clearCart();
    setProcessing(false);
    toast({ title: "Order placed!", description: `Payment via ${paymentOptions.find(p => p.id === paymentMethod)?.label}` });
    navigate(lastBookingId ? `/confirmation/${lastBookingId}` : "/history");
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Checkout" showBack variant="primary" />

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-6">
        {/* Order Summary */}
        <div className="p-5 rounded-2xl bg-card border sh-shadow">
          <h3 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wide">Order Summary</h3>
          <div className="space-y-2.5">
            {items.map((item) => (
              <div key={item.service.id} className="flex items-center justify-between text-sm">
                <span className="text-foreground">
                  {item.service.name} <span className="text-muted-foreground">× {item.quantity}</span>
                </span>
                <span className="font-bold text-foreground">
                  {item.service.price_range || "—"}
                </span>
              </div>
            ))}
            <div className="border-t pt-2.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="font-bold text-foreground">₹49</span>
            </div>
            <div className="border-t pt-2.5 flex items-center justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-black text-primary">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Service Address
          </Label>
          <div className="flex gap-2">
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full address"
              className="h-12 rounded-xl flex-1"
            />
            <Button
              variant="outline"
              className="h-12 px-4 rounded-xl shrink-0"
              onClick={detectLocation}
              disabled={detectingLocation}
            >
              {detectingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
            <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Method
          </Label>
          <div className="grid grid-cols-1 gap-2.5">
            {paymentOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setPaymentMethod(opt.id)}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === opt.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  paymentMethod === opt.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  <opt.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                {paymentMethod === opt.id && (
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* UPI ID input */}
          {paymentMethod === "upi" && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="Enter UPI ID (e.g. name@paytm)"
                className="h-12 rounded-xl mt-2"
              />
            </motion.div>
          )}
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sh-green-light))] border border-[hsl(var(--sh-green))]/20">
          <Shield className="h-5 w-5 text-[hsl(var(--sh-green))] flex-shrink-0" />
          <p className="text-xs text-[hsl(var(--sh-green))] font-medium">100% secure payments. Your data is encrypted and safe.</p>
        </div>

        {/* Place Order */}
        <Button
          className="w-full h-14 text-base font-bold rounded-2xl sh-gradient-blue border-0 text-white sh-shadow-md hover:opacity-90 transition-opacity"
          onClick={handlePlaceOrder}
          disabled={processing}
        >
          {processing ? (
            <><Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing...</>
          ) : (
            <>Pay ₹{grandTotal} — Place Order</>
          )}
        </Button>
      </motion.main>
    </div>
  );
};

export default Checkout;
