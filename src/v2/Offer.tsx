import { ArrowRight } from "lucide-react";
import { KOSH_APP_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
import { mailto } from "./copy";

/* ---------------- OFFER — what is free, what costs money ----------------
   A first-time visitor asks "what does it cost?" before anything else, and
   until this section the homepage never said. Facts mirror the app's current
   offer (Nov 2026). When a price changes in the app, change it here the same
   week; the courses branch keeps its own copy in src/v2/courses.ts.        */

/* Course prices live on the courses page, not here: on the homepage the
   message is that learning is free; the paid courses are a specialised
   extra for people who want them. */
const COURSES_URL = "/bd/offerings/courses";

export const Offer = () => (
  <section className="sec offer paper-sec" id="offer">
    <div className="wrap">
      <p className="eyebrow" data-reveal>what it costs</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Learning on Kosh is <span className="grad-text">free.</span>
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        The whole learning path, the practice account and the games cost
        nothing. For people who want to go deeper, we run specialised courses
        and programmes.
      </p>

      <div className="offer__grid" data-stagger="110">
        <div className="offer__card glass" data-reveal="scale">
          <span className="offer__tag">Free</span>
          <ul>
            <li><b>The learning path</b> · 10 units, 61 lessons</li>
            <li><b>৳10,00,000 to practise with</b> on real, live prices</li>
            <li><b>Tools</b> · fund screener, FDR and SIP calculators</li>
            <li><b>Money Lab</b> · Compare, Asset Battle and Time Machine presets, coming soon</li>
          </ul>
          <a className="offer__cta" href={KOSH_APP_URL}>
            Open the app free <ArrowRight size={15} strokeWidth={2.2} />
          </a>
        </div>

        <div className="offer__card glass" data-reveal="scale">
          <span className="offer__tag">Coming soon</span>
          <ul>
            <li><b>Verified investors</b> · real people, portfolios we check. We&rsquo;re onboarding the first ones now.</li>
          </ul>
          <a className="offer__cta" href={KOSH_WAITLIST_EMAIL_URL}>
            Join the waitlist <ArrowRight size={15} strokeWidth={2.2} />
          </a>
        </div>

        <div className="offer__card glass" data-reveal="scale">
          <span className="offer__tag offer__tag--paid">Paid</span>
          <ul>
            <li>
              <b>Specialised courses and programmes</b> · self-paced, for when
              you want to go deeper.{" "}
              <a href={COURSES_URL}>See courses</a>
            </li>
            <li>
              <b>Kosh Plus</b> · ৳99 a month, ৳594 for 6 months or ৳1,188 for
              12 months. Pay by bKash, Nagad or bank.
            </li>
            <li><b>Coming to Plus:</b> Money X-ray and the Time Machine on any stock or date</li>
          </ul>
          <a className="offer__cta" href={mailto("Kosh Plus")}>
            Contact us to join Plus <ArrowRight size={15} strokeWidth={2.2} />
          </a>
        </div>
      </div>

      <p className="offer__help" data-reveal="fade">
        Want a course but can&rsquo;t afford it?{" "}
        <a href={mailto("I want a course but can't afford it")}>Email us</a>{" "}
        and we&rsquo;ll try to sort it out.
      </p>
    </div>
  </section>
);
