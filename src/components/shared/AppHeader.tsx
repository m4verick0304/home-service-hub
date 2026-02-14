import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
  rightContent?: React.ReactNode;
  variant?: "primary" | "transparent" | "white";
  initials?: string;
  profilePath?: string;
}

export function AppHeader({ title, showBack = false, backTo, rightContent, variant = "primary", initials, profilePath }: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn(
      "sticky top-0 z-50 border-b",
      variant === "primary" && "sh-gradient-blue border-transparent",
      variant === "transparent" && "bg-transparent border-transparent",
      variant === "white" && "bg-card border-border sh-glass",
    )}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 sm:px-6 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-xl h-9 w-9",
                variant === "primary" ? "text-white/80 hover:text-white hover:bg-white/10" : "text-foreground hover:bg-muted"
              )}
              onClick={() => backTo ? navigate(backTo) : navigate(-1)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          {!showBack && (
            <button onClick={() => navigate("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sh-gradient-blue text-white text-xs font-black sh-shadow">
                SH
              </div>
              <span className={cn(
                "text-base font-bold tracking-tight hidden sm:block",
                variant === "primary" ? "text-white" : "text-foreground"
              )}>
                Urban Square
              </span>
            </button>
          )}
          {title && (
            <h1 className={cn(
              "text-sm font-bold",
              variant === "primary" ? "text-white" : "text-foreground"
            )}>{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          {rightContent}
          {initials && (
            <button onClick={() => profilePath && navigate(profilePath)} className="hover:opacity-80 transition-opacity">
              <Avatar className="h-8 w-8 border-2 border-white/20">
                <AvatarFallback className={cn(
                  "text-xs font-bold",
                  variant === "primary" ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
                )}>{initials}</AvatarFallback>
              </Avatar>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
