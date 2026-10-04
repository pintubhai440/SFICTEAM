import React, { useState } from 'react';
import { WaterBody, WaterBodyStatusColor } from '../types/nirikshan';
import { 
  Satellite, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Calendar, 
  Layers, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ExternalLink, 
  Activity, 
  X,
  Gauge,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Building
} from 'lucide-react';

interface BhuvanWbisDetailModalProps {
  waterBody: WaterBody | null;
  isOpen: boolean;
  onClose: () => void;
  onLodgeComplaint?: (waterBody: WaterBody) => void;
}

export const BhuvanWbisDetailModal: React.FC<BhuvanWbisDetailModalProps> = ({
  waterBody,
  isOpen,
  onClose,
  onLodgeComplaint,
}) => {
  const [activeTab, setActiveTab] = useState<'wbis' | 'ndwi' | 'field' | 'api'>('wbis');
  const [copiedGps, setCopiedGps] = useState(false);
  const [isPingingBhuvan, setIsPingingBhuvan] = useState(false);
  const [apiPingResult, setApiPingResult] = useState<any>(null);

  if (!isOpen || !waterBody) return null;

  const isGroundwater = waterBody.datasetType === 'groundwater' || waterBody.type === 'Groundwater Well';
  const isRiver = waterBody.datasetType === 'river_level' || waterBody.datasetType === 'river_discharge' || waterBody.datasetType === 'basin_river_level' || waterBody.datasetType === 'basin_river_discharge' || waterBody.type === 'River' || waterBody.type === 'Canal';
  const isRainfall = waterBody.datasetType === 'rainfall' || waterBody.datasetType === 'basin_rainfall' || waterBody.type === 'Rainfall Station';

  const wbis = waterBody.bhuvanWbis || {
    ndwiScore: waterBody.statusColor === 'grey' ? -0.26 : isGroundwater ? 0.24 : waterBody.statusColor === 'green' ? 0.44 : waterBody.statusColor === 'blue' ? 0.28 : waterBody.statusColor === 'yellow' ? 0.12 : -0.08,
    ndwiClassification: waterBody.statusColor === 'grey' 
      ? 'Extinct / Encroached / Built-up (< -0.15)' 
      : isGroundwater
      ? 'Active Hill Spring & Aquifer Head (0.24 NDMI)'
      : waterBody.statusColor === 'green' 
      ? 'Deep Surface Water (NDWI > 0.3)' 
      : waterBody.statusColor === 'blue' 
      ? 'Moderate Surface Water (0.1 - 0.3)' 
      : 'Shallow / Turbid Water (0.0 - 0.1)',
    waterSpreadAreaHa: isGroundwater ? 14.8 : waterBody.statusColor === 'grey' ? 0.0 : Math.round((waterBody.waterLevelPercent * 0.45 + 5) * 10) / 10,
    historicalBaselineHa: isGroundwater ? 14.8 : waterBody.statusColor === 'grey' ? 18.5 : Math.round((waterBody.waterLevelPercent * 0.5 + 8) * 10) / 10,
    areaChangePercent: waterBody.statusColor === 'grey' ? -100 : isGroundwater ? 1.4 : waterBody.waterLevelPercent > 60 ? +4.2 : -18.5,
    satelliteMission: isGroundwater ? 'ISRO Resourcesat-2A (LISS-IV 5.8m) & Sentinel-2' : 'ISRO Resourcesat-2A (AWiFS / LISS-IV)',
    sensorName: isGroundwater ? 'LISS-IV (5.8m High-Res) + Hydrogeological Lineament Mapping' : 'AWiFS (56m Swath) + Sentinel-2 MSI (10m Multi-spectral)',
    last15DayPassDate: '2026-10-02',
    previousPassDate: '2026-09-17',
    nextPassDate: '2026-10-17',
    cycleDays: 15,
    cloudCoverPercent: isGroundwater ? 2.1 : 4.8,
    siltationIndexPercent: isGroundwater ? 0 : waterBody.statusColor === 'grey' ? 96 : waterBody.statusColor === 'red' ? 74 : waterBody.statusColor === 'yellow' ? 42 : 12,
    encroachmentRisk: isGroundwater ? 'None' : waterBody.statusColor === 'grey' ? 'Total Extinction' : waterBody.statusColor === 'red' ? 'Severe' : waterBody.statusColor === 'yellow' ? 'Moderate' : 'None',
    waterRemainingPercent: waterBody.waterLevelPercent,
    estimatedVolumeMCM: isGroundwater ? 1.8 : waterBody.liveTelemetry?.storageMCM || Math.round((waterBody.waterLevelPercent * 0.3) * 10) / 10,
    isExtinct: waterBody.statusColor === 'grey',
    extinctionReason: waterBody.statusColor === 'grey' ? 'Talab sookh kar mit gaya: severe siltation deposition, unauthorized construction encroachment, and feeder canal diversion.' : undefined,
  };

  const handleCopyGps = () => {
    const text = `${waterBody.coordinates.lat}, ${waterBody.coordinates.lng}`;
    navigator.clipboard.writeText(text);
    setCopiedGps(true);
    setTimeout(() => setCopiedGps(false), 2000);
  };

  const handlePingBhuvan = async () => {
    setIsPingingBhuvan(true);
    setApiPingResult(null);
    try {
      const res = await fetch(`/api/bhuvan?action=water_bodies&district=${encodeURIComponent(waterBody.district)}`);
      const data = await res.json();
      setApiPingResult(data);
    } catch (err: any) {
      setApiPingResult({ status: 'error', message: err.message });
    } finally {
      setIsPingingBhuvan(false);
    }
  };

  const isExtinct = waterBody.statusColor === 'grey' || wbis.isExtinct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header with ISRO Satellite Theming */}
        <div className={`p-4 sm:p-6 text-white relative overflow-hidden shrink-0 ${
          isExtinct 
            ? 'bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-900 border-b border-slate-700'
            : waterBody.statusColor === 'red'
            ? 'bg-gradient-to-r from-rose-950 via-rose-900 to-slate-900 border-b border-rose-800'
            : 'bg-gradient-to-r from-[#002b66] via-[#0047ab] to-[#0284c7] border-b border-blue-800'
        }`}>
          {/* Subtle Radar/Satellite Sweep Animation Overlay */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/15 text-white border border-white/20 backdrop-blur-xs">
                  <Satellite className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>
                    {isGroundwater
                      ? 'ISRO Bhuvan GWIS Satellite & Hydrogeology Telemetry'
                      : isRiver
                      ? 'ISRO Bhuvan River Basin & Fluvial Telemetry'
                      : isRainfall
                      ? 'ISRO Bhuvan AWS Precipitation Telemetry'
                      : 'ISRO Bhuvan WBIS Satellite Telemetry'}
                  </span>
                </span>

                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                  {isGroundwater ? 'DWLR Piezometer Pass' : '15-Day Cycle Pass'}
                </span>

                {isExtinct ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-mono font-extrabold bg-slate-700 text-slate-100 border border-slate-500 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>GREY STATUS: SOOKH KAR MIT GAYA (EXTINCT)</span>
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                    waterBody.statusColor === 'green' ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40' :
                    waterBody.statusColor === 'blue' ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40' :
                    waterBody.statusColor === 'yellow' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' :
                    'bg-rose-500/30 text-rose-200 border border-rose-400/40'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{waterBody.statusLabel}</span>
                  </span>
                )}
              </div>

              <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-snug">
                {waterBody.name}
              </h3>

              <div className="flex items-center gap-2 text-xs text-sky-100/90 font-medium flex-wrap">
                <span>District: <strong className="text-white">{waterBody.district}</strong></span>
                <span>•</span>
                <span>Mandal: <strong className="text-white">{waterBody.mandal}</strong></span>
                <span>•</span>
                <span>Village: <strong className="text-white">{waterBody.village}</strong></span>
                {waterBody.teluguName && (
                  <>
                    <span>•</span>
                    <span className="text-amber-200 font-bold">{waterBody.teluguName}</span>
                  </>
                )}
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Extinct Alert Banner if Grey */}
          {isExtinct && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-rose-100 font-bold block">ISRO BHUVAN WBIS EXTINCTION DOSSIER (GREY STATUS):</strong>
                <p className="mt-0.5 text-rose-200 leading-relaxed">
                  Yeh talab/lake satellite records aur ground revenue survey ke mutabiq <strong>sookh kar astitva se mit gaya hai</strong>. 
                  {wbis.extinctionReason || ' Historical water spread area has shrunk to 0.0 Hectares with heavy urban encroachment, silt chokes, or dry bed abandonment.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 text-xs font-bold overflow-x-auto shrink-0 select-none">
          <button
            onClick={() => setActiveTab('wbis')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'wbis' 
                ? 'border-[#0047ab] text-[#0047ab] bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Satellite className="w-4 h-4 text-[#0047ab]" />
            <span>{isGroundwater ? '15-Day GWIS Satellite & Spring Telemetry' : isRiver ? '15-Day River Basin Telemetry' : '15-Day WBIS Satellite Telemetry'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ndwi')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'ndwi' 
                ? 'border-[#0047ab] text-[#0047ab] bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gauge className="w-4 h-4 text-emerald-600" />
            <span>{isGroundwater ? 'DWLR Aquifer Depth & Spring Analytics' : isRiver ? 'River Stage & Discharge Analytics' : 'NDWI Water Spread & Capacity'}</span>
          </button>

          <button
            onClick={() => setActiveTab('field')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'field' 
                ? 'border-[#0047ab] text-[#0047ab] bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Ground Truth & Water Quality</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 px-4 border-b-2 transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
              activeTab === 'api' 
                ? 'border-[#0047ab] text-[#0047ab] bg-white' 
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-purple-600" />
            <span>ISRO Bhuvan Live API Handshake</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: 15-DAY WBIS SATELLITE PASS */}
          {activeTab === 'wbis' && (
            <div className="space-y-5">
              {/* Mission & Satellite Pass Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Satellite Constellation</span>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Satellite className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{wbis.satelliteMission}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">{wbis.sensorName}</span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">15-Day Cycle Timing</span>
                  <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Last Pass: {wbis.last15DayPassDate}</span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                    Next Pass: {wbis.nextPassDate} (in ~14 days)
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Optical Fidelity</span>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    Cloud Obscuration: {wbis.cloudCoverPercent}%
                  </div>
                  <span className="text-[11px] text-slate-500 block mt-1">
                    Spatial Resolution: {isGroundwater ? '5.8m LISS-IV / 10m Sentinel-2' : '56m AWiFS / 10m Multi-spectral'}
                  </span>
                </div>
              </div>

              {/* 15-Day Satellite Chronology Timeline */}
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-400" />
                    <span>
                      {isGroundwater 
                        ? 'ISRO Bhuvan GWIS 15-Day Aquifer & Spring Telemetry Timeline' 
                        : 'ISRO Bhuvan 15-Day Satellite Pass Timeline (Andhra Pradesh Circle)'}
                    </span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-mono">15-Day Recurrence Interval</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Previous Pass */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Previous Orbit (15 Days Ago)</span>
                    <span className="text-xs font-bold text-slate-200 mt-1 block">{wbis.previousPassDate}</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isExtinct 
                        ? 'Satellite reported NDWI < -0.20: Complete dry bed detected.' 
                        : isGroundwater
                        ? 'Sub-surface aquifer storage & hill spring discharge baseline verified.'
                        : 'Baseline water perimeter captured under standard reflectance.'}
                    </p>
                  </div>

                  {/* Latest Pass */}
                  <div className="bg-blue-950/80 border border-blue-700/80 rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-300 block uppercase">Latest Orbit Pass (Recent)</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </div>
                    <span className="text-xs font-bold text-white mt-1 block">{wbis.last15DayPassDate}</span>
                    <p className="text-[11px] text-blue-200 mt-1">
                      {isExtinct
                        ? 'NDWI: ' + wbis.ndwiScore + ' (Zero water detected, dry/encroached soil signature)'
                        : isGroundwater
                        ? `DWLR: ${waterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8}m bgl • Recharge: ${waterBody.liveTelemetry?.rechargeTrend ?? '+1.4m'} • Spring Yield: 92%`
                        : `NDWI: ${wbis.ndwiScore} • Water Spread: ${wbis.waterSpreadAreaHa} ha (${wbis.waterRemainingPercent}% live volume)`}
                    </p>
                  </div>

                  {/* Next Scheduled Pass */}
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3">
                    <span className="text-[10px] font-mono text-slate-400 block uppercase">Next Scheduled Orbit</span>
                    <span className="text-xs font-bold text-amber-300 mt-1 block">{wbis.nextPassDate}</span>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {isGroundwater
                        ? 'ISRO LISS-IV will monitor hydrogeological vegetation canopy & recharge zone.'
                        : "Automated change detection algorithm will compare water surface boundary against today's snapshot."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Water Spread Change & Extinction Status Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center justify-between">
                  <span>{isGroundwater ? 'Hydrogeological Spring Catchment & DWLR Status' : 'Satellite Water Spread Area (WSA) Analysis'}</span>
                  <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
                    isExtinct ? 'bg-slate-200 text-slate-800' :
                    wbis.areaChangePercent >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {wbis.areaChangePercent >= 0 ? `+${wbis.areaChangePercent}%` : `${wbis.areaChangePercent}%`} vs Baseline
                  </span>
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  {isGroundwater ? (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Spring Catchment</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {wbis.waterSpreadAreaHa} <span className="text-xs font-sans text-slate-500">ha</span>
                        </span>
                        <span className="text-[10px] text-slate-500 block">{(wbis.waterSpreadAreaHa * 2.471).toFixed(1)} Acres Protected</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">DWLR Water Depth</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {waterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8} <span className="text-xs font-sans text-slate-500">m bgl</span>
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold block">{waterBody.liveTelemetry?.rechargeTrend ?? '+1.4m Rising'}</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Dynamic Aquifer Head</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {waterBody.waterLevelPercent}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">Perennial Hill Flow</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Spring Water Purity</span>
                        <span className="text-base font-bold font-mono text-emerald-600 mt-0.5 block">
                          {waterBody.tdsPpm} <span className="text-xs font-sans text-slate-500">ppm</span>
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold block">Grade A Mineral Spring</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Current Spread</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {wbis.waterSpreadAreaHa} <span className="text-xs font-sans text-slate-500">ha</span>
                        </span>
                        <span className="text-[10px] text-slate-500 block">{(wbis.waterSpreadAreaHa * 2.471).toFixed(1)} Acres</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Historical Baseline</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {wbis.historicalBaselineHa} <span className="text-xs font-sans text-slate-500">ha</span>
                        </span>
                        <span className="text-[10px] text-slate-500 block">NRSC Atlas (2015-18)</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Live Water Volume</span>
                        <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                          {wbis.waterRemainingPercent}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">{wbis.estimatedVolumeMCM} MCM Storage</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Siltation / Choke</span>
                        <span className={`text-base font-bold font-mono mt-0.5 block ${
                          wbis.siltationIndexPercent > 70 ? 'text-rose-600' :
                          wbis.siltationIndexPercent > 35 ? 'text-amber-600' : 'text-emerald-600'
                        }`}>
                          {wbis.siltationIndexPercent}%
                        </span>
                        <span className="text-[10px] text-slate-500 block">Bed Silt Depth Index</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NDWI WATER INDEX OR DWLR AQUIFER HYDROGEOLOGY */}
          {activeTab === 'ndwi' && (
            <div className="space-y-5">
              {isGroundwater ? (
                <>
                  {/* DWLR Hydrogeology Explanation */}
                  <div className="bg-sky-50/80 border border-sky-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-sky-700" />
                        <span>ISRO Bhuvan GWIS & DWLR Spring Piezometer Telemetry</span>
                      </span>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-sky-300 text-sky-800">
                        CGWB National Aquifer Mapping (NAQUIM)
                      </span>
                    </div>
                    <p className="text-xs text-sky-950 leading-relaxed">
                      ISRO Bhuvan Groundwater Prospects Information System (GWIS) integrates Digital Water Level Recorders (DWLR) with multi-spectral LISS-IV & Sentinel-2 hydrogeological lineament mapping. For <strong>{waterBody.name}</strong>, perennial recharge originates from unconfined/semi-confined fracture granite-gneiss formations in the Eastern Ghats hill range.
                    </p>
                  </div>

                  {/* DWLR Depth Gauge Meter */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Piezometer Aquifer Depth</span>
                        <div className="text-3xl font-black font-mono mt-1 flex items-baseline gap-2">
                          <span className="text-emerald-600">
                            {waterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8} m bgl
                          </span>
                          <span className="text-sm font-sans font-medium text-slate-500">
                            (Depth Below Ground Level • {waterBody.liveTelemetry?.rechargeTrend ?? '+1.4m Rising'})
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider self-start sm:self-auto bg-emerald-600 text-white">
                        HIGH AQUIFER PRESSURE & SPRING FLOW
                      </span>
                    </div>

                    {/* Visual DWLR Depth Bar */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-full rounded-full bg-gradient-to-r from-emerald-600 via-sky-400 via-amber-400 to-rose-600 relative overflow-visible">
                        {(() => {
                          const depth = waterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8;
                          const percent = Math.max(0, Math.min(100, (depth / 20) * 100));
                          return (
                            <div
                              style={{ left: `${percent}%` }}
                              className="absolute -top-1 transform -translate-x-1/2 w-3 h-6 bg-slate-950 border-2 border-white rounded-md shadow-md"
                              title={`Current Depth: ${depth}m bgl`}
                            />
                          );
                        })()}
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>0.0m (Artesian Flow)</span>
                        <span>5.0m (High Spring Yield)</span>
                        <span>10.0m (Normal Aquifer)</span>
                        <span>15.0m (Deep Water)</span>
                        <span>20.0m+ (Depleted)</span>
                      </div>
                    </div>
                  </div>

                  {/* Hill Spring Sanctuary Technical Specs */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Hydrogeological Zone</span>
                      <span className="text-xs font-bold text-slate-800 mt-1 block">Eastern Ghats Fracture Granulite</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">High Secondary Permeability</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Natural Spring Discharge</span>
                      <span className="text-xs font-bold text-blue-700 mt-1 block">140 - 180 Litres / Minute</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">Gravity fed perennial mountain stream</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Aquifer Water Quality</span>
                      <span className="text-xs font-bold text-emerald-700 mt-1 block">TDS: {waterBody.tdsPpm} ppm • Grade A</span>
                      <span className="text-[11px] text-slate-500 mt-0.5 block">Pristine drinking mineral water</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Formula & Explanation */}
                  <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Gauge className="w-4 h-4 text-emerald-700" />
                        <span>Normalized Difference Water Index (NDWI) Standard</span>
                      </span>
                      <span className="text-xs font-mono font-bold bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-800">
                        Formula: (Green - NIR) / (Green + NIR)
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950 leading-relaxed">
                      ISRO Bhuvan WBIS utilizes multi-spectral optical reflectance. Open water bodies absorb Near-Infrared (NIR) radiation while reflecting Green light, resulting in high positive values (&gt;0.2). Silt-choked, dry, or encroached beds reflect high NIR and show negative NDWI values (&lt;0.0).
                    </p>
                  </div>

                  {/* NDWI Score Meter */}
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Spectral Score Gauge</span>
                        <div className="text-3xl font-black font-mono mt-1 flex items-baseline gap-2">
                          <span className={
                            wbis.ndwiScore > 0.3 ? 'text-emerald-600' :
                            wbis.ndwiScore > 0.1 ? 'text-sky-600' :
                            wbis.ndwiScore > 0.0 ? 'text-amber-600' :
                            'text-rose-600'
                          }>
                            {wbis.ndwiScore > 0 ? `+${wbis.ndwiScore.toFixed(2)}` : wbis.ndwiScore.toFixed(2)}
                          </span>
                          <span className="text-sm font-sans font-medium text-slate-500">
                            ({wbis.ndwiClassification})
                          </span>
                        </div>
                      </div>

                      <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider self-start sm:self-auto ${
                        isExtinct ? 'bg-slate-800 text-white' :
                        wbis.ndwiScore > 0.3 ? 'bg-emerald-600 text-white' :
                        wbis.ndwiScore > 0.1 ? 'bg-sky-600 text-white' :
                        wbis.ndwiScore > 0.0 ? 'bg-amber-600 text-white' :
                        'bg-rose-600 text-white'
                      }`}>
                        {isExtinct ? 'MIT GAYA / EXTINCT BED' : wbis.ndwiScore > 0.2 ? 'VIBRANT WATER SPREAD' : 'DEPLETION ALERT'}
                      </span>
                    </div>

                    {/* Visual NDWI Gradient Bar */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-full rounded-full bg-gradient-to-r from-rose-600 via-amber-400 via-sky-400 to-emerald-600 relative overflow-visible">
                        {(() => {
                          const percent = Math.max(0, Math.min(100, ((wbis.ndwiScore + 1) / 2) * 100));
                          return (
                            <div
                              style={{ left: `${percent}%` }}
                              className="absolute -top-1 transform -translate-x-1/2 w-3 h-6 bg-slate-950 border-2 border-white rounded-md shadow-md"
                              title={`Current NDWI: ${wbis.ndwiScore}`}
                            />
                          );
                        })()}
                      </div>

                      <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                        <span>-1.0 (Built-up / Concrete)</span>
                        <span>-0.2 (Dry Soil / Extinct)</span>
                        <span>0.0 (Marsh / Mud)</span>
                        <span>+0.3 (Shallow Water)</span>
                        <span>+1.0 (Deep Pristine Water)</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* 6-Month 15-Day Cycles Historical Trend */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                  Past 6 Satellite Cycles (15-Day Pass History)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                  {[
                    { pass: 'Pass #1 (Jul 18)', score: isExtinct ? -0.22 : isGroundwater ? 0.22 : +0.48, status: isExtinct ? 'Dry' : isGroundwater ? 'Pristine' : 'High' },
                    { pass: 'Pass #2 (Aug 02)', score: isExtinct ? -0.24 : isGroundwater ? 0.23 : +0.46, status: isExtinct ? 'Dry' : isGroundwater ? 'Pristine' : 'High' },
                    { pass: 'Pass #3 (Aug 17)', score: isExtinct ? -0.25 : isGroundwater ? 0.24 : +0.42, status: isExtinct ? 'Dry' : isGroundwater ? 'Pristine' : 'Normal' },
                    { pass: 'Pass #4 (Sep 01)', score: isExtinct ? -0.27 : isGroundwater ? 0.24 : +0.38, status: isExtinct ? 'Dry' : isGroundwater ? 'Stable' : 'Normal' },
                    { pass: 'Pass #5 (Sep 16)', score: isExtinct ? -0.28 : isGroundwater ? 0.24 : +0.35, status: isExtinct ? 'Dry' : isGroundwater ? 'Stable' : 'Normal' },
                    { pass: 'Pass #6 (Oct 02)', score: wbis.ndwiScore, status: isExtinct ? 'Extinct' : 'Current' },
                  ].map((cycle, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border ${
                      cycle.status === 'Extinct' || cycle.status === 'Dry' 
                        ? 'bg-slate-200/80 border-slate-300 text-slate-700' 
                        : 'bg-white border-slate-200 text-slate-900'
                    }`}>
                      <span className="text-[10px] text-slate-400 block font-mono">{cycle.pass}</span>
                      <span className="text-sm font-bold font-mono block mt-1">
                        {cycle.score > 0 ? `+${cycle.score.toFixed(2)}` : cycle.score.toFixed(2)}
                      </span>
                      <span className="text-[10px] font-semibold text-blue-700 block">{cycle.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GROUND TRUTH & WATER QUALITY */}
          {activeTab === 'field' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Physical Field Coordinates & Survey */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Revenue Cadastral & GPS Coordinates</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">Latitude / Longitude:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-900">
                          {waterBody.coordinates.lat}° N, {waterBody.coordinates.lng}° E
                        </span>
                        <button
                          onClick={handleCopyGps}
                          className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                          title="Copy GPS Coordinates"
                        >
                          {copiedGps ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">Mandal & Village:</span>
                      <span className="font-bold text-slate-900">{waterBody.mandal}, {waterBody.village}</span>
                    </div>

                    <div className="flex justify-between py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">District Circle:</span>
                      <span className="font-bold text-slate-900">{waterBody.district}</span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Last Ground Inspection:</span>
                      <span className="font-mono text-slate-700">{waterBody.lastInspected}</span>
                    </div>
                  </div>
                </div>

                {/* Water Quality & TDS Sensor */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-sky-600" />
                    <span>In-Situ Ground Sensor Telemetry</span>
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">TDS Machine Reading:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {waterBody.tdsPpm ? `${waterBody.tdsPpm} ppm` : '0 ppm (Dry Bed)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">Effluent / Waste Choke:</span>
                      <span className={`font-bold ${
                        waterBody.wasteLevel === 'Heavy' || waterBody.wasteLevel === 'Extinct' ? 'text-rose-600' :
                        waterBody.wasteLevel === 'Moderate' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {waterBody.wasteLevel}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-1 border-b border-slate-200/70">
                      <span className="text-slate-500">Encroachment Risk:</span>
                      <span className={`font-bold ${
                        wbis.encroachmentRisk === 'Total Extinction' || wbis.encroachmentRisk === 'Severe'
                          ? 'text-rose-600'
                          : wbis.encroachmentRisk === 'Moderate'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}>
                        {wbis.encroachmentRisk}
                      </span>
                    </div>

                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Catchment Type:</span>
                      <span className="font-semibold text-slate-800">{waterBody.type}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Station Description */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-700 space-y-1.5">
                <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Official Administrative Dossier
                </span>
                <p className="leading-relaxed text-slate-800 font-normal">
                  {waterBody.description}
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: ISRO BHUVAN LIVE API HANDSHAKE */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-4 h-4 text-amber-300" />
                    <span className="font-bold text-sky-300">ISRO NRSC Bhuvan Gateway API (Connected via Vercel)</span>
                  </div>

                  <button
                    onClick={handlePingBhuvan}
                    disabled={isPingingBhuvan}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isPingingBhuvan ? 'animate-spin' : ''}`} />
                    <span>{isPingingBhuvan ? 'Querying Bhuvan...' : 'Query Live WBIS Endpoint'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-400 block">Gateway Base URL:</span>
                    <span className="text-emerald-400">https://bhuvan-app1.nrsc.gov.in/api/</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">District Coverage:</span>
                    <span className="text-sky-300">{waterBody.district} • Andhra Pradesh</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Server-Side Proxy:</span>
                    <span className="text-slate-200">/api/bhuvan?action=water_bodies</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Satellite Theme:</span>
                    <span className="text-amber-300">LULC Water Bodies & 15-Day WBIS Telemetry</span>
                  </div>
                </div>

                {apiPingResult && (
                  <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto">
                    <span className="text-[10px] text-slate-400 block mb-1">LIVE GATEWAY RESPONSE:</span>
                    <pre className="text-[11px] text-emerald-400 font-mono">
                      {JSON.stringify(apiPingResult, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>NRSC ISRO WBIS Grid • Synced 2026</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onLodgeComplaint && (
              <button
                onClick={() => {
                  onClose();
                  onLodgeComplaint(waterBody);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{isExtinct ? 'Report Encroached / Extinct Bed' : 'Lodge Complain for this Water Body'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
