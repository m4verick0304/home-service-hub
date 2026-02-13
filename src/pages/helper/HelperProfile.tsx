import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HelperBottomNav } from "@/components/helper/HelperBottomNav";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import {
  Star, ChevronRight, ChevronDown, Camera, Phone, Mail, MapPin,
  Wrench, Zap, LogOut, Shield, FileText, HelpCircle,
  Pencil, Check, X, Plus, Trash2, Globe, Bell, Lock, Eye, EyeOff,
  MessageCircle, AlertTriangle, Upload
} from "lucide-react";

const availableSkills = [
  { id: "electrician", label: "Electrician", icon: Zap },
  { id: "plumber", label: "Plumber", icon: Wrench },
  { id: "carpenter", label: "Carpenter", icon: Wrench },
  { id: "painter", label: "Painter", icon: Wrench },
  { id: "cleaner", label: "Cleaner", icon: Wrench },
  { id: "ac_repair", label: "AC Repair", icon: Zap },
  { id: "cook", label: "Cook", icon: Wrench },
  { id: "salon", label: "Salon/Beauty", icon: Wrench },
];

const HelperProfile = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  // Profile state
  const [name, setName] = useState("Rajesh Kumar");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [email, setEmail] = useState("rajesh.kumar@email.com");
  const [address, setAddress] = useState("Sector 45, Gurugram, Haryana");
  const [bio, setBio] = useState("Experienced electrician & plumber with 5+ years of expertise in residential and commercial services.");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["electrician", "plumber"]);
  const [languages, setLanguages] = useState(["Hindi", "English"]);
  const [newLanguage, setNewLanguage] = useState("");

  // Toggles
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Expandable sections
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Documents state
  const [documents] = useState([
    { name: "Aadhaar Card", status: "verified", uploaded: "Jan 10, 2025" },
    { name: "PAN Card", status: "verified", uploaded: "Jan 10, 2025" },
    { name: "Address Proof", status: "pending", uploaded: "Feb 1, 2025" },
  ]);

  // Privacy
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(true);

  // Help
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const faqs = [
    { q: "How do I receive more job leads?", a: "Keep your profile complete, stay online during peak hours, and maintain a high completion rate to get more leads." },
    { q: "When do I get paid?", a: "Payouts are processed every Monday and Thursday. Minimum payout is ₹500." },
    { q: "How do I update my skills?", a: "Go to your Profile, tap Edit, and toggle the skills you want to offer." },
    { q: "What if a customer cancels?", a: "If a customer cancels after you've arrived, you'll receive a cancellation fee." },
  ];

  const rating = 4.8;
  const totalJobs = 156;
  const completionRate = 94;
  const memberSince = "Jan 2025";

  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const toggleSkill = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages(prev => [...prev, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(prev => prev.filter(l => l !== lang));
  };

  const saveProfile = () => {
    setEditing(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-muted/50 pb-20">
      {/* Header */}
      <div className="bg-foreground text-background px-4 pt-12 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-lg font-bold text-background">Profile</h1>
          {!editing ? (
            <Button variant="ghost" size="sm" className="text-background/70 hover:text-background hover:bg-background/10 text-xs gap-1.5" onClick={() => setEditing(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-background/50 hover:text-background hover:bg-background/10 text-xs" onClick={() => setEditing(false)}>
                <X className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" className="bg-[hsl(var(--sh-green))] hover:bg-[hsl(var(--sh-green))]/90 text-white text-xs gap-1.5 border-0" onClick={saveProfile}>
                <Check className="h-3.5 w-3.5" /> Save
              </Button>
            </div>
          )}
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-background/20">
              <AvatarFallback className="bg-background/10 text-background font-black text-xl">{initials}</AvatarFallback>
            </Avatar>
            {editing && (
              <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary flex items-center justify-center border-2 border-foreground">
                <Camera className="h-3 w-3 text-primary-foreground" />
              </button>
            )}
          </div>
          <div>
            {editing ? (
              <Input value={name} onChange={(e) => setName(e.target.value)} className="h-9 text-sm font-bold bg-background/10 border-background/20 text-background mb-1 rounded-lg" />
            ) : (
              <h2 className="text-lg font-bold text-background">{name}</h2>
            )}
            <div className="flex items-center gap-2 mt-0.5">
              <Star className="h-3 w-3 fill-[hsl(var(--sh-orange))] text-[hsl(var(--sh-orange))]" />
              <span className="text-xs font-semibold text-background/80">{rating}</span>
              <span className="text-xs text-background/50">• {totalJobs} jobs • Since {memberSince}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 -mt-4 space-y-4">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-card border sh-shadow text-center">
            <p className="text-lg font-black text-foreground">{rating}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Rating</p>
          </div>
          <div className="p-3 rounded-xl bg-card border sh-shadow text-center">
            <p className="text-lg font-black text-foreground">{totalJobs}</p>
            <p className="text-[10px] text-muted-foreground font-medium">Jobs Done</p>
          </div>
          <div className="p-3 rounded-xl bg-card border sh-shadow text-center">
            <p className="text-lg font-black text-[hsl(var(--sh-green))]">{completionRate}%</p>
            <p className="text-[10px] text-muted-foreground font-medium">Completion</p>
          </div>
        </motion.div>

        {/* Contact Info */}
        <div className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <div className="p-4 pb-2">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Contact Information</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {editing ? (
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9 text-sm rounded-lg flex-1" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{phone}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {editing ? (
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-9 text-sm rounded-lg flex-1" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{email}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {editing ? (
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="h-9 text-sm rounded-lg flex-1" />
                ) : (
                  <span className="text-sm font-medium text-foreground">{address}</span>
                )}
              </div>
            </div>
          </div>
          {/* Bio */}
          <div className="p-4 pt-2 border-t mt-2">
            <Label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">About</Label>
            {editing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="mt-2 w-full text-sm rounded-lg border border-input bg-background px-3 py-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            ) : (
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{bio}</p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-xl bg-card border sh-shadow p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Skills & Services</h3>
          <div className="flex flex-wrap gap-2">
            {availableSkills.map(skill => {
              const isSelected = selectedSkills.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  onClick={() => editing && toggleSkill(skill.id)}
                  disabled={!editing}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-foreground text-background"
                      : editing
                        ? "bg-muted text-muted-foreground hover:bg-muted/80 border border-dashed border-border"
                        : "bg-muted text-muted-foreground/50"
                  } ${editing ? "cursor-pointer" : "cursor-default"}`}
                >
                  <skill.icon className="h-3 w-3" />
                  {skill.label}
                  {editing && isSelected && <X className="h-2.5 w-2.5 ml-0.5" />}
                  {editing && !isSelected && <Plus className="h-2.5 w-2.5 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Languages */}
        <div className="rounded-xl bg-card border sh-shadow p-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {languages.map(lang => (
              <span key={lang} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-xs font-semibold text-foreground">
                <Globe className="h-3 w-3 text-muted-foreground" />
                {lang}
                {editing && (
                  <button onClick={() => removeLanguage(lang)}><Trash2 className="h-2.5 w-2.5 text-destructive" /></button>
                )}
              </span>
            ))}
            {editing && (
              <div className="flex items-center gap-1.5">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addLanguage()}
                  placeholder="Add..."
                  className="h-8 w-24 text-xs rounded-lg"
                />
                <button onClick={addLanguage} className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider p-4 pb-2">Settings</h3>
          <div className="divide-y">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Push Notifications</p>
                  <p className="text-[10px] text-muted-foreground">Get notified about new leads</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-[hsl(var(--sh-green))]/10 flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-[hsl(var(--sh-green))]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Location Sharing</p>
                  <p className="text-[10px] text-muted-foreground">Share location while on job</p>
                </div>
              </div>
              <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
            </div>
          </div>
        </div>

        {/* Documents & ID — expandable */}
        <div className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <button onClick={() => toggleSection("documents")} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-foreground">Documents & ID</span>
            </div>
            <motion.div animate={{ rotate: expandedSection === "documents" ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expandedSection === "documents" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2.5 border-t pt-3">
                  {documents.map((doc) => (
                    <div key={doc.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="text-sm font-semibold text-foreground">{doc.name}</p>
                        <p className="text-[10px] text-muted-foreground">Uploaded {doc.uploaded}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        doc.status === "verified"
                          ? "bg-[hsl(var(--sh-green))]/10 text-[hsl(var(--sh-green))]"
                          : "bg-[hsl(var(--sh-orange))]/10 text-[hsl(var(--sh-orange))]"
                      }`}>
                        {doc.status === "verified" ? "✓ Verified" : "⏳ Pending"}
                      </span>
                    </div>
                  ))}
                  <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border text-xs font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors">
                    <Upload className="h-3.5 w-3.5" /> Upload New Document
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Privacy & Security — expandable */}
        <div className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <button onClick={() => toggleSection("privacy")} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--sh-green))]/10 flex items-center justify-center">
                <Shield className="h-4 w-4 text-[hsl(var(--sh-green))]" />
              </div>
              <span className="text-sm font-semibold text-foreground">Privacy & Security</span>
            </div>
            <motion.div animate={{ rotate: expandedSection === "privacy" ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expandedSection === "privacy" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {profileVisible ? <Eye className="h-4 w-4 text-muted-foreground" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                      <div>
                        <p className="text-sm font-medium text-foreground">Profile Visibility</p>
                        <p className="text-[10px] text-muted-foreground">Show profile to customers</p>
                      </div>
                    </div>
                    <Switch checked={profileVisible} onCheckedChange={setProfileVisible} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Show Phone Number</p>
                        <p className="text-[10px] text-muted-foreground">Display on your profile</p>
                      </div>
                    </div>
                    <Switch checked={showPhone} onCheckedChange={setShowPhone} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Show Email</p>
                        <p className="text-[10px] text-muted-foreground">Display on your profile</p>
                      </div>
                    </div>
                    <Switch checked={showEmail} onCheckedChange={setShowEmail} />
                  </div>
                  <button className="w-full flex items-center gap-2.5 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">Change Password</p>
                      <p className="text-[10px] text-muted-foreground">Update your account password</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Help & Support — expandable */}
        <div className="rounded-xl bg-card border sh-shadow overflow-hidden">
          <button onClick={() => toggleSection("help")} className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[hsl(var(--sh-purple))]/10 flex items-center justify-center">
                <HelpCircle className="h-4 w-4 text-[hsl(var(--sh-purple))]" />
              </div>
              <span className="text-sm font-semibold text-foreground">Help & Support</span>
            </div>
            <motion.div animate={{ rotate: expandedSection === "help" ? 180 : 0 }}>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </motion.div>
          </button>
          <AnimatePresence>
            {expandedSection === "help" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-2 border-t pt-3">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">FAQs</p>
                  {faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-lg bg-muted/50 overflow-hidden">
                      <button
                        onClick={() => setFaqExpanded(prev => prev === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-3 text-left"
                      >
                        <span className="text-sm font-medium text-foreground pr-2">{faq.q}</span>
                        <motion.div animate={{ rotate: faqExpanded === idx ? 180 : 0 }}>
                          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {faqExpanded === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors">
                      <MessageCircle className="h-3.5 w-3.5" /> Chat Support
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-xs font-semibold text-foreground hover:bg-muted/50 transition-colors">
                      <AlertTriangle className="h-3.5 w-3.5" /> Report Issue
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Logout */}
        <button
          onClick={() => navigate("/helper/login")}
          className="w-full flex items-center justify-center gap-2 p-3.5 rounded-xl border border-destructive/20 text-destructive text-sm font-semibold hover:bg-destructive/5 transition-colors"
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </button>

        <div className="text-center pb-4">
          <p className="text-[10px] text-muted-foreground">homeserv Helper v2.0 • Made with ❤️</p>
        </div>
      </div>

      <HelperBottomNav />
    </div>
  );
};

export default HelperProfile;
