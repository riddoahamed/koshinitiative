import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "mixed" | "warning" | "info";

const variantStyles: Record<Variant, { bg: string; ring: string; glow: string; icon: string }> = {
  primary: {
    bg: "bg-[radial-gradient(circle_at_30%_25%,hsl(var(--primary)/0.55),hsl(var(--primary)/0.15)_55%,transparent_75%)]",
    ring: "ring-primary/40",
    glow: "shadow-[0_0_30px_-8px_hsl(var(--primary)/0.7),inset_0_1px_0_0_hsl(var(--primary)/0.4)]",
    icon: "text-primary-foreground drop-shadow-[0_2px_4px_hsl(var(--primary)/0.6)]",
  },
  accent: {
    bg: "bg-[radial-gradient(circle_at_30%_25%,hsl(var(--accent)/0.55),hsl(var(--accent)/0.15)_55%,transparent_75%)]",
    ring: "ring-accent/40",
    glow: "shadow-[0_0_30px_-8px_hsl(var(--accent)/0.7),inset_0_1px_0_0_hsl(var(--accent)/0.4)]",
    icon: "text-accent-foreground drop-shadow-[0_2px_4px_hsl(var(--accent)/0.6)]",
  },
  mixed: {
    bg: "bg-[radial-gradient(circle_at_30%_25%,hsl(var(--accent)/0.5),hsl(var(--primary)/0.4)_55%,transparent_80%)]",
    ring: "ring-primary/40",
    glow: "shadow-[0_0_30px_-8px_hsl(var(--primary)/0.6),0_0_20px_-8px_hsl(var(--accent)/0.5),inset_0_1px_0_0_hsl(var(--accent)/0.35)]",
    icon: "text-white drop-shadow-[0_2px_4px_hsl(var(--primary)/0.7)]",
  },
  warning: {
    bg: "bg-[radial-gradient(circle_at_30%_25%,hsl(25_95%_60%/0.55),hsl(0_85%_55%/0.2)_55%,transparent_75%)]",
    ring: "ring-orange-400/40",
    glow: "shadow-[0_0_30px_-8px_hsl(25_95%_60%/0.7),inset_0_1px_0_0_hsl(25_95%_70%/0.4)]",
    icon: "text-white drop-shadow-[0_2px_4px_hsl(25_95%_50%/0.6)]",
  },
  info: {
    bg: "bg-[radial-gradient(circle_at_30%_25%,hsl(200_95%_60%/0.55),hsl(220_85%_55%/0.2)_55%,transparent_75%)]",
    ring: "ring-blue-400/40",
    glow: "shadow-[0_0_30px_-8px_hsl(200_95%_60%/0.7),inset_0_1px_0_0_hsl(200_95%_70%/0.4)]",
    icon: "text-white drop-shadow-[0_2px_4px_hsl(200_95%_50%/0.6)]",
  },
};

interface GlassIconProps {
  icon: LucideIcon;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeMap = {
  sm: { box: "w-11 h-11 rounded-xl", icon: 20 },
  md: { box: "w-14 h-14 rounded-2xl", icon: 26 },
  lg: { box: "w-16 h-16 rounded-2xl", icon: 30 },
};

export const GlassIcon = ({ icon: Icon, variant = "primary", size = "md", className }: GlassIconProps) => {
  const v = variantStyles[variant];
  const s = sizeMap[size];
  return (
    <div
      className={cn(
        "relative isolate flex items-center justify-center backdrop-blur-md ring-1 overflow-hidden",
        s.box,
        v.bg,
        v.ring,
        v.glow,
        className,
      )}
    >
      {/* Glass highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br from-white/25 via-white/5 to-transparent opacity-70" />
      {/* Top sheen */}
      <span className="pointer-events-none absolute -top-1/3 left-0 right-0 h-2/3 rounded-[inherit] bg-gradient-to-b from-white/30 to-transparent blur-md opacity-60" />
      <Icon size={s.icon} strokeWidth={1.8} className={cn("relative z-10", v.icon)} />
    </div>
  );
};

export default GlassIcon;
