import { useParams } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  CirclePlay,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Sparkles,
  UsersRound,
} from "lucide-react";
import PageShell from "@/v2/PageShell";
import { mailto } from "@/v2/copy";
import "./offerings.css";

type Section = "courses" | "live" | "kids" | "workplace";

const SECTIONS: Array<{ key: Section; label: string; href: string }> = [
  { key: "courses", label: "Courses + cohorts", href: "/offerings/courses" },
  { key: "live", label: "Live rooms", href: "/offerings/live" },
  { key: "kids", label: "For kids", href: "/offerings/kids" },
  { key: "workplace", label: "For workplaces", href: "/offerings/workplace" },
];

const enrol = (name: string) => mailto(`Kosh Learn — ${name}`);

const courses = [
  {
    eyebrow: "Self-paced · 3 weeks",
    title: "Money, on purpose",
    price: "৳790 launch price",
    icon: BookOpen,
    note: "For the person who wants their money to feel less mysterious before they think about investing.",
    points: ["Spend without guesswork", "Build a buffer that actually sticks", "Understand the choices money can make"],
  },
  {
    eyebrow: "Live cohort · 4 webinars + replays",
    title: "Investing, clearly",
    price: "৳1,490 launch price",
    icon: GraduationCap,
    note: "A guided first pass through getting started, investing in US markets, crypto as a risk topic, and prediction markets.",
    points: ["Four live sessions with room for questions", "Replay access for the cohort", "A framework, not a hot-tip feed"],
  },
  {
    eyebrow: "Live series · 6 webinars + replays",
    title: "Market sense",
    price: "৳2,490 launch price",
    icon: Landmark,
    note: "For people ready to examine charts, market narratives, technical analysis and smart-money concepts with a critical eye.",
    points: ["Six live, structured sessions", "Theory, context and risk — not signals", "Replays to revisit the hard parts"],
  },
];

function Hero({ active }: { active?: Section }) {
  const label = active ? SECTIONS.find((section) => section.key === active)?.label : "Courses, live rooms + programmes";
  return (
    <section className="learn-hero">
      <div className="learn-hero__halo learn-hero__halo--one" aria-hidden="true" />
      <div className="learn-hero__halo learn-hero__halo--two" aria-hidden="true" />
      <div className="learn-hero__orbital" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="wrap learn-hero__inner">
        <p className="eyebrow" data-reveal>Kosh Learn · {label}</p>
        <h1 data-reveal style={{ ["--d" as string]: "80ms" }}>
          Get clear about money. <span className="grad-text">Then keep going.</span>
        </h1>
        <p className="learn-hero__copy" data-reveal style={{ ["--d" as string]: "150ms" }}>
          Made for curious people, not finance bros. Learn in your own time or join us live — with useful language, honest uncertainty and no pressure to act.
        </p>
        <div className="learn-hero__chips" data-reveal="scale" style={{ ["--d" as string]: "220ms" }}>
          <span><CirclePlay size={15} /> self-paced</span>
          <span><CalendarDays size={15} /> live webinars</span>
          <span><UsersRound size={15} /> people-first learning</span>
        </div>
      </div>
    </section>
  );
}

function Subnav({ active }: { active?: Section }) {
  return (
    <nav className="learn-subnav wrap" aria-label="Kosh Learn sections">
      <a href="/offerings" className={!active ? "is-active" : ""}>All offerings</a>
      {SECTIONS.map((section) => (
        <a href={section.href} className={active === section.key ? "is-active" : ""} key={section.key}>{section.label}</a>
      ))}
    </nav>
  );
}

