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
  Sparkles,
  Satellite,
  Calendar,
  Clock,
  Compass,
  Eye,
  RefreshCw,
  Gauge
} from 'lucide-react';
import { BhuvanWbisDetailModal } from './BhuvanWbisDetailModal';

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
  ndwi?: number;
  isExtinct?: boolean;
  labelPos?: 'left' | 'right' | 'top' | 'bottom';
}

const getLabelOffset = (pos?: 'left' | 'right' | 'top' | 'bottom', labelLength: number = 10) => {
  const width = labelLength * 5.8 + 12;
  const height = 17;
  switch (pos) {
    case 'left':
      return { x: -width - 8, y: -height / 2, width, height };
    case 'top':
      return { x: -width / 2, y: -height - 9, width, height };
    case 'bottom':
      return { x: -width / 2, y: 13, width, height };
    case 'right':
    default:
      return { x: 8, y: -height / 2, width, height };
  }
};

// Evenly distributed 2 to 3 stations per state across India (AP kept clean with just 2 stations)
const NATIONAL_HUBS: TelemetryHub[] = [
  // 1. Delhi / NCR & Haryana (2 stations)
  {
    id: 'hub-delhi',
    name: 'New Delhi Apex Command (NWIC / Ministry)',
    label: 'New Delhi (Apex)',
    coords: { x: 388, y: 212 },
    type: 'apex',
    status: 'green',
    tdsPpm: 195,
    waterLevel: 94,
    state: 'Delhi',
    ndwi: 0.44,
    labelPos: 'top',
  },
  {
    id: 'hub-damdama',
    name: 'Damdama Rainwater Basin (Gurugram - HR)',
    label: 'Damdama Lake (HR)',
    coords: { x: 370, y: 230 },
    type: 'catchment',
    status: 'yellow',
    tdsPpm: 640,
    waterLevel: 51,
    state: 'Haryana',
    ndwi: 0.12,
    labelPos: 'left',
  },

  // 2. Punjab (2 stations)
  {
    id: 'hub-harike',
    name: 'Harike Wetlands & Beas Confluence',
    label: 'Harike Wetland (PB)',
    coords: { x: 335, y: 145 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 210,
    waterLevel: 88,
    state: 'Punjab',
    ndwi: 0.48,
    labelPos: 'left',
  },
  {
    id: 'hub-bathinda',
    name: 'Sirhind Canal Inflow Gate (Malwa Basin)',
    label: 'Bathinda (PB)',
    coords: { x: 345, y: 175 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 460,
    waterLevel: 74,
    state: 'Punjab',
    ndwi: 0.24,
    labelPos: 'bottom',
  },

  // 3. Jammu & Kashmir & Ladakh (2 stations)
  {
    id: 'hub-dal-lake',
    name: 'Dal Lake & Jhelum Hydrological Node',
    label: 'Dal Lake Srinagar (JK)',
    coords: { x: 395, y: 95 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 155,
    waterLevel: 92,
    state: 'Jammu & Kashmir',
    ndwi: 0.48,
    labelPos: 'right',
  },
  {
    id: 'hub-pangong',
    name: 'Pangong High-Altitude Glacier Lake',
    label: 'Pangong Tso (LK)',
    coords: { x: 455, y: 85 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 120,
    waterLevel: 96,
    state: 'Ladakh',
    ndwi: 0.55,
    labelPos: 'right',
  },

  // 4. Rajasthan (3 stations: Jodhpur Thar, Udaipur, and Sambhar Extinct)
  {
    id: 'hub-jaipur',
    name: 'Thar Desert Basin (Osian Beri Reservoir)',
    label: 'Jodhpur (RJ)',
    coords: { x: 260, y: 240 },
    type: 'catchment',
    status: 'red',
    tdsPpm: 1840,
    waterLevel: 18,
    state: 'Rajasthan',
    ndwi: -0.06,
    labelPos: 'left',
  },
  {
    id: 'hub-sambhar-ext',
    name: 'Sambhar Silt Deposition Bed (Extinct Reach)',
    label: 'Sambhar Lake (⚪ Extinct)',
    coords: { x: 305, y: 235 },
    type: 'catchment',
    status: 'grey',
    tdsPpm: 0,
    waterLevel: 0,
    state: 'Rajasthan',
    ndwi: -0.26,
    isExtinct: true,
    labelPos: 'bottom',
  },
  {
    id: 'hub-udaipur',
    name: 'Lake Pichola & Aravalli Catchment',
    label: 'Udaipur Pichola (RJ)',
    coords: { x: 285, y: 285 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 310,
    waterLevel: 82,
    state: 'Rajasthan',
    ndwi: 0.35,
    labelPos: 'left',
  },

  // 5. Gujarat (2 stations)
  {
    id: 'hub-sabarmati',
    name: 'Sabarmati River Basin & Canal Network',
    label: 'Sabarmati (GJ)',
    coords: { x: 225, y: 335 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 390,
    waterLevel: 71,
    state: 'Gujarat',
    ndwi: 0.26,
    labelPos: 'left',
  },
  {
    id: 'hub-narmada-dam',
    name: 'Sardar Sarovar Dam (Narmada Valley)',
    label: 'Sardar Sarovar (GJ)',
    coords: { x: 275, y: 360 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 195,
    waterLevel: 94,
    state: 'Gujarat',
    ndwi: 0.46,
    labelPos: 'right',
  },

  // 6. Maharashtra (3 stations)
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
    ndwi: 0.12,
    labelPos: 'top',
  },
  {
    id: 'hub-koyna',
    name: 'Shivsagar Reservoir (Koyna Hydro Grid)',
    label: 'Koyna Reservoir (MH)',
    coords: { x: 290, y: 475 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 170,
    waterLevel: 89,
    state: 'Maharashtra',
    ndwi: 0.42,
    labelPos: 'left',
  },
  {
    id: 'hub-aurangabad',
    name: 'Jayakwadi Dam (Godavari Mid-Stream)',
    label: 'Jayakwadi Dam (MH)',
    coords: { x: 340, y: 425 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 410,
    waterLevel: 68,
    state: 'Maharashtra',
    ndwi: 0.29,
    labelPos: 'right',
  },

  // 7. Karnataka (2 stations)
  {
    id: 'hub-kolar',
    name: 'Kolar Crystalline Piezometer Lake',
    label: 'Kolar (KA)',
    coords: { x: 385, y: 595 },
    type: 'catchment',
    status: 'red',
    tdsPpm: 1320,
    waterLevel: 24,
    state: 'Karnataka',
    ndwi: 0.04,
    labelPos: 'right',
  },
  {
    id: 'hub-krs',
    name: 'Krishna Raja Sagara Dam (Cauvery Basin)',
    label: 'KRS Dam Mysore (KA)',
    coords: { x: 335, y: 615 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 215,
    waterLevel: 86,
    state: 'Karnataka',
    ndwi: 0.44,
    labelPos: 'left',
  },

  // 8. Tamil Nadu (2 stations)
  {
    id: 'hub-cbe',
    name: 'Noyyal Headwaters (Western Ghats)',
    label: 'Coimbatore (TN)',
    coords: { x: 375, y: 685 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 180,
    waterLevel: 91,
    state: 'Tamil Nadu',
    ndwi: 0.46,
    labelPos: 'right',
  },
  {
    id: 'hub-mettur',
    name: 'Stanley Reservoir / Mettur Dam (Cauvery)',
    label: 'Mettur Dam (TN)',
    coords: { x: 405, y: 650 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 340,
    waterLevel: 76,
    state: 'Tamil Nadu',
    ndwi: 0.36,
    labelPos: 'right',
  },

  // 9. Kerala (2 stations)
  {
    id: 'hub-vembanad',
    name: 'Vembanad Wetland Ramsar Lake',
    label: 'Vembanad (KL)',
    coords: { x: 340, y: 675 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 280,
    waterLevel: 85,
    state: 'Kerala',
    ndwi: 0.39,
    labelPos: 'left',
  },
  {
    id: 'hub-idukki',
    name: 'Idukki Arch Dam Hydro Catchment',
    label: 'Idukki (KL)',
    coords: { x: 355, y: 715 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 110,
    waterLevel: 94,
    state: 'Kerala',
    ndwi: 0.52,
    labelPos: 'left',
  },

  // 10. Andhra Pradesh (JUST 2 CLEAN, SPACED STATIONS AS REQUESTED)
  {
    id: 'hub-ap-amaravati',
    name: 'Prakasam Barrage & Krishna Delta Apex (AP)',
    label: 'Amaravati (AP)',
    coords: { x: 495, y: 565 },
    type: 'district',
    status: 'blue',
    tdsPpm: 290,
    waterLevel: 81,
    state: 'Andhra Pradesh',
    ndwi: 0.32,
    labelPos: 'right',
  },
  {
    id: 'hub-vzm',
    name: 'Vizianagaram Hub (Tatipudi & Champavathi)',
    label: 'Vizianagaram (AP)',
    coords: { x: 575, y: 475 },
    type: 'district',
    status: 'yellow',
    tdsPpm: 680,
    waterLevel: 52,
    state: 'Andhra Pradesh',
    ndwi: 0.18,
    labelPos: 'right',
  },

  // 11. Telangana (2 stations)
  {
    id: 'hub-hussain-sagar',
    name: 'Hussain Sagar & Musi Urban Catchment',
    label: 'Hyderabad (TS)',
    coords: { x: 440, y: 495 },
    type: 'catchment',
    status: 'yellow',
    tdsPpm: 780,
    waterLevel: 46,
    state: 'Telangana',
    ndwi: 0.16,
    labelPos: 'top',
  },
  {
    id: 'hub-nagarjuna-sagar',
    name: 'Nagarjuna Sagar Dam (Krishna River)',
    label: 'Nagarjuna Sagar (TS)',
    coords: { x: 470, y: 525 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 240,
    waterLevel: 88,
    state: 'Telangana',
    ndwi: 0.44,
    labelPos: 'left',
  },

  // 12. Odisha (2 stations)
  {
    id: 'hub-hirakud',
    name: 'Hirakud Dam Reservoir (Mahanadi River)',
    label: 'Hirakud Dam (OD)',
    coords: { x: 570, y: 395 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 320,
    waterLevel: 79,
    state: 'Odisha',
    ndwi: 0.38,
    labelPos: 'left',
  },
  {
    id: 'hub-chilika',
    name: 'Chilika Coastal Lagoon & Ramsar Wetland',
    label: 'Chilika Lake (OD)',
    coords: { x: 625, y: 435 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 420,
    waterLevel: 91,
    state: 'Odisha',
    ndwi: 0.49,
    labelPos: 'right',
  },

  // 13. West Bengal (2 stations)
  {
    id: 'hub-kolkata-wetland',
    name: 'East Kolkata Wetlands Ramsar Buffer',
    label: 'Kolkata Wetlands (WB)',
    coords: { x: 700, y: 355 },
    type: 'catchment',
    status: 'yellow',
    tdsPpm: 670,
    waterLevel: 58,
    state: 'West Bengal',
    ndwi: 0.15,
    labelPos: 'right',
  },
  {
    id: 'hub-durgapur',
    name: 'Durgapur Barrage (Damodar Valley)',
    label: 'Durgapur Dam (WB)',
    coords: { x: 670, y: 320 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 345,
    waterLevel: 75,
    state: 'West Bengal',
    ndwi: 0.34,
    labelPos: 'right',
  },

  // 14. Bihar (2 stations)
  {
    id: 'hub-patna',
    name: 'Mid-Ganga Basin (Bihar Central Reach)',
    label: 'Patna (BR)',
    coords: { x: 585, y: 275 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 340,
    waterLevel: 78,
    state: 'Bihar',
    ndwi: 0.32,
    labelPos: 'right',
  },
  {
    id: 'hub-kanwar',
    name: 'Kanwar Lake Ramsar Wetland (Begusarai)',
    label: 'Kanwar Lake (BR)',
    coords: { x: 635, y: 265 },
    type: 'catchment',
    status: 'yellow',
    tdsPpm: 620,
    waterLevel: 44,
    state: 'Bihar',
    ndwi: 0.18,
    labelPos: 'right',
  },

  // 15. Uttar Pradesh (2 stations)
  {
    id: 'hub-lucknow',
    name: 'Upper Ganga & Gomti Sluice (UP Command)',
    label: 'Lucknow (UP)',
    coords: { x: 485, y: 245 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 410,
    waterLevel: 68,
    state: 'Uttar Pradesh',
    ndwi: 0.26,
    labelPos: 'top',
  },
  {
    id: 'hub-kanpur',
    name: 'Kanpur Industrial Effluent Reach (Ganga)',
    label: 'Kanpur (UP)',
    coords: { x: 450, y: 265 },
    type: 'catchment',
    status: 'red',
    tdsPpm: 1480,
    waterLevel: 31,
    state: 'Uttar Pradesh',
    ndwi: -0.02,
    labelPos: 'bottom',
  },

  // 16. Madhya Pradesh (2 stations)
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
    ndwi: 0.28,
    labelPos: 'right',
  },
  {
    id: 'hub-upper-lake',
    name: 'Upper Lake Bhojtal (Bhopal Ramsar)',
    label: 'Bhojtal Bhopal (MP)',
    coords: { x: 375, y: 345 },
    type: 'catchment',
    status: 'green',
    tdsPpm: 220,
    waterLevel: 87,
    state: 'Madhya Pradesh',
    ndwi: 0.41,
    labelPos: 'left',
  },

  // 17. Assam & Northeast (2 stations)
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
    ndwi: 0.52,
    labelPos: 'right',
  },
  {
    id: 'hub-loktak',
    name: 'Loktak Floating Phumdis Lake (Manipur)',
    label: 'Loktak Lake (NE)',
    coords: { x: 835, y: 280 },
    type: 'catchment',
    status: 'blue',
    tdsPpm: 210,
    waterLevel: 84,
    state: 'Manipur',
    ndwi: 0.38,
    labelPos: 'right',
  },
];

// Telemetry Connection Rays across Major Indian Basins
const TELEMETRY_LINES = [
  { from: 'hub-delhi', to: 'hub-bathinda' },
  { from: 'hub-delhi', to: 'hub-harike' },
  { from: 'hub-delhi', to: 'hub-jaipur' },
  { from: 'hub-delhi', to: 'hub-lucknow' },
  { from: 'hub-delhi', to: 'hub-dal-lake' },
  { from: 'hub-lucknow', to: 'hub-kanpur' },
  { from: 'hub-kanpur', to: 'hub-patna' },
  { from: 'hub-patna', to: 'hub-guwahati' },
  { from: 'hub-guwahati', to: 'hub-loktak' },
  { from: 'hub-delhi', to: 'hub-bhopal' },
  { from: 'hub-bhopal', to: 'hub-upper-lake' },
  { from: 'hub-upper-lake', to: 'hub-sabarmati' },
  { from: 'hub-sabarmati', to: 'hub-narmada-dam' },
  { from: 'hub-bhopal', to: 'hub-aurangabad' },
  { from: 'hub-aurangabad', to: 'hub-latur' },
  { from: 'hub-bhopal', to: 'hub-hirakud' },
  { from: 'hub-hirakud', to: 'hub-chilika' },
  { from: 'hub-patna', to: 'hub-durgapur' },
  { from: 'hub-durgapur', to: 'hub-kolkata-wetland' },
  { from: 'hub-latur', to: 'hub-hussain-sagar' },
  { from: 'hub-hussain-sagar', to: 'hub-nagarjuna-sagar' },
  { from: 'hub-nagarjuna-sagar', to: 'hub-ap-amaravati' },
  { from: 'hub-hirakud', to: 'hub-vzm' },
  { from: 'hub-vzm', to: 'hub-ap-amaravati' },
  { from: 'hub-latur', to: 'hub-kolar' },
  { from: 'hub-kolar', to: 'hub-krs' },
  { from: 'hub-kolar', to: 'hub-mettur' },
  { from: 'hub-mettur', to: 'hub-cbe' },
  { from: 'hub-cbe', to: 'hub-vembanad' },
  { from: 'hub-vembanad', to: 'hub-idukki' },
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
  // Tabs: [All] [Alerts] [Active] [⚪ Sookh Kar Mit Gaya]
  const [activeTab, setActiveTab] = useState<'all' | 'alerts' | 'active' | 'extinct'>('all');
  const [isNdwiSatelliteOverlayActive, setIsNdwiSatelliteOverlayActive] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [hoveredState, setHoveredState] = useState<StatePolygon | null>(null);
  const [selectedState, setSelectedState] = useState<StatePolygon>(
    INDIA_STATES.find((s) => s.id === 'AP') || INDIA_STATES[16]
  );
  const [selectedHub, setSelectedHub] = useState<TelemetryHub>(
    NATIONAL_HUBS.find((h) => h.id === 'hub-vzm') || NATIONAL_HUBS[1]
  );

  const alertCount = NATIONAL_HUBS.filter(h => h.status === 'red' || h.status === 'yellow').length;
  const activeCount = NATIONAL_HUBS.filter(h => h.status === 'green' || h.status === 'blue').length;
  const extinctCount = NATIONAL_HUBS.filter(h => h.status === 'grey' || h.isExtinct).length;

  // Filter hubs based on tab
  const displayedHubs = NATIONAL_HUBS.filter((hub) => {
    if (activeTab === 'alerts') {
      return hub.status === 'red' || hub.status === 'yellow';
    }
    if (activeTab === 'active') {
      return hub.status === 'green' || hub.status === 'blue';
    }
    if (activeTab === 'extinct') {
      return hub.status === 'grey' || hub.isExtinct;
    }
    return true; // 'all'
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
          pulse: 'rgba(100, 116, 139, 0.45)',
          text: 'text-slate-800',
          badge: 'bg-slate-200 text-slate-800 border-slate-400 font-bold',
          label: 'Sookh Kar Mit Gaya (Extinct Bed)',
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

        {/* Filter Pills right from the user's video: [All] [Alerts] [Active] [Sookh Kar Mit Gaya] */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 15-Day NDWI Satellite Mode toggle */}
          <button
            onClick={() => setIsNdwiSatelliteOverlayActive(!isNdwiSatelliteOverlayActive)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isNdwiSatelliteOverlayActive
                ? 'bg-indigo-950 text-indigo-200 border-indigo-600 shadow-xs'
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:text-slate-900'
            }`}
            title="Toggle ISRO Bhuvan WBIS 15-Day NDWI Satellite Analysis"
          >
            <Satellite className={`w-3.5 h-3.5 ${isNdwiSatelliteOverlayActive ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>15-Day NDWI</span>
          </button>

          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs font-bold shadow-2xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({NATIONAL_HUBS.length})
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'alerts'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 hover:text-rose-700'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alerts</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'alerts' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'}`}>
                {alertCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'active'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-800'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Active</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'active' ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'}`}>
                {activeCount}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('extinct')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'extinct'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Talab sookh kar mit gaya hai (Grey color status)"
            >
              <span>⚪ Sookh Kar Mit Gaya</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                activeTab === 'extinct' ? 'bg-white text-slate-800 font-bold' : 'bg-slate-200 text-slate-700'
              }`}>
                {extinctCount}
              </span>
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
          @keyframes indiaSatelliteScan {
            0% { transform: translateY(-40px); opacity: 0.15; }
            50% { opacity: 0.7; }
            100% { transform: translateY(780px); opacity: 0.1; }
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
          .satellite-scan-line {
            animation: indiaSatelliteScan 7s linear infinite;
          }
        `}</style>

        {/* Floating 15-Day NDWI Satellite Mode Banner */}
        {isNdwiSatelliteOverlayActive && (
          <div className="absolute top-3 right-3 hidden sm:flex z-20 bg-slate-950/85 backdrop-blur-md border border-indigo-500/50 text-white rounded-xl px-3 py-1.5 text-xs font-mono items-center gap-2 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-amber-300 font-bold flex items-center gap-1">
              <Satellite className="w-3.5 h-3.5" />
              <span>ISRO Bhuvan WBIS:</span>
            </span>
            <span className="text-slate-300">15-Day Optical Pass Active</span>
            <span className="text-sky-300 border-l border-slate-700 pl-2">Formula: (Green - NIR)/(Green + NIR)</span>
          </div>
        )}

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

          {/* Background Blueprint Grid with Soft Marine Wash */}
          <rect width="900" height="780" fill="url(#sihGrid)" />

          {/* Coastal Marine Atmosphere Glow around Peninsular India */}
          <path
            d="M 180,330 Q 230,480 340,730 Q 420,740 455,650 Q 550,540 680,370 Q 720,290 730,260"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="24"
            strokeLinecap="round"
            opacity="0.35"
          />
          <path
            d="M 190,340 Q 235,480 345,725 Q 415,735 450,645 Q 545,535 675,365 Q 715,285 725,255"
            fill="none"
            stroke="#e0f2fe"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.6"
          />

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

              return (
                <path
                  key={state.id}
                  d={state.path}
                  className="transition-all duration-200 cursor-pointer"
                  fill={
                    isSelected
                      ? '#dbeafe'
                      : isHovered
                      ? '#e0e7ff'
                      : '#f8fafc'
                  }
                  stroke={
                    isSelected
                      ? '#0047ab'
                      : isHovered
                      ? '#3b82f6'
                      : '#cbd5e1'
                  }
                  strokeWidth={isSelected ? '2.4' : isHovered ? '1.8' : '1.1'}
                  strokeLinejoin="round"
                  onMouseEnter={() => setHoveredState(state)}
                  onMouseLeave={() => setHoveredState(null)}
                  onClick={() => setSelectedState(state)}
                />
              );
            })}
          </g>

          {/* Telemetry Flow Connection Rays (Shows real hydrological network) */}
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
                {/* Outer animated concentric rings */}
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

                {/* NDWI Score Pill beneath hub marker when Satellite Mode is active */}
                {isNdwiSatelliteOverlayActive && (
                  <g transform={`translate(${hub.coords.x}, ${hub.coords.y + (isSelected ? 16 : 13)})`} className="pointer-events-none">
                    <rect
                      x="-17"
                      y="-5.5"
                      width="34"
                      height="11"
                      rx="5.5"
                      fill={hub.status === 'grey' ? '#334155' : hub.status === 'green' ? '#047857' : hub.status === 'blue' ? '#0369a1' : '#b45309'}
                      opacity="0.95"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                    <text x="0" y="2.8" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                      {hub.ndwi !== undefined ? (hub.ndwi > 0 ? `+${hub.ndwi.toFixed(2)}` : hub.ndwi.toFixed(2)) : hub.status === 'grey' ? '-0.28' : '+0.34'}
                    </text>
                  </g>
                )}

                {/* Smart Collision-Free Label */}
                {(() => {
                  const offset = getLabelOffset(hub.labelPos, hub.label.length);
                  return (
                    <g transform={`translate(${hub.coords.x + offset.x}, ${hub.coords.y + offset.y})`}>
                      <rect
                        rx="4"
                        width={offset.width}
                        height={offset.height}
                        fill="rgba(255, 255, 255, 0.95)"
                        stroke={isSelected ? '#0047ab' : style.fill}
                        strokeWidth={isSelected ? '1.5' : '1'}
                        filter="drop-shadow(0 1px 3px rgba(0,0,0,0.08))"
                      />
                      <text
                        x={offset.width / 2}
                        y={offset.height / 2 + 3}
                        fill="#0f172a"
                        fontSize="8"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {hub.label}
                      </text>
                    </g>
                  );
                })()}
              </g>
            );
          })}
        </svg>

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

      {/* ============================================================== */}
      {/* 4. ISRO BHUVAN WBIS SATELLITE & HYDROLOGICAL DOSSIER (INLINE)  */}
      {/* APPEARS WHEN CLICKING ANY WATER STATION / HUB ON INDIA MAP    */}
      {/* ============================================================== */}
      {(() => {
        const isExtinct = selectedHub.status === 'grey' || selectedHub.isExtinct;
        const ndwiScore = selectedHub.ndwi !== undefined 
          ? selectedHub.ndwi 
          : isExtinct ? -0.28 : selectedHub.status === 'green' ? 0.44 : selectedHub.status === 'blue' ? 0.28 : selectedHub.status === 'yellow' ? 0.14 : -0.06;

        const ndwiClassification = isExtinct
          ? 'Extinct / Encroached / Built-up (< -0.15)'
          : ndwiScore > 0.3
          ? 'Deep Surface Water (NDWI > 0.3)'
          : ndwiScore > 0.1
          ? 'Moderate Surface Water (0.1 - 0.3)'
          : 'Shallow / Turbid Water (0.0 - 0.1)';

        const waterSpreadAreaHa = isExtinct ? 0.0 : Math.round((selectedHub.waterLevel * 0.42 + 4) * 10) / 10;
        const baselineAreaHa = isExtinct ? 16.5 : Math.round((selectedHub.waterLevel * 0.48 + 6) * 10) / 10;
        const areaChangePercent = isExtinct ? -100 : selectedHub.waterLevel > 60 ? +3.8 : -14.2;
        const estimatedVolumeMCM = isExtinct ? 0.0 : Math.round((selectedHub.waterLevel * 0.28) * 10) / 10;
        const siltationIndexPercent = isExtinct ? 96 : selectedHub.status === 'red' ? 76 : selectedHub.status === 'yellow' ? 44 : 12;

        return (
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-4">
            {/* Top Identity & Action Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 shadow-xs ${
                  isExtinct ? 'bg-slate-700 text-white' : 'bg-gradient-to-br from-[#0047ab] to-indigo-700 text-white'
                }`}>
                  <Satellite className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">
                      SELECTED STATION DOSSIER:
                    </span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${getStatusColor(selectedHub.status).badge}`}>
                      {getStatusColor(selectedHub.status).label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      15-Day ISRO Satellite Cycle
                    </span>
                  </div>
                  <h4 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {selectedHub.name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Jurisdiction: <strong>{selectedState.name}</strong> • Node Type: <strong>{selectedHub.type.toUpperCase()}</strong> • Satellite: <strong>ISRO Resourcesat-2A (AWiFS) + Sentinel-2 MSI</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setIsDetailModalOpen(true)}
                  className="px-3.5 py-2 bg-gradient-to-r from-[#0047ab] to-[#0284c7] hover:from-blue-700 hover:to-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-300" />
                  <span>Full Bhuvan WBIS Modal</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {onLodgeComplaint && (
                  <button
                    onClick={onLodgeComplaint}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs cursor-pointer"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{isExtinct ? 'Report Extinct Bed' : 'Lodge Grievance'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Critical Alert if Sookh Kar Mit Gaya (Grey Status) */}
            {isExtinct && (
              <div className="p-4 rounded-xl bg-red-950/85 border border-rose-600/70 text-rose-200 text-xs flex items-start gap-3 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <strong className="text-rose-100 font-bold block uppercase tracking-wider text-xs">
                    ⚠️ ISRO SATELLITE EXTINCTION ALERT: TALAB SOOKH KAR MIT GAYA (GREY STATUS)
                  </strong>
                  <p className="text-rose-200 leading-relaxed font-normal">
                    ISRO Resourcesat-2A optical spectral analysis aur consecutive 15-day satellite passes ke mutabiq yeh talab/lake <strong>poora sookh kar mit chuka hai</strong>. 
                    Catchment blockage, unauthorized urban construction encroachment, aur mountain debris accumulation se water retention zero ho chuki hai. Water spread area is <strong>0.0 Hectares</strong>.
                  </p>
                  <div className="flex items-center gap-3 font-mono text-[11px] text-rose-300 pt-1">
                    <span>NDWI Index: <strong>{ndwiScore.toFixed(2)}</strong> (Dry Bed Signature)</span>
                    <span>•</span>
                    <span>Encroachment Status: <strong>Total Extinction</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* 15-Day Satellite Chronology Orbit Passes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Previous Pass */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Previous Orbit Pass (15 Days Ago)
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>2026-09-17</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {isExtinct ? 'Reflectance verified dry soil matrix without liquid signature.' : 'Baseline optical reflection under clear atmospheric window.'}
                </p>
              </div>

              {/* Latest Pass */}
              <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-700 uppercase tracking-wider block font-bold">
                    Latest Orbit Pass (Recent)
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                </div>
                <span className="text-xs font-bold text-blue-950 mt-0.5 block flex items-center gap-1.5">
                  <Satellite className="w-3.5 h-3.5 text-blue-600" />
                  <span>2026-10-02</span>
                </span>
                <p className="text-[11px] text-blue-900 mt-1">
                  {isExtinct 
                    ? `NDWI: ${ndwiScore.toFixed(2)} (Zero liquid water remaining - Extinct Bed)`
                    : `NDWI: ${ndwiScore > 0 ? `+${ndwiScore.toFixed(2)}` : ndwiScore.toFixed(2)} • Spread: ${waterSpreadAreaHa} Ha (${selectedHub.waterLevel}% volume)`}
                </p>
              </div>

              {/* Next Scheduled Orbit */}
              <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  Next Scheduled Orbit Pass
                </span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>2026-10-17</span>
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  ISRO satellite recurrence pass in ~14 days for automatic catchment change detection.
                </p>
              </div>
            </div>

            {/* NDWI Spectral Analytics Bar & Volume Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left: NDWI Score Meter */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      NDWI Water Index: (Green - NIR) / (Green + NIR)
                    </span>
                    <div className="text-2xl font-black font-mono mt-0.5 flex items-baseline gap-2">
                      <span className={
                        isExtinct ? 'text-slate-600' :
                        ndwiScore > 0.3 ? 'text-emerald-600' :
                        ndwiScore > 0.1 ? 'text-sky-600' :
                        ndwiScore > 0.0 ? 'text-amber-600' : 'text-rose-600'
                      }>
                        {ndwiScore > 0 ? `+${ndwiScore.toFixed(2)}` : ndwiScore.toFixed(2)}
                      </span>
                      <span className="text-xs font-sans font-semibold text-slate-500">
                        ({ndwiClassification})
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg uppercase tracking-wider ${
                    isExtinct ? 'bg-slate-700 text-white' :
                    ndwiScore > 0.2 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}>
                    {isExtinct ? 'SOOKH KAR MIT GAYA' : ndwiScore > 0.2 ? 'SURFACE WATER' : 'DEPLETION'}
                  </span>
                </div>

                {/* Gradient Bar with marker pin */}
                <div className="space-y-1">
                  <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-rose-600 via-amber-400 via-sky-400 to-emerald-600 relative overflow-visible">
                    {(() => {
                      const percent = Math.max(0, Math.min(100, ((ndwiScore + 1) / 2) * 100));
                      return (
                        <div
                          style={{ left: `${percent}%` }}
                          className="absolute -top-1 transform -translate-x-1/2 w-3 h-5.5 bg-slate-950 border-2 border-white rounded shadow-md"
                          title={`NDWI: ${ndwiScore.toFixed(2)}`}
                        />
                      );
                    })()}
                  </div>
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 pt-0.5">
                    <span>-1.0 (Built-up)</span>
                    <span>-0.2 (Sookh Gaya)</span>
                    <span>0.0 (Marsh)</span>
                    <span>+0.3 (Water)</span>
                    <span>+1.0 (Deep)</span>
                  </div>
                </div>
              </div>

              {/* Right: 4 Water Spread & Siltation Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Water Spread Area</span>
                  <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                    {waterSpreadAreaHa} <span className="text-xs font-sans text-slate-500">Ha</span>
                  </span>
                  <span className="text-[10px] text-slate-500">{(waterSpreadAreaHa * 2.471).toFixed(1)} Acres</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Baseline Area (2015)</span>
                  <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                    {baselineAreaHa} <span className="text-xs font-sans text-slate-500">Ha</span>
                  </span>
                  <span className={`text-[10px] font-bold ${areaChangePercent >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {areaChangePercent >= 0 ? `+${areaChangePercent}%` : `${areaChangePercent}%`} Change
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Water Remaining</span>
                  <span className="text-base font-bold font-mono text-slate-900 mt-0.5 block">
                    {selectedHub.waterLevel}%
                  </span>
                  <span className="text-[10px] text-slate-500">{estimatedVolumeMCM} MCM Storage</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Siltation / Choke</span>
                  <span className={`text-base font-bold font-mono mt-0.5 block ${
                    siltationIndexPercent > 70 ? 'text-rose-600' :
                    siltationIndexPercent > 35 ? 'text-amber-600' : 'text-emerald-600'
                  }`}>
                    {siltationIndexPercent}%
                  </span>
                  <span className="text-[10px] text-slate-500">Bed Silt Accumulation</span>
                </div>
              </div>
            </div>

            {/* Past 6 Satellite Cycles (15-Day Pass History) Mini Grid */}
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
                  { pass: 'Pass #1 (Jul 18)', score: isExtinct ? -0.22 : +(ndwiScore * 1.08), status: isExtinct ? 'Dry' : 'High' },
                  { pass: 'Pass #2 (Aug 02)', score: isExtinct ? -0.24 : +(ndwiScore * 1.05), status: isExtinct ? 'Dry' : 'High' },
                  { pass: 'Pass #3 (Aug 17)', score: isExtinct ? -0.25 : +(ndwiScore * 1.02), status: isExtinct ? 'Dry' : 'Normal' },
                  { pass: 'Pass #4 (Sep 01)', score: isExtinct ? -0.27 : +(ndwiScore * 0.98), status: isExtinct ? 'Dry' : 'Normal' },
                  { pass: 'Pass #5 (Sep 16)', score: isExtinct ? -0.28 : +(ndwiScore * 0.95), status: isExtinct ? 'Dry' : 'Normal' },
                  { pass: 'Pass #6 (Oct 02)', score: ndwiScore, status: isExtinct ? 'Extinct' : 'Current' },
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

            {/* Bottom Ground Truth Sensor Readings */}
            <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">TDS TEST READING</span>
                  <span className="text-sm font-extrabold text-[#0047ab] font-mono">
                    {selectedHub.tdsPpm > 0 ? `${selectedHub.tdsPpm} ppm` : '⚠️ Zero (Dry Bed)'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase font-mono">CAPACITY / STORAGE</span>
                  <span className="text-sm font-extrabold text-slate-800 font-mono">{selectedHub.waterLevel}%</span>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                  <span className="text-[9px] text-emerald-700 font-bold block uppercase font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>GRID STATUS</span>
                  </span>
                  <span className="text-xs font-extrabold text-emerald-800 font-mono">
                    99% OPERATIONAL
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-mono">
                Telemetry Station ID: <strong>{selectedHub.id}</strong> • Coordinates: ({selectedHub.coords.x}, {selectedHub.coords.y})
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. Bhuvan WBIS Detailed Satellite & Field Telemetry Inspector Modal */}
      <BhuvanWbisDetailModal
        waterBody={
          waterBodies.find(wb => wb.id === selectedHub.id || wb.name.toLowerCase().includes(selectedHub.label.toLowerCase().slice(0, 8))) ||
          waterBodies.find(wb => wb.district === 'Vizianagaram') ||
          waterBodies[0]
        }
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onLodgeComplaint={onLodgeComplaint ? () => onLodgeComplaint() : undefined}
      />
    </div>
  );
};
