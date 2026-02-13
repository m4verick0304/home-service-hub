import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tables } from "@/integrations/supabase/types";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft, Calendar, Clock, MapPin, Loader2, Search,
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer
} from "lucide-react";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6" />,
  Wrench: <Wrench className="h-6 w-6" />,
  Zap: <Zap className="h-6 w-6" />,
  ChefHat: <ChefHat className="h-6 w-6" />,
  Paintbrush: <Paintbrush className="h-6 w-6" />,
  Hammer: <Hammer className="h-6 w-6" />,
};

const providerNames = ["Rajesh Kumar", "Priya Sharma", "Amit Patel", "Sunita Devi", "Vikram Singh"];

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [service, setService] = useState<Service | null>(null);
  const [address, setAddress] = useState(profile?.address || "");
  const [scheduling, setScheduling] = useState<"now" | "later">("now");
  const [scheduledDate, setScheduledDate] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (serviceId) {
      supabase.from("services").select("*").eq("id", serviceId).maybeSingle().then(({ data }) => {
        setService(data);
      });
    }
  }, [serviceId]);

  useEffect(() => {
    if (profile?.address) setAddress(profile.address);
  }, [profile]);

  const handleBook = async () => {
    if (!profile || !service) return;
    if (!address.trim()) {
      toast({ title: "Address required", description: "Please enter your address.", variant: "destructive" });
      return;
    }

    setSearching(true);

    // Simulate searching for provider
    await new Promise((r) => setTimeout(r, 2500));

    const providerName = providerNames[Math.floor(Math.random() * providerNames.length)];
    const eta = Math.floor(Math.random() * 30) + 15;

    const { data, error } = await supabase.from("bookings").insert({
      user_id: profile.id,
      service_id: service.id,
      address,
      provider_name: providerName,
      provider_phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      status: "confirmed",
      eta_minutes: eta,
      scheduled_at: scheduling === "later" && scheduledDate ? new Date(scheduledDate).toISOString() : new Date().toISOString(),
    }).select().single();

    setSearching(false);

    if (error) {
      toast({ title: "Booking failed", description: error.message, variant: "destructive" });
    } else if (data) {
      navigate(`/confirmation/${data.id}`);
    }
  };

  if (!service) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (searching) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 bg-background">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-primary/20 animate-ping absolute inset-0" />
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center relative">
            <Search className="h-10 w-10 text-primary animate-pulse" />
          </div>
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Searching for providers...</h2>
          <p className="text-muted-foreground mt-2">Finding the best {service.name.toLowerCase()} near you</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Book {service.name}</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Service Info */}
        <Card className="border-0 shadow-sm">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              {iconMap[service.icon || ""] || <Sparkles className="h-6 w-6" />}
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">{service.name}</h2>
              <p className="text-sm text-muted-foreground">{service.description}</p>
              <p className="text-sm font-semibold text-primary mt-1">{service.price_range}</p>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Service Address
          </Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your full address"
            className="h-12"
          />
        </div>

        {/* Scheduling */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> When do you need it?
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={scheduling === "now" ? "default" : "outline"}
              className="h-12 rounded-xl"
              onClick={() => setScheduling("now")}
            >
              ⚡ Right Now
            </Button>
            <Button
              variant={scheduling === "later" ? "default" : "outline"}
              className="h-12 rounded-xl"
              onClick={() => setScheduling("later")}
            >
              <Calendar className="mr-2 h-4 w-4" /> Schedule
            </Button>
          </div>
          {scheduling === "later" && (
            <Input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="h-12"
              min={new Date().toISOString().slice(0, 16)}
            />
          )}
        </div>

        {/* Book Button */}
        <Button
          className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg"
          onClick={handleBook}
        >
          Book Now
        </Button>
      </main>
    </div>
  );
};

export default BookService;
