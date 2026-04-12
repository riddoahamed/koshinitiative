import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const resources = [
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
  {
    emoji: "🎥",
    title: "Two Cents (YouTube)",
    desc: "Short, honest videos on real financial decisions.",
    url: "https://www.youtube.com/@TwoCentsPBS",
  },
];

const FreeResources = () => {
  const ref = useScrollAnimation();

  return (
    <section id="learn" className="bg-kosh-dark py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-white tracking-tight">
          Start learning. For free.
        </h2>
        <p className="text-kosh-muted text-sm font-mono mt-3 mb-12">
          Vetted resources we would recommend to anyone starting out.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-white/10 bg-white/5 p-5 md:p-6 backdrop-blur-sm transition-all duration-300 hover:border-kosh-mint/50 hover:shadow-[0_0_20px_rgba(2,195,154,0.1)]"
            >
              <span className="text-2xl md:text-3xl block mb-3">{r.emoji}</span>
              <h3 className="font-serif text-base md:text-lg text-white mb-1 group-hover:text-kosh-mint transition-colors">
                {r.title}
              </h3>
              <p className="text-kosh-muted text-xs md:text-sm font-sans leading-relaxed">
                {r.desc}
              </p>
              <span className="inline-block mt-3 text-xs font-mono text-kosh-mint opacity-0 group-hover:opacity-100 transition-opacity">
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
