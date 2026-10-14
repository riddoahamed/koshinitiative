import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import "./nsu-sessions.css";

const EVENT_API = "https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/event-rsvp?event=nsu-learn-investing";

export default function NSUSessions() {
  const [mode, setMode] = useState("interest");
  const [dates, setDates] = useState<string[]>([]);
  useEffect(() => {
    const abort = new AbortController();
    fetch(EVENT_API, { signal: abort.signal })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (!data?.event) return;
        setMode(data.event.status);
        if (Array.isArray(data.event.session_dates)) setDates(data.event.session_dates.map(String));
      }).catch(() => {});
    return () => abort.abort();
  }, []);
  const cta = mode === "open" ? "RSVP for the sessions" : mode === "closed" ? "See session details" : "Join the interest list";
  return (
    <section className="sec nsu-sessions" id="nsu-sessions" aria-labelledby="nsu-session-title">
      <div className="wrap nsu-sessions__grid">
        <div className="nsu-sessions__copy">
          <div className="nsu-sessions__partner"><span>KOSH ×</span><img src="/img/nsu-sessions/nsusn-white.png" alt="NSU Startups Next" width="1492" height="456" loading="lazy" /></div>
          <p className="nsu-sessions__eyebrow">Financial Wellness Sessions</p>
          <h2 id="nsu-session-title">Learn investing.<br /><span>Ask your questions.</span></h2>
          <p className="nsu-sessions__intro">Personal finance and investing, explained from zero. Three days of learning and live Q&amp;A, free for NSU students.</p>
          <div className="nsu-sessions__facts"><span>3 days</span><span>1 hour a day</span><span>Beginners welcome</span></div>
          <p className="nsu-sessions__schedule">{dates.length ? dates.join(" · ") : "Dates, time and room are being confirmed. Joining the interest list does not reserve a seat."}</p>
          <a className="nsu-sessions__cta" href="/rsvp">{cta} <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="nsu-sessions__visual"><img src="/img/nsu-sessions/tiger-learning-art.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Painted Bengal tiger rising from an open book, with shapla and a mangrove river landscape" /></div>
      </div>
    </section>
  );
}
