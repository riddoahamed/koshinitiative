import { ArrowRight } from "lucide-react";
import { KOSH_DOWNLOAD_URL, KOSH_WAITLIST_EMAIL_URL } from "@/lib/links";
import { mailto } from "./copy";

/* ---------------- OFFER — what is free, what costs money ----------------
   A first-time visitor asks "what does it cost?" before anything else, and
   until this section the homepage never said. Facts mirror the app's current
   offer (Nov 2026). When a price changes in the app, change it here the same
   week; the courses branch keeps its own copy in src/v2/courses.ts.        */

const COURSE_LIST = "৳999";
const COURSE_FOUNDING = "৳499";

export const Offer = () => (
  <section className="sec offer paper-sec" id="offer">
    <div className="wrap">
      <p className="eyebrow" data-reveal>what it costs</p>
      <h2 className="h-display" data-reveal style={{ ["--d" as string]: "80ms" }}>
        Most of Kosh is free.
      </h2>
      <p className="h-sub" data-reveal style={{ ["--d" as string]: "150ms" }}>
        Free or paid, every course is self-paced, so you actually finish it.
        Paid ones are priced as low as we can make them.
      </p>

      <div className="offer__grid" data-stagger="110">
        <div className="offer__card glass" data-reveal="scale">
          <span className="offer__tag">Free</span>
          <ul>
            <li><b>Money basics</b> · a learning journey in the app</li>
            <li><b>Practice money</b> on real market prices</li>
            <li><b>Compare and Asset Battle</b> · Money Lab tools</li>
            <li><b>Time Machine presets</b> · Money Lab</li>
          </ul>
          <a className="offer__cta" href={KOSH_DOWNLOAD_URL}>
            Get the app <ArrowRight size={15} strokeWidth={2.2} />
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
              <b>Courses</b> on this website, Money basics included · {COURSE_LIST} each, or {COURSE_FOUNDING} if you
              have a Kosh account and{" "}
              <a href={KOSH_WAITLIST_EMAIL_URL}>joined the waitlist</a> for the
              full app with a licensed broker
            </li>
            <li>
              <b>Kosh Plus</b> · ৳99 a month, ৳594 for 6 months or ৳1,188 for
              12 months. Pay by bKash, Nagad or bank.
            </li>
            <li><b>Plus adds Money X-ray</b> and the Time Machine on any stock or date</li>
          </ul>
          <a className="offer__cta" href={mailto("Kosh Plus")}>
            Contact us to join Plus <ArrowRight size={15} strokeWidth={2.2} />
          </a>
        </div>
      </div>

      <p className="offer__help" data-reveal="fade">
        Want to learn but can&rsquo;t afford it?{" "}
        <a href={mailto("I want to learn but can't afford it")}>Email us</a>{" "}
        and we&rsquo;ll try to sort it out.
      </p>
    </div>
  </section>
);
