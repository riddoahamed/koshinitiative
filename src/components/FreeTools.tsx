import { Link } from "react-router-dom";
import { AlertTriangle, Scale, CreditCard, TrendingUp, Car, Wallet, ArrowUpRight, LucideIcon } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

type Tool = {
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  title: string;
  tag: string;
  description: string;
  link: string;
};

const tools: Tool[] = [
  {
    icon: AlertTriangle,
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    title: "Scam Spotter",
    tag: "Game",
    description: "6 real BD scenarios. Spot scams - halal forex, bKash Ponzis, Telegram crypto - before they spot you.",
    link: "/scam-spotter",
  },
  {
    icon: Scale,
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    title: "Savings Comparator",
    tag: "Calculator",
    description: "FDR vs Sanchaypatra vs DPS vs savings - after-tax returns with inflation benchmark.",
    link: "/comparator",
  },
  {
    icon: CreditCard,
    iconColor: "text-violet-500",
    iconBg: "bg-violet-500/10",
    title: "EMI Calculator",
    tag: "Calculator",
    description: "Bank loans or credit card EMI - iPhone, bike, PC. Monthly payment + total interest before you borrow.",
    link: "/emi-calculator",
  },
  {
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    title: "Goal-based SIP",
    tag: "Planner",
    description: "Studies abroad, wedding, car down payment - exact monthly savings needed to hit your goal.",
    link: "/sip-calculator",
  },
  {
    icon: Car,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    title: "Car Affordability",
    tag: "Calculator",
    description: "EMI + fuel + insurance + maintenance. See the real monthly cost and 5-year ownership bill before buying.",
    link: "/car-calculator",
  },
  {
    icon: Wallet,
    iconColor: "text-slate-500",
    iconBg: "bg-slate-500/10",
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
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-dark tracking-tight">
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
              className="group relative rounded-xl border border-kosh-teal/15 bg-white p-6 md:p-7 flex flex-col hover:border-kosh-teal/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${t.iconBg}`}>
                  <t.icon className={t.iconColor} size={22} strokeWidth={2} />
                </div>
                <ArrowUpRight
                  className="text-kosh-muted group-hover:text-kosh-teal transition-colors"
                  size={18}
                />
              </div>

              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-serif text-xl md:text-2xl text-kosh-dark">{t.title}</h3>
                <span className="px-2 py-0.5 rounded-full bg-kosh-mint/15 text-kosh-dark text-[10px] font-sans font-semibold uppercase tracking-wider">
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
