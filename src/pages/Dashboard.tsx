import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Tables } from "@/integrations/supabase/types";
import {
  Sparkles, Wrench, Zap, ChefHat, Paintbrush, Hammer,
  MapPin, History, Edit2, Check
} from "lucide-react";

type Service = Tables<"services">;

const iconMap: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-8 w-8" />,
  Wrench: <Wrench className="h-8 w-8" />,
  Zap: <Zap className="h-8 w-8" />,
  ChefHat: <ChefHat className="h-8 w-8" />,
  Paintbrush: <Paintbrush className="h-8 w-8" />,
  Hammer: <Hammer className="h-8 w-8" />,
};

const colorMap: Record<string, string> = {
  cleaning: "bg-blue-50 text-blue-600",
  plumbing: "bg-orange-50 text-orange-600",
  electrical: "bg-yellow-50 text-yellow-600",
  cooking: "bg-red-50 text-red-600",
  painting: "bg-purple-50 text-purple-600",
  carpentry: "bg-green-50 text-green-600",
};

const Dashboard = () => {
  const { profile, refreshProfile } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [location, setLocation] = useState(profile?.address || "Set your location");
  const [editingLocation, setEditingLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.from("services").select("*").then(({ data }) => {
      if (data) setServices(data);
    });
  }, []);

  useEffect(() => {
    if (profile?.address) setLocation(profile.address);
  }, [profile]);

  const saveLocation = async () => {
    if (profile) {
      await supabase.from("profiles").update({ address: location }).eq("id", profile.id);
      await refreshProfile();
    }
    setEditingLocation(false);
  };

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-foreground">HomeServ</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/history")}>
              <History className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/profile")}>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          {editingLocation ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="h-8 text-sm"
                autoFocus
              />
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={saveLocation}>
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setEditingLocation(true)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              <span className="truncate max-w-[200px]">{location}</span>
              <Edit2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Hi, {profile?.name?.split(" ")[0] || "there"} 👋
          </h1>
          <p className="text-muted-foreground mt-1">What service do you need today?</p>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-3 gap-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className="cursor-pointer border-0 shadow-sm hover:shadow-md transition-shadow"
              onClick={() => navigate(`/book/${service.id}`)}
            >
              <CardContent className="flex flex-col items-center gap-2 p-4">
                <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorMap[service.category] || "bg-muted text-muted-foreground"}`}>
                  {iconMap[service.icon || ""] || <Sparkles className="h-8 w-8" />}
                </div>
                <span className="text-xs font-medium text-center text-foreground">{service.name}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Button
            className="w-full h-14 text-base font-semibold rounded-2xl shadow-lg"
            onClick={() => navigate("/book/" + (services[0]?.id || ""))}
          >
            ⚡ Instant Book
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 font-medium rounded-2xl"
            onClick={() => navigate("/history")}
          >
            <History className="mr-2 h-4 w-4" />
            View Booking History
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
