import React, { useState, useEffect, useCallback } from 'react';
import { WaterBody, WaterBodyStatusColor } from '../types/nirikshan';
import { VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES } from '../data/visakhapatnamMandalsWaterData';
import { 
  Plus,
  Minus,
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Waves,
  Droplets,
  ShieldAlert,
  Compass,
  Ship,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Move
} from 'lucide-react';

export interface VisakhapatnamMandalData {
  id: string;
  name: string;
  teluguName: string;
  category: 'Coastal' | 'Urban' | 'Industrial' | 'Hilly Watershed' | 'Agricultural';
  svgPath: string;
  center: { x: number; y: number };
  statusColor: WaterBodyStatusColor;
  statusLabel: string;
  groundwaterDepthMbgl: number;
  waterBodiesCount: number;
  primaryWaterBody: string;
  primaryRiver: string;
  riverBasin: string;
  aquiferStatus: string;
  rechargeStructuresCount: number;
}

// 11 Cadastral Mandals of Visakhapatnam District matching official post-2022 AP bifurcation map
export const VISAKHAPATNAM_MANDALS: VisakhapatnamMandalData[] = [
  // 1. Bheemunipatnam (Historic coastal port town, Gosthani River estuary & marine lagoon)
  {
    id: 'bheemunipatnam',
    name: 'Bheemunipatnam',
    teluguName: 'భీమునిపట్నం',
    category: 'Coastal',
    svgPath: 'M 640,110 L 760,85 L 870,140 L 840,240 L 750,265 L 670,225 L 640,165 Z',
    center: { x: 745, y: 175 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Active Gosthani Estuary Outflow • Marine Coastal Buffer • 650 Cusecs)',
    groundwaterDepthMbgl: 5.6,
    waterBodiesCount: 38,
    primaryWaterBody: 'Gosthani River Estuary & Bheemunipatnam Marine Lagoon',
    primaryRiver: 'Gosthani River',
    riverBasin: 'Gosthani Lower Coastal Basin',
    aquiferStatus: 'Coastal Sand & Alluvium (Stable Fresh Ridge)',
    rechargeStructuresCount: 32,
  },

  // 2. Padmanabham (Northern agricultural hill boundary, historical Padmanabham hill, feeder tanks)
  {
    id: 'padmanabham',
    name: 'Padmanabham',
    teluguName: 'పద్మనాభం',
    category: 'Agricultural',
    svgPath: 'M 460,95 L 565,65 L 640,110 L 640,165 L 610,215 L 520,220 L 460,175 Z',
    center: { x: 545, y: 145 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Agricultural Valley Recharge • DWLR 7.8 mbgl)',
    groundwaterDepthMbgl: 7.8,
    waterBodiesCount: 42,
    primaryWaterBody: 'Padmanabham Sarada River Agricultural Canal & Tank',
    primaryRiver: 'Sarada/Gosthani Tributary Feeder',
    riverBasin: 'Padmanabham Valley Watershed',
    aquiferStatus: 'Fractured Hard-rock Aquifer (Seasonal Stress)',
    rechargeStructuresCount: 36,
  },

  // 3. Anandapuram (Central-north corridor on NH 16, Gambheeram Reservoir 14.2 MCM)
  {
    id: 'anandapuram',
    name: 'Anandapuram',
    teluguName: 'ఆనందపురం',
    category: 'Hilly Watershed',
    svgPath: 'M 460,175 L 520,220 L 610,215 L 670,225 L 660,310 L 590,340 L 485,325 L 435,260 Z',
    center: { x: 555, y: 265 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Gambheeram Reservoir • 14.2 MCM Live Storage • 410 Cusecs)',
    groundwaterDepthMbgl: 5.2,
    waterBodiesCount: 48,
    primaryWaterBody: 'Gambheeram Reservoir & Reserve Forest Runoff (14.2 MCM)',
    primaryRiver: 'Gambheeram Gedda / Eastern Ghats Stream',
    riverBasin: 'Gambheeram Foothill Basin',
    aquiferStatus: 'High Recharge Forest Buffer (Pristine Table)',
    rechargeStructuresCount: 44,
  },

  // 4. Pendurthi (Western suburban growth corridor, DWLR monitoring station)
  {
    id: 'pendurthi',
    name: 'Pendurthi',
    teluguName: 'పెందుర్తి',
    category: 'Urban',
    svgPath: 'M 255,220 L 375,195 L 435,260 L 485,325 L 440,385 L 340,395 L 260,335 Z',
    center: { x: 350, y: 295 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Rapid Suburban Extraction • DWLR 9.2 mbgl)',
    groundwaterDepthMbgl: 9.2,
    waterBodiesCount: 36,
    primaryWaterBody: 'Pendurthi Semi-Critical Groundwater DWLR & Cheruvu',
    primaryRiver: 'Meghadrigedda Upper Tributary',
    riverBasin: 'Meghadrigedda North Basin',
    aquiferStatus: 'Semi-Critical Hard-rock (Heavy Multi-story Borewell Pumping)',
    rechargeStructuresCount: 30,
  },

  // 5. Gopalapatnam (Simhachalam Hills & Meghadrigedda Reservoir 34.2 MCM - Central Drinking Lifeline)
  {
    id: 'gopalapatnam',
    name: 'Gopalapatnam',
    teluguName: 'గోపాలపట్నం',
    category: 'Hilly Watershed',
    svgPath: 'M 340,395 L 440,385 L 490,440 L 445,490 L 350,490 L 290,445 Z',
    center: { x: 395, y: 440 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Meghadrigedda Reservoir • 34.2 MCM • GVMC Drinking Lifeline)',
    groundwaterDepthMbgl: 4.8,
    waterBodiesCount: 52,
    primaryWaterBody: 'Meghadrigedda Reservoir - Central Drinking Lifeline (34.2 MCM)',
    primaryRiver: 'Meghadrigedda Stream',
    riverBasin: 'Meghadrigedda Catchment Basin',
    aquiferStatus: 'Protected Simhachalam Valley Basin (Safe)',
    rechargeStructuresCount: 46,
  },

  // 6. Visakhapatnam Rural (Mudasarlova Reservoir 18.5 MCM, Arilova Valley & Kambalakonda Wildlife Sanctuary)
  {
    id: 'visakhapatnam_rural',
    name: 'Visakhapatnam (Rural)',
    teluguName: 'విశాఖ రూరల్',
    category: 'Hilly Watershed',
    svgPath: 'M 485,325 L 590,340 L 660,310 L 655,410 L 580,445 L 490,440 Z',
    center: { x: 575, y: 380 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Mudasarlova Reservoir • 18.5 MCM • Pristine Forest Table)',
    groundwaterDepthMbgl: 4.6,
    waterBodiesCount: 56,
    primaryWaterBody: 'Mudasarlova Reservoir & Protected Wildlife Catchment (18.5 MCM)',
    primaryRiver: 'Mudasarlova Gedda',
    riverBasin: 'Kambalakonda Forest Watershed',
    aquiferStatus: 'Protected Reserve Forest Table (TDS 195 ppm)',
    rechargeStructuresCount: 50,
  },

  // 7. Seethammadhara (Kailasagiri Foothills, MVP Colony, Lawson Bay urban streams)
  {
    id: 'seethammadhara',
    name: 'Seethammadhara',
    teluguName: 'సీతమ్మధార',
    category: 'Urban',
    svgPath: 'M 655,310 L 760,330 L 750,440 L 660,465 L 580,445 L 655,410 Z',
    center: { x: 675, y: 395 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Kailasagiri Storm Gedda Corridor • Moderate Urban Runoff • TDS 420 ppm)',
    groundwaterDepthMbgl: 6.8,
    waterBodiesCount: 34,
    primaryWaterBody: 'Kailasagiri Foothill Watershed & MVP Storm Gedda',
    primaryRiver: 'Lawson Bay Coastal Gedda',
    riverBasin: 'Kailasagiri Urban Drainage',
    aquiferStatus: 'Urban Coastal Fractured Table',
    rechargeStructuresCount: 28,
  },

  // 8. Visakhapatnam Urban / Maharanipeta (Port Core, Southern Municipal Drain, Inner Harbor)
  {
    id: 'visakhapatnam_urban',
    name: 'Visakhapatnam (Urban)',
    teluguName: 'విశాఖ అర్బన్',
    category: 'Urban',
    svgPath: 'M 525,455 L 660,465 L 675,545 L 580,565 L 515,535 L 495,490 Z',
    center: { x: 585, y: 505 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Port Harbor Sludge & Municipal Untreated Outfall • TDS 1420 ppm)',
    groundwaterDepthMbgl: 11.4,
    waterBodiesCount: 22,
    primaryWaterBody: 'Visakhapatnam Port Harbor Basin & Southern Drain Outfall',
    primaryRiver: 'Southern Municipal Drain',
    riverBasin: 'Inner Harbor Marine Outfall',
    aquiferStatus: 'Critical Depletion & Saline Ingress Infill',
    rechargeStructuresCount: 16,
  },

  // 9. Mulagada (Industrial Hub, Malkapuram, HPCL refinery outfall, shipyard channel)
  {
    id: 'mulagada',
    name: 'Mulagada',
    teluguName: 'ములగాడ',
    category: 'Industrial',
    svgPath: 'M 410,490 L 515,535 L 505,595 L 420,600 L 375,560 Z',
    center: { x: 445, y: 545 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Refinery Sluice & Shipyard Backwater Chemical Froth • TDS 1550 ppm)',
    groundwaterDepthMbgl: 12.1,
    waterBodiesCount: 18,
    primaryWaterBody: 'Malkapuram - Gangavaram Creek & Refinery Sluice',
    primaryRiver: 'Industrial Effluent Channel',
    riverBasin: 'Gangavaram Tidal Creek',
    aquiferStatus: 'Chemical Froth & Severe Industrial Contamination',
    rechargeStructuresCount: 12,
  },

  // 10. Gajuwaka (BHPV & Industrial corridor, critical refinery runoff)
  {
    id: 'gajuwaka',
    name: 'Gajuwaka',
    teluguName: 'గాజువాక',
    category: 'Industrial',
    svgPath: 'M 290,445 L 350,490 L 410,490 L 375,560 L 310,590 L 240,550 L 260,490 Z',
    center: { x: 330, y: 525 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Hazardous Industrial Effluent • TDS 1680 ppm • DO < 1.5 mg/L)',
    groundwaterDepthMbgl: 12.8,
    waterBodiesCount: 24,
    primaryWaterBody: 'Gajuwaka Industrial Drainage Canal & Refinery Sluice (Hazard)',
    primaryRiver: 'Gajuwaka Industrial Canal',
    riverBasin: 'Gajuwaka Industrial Corridor',
    aquiferStatus: 'Critical Heavy-Metal & Hydrocarbon Contamination',
    rechargeStructuresCount: 14,
  },

  // 11. Pedagantyada (Gangavaram Port, Appikonda extinct coastal percolation tank)
  {
    id: 'pedagantyada',
    name: 'Pedagantyada',
    teluguName: 'పెదగంట్యాడ',
    category: 'Coastal',
    svgPath: 'M 310,590 L 420,600 L 450,660 L 360,670 L 270,660 L 265,620 Z',
    center: { x: 355, y: 630 },
    statusColor: 'grey',
    statusLabel: '1. Extinct (Appikonda Silted Coastal Tank • Sookh Kar Mit Gaya • NDWI -0.28)',
    groundwaterDepthMbgl: 14.2,
    waterBodiesCount: 16,
    primaryWaterBody: 'Pedagantyada Coastal Silted Tank (Extinct Urban Bed)',
    primaryRiver: 'Appikonda Coastal Runoff',
    riverBasin: 'Appikonda Marine Margins',
    aquiferStatus: 'Extinct Wetland / Total Saline Inundation',
    rechargeStructuresCount: 10,
  },
];

