import { Link } from "react-router-dom";
import { AlertTriangle, Scale, CreditCard, TrendingUp, Car, Wallet, ArrowUpRight, LucideIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";

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
    <section id="tools" className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite tracking-tight">
          Free financial tools
        </h2>
        <p className="text-kosh-muted text-sm font-mono mt-3 mb-12">
          6 calculators built for Bangladesh. No sign-up needed.
        </p>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.link}
              className="group relative rounded-xl border border-primary/20 bg-white/[0.03] backdrop-blur-sm p-6 md:p-7 flex flex-col hover:border-primary/60 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.6)] transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${t.iconBg}`}>
                  <t.icon className={t.iconColor} size={22} strokeWidth={2} />
                </div>
                <ArrowUpRight
                  className="text-kosh-muted group-hover:text-accent transition-colors"
                  size={18}
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-xl md:text-2xl text-kosh-offwhite">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-[10px] font-sans font-semibold uppercase tracking-wider">
                  {t.tag}
                </span>
              </div>

              <p className="text-kosh-muted text-sm leading-relaxed font-sans">
                {t.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeTools;
