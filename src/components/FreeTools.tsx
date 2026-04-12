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

      {/* Results */}
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

      {/* Bar visual */}
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

const EmergencyFundCalc = () => {
  const [expenses, setExpenses] = useState(25000);
  const [months, setMonths] = useState(6);

  const target = expenses * months;

  return (
    <div className="rounded-lg border border-kosh-teal/30 bg-white/95 p-6 md:p-8 backdrop-blur-sm">
      <h3 className="font-serif text-2xl text-kosh-dark mb-1">Emergency Fund Calculator</h3>
      <p className="text-kosh-muted text-sm mb-6 font-sans">Know exactly how much safety net you need.</p>

      <div className="space-y-4 mb-6">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Monthly Essential Expenses (BDT)</span>
          <input
            type="number"
            value={expenses}
            min={0}
            step={1000}
            onChange={(e) => setExpenses(Number(e.target.value))}
            className="rounded border border-kosh-teal/20 bg-kosh-offwhite px-3 py-2 text-sm font-sans text-kosh-dark focus:outline-none focus:ring-1 focus:ring-kosh-mint"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-mono text-kosh-muted">Desired Coverage</span>
          <select
            value={months}
            onChange={(e) => setMonths(Number(e.target.value))}
            className="rounded border border-kosh-teal/20 bg-kosh-offwhite px-3 py-2 text-sm font-sans text-kosh-dark focus:outline-none focus:ring-1 focus:ring-kosh-mint"
          >
            {[3, 6, 9, 12].map((m) => (
              <option key={m} value={m}>{m} months</option>
            ))}
          </select>
        </label>
      </div>

      <div className="rounded-md bg-kosh-dark/5 p-5 text-center">
        <p className="text-xs font-mono text-kosh-muted mb-2">Target Emergency Fund</p>
        <p className="font-serif text-4xl md:text-5xl text-kosh-dark">{formatBDT(target)}</p>
        <p className="text-sm text-kosh-muted font-sans mt-3">
          This covers {months} months of your essential expenses.
        </p>
      </div>
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
          Two simple tools. No sign-up. No catch.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          <CompoundInterestCalc />
          <EmergencyFundCalc />
        </div>
      </div>
    </section>
  );
};

export default FreeTools;
