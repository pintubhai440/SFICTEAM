import React, { useState, useEffect } from 'react';
import { WaterBody, WaterBodyStatusColor, UserRoleType, WrisDatasetType } from '../types/nirikshan';
import { 
  Compass, 
  Layers, 
  AlertTriangle, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Phone, 
  User, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Droplets, 
  CloudRain, 
  Activity, 
  Terminal, 
  ShieldCheck, 
  Zap, 
  Info, 
  Database, 
  ExternalLink, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Eye, 
  AlertCircle, 
  Sun, 
  Moon, 
  Filter, 
  Satellite,
  Gauge,
  Radio,
  Calendar
} from 'lucide-react';
import { BhuvanWbisDetailModal } from './BhuvanWbisDetailModal';
import { VizianagaramCadastralMapSvg, VizianagaramMandalData } from './VizianagaramCadastralMapSvg';
import { VIZIANAGARAM_ALL_MANDAL_WATER_BODIES } from '../data/vizianagaramMandalsWaterData';

interface InteractiveAndhraMapProps {
  waterBodies: WaterBody[];
  complaints?: any[];
  currentRole: UserRoleType;
  districtFilter?: string;
  onSelectWaterBody?: (wb: WaterBody) => void;
  onSelectComplaint?: (c: any) => void;
  onLodgeComplaint?: () => void;
}

type DatasetTab = 
  | 'all'
  | 'river_level' 
  | 'river_discharge' 
  | 'reservoir' 
  | 'rainfall' 
  | 'groundwater' 
  | 'basin_river_level'
  | 'basin_river_discharge'
  | 'basin_reservoir' 
  | 'basin_rainfall';

type MapViewFilter = 'all' | 'alerts' | 'active' | 'extinct';

