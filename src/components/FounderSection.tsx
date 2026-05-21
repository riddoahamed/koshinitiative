import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import founderHero from "@/assets/founder/founder-hero.webp";
import roleFounder from "@/assets/founder/role-founder.webp";
import roleProduct from "@/assets/founder/role-product.webp";
import roleDeveloper from "@/assets/founder/role-developer.webp";
import roleMarketing from "@/assets/founder/role-marketing.webp";
import roleContent from "@/assets/founder/role-content.webp";
import roleFeedback from "@/assets/founder/role-feedback.webp";
import roleOperations from "@/assets/founder/role-operations.webp";
import roleWorkshops from "@/assets/founder/role-workshops.webp";

const roleChips = ["Product", "Content", "Workshops", "Partnerships", "Feedback", "Operations"];

const roles = [
  {
    title: "Founder",
    copy: "Sets the direction. Occasionally argues with the direction.",
    image: roleFounder,
    alt: "Sheikh Sajid Ahamed as the founder of Kosh",
  },
  {
    title: "Product",
    copy: "Turns messy ideas into slightly less messy screens.",
    image: roleProduct,
    alt: "Sheikh Sajid Ahamed working on Kosh product planning",
  },
  {
    title: "Developer",
    copy: "Ships with AI and controlled panic.",
    image: roleDeveloper,
    alt: "Sheikh Sajid Ahamed working on development for Kosh",
  },
  {
    title: "Marketing",
    copy: "Makes people care enough to click.",
    image: roleMarketing,
    alt: "Sheikh Sajid Ahamed with Kosh brand materials",
  },
  {
    title: "Content",
    copy: "Explains money without sounding like a bank brochure.",
    image: roleContent,
    alt: "Sheikh Sajid Ahamed working on Kosh content",
  },
  {
    title: "Feedback",
    copy: "Listens before building things nobody asked for.",
    image: roleFeedback,
    alt: "Sheikh Sajid Ahamed reviewing Kosh product feedback",
  },
  {
    title: "Operations",
    copy: "Keeps the moving parts from becoming flying parts.",
    image: roleOperations,
    alt: "Sheikh Sajid Ahamed managing Kosh operations",
  },
  {
    title: "Workshops",
    copy: "Takes Kosh out of the screen and into actual rooms.",
    image: roleWorkshops,
    alt: "Sheikh Sajid Ahamed preparing to host Kosh workshops",
  },
];

const filmStripRoles = [...roles, ...roles];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

const RoleImage = ({ image, alt, title }: { image?: string; alt: string; title: string }) => {
  if (!image) {
    return (
      <div className="flex h-full items-end rounded-2xl bg-[radial-gradient(circle_at_top_right,rgba(0,194,178,0.18),transparent_42%),linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
        <span className="font-signal text-xs font-semibold uppercase tracking-[0.18em] text-kosh-lime">
          {title}
        </span>
      </div>
    );
  }

  return (
    <img
      src={image}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
    />
  );
};

const FounderSection = () => {
  const ref = useScrollAnimation();

  return (
    <section
      className="relative overflow-hidden bg-[#0E1133] px-6 py-16 md:px-12 md:py-[92px] lg:px-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(42,43,217,0.35),transparent_45%)]" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-[420px] w-[420px] rounded-full bg-[#00C2B2]/10 blur-[140px]" />
      <div className="pointer-events-none absolute right-8 top-20 h-px w-1/3 bg-gradient-to-r from-transparent via-[#B7FF5E]/40 to-transparent" />

      <div ref={ref} className="relative mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div className="contents lg:block">
            <div className="order-1">
              <p className="mb-4 font-signal text-xs font-semibold uppercase tracking-[0.2em] text-[#00C2B2]">
                Founder-led, for now
              </p>
              <h2 className="max-w-3xl font-serif text-4xl font-extrabold tracking-tight text-[#F6F7FA] md:text-5xl lg:text-6xl">
                The person currently wearing every hat.
              </h2>
              <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-[#9AA3B2] md:text-lg">
                Kosh is still early, so the "team" is currently one founder switching between
                product, content, workshops, partnerships, feedback, operations, and the occasional
                late-night "why did this work yesterday?" moment.
              </p>
            </div>

            <div className="order-3 mt-7 flex flex-wrap gap-2 lg:order-none">
              {roleChips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1.5 font-signal text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F6F7FA]/78"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="order-4 mt-9 lg:order-none">
              <p className="font-serif text-2xl font-bold text-[#F6F7FA] md:text-3xl">
                Sheikh Sajid Ahamed (Riddo)
              </p>
              <p className="mt-2 font-signal text-xs font-semibold uppercase tracking-[0.18em] text-[#B7FF5E]">
                Founder, Kosh
              </p>
              <a
                href="https://www.linkedin.com/in/sheikhsajid-riddo/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex font-signal text-[11px] font-semibold uppercase tracking-[0.16em] text-[#00C2B2] transition-colors hover:text-[#B7FF5E]"
              >
                Connect with the founder →
              </a>
              <p className="mt-4 max-w-xl font-signal text-[11px] font-semibold uppercase leading-relaxed tracking-[0.16em] text-[#F6F7FA]/42">
                Yes, the dry part is intentional.
              </p>
              <p className="mt-5 max-w-xl font-sans text-sm leading-relaxed text-[#9AA3B2] md:text-base">
                Building Kosh for Bangladeshis who were never really taught how money works, and
                probably learned more from mistakes, relatives, and suspicious Facebook advice than
                from school.
              </p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="relative order-2 lg:order-none"
          >
            <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-[radial-gradient(circle_at_80%_10%,rgba(183,255,94,0.18),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(0,194,178,0.16),transparent_42%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-white/[0.04] shadow-[0_34px_110px_-48px_rgba(0,0,0,0.95)]">
              <img
                src={founderHero}
                alt="Sheikh Sajid Ahamed, founder of Kosh"
                loading="lazy"
                className="aspect-[4/5] max-h-[660px] w-full object-cover object-[50%_22%]"
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0E1133]/78 to-transparent" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.55, delay: 0.18 }}
          className="mt-12 md:mt-16"
        >
          <div className="mb-5 flex items-end justify-between gap-4">
            <p className="font-signal text-xs font-semibold uppercase tracking-[0.2em] text-[#9AA3B2]">
              Current hats, in rotation
            </p>
            <p className="hidden font-signal text-[11px] uppercase tracking-[0.18em] text-[#9AA3B2]/60 md:block">
              Hover to pause · drag if needed
            </p>
          </div>

          <div className="founder-film-mask -mx-6 overflow-hidden md:-mx-12 lg:-mx-24">
            <div className="founder-film-strip relative overflow-x-auto py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="founder-film-track flex w-max gap-4 px-6 md:px-12 lg:px-24">
                {filmStripRoles.map((role, index) => (
                  <article
                    key={`${role.title}-${index}`}
                    aria-hidden={index >= roles.length}
                    className="group relative flex w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_-54px_rgba(0,0,0,0.95)] transition-all duration-300 hover:-translate-y-1 hover:border-[#00C2B2]/50 md:w-[310px]"
                  >
                    <div className="h-[314px] overflow-hidden md:h-[350px]">
                      <RoleImage image={role.image} alt={role.alt} title={role.title} />
                    </div>
                    <div className="border-t border-white/10 bg-[#080A20]/92 p-5">
                      <p className="font-signal text-[11px] font-semibold uppercase tracking-[0.18em] text-[#B7FF5E]">
                        {role.title}
                      </p>
                      <p className="mt-2 font-sans text-sm leading-relaxed text-[#F6F7FA]/74">
                        {role.copy}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FounderSection;
