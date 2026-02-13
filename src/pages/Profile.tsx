import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { AppHeader } from "@/components/shared/AppHeader";
import { motion } from "framer-motion";
import { LogOut, Save, Loader2, User, Phone, MapPin } from "lucide-react";

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
    const { error } = await supabase.from("profiles").update({ name, phone, address }).eq("id", profile.id);
    if (error) toast({ title: "Update failed", description: error.message, variant: "destructive" });
    else { toast({ title: "Profile updated!" }); await refreshProfile(); }
    setSaving(false);
  };

  const handleSignOut = async () => { await signOut(); navigate("/auth"); };

  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Profile" showBack backTo="/" variant="primary" />

      <motion.main initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-col items-center gap-3 py-4">
          <Avatar className="h-20 w-20 border-2 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-black">{initials}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-bold text-foreground text-lg">{name || "User"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border sh-shadow space-y-5">
          <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Personal Information</h3>
          {[
            { id: "name", label: "Full Name", icon: User, value: name, onChange: setName, placeholder: "Your name" },
            { id: "phone", label: "Phone", icon: Phone, value: phone, onChange: setPhone, placeholder: "+91 9876543210" },
            { id: "address", label: "Default Address", icon: MapPin, value: address, onChange: setAddress, placeholder: "Enter your address" },
          ].map(field => (
            <div key={field.id} className="space-y-1.5">
              <Label htmlFor={field.id} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <field.icon className="h-3.5 w-3.5 text-primary" /> {field.label}
              </Label>
              <Input id={field.id} value={field.value} onChange={e => field.onChange(e.target.value)} placeholder={field.placeholder} className="h-12 rounded-xl" />
            </div>
          ))}
          <Button className="w-full h-12 font-bold rounded-xl sh-gradient-blue border-0 text-white" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <Button variant="outline" className="w-full h-12 font-semibold rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out
        </Button>
      </motion.main>
    </div>
  );
};

export default Profile;
