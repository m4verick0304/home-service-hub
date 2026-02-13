import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, LogOut, Save, Loader2, User, Phone, MapPin } from "lucide-react";

const Profile = () => {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ name, phone, address })
      .eq("id", profile.id);

    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-background">
      <header className="uc-header sticky top-0 z-50">
        <div className="mx-auto flex max-w-2xl items-center gap-3 px-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10 rounded-lg"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-bold text-white">Profile</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-2xl px-6 py-8 space-y-6"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar className="h-20 w-20 border-2 border-border">
            <AvatarFallback className="bg-muted text-foreground text-2xl font-black">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Card className="border shadow-uc rounded-xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <User className="h-3.5 w-3.5" /> Full Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Phone className="h-3.5 w-3.5" /> Phone Number
              </Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="h-12 rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address" className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <MapPin className="h-3.5 w-3.5" /> Default Address
              </Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="h-12 rounded-lg" />
            </div>
            <Button
              className="w-full h-12 font-bold rounded-xl"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full h-12 font-semibold rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </motion.main>
    </div>
  );
};

export default Profile;
