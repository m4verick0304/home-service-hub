import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { AppHeader } from "@/components/shared/AppHeader";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowRight,
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera
} from "lucide-react";

const iconMap: Record<string, any> = {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  Snowflake, Bug, Scissors, Settings, SprayCan, Droplets,
  User, GlassWater, Truck, Camera,
};

const colorMap: Record<string, string> = {
  Sparkles: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
  Wrench: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Zap: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  ChefHat: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]",
  Paintbrush: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  Hammer: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  Snowflake: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Bug: "bg-[hsl(var(--sh-red-light))] text-[hsl(var(--sh-red))]",
  Scissors: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  Settings: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  SprayCan: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
  Droplets: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  User: "bg-[hsl(var(--sh-purple-light))] text-[hsl(var(--sh-purple))]",
  GlassWater: "bg-[hsl(var(--sh-blue-light))] text-[hsl(var(--sh-blue))]",
  Truck: "bg-[hsl(var(--sh-orange-light))] text-[hsl(var(--sh-orange))]",
  Camera: "bg-[hsl(var(--sh-green-light))] text-[hsl(var(--sh-green))]",
};

function parsePriceRange(priceRange: string | null): number {
  if (!priceRange) return 0;
  const match = priceRange.match(/(\d[\d,]*)/);
  if (match) return parseInt(match[1].replace(/,/g, ""), 10);
  return 0;
}

const Cart = () => {
  const navigate = useNavigate();
  const { items, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader title="My Cart" showBack variant="primary" />
        <div className="flex flex-col items-center justify-center px-6 py-24">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="h-24 w-24 rounded-3xl bg-muted flex items-center justify-center mb-6"
          >
            <ShoppingCart className="h-10 w-10 text-muted-foreground" />
          </motion.div>
          <h2 className="text-xl font-black text-foreground mb-2">Cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-8 text-center max-w-xs">
            Book a service to get started! Browse our services and add them to your cart.
          </p>
          <Button
            className="rounded-2xl sh-gradient-blue border-0 text-white font-bold px-8 h-12"
            onClick={() => navigate("/dashboard")}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Browse Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="My Cart" showBack variant="primary" />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 py-6 space-y-4">
        {/* Items */}
        <AnimatePresence>
          {items.map((item) => {
            const IconComp = iconMap[item.service.icon || ""] || Sparkles;
            const price = parsePriceRange(item.service.price_range);
            return (
              <motion.div
                key={item.service.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-card border sh-shadow"
              >
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${colorMap[item.service.icon || ""] || "bg-muted text-foreground"}`}>
                  <IconComp className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">{item.service.name}</p>
                  <p className="text-xs text-muted-foreground">{item.service.price_range || "Price on request"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.service.id, item.quantity - 1)}
                    className="h-8 w-8 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                  <span className="text-sm font-bold text-foreground w-6 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.service.id, item.quantity + 1)}
                    className="h-8 w-8 rounded-xl border flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5 text-foreground" />
                  </button>
                </div>
                <div className="text-right min-w-[60px]">
                  <p className="text-sm font-bold text-foreground">₹{price * item.quantity}</p>
                </div>
                <button
                  onClick={() => removeFromCart(item.service.id)}
                  className="h-8 w-8 rounded-xl flex items-center justify-center text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Summary */}
        <div className="p-5 rounded-2xl bg-card border sh-shadow space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-bold text-foreground">₹{totalAmount}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Service Fee</span>
            <span className="font-bold text-foreground">₹49</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="font-bold text-foreground">Total</span>
            <span className="text-lg font-black text-primary">₹{totalAmount + 49}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-2xl font-bold"
            onClick={clearCart}
          >
            Clear Cart
          </Button>
          <Button
            className="flex-1 h-12 rounded-2xl sh-gradient-blue border-0 text-white font-bold"
            onClick={() => navigate("/checkout")}
          >
            Checkout <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Cart;