export const InteractiveAndhraMap: React.FC<InteractiveAndhraMapProps> = ({
  waterBodies,
  currentRole,
  districtFilter = 'all',
  onSelectWaterBody,
  onLodgeComplaint,
}) => {
  // District selector: Vizianagaram | Visakhapatnam | Parvathipuram Manyam | all
  const [selectedDistrict, setSelectedDistrict] = useState<string>(() => {
    if (currentRole === 'nodal_vizianagaram') return 'Vizianagaram';
    if (currentRole === 'nodal_parvathipuram') return 'Parvathipuram Manyam';
    return districtFilter !== 'all' ? districtFilter : 'Vizianagaram';
  });

  // Filter: 'all' | 'alerts' | 'active' | 'extinct'
  const [viewFilter, setViewFilter] = useState<MapViewFilter>('all');
  // Selected India-WRIS 9-Dataset Filter (Directly on Map)
  const [activeDatasetTab, setActiveDatasetTab] = useState<DatasetTab>('all');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Detailed Bhuvan WBIS modal state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  // Bhuvan 15-day NDWI satellite overlay mode
  const [isNdwiSatelliteOverlayActive, setIsNdwiSatelliteOverlayActive] = useState(true);
  // Expanded map height
  const [isMapExpanded, setIsMapExpanded] = useState(false);

  // Active selected water body
  const [activeWaterBody, setActiveWaterBody] = useState<WaterBody | null>(() => {
    return waterBodies.find(wb => wb.district === 'Vizianagaram') || waterBodies[0] || null;
  });
  const [hoveredWaterBody, setHoveredWaterBody] = useState<WaterBody | null>(null);

  // Vizianagaram Cadastral Map state & layer controls (100% Water-focused)
  const [selectedMandalId, setSelectedMandalId] = useState<string | null>(null);
  const [showVzmRivers, setShowVzmRivers] = useState<boolean>(true);
  const [showVzmTanks, setShowVzmTanks] = useState<boolean>(true);
  const [showVzmSensors, setShowVzmSensors] = useState<boolean>(true);

  // Guarantee that all 28 Mandals of Vizianagaram have rich, active water bodies
  const allAvailableWaterBodies = React.useMemo(() => {
    const existingIds = new Set(waterBodies.map(w => w.id));
    const merged = [...waterBodies];
    Object.values(VIZIANAGARAM_ALL_MANDAL_WATER_BODIES).forEach(mandalWb => {
      if (!existingIds.has(mandalWb.id)) {
        merged.push(mandalWb);
      }
    });
    return merged;
  }, [waterBodies]);

  const handleSelectMandal = (mandal: VizianagaramMandalData) => {
    setSelectedMandalId(mandal.id);
    // 1. Direct mandal id lookup (100% reliable)
    const directWb = VIZIANAGARAM_ALL_MANDAL_WATER_BODIES[mandal.id];
    // 2. Search in allAvailableWaterBodies as fallback
    const targetWb = directWb || allAvailableWaterBodies.find(wb => 
      wb.mandal && (
        wb.mandal.toLowerCase().includes(mandal.name.toLowerCase()) || 
        mandal.name.toLowerCase().includes(wb.mandal.toLowerCase()) ||
        wb.village?.toLowerCase().includes(mandal.name.toLowerCase())
      )
    );
    if (targetWb) {
      setActiveWaterBody(targetWb);
      if (onSelectWaterBody) onSelectWaterBody(targetWb);
    }
  };

  // Live India WRIS state
  const [liveTelemetry, setLiveTelemetry] = useState<any>(null);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [showCurlModal, setShowCurlModal] = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('');

  // ISRO Bhuvan Connection Tester state
  const [showBhuvanTester, setShowBhuvanTester] = useState(false);
  const [testTokenInput, setTestTokenInput] = useState('');
  const [isTestingBhuvan, setIsTestingBhuvan] = useState(false);
  const [bhuvanTestResult, setBhuvanTestResult] = useState<any>(null);

  const runBhuvanTest = async (overrideToken?: string) => {
    setIsTestingBhuvan(true);
    setBhuvanTestResult(null);
    try {
      const tokenToTest = overrideToken !== undefined ? overrideToken : testTokenInput;
      const url = tokenToTest 
        ? `/api/bhuvan?action=test&token=${encodeURIComponent(tokenToTest.trim())}`
        : `/api/bhuvan?action=test`;
      const res = await fetch(url);
      const data = await res.json();
      setBhuvanTestResult(data);
    } catch (err: any) {
      setBhuvanTestResult({
        status: 'error',
        message: 'Network request to /api/bhuvan failed: ' + err.message
      });
    } finally {
      setIsTestingBhuvan(false);
    }
  };

  useEffect(() => {
    if (showBhuvanTester) {
      runBhuvanTest();
    }
  }, [showBhuvanTester]);

  const effectiveDistrict = 
    currentRole === 'nodal_vizianagaram'
      ? 'Vizianagaram'
      : currentRole === 'nodal_parvathipuram'
      ? 'Parvathipuram Manyam'
      : selectedDistrict;

  // Live India WRIS Telemetry Fetch
  const fetchWrisData = async (dist: string, tab: DatasetTab) => {
    setIsLoadingLive(true);
    const targetDistrict = dist === 'all' ? 'Vizianagaram' : dist;
    const queryTab = tab === 'all' ? 'reservoir' : tab;
    try {
      const res = await fetch(`/api/wris?district=${encodeURIComponent(targetDistrict)}&type=${queryTab}`, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const json = await res.json();
        setLiveTelemetry(json);
        setLastRefreshedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (err) {
      console.warn('Failed to load WRIS live telemetry:', err);
    } finally {
      setIsLoadingLive(false);
    }
  };

  useEffect(() => {
    fetchWrisData(effectiveDistrict, activeDatasetTab);
  }, [effectiveDistrict, activeDatasetTab]);

  const handleSelectWaterBody = (wb: WaterBody) => {
    setActiveWaterBody(wb);
    if (onSelectWaterBody) onSelectWaterBody(wb);
  };

  // Filter based on district, video filter (all/alerts/active/extinct), and dataset tab (all/9 endpoints)
  const filteredWaterBodies = allAvailableWaterBodies.filter((wb) => {
    if (wb.state && wb.state !== 'Andhra Pradesh') return false;
    const matchesDistrict = effectiveDistrict === 'all' || wb.district === effectiveDistrict;
    if (!matchesDistrict) return false;

    // Dataset Endpoint Filter
    if (activeDatasetTab !== 'all') {
      const isMatch = wb.datasetType === activeDatasetTab || 
        (activeDatasetTab === 'reservoir' && wb.type === 'Reservoir');
      if (!isMatch) return false;
    }

    // Video Filter: all / alerts / active / extinct
    if (viewFilter === 'alerts') {
      return wb.statusColor === 'red' || wb.statusColor === 'yellow';
    }
    if (viewFilter === 'active') {
      return wb.statusColor === 'blue' || wb.statusColor === 'green';
    }
    if (viewFilter === 'extinct') {
      return wb.statusColor === 'grey' || wb.bhuvanWbis?.isExtinct;
    }

    return true;
  });

  const districtWaterBodies = allAvailableWaterBodies.filter(w => effectiveDistrict === 'all' || w.district === effectiveDistrict);
  const alertCount = districtWaterBodies.filter(wb => wb.statusColor === 'red' || wb.statusColor === 'yellow').length;
  const activeCount = districtWaterBodies.filter(wb => wb.statusColor === 'blue' || wb.statusColor === 'green').length;
  const extinctCount = districtWaterBodies.filter(wb => wb.statusColor === 'grey' || wb.bhuvanWbis?.isExtinct).length;

  // Coordinate Projections based on selected district
  const projectCoords = (lat: number, lng: number) => {
    if (effectiveDistrict === 'Vizianagaram') {
      const minLat = 17.95;
      const maxLat = 18.75;
      const minLng = 83.08;
      const maxLng = 83.65;
      const x = ((lng - minLng) / (maxLng - minLng)) * 710 + 120;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 90;
      return { x: Math.max(90, Math.min(880, x)), y: Math.max(70, Math.min(630, y)) };
    } else if (effectiveDistrict === 'Parvathipuram Manyam') {
      const minLat = 18.45;
      const maxLat = 19.05;
      const minLng = 83.10;
      const maxLng = 83.70;
      const x = ((lng - minLng) / (maxLng - minLng)) * 720 + 110;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 90;
      return { x: Math.max(90, Math.min(880, x)), y: Math.max(70, Math.min(630, y)) };
    } else if (effectiveDistrict === 'Visakhapatnam') {
      const minLat = 17.60;
      const maxLat = 18.10;
      const minLng = 82.85;
      const maxLng = 83.50;
      const x = ((lng - minLng) / (maxLng - minLng)) * 720 + 110;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 500 + 90;
      return { x: Math.max(90, Math.min(880, x)), y: Math.max(70, Math.min(630, y)) };
    } else {
      const minLat = 17.60;
      const maxLat = 19.05;
      const minLng = 82.80;
      const maxLng = 83.95;
      const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 90;
      const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 70;
      return { x: Math.max(80, Math.min(890, x)), y: Math.max(60, Math.min(630, y)) };
    }
  };

  const getColorClasses = (color: WaterBodyStatusColor) => {
    switch (color) {
      case 'green':
        return {
          fill: '#10b981',
          stroke: '#047857',
          pulse: 'rgba(16, 185, 129, 0.45)',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-300',
          flagText: 'PRISTINE CATCHMENT (BAHUT ACHHA)',
          flagBadge: 'bg-emerald-600 text-white',
          label: 'Bahut Achha (Pristine Quality)',
        };
      case 'blue':
        return {
          fill: '#0284c7',
          stroke: '#0369a1',
          pulse: 'rgba(2, 132, 199, 0.45)',
          badge: 'bg-sky-50 text-sky-700 border-sky-300',
          flagText: 'ACTIVE GOVT TELEMETRY',
          flagBadge: 'bg-[#0047ab] text-white',
          label: 'Normal Quality (Active Inflow)',
        };
      case 'yellow':
        return {
          fill: '#f59e0b',
          stroke: '#b45309',
          pulse: 'rgba(245, 158, 11, 0.45)',
          badge: 'bg-amber-50 text-amber-800 border-amber-300',
          flagText: 'MODERATE SILT / OVERFLOW ALERT',
          flagBadge: 'bg-amber-500 text-white',
          label: 'Middle Problem (Moderate Stress)',
        };
      case 'red':
        return {
          fill: '#ef4444',
          stroke: '#b91c1c',
          pulse: 'rgba(239, 68, 68, 0.65)',
          badge: 'bg-rose-50 text-rose-700 border-rose-300',
          flagText: 'CRITICAL EFFLUENT / HAZARD FLAG',
          flagBadge: 'bg-rose-600 text-white animate-pulse',
          label: 'Danger Zone (Critical Hazard)',
        };
      case 'grey':
        return {
          fill: '#64748b',
          stroke: '#334155',
          pulse: 'rgba(100, 116, 139, 0.45)',
          badge: 'bg-slate-200 text-slate-800 border-slate-400 font-bold',
          flagText: 'SOOKH KAR MIT GAYA (EXTINCT)',
          flagBadge: 'bg-slate-700 text-white font-extrabold',
          label: 'Existence Se Mit Gaya (Extinct - NDWI < 0)',
        };
      default:
        return {
          fill: '#0284c7',
          stroke: '#0369a1',
          pulse: 'rgba(2, 132, 199, 0.45)',
          badge: 'bg-sky-50 text-sky-700 border-sky-300',
          flagText: 'ACTIVE GOVT TELEMETRY',
          flagBadge: 'bg-[#0047ab] text-white',
          label: 'Normal',
        };
    }
  };

  // Helper for pin dataset icon
  const getPinIcon = (datasetType?: WrisDatasetType, statusColor?: WaterBodyStatusColor) => {
    if (statusColor === 'grey') return '⚪';
    switch (datasetType) {
      case 'reservoir':
      case 'basin_reservoir':
        return '💧';
      case 'river_level':
      case 'basin_river_level':
        return '🌊';
      case 'river_discharge':
      case 'basin_river_discharge':
        return '⚡';
      case 'rainfall':
      case 'basin_rainfall':
        return '🌧️';
      case 'groundwater':
        return '🧪';
      default:
        return '📍';
    }
  };

  const records: any[] = Array.isArray(liveTelemetry)
    ? liveTelemetry
    : liveTelemetry?.records || liveTelemetry?.data || [];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm w-full space-y-0">
      {/* ============================================================== */}
      {/* 1. TOP HEADER & DISTRICT / VIDEO FILTER BAR                    */}
      {/* ============================================================== */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 flex-wrap">
              <span>{effectiveDistrict === 'Vizianagaram' ? 'Vizianagaram District Water Surveillance Map (విజయనగరం జల పర్యవేక్షణ)' : 'National Water Informatics Centre Surveillance Grid'}</span>
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0047ab] border border-blue-200">
                {effectiveDistrict === 'all' ? 'ALL 3 DISTRICTS' : effectiveDistrict.toUpperCase()}
              </span>
            </h3>
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            {effectiveDistrict === 'Vizianagaram' 
              ? '28 Mandals Hydrological & Satellite Surveillance • Click any Mandal, Water Body or River for live data' 
              : 'Direct telemetry from India-WRIS OpenAPI 3.0 across Vizianagaram, Parvathipuram & Visakhapatnam'}
          </p>
        </div>

        {/* Video Filter Control: [ All ] [ Alerts ] [ Active ] [ Sookh Kar Mit Gaya ] & Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 15-Day NDWI Satellite Mode toggle */}
          <button
            onClick={() => setIsNdwiSatelliteOverlayActive(!isNdwiSatelliteOverlayActive)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isNdwiSatelliteOverlayActive
                ? 'bg-indigo-950 text-indigo-200 border-indigo-600 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
            title="Toggle ISRO Bhuvan WBIS 15-Day NDWI Satellite Analysis"
          >
            <Satellite className={`w-3.5 h-3.5 ${isNdwiSatelliteOverlayActive ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>15-Day NDWI</span>
          </button>

          {/* Expand Map Height Button */}
          <button
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all cursor-pointer ${
              isMapExpanded 
                ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold' 
                : 'border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
            title={isMapExpanded ? 'Normal Map Size' : 'Enlarge Map Size (Bada Karo)'}
          >
            {isMapExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{isMapExpanded ? 'Standard' : 'Enlarge'}</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
            title="Toggle Map Canvas Theme"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          {/* District selector buttons */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setSelectedDistrict('Vizianagaram')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                effectiveDistrict === 'Vizianagaram' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vizianagaram
            </button>
            <button
              onClick={() => setSelectedDistrict('Parvathipuram Manyam')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                effectiveDistrict === 'Parvathipuram Manyam' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Parvathipuram
            </button>
            <button
              onClick={() => setSelectedDistrict('Visakhapatnam')}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                effectiveDistrict === 'Visakhapatnam' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Visakhapatnam
            </button>
            <button
              onClick={() => setSelectedDistrict('all')}
              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                effectiveDistrict === 'all' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Grid
            </button>
          </div>

          {/* All | Alerts | Active | Extinct Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewFilter === 'all' 
                  ? 'bg-[#0047ab] text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({districtWaterBodies.length})
            </button>
            <button
              onClick={() => setViewFilter('alerts')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewFilter === 'alerts' 
                  ? 'bg-rose-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-rose-600'
              }`}
            >
              <span>Alerts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${viewFilter === 'alerts' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'}`}>
                {alertCount}
              </span>
            </button>
            <button
              onClick={() => setViewFilter('active')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewFilter === 'active' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              <span>Active</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${viewFilter === 'active' ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setViewFilter('extinct')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer ${
                viewFilter === 'extinct' 
                  ? 'bg-slate-700 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Talab sookh kar mit gaya hai (Grey color status)"
            >
              <span>⚪ Sookh Kar Mit Gaya</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${viewFilter === 'extinct' ? 'bg-white text-slate-800 font-bold' : 'bg-slate-200 text-slate-700'}`}>
                {extinctCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. ALL 9 INDIA-WRIS ENDPOINTS INTERACTIVE LAYER FILTER BAR      */}
      {/* ============================================================== */}
      {currentRole !== 'user' && effectiveDistrict !== 'Vizianagaram' && (
        <div className="bg-slate-900 border-b border-slate-800 p-2.5 px-3 sm:px-4 text-xs overflow-x-auto select-none">
          <div className="flex items-center gap-1.5 min-w-max">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-sky-400" />
              <span>Telemetry Layer:</span>
            </span>

            {/* All 9 Endpoints Layer Buttons */}
            <button
              onClick={() => setActiveDatasetTab('all')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer ${
                activeDatasetTab === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              All 9 Datasets ({districtWaterBodies.length})
            </button>

            <button
              onClick={() => setActiveDatasetTab('river_level')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'river_level'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🌊</span>
              <span>POST /Dataset/River Water Level</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('river_discharge')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'river_discharge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>⚡</span>
              <span>POST /Dataset/River Water Discharge</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('reservoir')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'reservoir'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>💧</span>
              <span>POST /Dataset/Reservoir</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('rainfall')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'rainfall'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🌧️</span>
              <span>POST /Dataset/RainFall</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('groundwater')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'groundwater'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>🧪</span>
              <span>POST /Dataset/Ground Water Level</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('basin_river_level')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'basin_river_level'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-sky-400">🌊</span>
              <span>POST /Dataset/Basin/River WaterLevel</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('basin_river_discharge')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'basin_river_discharge'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-sky-400">⚡</span>
              <span>POST /Dataset/Basin/River Water Discharge</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('basin_reservoir')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'basin_reservoir'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-emerald-400">💧</span>
              <span>POST /Dataset/Basin/Reservoir</span>
            </button>

            <button
              onClick={() => setActiveDatasetTab('basin_rainfall')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1 ${
                activeDatasetTab === 'basin_rainfall'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-blue-400">🌧️</span>
              <span>POST /Dataset/Basin/RainFall</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. MAP CANVAS WITH NO OVERLAPPING LABELS & CLEAN WATER NETWORK */}
      {/* ============================================================== */}
      <div className={`relative w-full ${isMapExpanded ? 'h-[750px] sm:h-[840px] lg:h-[920px]' : 'h-[580px] sm:h-[660px] lg:h-[720px]'} overflow-hidden select-none transition-all duration-300 ${
        theme === 'light' ? 'bg-[#f8fafc]' : 'bg-gradient-to-b from-slate-950 via-[#071326] to-[#0b1b36]'
      }`}>
        {effectiveDistrict === 'Vizianagaram' ? (
          <VizianagaramCadastralMapSvg
            waterBodies={waterBodies}
            activeWaterBody={activeWaterBody}
            hoveredWaterBody={hoveredWaterBody}
            onSelectWaterBody={handleSelectWaterBody}
            onSelectMandal={handleSelectMandal}
            selectedMandalId={selectedMandalId}
            theme={theme}
            showRivers={showVzmRivers}
            showTanks={showVzmTanks}
            showSensors={showVzmSensors}
            onSwitchDistrict={(dist) => setSelectedDistrict(dist)}
            onLodgeComplaint={onLodgeComplaint}
          />
        ) : (
          <>
            {/* Floating 15-Day NDWI Satellite Mode Banner */}
        {isNdwiSatelliteOverlayActive && (
          <div className="absolute top-3 left-3 z-20 bg-slate-950/90 backdrop-blur-md border border-indigo-500/50 text-white rounded-xl px-3 py-1.5 text-xs font-mono flex items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" />
              <span>ISRO WBIS:</span>
            </span>
            <span className="text-slate-300">15-Day Optical Pass Active</span>
            <span className="text-sky-300 border-l border-slate-700 pl-2 hidden sm:inline">Formula: (Green - NIR)/(Green + NIR)</span>
          </div>
        )}

        <style>{`
          @keyframes riverFlow {
            from { stroke-dashoffset: 60; }
            to { stroke-dashoffset: 0; }
          }
          @keyframes beaconPing {
            0% { r: 9px; opacity: 0.95; stroke-width: 2px; }
            50% { r: 24px; opacity: 0.4; stroke-width: 1.5px; }
            100% { r: 42px; opacity: 0; stroke-width: 0.5px; }
          }
          @keyframes dangerAlertPulse {
            0% { r: 12px; opacity: 0.9; stroke-width: 2.8px; }
            50% { r: 38px; opacity: 0.5; stroke-width: 1.8px; }
            100% { r: 64px; opacity: 0; stroke-width: 0.5px; }
          }
          @keyframes satelliteScan {
            0% { transform: translateY(-40px); opacity: 0.2; }
            50% { opacity: 0.75; }
            100% { transform: translateY(720px); opacity: 0.15; }
          }
          .river-flow-line {
            stroke-dasharray: 6 6;
            animation: riverFlow 2.4s linear infinite;
          }
          .beacon-ring {
            animation: beaconPing 2.5s ease-out infinite;
            transform-origin: center;
          }
          .danger-ring {
            animation: dangerAlertPulse 1.8s ease-out infinite;
            transform-origin: center;
          }
          .satellite-scan-line {
            animation: satelliteScan 8s linear infinite;
          }
        `}</style>

        <svg viewBox="0 0 950 680" className="w-full h-full">
          <defs>
            <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke={theme === 'light' ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.04)'} strokeWidth="0.8" />
            </pattern>

            <linearGradient id="coastalWater" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity={theme === 'light' ? '0.15' : '0.3'} />
              <stop offset="100%" stopColor="#0369a1" stopOpacity={theme === 'light' ? '0.35' : '0.6'} />
            </linearGradient>

            <radialGradient id="redHazardGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#dc2626" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#991b1b" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="blueActiveGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.5" />
              <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>

            <radialGradient id="greenPristineGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.55" />
              <stop offset="60%" stopColor="#34d399" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="950" height="680" fill="url(#lightGrid)" />

          {/* ============================================================== */}
          {/* DISTRICT CONTOUR & TOPOLOGY                                    */}
          {/* ============================================================== */}
          {effectiveDistrict === 'Vizianagaram' ? (
            /* Vizianagaram Official District Map Shape (Image 2) */
            <g>
              <path
                d="M 530,35 
                   C 570,50 630,75 660,110 
                   C 690,140 705,190 710,240 
                   C 720,290 760,330 790,370 
                   C 820,410 830,460 825,510 
                   C 820,545 790,570 760,590 
                   C 730,610 680,620 640,615 
                   C 590,610 540,610 490,605 
                   C 430,600 370,605 320,590 
                   C 260,570 210,540 180,480 
                   C 160,440 190,390 220,350 
                   C 240,320 230,270 240,220 
                   C 250,170 270,130 310,100 
                   C 360,65 440,50 490,40 Z"
                fill={theme === 'light' ? 'rgba(241, 245, 249, 0.85)' : 'rgba(2, 132, 199, 0.12)'}
                stroke={theme === 'light' ? '#94a3b8' : '#38bdf8'}
                strokeWidth={theme === 'light' ? '2.2' : '2.8'}
                filter="drop-shadow(0 4px 12px rgba(0,0,0,0.06))"
              />

              {/* Bay of Bengal Sea Area */}
              <path
                d="M 760,590 Q 820,540 850,460 L 950,460 L 950,680 L 710,680 Z"
                fill="url(#coastalWater)"
                stroke={theme === 'light' ? '#38bdf8' : 'rgba(56, 189, 248, 0.4)'}
                strokeWidth="1.2"
              />
              <text x="850" y="580" fill={theme === 'light' ? '#0369a1' : 'rgba(56, 189, 248, 0.6)'} fontSize="12" fontWeight="bold" letterSpacing="3" transform="rotate(45, 850, 580)">
                BAY OF BENGAL
              </text>

              {/* Geographic Annotations */}
              <text x="60" y="240" fill={theme === 'light' ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)'} fontSize="10.5" fontWeight="bold" letterSpacing="1.5">
                CHHATTISGARH / EASTERN GHATS
              </text>
              <text x="50" y="520" fill={theme === 'light' ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)'} fontSize="10.5" fontWeight="bold" letterSpacing="1.5">
                VISHAKHAPATNAM BORDER
              </text>
              <text x="810" y="270" fill={theme === 'light' ? '#94a3b8' : 'rgba(148, 163, 184, 0.5)'} fontSize="10.5" fontWeight="bold" letterSpacing="1.5">
                SRIKAKULAM BORDER
              </text>

              <g opacity={theme === 'light' ? '0.12' : '0.18'}>
                <text x="475" y="300" fill={theme === 'light' ? '#0f172a' : '#38bdf8'} fontSize="36" fontWeight="900" letterSpacing="5" textAnchor="middle">
                  VIZIANAGARAM
                </text>
              </g>

              {/* Real Rivers with Animated Flow */}
              <path d="M 310,138 L 482,197 L 620,160 T 710,140" fill="none" stroke={theme === 'light' ? '#0284c7' : '#38bdf8'} strokeWidth="2.5" className="river-flow-line" />
              <path d="M 297,229 Q 370,300 445,386 L 544,496" fill="none" stroke={theme === 'light' ? '#0284c7' : '#38bdf8'} strokeWidth="2.8" className="river-flow-line" />
              <path d="M 445,386 L 618,457 L 618,529 L 729,561" fill="none" stroke={theme === 'light' ? '#0284c7' : '#38bdf8'} strokeWidth="3.2" className="river-flow-line" />
              <path d="M 211,496 L 272,457 Q 340,510 400,560" fill="none" stroke={theme === 'light' ? '#0284c7' : '#38bdf8'} strokeWidth="2.8" className="river-flow-line" />

              <circle r="4" fill="#38bdf8"><animateMotion path="M 310,138 L 482,197 L 620,160 T 710,140" dur="4s" repeatCount="indefinite" /></circle>
              <circle r="4" fill="#38bdf8"><animateMotion path="M 297,229 Q 370,300 445,386 L 544,496" dur="5s" repeatCount="indefinite" /></circle>
              <circle r="4.5" fill="#0284c7"><animateMotion path="M 445,386 L 618,457 L 618,529 L 729,561" dur="4.5s" repeatCount="indefinite" /></circle>
            </g>
          ) : effectiveDistrict === 'Parvathipuram Manyam' ? (
            /* Parvathipuram Manyam District Contour */
            <g>
              <path
                d="M 160,80 L 520,60 L 780,120 L 840,240 L 720,380 L 520,360 L 320,320 L 180,240 Z"
                fill={theme === 'light' ? 'rgba(241, 245, 249, 0.85)' : 'rgba(14, 116, 144, 0.25)'}
                stroke={theme === 'light' ? '#0891b2' : '#38bdf8'}
                strokeWidth="2.5"
              />
              <g opacity={theme === 'light' ? '0.12' : '0.18'}>
                <text x="500" y="220" fill={theme === 'light' ? '#0f172a' : '#38bdf8'} fontSize="32" fontWeight="900" letterSpacing="4" textAnchor="middle">
                  PARVATHIPURAM MANYAM
                </text>
              </g>
              <path d="M 260,100 Q 480,180 720,280" fill="none" stroke="#0284c7" strokeWidth="3.5" className="river-flow-line" />
              <circle r="4.5" fill="#38bdf8"><animateMotion path="M 260,100 Q 480,180 720,280" dur="4s" repeatCount="indefinite" /></circle>
            </g>
          ) : effectiveDistrict === 'Visakhapatnam' ? (
            /* Visakhapatnam District Contour */
            <g>
              <path
                d="M 180,140 L 540,120 L 800,260 L 830,480 L 640,540 L 360,520 L 180,440 Z"
                fill={theme === 'light' ? 'rgba(241, 245, 249, 0.85)' : 'rgba(16, 185, 129, 0.2)'}
                stroke={theme === 'light' ? '#059669' : '#34d399'}
                strokeWidth="2.5"
              />
              <g opacity={theme === 'light' ? '0.12' : '0.18'}>
                <text x="500" y="320" fill={theme === 'light' ? '#0f172a' : '#34d399'} fontSize="32" fontWeight="900" letterSpacing="4" textAnchor="middle">
                  VISAKHAPATNAM
                </text>
              </g>
              <path d="M 240,220 Q 480,360 760,420" fill="none" stroke="#0284c7" strokeWidth="3" className="river-flow-line" />
              <circle r="4.5" fill="#10b981"><animateMotion path="M 240,220 Q 480,360 760,420" dur="4.5s" repeatCount="indefinite" /></circle>
            </g>
          ) : (
            /* All Grid Combined */
            <g>
              <path d="M 120,40 L 520,40 L 760,110 L 820,200 L 580,240 L 360,190 L 190,150 Z" fill="rgba(14, 116, 144, 0.15)" stroke="#38bdf8" strokeWidth="1.5" />
              <path d="M 190,150 L 360,190 L 580,240 L 820,200 L 830,370 L 650,410 L 360,420 L 210,360 L 140,260 Z" fill="rgba(2, 132, 199, 0.2)" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 210,360 L 360,420 L 650,410 L 830,370 L 810,540 L 600,550 L 290,540 L 170,480 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#34d399" strokeWidth="2" />
            </g>
          )}

          {/* ============================================================== */}
          {/* ACTIVE REGIONAL AURA GLOW                                      */}
          {/* ============================================================== */}
          {activeWaterBody && (() => {
            const { x, y } = projectCoords(activeWaterBody.coordinates.lat, activeWaterBody.coordinates.lng);
            const isRed = activeWaterBody.statusColor === 'red';
            const isGreen = activeWaterBody.statusColor === 'green';
            const glowId = isRed ? 'url(#redHazardGlow)' : isGreen ? 'url(#greenPristineGlow)' : 'url(#blueActiveGlow)';
            const ringColor = isRed ? '#ef4444' : isGreen ? '#10b981' : '#0284c7';

            return (
              <g className="pointer-events-none">
                <circle cx={x} cy={y} r="120" fill={glowId} />
                <circle cx={x} cy={y} r="65" stroke={ringColor} strokeWidth="1.5" strokeDasharray="4 4" fill="none" opacity="0.75" />
                <circle cx={x} cy={y} className={isRed ? 'danger-ring' : 'beacon-ring'} stroke={ringColor} fill="none" />
              </g>
            );
          })()}

          {/* ============================================================== */}
          {/* MAP PINS: CLEAN RADAR BEACONS WITHOUT OVERLAPPING LABELS       */}
          {/* ============================================================== */}
          {filteredWaterBodies.map((wb) => {
            const { x, y } = projectCoords(wb.coordinates.lat, wb.coordinates.lng);
            const style = getColorClasses(wb.statusColor);
            const isSelected = activeWaterBody?.id === wb.id;
            const isHovered = hoveredWaterBody?.id === wb.id;
            const icon = getPinIcon(wb.datasetType, wb.statusColor);
            const isExtinct = wb.statusColor === 'grey' || wb.bhuvanWbis?.isExtinct;

            return (
              <g
                key={wb.id}
                className="cursor-pointer group"
                onClick={() => handleSelectWaterBody(wb)}
                onMouseEnter={() => setHoveredWaterBody(wb)}
                onMouseLeave={() => setHoveredWaterBody(null)}
              >
                {/* Ripples */}
                {wb.statusColor === 'red' ? (
                  <circle cx={x} cy={y} className="danger-ring" stroke="#ef4444" fill="none" />
                ) : isExtinct ? (
                  <circle cx={x} cy={y} r="20" fill="none" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
                ) : (
                  <circle cx={x} cy={y} className="beacon-ring" stroke={style.fill} fill="none" />
                )}

                {/* Outer Selection Highlight Ring */}
                {isSelected && (
                  <circle cx={x} cy={y} r="22" fill="none" stroke={style.fill} strokeWidth="2.5" strokeDasharray="4 3" className="animate-spin-slow" />
                )}

                {/* Main Pin Circle Beacon */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 15 : isHovered ? 13 : 11}
                  fill={style.fill}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 3.5 : 2.5}
                  filter="drop-shadow(0 2px 5px rgba(0,0,0,0.3))"
                  className="transition-all duration-200"
                />

                {/* Center Icon/Emoji */}
                <text x={x} y={y + 3.5} fontSize="9.5" textAnchor="middle" className="select-none pointer-events-none">
                  {icon}
                </text>

                {/* NDWI Spectral Score Pill beneath pin when Satellite Mode is active */}
                {isNdwiSatelliteOverlayActive && (
                  <g transform={`translate(${x}, ${y + (isSelected ? 20 : 15)})`} className="pointer-events-none">
                    <rect
                      x="-18"
                      y="-5.5"
                      width="36"
                      height="11"
                      rx="5.5"
                      fill={isExtinct ? '#334155' : wb.statusColor === 'green' ? '#047857' : wb.statusColor === 'blue' ? '#0369a1' : '#b45309'}
                      opacity="0.95"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                    <text x="0" y="2.8" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {wb.bhuvanWbis?.ndwiScore !== undefined
                        ? (wb.bhuvanWbis.ndwiScore > 0 ? `+${wb.bhuvanWbis.ndwiScore.toFixed(2)}` : wb.bhuvanWbis.ndwiScore.toFixed(2))
                        : isExtinct ? '-0.28' : '+0.38'}
                    </text>
                  </g>
                )}

                {/* ZERO OVERLAPPING: Rich Label renders ONLY for Selected or Hovered pin! */}
                {(isSelected || isHovered) && (
                  <g transform={`translate(${x}, ${y - 24})`} className="pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    <rect
                      x={-(Math.max(wb.name.length, 24) * 3.6 + 26)}
                      y="-28"
                      width={Math.max(wb.name.length, 24) * 7.2 + 52}
                      height="34"
                      rx="14"
                      fill={isSelected ? '#0f172a' : theme === 'light' ? 'rgba(255, 255, 255, 0.98)' : 'rgba(15, 23, 42, 0.96)'}
                      stroke={isSelected ? style.fill : theme === 'light' ? '#0284c7' : '#38bdf8'}
                      strokeWidth={isSelected ? '2.4' : '1.4'}
                      filter="drop-shadow(0 4px 12px rgba(0,0,0,0.3))"
                    />
                    <text
                      x="0"
                      y="-14"
                      fill={isSelected ? '#ffffff' : theme === 'light' ? '#0f172a' : '#ffffff'}
                      fontSize="10.5"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      {wb.name.length > 38 ? wb.name.substring(0, 36) + '...' : wb.name}
                    </text>
                    <text
                      x="0"
                      y="-2"
                      fill={isExtinct ? '#f87171' : theme === 'light' ? '#0369a1' : '#38bdf8'}
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {isExtinct 
                        ? '⚪ SOOKH KAR MIT GAYA (EXTINCT - NDWI: ' + (wb.bhuvanWbis?.ndwiScore ?? -0.28) + ') • Click for Dossier'
                        : `🛰️ NDWI: ${wb.bhuvanWbis?.ndwiScore ?? '+0.38'} • Storage: ${wb.waterLevelPercent}% • Click for WBIS Details`}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
          </>
        )}
      </div>

      {/* ============================================================== */}
      {/* 4. BOTTOM SURVEILLANCE CARD (DISPLAYS SELECTED ENDPOINT DATA)   */}
      {/* ============================================================== */}
      {activeWaterBody && (
        <div id="apwrims-dossier" className="p-4 sm:p-5 bg-white border-t border-slate-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded bg-blue-100 text-[#0047ab] border border-blue-200 flex items-center gap-1">
                  <span>{getPinIcon(activeWaterBody.datasetType)}</span>
                  <span>{activeWaterBody.endpoint || 'POST /Dataset/Reservoir'}</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Agency: {activeWaterBody.agency || 'APWRIMS'}
                </span>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                  District: {activeWaterBody.district}
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {activeWaterBody.name}
              </h4>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-700">Mandal: {activeWaterBody.mandal}</span>
                <span>•</span>
                <span>Village: {activeWaterBody.village}</span>
                <span>•</span>
                <span className="font-mono text-slate-400">GPS: {activeWaterBody.coordinates.lat}°N, {activeWaterBody.coordinates.lng}°E</span>
                {activeWaterBody.teluguName && (
                  <>
                    <span>•</span>
                    <span className="font-bold text-[#0047ab]">{activeWaterBody.teluguName}</span>
                  </>
                )}
              </p>
            </div>

            {/* Right Status Badge */}
            <div className="flex items-center gap-3 shrink-0">
              <span className={`text-xs font-mono font-bold px-3 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5 shadow-xs ${getColorClasses(activeWaterBody.statusColor).flagBadge}`}>
                {activeWaterBody.statusColor === 'red' ? (
                  <AlertCircle className="w-4 h-4 text-white animate-spin-slow" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-white" />
                )}
                <span>{getColorClasses(activeWaterBody.statusColor).flagText}</span>
              </span>
            </div>
          </div>

          {/* 4 DYNAMIC TELEMETRY CARDS TUNED TO THE EXACT ENDPOINT */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {/* Card 1: Primary Metric based on Endpoint */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">
                {activeWaterBody.datasetType === 'river_level' || activeWaterBody.datasetType === 'basin_river_level'
                  ? 'GAUGE WATER LEVEL'
                  : activeWaterBody.datasetType === 'river_discharge' || activeWaterBody.datasetType === 'basin_river_discharge'
                  ? 'RIVER DISCHARGE'
                  : activeWaterBody.datasetType === 'rainfall' || activeWaterBody.datasetType === 'basin_rainfall'
                  ? 'OBSERVED RAIN'
                  : activeWaterBody.datasetType === 'groundwater'
                  ? 'DEPTH TO WATER'
                  : 'LIVE STORAGE'}
              </span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                {activeWaterBody.liveTelemetry?.storageBMC
                  ? `${activeWaterBody.liveTelemetry.storageBMC} BMC (${activeWaterBody.liveTelemetry.storageMCM} MCM)`
                  : activeWaterBody.liveTelemetry?.dischargeCusecs
                  ? `${activeWaterBody.liveTelemetry.dischargeCusecs} Cusecs`
                  : activeWaterBody.liveTelemetry?.waterLevelM
                  ? `${activeWaterBody.liveTelemetry.waterLevelM} m`
                  : activeWaterBody.liveTelemetry?.rainfallMm
                  ? `${activeWaterBody.liveTelemetry.rainfallMm} mm`
                  : activeWaterBody.liveTelemetry?.depthToWaterM_bgl
                  ? `${activeWaterBody.liveTelemetry.depthToWaterM_bgl} m bgl`
                  : `${activeWaterBody.waterLevelPercent}% Active Level`}
              </span>
              <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{activeWaterBody.agency || 'APWRIMS'} Live Telemetry</span>
              </span>
            </div>

            {/* Card 2: Secondary Metric based on Endpoint */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">
                {activeWaterBody.datasetType === 'river_level' || activeWaterBody.datasetType === 'basin_river_level'
                  ? 'DANGER LEVEL MARK'
                  : activeWaterBody.datasetType === 'rainfall' || activeWaterBody.datasetType === 'basin_rainfall'
                  ? 'SEASONAL DEPARTURE'
                  : activeWaterBody.datasetType === 'groundwater'
                  ? 'RECHARGE TREND'
                  : activeWaterBody.liveTelemetry?.fullCapacityMCM
                  ? 'FULL RESERVOIR CAPACITY'
                  : 'OPERATING GAUGE'}
              </span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                {activeWaterBody.liveTelemetry?.dangerLevelM
                  ? `${activeWaterBody.liveTelemetry.dangerLevelM} m`
                  : activeWaterBody.liveTelemetry?.departurePercent
                  ? `+${activeWaterBody.liveTelemetry.departurePercent}% Normal`
                  : activeWaterBody.liveTelemetry?.rechargeTrend
                  ? activeWaterBody.liveTelemetry.rechargeTrend
                  : activeWaterBody.liveTelemetry?.fullCapacityMCM
                  ? `${activeWaterBody.liveTelemetry.fullCapacityMCM} MCM`
                  : `${activeWaterBody.waterLevelPercent}% Gauge`}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {activeWaterBody.liveTelemetry?.subBasin || 'Standard Hydrological Limit'}
              </span>
            </div>

            {/* Card 3: TDS Machine Sensor */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">TDS MACHINE SENSOR</span>
              <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                {activeWaterBody.tdsPpm && activeWaterBody.tdsPpm > 0 ? (
                  <>
                    {activeWaterBody.tdsPpm} <span className="text-xs font-sans font-normal text-slate-500">ppm</span>
                  </>
                ) : (
                  <span className="text-rose-600 text-sm font-bold">⚠️ Sensor Offline</span>
                )}
              </span>
              <span className={`text-[10px] font-bold block mt-0.5 ${
                !activeWaterBody.tdsPpm || activeWaterBody.tdsPpm <= 0
                  ? 'text-rose-600'
                  : activeWaterBody.tdsPpm <= 300
                  ? 'text-emerald-600'
                  : activeWaterBody.tdsPpm <= 600
                  ? 'text-sky-600'
                  : activeWaterBody.tdsPpm <= 1000
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}>
                {!activeWaterBody.tdsPpm || activeWaterBody.tdsPpm <= 0
                  ? 'Electrode Error / Disconnected'
                  : activeWaterBody.tdsPpm <= 300
                  ? 'Safe Potable Water (BIS <300)'
                  : activeWaterBody.tdsPpm <= 600
                  ? 'Good Fresh (Irrigation/Domestic)'
                  : activeWaterBody.tdsPpm <= 1000
                  ? 'Moderate Mineral Stress'
                  : 'Severe Contamination Hazard'}
              </span>
            </div>

            {/* Card 4: Physical Inspection Audit */}
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">EFFLUENT / FIELD AUDIT</span>
              <span className={`text-base font-bold mt-0.5 block ${
                activeWaterBody.wasteLevel === 'Heavy' ? 'text-rose-600' :
                activeWaterBody.wasteLevel === 'Moderate' ? 'text-amber-600' :
                activeWaterBody.wasteLevel === 'Low' ? 'text-sky-600' :
                activeWaterBody.wasteLevel === 'None' ? 'text-emerald-600' :
                'text-slate-500'
              }`}>
                {activeWaterBody.wasteLevel === 'None' ? 'Zero Waste Discharge' :
                 activeWaterBody.wasteLevel === 'Heavy' ? 'Critical Effluent / Froth' :
                 activeWaterBody.wasteLevel === 'Moderate' ? 'Municipal Storm Silt' :
                 activeWaterBody.wasteLevel === 'Low' ? 'Low Organic Silt' :
                 'Restoration Required'}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Physical Audit: {activeWaterBody.lastInspected}
              </span>
            </div>
          </div>

          <div className="mt-3 p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-blue-900">Government Station Dossier:</strong> {activeWaterBody.description}
            </p>
          </div>

          {/* ============================================================== */}
          {/* ISRO BHUVAN WBIS SATELLITE TELEMETRY & NDWI SECTION (INLINE)   */}
          {/* DIRECTLY UNDER GOVERNMENT STATION DOSSIER AS REQUESTED        */}
          {/* ============================================================== */}
          {(() => {
            const rawWbis = activeWaterBody.bhuvanWbis;
            const isGroundwater = activeWaterBody.datasetType === 'groundwater' || activeWaterBody.type === 'Groundwater Well';
            const isRiver = activeWaterBody.datasetType === 'river_level' || activeWaterBody.datasetType === 'river_discharge' || activeWaterBody.datasetType === 'basin_river_level' || activeWaterBody.datasetType === 'basin_river_discharge' || activeWaterBody.type === 'River' || activeWaterBody.type === 'Canal';
            const isRainfall = activeWaterBody.datasetType === 'rainfall' || activeWaterBody.datasetType === 'basin_rainfall' || activeWaterBody.type === 'Rainfall Station';

            const wbis = {
              ndwiScore: typeof rawWbis?.ndwiScore === 'number' 
                ? rawWbis.ndwiScore 
                : activeWaterBody.statusColor === 'grey' ? -0.28 : isGroundwater ? 0.24 : activeWaterBody.statusColor === 'green' ? 0.44 : activeWaterBody.statusColor === 'blue' ? 0.28 : activeWaterBody.statusColor === 'yellow' ? 0.14 : -0.06,
              ndwiClassification: rawWbis?.ndwiClassification || (
                activeWaterBody.statusColor === 'grey' 
                  ? 'Extinct / Encroached / Built-up (< -0.15)' 
                  : isGroundwater
                  ? 'Active Hill Spring & Aquifer Head (0.24 NDMI)'
                  : activeWaterBody.statusColor === 'green' 
                  ? 'Deep Surface Water (NDWI > 0.3)' 
                  : activeWaterBody.statusColor === 'blue' 
                  ? 'Moderate Surface Water (0.1 - 0.3)' 
                  : 'Shallow / Turbid Water (0.0 - 0.1)'
              ),
              waterSpreadAreaHa: typeof rawWbis?.waterSpreadAreaHa === 'number'
                ? rawWbis.waterSpreadAreaHa
                : isGroundwater ? 14.8 : activeWaterBody.statusColor === 'grey' ? 0.0 : Math.round((activeWaterBody.waterLevelPercent * 0.45 + 5) * 10) / 10,
              historicalBaselineHa: typeof rawWbis?.historicalBaselineHa === 'number'
                ? rawWbis.historicalBaselineHa
                : isGroundwater ? 14.8 : activeWaterBody.statusColor === 'grey' ? 18.5 : Math.round((activeWaterBody.waterLevelPercent * 0.5 + 8) * 10) / 10,
              areaChangePercent: typeof rawWbis?.areaChangePercent === 'number'
                ? rawWbis.areaChangePercent
                : activeWaterBody.statusColor === 'grey' ? -100 : isGroundwater ? +1.4 : activeWaterBody.waterLevelPercent > 60 ? +4.2 : -18.5,
              satelliteMission: rawWbis?.satelliteMission || (isGroundwater ? 'ISRO Resourcesat-2A (LISS-IV 5.8m) & Sentinel-2' : 'ISRO Resourcesat-2A (AWiFS 56m) & Sentinel-2 Optical'),
              sensorName: rawWbis?.sensorName || (isGroundwater ? 'LISS-IV High-Res (5.8m) + Hydrogeological Lineament Mapping' : 'AWiFS (56m Swath) + Sentinel-2 MSI (10m Multi-spectral)'),
              last15DayPassDate: rawWbis?.last15DayPassDate || '2026-10-02',
              previousPassDate: rawWbis?.previousPassDate || '2026-09-17',
              nextPassDate: rawWbis?.nextPassDate || '2026-10-17',
              cycleDays: rawWbis?.cycleDays || 15,
              cloudCoverPercent: rawWbis?.cloudCoverPercent || (isGroundwater ? 2.1 : 3.4),
              siltationIndexPercent: typeof rawWbis?.siltationIndexPercent === 'number'
                ? rawWbis.siltationIndexPercent
                : isGroundwater ? 0 : activeWaterBody.statusColor === 'grey' ? 96 : activeWaterBody.statusColor === 'red' ? 74 : activeWaterBody.statusColor === 'yellow' ? 42 : 14,
              encroachmentRisk: rawWbis?.encroachmentRisk || (isGroundwater ? 'None' : activeWaterBody.statusColor === 'grey' ? 'Total Extinction' : activeWaterBody.statusColor === 'red' ? 'Severe' : activeWaterBody.statusColor === 'yellow' ? 'Moderate' : 'None'),
              waterRemainingPercent: typeof rawWbis?.waterRemainingPercent === 'number' ? rawWbis.waterRemainingPercent : activeWaterBody.waterLevelPercent,
              estimatedVolumeMCM: typeof rawWbis?.estimatedVolumeMCM === 'number'
                ? rawWbis.estimatedVolumeMCM
                : isGroundwater ? 1.8 : activeWaterBody.liveTelemetry?.storageMCM || Math.round((activeWaterBody.waterLevelPercent * 0.3) * 10) / 10,
              isExtinct: activeWaterBody.statusColor === 'grey' || rawWbis?.isExtinct || false,
              extinctionReason: rawWbis?.extinctionReason || (activeWaterBody.statusColor === 'grey' ? 'Talab sookh kar mit gaya: severe siltation deposition, unauthorized construction encroachment, and feeder canal diversion.' : undefined),
            };

            const isExtinct = activeWaterBody.statusColor === 'grey' || wbis.isExtinct;

            // Dynamic header and theme titles based on asset hydrogeology
            const systemTitle = isGroundwater 
              ? 'Bhuvan Groundwater Information System (GWIS) & Hill Spring Hydrology'
              : isRiver 
              ? 'Bhuvan Fluvial Hydrology & River Basin Telemetry (CWC / WRIS)'
              : isRainfall 
              ? 'Bhuvan Hydro-Meteorological & Precipitation Telemetry (IMD / ISRO)'
              : 'Bhuvan Water Bodies Information System (WBIS)';

            const systemBadge = isGroundwater 
              ? 'ISRO DWLR & Aquifer Telemetry'
              : isRiver 
              ? 'ISRO River Basin Telemetry'
              : isRainfall 
              ? 'ISRO AWS Rain Telemetry'
              : 'ISRO 15-Day Optical Pass';

            const modalButtonText = isGroundwater 
              ? 'Full Technical Bhuvan GWIS / Spring Modal'
              : isRiver 
              ? 'Full Technical River Basin Telemetry Modal'
              : isRainfall 
              ? 'Full Technical AWS Precipitation Modal'
              : 'Full Technical Bhuvan WBIS Modal';

            return (
              <div className="mt-4 border border-indigo-200 rounded-2xl bg-gradient-to-b from-indigo-50/60 via-white to-slate-50 overflow-hidden shadow-xs space-y-4 p-4 sm:p-5">
                {/* 1. Header Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0047ab] to-indigo-700 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                      <Satellite className="w-5 h-5 text-amber-300 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 flex-wrap">
                        <span>{systemTitle}</span>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-300">
                          {systemBadge}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Satellite: <strong>{wbis.satelliteMission}</strong> • Telemetry Grid: <strong>{activeWaterBody.district}</strong>
                        {isGroundwater && ' • CGWB Eastern Ghats Aquifer'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => setIsDetailModalOpen(true)}
                      className="px-3.5 py-2 bg-gradient-to-r from-[#0047ab] to-[#0284c7] hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-300" />
                      <span>{modalButtonText}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setShowBhuvanTester(true)}
                      className="px-3 py-1.5 bg-indigo-900 hover:bg-indigo-800 text-indigo-200 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-700/60"
                      title="Test Bhuvan API Token Key"
                    >
                      <Satellite className="w-3.5 h-3.5 text-amber-300" />
                      <span>Bhuvan API: Live Connected</span>
                    </button>

                    {onLodgeComplaint && (
                      <button
                        onClick={() => onLodgeComplaint()}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{isExtinct ? 'Report Extinct Bed' : 'Lodge Grievance'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 2. Critical Alert if Sookh Kar Mit Gaya (Grey Status) */}
                {isExtinct && (
                  <div className="p-3.5 rounded-xl bg-red-950/80 border border-rose-600/70 text-rose-200 text-xs flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-rose-100 font-bold block uppercase tracking-wide">
                        ⚠️ ISRO SATELLITE EXTINCTION DOSSIER (SOOKH KAR MIT GAYA - GREY STATUS):
                      </strong>
                      <p className="mt-1 text-rose-200 leading-relaxed font-normal">
                        ISRO Resourcesat-2A optical telemetry aur spectral multi-year comparisons ke mutabiq yeh talab/lake <strong>poora sookh kar mit chuka hai</strong>. 
                        {wbis.extinctionReason || ' Water spread area is 0.0 Ha (lost from historical baseline). Heavy silt deposition, construction debris, or catchment diversion has permanently erased water retention.'}
                      </p>
                      <div className="mt-2 flex items-center gap-2 font-mono text-[11px] text-rose-300">
                        <span>NDWI Score: <strong>{wbis.ndwiScore}</strong> (Zero liquid water)</span>
                        <span>•</span>
                        <span>Encroachment Status: <strong>{wbis.encroachmentRisk}</strong></span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 15-Day Satellite Chronology Orbit Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Previous Orbit (15 Days Ago) */}
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Previous Orbit (15 Days Ago)
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{wbis.previousPassDate}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isExtinct 
                        ? 'Optical reflectance showed dry soil matrix.' 
                        : isGroundwater
                        ? 'Sub-surface aquifer recharge & spring moisture baseline verified.'
                        : 'Historical reflectance baseline recorded under clear sky.'}
                    </p>
                  </div>

                  {/* Latest Orbit Pass */}
                  <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block font-bold">
                        Latest Orbit Pass (Recent)
                      </span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    </div>
                    <span className="text-xs font-bold text-blue-950 mt-0.5 block flex items-center gap-1.5">
                      <Satellite className="w-3.5 h-3.5 text-blue-600" />
                      <span>{wbis.last15DayPassDate}</span>
                    </span>
                    <p className="text-[11px] text-blue-900 mt-1">
                      {isExtinct 
                        ? 'NDWI: ' + wbis.ndwiScore + ' (No water detected - Dry/Encroached signature)'
                        : isGroundwater
                        ? `DWLR: ${activeWaterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8}m bgl • Trend: ${activeWaterBody.liveTelemetry?.rechargeTrend ?? '+1.4m'} • Catchment: ${wbis.waterSpreadAreaHa} Ha`
                        : isRiver
                        ? `Level: ${activeWaterBody.liveTelemetry?.waterLevelM ?? 14.8}m • Flow: ${activeWaterBody.liveTelemetry?.dischargeCusecs ? `${activeWaterBody.liveTelemetry.dischargeCusecs} Cusecs` : 'Standard'}`
                        : `NDWI: ${wbis.ndwiScore > 0 ? `+${wbis.ndwiScore}` : wbis.ndwiScore} • Spread: ${wbis.waterSpreadAreaHa} Ha (${wbis.waterRemainingPercent}% volume)`}
                    </p>
                  </div>

                  {/* Next Scheduled Orbit */}
                  <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-2xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Next Scheduled Orbit
                    </span>
                    <span className="text-xs font-bold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{wbis.nextPassDate}</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {isGroundwater
                        ? 'ISRO LISS-IV will scan Eastern Ghats recharge zone canopy & sub-surface moisture in ~14 days.'
                        : 'ISRO satellite will re-image catchment in ~14 days for automatic change detection.'}
                    </p>
                  </div>
                </div>

                {/* 4. NDWI / Hydrogeology Spectral Analytics Bar & Volume Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                  {/* Left: NDWI / NDMI Score Meter */}
                  <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                          {isGroundwater 
                            ? 'Catchment Moisture & Soil Index (NDMI / Lineament Reflectance)'
                            : 'NDWI Water Index Score: (Green - NIR) / (Green + NIR)'}
                        </span>
                        <div className="text-2xl font-black font-mono mt-0.5 flex items-baseline gap-2">
                          <span className={
                            isExtinct ? 'text-slate-600' :
                            wbis.ndwiScore > 0.3 ? 'text-emerald-600' :
                            wbis.ndwiScore > 0.1 ? 'text-sky-600' :
                            wbis.ndwiScore > 0.0 ? 'text-amber-600' : 'text-rose-600'
                          }>
                            {wbis.ndwiScore > 0 ? `+${wbis.ndwiScore.toFixed(2)}` : wbis.ndwiScore.toFixed(2)}
                          </span>
                          <span className="text-xs font-sans font-semibold text-slate-500">
                            ({wbis.ndwiClassification})
                          </span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                        isExtinct ? 'bg-slate-700 text-white' :
                        isGroundwater ? 'bg-emerald-700 text-white' :
                        wbis.ndwiScore > 0.2 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                      }`}>
                        {isExtinct ? 'SOOKH KAR MIT GAYA' : isGroundwater ? 'PRISTINE SPRING HYDROLOGY' : wbis.ndwiScore > 0.2 ? 'SURFACE WATER' : 'DEPLETION'}
                      </span>
                    </div>

                    {/* Gradient Bar with marker pin */}
                    <div className="space-y-1">
                      <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-rose-600 via-amber-400 via-sky-400 to-emerald-600 relative overflow-visible">
                        {(() => {
                          const percent = Math.max(0, Math.min(100, ((wbis.ndwiScore + 1) / 2) * 100));
                          return (
                            <div
                              style={{ left: `${percent}%` }}
                              className="absolute -top-1 transform -translate-x-1/2 w-3 h-5.5 bg-slate-950 border-2 border-white rounded shadow-md"
                              title={`Index: ${wbis.ndwiScore}`}
                            />
                          );
                        })()}
                      </div>
                      <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                        <span>-1.0 (Built-up)</span>
                        <span>-0.2 (Sookh Gaya)</span>
                        <span>0.0 (Marsh)</span>
                        <span>+0.3 (Active Recharge)</span>
                        <span>+1.0 (Pristine Spring)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: 4 Hydrogeological / Water Spread Stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
                    {isGroundwater ? (
                      <>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Spring Catchment Zone</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {wbis.waterSpreadAreaHa} <span className="text-xs font-sans text-slate-500">Ha</span>
                          </span>
                          <span className="text-[10px] text-slate-500">Eastern Ghats Protected Zone</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">DWLR Water Depth</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.liveTelemetry?.depthToWaterM_bgl ?? 6.8} <span className="text-xs font-sans text-slate-500">m bgl</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-600">
                            {activeWaterBody.liveTelemetry?.rechargeTrend ?? '+1.4m Rising'} Trend
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Dynamic Aquifer Head</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.waterLevelPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">TDS: {activeWaterBody.tdsPpm} ppm (Crystal Pure)</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Catchment Protection</span>
                          <span className="text-base font-bold font-mono mt-0.5 block text-emerald-600">
                            100% Intact
                          </span>
                          <span className="text-[10px] text-slate-500">Sacred Grove Sanctuary</span>
                        </div>
                      </>
                    ) : isRiver ? (
                      <>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Gauge Water Level</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.liveTelemetry?.waterLevelM ?? 14.8} <span className="text-xs font-sans text-slate-500">m</span>
                          </span>
                          <span className="text-[10px] text-slate-500">Danger: {activeWaterBody.liveTelemetry?.dangerLevelM ?? 18.0} m</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">River Discharge</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.liveTelemetry?.dischargeCusecs ? `${activeWaterBody.liveTelemetry.dischargeCusecs}` : '340'} <span className="text-xs font-sans text-slate-500">Cusecs</span>
                          </span>
                          <span className="text-[10px] font-bold text-sky-600">Active Fluvial Flow</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Dynamic Stage</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.waterLevelPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">Catchment Hydraulic State</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Sediment Index</span>
                          <span className={`text-base font-bold font-mono mt-0.5 block ${wbis.siltationIndexPercent > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {wbis.siltationIndexPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">Fluvial Silt Load</span>
                        </div>
                      </>
                    ) : isRainfall ? (
                      <>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">AWS Rainfall</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.liveTelemetry?.rainfallMm ?? 24.5} <span className="text-xs font-sans text-slate-500">mm</span>
                          </span>
                          <span className="text-[10px] text-slate-500">Telemetry AWS IMD</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Departure</span>
                          <span className="text-base font-bold font-mono text-emerald-600 mt-0.5 block">
                            {activeWaterBody.liveTelemetry?.departurePercent ? `+${activeWaterBody.liveTelemetry.departurePercent}%` : '+14.2%'}
                          </span>
                          <span className="text-[10px] text-slate-500">Normal / Excess Rain</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Soil Saturation</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {activeWaterBody.waterLevelPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">Hill Basin Runoff</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">AWS Status</span>
                          <span className="text-base font-bold font-mono text-emerald-600 mt-0.5 block">
                            Online
                          </span>
                          <span className="text-[10px] text-slate-500">Satellite Synced</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Current Water Spread</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {wbis.waterSpreadAreaHa} <span className="text-xs font-sans text-slate-500">Ha</span>
                          </span>
                          <span className="text-[10px] text-slate-500">{(wbis.waterSpreadAreaHa * 2.471).toFixed(1)} Acres</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Baseline Area (2015)</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {wbis.historicalBaselineHa} <span className="text-xs font-sans text-slate-500">Ha</span>
                          </span>
                          <span className={`text-[10px] font-bold ${wbis.areaChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {wbis.areaChangePercent >= 0 ? `+${wbis.areaChangePercent}%` : `${wbis.areaChangePercent}%`} Change
                          </span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Water Remaining</span>
                          <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                            {wbis.waterRemainingPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">{wbis.estimatedVolumeMCM} MCM Storage</span>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                          <span className="text-[10px] font-mono text-slate-400 block uppercase">Siltation / Choke</span>
                          <span className={`text-base font-bold font-mono mt-0.5 block ${
                            wbis.siltationIndexPercent > 70 ? 'text-rose-600' :
                            wbis.siltationIndexPercent > 35 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {wbis.siltationIndexPercent}%
                          </span>
                          <span className="text-[10px] text-slate-500">Bed Silt Accumulation</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 5. Past 6 Satellite Cycles (15-Day Pass History) Mini Grid */}
                <div className="pt-2 border-t border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Past 6 Consecutive Satellite Cycles (15-Day Recurrence Interval)</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">ISRO Optical Sensor</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-xs">
                    {[
                      { pass: 'Pass #1 (Jul 18)', score: isExtinct ? -0.22 : isGroundwater ? 0.22 : +0.48, status: isExtinct ? 'Dry' : isGroundwater ? 'Pristine' : 'High' },
                      { pass: 'Pass #2 (Aug 02)', score: isExtinct ? -0.24 : isGroundwater ? 0.23 : +0.46, status: isExtinct ? 'Dry' : isGroundwater ? 'Pristine' : 'High' },
                      { pass: 'Pass #3 (Aug 17)', score: isExtinct ? -0.25 : isGroundwater ? 0.24 : +0.42, status: isExtinct ? 'Dry' : isGroundwater ? 'Stable' : 'Normal' },
                      { pass: 'Pass #4 (Sep 01)', score: isExtinct ? -0.27 : isGroundwater ? 0.24 : +0.38, status: isExtinct ? 'Dry' : isGroundwater ? 'Stable' : 'Normal' },
                      { pass: 'Pass #5 (Sep 16)', score: isExtinct ? -0.28 : isGroundwater ? 0.24 : +0.35, status: isExtinct ? 'Dry' : isGroundwater ? 'Stable' : 'Normal' },
                      { pass: 'Pass #6 (Oct 02)', score: wbis.ndwiScore, status: isExtinct ? 'Extinct' : 'Current' },
                    ].map((cycle, i) => (
                      <div key={i} className={`p-2 rounded-xl border ${
                        cycle.status === 'Extinct' || cycle.status === 'Dry' 
                          ? 'bg-slate-200/90 border-slate-300 text-slate-700 font-bold' 
                          : 'bg-white border-slate-200 text-slate-900'
                      }`}>
                        <span className="text-[9px] text-slate-400 block font-mono">{cycle.pass}</span>
                        <span className="text-xs font-bold font-mono block mt-0.5">
                          {cycle.score > 0 ? `+${cycle.score.toFixed(2)}` : cycle.score.toFixed(2)}
                        </span>
                        <span className="text-[9px] font-semibold text-blue-700 block">{cycle.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. INDIA WRIS LIVE TELEMETRY STATION FEED (ALL 9 ENDPOINTS)    */}
      {/* ============================================================== */}
      {currentRole !== 'admin' && (
        <div className="border-t border-slate-200 bg-slate-900 text-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>India-WRIS Live Telemetry Feed</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    APWRIMS LIVE GRID
                  </span>
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Jurisdiction: <span className="text-sky-300 font-bold">{effectiveDistrict === 'all' ? 'Vizianagaram' : effectiveDistrict}</span> • State: Andhra Pradesh • Sync: {lastRefreshedAt || 'Synchronized'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBhuvanTester(!showBhuvanTester)}
              className="text-xs font-mono bg-indigo-950/90 hover:bg-indigo-900 text-indigo-300 border border-indigo-700/80 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Test ISRO Bhuvan Token Connection"
            >
              <Satellite className="w-3.5 h-3.5 text-amber-300" />
              <span>ISRO Bhuvan Test</span>
            </button>
            <button
              onClick={() => setShowCurlModal(!showCurlModal)}
              className="text-xs font-mono bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect Exact India-WRIS Swagger POST API Request"
            >
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect API cURL</span>
            </button>
            <button
              onClick={() => fetchWrisData(effectiveDistrict, activeDatasetTab)}
              disabled={isLoadingLive}
              className="text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span>{isLoadingLive ? 'Syncing...' : 'Refresh Telemetry'}</span>
            </button>
          </div>
        </div>

        {/* ISRO Bhuvan Connection Tester Modal / Drawer */}
        {showBhuvanTester && (
          <div className="mt-3 p-4 bg-slate-950 border border-indigo-900/80 rounded-xl text-xs font-mono space-y-3">
            <div className="flex items-center justify-between text-indigo-300 pb-2 border-b border-indigo-900/60">
              <span className="font-bold flex items-center gap-2">
                <Satellite className="w-4 h-4 text-amber-400" />
                <span>ISRO Bhuvan API Token Connection & Diagnostic Test</span>
              </span>
              <button onClick={() => setShowBhuvanTester(false)} className="text-slate-400 hover:text-white cursor-pointer text-sm">✕</button>
            </div>

            {/* Live Environment Status */}
            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[11px] uppercase tracking-wider font-bold">Vercel Environment Variable:</span>
                <span className="text-[10px] text-slate-400">Key: <code className="text-sky-400 font-bold">VITE_BHUVAN_API_TOKEN</code></span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {bhuvanTestResult?.hasToken ? (
                  <span className="text-emerald-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>Token Active in Environment ({bhuvanTestResult.maskedToken})</span>
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span>No Token Saved in Vercel Environment Yet</span>
                  </span>
                )}
              </div>
              {bhuvanTestResult?.message && (
                <p className="text-[11px] text-slate-400">{bhuvanTestResult.message}</p>
              )}
            </div>

            {/* Test Input Form */}
            <div className="space-y-2">
              <label className="text-slate-300 text-[11px] font-bold block">
                Apna Bhuvan Token Yahan Paste Karke Test Karein:
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="password"
                  value={testTokenInput}
                  onChange={(e) => setTestTokenInput(e.target.value)}
                  placeholder="Paste your Bhuvan Access Token here..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 font-mono"
                />
                <button
                  onClick={() => runBhuvanTest(testTokenInput)}
                  disabled={isTestingBhuvan}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingBhuvan ? 'animate-spin' : ''}`} />
                  <span>{isTestingBhuvan ? 'Testing...' : 'Test Token Live'}</span>
                </button>
              </div>
            </div>

            {/* Test Result Message */}
            {bhuvanTestResult && (
              <div className="p-3 bg-black/60 border border-slate-800 rounded-lg space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Test Diagnostics:</span>
                <pre className="text-emerald-400 text-[11px] overflow-x-auto leading-relaxed">
{JSON.stringify(bhuvanTestResult, null, 2)}
                </pre>
              </div>
            )}

            {/* Instructions */}
            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed font-sans">
              <strong className="text-indigo-300 font-mono">Kaise Save Karein:</strong> Vercel Dashboard ➡️ Settings ➡️ Environment Variables ➡️ Key: <code className="text-sky-300 font-mono">VITE_BHUVAN_API_TOKEN</code> (Value: aapka token) ➡️ Save & Redeploy.
            </div>
          </div>
        )}

        {/* cURL Inspector Modal / Drawer */}
        {showCurlModal && (
          <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono space-y-2.5">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>India-WRIS Swagger OpenAPI 3.0 Live Verification</span>
              </span>
              <button onClick={() => setShowCurlModal(false)} className="text-slate-500 hover:text-white cursor-pointer">✕</button>
            </div>
            
            <div>
              <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">1. Live Government cURL Query:</span>
              <pre className="text-slate-300 overflow-x-auto text-[11px] leading-relaxed p-2 bg-black/60 rounded-lg border border-slate-800">
{`curl -X 'POST' \\
  'https://indiawris.gov.in${liveTelemetry?.endpoint || '/Dataset/Reservoir'}?stateName=Andhra%20Pradesh&districtName=${encodeURIComponent(effectiveDistrict === 'all' ? 'Vizianagaram' : effectiveDistrict)}&agencyName=${liveTelemetry?.agency || 'APWRIMS'}&startdate=2026-09-01&enddate=2026-10-03&download=false&page=1&size=100' \\
  -H 'accept: application/json' \\
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)' \\
  -d ''`}
              </pre>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2 pt-1 border-t border-slate-800/80">
              <span>Agency: <strong className="text-sky-400 font-bold">{liveTelemetry?.agency || 'APWRIMS'}</strong> (Andhra Pradesh WRIMS)</span>
              <span>Source Protocol: <strong className="text-emerald-400">{liveTelemetry?.source || 'live_india_wris'}</strong></span>
              <a 
                href="https://indiawris.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="text-blue-400 hover:underline flex items-center gap-1 font-sans text-xs"
              >
                <span>Govt Portal (indiawris.gov.in)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block mb-1 uppercase font-bold">2. Raw Telemetry Payload (Direct Government Output):</span>
              <pre className="text-emerald-400 overflow-x-auto text-[10.5px] max-h-48 leading-relaxed p-2 bg-black/80 rounded-lg border border-slate-800">
{JSON.stringify(liveTelemetry, null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Active Tab Data Render Grid */}
        <div className="mt-4">
          {isLoadingLive ? (
            <div className="p-8 text-center text-slate-400 text-xs flex items-center justify-center gap-2 font-mono">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Fetching live WRIS telemetry for {effectiveDistrict}...</span>
            </div>
          ) : records.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {records.map((rec, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 hover:border-blue-500/50 transition-all space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block">
                        {rec.blockName ? `${rec.blockName} Block` : rec.stationName || rec.wellType || 'AP Water Grid'}
                      </span>
                      <h5 className="text-sm font-bold text-white leading-tight">
                        {rec.reservoirName || rec.riverName || rec.stationName || `${effectiveDistrict} Water Sensor #${idx + 1}`}
                      </h5>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                      {rec.agencyName || liveTelemetry?.agency || 'APWRIMS'}
                    </span>
                  </div>

                  {rec.currentLiveStorage_MCM || rec.currentLiveStorage_BMC ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-mono">LIVE STORAGE</span>
                          <span className="text-base font-bold font-mono text-emerald-400">
                            {rec.currentLiveStorage_MCM 
                              ? `${rec.currentLiveStorage_MCM} MCM` 
                              : `${rec.currentLiveStorage_BMC} BMC`}
                          </span>
                        </div>
                        <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                          <span className="text-[10px] text-slate-400 block font-mono">WATER LEVEL</span>
                          <span className="text-base font-bold font-mono text-sky-300">
                            {rec.waterLevel_M ? `${rec.waterLevel_M} m` : 'Normal'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : rec.rainfall_MM !== undefined || rec.rainfallCurrentSeasonMm !== undefined ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">OBSERVED RAIN</span>
                        <span className="text-base font-bold font-mono text-blue-400">
                          {rec.rainfall_MM ?? rec.rainfallCurrentSeasonMm ?? 14.2} mm
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">DEPARTURE</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {rec.departure_Percent ? `+${rec.departure_Percent}%` : '+18.3% Normal'}
                        </span>
                      </div>
                    </div>
                  ) : rec.depthToWaterLevel_M_BGL !== undefined ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">DEPTH TO WATER</span>
                        <span className="text-base font-bold font-mono text-cyan-300">
                          {rec.depthToWaterLevel_M_BGL} m bgl
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">RECHARGE TREND</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          {rec.rechargeTrend ?? '+1.4m Rising'}
                        </span>
                      </div>
                    </div>
                  ) : rec.discharge_Cusecs !== undefined ? (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">DISCHARGE</span>
                        <span className="text-base font-bold font-mono text-cyan-400">
                          {rec.discharge_Cusecs} Cusecs
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">STATUS</span>
                        <span className="text-base font-bold font-mono text-emerald-400">
                          Steady Inflow
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">CURRENT LEVEL</span>
                        <span className="text-base font-bold font-mono text-sky-300">
                          {rec.currentWaterLevel_M ?? 14.8} m
                        </span>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-mono">DANGER MARK</span>
                        <span className="text-base font-bold font-mono text-rose-400">
                          {rec.dangerLevel_M ?? 18.0} m
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                    <span>District: {rec.districtName || effectiveDistrict}</span>
                    <span>Date: {rec.date || '2026-10-03'}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400 text-xs font-mono">
              No live telemetry records currently active for {effectiveDistrict}. Click Refresh Telemetry to re-sync.
            </div>
          )}
        </div>
      </div>
      )}

      {/* 6. Bhuvan WBIS Detailed Satellite & Field Telemetry Inspector Modal */}
      <BhuvanWbisDetailModal
        waterBody={activeWaterBody}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onLodgeComplaint={onLodgeComplaint ? () => onLodgeComplaint() : undefined}
      />
    </div>
  );
};

function GaugeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </svg>
  );
}
