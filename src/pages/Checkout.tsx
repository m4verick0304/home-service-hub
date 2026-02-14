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
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard, Banknote, Smartphone, Building2,
  Check, MapPin, LocateFixed, Loader2, Shield,
  BadgePercent, Lock, ChevronDown
} from "lucide-react";

type PaymentMethod = "cod" | "upi" | "card" | "netbanking";
type CardStep = "details" | "otp" | "processing" | "success";

const paymentOptions: { id: PaymentMethod; label: string; desc: string; icon: any }[] = [
  { id: "cod", label: "Cash on Delivery", desc: "Pay when service is done", icon: Banknote },
  { id: "upi", label: "UPI Payment", desc: "GPay, PhonePe, Paytm", icon: Smartphone },
  { id: "card", label: "Credit / Debit Card", desc: "Visa, Mastercard, RuPay", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", desc: "All major banks supported", icon: Building2 },
];

const bankList = ["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank", "Kotak Mahindra", "Punjab National Bank", "Bank of Baroda", "Yes Bank"];

const appliedOffers = [
  { bank: "HDFC", discount: "10% Cashback up to ₹200", code: "Auto-applied" },
  { bank: "Paytm UPI", discount: "₹75 Cashback", code: "Auto-applied on UPI" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const { profile } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [address, setAddress] = useState(profile?.address || "");
  const [upiId, setUpiId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);

  // Card payment states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardStep, setCardStep] = useState<CardStep>("details");
  const [otp, setOtp] = useState("");

  // Net banking
  const [selectedBank, setSelectedBank] = useState("");
  const [showAllBanks, setShowAllBanks] = useState(false);

  // Coupon
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);

  const serviceFee = 49;
  const grandTotal = totalAmount + serviceFee - couponDiscount;

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

  const applyCoupon = () => {
    const validCoupons: Record<string, number> = {
      CLEAN40: Math.round(totalAmount * 0.4),
      COOL199: 199,
      PIPE25: Math.round(totalAmount * 0.25),
      FIRST50: Math.round(totalAmount * 0.5),
    };
    const code = coupon.trim().toUpperCase();
    if (validCoupons[code]) {
      setCouponDiscount(Math.min(validCoupons[code], totalAmount));
      setCouponApplied(true);
      toast({ title: "Coupon applied!", description: `You saved ₹${Math.min(validCoupons[code], totalAmount)}` });
    } else {
      toast({ title: "Invalid coupon", description: "Please enter a valid coupon code.", variant: "destructive" });
    }
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const simulateCardPayment = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      toast({ title: "Fill all card details", variant: "destructive" });
      return;
    }
    setCardStep("otp");
  };

  const verifyOtp = async () => {
    if (otp.length < 4) {
      toast({ title: "Enter valid OTP", variant: "destructive" });
      return;
    }
    setCardStep("processing");
    await new Promise((r) => setTimeout(r, 2500));
    setCardStep("success");
    await new Promise((r) => setTimeout(r, 1000));
    await placeOrder();
  };

  const handleUpiPayment = async () => {
    if (!upiId.includes("@")) {
      toast({ title: "Invalid UPI ID", description: "UPI ID should be in format name@bank", variant: "destructive" });
      return;
    }
    setProcessing(true);
    // Simulate UPI verification
    await new Promise((r) => setTimeout(r, 2000));
    toast({ title: "UPI Payment Initiated", description: "Check your UPI app to approve payment" });
    await new Promise((r) => setTimeout(r, 3000));
    await placeOrder();
  };

  const handleNetBanking = async () => {
    if (!selectedBank) {
      toast({ title: "Select a bank", variant: "destructive" });
      return;
    }
    setProcessing(true);
    toast({ title: "Redirecting to bank...", description: `Connecting to ${selectedBank}` });
    await new Promise((r) => setTimeout(r, 3000));
    await placeOrder();
  };

  const placeOrder = async () => {
    if (!profile) return;
    setProcessing(true);

    let lastBookingId = "";
    for (const item of items) {
      const { data, error } = await supabase.from("bookings").insert({
        user_id: profile.id,
        service_id: item.service.id,
        address,
        status: "pending",
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
    toast({ title: "✅ Order placed!", description: `Payment via ${paymentOptions.find(p => p.id === paymentMethod)?.label}` });
    navigate(lastBookingId ? `/confirmation/${lastBookingId}` : "/history");
  };

  const handlePlaceOrder = async () => {
    if (!address.trim()) {
      toast({ title: "Address required", description: "Please enter your service address.", variant: "destructive" });
      return;
    }
    switch (paymentMethod) {
      case "cod": await placeOrder(); break;
      case "upi": await handleUpiPayment(); break;
      case "card": await simulateCardPayment(); break;
      case "netbanking": await handleNetBanking(); break;
    }
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
                <span className="font-bold text-foreground">{item.service.price_range || "—"}</span>
              </div>
            ))}
            <div className="border-t pt-2.5 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Service Fee</span>
              <span className="font-bold text-foreground">₹{serviceFee}</span>
            </div>
            {couponApplied && (
              <div className="flex items-center justify-between text-sm text-[hsl(var(--sh-green))]">
                <span className="font-medium">Coupon Discount</span>
                <span className="font-bold">-₹{couponDiscount}</span>
              </div>
            )}
            <div className="border-t pt-2.5 flex items-center justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-black text-primary">₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Coupon Code */}
        <div className="p-4 rounded-2xl bg-card border sh-shadow">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide mb-2">
            <BadgePercent className="h-3.5 w-3.5 text-primary" /> Apply Coupon
          </Label>
          <div className="flex gap-2">
            <Input
              value={coupon}
              onChange={(e) => setCoupon(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              className="h-11 rounded-xl flex-1 uppercase"
              disabled={couponApplied}
            />
            <Button
              variant={couponApplied ? "secondary" : "default"}
              className="h-11 rounded-xl px-5 text-xs font-bold"
              onClick={applyCoupon}
              disabled={couponApplied || !coupon.trim()}
            >
              {couponApplied ? <><Check className="h-3.5 w-3.5 mr-1" /> Applied</> : "Apply"}
            </Button>
          </div>
          {couponApplied && (
            <p className="text-xs text-[hsl(var(--sh-green))] font-medium mt-2">🎉 You saved ₹{couponDiscount}!</p>
          )}
        </div>

        {/* Bank Offers */}
        <div className="p-4 rounded-2xl bg-card border sh-shadow">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide mb-3">
            <Building2 className="h-3.5 w-3.5 text-primary" /> Available Bank Offers
          </Label>
          <div className="space-y-2">
            {appliedOffers.map((o, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sh-green-light))] border border-[hsl(var(--sh-green))]/20">
                <BadgePercent className="h-4 w-4 text-[hsl(var(--sh-green))] flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-foreground">{o.discount}</p>
                  <p className="text-[10px] text-muted-foreground">{o.bank} • {o.code}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-xs font-bold text-foreground uppercase tracking-wide">
            <MapPin className="h-3.5 w-3.5 text-primary" /> Service Address
          </Label>
          <div className="flex gap-2">
            <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your full address" className="h-12 rounded-xl flex-1" />
            <Button variant="outline" className="h-12 px-4 rounded-xl shrink-0" onClick={detectLocation} disabled={detectingLocation}>
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
                onClick={() => { setPaymentMethod(opt.id); setCardStep("details"); }}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                  paymentMethod === opt.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
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

          {/* UPI Input */}
          <AnimatePresence>
            {paymentMethod === "upi" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <Input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID (e.g. name@paytm)" className="h-12 rounded-xl mt-2" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Input */}
          <AnimatePresence>
            {paymentMethod === "card" && cardStep === "details" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-3 mt-2">
                <div className="p-4 rounded-2xl border bg-card space-y-3">
                  <Input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="1234 5678 9012 3456"
                    className="h-12 rounded-xl text-base tracking-wider"
                    maxLength={19}
                  />
                  <Input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Name on card"
                    className="h-11 rounded-xl"
                  />
                  <div className="flex gap-3">
                    <Input
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      placeholder="MM/YY"
                      className="h-11 rounded-xl flex-1"
                      maxLength={5}
                    />
                    <Input
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      placeholder="CVV"
                      type="password"
                      className="h-11 rounded-xl flex-1"
                      maxLength={3}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <Lock className="h-3 w-3" /> Your card info is encrypted and secure
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card OTP */}
          <AnimatePresence>
            {paymentMethod === "card" && cardStep === "otp" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 rounded-2xl border-2 border-primary bg-primary/5 space-y-3 mt-2">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-sm font-bold text-foreground">3D Secure Verification</p>
                  <p className="text-xs text-muted-foreground mt-1">Enter the OTP sent to your registered mobile</p>
                </div>
                <Input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="h-14 rounded-xl text-center text-xl tracking-[0.5em] font-bold"
                  maxLength={6}
                />
                <Button className="w-full h-12 rounded-xl sh-gradient-blue border-0 text-white font-bold" onClick={verifyOtp}>
                  Verify & Pay ₹{grandTotal}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Processing */}
          <AnimatePresence>
            {paymentMethod === "card" && cardStep === "processing" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 rounded-2xl border bg-card text-center space-y-4 mt-2">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-sm font-bold text-foreground">Processing Payment...</p>
                <p className="text-xs text-muted-foreground">Do not close this page</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Card Success */}
          <AnimatePresence>
            {paymentMethod === "card" && cardStep === "success" && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-2xl border-2 border-[hsl(var(--sh-green))] bg-[hsl(var(--sh-green-light))] text-center space-y-3 mt-2">
                <div className="h-16 w-16 rounded-full bg-[hsl(var(--sh-green))] flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <p className="text-sm font-bold text-foreground">Payment Successful!</p>
                <p className="text-xs text-muted-foreground">Redirecting to booking confirmation...</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Net Banking */}
          <AnimatePresence>
            {paymentMethod === "netbanking" && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-2">
                <div className="p-4 rounded-2xl border bg-card space-y-3">
                  <p className="text-xs font-bold text-foreground">Select your bank</p>
                  <div className="grid grid-cols-2 gap-2">
                    {(showAllBanks ? bankList : bankList.slice(0, 4)).map((bank) => (
                      <button
                        key={bank}
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                          selectedBank === bank ? "border-primary bg-primary/5 text-primary" : "border-border text-foreground hover:border-primary/30"
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                  {!showAllBanks && (
                    <button onClick={() => setShowAllBanks(true)} className="flex items-center gap-1 text-xs text-primary font-medium">
                      <ChevronDown className="h-3 w-3" /> Show all banks
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Trust badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[hsl(var(--sh-green-light))] border border-[hsl(var(--sh-green))]/20">
          <Shield className="h-5 w-5 text-[hsl(var(--sh-green))] flex-shrink-0" />
          <p className="text-xs text-[hsl(var(--sh-green))] font-medium">100% secure payments. Your data is encrypted and safe.</p>
        </div>

        {/* Place Order */}
        {cardStep !== "otp" && cardStep !== "processing" && cardStep !== "success" && (
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
        )}
      </motion.main>
    </div>
  );
};

export default Checkout;
