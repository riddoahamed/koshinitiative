import { useState, useMemo } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

function formatBDT(n: number) {
  return "৳" + Math.round(n).toLocaleString("en-BD");
}

const CompoundInterestCalc = () => {
  const [initial, setInitial] = useState(10000);
  const [monthly, setMonthly] = useState(1000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const futureInitial = initial * Math.pow(1 + r, n);
    const futureSeries = monthly * ((Math.pow(1 + r, n) - 1) / r);
    const finalValue = futureInitial + futureSeries;
    const totalContributed = initial + monthly * n;
    const interestEarned = finalValue - totalContributed;
    return { finalValue, totalContributed, interestEarned };
  }, [initial, monthly, rate, years]);

  const maxBar = Math.max(result.totalContributed, result.interestEarned, 1);

  return (
    <div className="rounded-lg border border-kosh-teal/30 bg-white/95 p-6 md:p-8 backdrop-blur-sm">
      <h3 className="font-serif text-2xl text-kosh-dark mb-1">Compound Interest Calculator</h3>
      <p className="text-kosh-muted text-sm mb-6 font-sans">See how your money grows over time.</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Initial Amount (BDT)", value: initial, set: setInitial, min: 0, max: 10000000, step: 1000 },
          { label: "Monthly Contribution (BDT)", value: monthly, set: setMonthly, min: 0, max: 500000, step: 500 },
          { label: "Annual Interest Rate (%)", value: rate, set: setRate, min: 0, max: 30, step: 0.5 },
          { label: "Years", value: years, set: setYears, min: 1, max: 50, step: 1 },
        ].map((f) => (
          <label key={f.label} className="flex flex-col gap-1">
            <span className="text-xs font-mono text-kosh-muted">{f.label}</span>
            <input
              type="number"
              value={f.value}
              min={f.min}
              max={f.max}
              step={f.step}
              onChange={(e) => f.set(Number(e.target.value))}
              className="rounded border border-kosh-teal/20 bg-kosh-offwhite px-3 py-2 text-sm font-sans text-kosh-dark focus:outline-none focus:ring-1 focus:ring-kosh-mint"
            />
          </label>
        ))}
      </div>

      <div className="rounded-md bg-kosh-dark/5 p-4 mb-5">
        <div className="flex justify-between text-sm font-sans mb-1">
          <span className="text-kosh-muted">Final Value</span>
          <span className="font-semibold text-kosh-dark">{formatBDT(result.finalValue)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans mb-1">
          <span className="text-kosh-muted">Total Contributed</span>
          <span className="text-kosh-dark">{formatBDT(result.totalContributed)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans">
          <span className="text-kosh-muted">Interest Earned</span>
          <span className="text-kosh-mint font-semibold">{formatBDT(result.interestEarned)}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-mono text-kosh-muted mb-1">
            <span>Your Money</span>
            <span>{formatBDT(result.totalContributed)}</span>
          </div>
          <div className="h-5 rounded-full bg-kosh-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-kosh-teal transition-all duration-500"
              style={{ width: `${(result.totalContributed / maxBar) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-mono text-kosh-muted mb-1">
            <span>Interest Earned</span>
            <span>{formatBDT(result.interestEarned)}</span>
          </div>
          <div className="h-5 rounded-full bg-kosh-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-kosh-mint transition-all duration-500"
              style={{ width: `${(Math.max(0, result.interestEarned) / maxBar) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Investment assets with approximate avg annual returns (BDT context)
const ASSETS = [
  { id: "dsex", label: "DSEX (Stocks)", avgReturn: 8.5, note: "~8-9% avg (DSEX, last 10yr adjusted)", color: "#06776E" },
  { id: "gold", label: "Gold", avgReturn: 11, note: "~11% avg in BDT terms (last 20yr)", color: "#D4A843" },
  { id: "btc", label: "Bitcoin", avgReturn: 65, note: "~65% avg (last 10yr, extremely volatile)", color: "#F7931A" },
  { id: "sanchayapatra", label: "Sanchayapatra", avgReturn: 11.04, note: "~11% fixed (5yr Bangladesh Sanchayapatra)", color: "#2E7D32" },
  { id: "fdr", label: "Bank FDR", avgReturn: 7, note: "~6-8% avg (BD bank fixed deposits)", color: "#5C6BC0" },
  { id: "realestate", label: "Real Estate (Dhaka)", avgReturn: 7, note: "~6-8% avg appreciation (Dhaka, last 15yr)", color: "#8D6E63" },
  { id: "mutualfund", label: "Mutual Fund / SIP", avgReturn: 10, note: "~9-11% avg (BD equity mutual funds)", color: "#02C39A" },
];

const InvestmentComparator = () => {
  const [assetA, setAssetA] = useState("gold");
  const [assetB, setAssetB] = useState("dsex");
  const [amount, setAmount] = useState(50000);
  const [years, setYears] = useState(10);
  const [customReturnA, setCustomReturnA] = useState<number | null>(null);
  const [customReturnB, setCustomReturnB] = useState<number | null>(null);

  const a = ASSETS.find((x) => x.id === assetA)!;
  const b = ASSETS.find((x) => x.id === assetB)!;

  const returnA = customReturnA ?? a.avgReturn;
  const returnB = customReturnB ?? b.avgReturn;

  const result = useMemo(() => {
    const futureA = amount * Math.pow(1 + returnA / 100, years);
    const futureB = amount * Math.pow(1 + returnB / 100, years);
    return { futureA, futureB };
  }, [amount, returnA, returnB, years]);

  const maxVal = Math.max(result.futureA, result.futureB, 1);
  const winner = result.futureA > result.futureB ? a : b;
  const diff = Math.abs(result.futureA - result.futureB);

  const inputCls =
    "rounded border border-kosh-teal/20 bg-kosh-offwhite px-3 py-2 text-sm font-sans text-kosh-dark focus:outline-none focus:ring-1 focus:ring-kosh-mint w-full";

  return (
    <div className="rounded-lg border border-kosh-teal/30 bg-white/95 p-6 md:p-8 backdrop-blur-sm">
      <h3 className="font-serif text-2xl text-kosh-dark mb-1">Investment Comparator</h3>
      <p className="text-kosh-muted text-sm mb-6 font-sans">
        "If I had invested ৳X in A vs B, what would I have today?"
      </p>

      {/* Asset selectors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Asset A</span>
          <select
            value={assetA}
            onChange={(e) => { setAssetA(e.target.value); setCustomReturnA(null); }}
            className={inputCls}
          >
            {ASSETS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Asset B</span>
          <select
            value={assetB}
            onChange={(e) => { setAssetB(e.target.value); setCustomReturnB(null); }}
            className={inputCls}
          >
            {ASSETS.map((x) => (
              <option key={x.id} value={x.id}>{x.label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Amount & Years */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Lump Sum (BDT)</span>
          <input type="number" value={amount} min={1000} step={5000} onChange={(e) => setAmount(Number(e.target.value))} className={inputCls} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Time Horizon (Years)</span>
          <input type="number" value={years} min={1} max={50} step={1} onChange={(e) => setYears(Number(e.target.value))} className={inputCls} />
        </label>
      </div>

      {/* Custom returns */}
      <div className="grid grid-cols-2 gap-4 mb-2">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Return % (A)</span>
          <input
            type="number"
            value={returnA}
            min={-50}
            max={200}
            step={0.5}
            onChange={(e) => setCustomReturnA(Number(e.target.value))}
            className={inputCls}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Return % (B)</span>
          <input
            type="number"
            value={returnB}
            min={-50}
            max={200}
            step={0.5}
            onChange={(e) => setCustomReturnB(Number(e.target.value))}
            className={inputCls}
          />
        </label>
      </div>

      {/* Suggested returns info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <p className="text-[10px] font-mono text-kosh-muted leading-tight">{a.note}</p>
        <p className="text-[10px] font-mono text-kosh-muted leading-tight">{b.note}</p>
      </div>

      {/* Results */}
      <div className="rounded-md bg-kosh-dark/5 p-4 mb-5">
        <div className="flex justify-between text-sm font-sans mb-1">
          <span className="text-kosh-muted">Invested</span>
          <span className="text-kosh-dark">{formatBDT(amount)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans mb-1">
          <span style={{ color: a.color }} className="font-semibold">{a.label}</span>
          <span className="font-semibold text-kosh-dark">{formatBDT(result.futureA)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans mb-2">
          <span style={{ color: b.color }} className="font-semibold">{b.label}</span>
          <span className="font-semibold text-kosh-dark">{formatBDT(result.futureB)}</span>
        </div>
        <div className="border-t border-kosh-dark/10 pt-2">
          <p className="text-xs font-mono text-kosh-muted">
            <span className="font-semibold" style={{ color: winner.color }}>{winner.label}</span> wins by{" "}
            <span className="font-semibold text-kosh-dark">{formatBDT(diff)}</span>
          </p>
        </div>
      </div>

      {/* Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs font-mono text-kosh-muted mb-1">
            <span>{a.label}</span>
            <span>{formatBDT(result.futureA)}</span>
          </div>
          <div className="h-6 rounded-full bg-kosh-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(result.futureA / maxVal) * 100}%`, backgroundColor: a.color }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs font-mono text-kosh-muted mb-1">
            <span>{b.label}</span>
            <span>{formatBDT(result.futureB)}</span>
          </div>
          <div className="h-6 rounded-full bg-kosh-dark/10 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(result.futureB / maxVal) * 100}%`, backgroundColor: b.color }}
            />
          </div>
        </div>
      </div>

      <p className="text-[10px] font-mono text-kosh-muted mt-4 leading-tight">
        ⚠️ These are simplified projections using avg annual returns. Past performance ≠ future results. BTC & stocks are volatile. Do your own research.
      </p>
    </div>
  );
};

const FreeTools = () => {
  const ref = useScrollAnimation();

  return (
    <section id="tools" className="bg-kosh-offwhite py-16 md:py-[100px] px-6 md:px-12 lg:px-24">
      <div ref={ref} className="max-w-6xl mx-auto">
        <h2 className="font-serif text-3xl md:text-5xl text-kosh-dark tracking-tight">
          Run the numbers yourself
        </h2>
        <p className="text-kosh-muted text-sm font-mono mt-3 mb-12">
          Two tools. No sign-up. No catch.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <CompoundInterestCalc />
          <InvestmentComparator />
        </div>
      </div>
    </section>
  );
};

export default FreeTools;
