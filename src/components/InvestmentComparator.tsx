import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

function formatBDT(n: number) {
  if (n >= 1e12) return "৳" + (n / 1e12).toFixed(1) + "T";
  if (n >= 1e9) return "৳" + (n / 1e9).toFixed(1) + "B";
  if (n >= 1e7) return "৳" + (n / 1e7).toFixed(1) + "Cr";
  if (n >= 1e5) return "৳" + (n / 1e5).toFixed(1) + "L";
  return "৳" + Math.round(n).toLocaleString("en-BD");
}

const ASSETS = [
  { id: "gold", label: "Gold", rate: 19.7, rateLabel: "10Y reference rate", color: "#D4A843" },
  { id: "sp500", label: "S&P 500", rate: 14.8, rateLabel: "10Y reference rate", color: "#4F46E5" },
  { id: "sanchayapatra", label: "Sanchay Patra", rate: 11.28, rateLabel: "Current rate", color: "#2E7D32" },
  { id: "fdr", label: "FDR", rate: 8.5, rateLabel: "Current indicative bank rate", color: "#5C6BC0" },
  { id: "btc", label: "Bitcoin", rate: 65.4, rateLabel: "10Y reference rate", color: "#F7931A" },
  { id: "dsex", label: "DSEX", rate: 1.2, rateLabel: "10Y reference rate", color: "#06776E" },
];

const YEAR_OPTIONS = [1, 3, 5, 10, 15, 20, 30];

const InvestmentComparator = () => {
  const [amount, setAmount] = useState(50000);
  const [years, setYears] = useState(10);
  const [showInfo, setShowInfo] = useState(false);

  const results = useMemo(() => {
    return ASSETS.map((asset) => ({
      ...asset,
      futureValue: amount * Math.pow(1 + asset.rate / 100, years),
    })).sort((a, b) => b.futureValue - a.futureValue);
  }, [amount, years]);

  const maxValue = results[0]?.futureValue || 1;

  return (
    <div className="rounded-xl border border-kosh-teal/20 bg-white/95 p-6 md:p-10 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h3 className="font-serif text-2xl md:text-3xl text-kosh-dark">
          Compare how money can grow
        </h3>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-1.5 rounded-full hover:bg-kosh-dark/5 transition-colors text-kosh-muted"
          aria-label="How this works"
        >
          <Info size={18} />
        </button>
      </div>
      <p className="text-kosh-muted text-sm font-sans mb-8 max-w-lg">
        A simple curiosity tool to explore how different assets and savings options may grow over time.
      </p>

      {/* Info tooltip */}
      {showInfo && (
        <div className="mb-6 p-4 rounded-lg bg-kosh-dark/5 text-xs font-sans text-kosh-muted leading-relaxed">
          <strong className="text-kosh-dark">How this works:</strong> We use simple comparison rates to help you explore how money can grow differently over time. Growth assets use long-term reference rates. FDR and Sanchay Patra use current indicative rates. This is not investment advice.
        </div>
      )}

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
        <label className="flex flex-col gap-2">
          <span className="text-xs font-mono text-kosh-muted uppercase tracking-wider">Amount (BDT)</span>
          <input
            type="number"
            value={amount}
            min={1000}
            step={5000}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
            className="rounded-lg border border-kosh-teal/20 bg-kosh-offwhite px-4 py-3 text-lg font-sans text-kosh-dark focus:outline-none focus:ring-2 focus:ring-kosh-mint/40 transition-shadow"
          />
        </label>
        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-kosh-muted uppercase tracking-wider">Time Horizon</span>
          <div className="flex flex-wrap gap-2">
            {YEAR_OPTIONS.map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`px-4 py-2.5 rounded-lg text-sm font-sans font-medium transition-all ${
                  years === y
                    ? "bg-kosh-dark text-white shadow-sm"
                    : "bg-kosh-offwhite text-kosh-muted hover:bg-kosh-dark/5 border border-kosh-teal/10"
                }`}
              >
                {y}Y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="space-y-3">
        {results.map((asset, i) => {
          const barWidth = Math.max(4, (asset.futureValue / maxValue) * 100);
          return (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: asset.color }} />
                  <span className="text-sm font-sans font-semibold text-kosh-dark">{asset.label}</span>
                  <span className="text-[10px] font-mono text-kosh-muted">{asset.rate}%</span>
                  <span className="text-[9px] font-mono text-kosh-muted/60 hidden sm:inline">· {asset.rateLabel}</span>
                </div>
                <span className="text-sm font-sans font-semibold text-kosh-dark tabular-nums">
                  {formatBDT(asset.futureValue)}
                </span>
              </div>
              <div className="h-7 rounded-lg bg-kosh-dark/[0.04] overflow-hidden">
                <motion.div
                  className="h-full rounded-lg"
                  style={{ backgroundColor: asset.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${barWidth}%` }}
                  transition={{ duration: 0.6, delay: i * 0.05, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Result sentence */}
      <p className="mt-6 text-sm font-sans text-kosh-muted text-center">
        If these rates continued, <span className="font-semibold text-kosh-dark">{formatBDT(amount)}</span> could become{" "}
        <span className="font-semibold text-kosh-dark">{formatBDT(results[0]?.futureValue || 0)}</span> ({results[0]?.label}) to{" "}
        <span className="font-semibold text-kosh-dark">{formatBDT(results[results.length - 1]?.futureValue || 0)}</span> ({results[results.length - 1]?.label}) in{" "}
        <span className="font-semibold text-kosh-dark">{years} {years === 1 ? "year" : "years"}</span>.
      </p>

      {/* Disclaimers */}
      <div className="mt-6 pt-5 border-t border-kosh-dark/[0.06] space-y-2">
        <p className="text-[11px] font-sans text-kosh-muted/70 leading-relaxed">
          This tool is for education and curiosity only. Rates shown are reference assumptions for comparison, not forecasts or guarantees. Actual outcomes vary.
        </p>
        <p className="text-[10px] font-sans text-kosh-muted/50 leading-relaxed">
          FDR rates vary by bank, tenure, amount, and product type.
        </p>
      </div>
    </div>
  );
};

export default InvestmentComparator;
