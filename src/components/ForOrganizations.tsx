import { motion } from "framer-motion";
import {
  Smartphone,
  Code2,
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

const features = [
  {
    icon: Smartphone,
    title: "White-label mobile app",
    body: "Your brand, your colors. Full Kosh education platform deployed to your users as a standalone app on Android and iOS.",
  },
  {
    icon: Code2,
    title: "SDK / web embed",
    body: "Drop financial literacy modules directly into your existing banking app, website, or employee portal with a single integration.",
  },
  {
    icon: Gamepad2,
    title: "Gamified learning engine",
    body: "Points, streaks, levels, challenges, and leaderboards - the same engagement layer that keeps Kosh learners coming back, under your roof.",
  },
  {
    icon: BarChart3,
    title: "Analytics dashboard",
    body: "Track literacy baseline scores, module completion, engagement trends, and real learning outcomes across your user base.",
  },
];

const audiences = [
  {
    icon: Building2,
    label: "Banks & NBFIs",
    body: "Boost customer engagement and digital product adoption through embedded financial education.",
  },
  {
    icon: Wallet,
    label: "MFS Platforms",
    body: "bKash, Nagad, Rocket - help users understand what they're doing with their money.",
  },
  {
    icon: HeartHandshake,
    label: "NGOs & MFIs",
    body: "Embed financial literacy into microcredit programs and community outreach at scale.",
  },
  {
    icon: Briefcase,
    label: "Employers & HR",
    body: "Employee financial wellness programs - measurable, gamified, and locally relevant.",
  },
];

const stats = [
  { num: "800+", label: "Bangladesh-specific learning modules" },
  { num: "0→1 · 1→10 · 10→100", label: "Progression tracks from beginner to mastery" },
  { num: "3", label: "Deployment modes (app · web · SDK)" },
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
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-dark mb-5 tracking-tight">
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
              className="bg-white rounded-xl p-7 border border-transparent hover:border-kosh-mint/40 hover:shadow-md transition-all"
            >
              <div className="w-11 h-11 rounded-lg bg-kosh-teal/10 flex items-center justify-center mb-5">
                <f.icon className="text-kosh-teal" size={22} strokeWidth={1.8} />
              </div>
              <h3 className="font-serif text-xl text-kosh-dark mb-2">{f.title}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed font-sans">{f.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Who it's for */}
        <div className="mb-16">
          <h3 className="font-serif text-2xl md:text-3xl text-kosh-dark mb-8">Who it's for</h3>
          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="flex items-start gap-4 bg-white/60 rounded-lg p-5 border border-kosh-teal/10"
              >
                <CheckCircle2 className="text-kosh-teal shrink-0 mt-0.5" size={22} strokeWidth={2} />
                <div>
                  <p className="font-sans font-semibold text-kosh-dark text-base mb-1">
                    {a.label}
                  </p>
                  <p className="text-kosh-muted text-sm leading-relaxed font-sans">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats + Checklist + CTA */}
        <div className="rounded-2xl bg-kosh-dark p-8 md:p-12">
          <div className="grid md:grid-cols-3 gap-8 mb-10 pb-10 border-b border-white/10">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-serif text-4xl md:text-5xl text-kosh-mint mb-2">{s.num}</p>
                <p className="text-kosh-muted text-sm font-sans leading-snug">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="text-kosh-mint shrink-0 mt-0.5" size={16} strokeWidth={2.5} />
                <p className="text-white/85 text-sm font-sans">{item}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3">
            <a
              href="mailto:koshinitiative@gmail.com?subject=Pilot%20enquiry%20-%20Kosh%20for%20organizations&body=Hi%20Kosh%2C%0A%0AWe%27d%20like%20to%20explore%20a%20pilot.%20Our%20organization%3A"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-kosh-mint text-kosh-dark font-sans font-semibold text-sm transition-opacity hover:opacity-90"
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
