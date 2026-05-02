import { motion } from "framer-motion";
import {
  Smartphone,
  Puzzle,
  Gamepad2,
  BarChart3,
  CheckCircle2,
  Building2,
  Wallet,
  HeartHandshake,
  Briefcase,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { GlassIcon } from "@/components/ui/glass-icon";

const features = [
  {
    icon: Smartphone,
    variant: "primary" as const,
    title: "White-label mobile app",
    body: "Your brand, your colors. Full Kosh education platform deployed to your users as a standalone app on Android and iOS.",
  },
  {
    icon: Puzzle,
    variant: "mixed" as const,
    title: "Plug-in for your app or website",
    body: "Drop financial literacy modules straight into your existing banking app, website, or employee portal with one simple integration.",
  },
  {
    icon: Gamepad2,
    variant: "accent" as const,
    title: "Gamified learning engine",
    body: "Points, streaks, levels, challenges, and leaderboards - the same engagement layer that keeps Kosh learners coming back, under your roof.",
  },
  {
    icon: BarChart3,
    variant: "primary" as const,
    title: "Analytics dashboard",
    body: "Track literacy baseline scores, module completion, engagement trends, and real learning outcomes across your user base.",
  },
];

const audiences = [
  {
    icon: Sparkles,
    variant: "mixed" as const,
    label: "Fintech Platforms",
    body: "Differentiate your product with built-in financial education. Drive activation, retention, and trust with embedded learning.",
  },
  {
    icon: Building2,
    variant: "primary" as const,
    label: "Banks & NBFIs",
    body: "Boost customer engagement and digital product adoption through embedded financial education.",
  },
  {
    icon: Wallet,
    variant: "accent" as const,
    label: "MFS Platforms",
    body: "bKash, Nagad, Rocket - help users understand what they're doing with their money.",
  },
  {
    icon: HeartHandshake,
    variant: "mixed" as const,
    label: "NGOs & MFIs",
    body: "Embed financial literacy into microcredit programs and community outreach at scale.",
  },
  {
    icon: Briefcase,
    variant: "primary" as const,
    label: "Employers & HR",
    body: "Employee financial wellness programs - measurable, gamified, and locally relevant.",
  },
];

type OrgCategory = "Banks" | "NBFIs" | "MFS" | "Fintech" | "Employers" | "Regulators" | "NGOs/INGOs";

type OrgItem = { name: string; category: OrgCategory; domain?: string };

const orgItemsRaw: OrgItem[] = [
  // Banks
  { name: "City Bank", category: "Banks", domain: "thecitybank.com" },
  { name: "BRAC Bank", category: "Banks", domain: "bracbank.com" },
  { name: "Eastern Bank", category: "Banks", domain: "ebl.com.bd" },
  { name: "Dutch-Bangla Bank", category: "Banks", domain: "dutchbanglabank.com" },
  { name: "Prime Bank", category: "Banks", domain: "primebank.com.bd" },
  { name: "Mutual Trust Bank", category: "Banks", domain: "mutualtrustbank.com" },
  { name: "Standard Chartered BD", category: "Banks", domain: "sc.com" },
  // NBFIs
  { name: "IDLC Finance", category: "NBFIs", domain: "idlc.com" },
  { name: "IPDC Finance", category: "NBFIs", domain: "ipdcbd.com" },
  { name: "LankaBangla", category: "NBFIs", domain: "lankabangla.com" },
  { name: "DBH Finance", category: "NBFIs", domain: "dbhfinance.com" },
  // MFS
  { name: "bKash", category: "MFS", domain: "bkash.com" },
  { name: "Nagad", category: "MFS", domain: "nagad.com.bd" },
  { name: "Rocket", category: "MFS" },
  { name: "Upay", category: "MFS", domain: "upaybd.com" },
  { name: "Tap", category: "MFS" },
  // Fintech / loan / commerce platforms
  { name: "Pathao", category: "Fintech", domain: "pathao.com" },
  { name: "ShopUp", category: "Fintech", domain: "shopup.org" },
  { name: "Chaldal", category: "Fintech", domain: "chaldal.com" },
  { name: "Foodpanda", category: "Fintech", domain: "foodpanda.com.bd" },
  { name: "Daraz", category: "Fintech", domain: "daraz.com.bd" },
  { name: "Sheba.xyz", category: "Fintech", domain: "sheba.xyz" },
  { name: "Truck Lagbe", category: "Fintech", domain: "trucklagbe.com" },
  // Top employers
  { name: "Grameenphone", category: "Employers", domain: "grameenphone.com" },
  { name: "Robi", category: "Employers", domain: "robi.com.bd" },
  { name: "Banglalink", category: "Employers", domain: "banglalink.net" },
  { name: "Square Group", category: "Employers", domain: "squaregroup.com" },
  { name: "Beximco", category: "Employers", domain: "beximco.com" },
  { name: "ACI Limited", category: "Employers", domain: "aci-bd.com" },
  { name: "Renata", category: "Employers", domain: "renata-ltd.com" },
  { name: "Walton", category: "Employers", domain: "waltonbd.com" },
  // Regulators
  { name: "Bangladesh Bank", category: "Regulators", domain: "bb.org.bd" },
  { name: "BIDA", category: "Regulators", domain: "bida.gov.bd" },
  { name: "BSEC", category: "Regulators", domain: "sec.gov.bd" },
  { name: "ICB", category: "Regulators", domain: "icb.gov.bd" },
  // NGOs / INGOs
  { name: "BRAC", category: "NGOs/INGOs", domain: "brac.net" },
  { name: "Grameen Bank", category: "NGOs/INGOs", domain: "grameen.com" },
  { name: "ASA", category: "NGOs/INGOs", domain: "asa.org.bd" },
  { name: "BURO Bangladesh", category: "NGOs/INGOs", domain: "burobd.org" },
  { name: "TMSS", category: "NGOs/INGOs", domain: "tmss-bd.org" },
  { name: "UNDP Bangladesh", category: "NGOs/INGOs", domain: "undp.org" },
  { name: "UNICEF Bangladesh", category: "NGOs/INGOs", domain: "unicef.org" },
  { name: "World Bank BD", category: "NGOs/INGOs", domain: "worldbank.org" },
  { name: "ADB Bangladesh", category: "NGOs/INGOs", domain: "adb.org" },
  { name: "JICA", category: "NGOs/INGOs", domain: "jica.go.jp" },
  { name: "USAID Bangladesh", category: "NGOs/INGOs", domain: "usaid.gov" },
];

// Seeded shuffle (Mulberry32) + anti-cluster pass so categories don't repeat back-to-back
const orgItems: OrgItem[] = (() => {
  let s = 1337;
  const rand = () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const arr = [...orgItemsRaw].sort(() => rand() - 0.5);
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].category === arr[i - 1].category) {
      for (let j = i + 1; j < arr.length; j++) {
        const prev = arr[i - 1].category;
        const next = arr[i + 1]?.category;
        if (arr[j].category !== prev && arr[j].category !== next) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          break;
        }
      }
    }
  }
  return arr;
})();