interface VisakhapatnamCadastralMapSvgProps {
  waterBodies: WaterBody[];
  activeWaterBody: WaterBody | null;
  hoveredWaterBody: WaterBody | null;
  onSelectWaterBody: (wb: WaterBody) => void;
  onSelectMandal?: (mandal: VisakhapatnamMandalData) => void;
  selectedMandalId?: string | null;
  viewFilter?: string;
  theme?: string;
  showRivers?: boolean;
  onSwitchDistrict?: (dist: string) => void;
  onLodgeComplaint?: () => void;
}

export const VisakhapatnamCadastralMapSvg: React.FC<VisakhapatnamCadastralMapSvgProps> = ({
  waterBodies,
  activeWaterBody,
  hoveredWaterBody,
  onSelectWaterBody,
  onSelectMandal,
  selectedMandalId,
  viewFilter,
  theme,
  showRivers = true,
  onSwitchDistrict,
  onLodgeComplaint,
}) => {
  const [hoveredMandal, setHoveredMandal] = useState<VisakhapatnamMandalData | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoomLevel(prev => Math.max(0.6, Math.min(prev * factor, 3.5)));
  };

  // Drag Panning Handlers (Aage-Piche, Upar-Neeche)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const panStep = 80;
  const panDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    setPanOffset(prev => {
      switch (dir) {
        case 'up': return { ...prev, y: prev.y + panStep };
        case 'down': return { ...prev, y: prev.y - panStep };
        case 'left': return { ...prev, x: prev.x + panStep };
        case 'right': return { ...prev, x: prev.x - panStep };
      }
    });
  };

  // Clear cadastral palette with 5-color filter highlighting & crisp contrast
  const getMandalFill = (mandal: VisakhapatnamMandalData) => {
    const isSelected = selectedMandalId === mandal.id;
    const isHovered = hoveredMandal?.id === mandal.id;

    if (isSelected) return '#bae6fd'; // Bright active selection sky blue
    if (isHovered) return '#fed7aa'; // Bright hover saffron

    // If 5-Color condition filter is active, highlight matching mandals and subtly dim others
    if (viewFilter && viewFilter !== 'all') {
      const isMatch = (viewFilter === 'extinct' && mandal.statusColor === 'grey') ||
                      (viewFilter === 'red' && mandal.statusColor === 'red') ||
                      (viewFilter === 'green' && mandal.statusColor === 'green') ||
                      (viewFilter === 'yellow' && mandal.statusColor === 'yellow') ||
                      (viewFilter === 'blue' && mandal.statusColor === 'blue');
      if (!isMatch) {
        return '#f1f5f9'; // soft dim for non-matching mandals
      }
    }

    // Official Cadastral Pastel Tones (Clean, high readability)
    switch (mandal.id) {
      case 'bheemunipatnam':
        return '#dbeafe'; // coastal blue
      case 'padmanabham':
        return '#fef3c7'; // warm wheat
      case 'anandapuram':
        return '#dcfce7'; // fresh emerald
      case 'pendurthi':
        return '#fee2e2'; // soft rose
      case 'gopalapatnam':
        return '#e0f2fe'; // clear sky
      case 'visakhapatnam_rural':
        return '#d1fae5'; // mint forest
      case 'seethammadhara':
        return '#fef9c3'; // light lemon
      case 'visakhapatnam_urban':
        return '#fed7aa'; // soft peach/orange
      case 'mulagada':
        return '#e2e8f0'; // industrial slate
      case 'gajuwaka':
        return '#ffe4e6'; // light rose
      case 'pedagantyada':
        return '#f1f5f9'; // muted sand
      default:
        return '#f8fafc';
    }
  };

  const handleMandalClick = (mandal: VisakhapatnamMandalData) => {
    if (onSelectMandal) onSelectMandal(mandal);
    const mandalWb = VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES[mandal.id];
    if (mandalWb && onSelectWaterBody) {
      onSelectWaterBody(mandalWb);
    }
    // Directly scroll down to the full telemetry dossier below the map (no popup card blocking view)
    setTimeout(() => {
      const el = document.getElementById('apwrims-dossier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  const handleRiverClick = (riverName: string, description: string, discharge: string, level: string, danger: string) => {
    const riverWb = Object.values(VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES).find(
      w => w.name.toLowerCase().includes(riverName.toLowerCase()) || w.description.toLowerCase().includes(riverName.toLowerCase())
    ) || VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES['bheemunipatnam'];
    if (riverWb && onSelectWaterBody) {
      onSelectWaterBody({
        ...riverWb,
        name: `${riverName} Estuary & Gauge`,
        description,
        liveTelemetry: {
          ...riverWb.liveTelemetry,
          dischargeCusecs: parseInt(discharge) || 650,
          waterLevelM: parseFloat(level) || 6.8,
          dangerLevelM: parseFloat(danger) || 10.0,
        }
      });
    }
    setTimeout(() => {
      const el = document.getElementById('apwrims-dossier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  const handleReservoirClick = (key: string) => {
    const wb = VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES[key];
    if (wb && onSelectWaterBody) {
      onSelectWaterBody(wb);
    }
    setTimeout(() => {
      const el = document.getElementById('apwrims-dossier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  const handleBorderClick = (regionName: string) => {
    if (regionName === 'VIZIANAGARAM' && onSwitchDistrict) {
      onSwitchDistrict('Vizianagaram');
      return;
    }
    if (regionName === 'PARVATHIPURAM MANYAM' && onSwitchDistrict) {
      onSwitchDistrict('Parvathipuram Manyam');
      return;
    }
    setTimeout(() => {
      const el = document.getElementById('apwrims-dossier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-2xl bg-[#f8fafc]">
      {/* 5-Color Verified Condition Legend in Top-Left (Non-blocking) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-300 shadow-xs text-[11px] font-bold">
        <span className="text-slate-500 font-mono uppercase text-[10px] mr-1 hidden sm:inline">Condition:</span>
        <span className="flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span>1. Extinct</span>
        </span>
        <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          <span>2. Danger Zone</span>
        </span>
        <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>3. Good</span>
        </span>
        <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>4. Medium</span>
        </span>
        <span className="flex items-center gap-1 text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span>5. Normal</span>
        </span>
      </div>

      {/* Directional Pad and Zoom Controls on Top-Right */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-1.5">
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-300 shadow-md">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
            title="प्लस पर क्लिक करके बड़ा करें (Zoom In +)"
            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="text-[11px] font-mono font-bold text-slate-700 px-1 min-w-[36px] text-center select-none">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.65))}
            title="माइनस पर क्लिक करके छोटा करें (Zoom Out -)"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Minus className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            title="Reset View (100%)"
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Directional Pad (Aage / Piche / Upar / Neeche) */}
        <div className="bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-300 shadow-sm flex flex-col items-center gap-1">
          <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <Move className="w-3 h-3 text-sky-600" />
            <span>Pan Map</span>
          </span>
          <div className="grid grid-cols-3 gap-1">
            <div></div>
            <button
              onClick={() => panDirection('up')}
              title="Pan Up (Upar)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div></div>
            <button
              onClick={() => panDirection('left')}
              title="Pan Left (Piche / Baye)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Center"
              className="p-1 rounded-md bg-slate-200 text-slate-800 text-[9px] font-bold cursor-pointer"
            >
              •
            </button>
            <button
              onClick={() => panDirection('right')}
              title="Pan Right (Aage / Daye)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div></div>
            <button
              onClick={() => panDirection('down')}
              title="Pan Down (Neeche)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <div></div>
          </div>
        </div>
      </div>

      {/* Official Map Canvas SVG */}
      <svg
        viewBox="0 0 1000 680"
        onMouseDown={handleMouseDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="vzg-cadastral-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
          </pattern>

          {/* Deep Coastal Sea Gradient */}
          <linearGradient id="vzg-sea-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
          </linearGradient>

          {/* Water Reservoir Gradient */}
          <radialGradient id="vzg-lake-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>

          {/* Danger Zone Glow */}
          <filter id="vzg-glow-red" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Extinct Pattern */}
          <pattern id="vzg-extinct-stripes" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#94a3b8" strokeWidth="1.5" />
          </pattern>
        </defs>

        <rect width="1000" height="680" fill="#f8fafc" />
        <rect width="1000" height="680" fill="url(#vzg-cadastral-grid)" />

        {/* ============================================================== */}
        {/* BAY OF BENGAL MARITIME SHELF (EAST & SOUTH-EAST COASTLINE)     */}
        {/* ============================================================== */}
        <g id="vzg-bay-of-bengal" className="select-none">
          <path
            d="M 870,140 Q 840,240 760,330 T 750,440 Q 675,545 580,565 T 505,595 Q 450,660 360,670 L 1000,680 L 1000,0 L 850,0 Z"
            fill="url(#vzg-sea-gradient)"
            className="transition-colors"
          />

          {/* Animated Coastal Waves / Ripple Lines */}
          <path
            d="M 880,150 Q 850,250 770,340 T 760,450 Q 685,555 590,575 T 515,605 Q 460,670 370,680"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeDasharray="8 6"
            opacity="0.6"
          >
            <animate attributeName="stroke-dashoffset" values="0;28" dur="4s" repeatCount="indefinite" />
          </path>
          <path
            d="M 895,160 Q 865,260 785,350 T 775,460 Q 700,565 605,585 T 530,615"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.6"
            strokeDasharray="12 8"
            opacity="0.5"
          >
            <animate attributeName="stroke-dashoffset" values="28;0" dur="5s" repeatCount="indefinite" />
          </path>

          {/* Bay of Bengal Text & Maritime Identity */}
          <text
            x="850"
            y="420"
            fill="#0369a1"
            fontSize="18"
            fontWeight="bold"
            letterSpacing="3"
            opacity="0.8"
            className="pointer-events-none select-none font-serif"
            transform="rotate(68, 850, 420)"
          >
            BAY OF BENGAL (బంగాళాఖాతం) 🌊
          </text>
          <text
            x="880"
            y="440"
            fill="#0284c7"
            fontSize="11"
            fontStyle="italic"
            opacity="0.75"
            className="pointer-events-none select-none"
            transform="rotate(68, 880, 440)"
          >
            135 km Coastline • Visakhapatnam Natural Deepwater Harbor
          </text>

          {/* Port Ships & Lighthouse Icons */}
          <g transform="translate(860, 290)" className="pointer-events-none">
            <Ship className="w-5 h-5 text-sky-700 animate-pulse" />
            <text x="18" y="12" fill="#0369a1" fontSize="9" fontWeight="bold">Gangavaram / Vizag Port Approach</text>
          </g>
        </g>

        {/* Transform Group for Zoom & Pan */}
        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
          
          {/* ============================================================== */}
          {/* NEIGHBORING DISTRICT BORDERS & CLICKABLE SWITCHERS            */}
          {/* ============================================================== */}
          {/* North & North-East: Vizianagaram District */}
          <g
            className="cursor-pointer group"
            onClick={() => handleBorderClick('VIZIANAGARAM')}
          >
            <rect x="420" y="20" width="340" height="34" rx="10" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1.4" opacity="0.9" />
            <text x="590" y="42" fill="#0369a1" fontSize="12" fontWeight="bold" textAnchor="middle" className="select-none group-hover:underline">
              ▲ VIZIANAGARAM DISTRICT BORDER (Click to View Mandals)
            </text>
          </g>

          {/* West & South-West: Anakapalli District */}
          <g
            className="cursor-pointer group"
            onClick={() => handleBorderClick('ANAKAPALLI')}
          >
            <rect x="140" y="320" width="105" height="180" rx="12" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1.2" opacity="0.85" />
            <text x="192" y="415" fill="#475569" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90, 192, 415)" className="select-none">
              ◀ ANAKAPALLI DISTRICT
            </text>
          </g>

          {/* ============================================================== */}
          {/* CADASTRAL MANDAL POLYGONS (11 MANDALS OF VISAKHAPATNAM)        */}
          {/* ============================================================== */}
          <g id="vzg-mandals-layer">
            {VISAKHAPATNAM_MANDALS.map((mandal) => {
              const isSelected = selectedMandalId === mandal.id;
              const isHovered = hoveredMandal?.id === mandal.id;
              const fillColor = getMandalFill(mandal);
              const isExtinct = mandal.statusColor === 'grey';
              const isDanger = mandal.statusColor === 'red';

              return (
                <g
                  key={mandal.id}
                  className="cursor-pointer transition-all duration-150"
                  onMouseEnter={() => setHoveredMandal(mandal)}
                  onMouseLeave={() => setHoveredMandal(null)}
                  onClick={() => handleMandalClick(mandal)}
                >
                  {/* Mandal Cadastral Polygon */}
                  <path
                    d={mandal.svgPath}
                    fill={fillColor}
                    stroke={isSelected ? '#0284c7' : isHovered ? '#ea580c' : '#475569'}
                    strokeWidth={isSelected ? '3.5' : isHovered ? '2.5' : '1.4'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="transition-all duration-150"
                    filter={isSelected ? 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.45))' : isDanger ? 'url(#vzg-glow-red)' : undefined}
                  />

                  {/* Extinct Hatching Overlay */}
                  {isExtinct && (
                    <path
                      d={mandal.svgPath}
                      fill="url(#vzg-extinct-stripes)"
                      opacity="0.3"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Mandal Telugu & English Name Label (Always Visible & Highly Legible) */}
                  <g pointerEvents="none" className="select-none">
                    <text
                      x={mandal.center.x}
                      y={mandal.center.y - 10}
                      fill="#0f172a"
                      fontSize={isSelected ? "13" : "11.5"}
                      fontWeight="bold"
                      textAnchor="middle"
                      paintOrder="stroke"
                      stroke="#ffffff"
                      strokeWidth="3.8"
                      strokeLinejoin="round"
                    >
                      {mandal.name}
                    </text>
                    <text
                      x={mandal.center.x}
                      y={mandal.center.y + 4}
                      fill="#334155"
                      fontSize="9.5"
                      fontWeight="bold"
                      textAnchor="middle"
                      paintOrder="stroke"
                      stroke="#ffffff"
                      strokeWidth="3.2"
                      strokeLinejoin="round"
                    >
                      {mandal.teluguName}
                    </text>
                  </g>

                  {/* Dedicated Water Body Node on EVERY SINGLE Mandal with 5-Color Standards */}
                  {(() => {
                    const nodeY = mandal.center.y + 20;
                    const isRed = mandal.statusColor === 'red';
                    const isGreen = mandal.statusColor === 'green';
                    const isYellow = mandal.statusColor === 'yellow';
                    const pinColor = isExtinct
                      ? '#64748b'
                      : isRed
                      ? '#ef4444'
                      : isGreen
                      ? '#10b981'
                      : isYellow
                      ? '#f59e0b'
                      : '#0284c7';

                    return (
                      <g
                        transform={`translate(${mandal.center.x}, ${nodeY})`}
                        className="cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMandalClick(mandal);
                        }}
                      >
                        {/* Pulse Ring for Selected or Danger Alert */}
                        {(isSelected || isRed) && (
                          <circle cx="0" cy="0" r="14" fill="none" stroke={pinColor} strokeWidth="1.8" strokeDasharray="3 3">
                            <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}

                        {/* Extinct Dashed Halo */}
                        {isExtinct && (
                          <circle cx="0" cy="0" r="11" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" />
                        )}

                        {/* Main Node Circle */}
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? '7' : '5.5'}
                          fill={pinColor}
                          stroke="#ffffff"
                          strokeWidth="1.8"
                          filter="drop-shadow(0 1px 3px rgba(0,0,0,0.35))"
                        />

                        {/* Icon symbol: ✕ for Extinct, ! for Danger, 💧 for Water */}
                        <text
                          x="0"
                          y={isExtinct ? "2" : isRed ? "2.2" : "2.5"}
                          fontSize={isExtinct ? "6.5" : isRed ? "6" : "6"}
                          fill="#ffffff"
                          textAnchor="middle"
                          className="select-none pointer-events-none font-bold"
                        >
                          {isExtinct ? '✕' : isRed ? '!' : '💧'}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              );
            })}
          </g>

          {/* ============================================================== */}
          {/* PROMINENT FRESHWATER RESERVOIRS & LAKES (CLICKABLE GEO-SURFACE) */}
          {/* ============================================================== */}
          {/* 1. Meghadrigedda Reservoir (In Gopalapatnam / Simhachalam Valley) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleReservoirClick('gopalapatnam')}
          >
            <path
              d="M 370,415 Q 400,395 425,415 T 415,445 Q 380,455 365,435 Z"
              fill="url(#vzg-lake-grad)"
              stroke="#0284c7"
              strokeWidth="2"
              filter="drop-shadow(0 2px 5px rgba(2,132,199,0.5))"
            />
            <text
              x="395"
              y="432"
              fill="#ffffff"
              fontSize="8.5"
              fontWeight="bold"
              textAnchor="middle"
              paintOrder="stroke"
              stroke="#0369a1"
              strokeWidth="2.5"
              className="pointer-events-none select-none"
            >
              Meghadrigedda (34.2 MCM)
            </text>
          </g>

          {/* 2. Mudasarlova Reservoir (In Visakhapatnam Rural / Arilova Valley) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleReservoirClick('visakhapatnam_rural')}
          >
            <ellipse
              cx="560"
              cy="365"
              rx="28"
              ry="16"
              fill="url(#vzg-lake-grad)"
              stroke="#0284c7"
              strokeWidth="1.8"
              filter="drop-shadow(0 2px 4px rgba(2,132,199,0.4))"
            />
            <text
              x="560"
              y="368"
              fill="#ffffff"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              paintOrder="stroke"
              stroke="#0369a1"
              strokeWidth="2"
              className="pointer-events-none select-none"
            >
              Mudasarlova (18.5 MCM)
            </text>
          </g>

          {/* 3. Gambheeram Reservoir (In Anandapuram) */}
          <g
            className="cursor-pointer group"
            onClick={() => handleReservoirClick('anandapuram')}
          >
            <ellipse
              cx="570"
              cy="255"
              rx="24"
              ry="14"
              fill="url(#vzg-lake-grad)"
              stroke="#0284c7"
              strokeWidth="1.6"
              filter="drop-shadow(0 2px 4px rgba(2,132,199,0.4))"
            />
            <text
              x="570"
              y="258"
              fill="#ffffff"
              fontSize="7.5"
              fontWeight="bold"
              textAnchor="middle"
              paintOrder="stroke"
              stroke="#0369a1"
              strokeWidth="2"
              className="pointer-events-none select-none"
            >
              Gambheeram (14.2 MCM)
            </text>
          </g>

          {/* ============================================================== */}
          {/* MAJOR RIVERS & FLOW CHANNELS (ANIMATED WATER FLOW)             */}
          {/* ============================================================== */}
          {showRivers && (
            <g id="vzg-rivers-layer">
              {/* Gosthani River (North-East entry through Bheemili to Bay of Bengal) */}
              <g
                className="cursor-pointer group"
                onClick={() => handleRiverClick('Gosthani River', 'Major coastal river flowing from Ananthagiri hills through S.Kota & Anandapuram into the Bay of Bengal at Bheemili.', '650 Cusecs', '6.8 m', '10.0 m')}
              >
                <path d="M 520,180 Q 610,185 710,195 T 840,240" fill="none" stroke="transparent" strokeWidth="24" />
                <path d="M 520,180 Q 610,185 710,195 T 840,240" fill="none" stroke="#0284c7" strokeWidth="4.2" strokeLinecap="round" />
                <circle r="4" fill="#38bdf8" className="pointer-events-none">
                  <animateMotion path="M 520,180 Q 610,185 710,195 T 840,240" dur="4s" repeatCount="indefinite" />
                </circle>
                <text
                  x="680"
                  y="185"
                  fill="#0369a1"
                  fontSize="10"
                  fontWeight="bold"
                  fontStyle="italic"
                  paintOrder="stroke"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  className="pointer-events-none select-none"
                >
                  Gosthani River 🌊 (గోస్తని నది)
                </text>
              </g>

              {/* Meghadrigedda Stream Flow towards Harbor */}
              <g
                className="cursor-pointer group"
                onClick={() => handleRiverClick('Meghadrigedda River', 'Primary urban stream originating in Simhachalam hills, feeding Meghadrigedda reservoir and discharging into Visakhapatnam inner harbor.', '220 Cusecs', '12.4 m', '16.0 m')}
              >
                <path d="M 330,370 Q 360,400 395,440 T 450,510 T 510,540" fill="none" stroke="transparent" strokeWidth="20" />
                <path d="M 330,370 Q 360,400 395,440 T 450,510 T 510,540" fill="none" stroke="#0284c7" strokeWidth="3.2" strokeLinecap="round" strokeDasharray="4 2" />
                <text
                  x="420"
                  y="470"
                  fill="#0369a1"
                  fontSize="9.5"
                  fontWeight="bold"
                  fontStyle="italic"
                  paintOrder="stroke"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  className="pointer-events-none select-none"
                >
                  Meghadrigedda Stream
                </text>
              </g>

              {/* Gajuwaka Industrial Drainage Canal */}
              <g
                className="cursor-pointer group"
                onClick={() => handleRiverClick('Gajuwaka Industrial Drainage Canal', 'Hazardous industrial wastewater channel draining petrochemical, refinery and engineering effluents.', '85 Cusecs', '4.8 m', '8.5 m')}
              >
                <path d="M 280,480 Q 330,520 375,560 T 440,610" fill="none" stroke="transparent" strokeWidth="18" />
                <path d="M 280,480 Q 330,520 375,560 T 440,610" fill="none" stroke="#ef4444" strokeWidth="2.8" strokeLinecap="round" strokeDasharray="5 3" />
                <text
                  x="330"
                  y="555"
                  fill="#b91c1c"
                  fontSize="8.5"
                  fontWeight="bold"
                  fontStyle="italic"
                  paintOrder="stroke"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  className="pointer-events-none select-none"
                >
                  Industrial Canal ⚠️
                </text>
              </g>
            </g>
          )}

          {/* Compass Rose in Bottom-Left */}
          <g transform="translate(60, 570)" className="pointer-events-none opacity-80">
            <circle cx="20" cy="20" r="18" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <path d="M 20,4 L 25,20 L 20,16 L 15,20 Z" fill="#ef4444" />
            <path d="M 20,36 L 25,20 L 20,24 L 15,20 Z" fill="#64748b" />
            <text x="20" y="3" fill="#0f172a" fontSize="8" fontWeight="bold" textAnchor="middle">N</text>
            <text x="20" y="32" fill="#0369a1" fontSize="6.5" fontWeight="bold" textAnchor="middle">APWRIMS</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
