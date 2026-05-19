import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { KOSH_APP_URL } from "@/lib/links";

const resources = [
  {
    emoji: "K",
    title: "Kosh beta app",
    desc: "Early access preview. Try the money check, expect rough edges, and help shape the full app.",
    url: KOSH_APP_URL,
    featured: true,
  },
  {
    emoji: "📘",
    title: "Khan Academy — Personal Finance",
    desc: "Free and beginner-friendly. Start with budgeting basics.",
    url: "https://www.khanacademy.org/college-careers-more/personal-finance",
  },
  {
    emoji: "📊",
    title: "Investopedia Term Dictionary",
    desc: "Plain-English definitions for every financial term you will encounter.",
    url: "https://www.investopedia.com/financial-term-dictionary-4769738",
  },
  {
    emoji: "💬",
    title: "r/personalfinance (Reddit)",
    desc: "Real people, real money questions. Unfiltered and surprisingly helpful.",
    url: "https://www.reddit.com/r/personalfinance/",
  },
  {
    emoji: "🧮",
    title: "The Rule of 72",
    desc: "One mental math shortcut every saver should know.",
    url: "https://www.investopedia.com/terms/r/ruleof72.asp",
  },
  {
    emoji: "📱",
    title: "Notion Personal Finance Tracker",
    desc: "A free template to track your monthly spending.",
    url: "https://www.notion.so/templates/personal-finance-tracker",
  },
];

const FreeResources = () => {
  const ref = useScrollAnimation();

  return (
    <section id="learn" className="relative bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/10 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full bg-primary/10 blur-[140px]" />
      <div ref={ref} className="relative max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">
          Start learning. For free.
        </h2>
        <p className="text-kosh-muted text-sm font-mono mt-3 mb-12 max-w-2xl">
          Start with trusted basics. The Kosh app is in beta: useful, early, and still being shaped with real users.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group rounded-lg border p-5 md:p-6 backdrop-blur-sm transition-all duration-300 ${
                r.featured
                  ? "border-kosh-lime/40 bg-kosh-lime/[0.08] shadow-[0_0_36px_-24px_hsl(var(--kosh-lime)/0.95)] hover:border-kosh-lime/75 hover:shadow-[0_0_34px_-16px_hsl(var(--kosh-lime)/0.75)]"
                  : "border-white/10 bg-white/5 hover:border-kosh-lime/45 hover:shadow-[0_0_20px_rgba(184,255,70,0.1)]"
              }`}
            >
              <span className={`block mb-3 ${r.featured ? "font-display text-3xl font-extrabold text-kosh-lime" : "text-2xl md:text-3xl"}`}>{r.emoji}</span>
              <h3 className="font-serif text-base md:text-lg text-white mb-1 group-hover:text-kosh-lime transition-colors">
                {r.title}
              </h3>
              <p className="text-kosh-muted text-xs md:text-sm font-sans leading-relaxed">
                {r.desc}
              </p>
              <span className="inline-block mt-3 text-xs font-mono text-kosh-lime opacity-0 group-hover:opacity-100 transition-opacity">
                Visit →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreeResources;
