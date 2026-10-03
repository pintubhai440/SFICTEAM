import React from 'react';
import { MicroWatershed, WaterStatus } from '../types/watershed';

interface IndiaMapSvgProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string | null;
  onSelectWatershed: (id: string) => void;
  activeLayer: 'groundwater' | 'rainfall' | 'satellite' | 'assets' | 'all';
  filterMode: 'all' | 'alerts' | 'active';
  activeTimeYear: number;
}

export const IndiaMapSvg: React.FC<IndiaMapSvgProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  activeLayer,
  filterMode,
  activeTimeYear,
}) => {
  // Filter based on 'all' | 'alerts' | 'active'
  const filteredWatersheds = watersheds.filter((w) => {
    if (filterMode === 'alerts') {
      return w.currentStatus === 'critical' || w.currentStatus === 'stressed';
    }
    if (filterMode === 'active') {
      return w.activeAlertsCount > 0 || w.currentStatus !== 'normal';
    }
    return true;
  });

  const getStatusColor = (status: WaterStatus, stressScore: number) => {
    // When time slider is moved back, dynamically simulate status
    if (activeTimeYear === 2023) {
      if (stressScore > 80) return '#f59e0b'; // amber
      return '#10b981'; // emerald
    }
    switch (status) {
      case 'critical':
        return '#ef4444'; // Red
      case 'stressed':
        return '#f97316'; // Orange
      case 'watch':
        return '#eab308'; // Yellow
      case 'normal':
        return '#10b981'; // Green
      default:
        return '#94a3b8'; // Slate
    }
  };

  const getStatusBadgeText = (status: WaterStatus) => {
    switch (status) {
      case 'critical':
        return 'CRITICAL';
      case 'stressed':
        return 'STRESSED';
      case 'watch':
        return 'WATCH';
      case 'normal':
        return 'NORMAL';
      default:
        return 'UNKNOWN';
    }
  };

  // Node network connections (National Surveillance Backbone)
  const connections: [string, string][] = [
    ['ws-delhi-najafgarh', 'ws-bathinda-malwa'],
    ['ws-delhi-najafgarh', 'ws-jodhpur-luni'],
    ['ws-delhi-najafgarh', 'ws-bundelkhand-mahoba'],
    ['ws-jodhpur-luni', 'ws-saurashtra-rajkot'],
    ['ws-saurashtra-rajkot', 'ws-latur-manjra'],
    ['ws-bundelkhand-mahoba', 'ws-latur-manjra'],
    ['ws-latur-manjra', 'ws-anantapur-kalyandurg'],
    ['ws-anantapur-kalyandurg', 'ws-kolar-palavanhalli'],
    ['ws-kolar-palavanhalli', 'ws-coimbatore-noyyal'],
  ];

  return (
    <div className="relative w-full h-[620px] bg-[#f8fbfe] border border-blue-100 rounded-xl overflow-hidden shadow-inner flex items-center justify-center select-none">
      {/* Background Tactical Surveillance Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(14, 116, 144, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(14, 116, 144, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Grid Coordinates Overlay */}
      <div className="absolute top-3 left-4 text-[10px] font-mono text-blue-900/60 uppercase tracking-widest pointer-events-none">
        GRID REF: 08°04′N - 37°06′N / 68°07′E - 97°25′E | DATUM: WGS84
      </div>
      <div className="absolute top-3 right-4 text-[10px] font-mono text-blue-900/60 pointer-events-none">
        PROJECTION: ALBERS EQUAL AREA (INDIA)
      </div>

      <svg
        viewBox="0 0 700 860"
        className="w-full h-full max-h-[620px] z-10 transition-transform duration-500"
      >
        <defs>
          {/* Gradients */}
          <linearGradient id="gridLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="indiaLandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f1f7fc" />
            <stop offset="100%" stopColor="#e2edf8" />
          </linearGradient>

          <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="pulseGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Maritime Waters / Basins Hint */}
        <path
          d="M 60,180 Q 200,140 350,110 T 640,190 L 670,800 Q 400,840 70,780 Z"
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Simplified Accurate India Boundary Silhouette */}
        <g id="india-silhouette" className="transition-opacity duration-300">
          {/* Main India Landmass Path */}
          <path
            d="M 285,90
               C 300,75 320,60 340,55
               C 355,75 375,100 395,115
               C 420,135 440,150 455,160
               C 485,170 515,165 540,175
               C 560,185 580,210 595,230
               C 610,250 620,280 625,300
               C 600,320 570,335 550,340
               C 520,350 490,340 470,350
               C 445,360 435,385 430,410
               C 440,430 455,455 450,480
               C 435,520 415,565 395,615
               C 385,640 375,680 370,720
               C 365,755 355,800 350,815
               C 345,820 338,810 335,790
               C 325,745 315,690 305,640
               C 290,575 270,520 250,480
               C 230,455 200,445 180,450
               C 170,455 160,470 170,485
               C 185,500 215,505 220,515
               C 215,525 195,530 180,515
               C 160,500 150,465 170,435
               C 185,410 210,380 230,345
               C 240,320 235,280 245,250
               C 255,220 260,180 270,140
               Z"
            fill="url(#indiaLandGrad)"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinejoin="round"
            className="filter drop-shadow-md"
          />

          {/* Regional River Flow System (Ganga, Godavari, Krishna, Cauvery, Narmada) */}
          <g stroke="#38bdf8" strokeWidth="1.2" opacity="0.65" fill="none">
            {/* Indus Basin Tributaries */}
            <path d="M 290,120 Q 305,170 312,224 Q 318,255 310,290" />
            {/* Ganga Basin */}
            <path d="M 330,175 Q 380,240 430,290 T 520,335 T 560,345" strokeDasharray="3 2" />
            <path d="M 350,282 Q 400,320 420,382" />
            {/* Narmada / Tapti */}
            <path d="M 430,410 Q 320,440 230,455" />
            {/* Godavari Basin */}
            <path d="M 310,510 Q 366,574 440,560" />
            {/* Krishna Basin */}
            <path d="M 320,620 Q 372,692 410,670" />
            {/* Cauvery Basin */}
            <path d="M 325,740 Q 362,785 388,720 Q 395,745 375,790" />
          </g>

          {/* Major States Internal Guidelines / Boundaries */}
          <g stroke="#cbd5e1" strokeWidth="0.75" strokeDasharray="2 3" fill="none" opacity="0.8">
            {/* Northern States */}
            <path d="M 285,160 L 340,165 L 375,190" />
            <path d="M 265,225 L 330,225 L 360,260" />
            {/* Rajasthan / Gujarat */}
            <path d="M 245,280 L 320,320 L 340,390" />
            <path d="M 220,460 L 270,440 L 310,480" />
            {/* Central / Deccan */}
            <path d="M 310,480 L 390,470 L 440,490" />
            <path d="M 280,560 L 370,550 L 430,580" />
            {/* Southern Peninsula */}
            <path d="M 310,650 L 380,640 L 415,670" />
            <path d="M 330,730 L 375,725 L 385,780" />
          </g>
        </g>

        {/* Animated Surveillance Network Backbone Lines */}
        <g id="network-lines">
          {connections.map(([fromId, toId], idx) => {
            const fromWs = watersheds.find((w) => w.id === fromId);
            const toWs = watersheds.find((w) => w.id === toId);
            if (!fromWs || !toWs) return null;

            return (
              <g key={`conn-${idx}`}>
                {/* Base Connection Line */}
                <line
                  x1={fromWs.coordinates.svgX}
                  y1={fromWs.coordinates.svgY}
                  x2={toWs.coordinates.svgX}
                  y2={toWs.coordinates.svgY}
                  stroke="#0284c7"
                  strokeWidth="1.8"
                  strokeOpacity="0.45"
                  strokeDasharray="4 4"
                />

                {/* Animated Pulsing Data Beam */}
                <line
                  x1={fromWs.coordinates.svgX}
                  y1={fromWs.coordinates.svgY}
                  x2={toWs.coordinates.svgX}
                  y2={toWs.coordinates.svgY}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="10 50"
                  strokeDashoffset="60"
                  className="animate-pulse"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    values="100;0"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                </line>
              </g>
            );
          })}
        </g>

        {/* Interactive Micro-Watershed Nodes */}
        <g id="watershed-nodes">
          {filteredWatersheds.map((ws) => {
            const isSelected = selectedWatershedId === ws.id;
            const color = getStatusColor(ws.currentStatus, ws.stressScore);

            return (
              <g
                key={ws.id}
                className="cursor-pointer transition-transform duration-200"
                onClick={() => onSelectWatershed(ws.id)}
              >
                {/* Outermost Radar Ripple Animation */}
                <circle
                  cx={ws.coordinates.svgX}
                  cy={ws.coordinates.svgY}
                  r={isSelected ? 32 : 22}
                  fill={color}
                  opacity="0.18"
                >
                  <animate
                    attributeName="r"
                    values={isSelected ? '20;36;20' : '12;26;12'}
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.35;0.05;0.35"
                    dur="2.5s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Intermediate Ring */}
                <circle
                  cx={ws.coordinates.svgX}
                  cy={ws.coordinates.svgY}
                  r={isSelected ? 16 : 12}
                  fill="none"
                  stroke={color}
                  strokeWidth={isSelected ? '2.5' : '1.5'}
                  strokeDasharray="3 3"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={`0 ${ws.coordinates.svgX} ${ws.coordinates.svgY}`}
                    to={`360 ${ws.coordinates.svgX} ${ws.coordinates.svgY}`}
                    dur="12s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Solid Core Center */}
                <circle
                  cx={ws.coordinates.svgX}
                  cy={ws.coordinates.svgY}
                  r={isSelected ? 8 : 6}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#glowEffect)"
                />

                {/* Tactical Label Pin */}
                <g transform={`translate(${ws.coordinates.svgX + 14}, ${ws.coordinates.svgY - 10})`}>
                  {/* Label Backdrop */}
                  <rect
                    x="-2"
                    y="-12"
                    width={ws.district.length * 7 + 55}
                    height="24"
                    rx="4"
                    fill={isSelected ? '#1e293b' : 'rgba(255, 255, 255, 0.94)'}
                    stroke={isSelected ? color : '#cbd5e1'}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    className="shadow-sm"
                  />

                  {/* Status Indicator Dot */}
                  <circle
                    cx="6"
                    cy="0"
                    r="3.5"
                    fill={color}
                  />

                  {/* District / Cluster Text */}
                  <text
                    x="15"
                    y="3"
                    fontSize="11"
                    fontWeight="700"
                    fill={isSelected ? '#ffffff' : '#0f172a'}
                    fontFamily="Plus Jakarta Sans, sans-serif"
                  >
                    {ws.district}
                  </text>

                  {/* Sub-label metric */}
                  <text
                    x="15"
                    y="10"
                    fontSize="8"
                    fontWeight="600"
                    fill={isSelected ? '#94a3b8' : '#64748b'}
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {activeLayer === 'groundwater'
                      ? `${ws.groundwaterCurrentBgl}m bgl`
                      : activeLayer === 'rainfall'
                      ? `${ws.rainfallDeficitPercent > 0 ? '+' : ''}${ws.rainfallDeficitPercent}% rain`
                      : activeLayer === 'assets'
                      ? `${ws.functionalAssetsCount}/${ws.totalRechargeAssets} assets`
                      : getStatusBadgeText(ws.currentStatus)}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* Legend Box in Bottom-Right Corner of Map */}
        <g transform="translate(470, 680)">
          <rect
            x="0"
            y="0"
            width="210"
            height="150"
            rx="8"
            fill="rgba(255, 255, 255, 0.92)"
            stroke="#cbd5e1"
            strokeWidth="1"
            className="filter drop-shadow-sm"
          />
          <text x="12" y="20" fontSize="10" fontWeight="700" fill="#1e293b" letterSpacing="0.5">
            SURVEILLANCE STATUS (CGWB / WRIS)
          </text>

          {/* Critical */}
          <circle cx="18" cy="40" r="5" fill="#ef4444" />
          <text x="32" y="44" fontSize="10" fontWeight="600" fill="#334155">
            Critical (Score &gt; 80)
          </text>

          {/* Stressed */}
          <circle cx="18" cy="62" r="5" fill="#f97316" />
          <text x="32" y="66" fontSize="10" fontWeight="600" fill="#334155">
            Stressed (Score 65-80)
          </text>

          {/* Watch */}
          <circle cx="18" cy="84" r="5" fill="#eab308" />
          <text x="32" y="88" fontSize="10" fontWeight="600" fill="#334155">
            Watch (Score 50-65)
          </text>

          {/* Normal */}
          <circle cx="18" cy="106" r="5" fill="#10b981" />
          <text x="32" y="110" fontSize="10" fontWeight="600" fill="#334155">
            Normal / Recharged (&lt; 50)
          </text>

          {/* Verified Field Node */}
          <circle cx="18" cy="128" r="4" fill="#0284c7" stroke="#ffffff" strokeWidth="1" />
          <text x="32" y="132" fontSize="9" fontWeight="500" fill="#64748b">
            Active Telemetric Piezometer
          </text>
        </g>
      </svg>
    </div>
  );
};
