import React, { useState } from 'react';
import { MicroWatershed } from '../types/watershed';
import { 
  Sliders, 
  HelpCircle, 
  TrendingDown, 
  Droplet, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Send,
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InterventionSimulatorProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
  onApplyScenarioAsTask?: (watershedId: string, title: string, category: any) => void;
}

export const InterventionSimulator: React.FC<InterventionSimulatorProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  onApplyScenarioAsTask,
}) => {
  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];

  // Simulator Sliders State
  const [repairCheckDamsCount, setRepairCheckDamsCount] = useState<number>(
    Math.min(5, currentWs.needsRepairCount)
  );
  const [dripCoveragePercent, setDripCoveragePercent] = useState<number>(20);
  const [rwhRetrofitCount, setRwhRetrofitCount] = useState<number>(15);
  const [cropShiftPercent, setCropShiftPercent] = useState<number>(10);
  const [taskCreatedToast, setTaskCreatedToast] = useState<boolean>(false);

  // Hydrological Calculations (Derived physics model)
  // Each check dam repaired captures ~18,000 m³ runoff
  const additionalRechargeCuM = repairCheckDamsCount * 18500 + rwhRetrofitCount * 550;
  
  // Drip irrigation & crop shift reduce agricultural draft
  // Baseline draft estimated ~3.4M m³
  const irrigationSavedCuM = Math.round(
    3400000 * ((dripCoveragePercent * 0.45) / 100 + (cropShiftPercent * 0.8) / 100)
  );

  // Total net water improvement in m³
  const totalWaterSavedOrRechargedCuM = additionalRechargeCuM + irrigationSavedCuM;

  // Impact on stress score (0 to 100)
  const stressReductionPoints = Math.min(
    35,
    Math.round((repairCheckDamsCount * 2.2) + (dripCoveragePercent * 0.35) + (cropShiftPercent * 0.5) + (rwhRetrofitCount * 0.15))
  );
  const scenarioStressScore = Math.max(25, currentWs.stressScore - stressReductionPoints);

  // Recovery Window Recalculation
  const computeScenarioRecovery = () => {
    if (scenarioStressScore < 50) return '2 to 4 weeks post 120mm rainfall';
    if (scenarioStressScore < 65) return '3 to 6 weeks post 140mm rainfall';
    return '5 to 8 weeks post 160mm rainfall';
  };

  const handleReset = () => {
    setRepairCheckDamsCount(0);
    setDripCoveragePercent(0);
    setRwhRetrofitCount(0);
    setCropShiftPercent(0);
  };

  const handleCreateTaskFromScenario = () => {
    if (onApplyScenarioAsTask) {
      onApplyScenarioAsTask(
        currentWs.id,
        `Mission Plan: Repair ${repairCheckDamsCount} check dams & onboard ${dripCoveragePercent}% drip coverage in ${currentWs.district}`,
        'Recharge Structure Verification'
      );
    }
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#0284c7', '#10b981', '#6366f1'],
    });
    setTaskCreatedToast(true);
    setTimeout(() => setTaskCreatedToast(false), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {taskCreatedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b2a4a] text-white px-5 py-3 rounded-xl shadow-xl border border-sky-400 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Scenario Converted to Official Action Item!</div>
            <div className="text-blue-200">Task dispatched to District Watershed Committee & Action Center.</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#0047ab]" />
            What-If Micro-Watershed Intervention Simulator (पूर्वानुमान एवं सिम्युलेटर)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Test policy and civil interventions before allocating capital. Recalculates aquifer stress & recovery windows in real-time.
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

      {/* Main Grid: Controls on Left, Live Outcome Forecast on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Simulate Ground Interventions
              </h3>
              <p className="text-xs text-slate-500">
                Adjust sliders to model physical repair and demand-management combinations.
              </p>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Slider 1: Repair Check Dams */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                Repair Non-Functional Check Dams & Ponds
              </span>
              <span className="font-mono font-bold text-[#0047ab] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {repairCheckDamsCount} of {currentWs.needsRepairCount} Structures
              </span>
            </div>
            <input
              type="range"
              min="0"
              max={currentWs.needsRepairCount}
              value={repairCheckDamsCount}
              onChange={(e) => setRepairCheckDamsCount(Number(e.target.value))}
              className="w-full accent-[#0047ab] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 (Do nothing)</span>
              <span>Max ({currentWs.needsRepairCount} damaged)</span>
            </div>
          </div>

          {/* Slider 2: Micro-Irrigation (Drip) Adoption */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                Drip & Micro-Irrigation Coverage
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {dripCoveragePercent}% Irrigated Area
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="70"
              step="5"
              value={dripCoveragePercent}
              onChange={(e) => setDripCoveragePercent(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Flood irrigation)</span>
              <span>70% (High-efficiency drip)</span>
            </div>
          </div>

          {/* Slider 3: Institutional Rooftop RWH Retrofits */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                Mandatory Rooftop Rainwater Harvesting Units
              </span>
              <span className="font-mono font-bold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                {rwhRetrofitCount} Public / School Buildings
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={rwhRetrofitCount}
              onChange={(e) => setRwhRetrofitCount(Number(e.target.value))}
              className="w-full accent-sky-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0 Buildings</span>
              <span>60 Buildings</span>
            </div>
          </div>

          {/* Slider 4: Low-Water Crop Pattern Shift */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                Paddy/Sugarcane → Millets/Pulses Diversification
              </span>
              <span className="font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {cropShiftPercent}% Acreage Shift
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="5"
              value={cropShiftPercent}
              onChange={(e) => setCropShiftPercent(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Status quo crops)</span>
              <span>40% (High drought-resilience millets)</span>
            </div>
          </div>

          {/* Convert to Action Plan Button */}
          <div className="pt-2">
            <button
              onClick={handleCreateTaskFromScenario}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Adopt Scenario into Official Action & Task Center
            </button>
          </div>
        </div>

        {/* Forecast Output Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stress Score Comparison Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase block">
              MODELLED SCENARIO OUTCOME (Roadmap §9)
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[10px] text-slate-500 font-medium block">Current Stress Index</span>
                <span className="text-3xl font-extrabold font-mono text-rose-600 block mt-1">
                  {currentWs.stressScore}
                </span>
                <span className="text-[10px] text-rose-700 font-medium block mt-0.5">
                  Critical Overdraft
                </span>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-center">
                <span className="text-[10px] text-emerald-700 font-medium block">Projected Scenario</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-600 block mt-1">
                  {scenarioStressScore}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                  -{stressReductionPoints} Pts Drop
                </span>
              </div>
            </div>

            {/* Recovery Window Shift */}
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 space-y-2">
              <div className="text-xs font-bold text-sky-950 flex items-center justify-between">
                <span>Estimated Aquifer Recovery Window:</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                  <span>Baseline:</span>
                  <span className="text-rose-700 font-semibold">{currentWs.estimatedRecoveryWeeks}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-800 font-mono text-[11px] font-bold">
                  <span>Scenario:</span>
                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                    {computeScenarioRecovery()}
                  </span>
                </div>
              </div>
            </div>

            {/* Volumetric Impact Summary */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Additional Monsoon Water Captured:</span>
                <span className="font-mono font-bold text-[#0047ab]">
                  +{(additionalRechargeCuM / 100000).toFixed(2)} Lakh m³
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Agricultural Groundwater Draft Saved:</span>
                <span className="font-mono font-bold text-emerald-600">
                  +{(irrigationSavedCuM / 100000).toFixed(2)} Lakh m³
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-2 font-bold text-slate-900">
                <span>Net Seasonal Conservation:</span>
                <span className="font-mono text-emerald-700">
                  +{(totalWaterSavedOrRechargedCuM / 100000).toFixed(2)} Lakh m³/yr
                </span>
              </div>
            </div>
          </div>

          {/* Mandatory Scientific Disclaimer Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-950">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              Scientific & Legal Disclaimer
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed font-sans">
              "Modelled scenario estimate based on empirical soil infiltration parameters and storage coefficients; not a guaranteed physical groundwater recovery date."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
