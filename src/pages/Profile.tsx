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
import { ArrowLeft, LogOut, Save, Loader2 } from "lucide-react";

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
      <header className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Profile</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Default Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" className="h-12" />
            </div>
            <Button className="w-full h-12 font-semibold rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full h-12 font-medium rounded-xl text-destructive border-destructive/30 hover:bg-destructive/5"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </main>
    </div>
  );
};

export default Profile;
