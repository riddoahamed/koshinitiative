import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { mountPaperLight } from "./postalLight";
import "./nsu-sessions.css";

const EVENT_API = "https://uitdqikuodlrhrfjcnsz.supabase.co/functions/v1/event-rsvp";
const EVENT = "nsu-learn-investing";

export default function NSUSessions() {
  const light = useRef<HTMLCanvasElement>(null);
  const success = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState("interest");
  const [dates, setDates] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{ status: string; receipt?: string; already_listed?: boolean; email_sent?: boolean } | null>(null);
  useEffect(() => light.current ? mountPaperLight(light.current) : undefined, []);
  useEffect(() => {
    const abort = new AbortController();
    fetch(`${EVENT_API}?event=${EVENT}`, { signal: abort.signal })
      .then(async (r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => {
        if (!data?.event) throw new Error();
        setMode(data.event.status);
        if (Array.isArray(data.event.session_dates)) setDates(data.event.session_dates.map(String));
        setReady(true);
      }).catch(() => { if (!abort.signal.aborted) setError("Session details could not load. Please try the full RSVP page below."); });
    return () => abort.abort();
  }, []);
  useEffect(() => { if (result) success.current?.focus(); }, [result]);
  async function register(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!ready || busy || mode === "closed") return;
    const fields = new FormData(e.currentTarget);
    setBusy(true); setError("");
    try {
      const response = await fetch(EVENT_API, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: EVENT, name: fields.get("name"), email: fields.get("email"),
          phone: "", website: fields.get("website"), nsu_student: fields.has("nsu_student"),
          contact_consent: fields.has("contact_consent"), marketing_consent: false }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) throw new Error(data.error || "Please try again.");
      setResult(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not save your registration. Please try again."); }
    finally { setBusy(false); }
  }
  return (
    <section className="sec nsu-sessions" id="nsu-sessions" aria-labelledby="nsu-session-title">
      <canvas ref={light} className="nsu-sessions__light" aria-hidden="true" />
      <div className="wrap nsu-sessions__inner">
        <div className="nsu-sessions__topline">
          <div className="nsu-sessions__partner"><span>KOSH ×</span><img src="/img/nsu-sessions/nsusn-white.png" alt="NSU Startups Next" width="1492" height="456" loading="lazy" /></div>
          <span className="nsu-sessions__free">Free for NSU students</span>
        </div>
        <div className="nsu-sessions__grid">
          <div className="nsu-sessions__visual">
            <figure className="nsu-sessions__stamp">
              <div className="nsu-sessions__stamp-head"><span>KOSH</span><span>বাংলাদেশ</span></div>
              <img src="/img/nsu-sessions/tiger-cub-postal.webp" width="1024" height="1280" loading="lazy" decoding="async" alt="Vintage stamp-inspired painting of a Bengal tiger cub, a doel and pale pink water lilies beside a Bangladesh river" />
              <figcaption>Personal finance &amp; investing</figcaption>
            </figure>
          </div>
          <div className="nsu-sessions__copy">
            <p className="nsu-sessions__eyebrow">Financial Wellness Sessions</p>
            <h2 id="nsu-session-title">Learn investing<span>.</span></h2>
            <p className="nsu-sessions__intro">Personal finance and investing, explained from zero.<br />Bring your questions. We’ll work through them together.</p>
            <div className="nsu-sessions__facts"><span>3 days</span><span>1 hour a day</span><span>Live Q&amp;A</span></div>
            <div className="nsu-sessions__registration">
              {result ? <div ref={success} tabIndex={-1} className="nsu-sessions__success" role="status">
                <h3>{result.status === "registered" ? "Your RSVP is registered." : result.status === "waitlisted" ? "You’re on the waiting list." : "You’re on the interest list."}</h3>
                <p>{result.already_listed ? "We’ve kept your existing registration for this email." : result.status === "interested" ? "We’ll email you when the schedule is confirmed. This isn’t a confirmed seat yet." : result.status === "waitlisted" ? "We’ll contact you if a place becomes available." : "Save your reference and the session details."}</p>
                {result.receipt && <p className="nsu-sessions__reference">{result.receipt}</p>}
                <p>{result.email_sent ? "Check your inbox and spam folder for the Kosh email." : "Your details are saved. Keep your reference for later."}</p>
                <a href="https://app.koshbd.com/auth?signup=1">Explore Kosh while you wait <ArrowRight size={16} aria-hidden="true" /></a>
              </div> : <>
                <h3>{mode === "open" ? "Register for the sessions" : mode === "closed" ? "This session list is closed" : "Join the interest list"}</h3>
                <p className="nsu-sessions__schedule">{dates.length ? dates.join(" · ") : "Dates, time and room to be announced. Joining the list doesn’t reserve a seat."}</p>
                {mode !== "closed" && <form onSubmit={register}>
                  <div className="nsu-sessions__fields">
                    <label>Your name<input name="name" autoComplete="name" minLength={2} maxLength={100} required /></label>
                    <label>Email address<input name="email" type="email" autoComplete="email" maxLength={254} required /></label>
                  </div>
                  <div className="nsu-sessions__honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
                  <label className="nsu-sessions__check"><input name="nsu_student" type="checkbox" required /><span>I’m an NSU student.</span></label>
                  <label className="nsu-sessions__check"><input name="contact_consent" type="checkbox" required /><span>Kosh may email me about these sessions and their schedule.</span></label>
                  <button className="nsu-sessions__cta" disabled={!ready || busy} type="submit">{busy ? "Registering…" : ready ? "Register" : "Loading sessions…"}<ArrowRight size={18} aria-hidden="true" /></button>
                  <p className="nsu-sessions__privacy">For session updates only. To update or remove your details, email <a href="mailto:hello@koshbd.com">hello@koshbd.com</a>.</p>
                </form>}
              </>}
              {error && <p className="nsu-sessions__error" role="alert">{error}</p>}
              <a className="nsu-sessions__details" href="/rsvp">Full session details <ArrowRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
        </div>
        <div className="nsu-sessions__topics"><span><b>01</b> Your money first</span><span><b>02</b> Know your investment options</span><span><b>03</b> Company analysis &amp; risk</span></div>
      </div>
    </section>
  );
}
