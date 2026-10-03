import React, { useState } from 'react';
import { WaterBody, CitizenComplaint, WaterBodyStatusColor, UserRoleType } from '../types/nirikshan';
import { 
  Activity, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  Droplets, 
  CheckCircle2, 
  Wifi, 
  Maximize2, 
  Info,
  Radio,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface InteractiveIndiaMapProps {
  waterBodies: WaterBody[];
  complaints?: CitizenComplaint[];
  currentRole?: UserRoleType;
  districtFilter?: string;
  onSelectWaterBody?: (wb: WaterBody) => void;
  onSelectComplaint?: (c: CitizenComplaint) => void;
  onLodgeComplaint?: () => void;
}

interface StatePolygon {
  id: string;
  name: string;
  code: string;
  path: string;
  center: { x: number; y: number };
  isAndhraPradesh?: boolean;
}

// Precision SVG Paths representing India's States (Canvas 900 x 780)
const INDIA_STATES: StatePolygon[] = [
  // 1. Jammu & Kashmir & Ladakh (Northern Top)
  {
    id: 'JK',
    name: 'Jammu & Kashmir / Ladakh',
    code: 'JK',
    center: { x: 395, y: 105 },
    path: `M 360,50 L 415,45 L 470,75 L 485,115 L 450,145 L 390,140 L 345,115 L 335,80 Z`,
  },
  // 2. Himachal Pradesh
  {
    id: 'HP',
    name: 'Himachal Pradesh',
    code: 'HP',
    center: { x: 410, y: 155 },
    path: `M 390,140 L 450,145 L 460,175 L 420,185 L 390,165 Z`,
  },
  // 3. Punjab
  {
    id: 'PB',
    name: 'Punjab (Sirhind Canal)',
    code: 'PB',
    center: { x: 355, y: 165 },
    path: `M 345,115 L 390,140 L 390,175 L 350,195 L 330,170 Z`,
  },
  // 4. Uttarakhand
  {
    id: 'UK',
    name: 'Uttarakhand (Tehri Basin)',
    code: 'UK',
    center: { x: 450, y: 180 },
    path: `M 420,185 L 460,175 L 490,200 L 460,225 L 425,205 Z`,
  },
  // 5. Haryana & Delhi (Apex Command)
  {
    id: 'DL',
    name: 'Delhi NCR & Haryana',
    code: 'DL',
    center: { x: 388, y: 215 },
    path: `M 365,185 L 410,185 L 415,230 L 375,235 L 360,205 Z`,
  },
  // 6. Rajasthan (Thar Basin)
  {
    id: 'RJ',
    name: 'Rajasthan (Osian Basin)',
    code: 'RJ',
    center: { x: 285, y: 245 },
    path: `M 330,170 L 375,205 L 375,260 L 345,315 L 265,305 L 225,245 L 255,195 Z`,
  },
  // 7. Uttar Pradesh (Ganges & Yamuna Valley)
  {
    id: 'UP',
    name: 'Uttar Pradesh (Ganga Basin)',
    code: 'UP',
    center: { x: 485, y: 250 },
    path: `M 415,225 L 460,225 L 490,200 L 580,240 L 590,285 L 530,305 L 445,295 L 415,260 Z`,
  },
  // 8. Gujarat (Sabarmati & Saurashtra)
  {
    id: 'GJ',
    name: 'Gujarat (Sabarmati Basin)',
    code: 'GJ',
    center: { x: 205, y: 345 },
    path: `M 225,245 L 265,305 L 275,355 L 235,395 L 175,380 L 155,340 L 195,300 Z`,
  },
  // 9. Madhya Pradesh (Bundelkhand & Betwa)
  {
    id: 'MP',
    name: 'Madhya Pradesh (Betwa Basin)',
    code: 'MP',
    center: { x: 395, y: 345 },
    path: `M 345,315 L 445,295 L 530,305 L 525,375 L 465,405 L 365,400 L 315,355 Z`,
  },
  // 10. Bihar (Ganges Delta)
  {
    id: 'BR',
    name: 'Bihar',
    code: 'BR',
    center: { x: 620, y: 275 },
    path: `M 580,240 L 675,250 L 685,305 L 610,315 L 590,285 Z`,
  },
  // 11. Jharkhand
  {
    id: 'JH',
    name: 'Jharkhand',
    code: 'JH',
    center: { x: 625, y: 340 },
    path: `M 610,315 L 685,305 L 680,375 L 605,375 L 595,335 Z`,
  },
  // 12. West Bengal
  {
    id: 'WB',
    name: 'West Bengal',
    code: 'WB',
    center: { x: 690, y: 330 },
    path: `M 675,250 L 710,240 L 730,295 L 705,395 L 675,375 L 680,315 Z`,
  },
  // 13. Odisha (Mahanadi River Basin)
  {
    id: 'OD',
    name: 'Odisha (Mahanadi Delta)',
    code: 'OD',
    center: { x: 595, y: 415 },
    path: `M 530,375 L 605,375 L 675,375 L 635,465 L 565,475 L 545,415 Z`,
  },
  // 14. Chhattisgarh
  {
    id: 'CG',
    name: 'Chhattisgarh',
    code: 'CG',
    center: { x: 515, y: 395 },
    path: `M 525,375 L 545,415 L 525,485 L 485,465 L 485,395 Z`,
  },
  // 15. Maharashtra (Marathwada & Godavari)
  {
    id: 'MH',
    name: 'Maharashtra (Latur Basin)',
    code: 'MH',
    center: { x: 305, y: 445 },
    path: `M 275,355 L 365,400 L 465,405 L 455,485 L 355,510 L 255,475 L 265,395 Z`,
  },
  // 16. Telangana (Godavari & Krishna Mid-Stream)
  {
    id: 'TS',
    name: 'Telangana',
    code: 'TS',
    center: { x: 440, y: 495 },
    path: `M 455,445 L 495,445 L 510,515 L 440,540 L 415,495 Z`,
  },
  // 17. ANDHRA PRADESH (PRIME HIGHLIGHT: VIZIANAGARAM & PARVATHIPURAM MANYAM)
  {
    id: 'AP',
    name: 'Andhra Pradesh (Vizianagaram & Parvathipuram)',
    code: 'AP',
    center: { x: 495, y: 555 },
    isAndhraPradesh: true,
    // Carefully tailored coastal crescent path of AP matching real topography
    path: `M 565,475 L 615,465 L 575,540 L 515,610 L 455,625 L 440,580 L 485,550 L 510,515 L 495,445 L 530,475 Z`,
  },
  // 18. Karnataka (Kolar Hard-Rock Aquifer)
  {
    id: 'KA',
    name: 'Karnataka (Kolar Hard-Rock)',
    code: 'KA',
    center: { x: 345, y: 565 },
    path: `M 355,510 L 415,495 L 440,580 L 415,630 L 335,635 L 315,555 Z`,
  },
  // 19. Tamil Nadu (Kaveri & Noyyal Basin)
  {
    id: 'TN',
    name: 'Tamil Nadu (Noyyal Basin)',
    code: 'TN',
    center: { x: 405, y: 665 },
    path: `M 415,630 L 455,625 L 440,710 L 385,735 L 365,665 Z`,
  },
  // 20. Kerala (Vembanad Wetland)
  {
    id: 'KL',
    name: 'Kerala (Vembanad Lake)',
    code: 'KL',
    center: { x: 345, y: 685 },
    path: `M 335,635 L 365,665 L 385,735 L 360,740 L 325,675 Z`,
  },
  // 21. Assam & Northeast (Brahmaputra Valley)
  {
    id: 'NE',
    name: 'Assam & Northeast (Brahmaputra)',
    code: 'NE',
    center: { x: 795, y: 245 },
    path: `M 710,240 L 765,195 L 845,215 L 860,265 L 810,315 L 755,305 L 730,260 Z`,
  },
];

// Telemetry Hubs across the National Grid
interface TelemetryHub {
  id: string;
  name: string;
  label: string;
  coords: { x: number; y: number };
  type: 'apex' | 'district' | 'catchment';
  status: WaterBodyStatusColor;
  tdsPpm: number;
  waterLevel: number;
  state: string;
}

const NATIONAL_HUBS: TelemetryHub[] = [
  {
    id: 'hub-delhi',
    name: 'New Delhi Apex Command (NWIC / Ministry)',
    label: 'New Delhi (Apex)',
    coords: { x: 388, y: 215 },
    type: 'apex',
    status: 'green',
    tdsPpm: 195,
    waterLevel: 94,
    state: 'Delhi',
  },
  {
    id: 'hub-vzm',
    name: 'Vizianagaram Hub (Tatipudi & Champavathi)',
    label: 'Vizianagaram (AP)',
    coords: { x: 575, y: 485 },
    type: 'district',
    status: 'yellow',
    tdsPpm: 680,
    waterLevel: 52,
    state: 'Andhra Pradesh',
  },
  {
    id: 'hub-pvm',
    name: 'Parvathipuram Manyam Hub (Nagavali & Thotapalli)',
    label: 'Parvathipuram (AP)',
    coords: { x: 585, y: 460 },
    type: 'district',
    status: 'red',
    tdsPpm: 1250,
    waterLevel: 34,
    state: 'Andhra Pradesh',
  },
  {
    id: 'hub-bhopal',
    name: 'Betwa Basin Telemetry (Bundelkhand)',
    label: 'Bundelkhand (MP)',
    coords: { x: 420, y: 310 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 380,
    waterLevel: 62,
    state: 'Madhya Pradesh',
  },
  {
    id: 'hub-jaipur',
    name: 'Thar Desert Basin (Osian Beri)',
    label: 'Jodhpur (RJ)',
    coords: { x: 285, y: 245 },
    type: 'catchment',
    status: 'red',
    tdsPpm: 1840,
    waterLevel: 18,
    state: 'Rajasthan',
  },
  {
    id: 'hub-latur',
    name: 'Marathwada Watershed (Shirur Anantpal)',
    label: 'Latur (MH)',
    coords: { x: 375, y: 470 },
    type: 'catchment',
    status: 'yellow',
    tdsPpm: 760,
    waterLevel: 42,
    state: 'Maharashtra',
  },
  {
    id: 'hub-kolar',
    name: 'Kolar Crystalline Piezometer Lake',
    label: 'Kolar (KA)',
    coords: { x: 395, y: 595 },
    type: 'catchment',
    status: 'red',
    tdsPpm: 1320,
    waterLevel: 24,
    state: 'Karnataka',
  },
  {
    id: 'hub-cbe',
    name: 'Noyyal Headwaters (Western Ghats)',
    label: 'Coimbatore (TN)',
    coords: { x: 375, y: 690 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 180,
    waterLevel: 91,
    state: 'Tamil Nadu',
  },
  {
    id: 'hub-patna',
    name: 'Mid-Ganga Basin (Bihar Command)',
    label: 'Patna (BR)',
    coords: { x: 620, y: 275 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 340,
    waterLevel: 78,
    state: 'Bihar',
  },
  {
    id: 'hub-lucknow',
    name: 'Upper Ganga & Gomti Sluice (UP Command)',
    label: 'Lucknow (UP)',
    coords: { x: 485, y: 250 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 410,
    waterLevel: 68,
    state: 'Uttar Pradesh',
  },
  {
    id: 'hub-guwahati',
    name: 'Brahmaputra Flood Hydrology Node',
    label: 'Guwahati (AS)',
    coords: { x: 795, y: 245 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 140,
    waterLevel: 88,
    state: 'Assam',
  },
  {
    id: 'hub-bathinda',
    name: 'Sirhind Canal Inflow Gate (Malwa)',
    label: 'Bathinda (PB)',
    coords: { x: 340, y: 165 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 460,
    waterLevel: 74,
    state: 'Punjab',
  },
];

// Telemetry Connection Rays (like in the user's video!)
const TELEMETRY_LINES = [
  { from: 'hub-delhi', to: 'hub-bathinda' },
  { from: 'hub-delhi', to: 'hub-jaipur' },
  { from: 'hub-delhi', to: 'hub-lucknow' },
  { from: 'hub-delhi', to: 'hub-bhopal' },
  { from: 'hub-delhi', to: 'hub-patna' },
  { from: 'hub-delhi', to: 'hub-vzm' },
  { from: 'hub-lucknow', to: 'hub-patna' },
  { from: 'hub-patna', to: 'hub-guwahati' },
  { from: 'hub-bhopal', to: 'hub-latur' },
  { from: 'hub-bhopal', to: 'hub-vzm' },
  { from: 'hub-vzm', to: 'hub-pvm' },
  { from: 'hub-vzm', to: 'hub-kolar' },
  { from: 'hub-latur', to: 'hub-kolar' },
  { from: 'hub-kolar', to: 'hub-cbe' },
];

export const InteractiveIndiaMap: React.FC<InteractiveIndiaMapProps> = ({
  waterBodies,
  complaints = [],
  currentRole = 'admin',
  districtFilter,
  onSelectWaterBody,
  onSelectComplaint,
  onLodgeComplaint,
}) => {
  // Tabs just like in the user's Smart India Hackathon video: [All] [Alerts] [Active]
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'active'>('active');
  const [hoveredState, setHoveredState] = useState<StatePolygon | null>(null);
  const [selectedState, setSelectedState] = useState<StatePolygon>(
    INDIA_STATES.find((s) => s.id === 'AP') || INDIA_STATES[16]
  );
  const [selectedHub, setSelectedHub] = useState<TelemetryHub>(
    NATIONAL_HUBS.find((h) => h.id === 'hub-vzm') || NATIONAL_HUBS[1]
  );

  // Filter hubs based on tab
  const displayedHubs = NATIONAL_HUBS.filter((hub) => {
    if (activeTab === 'alerts') {
      return hub.status === 'red' || hub.status === 'yellow';
    }
    return true; // 'all' and 'active' show monitored hubs
  });

  const getStatusColor = (status: WaterBodyStatusColor) => {
    switch (status) {
      case 'green':
        return {
          fill: '#10b981',
          stroke: '#047857',
          pulse: 'rgba(16, 185, 129, 0.4)',
          text: 'text-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'Bahut Achha (Pristine)',
        };
      case 'blue':
        return {
          fill: '#0284c7',
          stroke: '#0369a1',
          pulse: 'rgba(2, 132, 199, 0.4)',
          text: 'text-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          label: 'Normal (Acceptable)',
        };
      case 'yellow':
        return {
          fill: '#f59e0b',
          stroke: '#b45309',
          pulse: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          label: 'Middle Problem (Moderate Stress)',
        };
      case 'red':
        return {
          fill: '#ef4444',
          stroke: '#b91c1c',
          pulse: 'rgba(239, 68, 68, 0.5)',
          text: 'text-rose-700',
          badge: 'bg-rose-100 text-rose-800 border-rose-300',
          label: 'Danger Zone (Severe Breach / Effluent)',
        };
      case 'grey':
        return {
          fill: '#64748b',
          stroke: '#334155',
          pulse: 'rgba(100, 116, 139, 0.2)',
          text: 'text-slate-700',
          badge: 'bg-slate-200 text-slate-800 border-slate-300',
          label: 'Existence Se Mit Gaya (Extinct)',
        };
      default:
        return {
          fill: '#0284c7',
          stroke: '#0369a1',
          pulse: 'rgba(2, 132, 199, 0.4)',
          text: 'text-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          label: 'Normal',
        };
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm w-full font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar matching video: Clean, professional header with [All] [Alerts] [Active] */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>National Water Surveillance Grid</span>
              <span className="text-[10px] font-mono bg-blue-50 text-[#0047ab] px-2 py-0.5 rounded font-bold border border-blue-200">
                INDIA-WRIS & AP TELEMETRY NODE
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Real-time digital groundwater DWLR sensors, reservoir capacities & 5-color water health codes
          </p>
        </div>

        {/* Filter Pills right from the user's video: [All] [Alerts] [Active] */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alerts</span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map View Canvas (Styled exactly like the clean Smart India Hackathon grid in video!) */}
      <div className="relative w-full h-[540px] sm:h-[620px] bg-[#f8fafc] overflow-hidden select-none border-b border-slate-200">
        {/* Animated Keyframe Styles for Telemetry Lines & Concentric Pulses */}
        <style>{`
          @keyframes telemetryPulse {
            0% { stroke-dashoffset: 60; }
            100% { stroke-dashoffset: 0; }
          }
          .telemetry-flow-line {
            stroke-dasharray: 6 6;
            animation: telemetryPulse 2.8s linear infinite;
          }
          @keyframes concentricPulse {
            0% { r: 7px; opacity: 0.9; stroke-width: 2px; }
            50% { r: 18px; opacity: 0.4; stroke-width: 1.5px; }
            100% { r: 28px; opacity: 0; stroke-width: 0.5px; }
          }
          .hub-pulse-ring {
            animation: concentricPulse 2.4s cubic-bezier(0.2, 0.4, 0.4, 1) infinite;
            transform-origin: center;
          }
          .hub-pulse-ring-delayed {
            animation: concentricPulse 2.4s cubic-bezier(0.2, 0.4, 0.4, 1) infinite;
            animation-delay: 1.2s;
            transform-origin: center;
          }
        `}</style>

        {/* SVG Drawing Area */}
        <svg viewBox="0 0 900 780" className="w-full h-full">
          <defs>
            {/* The Blueprint Graph Grid Pattern seen in the user's video */}
            <pattern id="sihGrid" width="36" height="36" patternUnits="userSpaceOnUse">
              <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="1.2" fill="#cbd5e1" />
            </pattern>

            {/* Subtle Gradient for Andhra Pradesh Highlight */}
            <linearGradient id="andhraGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.9" />
            </linearGradient>

            {/* Hovered State Gradient */}
            <linearGradient id="hoverGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#dbeafe" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.95" />
            </linearGradient>
          </defs>

          {/* Background Blueprint Grid */}
          <rect width="900" height="780" fill="url(#sihGrid)" />

          {/* Ocean Labels */}
          <text x="130" y="520" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="4" transform="rotate(-55, 130, 520)">
            ARABIAN SEA
          </text>
          <text x="640" y="520" fill="#94a3b8" fontSize="12" fontWeight="bold" letterSpacing="4" transform="rotate(55, 640, 520)">
            BAY OF BENGAL
          </text>
          <text x="360" y="755" fill="#94a3b8" fontSize="11" fontWeight="bold" letterSpacing="5">
            INDIAN OCEAN (భారత మహాసముద్రం)
          </text>

          {/* Indian States Vectors (All interactive with hover & click) */}
          <g id="india-states-layer">
            {INDIA_STATES.map((state) => {
              const isSelected = selectedState.id === state.id;
              const isHovered = hoveredState?.id === state.id;
              const isAP = state.isAndhraPradesh;

              return (
                <path
                  key={state.id}
                  d={state.path}
                  className="transition-colors duration-200 cursor-pointer"
                  fill={
                    isSelected
                      ? '#dbeafe'
                      : isAP
                      ? 'url(#andhraGlow)'
                      : isHovered
                      ? '#e0e7ff'
                      : '#f1f5f9'
                  }
                  stroke={
                    isSelected
                      ? '#0047ab'
                      : isAP
                      ? '#0284c7'
                      : isHovered
                      ? '#3b82f6'
                      : '#cbd5e1'
                  }
                  strokeWidth={isSelected || isAP ? '2.5' : '1.3'}
                  strokeLinejoin="round"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(state)}
                />
              );
            })}
          </g>

          {/* Telemetry Flow Connection Rays (From the video! Shows network connecting monitoring centers) */}
          {activeTab === 'active' && (
            <g id="telemetry-lines-layer" opacity="0.85">
              {TELEMETRY_LINES.map((line, idx) => {
                const source = NATIONAL_HUBS.find((h) => h.id === line.from);
                const target = NATIONAL_HUBS.find((h) => h.id === line.to);
                if (!source || !target) return null;

                return (
                  <g key={`line-${idx}`}>
                    {/* Background glow stroke */}
                    <line
                      x1={source.coords.x}
                      y1={source.coords.y}
                      x2={target.coords.x}
                      y2={target.coords.y}
                      stroke="rgba(16, 185, 129, 0.25)"
                      strokeWidth="2.5"
                    />
                    {/* Animated running data dash line */}
                    <line
                      x1={source.coords.x}
                      y1={source.coords.y}
                      x2={target.coords.x}
                      y2={target.coords.y}
                      stroke="#10b981"
                      strokeWidth="1.6"
                      className="telemetry-flow-line"
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Andhra Pradesh Detailed Callout Label */}
          <g transform="translate(560, 520)">
            <rect
              width="210"
              height="38"
              rx="8"
              fill="#ffffff"
              stroke="#0284c7"
              strokeWidth="1.5"
              filter="drop-shadow(0 4px 6px rgba(0, 71, 171, 0.1))"
            />
            <circle cx="16" cy="19" r="4.5" fill="#0284c7" />
            <text x="28" y="17" fill="#0047ab" fontSize="10.5" fontWeight="bold">
              ANDHRA PRADESH CIRCLE
            </text>
            <text x="28" y="30" fill="#64748b" fontSize="8.5" fontWeight="semibold">
              Vizianagaram & Parvathipuram Hub
            </text>
          </g>

          {/* New Delhi Apex Hub Callout */}
          <g transform="translate(260, 205)">
            <rect
              width="120"
              height="24"
              rx="6"
              fill="#ffffff"
              stroke="#10b981"
              strokeWidth="1.2"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))"
            />
            <text x="8" y="16" fill="#065f46" fontSize="9.5" fontWeight="bold">
              ★ New Delhi (Apex)
            </text>
          </g>

          {/* Telemetry Hub Dots & Concentric Rings */}
          {displayedHubs.map((hub) => {
            const isSelected = selectedHub.id === hub.id;
            const style = getStatusColor(hub.status);

            return (
              <g
                key={hub.id}
                className="cursor-pointer group"
                onClick={() => {
                  setSelectedHub(hub);
                  // Match corresponding state
                  const matchedState = INDIA_STATES.find(
                    (s) => s.name.toLowerCase().includes(hub.state.toLowerCase())
                  );
                  if (matchedState) setSelectedState(matchedState);
                }}
              >
                {/* Outer animated concentric rings (like in the video!) */}
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  className="hub-pulse-ring"
                  stroke={style.fill}
                  fill="none"
                />
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  className="hub-pulse-ring-delayed"
                  stroke={style.fill}
                  fill="none"
                />

                {/* Base Marker Circle */}
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  r={isSelected ? 8.5 : 6}
                  fill={style.fill}
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 2.5 : 1.8}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                />

                {/* Center Core Dot */}
                <circle
                  cx={hub.coords.x}
                  cy={hub.coords.y}
                  r={2.2}
                  fill="#ffffff"
                />

                {/* Label floating beside point */}
                <g transform={`translate(${hub.coords.x + 8}, ${hub.coords.y - 7})`}>
                  <rect
                    rx="4"
                    width={hub.label.length * 6 + 14}
                    height="17"
                    fill="rgba(255, 255, 255, 0.95)"
                    stroke={style.fill}
                    strokeWidth="1"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.06))"
                  />
                  <text
                    x="6"
                    y="12"
                    fill="#1e293b"
                    fontSize="8.5"
                    fontWeight="bold"
                  >
                    {hub.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Legend Box at Top Left on Canvas */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-slate-200 text-xs shadow-md space-y-1.5 max-w-[240px]">
          <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">
              WATER MONITORING CODES
            </span>
          </div>
          <div className="space-y-1 text-[11px] font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] shrink-0"></span>
              <span><strong>Green:</strong> Bahut Achha (Pristine)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0284c7] shrink-0"></span>
              <span><strong>Blue:</strong> Normal (Acceptable)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shrink-0"></span>
              <span><strong>Yellow:</strong> Middle Problem (Stress)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] shrink-0 animate-pulse"></span>
              <span><strong>Red:</strong> Danger Zone (Contamination)</span>
            </div>
          </div>
        </div>

        {/* Floating Quick Action Button on Map */}
        {onLodgeComplaint && (
          <div className="absolute top-3 right-3">
            <button
              onClick={onLodgeComplaint}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3.5 py-2 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Lodge Hazard Complaint</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom Live Bar matching the user's video: "Selected Hub: Vizianagaram Catchment • ZERO ACTIVE FLAGS" */}
      <div className="p-4 sm:p-5 bg-white border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Station Identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0047ab] font-bold shrink-0">
            <Radio className="w-5 h-5 animate-pulse text-[#0047ab]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                SELECTED HYDRO-STATION:
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(selectedHub.status).badge}`}>
                {getStatusColor(selectedHub.status).label}
              </span>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
              {selectedHub.name}
            </h4>
            <p className="text-xs text-slate-500">
              Region: <strong>{selectedState.name}</strong> • Node Type: {selectedHub.type.toUpperCase()} • Frequency: Continuous Telemetry
            </p>
          </div>
        </div>

        {/* Right: Live Telemetry Metrics */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">TDS TEST READING</span>
            <span className="text-sm font-extrabold text-[#0047ab]">{selectedHub.tdsPpm} ppm</span>
          </div>

          <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">CAPACITY / STORAGE</span>
            <span className="text-sm font-extrabold text-slate-800">{selectedHub.waterLevel}%</span>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-700 font-bold block uppercase flex items-center gap-1 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>GRID STATUS</span>
            </span>
            <span className="text-xs font-extrabold text-emerald-800 font-mono">
              99% OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