const progression = [
  { label: "0 → 1", sub: "Beginner" },
  { label: "1 → 10", sub: "Building" },
  { label: "10 → 100", sub: "Mastery" },
];

const stats = [
  { num: "800+", label: "Bangladesh-specific learning modules" },
  { num: "3", label: "Deployment modes (app · web · plug-in)" },
];

const checklist = [
  "Full Bangla/Banglish content library",
  "Gamification (points, streaks, levels)",
  "Diagnostic + progress tracking",
  "White-label branding & colors",
  "Analytics dashboard for your team",
  "Scam awareness & grey zone content",
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const ForOrganizations = () => {
  const ref = useScrollAnimation();

  return (
    <section
      id="for-organizations"
      className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div ref={ref} className="relative max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          For Organizations
        </p>
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite mb-5 tracking-tight">
          Financial Literacy as a Product
        </h2>
        <p className="text-kosh-muted text-base md:text-lg leading-relaxed mb-14 max-w-3xl font-sans">
          Ready-to-deploy gamified financial literacy - white-label app, web SDK, or embedded module. Your brand, your users, Kosh's content engine and engagement layer powering it all.
        </p>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6 mb-16">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="relative rounded-2xl p-7 border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-primary/50 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.6),0_0_25px_-12px_hsl(var(--accent)/0.5)] transition-all overflow-hidden"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 w-48 h-48 rounded-full bg-primary/15 blur-3xl" />
              <GlassIcon icon={f.icon} variant={f.variant} size="md" className="mb-5" />
              <h3 className="font-serif text-xl text-kosh-offwhite mb-2">{f.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed font-sans">{f.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Who it's for */}
        <div className="mb-10">
          <h3 className="font-serif text-2xl md:text-3xl text-kosh-offwhite mb-8">Who it's for</h3>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="relative flex items-start gap-4 rounded-2xl p-5 border border-white/10 bg-white/[0.04] backdrop-blur-xl hover:border-accent/40 hover:shadow-[0_0_30px_-12px_hsl(var(--accent)/0.6)] transition-all overflow-hidden"
              >
                <div className="pointer-events-none absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-accent/10 blur-3xl" />
                <GlassIcon icon={a.icon} variant={a.variant} size="sm" className="shrink-0" />
                <div className="relative">
                  <p className="font-sans font-semibold text-kosh-offwhite text-base mb-1">
                    {a.label}
                  </p>
                  <p className="text-kosh-muted text-sm leading-relaxed font-sans">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Organizations marquee — credibility strip */}
        <div className="mb-16">
          <p className="text-[10px] font-sans uppercase tracking-[0.25em] text-kosh-muted/70 mb-5 text-center">
            The kind of organisations whose customers, members, and teams already need Kosh
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="flex gap-10 md:gap-14 animate-marquee whitespace-nowrap py-3">
              {[...orgLogos, ...orgLogos].map((name, i) => (
                <span
                  key={`${name}-${i}`}
                  className="font-serif text-sm md:text-base text-kosh-offwhite/55 hover:text-kosh-mint/90 transition-colors tracking-wide shrink-0"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>


        {/* Stats + Checklist + CTA */}
        <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/10 border border-primary/30 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.15),transparent_60%)] pointer-events-none" />

          {/* Progression tracks - own row, generously spaced */}
          <div className="relative mb-10 pb-10 border-b border-white/10">
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-muted mb-6">
              Progression tracks · beginner to mastery
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 sm:gap-10">
              {progression.map((p, idx) => (
                <div key={p.label} className="flex-1 flex items-center justify-between gap-6 sm:gap-10">
                  <div className="flex flex-col items-center sm:items-start text-center sm:text-left mx-auto sm:mx-0">
                    <p className="font-serif text-3xl md:text-4xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent leading-none mb-2 tracking-tight">
                      {p.label}
                    </p>
                    <p className="text-kosh-muted text-xs font-sans uppercase tracking-[0.18em]">{p.sub}</p>
                  </div>
                  {idx < progression.length - 1 && (
                    <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="relative grid sm:grid-cols-2 gap-8 mb-10 pb-10 border-b border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl md:text-4xl bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">{s.num}</p>
                <p className="text-kosh-muted text-sm font-sans leading-snug">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="relative grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                <p className="text-kosh-offwhite/85 text-sm font-sans">{item}</p>
              </div>
            ))}
          </div>

          <div className="relative flex flex-col items-start gap-3">
            <a
              href="mailto:koshinitiative@gmail.com?subject=Pilot%20enquiry%20-%20Kosh%20for%20organizations&body=Hi%20Kosh%2C%0A%0AWe%27d%20like%20to%20explore%20a%20pilot.%20Our%20organization%3A"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-gradient-to-r from-primary to-accent text-primary-foreground font-sans font-semibold text-sm transition-all hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.8)] hover:scale-[1.02]"
            >
              Talk to us about a pilot
              <ArrowRight size={16} />
            </a>
            <p className="text-kosh-muted text-xs font-sans">
              Onboarding pilot partners now. NGOs, student banks, and MFS platforms prioritized.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForOrganizations;
