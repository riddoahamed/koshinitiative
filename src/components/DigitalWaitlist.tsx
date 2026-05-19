import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import appHome from "@/assets/brand/app-home.jpg";
import appTools from "@/assets/brand/app-tools.jpg";
import appExplainers from "@/assets/brand/app-explainers.jpg";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";

const appHighlights = [
  "Money level check",
  "Bangladesh-specific tools",
  "Short explainers and comparisons",
];

const cardDeck = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const cardReveal = (rotation: number, xStart: number, yStart: number, delay = 0) => ({
  hidden: {
    opacity: 0,
    x: xStart,
    y: yStart,
    rotate: rotation + 18,
    scale: 0.78,
    filter: "blur(16px)",
  },
  visible: {
    opacity: 1,
    x: [xStart, Math.round(xStart * 0.42), 0],
    y: [yStart, -22, 0],
    rotate: [rotation + 18, rotation - Math.sign(rotation || 1) * 6, rotation],
    scale: [0.78, 1.055, 1],
    filter: ["blur(16px)", "blur(3px)", "blur(0px)"],
    transition: {
      duration: 1.12,
      delay,
      ease: [0.16, 1, 0.3, 1],
    },
  },
});

const leftCard = cardReveal(-12, 360, 170, 0);
const centerCard = cardReveal(0, 330, 92, 0.08);
const rightCard = cardReveal(12, 300, 170, 0.16);

const DigitalWaitlist = () => {
  const ref = useScrollAnimation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative bg-kosh-dark py-20 md:py-28 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-accent/12 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full bg-primary/14 blur-[140px]" />

      <div ref={ref} className="relative max-w-7xl mx-auto grid gap-12 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div>
          <p className="text-xs font-sans font-semibold uppercase tracking-[0.2em] mb-4 text-kosh-mint">
            Kosh app
          </p>
          <h2 className="font-serif text-3xl md:text-5xl text-kosh-offwhite mb-5 tracking-tight">
            A financial literacy product, not another content page.
          </h2>
          <p className="text-white/60 text-base md:text-lg leading-relaxed mb-8 max-w-xl font-sans">
            The app turns money education into a guided path: checks, tools, explainers, levels,
            and small actions people can actually come back to.
          </p>

          <div className="space-y-3 mb-9">
            {appHighlights.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-sans text-kosh-offwhite/85">
                <CheckCircle2 className="h-4 w-4 text-kosh-mint" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={KOSH_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-kosh-lime/50 bg-gradient-to-r from-kosh-lime to-kosh-mint px-6 py-3.5 text-sm font-sans font-semibold text-[#071210] shadow-[0_0_28px_-10px_hsl(var(--kosh-lime)/0.9)] transition-all hover:brightness-110"
            >
              Open app.koshbd.com
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={KOSH_WAITLIST_EMAIL_URL}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-kosh-lime/30 px-6 py-3.5 text-sm font-sans font-semibold text-kosh-lime transition-colors hover:border-kosh-lime/70 hover:bg-kosh-lime/10"
            >
              Join full app waitlist
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>

          <p className="mt-5 max-w-lg font-signal text-[11px] font-semibold uppercase leading-relaxed tracking-[0.15em] text-kosh-muted/80">
            No products. No commissions. No hidden agenda. Just education built around the
            money decisions Bangladeshis actually face.
          </p>
        </div>

        <motion.div
          className="relative min-h-[540px] origin-[88%_48%] perspective-[1200px] md:min-h-[620px] lg:min-h-[660px]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.26, margin: "-80px" }}
          variants={cardDeck}
        >
          <motion.div
            className="absolute left-1/2 top-16 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-kosh-lime/14 blur-[120px]"
            initial={{ opacity: 0, scale: 0.82 }}
            whileInView={prefersReducedMotion ? { opacity: 0.45, scale: 1 } : { opacity: [0, 0.5, 0.34], scale: [0.82, 1.08, 1] }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.6, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-28 z-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full border border-kosh-lime/10"
            initial={{ opacity: 0, scale: 0.66 }}
            whileInView={prefersReducedMotion ? { opacity: 0.12, scale: 1 } : { opacity: [0, 0.22, 0.08], scale: [0.66, 1.04, 1] }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="relative mx-auto h-[540px] max-w-[760px] md:h-[620px] lg:h-[660px]">
            <div className="absolute left-[2%] top-[168px] z-20 w-[33%] max-w-[245px] min-w-[170px] origin-bottom">
              <motion.div variants={leftCard} className="origin-bottom">
                <motion.img
                  src={appTools}
                  alt="Kosh app tools screen"
                  className="w-full rounded-[1.45rem] border border-kosh-lime/18 opacity-[0.9] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)]"
                  animate={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: [0, 10, 0],
                          boxShadow: [
                            "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 0 rgba(184,255,70,0)",
                            "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 34px rgba(184,255,70,0.16)",
                            "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 0 rgba(184,255,70,0)",
                          ],
                        }
                  }
                  transition={{ duration: 6.3, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
                />
              </motion.div>
            </div>

            <div className="absolute left-1/2 top-2 z-30 w-[40%] max-w-[315px] min-w-[210px] -translate-x-1/2 origin-bottom">
              <motion.div variants={centerCard} className="origin-bottom">
              <motion.img
                src={appHome}
                alt="Kosh app home screen with money level check"
                className="w-full rounded-[1.8rem] border border-kosh-lime/20 shadow-[0_30px_100px_-28px_rgba(0,0,0,0.9)]"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: [0, -10, 0],
                        boxShadow: [
                          "0 30px 100px -28px rgba(0,0,0,0.9), 0 0 0 rgba(184,255,70,0)",
                          "0 30px 100px -28px rgba(0,0,0,0.9), 0 0 38px rgba(184,255,70,0.18)",
                          "0 30px 100px -28px rgba(0,0,0,0.9), 0 0 0 rgba(184,255,70,0)",
                        ],
                      }
                }
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.35 }}
              />
              </motion.div>
            </div>

            <div className="absolute right-[2%] top-[168px] z-20 w-[33%] max-w-[245px] min-w-[170px] origin-bottom">
              <motion.div variants={rightCard} className="origin-bottom">
              <motion.img
                src={appExplainers}
                alt="Kosh app explainers screen"
                className="w-full rounded-[1.45rem] border border-kosh-lime/18 opacity-[0.9] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.85)]"
                animate={
                  prefersReducedMotion
                    ? undefined
                    : {
                        y: [0, -14, 0],
                        boxShadow: [
                          "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 0 rgba(184,255,70,0)",
                          "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 34px rgba(184,255,70,0.16)",
                          "0 24px 80px -30px rgba(0,0,0,0.85), 0 0 0 rgba(184,255,70,0)",
                        ],
                      }
                }
                transition={{ duration: 6.8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DigitalWaitlist;
