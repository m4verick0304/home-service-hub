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
      <header className="sticky top-0 z-10 border-b glass">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-extrabold">Profile</h1>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-lg px-4 py-6 space-y-6"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <Avatar className="h-24 w-24 ring-4 ring-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary text-3xl font-extrabold">
                {initials}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Card className="border-0 shadow-card overflow-hidden">
          <div className="h-1 gradient-primary" />
          <CardHeader>
            <CardTitle className="text-base font-bold">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 font-semibold">
                <User className="h-4 w-4 text-primary" /> Full Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-13 rounded-xl bg-muted/50 border-0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2 font-semibold">
                <Phone className="h-4 w-4 text-primary" /> Phone Number
              </Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="h-13 rounded-xl bg-muted/50 border-0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-2 font-semibold">
                <MapPin className="h-4 w-4 text-primary" /> Default Address
              </Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="h-13 rounded-xl bg-muted/50 border-0" />
            </div>
            <motion.div whileTap={{ scale: 0.98 }}>
              <Button className="w-full h-13 font-bold rounded-xl gradient-primary shadow-glow hover:opacity-90" onClick={handleSave} disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                Save Changes
              </Button>
            </motion.div>
          </CardContent>
        </Card>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            variant="outline"
            className="w-full h-13 font-semibold rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 hover:border-destructive/40"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Profile;
