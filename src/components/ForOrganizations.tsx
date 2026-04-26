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
      className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24"
    >
      <div ref={ref} className="max-w-6xl mx-auto">
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
              className="bg-white/[0.03] backdrop-blur-sm rounded-xl p-7 border border-primary/20 hover:border-primary/60 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.6)] transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center mb-5">
                <f.icon className="text-primary" size={22} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-kosh-offwhite mb-2">{f.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed font-sans">{f.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Who it's for */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl md:text-3xl text-kosh-offwhite mb-8">Who it's for</h3>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="flex items-start gap-4 bg-white/[0.03] backdrop-blur-sm rounded-lg p-5 border border-accent/15 hover:border-accent/40 transition-colors"
              >
                <CheckCircle2 className="text-accent shrink-0 mt-0.5" size={22} strokeWidth={2} />
                <div>
                  <p className="font-sans font-semibold text-kosh-offwhite text-base mb-1">
                    {a.label}
                  </p>
                  <p className="text-kosh-muted text-sm leading-relaxed font-sans">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + Checklist + CTA */}
        <div className="relative rounded-2xl p-8 md:p-12 overflow-hidden bg-gradient-to-br from-primary/15 via-background to-accent/10 border border-primary/30 shadow-[0_0_60px_-20px_hsl(var(--primary)/0.6)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.15),transparent_60%)] pointer-events-none" />
          <div className="relative grid md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">{s.num}</p>
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
