import React from 'react';
import { MicroWatershed } from '../types/watershed';
import { 
  Activity, 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Info,
  Calendar,
  Layers,
  CheckCircle2
} from 'lucide-react';

interface SeasonalImpactAuditProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
}

export const SeasonalImpactAudit: React.FC<SeasonalImpactAuditProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
}) => {
  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];
  const audit = currentWs.seasonalAudit;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#0047ab]" />
            "Did It Actually Work?" — Seasonal Outcome & Impact Audit (प्रभाव मूल्यांकन)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Post-season audit comparing physical intervention before vs after. Validating actual aquifer retention.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Watershed:</label>
          <select
            value={currentWs.id}
            onChange={(e) => onSelectWatershed(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 cursor-pointer"
          >
            {watersheds.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.district} — {ws.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Side-by-Side Audit Card */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="bg-gradient-to-r from-[#1b2a4a] via-[#283e56] to-[#1b2a4a] text-white p-5 flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono text-sky-300 uppercase tracking-wider block">
              EMPIRICAL EVIDENCE AUDIT (Roadmap §12)
            </span>
            <h3 className="text-base font-bold">
              {currentWs.name} — Seasonal Transformation Audit
            </h3>
          </div>
          <span className="bg-blue-900/80 text-sky-200 px-3 py-1 rounded-full text-xs font-mono border border-blue-700/60">
            Audit Cycle: 2024-2026
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Before Column */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rose-200 pb-3">
              <div>
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider block">
                  BASELINE (BEFORE INTERVENTION)
                </span>
                <span className="text-xs text-rose-600 font-mono">{audit.beforeLabel}</span>
              </div>
              <span className="text-2xl font-mono font-bold text-rose-600">
                {audit.beforeStressScore} <span className="text-xs font-normal">/ 100</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-rose-100">
                <span className="text-[11px] text-slate-500 block">Groundwater Hydrograph Behavior</span>
                <span className="font-semibold text-rose-900 mt-1 block">
                  {audit.beforeTrend}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-100">
                <span className="text-[11px] text-slate-500 block">Functional Recharge Structures</span>
                <span className="text-lg font-bold font-mono text-rose-700 mt-1 block">
                  {audit.beforeFunctionalAssets} <span className="text-xs font-normal text-slate-500">of {currentWs.totalRechargeAssets} functional</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-rose-100">
                <span className="text-[11px] text-slate-500 block">Community Water Insecurity</span>
                <span className="font-medium text-slate-700 mt-1 block">
                  Frequent tanker deliveries & dry agricultural wells during summer.
                </span>
              </div>
            </div>
          </div>

          {/* After / Current Column */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-200 pb-3">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  OBSERVED OUTCOME (POST INTERVENTION)
                </span>
                <span className="text-xs text-emerald-600 font-mono">{audit.afterLabel}</span>
              </div>
              <span className="text-2xl font-mono font-bold text-emerald-600">
                {audit.afterStressScore} <span className="text-xs font-normal">/ 100</span>
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-[11px] text-slate-500 block">Observed Piezometer Hydrograph Shift</span>
                <span className="font-semibold text-emerald-900 mt-1 block">
                  {audit.afterTrend}
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-[11px] text-slate-500 block">Active Functional Structures</span>
                <span className="text-lg font-bold font-mono text-emerald-700 mt-1 block">
                  {audit.afterFunctionalAssets} <span className="text-xs font-normal text-slate-500">of {currentWs.totalRechargeAssets} functional (+{audit.afterFunctionalAssets - audit.beforeFunctionalAssets} restored)</span>
                </span>
              </div>

              <div className="bg-white p-3 rounded-lg border border-emerald-100">
                <span className="text-[11px] text-slate-500 block">Verified Physical Outcome</span>
                <span className="font-medium text-slate-700 mt-1 block">
                  {audit.verifiedImprovementSummary}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Principle Footer Banner */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900">Roadmap Causation Rule:</strong> We report <em>observed physical change</em>. Causation claims ("Our intervention caused X") are made strictly when piezometric drawdown curve matches rain infiltration lag and specific yield coefficients.
          </div>
        </div>
      </div>

      {/* Historical Hydrograph Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-slate-900">
          Piezometer Level History (Telemetric DWLR Records)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 uppercase text-[10px] text-slate-600 font-bold border-b border-slate-200 font-mono">
              <tr>
                <th className="py-2.5 px-3">Year</th>
                <th className="py-2.5 px-3">Season</th>
                <th className="py-2.5 px-3">Recorded Depth (m bgl)</th>
                <th className="py-2.5 px-3">30-Yr Historical Avg</th>
                <th className="py-2.5 px-3">Recharge Rate (mm/yr)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {currentWs.groundwaterHistory.map((rec, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{rec.year}</td>
                  <td className="py-2.5 px-3 font-sans">{rec.season}</td>
                  <td className="py-2.5 px-3 font-bold text-[#0047ab]">
                    {rec.depthMetersBgl} m bgl
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{rec.historicalAvgMeters} m bgl</td>
                  <td className="py-2.5 px-3 text-emerald-600">+{rec.rechargeRateMmYear} mm/yr</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
