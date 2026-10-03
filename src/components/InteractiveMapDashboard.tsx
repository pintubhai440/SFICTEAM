import React, { useState, useEffect } from 'react';
import { MicroWatershed } from '../types/watershed';
import { IndiaMapSvg } from './IndiaMapSvg';
import { 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  Info, 
  Droplet, 
  CloudRain, 
  Activity, 
  Maximize2, 
  ArrowRight,
  MapPin,
  Compass,
  Sliders,
  CheckCircle2,
  Calendar,
  Loader2 
} from 'lucide-react';

interface InteractiveMapDashboardProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
  onOpenDetailModal: () => void;
  onOpenLedger: () => void;
  onOpenSimulator: () => void;
}

export const InteractiveMapDashboard: React.FC<InteractiveMapDashboardProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  onOpenDetailModal,
  onOpenLedger,
  onOpenSimulator,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'alerts' | 'active'>('all');
  const [activeLayer, setActiveLayer] = useState<'groundwater' | 'rainfall' | 'satellite' | 'assets' | 'all'>('groundwater');
  const [activeTimeYear, setActiveTimeYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // --- API INTEGRATION STATES ---
  const [liveWrisData, setLiveWrisData] = useState<any>(null);
  const [isFetchingLive, setIsFetchingLive] = useState<boolean>(false);

  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];

  // --- 1. DIRECT BROWSER FETCH FUNCTION ---
  const fetchLiveWrisData = async (districtName: string) => {
    setIsFetchingLive(true);
    setLiveWrisData(null); // Clear previous data
    
    // Calculate Dates (Last 30 days)
    const today = new Date();
    const lastMonth = new Date(today);
    lastMonth.setDate(today.getDate() - 30);
    
    const endDate = today.toISOString().split('T')[0];
    const startDate = lastMonth.toISOString().split('T')[0];

    // URL Encode to handle spaces in district names
    const encodedDistrict = encodeURIComponent(districtName);

    try {
      const response = await fetch(`/api/wris?district=${encodedDistrict}`, { 
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
         console.warn("WRIS API response status:", response.status);
         return;
      }

      const data = await response.json();
      console.log(`Live Data for ${districtName}:`, data);
      setLiveWrisData(data);
      
    } catch (error) {
      console.warn("Live fetch request failed:", error);
    } finally {
      setIsFetchingLive(false);
    }
  };

  // --- 2. TRIGGER API CALL WHEN DISTRICT CHANGES ---
  useEffect(() => {
    if (currentWs?.district) {
      fetchLiveWrisData(currentWs.district);
    }
  }, [currentWs?.district]);

  // Auto-play time slider
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setActiveTimeYear((prev) => (prev >= 2026 ? 2023 : prev + 1));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  const activeAlertsCount = watersheds.filter(
    (w) => w.currentStatus === 'critical' || w.currentStatus === 'stressed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Map Control Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Layer Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-700 flex items-center gap-1 mr-1">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            Layer:
          </span>
          {[
            { id: 'groundwater', label: 'Groundwater Depth (bgl)' },
            { id: 'rainfall', label: 'Rainfall Deficit Anomaly' },
            { id: 'satellite', label: 'Crop / Extraction Proxy' },
            { id: 'assets', label: 'Recharge Structures' },
          ].map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeLayer === layer.id
                  ? 'bg-[#0047ab] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {layer.label}
            </button>
          ))}
        </div>

        {/* Surveillance Filter Buttons */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilterMode('alerts')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
              filterMode === 'alerts'
                ? 'bg-rose-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Alerts</span>
            {activeAlertsCount > 0 && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                filterMode === 'alerts' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700'
              }`}>
                {activeAlertsCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filterMode === 'active'
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Nodes
          </button>
        </div>
      </div>

      {/* Main Visual Map & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Container */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-3 shadow-xs relative flex flex-col justify-between">
          <div className="p-2 flex items-center justify-between border-b border-slate-100 mb-2">
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-blue-900/60 uppercase block">
                SURVEILLANCE GRID • 16 JURISDICTIONS MONITORED
              </span>
              <h3 className="text-sm font-bold text-slate-800">
                National Micro-Watershed Geospatial Telemetry
              </h3>
            </div>
            
            {/* API Status UI Integration */}
            <div className="flex items-center gap-2">
              {isFetchingLive ? (
                <span className="text-[11px] font-mono text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                  <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                  SYNCING INDIA-WRIS...
                </span>
              ) : (
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  LIVE DWLR SYNCHRONIZED
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 w-full">
            <IndiaMapSvg
              watersheds={watersheds}
              selectedWatershedId={selectedWatershedId}
              onSelectWatershed={onSelectWatershed}
              activeLayer={activeLayer}
              filterMode={filterMode}
              activeTimeYear={activeTimeYear}
            />
          </div>

          {/* Time Slider Bar */}
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
                className="w-8 h-8 rounded-lg bg-[#0047ab] text-white flex items-center justify-center hover:bg-blue-700 transition-colors shadow-xs"
                title={isPlayingTimeline ? 'Pause Timeline' : 'Play Timeline'}
              >
                {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <div className="text-xs">
                <span className="text-slate-500 block text-[10px] font-mono uppercase">Timeline Playback</span>
                <span className="font-bold text-slate-800 font-mono">
                  {activeTimeYear} Monsoon Cycle
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {[2023, 2024, 2025, 2026].map((yr) => (
                <button
                  key={yr}
                  onClick={() => setActiveTimeYear(yr)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                    activeTimeYear === yr
                      ? 'bg-[#0047ab] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-500 font-mono hidden sm:block">
              {activeTimeYear === 2026 ? '● Current Active Audit' : '○ Historical Archive'}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 px-2 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Selected Node: <strong className="text-slate-900 font-sans">{currentWs.district} ({currentWs.name.split('(')[0]})</strong></span>
            </div>
            <div>
              {currentWs.currentStatus === 'normal' ? (
                <span className="text-emerald-700 font-bold">ZERO ACTIVE FLAGS</span>
              ) : (
                <span className="text-rose-700 font-bold">{currentWs.activeAlertsCount} ACTIVE CRITICAL FLAGS</span>
              )}
            </div>
          </div>
        </div>

        {/* Selected Micro-Watershed Quick Inspector Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                  WATERSHED TELEMETRY INSPECTOR
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {currentWs.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>{currentWs.district}, {currentWs.state}</span>
                  <span>•</span>
                  <span>{currentWs.basin}</span>
                </div>
              </div>

              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                currentWs.currentStatus === 'critical' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                currentWs.currentStatus === 'stressed' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                currentWs.currentStatus === 'watch' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {currentWs.currentStatus}
              </span>
            </div>

            {/* Stress Score */}
            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Analytical Stress Score</span>
                <span className="font-mono font-bold text-base text-slate-900">{currentWs.stressScore} / 100</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    currentWs.stressScore > 80 ? 'bg-rose-500' :
                    currentWs.stressScore > 60 ? 'bg-amber-500' :
                    'bg-emerald-500'
                  }`}
                  style={{ width: `${currentWs.stressScore}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 Normal</span>
                <span>50 Watch</span>
                <span>75 Stressed</span>
                <span>100 Critical</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-sky-50/60 border border-sky-100 p-3 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Observed Piezometer</span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5">
                  {currentWs.groundwaterCurrentBgl} m bgl
                </span>
                <span className="text-[10px] text-rose-600 block">
                  {currentWs.groundwaterTrend1YrPercent}% vs 1yr
                </span>
              </div>

              <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Seasonal Rainfall</span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5">
                  {currentWs.rainfallCurrentSeasonMm} mm
                </span>
                <span className={`text-[10px] font-semibold block ${currentWs.rainfallDeficitPercent < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {currentWs.rainfallDeficitPercent}% anomaly
                </span>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-100 p-3 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Recharge Assets</span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5">
                  {currentWs.functionalAssetsCount} / {currentWs.totalRechargeAssets}
                </span>
                <span className="text-[10px] text-amber-700 block">
                  {currentWs.needsRepairCount} need desilting
                </span>
              </div>

              <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-lg">
                <span className="text-[10px] text-slate-500 block">Infiltration Rate</span>
                <span className="text-lg font-bold font-mono text-slate-900 block mt-0.5">
                  {currentWs.modelledInfiltrationRateMmDay} mm/day
                </span>
                <span className="text-[10px] text-slate-500 block truncate" title={currentWs.soilType}>
                  {currentWs.soilType.split('(')[0]}
                </span>
              </div>

              {/* LIVE WRIS DATA COMPONENT */}
              <div className="bg-cyan-50/50 border border-cyan-200 p-3 rounded-lg col-span-2">
                <div className="flex items-center justify-between border-b border-cyan-100 pb-1 mb-2">
                  <span className="text-[10px] text-cyan-800 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Droplet className="w-3 h-3" /> Live Reservoir Status (WRIS)
                  </span>
                  {isFetchingLive && <Loader2 className="w-3 h-3 animate-spin text-cyan-600" />}
                </div>
                
                {isFetchingLive ? (
                  <span className="text-xs text-slate-500 block mt-2">Fetching live APWRIMS telemetry...</span>
                ) : (() => {
                  const records: any[] = Array.isArray(liveWrisData) 
                    ? liveWrisData 
                    : liveWrisData?.records || liveWrisData?.data || [];
                  const rec = records[0];
                  if (!rec) {
                    return (
                      <span className="text-xs text-rose-500 block mt-2 font-medium">
                        No active telemetry found for {currentWs.district}
                      </span>
                    );
                  }
                  return (
                    <div className="flex items-end justify-between mt-1">
                      <div>
                        <span className="text-[11px] text-slate-600 font-medium block truncate max-w-[180px]">
                          {rec.reservoirName || rec.stationName || rec.name || 'APWRIMS Station'}
                        </span>
                        <span className="text-lg font-bold font-mono text-cyan-900 block mt-0.5">
                          {rec.currentLiveStorage_MCM 
                            ? `${rec.currentLiveStorage_MCM} MCM` 
                            : rec.currentLiveStorage_BMC 
                            ? `${rec.currentLiveStorage_BMC} BMC` 
                            : 'Active Telemetry'}
                        </span>
                      </div>
                      <div className="text-right">
                         <span className="text-[10px] text-slate-400 block font-mono">
                           {rec.agencyName || liveWrisData?.agency || 'APWRIMS'}
                         </span>
                         <span className="text-[10px] text-slate-600 block font-semibold">
                           {rec.date || 'Today'}
                         </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Stress Driver Snapshot */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block">
                Primary Stress Driver:
              </span>
              <div className="text-xs bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-slate-700">
                <div className="font-bold text-slate-900">
                  {currentWs.stressDecomposition[0].name} ({currentWs.stressDecomposition[0].percentage}%)
                </div>
                <div className="text-slate-600 mt-0.5 text-[11px]">
                  {currentWs.stressDecomposition[0].description}
                </div>
              </div>
            </div>

            {/* Estimated Recovery */}
            <div className="p-3 bg-gradient-to-r from-blue-50 to-sky-50 border border-blue-200 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-sky-800 font-bold uppercase tracking-wider block">
                Modelled Recovery Window
              </span>
              <span className="text-xs font-bold text-[#1b2a4a] block">
                {currentWs.estimatedRecoveryWeeks}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <button
              onClick={onOpenDetailModal}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Open Complete Watershed Water Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onOpenLedger}
                className="py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Water Ledger
              </button>
              <button
                onClick={onOpenSimulator}
                className="py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
              >
                Run Simulator
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
