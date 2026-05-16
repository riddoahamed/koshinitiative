import { AlertTriangle, Scale, CreditCard, TrendingUp, Car, Wallet, ArrowUpRight, LucideIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";
import { KOSH_APP_URL } from "@/lib/links";

type Variant = "primary" | "accent" | "mixed" | "warning" | "info";

type Tool = {
  icon: LucideIcon;
  variant: Variant;
  title: string;
  tag: string;
  description: string;
  link: string;
};

const tools: Tool[] = [
  {
    icon: AlertTriangle,
    variant: "warning",
    title: "Scam Spotter",
    tag: "Game",
    description: "6 real BD scenarios. Spot scams - halal forex, bKash Ponzis, Telegram crypto - before they spot you.",
    link: "/scam-spotter",
  },
  {
    icon: Scale,
    variant: "info",
    title: "Savings Comparator",
    tag: "Calculator",
    description: "FDR vs Sanchaypatra vs DPS vs savings - after-tax returns with inflation benchmark.",
    link: "/comparator",
  },
  {
    icon: CreditCard,
    variant: "primary",
    title: "EMI Calculator",
    tag: "Calculator",
    description: "Bank loans or credit card EMI - iPhone, bike, PC. Monthly payment + total interest before you borrow.",
    link: "/emi-calculator",
  },
  {
    icon: TrendingUp,
    variant: "accent",
    title: "Goal-based SIP",
    tag: "Planner",
    description: "Studies abroad, wedding, car down payment - exact monthly savings needed to hit your goal.",
    link: "/sip-calculator",
  },
  {
    icon: Car,
    variant: "warning",
    title: "Car Affordability",
    tag: "Calculator",
    description: "EMI + fuel + insurance + maintenance. See the real monthly cost and 5-year ownership bill before buying.",
    link: "/car-calculator",
  },
  {
    icon: Wallet,
    variant: "mixed",
    title: "Budget Planner",
    tag: "Planner",
    description: "50% Needs · 30% Wants · 20% Savings. BD-specific categories - see your real savings rate.",
    link: "/budget-planner",
  },
];

const FreeTools = () => {
  const ref = useScrollAnimation();

  return (
    <section id="tools" className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-accent/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-primary/12 blur-[140px]" />
      <div ref={ref} className="relative max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite tracking-tight">
          Free financial tools
        </h2>
        <p className="text-kosh-muted text-sm font-mono mt-3 mb-12">
          Tools for you on our app
        </p>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {tools.map((t) => (
            <a
              key={t.title}
              href={KOSH_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-6 md:p-7 flex flex-col hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6),0_0_25px_-12px_hsl(var(--accent)/0.5)] transition-all"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-start justify-between mb-4">
                <GlassIcon icon={t.icon} variant={t.variant} size="md" />
                <ArrowUpRight
                  className="text-kosh-muted group-hover:text-accent transition-colors"
                  size={18}
                />
              </div>

              <div className="relative flex items-center gap-2 mb-2">
                <h3 className="font-serif text-xl md:text-2xl text-kosh-offwhite">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-sans font-semibold uppercase tracking-wider">
                  {t.tag}
                </span>
              </div>

              <p className="relative text-kosh-muted text-sm leading-relaxed font-sans">
                {t.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeTools;
