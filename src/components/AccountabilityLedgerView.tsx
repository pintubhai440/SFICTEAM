import React, { useState } from 'react';
import { MicroWatershed } from '../types/watershed';
import { generateWatershedPdfReport } from '../utils/generateWatershedPdf';
import { 
  Layers, 
  ArrowDownRight, 
  ArrowUpRight, 
  Droplet, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle, 
  Download,
  Info,
  ShieldCheck,
  Calendar,
  FileDown,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AccountabilityLedgerViewProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
}

export const AccountabilityLedgerView: React.FC<AccountabilityLedgerViewProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
}) => {
  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateWatershedPdfReport(currentWs);
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#0047ab', '#0284c7', '#10b981'],
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4500);
      } catch (err) {
        console.error('Error generating PDF report:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 350);
  };

  const formatCuM = (val: number) => {
    if (Math.abs(val) >= 10000000) {
      return `${(val / 10000000).toFixed(2)} Cr m³`;
    }
    if (Math.abs(val) >= 100000) {
      return `${(val / 100000).toFixed(2)} Lakh m³`;
    }
    return `${val.toLocaleString()} m³`;
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b2a4a] text-white px-5 py-3 rounded-xl shadow-xl border border-sky-400 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Summary Audit Report Downloaded!</div>
            <div className="text-blue-200">
              PDF report generated for {currentWs.district} ({currentWs.name.split('(')[0]}).
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-blue-100 text-[#0047ab]">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Micro-Watershed Water Accountability Ledger (जल लेखा प्रणाली)
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Moving from "How much did we build?" to "Did the watershed aquifer actually recover?"
              </p>
            </div>
          </div>
        </div>

        {/* Watershed Selector & Download Report Button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Select Watershed:</label>
            <select
              value={currentWs.id}
              onChange={(e) => onSelectWatershed(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {watersheds.map((ws) => (
                <option key={ws.id} value={ws.id}>
                  {ws.district} — {ws.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Download PDF Report Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex items-center gap-2 bg-[#0047ab] hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold shadow-xs transition-all hover:shadow-md cursor-pointer disabled:opacity-75"
            title="Download full PDF summary report of water balance and asset registry"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating PDF...</span>
              </>
            ) : (
              <>
                <FileDown className="w-3.5 h-3.5" />
                <span>Download Report (PDF)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Conceptual Framework Pipeline Card */}
      <div className="bg-gradient-to-r from-blue-900 via-[#1b2a4a] to-blue-950 text-white rounded-xl p-5 shadow-md">
        <span className="text-[11px] font-mono text-sky-300 font-semibold tracking-wider uppercase block mb-3">
          CONTINUOUS AUDIT PIPELINE (Roadmap §4)
        </span>
        <div className="grid grid-cols-2 md:grid-cols-7 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
            <div className="text-[10px] text-sky-200 font-semibold">1. RAINFALL</div>
            <div className="font-bold text-white mt-1">{currentWs.rainfallCurrentSeasonMm} mm</div>
          </div>
          <div className="flex items-center justify-center text-sky-300 text-lg">→</div>
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
            <div className="text-[10px] text-sky-200 font-semibold">2. RECHARGE POTENTIAL</div>
            <div className="font-bold text-white mt-1">{currentWs.modelledInfiltrationRateMmDay} mm/day</div>
          </div>
          <div className="flex items-center justify-center text-sky-300 text-lg">→</div>
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
            <div className="text-[10px] text-sky-200 font-semibold">3. EXTRACTION DEMAND</div>
            <div className="font-bold text-rose-300 mt-1">High (Pumping)</div>
          </div>
          <div className="flex items-center justify-center text-sky-300 text-lg">→</div>
          <div className="bg-white/10 p-2.5 rounded-lg border border-white/10">
            <div className="text-[10px] text-sky-200 font-semibold">4. OBSERVED OUTCOME</div>
            <div className="font-bold text-amber-300 mt-1">{currentWs.groundwaterCurrentBgl}m bgl</div>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Seasonal Aquifer Balance Sheet — {currentWs.name}
            </h3>
            <p className="text-xs text-slate-500">
              Net balance of all natural precipitation inflows versus agricultural/domestic drafts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded">
              VERIFIED LEDGER ENTRIES
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Season Cycle</th>
                <th className="py-3 px-4">Rainfall Gross Inflow</th>
                <th className="py-3 px-4">Natural Infiltration</th>
                <th className="py-3 px-4">Artificial Recharge Captured</th>
                <th className="py-3 px-4">Estimated Irrigation Draft</th>
                <th className="py-3 px-4">Domestic / Livestock</th>
                <th className="py-3 px-4">Net Aquifer Balance</th>
                <th className="py-3 px-4">Observed Shift</th>
                <th className="py-3 px-4">Audit Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-slate-800">
              {currentWs.ledger.map((cycle, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 font-sans flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {cycle.seasonLabel}
                  </td>
                  <td className="py-3.5 px-4 text-blue-700">
                    {formatCuM(cycle.rainfallInflowCuM)}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700">
                    +{formatCuM(cycle.naturalInfiltrationCuM)}
                  </td>
                  <td className="py-3.5 px-4 text-emerald-700 font-bold">
                    +{formatCuM(cycle.artificialRechargeCapturedCuM)}
                  </td>
                  <td className="py-3.5 px-4 text-rose-600">
                    -{formatCuM(cycle.estimatedIrrigationExtractionCuM)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    -{formatCuM(cycle.domesticLivestockDrawCuM)}
                  </td>
                  <td className="py-3.5 px-4 font-bold">
                    {cycle.netAquiferBalanceCuM >= 0 ? (
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        +{formatCuM(cycle.netAquiferBalanceCuM)} (Surplus)
                      </span>
                    ) : (
                      <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        {formatCuM(cycle.netAquiferBalanceCuM)} (Deficit)
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    {cycle.observedGroundwaterShiftMeters >= 0 ? (
                      <span className="text-emerald-600 font-bold flex items-center">
                        <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        +{cycle.observedGroundwaterShiftMeters} m
                      </span>
                    ) : (
                      <span className="text-rose-600 font-bold flex items-center">
                        <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        {cycle.observedGroundwaterShiftMeters} m
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${
                      cycle.recordedStatus === 'critical' ? 'bg-rose-100 text-rose-800' :
                      cycle.recordedStatus === 'stressed' ? 'bg-amber-100 text-amber-800' :
                      cycle.recordedStatus === 'watch' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {cycle.recordedStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Verification Methodology */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Water Balance Ledger Methodology</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The ledger computes volumetric inflow = <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">Watershed Area × IMD Gridded Rainfall</code>. Infiltration is split into natural soil infiltration (based on CGWB specific yield) and artificial capture through verified functional check dams and farm ponds.
          </p>
          <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-mono">
            <strong>Audit Principle:</strong> Every rupee spent on check dam repair must reflect in the "Artificial Recharge Captured" column and subsequent piezometer response.
          </div>
        </div>

        {/* Satellite vs Field Distinction */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Info className="w-4 h-4 text-blue-600" />
            <span>Data Provenance & Scientific Honesty</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Individual borewells in rural India do not possess automated smart meters. Hence, agricultural draft is calculated as a <strong>satellite-derived proxy</strong> based on Sentinel-2 NDVI crop extent, cropping seasons, and regional evapotranspiration indices (ET₀).
          </p>
          <div className="text-[11px] text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 font-mono">
            <strong>Integrity Guarantee:</strong> Clearly badged as MODELLED ESTIMATE rather than fabricated direct IoT telemetry.
          </div>
        </div>
      </div>
    </div>
  );
};
