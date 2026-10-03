import React from 'react';
import { MicroWatershed } from '../types/watershed';
import { 
  X, 
  MapPin, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Droplet, 
  CloudRain, 
  Layers, 
  ShieldCheck, 
  Clock, 
  Compass, 
  CheckCircle, 
  HelpCircle,
  ExternalLink,
  Sliders,
  Users
} from 'lucide-react';

interface WatershedProfileModalProps {
  watershed: MicroWatershed;
  onClose: () => void;
  onOpenSimulator: () => void;
  onOpenLedger: () => void;
  onOpenAssets: () => void;
  onOpenStakeholders?: () => void;
}

export const WatershedProfileModal: React.FC<WatershedProfileModalProps> = ({
  watershed,
  onClose,
  onOpenSimulator,
  onOpenLedger,
  onOpenAssets,
  onOpenStakeholders,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
          text: 'CRITICAL OVERDRAFT',
        };
      case 'stressed':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          text: 'WATER STRESSED',
        };
      case 'watch':
        return {
          bg: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dot: 'bg-yellow-500',
          text: 'WATCH ZONE',
        };
      case 'normal':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          text: 'NORMAL RECOVERY',
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-400',
          text: 'INSUFFICIENT DATA',
        };
    }
  };

  const badge = getStatusBadge(watershed.currentStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b2a4a] via-[#283e56] to-[#1b2a4a] text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                {badge.text}
              </span>
              <span className="text-xs font-mono bg-blue-900/80 text-sky-200 px-2 py-0.5 rounded border border-blue-700/50">
                CODE: {watershed.code}
              </span>
              <span className="text-xs bg-slate-800/80 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                CONFIDENCE: {watershed.dataConfidence}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {watershed.name}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-blue-200/90 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {watershed.district} District, {watershed.state}
              </span>
              <span className="flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                {watershed.basin}
              </span>
              <span>Area: {watershed.areaSqKm} km²</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Hydrological Indicator Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Groundwater Level */}
            <div className="bg-sky-50/60 border border-sky-100 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Observed GW Level</span>
                <Droplet className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {watershed.groundwaterCurrentBgl} <span className="text-xs font-normal text-slate-500">m bgl</span>
              </div>
              <div className="mt-1 flex items-center text-xs">
                {watershed.groundwaterTrend1YrPercent < 0 ? (
                  <span className="text-rose-600 flex items-center font-medium">
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                    {Math.abs(watershed.groundwaterTrend1YrPercent)}% (deeper vs 1yr)
                  </span>
                ) : (
                  <span className="text-emerald-600 flex items-center font-medium">
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                    +{watershed.groundwaterTrend1YrPercent}% (recovered)
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Hist Avg: {watershed.groundwaterHistoricalAvgBgl} m bgl
              </div>
            </div>

            {/* Rainfall Status */}
            <div className="bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Seasonal Rainfall</span>
                <CloudRain className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {watershed.rainfallCurrentSeasonMm} <span className="text-xs font-normal text-slate-500">mm</span>
              </div>
              <div className="mt-1 text-xs">
                <span className={`font-semibold ${watershed.rainfallDeficitPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {watershed.rainfallDeficitPercent > 0 ? '+' : ''}{watershed.rainfallDeficitPercent}% Anomaly
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Normal: {watershed.rainfallNormalMm} mm
              </div>
            </div>

            {/* Recharge Assets Functional */}
            <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Recharge Assets</span>
                <Layers className="w-4 h-4 text-indigo-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {watershed.functionalAssetsCount} / {watershed.totalRechargeAssets}
              </div>
              <div className="mt-1 text-xs text-amber-700 font-medium">
                {watershed.needsRepairCount} assets need repair
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {Math.round((watershed.functionalAssetsCount / watershed.totalRechargeAssets) * 100)}% functional
              </div>
            </div>

            {/* Overall Stress Score */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-1">
                <span>Stress Index</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 font-mono">
                {watershed.stressScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full ${watershed.stressScore > 80 ? 'bg-rose-500' : watershed.stressScore > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${watershed.stressScore}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Analytical model weight
              </div>
            </div>
          </div>

          {/* Section 3: "Why is this watershed stressed?" Diagnostic Decomposition */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Why is this Micro-Watershed Stressed? (Diagnostic Decomposition)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-factor evidence breakdown with verifiable government data sources, dates, and empirical methods.
                </p>
              </div>
              <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                Prototype Analytical Score
              </span>
            </div>

            <div className="space-y-4">
              {watershed.stressDecomposition.map((factor, idx) => (
                <div key={idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] flex items-center justify-center font-mono">
                        {idx + 1}
                      </span>
                      {factor.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#0047ab] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {factor.percentage}% Impact
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-2">
                    {factor.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200/60 font-mono">
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">SOURCE:</span> {factor.source}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">DATE:</span> {factor.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="text-slate-400 font-bold">METHOD:</span> {factor.method}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7 & 8: Rainfall -> Recharge -> Groundwater Model & Recovery Forecast */}
          <div className="bg-gradient-to-br from-sky-50/70 to-blue-50/50 border border-sky-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-700" />
                <h4 className="text-sm font-bold text-[#1b2a4a]">
                  Rainfall → Infiltration → Groundwater Recovery Forecast
                </h4>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full border border-sky-300">
                Confidence: {watershed.recoveryModelConfidence}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-3">
              <div className="bg-white p-3 rounded-lg border border-sky-100">
                <span className="text-[11px] text-slate-500 block">Aquifer Formation</span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {watershed.aquiferFormation}
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-sky-100">
                <span className="text-[11px] text-slate-500 block">Soil Permeability Infiltration</span>
                <span className="text-xs font-bold text-slate-800 font-mono block mt-0.5">
                  {watershed.modelledInfiltrationRateMmDay} mm/day ({watershed.soilType})
                </span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-sky-100">
                <span className="text-[11px] text-slate-500 block">Estimated Recovery Window</span>
                <span className="text-xs font-bold text-sky-900 font-mono block mt-0.5">
                  {watershed.estimatedRecoveryWeeks}
                </span>
              </div>
            </div>

            {/* Crucial Data Integrity Disclaimer */}
            <div className="flex items-start gap-2 bg-sky-100/60 p-2.5 rounded-lg border border-sky-200 text-xs text-sky-950 font-medium">
              <HelpCircle className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
              <span>
                <strong>Data Integrity Rule:</strong> Modelled scenario estimate based on available piezometric observations, IMD rainfall kriging, and NRSC infiltration parameters; not a guaranteed physical groundwater recovery date.
              </span>
            </div>
          </div>

          {/* Quick Action Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Explore deeper telemetry and interventions for this micro-watershed:
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenLedger();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-[#0047ab] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Layers className="w-3.5 h-3.5" />
                View Water Ledger
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenAssets();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Inspect Recharge Assets ({watershed.assets.length})
              </button>
              {onOpenStakeholders && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenStakeholders();
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Contact Stakeholders & Nodal ({watershed.stakeholders?.length || 0})
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  onOpenSimulator();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5" />
                Simulate Interventions
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
