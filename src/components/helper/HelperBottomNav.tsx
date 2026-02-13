import { useNavigate, useLocation } from "react-router-dom";
import { Home, Briefcase, Wallet, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", path: "/helper/dashboard" },
  { icon: Briefcase, label: "Jobs", path: "/helper/jobs" },
  { icon: Wallet, label: "Earnings", path: "/helper/earnings" },
  { icon: User, label: "Profile", path: "/helper/profile" },
];

export function HelperBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className={`text-[10px] ${active ? "font-bold" : "font-medium"}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