function CourseCards() {
  return (
    <section className="learn-section" id="courses">
      <div className="wrap">
        <p className="eyebrow" data-reveal>Courses + cohorts</p>
        <h2 className="learn-title" data-reveal>Choose the depth that fits today.</h2>
        <p className="learn-intro" data-reveal>Start with your own money habits, then move into a live learning room when you want context and conversation.</p>
        <div className="course-grid" data-stagger="100">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article className="course-card" data-reveal="scale" key={course.title}>
                <div className="course-card__top"><Icon size={23} strokeWidth={1.8} /><span>{course.eyebrow}</span></div>
                <h3>{course.title}</h3>
                <p>{course.note}</p>
                <ul>{course.points.map((point) => <li key={point}><Check size={15} />{point}</li>)}</ul>
                <footer><b>{course.price}</b><a href={enrol(course.title)}>Ask to join <ArrowRight size={15} /></a></footer>
              </article>
            );
          })}
        </div>
        <p className="learn-fineprint" data-reveal>All investing material is general education — never a personal recommendation or trade call.</p>
      </div>
    </section>
  );
}

function Live() {
  return (
    <section className="learn-section" id="live">
      <div className="wrap split-layout">
        <div>
          <p className="eyebrow" data-reveal>Kosh Live Rooms</p>
          <h2 className="learn-title" data-reveal>One honest money conversation, every two weeks.</h2>
          <p className="learn-intro" data-reveal>Short, practical live webinars for the questions that tend to stay open in group chats: where to begin, how to assess a claim, and what deserves more time.</p>
          <a href={enrol("Kosh Live Rooms")} className="btn btn-primary" data-reveal>Ask about the next room <ArrowRight size={17} /></a>
        </div>
        <aside className="live-card" data-reveal="scale">
          <span className="live-card__pulse" />
          <p>Next format</p>
          <h3>Live, small, question-friendly.</h3>
          <dl><div><dt>When</dt><dd>Twice a month</dd></div><div><dt>Format</dt><dd>Live webinar + Q&A</dd></div><div><dt>Launch price</dt><dd>৳249 per room</dd></div></dl>
        </aside>
      </div>
    </section>
  );
}

function Kids() {
  return (
    <section className="learn-section kids-section" id="kids">
      <div className="wrap split-layout">
        <div>
          <p className="eyebrow" data-reveal>Kosh Money Club · ages 8–13</p>
          <h2 className="learn-title" data-reveal>Money confidence starts before money gets complicated.</h2>
          <p className="learn-intro" data-reveal>A parent-led course with short stories, small challenges and real-life conversations around earning, saving, growing, protecting, and trying an idea of your own.</p>
          <a href={enrol("Kosh Money Club")} className="btn btn-primary" data-reveal>Ask about the family pilot <ArrowRight size={17} /></a>
        </div>
        <aside className="kids-card" data-reveal="scale">
          <Sparkles size={26} /><p>Five ideas to take home</p><h3>Earn · save · grow · protect · create</h3><b>৳1,290 family pilot</b>
        </aside>
      </div>
    </section>
  );
}

function Workplace() {
  return (
    <section className="learn-section" id="workplace">
      <div className="wrap split-layout">
        <div>
          <p className="eyebrow" data-reveal>Kosh at work</p>
          <h2 className="learn-title" data-reveal>A workplace money session people will actually use.</h2>
          <p className="learn-intro" data-reveal>Practical, judgment-free sessions for teams — from spending and saving to debt, fraud awareness and the foundations of investing. Designed around the lives people are already living.</p>
          <a href={enrol("Kosh at work")} className="btn btn-primary" data-reveal>Plan a session for your team <ArrowRight size={17} /></a>
        </div>
        <aside className="work-card" data-reveal="scale"><HeartHandshake size={28} /><h3>Made for real teams.</h3><p>Offices, campuses, factory floors and communities.</p><span>In-person or live online</span></aside>
      </div>
    </section>
  );
}

function Overview() {
  return <><CourseCards /><Live /><Kids /><Workplace /></>;
}

export default function Offerings() {
  const { section: rawSection } = useParams();
  const active = SECTIONS.some((item) => item.key === rawSection) ? rawSection as Section : undefined;

  return (
    <PageShell path={active ? `/offerings/${active}` : "/offerings"} backTo="/#offerings" className="learn-page">
      <Hero active={active} />
      <Subnav active={active} />
      {!active && <Overview />}
      {active === "courses" && <CourseCards />}
      {active === "live" && <Live />}
      {active === "kids" && <Kids />}
      {active === "workplace" && <Workplace />}
    </PageShell>
  );
}
