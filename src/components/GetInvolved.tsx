import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const columns = [
  {
    heading: "Host a workshop",
    description:
      "Bring a Kosh financial literacy session to your students. We handle the content and delivery. You provide the room and help us reach your students.",
    cta: "Request a session",
    href: "#contact",
    variant: "solid" as const,
  },
  {
    heading: "Run a wellness session",
    description:
      "Give your team a practical financial wellness session. Cover budgeting, saving, and investing in a format that fits a lunch break or half-day offsite.",
    cta: "Get in touch",
    href: "#contact",
    variant: "solid" as const,
  },
  {
    heading: "Stay connected",
    description:
      "Follow what Kosh is building. Get updates on workshops, content, and how to get involved as a volunteer, ambassador, or community member.",
    cta: "Follow along",
    href: "https://instagram.com/kosh.initiative",
    variant: "outline" as const,
  },
];

const labels = ["For universities", "For companies", "For everyone"];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
};

const GetInvolved = () => {
  const ref = useScrollAnimation();

  return (
    <section className="bg-kosh-offwhite py-20 md:py-28 px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-kosh-mint mb-4">
          Get involved
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-kosh-dark mb-14 max-w-2xl">
          Whether you are a student, a company, or a university — there is a place for you here.
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {columns.map((col, i) => (
            <motion.div
              key={col.heading}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="flex flex-col"
            >
              <p className="text-xs font-sans font-semibold uppercase tracking-[0.15em] text-kosh-muted mb-3">
                {labels[i]}
              </p>
              <h3 className="font-serif text-xl text-kosh-dark mb-3">{col.heading}</h3>
              <p className="text-kosh-muted text-sm leading-relaxed flex-1">{col.description}</p>
              <a
                href={col.href}
                target={col.href.startsWith("http") ? "_blank" : undefined}
                rel={col.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`mt-6 inline-flex items-center justify-center px-6 py-3 rounded-md font-sans font-medium text-sm transition-opacity hover:opacity-90 self-start ${
                  col.variant === "solid"
                    ? "bg-kosh-teal text-white"
                    : "border border-kosh-teal text-kosh-teal"
                }`}
              >
                {col.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetInvolved;
