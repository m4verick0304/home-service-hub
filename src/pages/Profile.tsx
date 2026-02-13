import { useState, useEffect } from "react";
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
import { LogOut, Save, Loader2, User, Phone, MapPin, Mail, Shield, Calendar } from "lucide-react";

const Profile = () => {
  const { profile, user, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  // Sync state when profile loads (fixes the bug where state was empty on first render)
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setPhone(profile.phone || "");
      setAddress(profile.address || "");
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ name, phone, address }).eq("id", profile.id);
    if (error) {
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Profile updated!" });
      await refreshProfile();
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const initials = name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U";
  const memberSince = profile?.created_at ? new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "";

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="My Profile" showBack backTo="/dashboard" variant="primary" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-8 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-card border sh-shadow"
        >
          <div className="h-24 sh-gradient-blue" />
          <div className="px-6 pb-6 -mt-10">
            <Avatar className="h-20 w-20 border-4 border-card sh-shadow-md">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black">{initials}</AvatarFallback>
            </Avatar>
            <div className="mt-3">
              <h2 className="text-xl font-black text-foreground">{name || "User"}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="h-3 w-3" /> {user?.email}
                </span>
                {memberSince && (
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" /> Member since {memberSince}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="flex items-center gap-1.5 text-[10px] font-semibold text-[hsl(var(--sh-green))] bg-[hsl(var(--sh-green-light))] rounded-full px-2.5 py-1">
                <Shield className="h-3 w-3" /> Verified Account
              </span>
            </div>
          </div>
        </motion.div>

        {/* Edit Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-3xl bg-card border sh-shadow space-y-5"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Edit Information</h3>

          <div className="space-y-4">
            {[
              { id: "name", label: "Full Name", icon: User, value: name, onChange: setName, placeholder: "Your name" },
              { id: "phone", label: "Phone Number", icon: Phone, value: phone, onChange: setPhone, placeholder: "+91 9876543210" },
              { id: "address", label: "Default Address", icon: MapPin, value: address, onChange: setAddress, placeholder: "Enter your home address" },
            ].map(field => (
              <div key={field.id} className="space-y-1.5">
                <Label htmlFor={field.id} className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <field.icon className="h-3.5 w-3.5 text-primary" /> {field.label}
                </Label>
                <Input
                  id={field.id}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  className="h-12 rounded-xl border-2 focus-visible:border-primary"
                />
              </div>
            ))}
          </div>

          <Button
            className="w-full h-12 font-bold rounded-xl sh-gradient-blue border-0 text-white"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
            Save Changes
          </Button>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="outline"
            className="w-full h-12 font-semibold rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
