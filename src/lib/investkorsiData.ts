/* ── InvestKorsi, read-only, on the marketing site ───────────────────────────

   Deliberately plain `fetch` against PostgREST rather than @supabase/supabase-js.
   Two reasons, and the first one is the important one:

   1. InvestKorsi's whole promise is that a report cannot be traced to a person.
      The app has to keep a SEPARATE Supabase client for this feature
      (`supabasePublic`, built with `accessToken: async () => null`) because the
      ordinary client would attach a signed-in user's JWT to an "anonymous"
      read. A bare fetch cannot attach a session it does not have. There is no
      auth on this site to leak, and now there is no way for one to appear
      later either.

   2. It is three GETs. A client library is 40kB to avoid writing them.

   COLUMNS ARE ENUMERATED, NEVER `*`. The migration revokes table-level SELECT on
   ik_reports and grants a column list instead, specifically so `anon_key` cannot
   be pulled — it is a join key that would group one device's reports together
   and undo the anonymity. `select=*` is refused outright with 42501. If a column
   is added upstream it has to be added to the grant list AND here. */

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const investkorsiReady = Boolean(URL_BASE && KEY);

async function get<T>(path: string): Promise<T[]> {
  if (!investkorsiReady) return [];
  try {
    const res = await fetch(`${URL_BASE}/rest/v1/${path}`, {
      headers: { apikey: KEY as string, Authorization: `Bearer ${KEY}` },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? (json as T[]) : [];
  } catch {
    /* offline, blocked, DNS — the page still has to render its CTAs */
    return [];
  }
}

export interface Totals {
  reports: number;
  platforms: number;
  /** Sum of amounts on reports whose sentiment is "bad". */
  amountBad: number;
  /** How many reports carried a figure at all. Most do not. */
  amountBadReports: number;
}

export interface Issue {
  slug: string;
  label: string;
  /** The coarse bucket — withdrawal, returns, principal, communication, fees,
      paperwork, pressure, none, other. The rollup a reader sees before the
      specific categories under it. */
  family: string;
  reportCount: number;
}

export interface PlatformRow {
  id: string;
  slug: string;
  name: string;
  domain: string | null;
  kind: string;
  reports: number;
  good: number;
  mixed: number;
  bad: number;
  /** Sum of amounts on this platform's BAD reports only. Never amount_total —
      see fetchTotals for why that distinction is not cosmetic. */
  amountBad: number;
  amountBadReports: number;
}

/** One asset class, counted across every report on the site. */
export interface ClassRow {
  key: string;
  label: string;
  reports: number;
  bad: number;
  amountBad: number;
}

export const EMPTY_TOTALS: Totals = {
  reports: 0,
  platforms: 0,
  amountBad: 0,
  amountBadReports: 0,
};

export async function fetchTotals(): Promise<Totals> {
  const rows = await get<Record<string, unknown>>("ik_totals?select=*");
  const t = rows[0];
  if (!t) return EMPTY_TOTALS;
  return {
    reports: Number(t.reports ?? 0),
    platforms: Number(t.platforms ?? 0),
    // NOT amount_total. That figure includes money that came back perfectly
    // fine, and calling it "stuck" would be defamatory rather than merely
    // wrong. Only the sum over sentiment='bad' may carry that word.
    amountBad: Number(t.amount_bad ?? 0),
    amountBadReports: Number(t.amount_bad_reports ?? 0),
  };
}

export async function fetchIssues(): Promise<Issue[]> {
  const rows = await get<Record<string, unknown>>(
    // NOT filtered on `merged_into`. A category merged away by
    // investkorsi-converge has its links moved and its `report_count` zeroed,
    // and this page already drops zero-count rows — so tombstones are invisible
    // without naming the column. Naming it would couple this deploy to the
    // migration landing first: PostgREST answers a filter on a missing column
    // with 42703, `get()` returns [], and the issues section would silently
    // disappear until someone ran `supabase db push`. Verified against
    // production. See 20260823160000_investkorsi_issue_taxonomy.sql.
    "ik_issues?select=slug,label,family,report_count&order=report_count.desc",
  );
  return rows.map((i) => ({
    slug: String(i.slug),
    label: String(i.label),
    family: String(i.family ?? "other"),
    reportCount: Number(i.report_count ?? 0),
  }));
}

/** The wall: every live platform, with its report counts folded in. */
export async function fetchWall(): Promise<PlatformRow[]> {
  const [platforms, stats] = await Promise.all([
    get<Record<string, unknown>>(
      "ik_platforms?select=id,slug,name,domain,kind,source&status=eq.live&order=name.asc",
    ),
    get<Record<string, unknown>>("ik_platform_stats?select=*"),
  ]);

  const byId = new Map(stats.map((s) => [String(s.platform_id), s]));

  return platforms.map((p) => {
    const s = byId.get(String(p.id));
    return {
      id: String(p.id),
      slug: String(p.slug),
      name: String(p.name),
      domain: (p.domain as string | null) ?? null,
      kind: String(p.kind ?? "other"),
      reports: Number(s?.reports ?? 0),
      good: Number(s?.good ?? 0),
      mixed: Number(s?.mixed ?? 0),
      bad: Number(s?.bad ?? 0),
      amountBad: Number(s?.amount_bad ?? 0),
      amountBadReports: Number(s?.amount_bad_reports ?? 0),
    };
  });
}

/* ── The asset-class ledger ──────────────────────────────────────────────────

   "Which platforms go wrong" is one question and the site already answered it.
   "Which KINDS OF INVESTMENT go wrong" is the more useful one for a stranger,
   because they can act on it before they have picked a company — and it is the
   question the report form's asset-class step was collecting an answer to
   without anything ever displaying it.

   Aggregated in the browser from the report rows rather than from a view. Two
   reasons: it needs no migration, and `product_kind` is already in the column
   grant, so nothing about the privacy boundary changes. The read is capped —
   at the volumes this page will see for a long while it is a few kilobytes,
   and if it ever stops being that, the fix is a view, not a bigger cap. */

const CLASS_LABELS: Record<string, string> = {
  alternative: "Projects (farm, SME)",
  funds: "Mutual funds",
  dse: "Shares",
  savings: "FDR / DPS / savings",
  gold: "Gold",
  real_estate: "Land or property",
  govt: "Sanchayapatra / bonds",
  halal: "Shariah products",
  global: "Abroad",
  other: "Something else",
};

export async function fetchClasses(): Promise<ClassRow[]> {
  const rows = await get<Record<string, unknown>>(
    "ik_reports?select=product_kind,sentiment,amount_bdt&status=eq.live&limit=5000",
  );

  const acc = new Map<string, ClassRow>();
  for (const r of rows) {
    // A report that skipped the question is NOT an "other" — it is an absence,
    // and folding it into a named bucket would invent an answer nobody gave.
    const key = r.product_kind ? String(r.product_kind) : null;
    if (!key) continue;
    const cur = acc.get(key) ?? {
      key,
      label: CLASS_LABELS[key] ?? key.replace(/_/g, " "),
      reports: 0,
      bad: 0,
      amountBad: 0,
    };
    cur.reports += 1;
    if (r.sentiment === "bad") {
      cur.bad += 1;
      cur.amountBad += Number(r.amount_bdt ?? 0);
    }
    acc.set(key, cur);
  }
  return [...acc.values()].sort((a, b) => b.reports - a.reports);
}

/** ৳ figures the way Bangladeshi readers actually say them. */
export function taka(n: number): string {
  if (n >= 10_000_000) return `৳${(n / 10_000_000).toFixed(n % 10_000_000 === 0 ? 0 : 1)} crore`;
  if (n >= 100_000) return `৳${(n / 100_000).toFixed(n % 100_000 === 0 ? 0 : 1)} lakh`;
  if (n >= 1_000) return `৳${(n / 1_000).toFixed(0)}k`;
  return `৳${n}`;
}
