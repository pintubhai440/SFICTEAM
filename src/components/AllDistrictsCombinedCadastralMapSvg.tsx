import React, { useState, useRef, useEffect, useCallback } from 'react';
import { WaterBody, WaterBodyStatusColor } from '../types/nirikshan';
import { VIZIANAGARAM_ALL_MANDAL_WATER_BODIES } from '../data/vizianagaramMandalsWaterData';
import { PARVATHIPURAM_ALL_MANDAL_WATER_BODIES } from '../data/parvathipuramMandalsWaterData';
import { VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES } from '../data/visakhapatnamMandalsWaterData';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Minimize2,
  Ship,
  Compass,
  Move
} from 'lucide-react';

export interface CombinedMandalNode {
  id: string;
  name: string;
  teluguName: string;
  district: 'Parvathipuram Manyam' | 'Vizianagaram' | 'Visakhapatnam';
  svgPath: string;
  center: { x: number; y: number };
  statusColor: WaterBodyStatusColor;
  statusLabel: string;
  waterBodiesCount: number;
  primaryWaterBody: string;
  waterKey: string;
}

// Seamless Contiguous Alignment of North Andhra Tri-District Hydrological Grid
// ViewBox: 0 0 1150 1180
// North: Parvathipuram Manyam (Hills & Forests, Janjavathi, Thotapalli)
// Center: Vizianagaram (Plains & River network, Champavathi, Gosthani)
// South: Visakhapatnam (Coastline, Meghadrigedda, Mudasarlova, Harbor)
export const ALL_COMBINED_MANDALS: CombinedMandalNode[] = [
  // =========================================================================
  // 1. PARVATHIPURAM MANYAM DISTRICT (NORTH ZONE: Y: 50 to 380)
  // =========================================================================
  {
    id: 'pvm_komarada',
    name: 'Komarada',
    teluguName: 'కొమరాడ',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 350,110 L 420,80 L 480,95 L 490,165 L 430,195 L 360,185 Z',
    center: { x: 420, y: 140 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Janjavathi Rubber Dam • 42.5 MCM)',
    waterBodiesCount: 44,
    primaryWaterBody: 'Janjavathi Rubber Dam & Reservoir',
    waterKey: 'komarada',
  },
  {
    id: 'pvm_gummalakshmipuram',
    name: 'Gummalakshmipuram',
    teluguName: 'గుమ్మలక్ష్మీపురం',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 480,95 L 560,55 L 670,50 L 710,120 L 660,160 L 550,150 L 490,165 Z',
    center: { x: 590, y: 110 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Bhadra Giri Springs & Gomukhi Watershed)',
    waterBodiesCount: 52,
    primaryWaterBody: 'Bhadra Giri Forest Springs',
    waterKey: 'gummalakshmipuram',
  },
  {
    id: 'pvm_kurupam',
    name: 'Kurupam',
    teluguName: 'కురుపాం',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 660,160 L 710,120 L 790,140 L 800,225 L 720,230 L 640,190 Z',
    center: { x: 720, y: 180 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Dense Sal Forest Recharge • DWLR 4.8 mbgl)',
    waterBodiesCount: 48,
    primaryWaterBody: 'Kurupam Palace Konda Cheruvu',
    waterKey: 'kurupam',
  },
  {
    id: 'pvm_bhamini',
    name: 'Bhamini',
    teluguName: 'భామిని',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 790,140 L 880,125 L 910,195 L 860,250 L 800,225 Z',
    center: { x: 850, y: 185 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Interstate Vamsadhara Feeder Tank)',
    waterBodiesCount: 28,
    primaryWaterBody: 'Bhamini Border Stream & Vamsadhara Feeder',
    waterKey: 'bhamini',
  },
  {
    id: 'pvm_jiyyammavalasa',
    name: 'Jiyyammavalasa',
    teluguName: 'జియ్యమ్మవలస',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 430,195 L 490,165 L 550,150 L 640,190 L 600,255 L 510,245 L 450,230 Z',
    center: { x: 530, y: 205 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Active Nagavali Floodplain Aquifer)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Chinna Merangi Floodplain Tank',
    waterKey: 'jiyyammavalasa',
  },
  {
    id: 'pvm_parvathipuram',
    name: 'Parvathipuram',
    teluguName: 'పార్వతీపురం',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 350,190 L 430,195 L 450,230 L 420,290 L 340,270 L 320,220 Z',
    center: { x: 380, y: 240 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (District HQ Urban Water Hub • TDS 480 ppm)',
    waterBodiesCount: 46,
    primaryWaterBody: 'Nagavali River Parvathipuram Municipal Basin',
    waterKey: 'parvathipuram',
  },
  {
    id: 'pvm_garugubilli',
    name: 'Garugubilli (Thotapalli)',
    teluguName: 'గరుగుబిల్లి',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 450,230 L 510,245 L 600,255 L 610,310 L 530,325 L 460,290 Z',
    center: { x: 530, y: 280 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Sardar Gouthu Latchanna Thotapalli Barrage • 78.2 MCM)',
    waterBodiesCount: 40,
    primaryWaterBody: 'Thotapalli Barrage Major Reservoir (78.2 MCM)',
    waterKey: 'garugubilli',
  },
  {
    id: 'pvm_seethanagaram',
    name: 'Seethanagaram',
    teluguName: 'సీతానగరం',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 340,270 L 420,290 L 460,290 L 460,355 L 360,360 L 320,320 Z',
    center: { x: 400, y: 320 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Suvarnamukhi & Nagavali Confluence)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Suvarnamukhi - Nagavali River Confluence System',
    waterKey: 'seethanagaram',
  },
  {
    id: 'pvm_salur',
    name: 'Salur',
    teluguName: 'సాలూరు',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 190,280 L 280,260 L 320,320 L 300,380 L 210,380 L 170,320 Z',
    center: { x: 250, y: 325 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Vegavathi River Weir • Stable Table)',
    waterBodiesCount: 45,
    primaryWaterBody: 'Vegavathi River Salur Ancient Weir System',
    waterKey: 'salur',
  },
  {
    id: 'pvm_makkuva',
    name: 'Makkuva',
    teluguName: 'మక్కువ',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 210,210 L 320,220 L 340,270 L 280,260 L 190,280 Z',
    center: { x: 270, y: 250 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Vengalaraya Sagaram Dam Catchment)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Vengalaraya Sagaram Suvarnamukhi Reservoir',
    waterKey: 'makkuva',
  },
  {
    id: 'pvm_pachipenta',
    name: 'Pachipenta',
    teluguName: 'పాచిపెంట',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 130,340 L 210,380 L 230,440 L 150,450 L 110,390 Z',
    center: { x: 175, y: 400 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Eastern Ghats Forest Watershed)',
    waterBodiesCount: 34,
    primaryWaterBody: 'Pachipenta Hill Waterfall Stream',
    waterKey: 'pachipenta',
  },
  {
    id: 'pvm_balijipeta',
    name: 'Balijipeta',
    teluguName: 'బలిజిపేట',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 460,290 L 530,325 L 530,380 L 460,375 L 460,355 Z',
    center: { x: 495, y: 345 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Pedda Cheruvu Deep Aquifer)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Balijipeta Pedda Cheruvu',
    waterKey: 'balijipeta',
  },
  {
    id: 'pvm_palakonda',
    name: 'Palakonda',
    teluguName: 'పాలకొండ',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 600,255 L 720,230 L 760,285 L 680,315 L 610,310 Z',
    center: { x: 675, y: 275 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Palakonda Old Pedda Cheruvu Severe Contamination)',
    waterBodiesCount: 32,
    primaryWaterBody: 'Palakonda Old Pedda Cheruvu (Urban Waste Alert)',
    waterKey: 'palakonda',
  },
  {
    id: 'pvm_veeraghattam',
    name: 'Veeraghattam',
    teluguName: 'వీరఘట్టం',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 680,315 L 760,285 L 820,310 L 800,375 L 710,370 Z',
    center: { x: 755, y: 335 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Nagavali Lower Channel • High Silt Buffer)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Veeraghattam Nagavali River Station',
    waterKey: 'veeraghattam',
  },
  {
    id: 'pvm_seethampeta',
    name: 'Seethampeta',
    teluguName: 'సీతంపేట',
    district: 'Parvathipuram Manyam',
    svgPath: 'M 720,230 L 800,225 L 860,250 L 820,310 L 760,285 Z',
    center: { x: 790, y: 265 },
    statusColor: 'grey',
    statusLabel: '1. Extinct (Agency Silted Stream Bed • Sookh Kar Mit Gaya)',
    waterBodiesCount: 29,
    primaryWaterBody: 'Seethampeta Tribal Valley Dry Bed',
    waterKey: 'seethampeta',
  },

  // =========================================================================
  // 2. VIZIANAGARAM DISTRICT (MIDDLE ZONE: Y: 360 to 760)
  // =========================================================================
  {
    id: 'vzm_bobbili',
    name: 'Bobbili',
    teluguName: 'బొబ్బిలి',
    district: 'Vizianagaram',
    svgPath: 'M 360,360 L 460,355 L 460,425 L 370,425 Z',
    center: { x: 410, y: 390 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Historical Fort Tank System)',
    waterBodiesCount: 46,
    primaryWaterBody: 'Bobbili Royal Fort Moat & Percolation Cheruvu',
    waterKey: 'bobbili',
  },
  {
    id: 'vzm_badangi',
    name: 'Badangi',
    teluguName: 'బాడంగి',
    district: 'Vizianagaram',
    svgPath: 'M 460,375 L 530,380 L 550,445 L 470,450 L 460,425 Z',
    center: { x: 505, y: 415 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Vegavathi Tributary Network)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Badangi Vegavathi Canal Feeder Tank',
    waterKey: 'badangi',
  },
  {
    id: 'vzm_therlam',
    name: 'Therlam',
    teluguName: 'తెర్లాం',
    district: 'Vizianagaram',
    svgPath: 'M 530,380 L 630,370 L 640,440 L 550,445 Z',
    center: { x: 585, y: 410 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Nagavali Floodplain Feeder Tanks)',
    waterBodiesCount: 40,
    primaryWaterBody: 'Therlam Nagavali Basin Irrigation Tank',
    waterKey: 'therlam',
  },
  {
    id: 'vzm_vangara',
    name: 'Vangara',
    teluguName: 'వంగర',
    district: 'Vizianagaram',
    svgPath: 'M 630,370 L 730,365 L 740,430 L 640,440 Z',
    center: { x: 685, y: 400 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Nagavali Downstream Thotapalli Canal)',
    waterBodiesCount: 35,
    primaryWaterBody: 'Vangara Nagavali Left Main Canal Reservoir',
    waterKey: 'vangara',
  },
  {
    id: 'vzm_regidi',
    name: 'Regidi Amadalavalasa',
    teluguName: 'రేగిడి ఆమదాలవలస',
    district: 'Vizianagaram',
    svgPath: 'M 730,365 L 830,360 L 840,425 L 740,430 Z',
    center: { x: 785, y: 395 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Inter-district Agricultural Runoff)',
    waterBodiesCount: 32,
    primaryWaterBody: 'Regidi Eastern Drainage Sluice Tank',
    waterKey: 'regidi',
  },
  {
    id: 'vzm_santhakaviti',
    name: 'Santhakaviti',
    teluguName: 'సంతకవిటి',
    district: 'Vizianagaram',
    svgPath: 'M 830,360 L 920,355 L 940,420 L 840,425 Z',
    center: { x: 885, y: 390 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Srikakulam Border Canal Network)',
    waterBodiesCount: 34,
    primaryWaterBody: 'Santhakaviti Pedda Cheruvu & Ayacut',
    waterKey: 'santhakaviti',
  },
  {
    id: 'vzm_rajam',
    name: 'Rajam',
    teluguName: 'రాజాం',
    district: 'Vizianagaram',
    svgPath: 'M 740,430 L 840,425 L 860,500 L 760,505 Z',
    center: { x: 800, y: 465 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Moderate Urban Water Stress • TDS 510 ppm)',
    waterBodiesCount: 42,
    primaryWaterBody: 'Rajam Municipal Commercial Tank (GMR Nagar)',
    waterKey: 'rajam',
  },
  {
    id: 'vzm_cheepurupalle',
    name: 'Cheepurupalle',
    teluguName: 'చీపురుపల్లి',
    district: 'Vizianagaram',
    svgPath: 'M 650,440 L 740,430 L 760,505 L 670,510 Z',
    center: { x: 705, y: 475 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Severe Groundwater Depletion & Siltation)',
    waterBodiesCount: 30,
    primaryWaterBody: 'Cheepurupalle Depleted Cheruvu & Over-Exploited Well',
    waterKey: 'cheepurupalle',
  },
  {
    id: 'vzm_merakamudidam',
    name: 'Merakamudidam',
    teluguName: 'మెరకముడిదాం',
    district: 'Vizianagaram',
    svgPath: 'M 470,450 L 560,445 L 570,515 L 480,515 Z',
    center: { x: 520, y: 480 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Seasonal Irrigation Pond Table)',
    waterBodiesCount: 33,
    primaryWaterBody: 'Merakamudidam Hard-rock Percolation Well',
    waterKey: 'merakamudidam',
  },
  {
    id: 'vzm_dattirajeru',
    name: 'Dattirajeru',
    teluguName: 'దత్తిరాజేరు',
    district: 'Vizianagaram',
    svgPath: 'M 560,445 L 650,440 L 670,510 L 570,515 Z',
    center: { x: 615, y: 480 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Semi-Critical Aquifer Table • 7.2 mbgl)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Dattirajeru CGWB DWLR Telemetry Station',
    waterKey: 'dattirajeru',
  },
  {
    id: 'vzm_garividi',
    name: 'Garividi',
    teluguName: 'గరివిడి',
    district: 'Vizianagaram',
    svgPath: 'M 670,510 L 760,505 L 770,575 L 680,580 Z',
    center: { x: 720, y: 545 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Manganese Industrial Runoff Corridor)',
    waterBodiesCount: 31,
    primaryWaterBody: 'Garividi Ferro-Alloys Industrial Buffer Tank',
    waterKey: 'garividi',
  },
  {
    id: 'vzm_gajapathinagaram',
    name: 'Gajapathinagaram',
    teluguName: 'గజపతినగరం',
    district: 'Vizianagaram',
    svgPath: 'M 380,470 L 470,465 L 480,535 L 390,540 Z',
    center: { x: 430, y: 505 },
    statusColor: 'grey',
    statusLabel: '1. Extinct (Pedda Cheruvu Silted Bed - Sookh Kar Mit Gaya)',
    waterBodiesCount: 35,
    primaryWaterBody: 'Gajapathinagaram Extinct Pedda Cheruvu Bed',
    waterKey: 'gajapathinagaram',
  },
  {
    id: 'vzm_bondapalle',
    name: 'Bondapalle',
    teluguName: 'బొండపల్లి',
    district: 'Vizianagaram',
    svgPath: 'M 320,530 L 400,535 L 400,605 L 320,600 Z',
    center: { x: 360, y: 570 },
    statusColor: 'grey',
    statusLabel: '1. Extinct (Dry Silted Tank - Sookh Kar Mit Gaya)',
    waterBodiesCount: 29,
    primaryWaterBody: 'Bondapalle Dried-up Irrigation Cheruvu',
    waterKey: 'bondapalle',
  },
  {
    id: 'vzm_mentada',
    name: 'Mentada',
    teluguName: 'మెంటాడ',
    district: 'Vizianagaram',
    svgPath: 'M 290,430 L 380,425 L 390,490 L 300,495 Z',
    center: { x: 340, y: 460 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Champavathi Upper Basin Forest Springs)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Mentada Champavathi Headwater Reserve',
    waterKey: 'mentada',
  },
  {
    id: 'vzm_gantyada',
    name: 'Gantyada',
    teluguName: 'గంట్యాడ',
    district: 'Vizianagaram',
    svgPath: 'M 400,535 L 490,535 L 500,605 L 400,605 Z',
    center: { x: 450, y: 570 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Tatipudi Thatipudi Canal Network)',
    waterBodiesCount: 42,
    primaryWaterBody: 'Gantyada Thatipudi Reservoir Feeder System',
    waterKey: 'gantyada',
  },
  {
    id: 'vzm_vizianagaram_hq',
    name: 'Vizianagaram (HQ)',
    teluguName: 'విజయనగరం',
    district: 'Vizianagaram',
    svgPath: 'M 450,605 L 540,605 L 540,670 L 440,670 Z',
    center: { x: 490, y: 640 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Kotha Cheruvu Contaminated • TDS 580 ppm)',
    waterBodiesCount: 50,
    primaryWaterBody: 'Vizianagaram Urban Basin (Kotha Cheruvu Contaminated)',
    waterKey: 'vizianagaram_hq',
  },
  {
    id: 'vzm_nellimarla',
    name: 'Nellimarla',
    teluguName: 'నెల్లిమర్ల',
    district: 'Vizianagaram',
    svgPath: 'M 540,565 L 640,560 L 645,630 L 545,635 Z',
    center: { x: 590, y: 600 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Champavathi River Basin Lifeline)',
    waterBodiesCount: 44,
    primaryWaterBody: 'Champavathi River Nellimarla Hydrological Station',
    waterKey: 'nellimarla',
  },
  {
    id: 'vzm_gurla',
    name: 'Gurla',
    teluguName: 'గుర్ల',
    district: 'Vizianagaram',
    svgPath: 'M 640,560 L 730,555 L 735,630 L 645,630 Z',
    center: { x: 685, y: 595 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Gosthani Tributary Safe Basin)',
    waterBodiesCount: 37,
    primaryWaterBody: 'Gurla Percolation Cheruvu & River Sluice',
    waterKey: 'gurla',
  },
  {
    id: 'vzm_denkada',
    name: 'Denkada',
    teluguName: 'డెంకాడ',
    district: 'Vizianagaram',
    svgPath: 'M 540,635 L 635,630 L 640,700 L 540,700 Z',
    center: { x: 585, y: 665 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Champavathi Estuary Transition Buffer)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Denkada Saripalli Champavathi Stream Gauge',
    waterKey: 'denkada',
  },
  {
    id: 'vzm_pusapatirega',
    name: 'Pusapatirega',
    teluguName: 'పూసపాటిరేగ',
    district: 'Vizianagaram',
    svgPath: 'M 635,630 L 735,630 L 745,715 L 645,715 Z',
    center: { x: 690, y: 675 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Champavathi River Mouth to Bay of Bengal)',
    waterBodiesCount: 42,
    primaryWaterBody: 'Pusapatirega Champavathi Marine Outfall & Creek',
    waterKey: 'pusapatirega',
  },
  {
    id: 'vzm_bhogapuram',
    name: 'Bhogapuram',
    teluguName: 'భోగాపురం',
    district: 'Vizianagaram',
    svgPath: 'M 610,700 L 710,700 L 720,770 L 620,770 Z',
    center: { x: 665, y: 735 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Coastal Sand Aquifer & Bay of Bengal Shelf)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Bhogapuram Coastal Aquifer & Airport Catchment Tank',
    waterKey: 'bhogapuram',
  },
  {
    id: 'vzm_skota',
    name: 'Srungavarapukota (S.Kota)',
    teluguName: 'శృంగవరపుకోట',
    district: 'Vizianagaram',
    svgPath: 'M 200,560 L 290,555 L 290,635 L 190,640 Z',
    center: { x: 240, y: 600 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Thatipudi Reservoir • 94.2 MCM Storage)',
    waterBodiesCount: 52,
    primaryWaterBody: 'Thatipudi Reservoir (Major Visakhapatnam Lifeline)',
    waterKey: 's_kota',
  },
  {
    id: 'vzm_lkota',
    name: 'Lakkavarapukota (L.Kota)',
    teluguName: 'లక్కవరపుకోట',
    district: 'Vizianagaram',
    svgPath: 'M 190,640 L 280,635 L 280,715 L 180,720 Z',
    center: { x: 235, y: 680 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Gosthani Foothill Runoff)',
    waterBodiesCount: 35,
    primaryWaterBody: 'L.Kota Gosthani Canal Feeder',
    waterKey: 'l_kota',
  },
  {
    id: 'vzm_vepada',
    name: 'Vepada',
    teluguName: 'వేపాడ',
    district: 'Vizianagaram',
    svgPath: 'M 280,635 L 360,635 L 360,715 L 280,715 Z',
    center: { x: 320, y: 675 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Safe Hard-rock Aquifer)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Vepada Minor Irrigation Cheruvu',
    waterKey: 'vepada',
  },
  {
    id: 'vzm_jami',
    name: 'Jami',
    teluguName: 'జామి',
    district: 'Vizianagaram',
    svgPath: 'M 360,635 L 440,635 L 440,715 L 360,715 Z',
    center: { x: 400, y: 675 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Gosthani Middle Basin Floodplain)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Jami Gosthani River Lift Irrigation Point',
    waterKey: 'jami',
  },
  {
    id: 'vzm_kothavalasa',
    name: 'Kothavalasa',
    teluguName: 'కొత్తవలస',
    district: 'Vizianagaram',
    svgPath: 'M 280,715 L 380,715 L 390,785 L 290,785 Z',
    center: { x: 335, y: 750 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Industrial Growth Corridor & Suburban Stress)',
    waterBodiesCount: 34,
    primaryWaterBody: 'Kothavalasa Railway Junction Tank',
    waterKey: 'kothavalasa',
  },

  // =========================================================================
  // 3. VISAKHAPATNAM DISTRICT (SOUTH ZONE: Y: 730 to 1120)
  // =========================================================================
  {
    id: 'vzg_bheemili',
    name: 'Bheemunipatnam (Bheemili)',
    teluguName: 'భీమునిపట్నం',
    district: 'Visakhapatnam',
    svgPath: 'M 640,765 L 740,750 L 780,830 L 680,845 L 630,810 Z',
    center: { x: 710, y: 800 },
    statusColor: 'blue',
    statusLabel: '5. Normal (Active Gosthani Estuary Outflow • Marine Coastal Buffer • 650 Cusecs)',
    waterBodiesCount: 38,
    primaryWaterBody: 'Gosthani River Estuary & Bheemunipatnam Marine Lagoon',
    waterKey: 'bheemunipatnam',
  },
  {
    id: 'vzg_padmanabham',
    name: 'Padmanabham',
    teluguName: 'పద్మనాభం',
    district: 'Visakhapatnam',
    svgPath: 'M 490,735 L 590,725 L 630,780 L 590,820 L 500,810 Z',
    center: { x: 550, y: 775 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Agricultural Valley Recharge • DWLR 7.8 mbgl)',
    waterBodiesCount: 42,
    primaryWaterBody: 'Padmanabham Sarada River Agricultural Canal & Tank',
    waterKey: 'padmanabham',
  },
  {
    id: 'vzg_anandapuram',
    name: 'Anandapuram',
    teluguName: 'ఆనందపురం',
    district: 'Visakhapatnam',
    svgPath: 'M 490,810 L 590,820 L 630,890 L 540,905 L 460,865 Z',
    center: { x: 550, y: 860 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Gambheeram Reservoir • 14.2 MCM Live Storage)',
    waterBodiesCount: 48,
    primaryWaterBody: 'Gambheeram Reservoir & Reserve Forest Runoff (14.2 MCM)',
    waterKey: 'anandapuram',
  },
  {
    id: 'vzg_pendurthi',
    name: 'Pendurthi',
    teluguName: 'పెందుర్తి',
    district: 'Visakhapatnam',
    svgPath: 'M 320,785 L 420,780 L 460,865 L 400,905 L 320,870 Z',
    center: { x: 385, y: 840 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Suburban Groundwater Stress • DWLR 9.2 mbgl)',
    waterBodiesCount: 36,
    primaryWaterBody: 'Pendurthi Semi-Critical Groundwater DWLR & Cheruvu',
    waterKey: 'pendurthi',
  },
  {
    id: 'vzg_gopalapatnam',
    name: 'Gopalapatnam (Meghadrigedda)',
    teluguName: 'గోపాలపట్నం',
    district: 'Visakhapatnam',
    svgPath: 'M 350,905 L 440,895 L 470,970 L 390,985 L 330,950 Z',
    center: { x: 405, y: 945 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Meghadrigedda Reservoir • 34.2 MCM • GVMC Drinking Lifeline)',
    waterBodiesCount: 52,
    primaryWaterBody: 'Meghadrigedda Reservoir - Central Drinking Lifeline (34.2 MCM)',
    waterKey: 'gopalapatnam',
  },
  {
    id: 'vzg_rural',
    name: 'Visakhapatnam Rural (Mudasarlova)',
    teluguName: 'విశాఖ రూరల్',
    district: 'Visakhapatnam',
    svgPath: 'M 470,895 L 560,905 L 590,975 L 500,985 L 460,940 Z',
    center: { x: 525, y: 940 },
    statusColor: 'green',
    statusLabel: '3. Good Condition (Mudasarlova Reservoir • 18.5 MCM • 1901 Forest Table)',
    waterBodiesCount: 56,
    primaryWaterBody: 'Mudasarlova Reservoir & Protected Wildlife Catchment',
    waterKey: 'visakhapatnam_rural',
  },
  {
    id: 'vzg_seethammadhara',
    name: 'Seethammadhara (Kailasagiri)',
    teluguName: 'సీతమ్మధార',
    district: 'Visakhapatnam',
    svgPath: 'M 580,880 L 680,880 L 670,965 L 590,975 Z',
    center: { x: 635, y: 925 },
    statusColor: 'yellow',
    statusLabel: '4. Medium (Kailasagiri Watershed & Urban Storm Gedda • TDS 420 ppm)',
    waterBodiesCount: 34,
    primaryWaterBody: 'Kailasagiri Foothill Watershed & MVP Storm Gedda',
    waterKey: 'seethammadhara',
  },
  {
    id: 'vzg_urban',
    name: 'Visakhapatnam Urban (Port)',
    teluguName: 'విశాఖ అర్బన్',
    district: 'Visakhapatnam',
    svgPath: 'M 490,985 L 600,975 L 610,1045 L 500,1055 Z',
    center: { x: 550, y: 1015 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Port Harbor Sludge & Municipal Untreated Outfall • TDS 1420 ppm)',
    waterBodiesCount: 22,
    primaryWaterBody: 'Visakhapatnam Port Harbor Basin & Southern Drain Outfall',
    waterKey: 'visakhapatnam_urban',
  },
  {
    id: 'vzg_mulagada',
    name: 'Mulagada (Malkapuram)',
    teluguName: 'ములగాడ',
    district: 'Visakhapatnam',
    svgPath: 'M 390,985 L 490,985 L 490,1065 L 390,1065 Z',
    center: { x: 440, y: 1025 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Refinery Sluice & Shipyard Backwater Chemical Froth • TDS 1550 ppm)',
    waterBodiesCount: 18,
    primaryWaterBody: 'Malkapuram - Gangavaram Creek & Refinery Sluice',
    waterKey: 'mulagada',
  },
  {
    id: 'vzg_gajuwaka',
    name: 'Gajuwaka',
    teluguName: 'గాజువాక',
    district: 'Visakhapatnam',
    svgPath: 'M 290,960 L 390,985 L 390,1065 L 290,1045 Z',
    center: { x: 340, y: 1015 },
    statusColor: 'red',
    statusLabel: '2. Danger Zone (Hazardous Industrial Effluent • TDS 1680 ppm • DO < 1.5 mg/L)',
    waterBodiesCount: 24,
    primaryWaterBody: 'Gajuwaka Industrial Drainage Canal & Refinery Sluice (Hazard)',
    waterKey: 'gajuwaka',
  },
  {
    id: 'vzg_pedagantyada',
    name: 'Pedagantyada (Appikonda)',
    teluguName: 'పెదగంట్యాడ',
    district: 'Visakhapatnam',
    svgPath: 'M 310,1055 L 450,1065 L 450,1130 L 310,1120 Z',
    center: { x: 380, y: 1095 },
    statusColor: 'grey',
    statusLabel: '1. Extinct (Appikonda Silted Coastal Tank • Sookh Kar Mit Gaya • NDWI -0.28)',
    waterBodiesCount: 16,
    primaryWaterBody: 'Pedagantyada Coastal Silted Tank (Extinct Urban Bed)',
    waterKey: 'pedagantyada',
  },
];

interface AllDistrictsCombinedCadastralMapSvgProps {
  waterBodies: WaterBody[];
  activeWaterBody: WaterBody | null;
  hoveredWaterBody: WaterBody | null;
  onSelectWaterBody: (wb: WaterBody) => void;
  viewFilter?: string;
  theme?: string;
  showRivers?: boolean;
  onSwitchDistrict?: (dist: string) => void;
  onLodgeComplaint?: () => void;
}

export const AllDistrictsCombinedCadastralMapSvg: React.FC<AllDistrictsCombinedCadastralMapSvgProps> = ({
  waterBodies,
  activeWaterBody,
  hoveredWaterBody,
  onSelectWaterBody,
  viewFilter,
  theme,
  showRivers = true,
  onSwitchDistrict,
  onLodgeComplaint,
}) => {
  const [hoveredMandal, setHoveredMandal] = useState<CombinedMandalNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.88;
    setZoomLevel(prev => Math.max(0.6, Math.min(prev * zoomFactor, 3.5)));
  };

  // Drag Panning Handlers (Aage-Piche, Upar-Neeche)
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on primary mouse button
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

  // Directional Pan buttons (Aage, Piche, Upar, Neeche)
  const panStep = 90;
  const panDirection = (dir: 'up' | 'down' | 'left' | 'right') => {
    setPanOffset(prev => {
      switch (dir) {
        case 'up': return { ...prev, y: prev.y + panStep };
        case 'down': return { ...prev, y: prev.y - panStep };
        case 'left': return { ...prev, x: prev.x + panStep }; // move right to see left
        case 'right': return { ...prev, x: prev.x - panStep }; // move left to see right
      }
    });
  };

  const getMandalFill = (mandal: CombinedMandalNode) => {
    const isSelected = activeWaterBody && (
      activeWaterBody.name.toLowerCase().includes(mandal.name.toLowerCase()) ||
      activeWaterBody.mandal?.toLowerCase().includes(mandal.name.toLowerCase())
    );
    const isHovered = hoveredMandal?.id === mandal.id;

    if (isSelected) return '#bae6fd'; // Selected bright sky blue
    if (isHovered) return '#fed7aa'; // Hover saffron

    // 5-Color Filter Dimming
    if (viewFilter && viewFilter !== 'all') {
      const isMatch = (viewFilter === 'extinct' && mandal.statusColor === 'grey') ||
                      (viewFilter === 'red' && mandal.statusColor === 'red') ||
                      (viewFilter === 'green' && mandal.statusColor === 'green') ||
                      (viewFilter === 'yellow' && mandal.statusColor === 'yellow') ||
                      (viewFilter === 'blue' && mandal.statusColor === 'blue');
      if (!isMatch) return '#f1f5f9';
    }

    // District Distinct Cadastral Themes
    if (mandal.district === 'Parvathipuram Manyam') {
      return '#f0fdf4'; // Lightest mint green tone for northern agency hills
    } else if (mandal.district === 'Vizianagaram') {
      return '#fefce8'; // Lightest wheat/lemon tone for central plateau
    } else {
      return '#eff6ff'; // Lightest periwinkle blue tone for southern coastal
    }
  };

  const handleMandalClick = (mandal: CombinedMandalNode) => {
    let targetWb: WaterBody | undefined;
    if (mandal.district === 'Parvathipuram Manyam') {
      targetWb = PARVATHIPURAM_ALL_MANDAL_WATER_BODIES[mandal.waterKey];
    } else if (mandal.district === 'Vizianagaram') {
      targetWb = VIZIANAGARAM_ALL_MANDAL_WATER_BODIES[mandal.waterKey];
    } else {
      targetWb = VISAKHAPATNAM_ALL_MANDAL_WATER_BODIES[mandal.waterKey];
    }

    if (!targetWb) {
      targetWb = waterBodies.find(wb => 
        wb.name.toLowerCase().includes(mandal.name.toLowerCase()) ||
        wb.mandal?.toLowerCase().includes(mandal.name.toLowerCase())
      );
    }

    if (targetWb && onSelectWaterBody) {
      onSelectWaterBody(targetWb);
    }

    // Scroll to dossier smoothly
    setTimeout(() => {
      const el = document.getElementById('apwrims-dossier');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);
  };

  return (
    <div 
      ref={svgContainerRef}
      onWheel={handleWheel}
      className="relative w-full h-full select-none overflow-hidden rounded-2xl bg-[#f8fafc] cursor-grab active:cursor-grabbing"
    >
      {/* 5-Color Verified Condition Legend in Top-Left (Non-blocking) */}
      <div className="absolute top-3 left-3 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-300 shadow-xs text-[11px] font-bold">
        <span className="text-slate-500 font-mono uppercase text-[10px] mr-1 hidden sm:inline">3-District Grid:</span>
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

      {/* Interactive Navigation Compass / Directional Pan & Zoom Pad (Aage-Piche, Upar-Neeche) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
        {/* Zoom & Quick Reset */}
        <div className="flex items-center gap-1 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-slate-300 shadow-sm">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3.5))}
            title="Zoom In (Aage / Pass)"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.6))}
            title="Zoom Out (Piche / Door)"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            title="Reset Map View"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Directional Navigation Pad (Aage / Piche / Upar / Neeche) */}
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
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div></div>
            <button
              onClick={() => panDirection('left')}
              title="Pan Left (Piche / Baye)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoomLevel(1);
                setPanOffset({ x: 0, y: 0 });
              }}
              title="Center"
              className="p-1 rounded-md bg-slate-200 text-slate-800 text-[9px] font-bold"
            >
              •
            </button>
            <button
              onClick={() => panDirection('right')}
              title="Pan Right (Aage / Daye)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition-colors"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div></div>
            <button
              onClick={() => panDirection('down')}
              title="Pan Down (Neeche)"
              className="p-1 rounded-md bg-slate-100 hover:bg-sky-100 text-slate-700 hover:text-sky-700 transition-colors"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <div></div>
          </div>
        </div>

        {/* Quick Focus District Buttons */}
        <div className="flex flex-col gap-1 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-300 shadow-sm text-[10px] font-bold">
          <span className="text-[9px] text-slate-400 font-mono">Zoom to District:</span>
          <button
            onClick={() => onSwitchDistrict && onSwitchDistrict('Parvathipuram Manyam')}
            className="px-2 py-1 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-left transition-colors cursor-pointer"
          >
            🏔️ Parvathipuram
          </button>
          <button
            onClick={() => onSwitchDistrict && onSwitchDistrict('Vizianagaram')}
            className="px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-left transition-colors cursor-pointer"
          >
            🌾 Vizianagaram
          </button>
          <button
            onClick={() => onSwitchDistrict && onSwitchDistrict('Visakhapatnam')}
            className="px-2 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-left transition-colors cursor-pointer"
          >
            🌊 Visakhapatnam
          </button>
        </div>
      </div>

      {/* SVG Canvas with Unified 3-District Geometry */}
      <svg
        viewBox="0 0 1150 1180"
        onMouseDown={handleMouseDown}
        className="w-full h-full"
      >
        <defs>
          <pattern id="combined-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" />
          </pattern>

          <linearGradient id="all-sea-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="comb-lake-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </radialGradient>
        </defs>

        <rect width="1150" height="1180" fill="#f8fafc" />
        <rect width="1150" height="1180" fill="url(#combined-grid)" />

        {/* ============================================================== */}
        {/* BAY OF BENGAL MARITIME SHELF (EASTERN SHORELINE)              */}
        {/* ============================================================== */}
        <g id="combined-bay-of-bengal" className="select-none">
          <path
            d="M 940,355 Q 890,520 745,715 T 780,830 Q 670,965 610,1045 T 450,1130 L 1150,1180 L 1150,300 Z"
            fill="url(#all-sea-gradient)"
          />

          {/* Animated Coastal Waves */}
          <path
            d="M 950,365 Q 900,530 755,725 T 790,840 Q 680,975 620,1055 T 460,1140"
            fill="none"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeDasharray="10 8"
            opacity="0.6"
          >
            <animate attributeName="stroke-dashoffset" values="0;36" dur="4s" repeatCount="indefinite" />
          </path>

          <text
            x="960"
            y="720"
            fill="#0369a1"
            fontSize="22"
            fontWeight="bold"
            letterSpacing="4"
            className="pointer-events-none select-none font-serif opacity-80"
            transform="rotate(72, 960, 720)"
          >
            BAY OF BENGAL (బంగాళాఖాతం) 🌊
          </text>
          <text
            x="990"
            y="745"
            fill="#0284c7"
            fontSize="12"
            fontStyle="italic"
            className="pointer-events-none select-none opacity-80"
            transform="rotate(72, 990, 745)"
          >
            North Andhra Coastline • Srikakulam → Pusapatirega → Bheemili → Visakhapatnam Port
          </text>
        </g>

        {/* Dynamic Zoom & Pan Transform Layer */}
        <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
          
          {/* ============================================================== */}
          {/* DISTRICT HEADER BANNERS (GEOGRAPHIC REGION IDENTIFIERS)        */}
          {/* ============================================================== */}
          {/* 1. Parvathipuram Manyam Banner */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSwitchDistrict && onSwitchDistrict('Parvathipuram Manyam')}
          >
            <rect x="220" y="30" width="460" height="34" rx="8" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" opacity="0.9" />
            <text x="450" y="52" fill="#15803d" fontSize="13" fontWeight="bold" textAnchor="middle" className="select-none group-hover:underline">
              ▲ 1. PARVATHIPURAM MANYAM DISTRICT (15 Mandals • Agency Hills & Dams)
            </text>
          </g>

          {/* 2. Vizianagaram Banner */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSwitchDistrict && onSwitchDistrict('Vizianagaram')}
          >
            <rect x="260" y="520" width="130" height="28" rx="6" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" opacity="0.95" />
            <text x="325" y="538" fill="#92400e" fontSize="10.5" fontWeight="bold" textAnchor="middle" className="select-none group-hover:underline">
              🌾 2. VIZIANAGARAM
            </text>
          </g>

          {/* 3. Visakhapatnam Banner */}
          <g 
            className="cursor-pointer group"
            onClick={() => onSwitchDistrict && onSwitchDistrict('Visakhapatnam')}
          >
            <rect x="240" y="870" width="130" height="28" rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1.2" opacity="0.95" />
            <text x="305" y="888" fill="#1e40af" fontSize="10.5" fontWeight="bold" textAnchor="middle" className="select-none group-hover:underline">
              🌊 3. VISAKHAPATNAM
            </text>
          </g>

          {/* ============================================================== */}
          {/* COMBINED MANDAL POLYGONS LAYER                                */}
          {/* ============================================================== */}
          <g id="all-combined-mandals-layer">
            {ALL_COMBINED_MANDALS.map((mandal) => {
              const fillColor = getMandalFill(mandal);
              const isHovered = hoveredMandal?.id === mandal.id;
              const isSelected = activeWaterBody && (
                activeWaterBody.name.toLowerCase().includes(mandal.name.toLowerCase()) ||
                activeWaterBody.mandal?.toLowerCase().includes(mandal.name.toLowerCase())
              );
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
                    strokeWidth={isSelected ? '3.5' : isHovered ? '2.5' : '1.3'}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    filter={isSelected ? 'drop-shadow(0 4px 10px rgba(2, 132, 199, 0.45))' : undefined}
                  />

                  {/* Name Label */}
                  <g pointerEvents="none" className="select-none">
                    <text
                      x={mandal.center.x}
                      y={mandal.center.y - 7}
                      fill="#0f172a"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      paintOrder="stroke"
                      stroke="#ffffff"
                      strokeWidth="3.2"
                    >
                      {mandal.name}
                    </text>
                    <text
                      x={mandal.center.x}
                      y={mandal.center.y + 6}
                      fill="#334155"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                      paintOrder="stroke"
                      stroke="#ffffff"
                      strokeWidth="2.8"
                    >
                      {mandal.teluguName}
                    </text>
                  </g>

                  {/* Dedicated Water Body Node on Every Mandal */}
                  {(() => {
                    const nodeY = mandal.center.y + 19;
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
                        {(isSelected || isRed) && (
                          <circle cx="0" cy="0" r="13" fill="none" stroke={pinColor} strokeWidth="1.6" strokeDasharray="3 3">
                            <animate attributeName="r" values="7;18;7" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.9;0.15;0.9" dur="2s" repeatCount="indefinite" />
                          </circle>
                        )}
                        {isExtinct && (
                          <circle cx="0" cy="0" r="10" fill="none" stroke="#64748b" strokeWidth="1.2" strokeDasharray="2 2" />
                        )}
                        <circle
                          cx="0"
                          cy="0"
                          r={isSelected ? '6.5' : '5'}
                          fill={pinColor}
                          stroke="#ffffff"
                          strokeWidth="1.6"
                          filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))"
                        />
                        <text
                          x="0"
                          y={isExtinct ? "2" : isRed ? "2" : "2"}
                          fontSize={isExtinct ? "6" : isRed ? "5.5" : "5.5"}
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
          {/* MAJOR INTER-DISTRICT RIVERS & ANIMATED FLOW LINES             */}
          {/* ============================================================== */}
          {showRivers && (
            <g id="combined-rivers-layer">
              {/* 1. Nagavali River (Flows North to East through Thotapalli Barrage) */}
              <g className="cursor-pointer group">
                <path d="M 470,80 Q 520,180 530,280 T 670,360 T 780,390 T 920,440" fill="none" stroke="#0284c7" strokeWidth="4.2" strokeLinecap="round" />
                <circle r="4" fill="#38bdf8" className="pointer-events-none">
                  <animateMotion path="M 470,80 Q 520,180 530,280 T 670,360 T 780,390 T 920,440" dur="4.5s" repeatCount="indefinite" />
                </circle>
                <text x="560" y="235" fill="#0369a1" fontSize="10.5" fontWeight="bold" fontStyle="italic" paintOrder="stroke" stroke="#ffffff" strokeWidth="3.2" className="pointer-events-none select-none">
                  Nagavali River 🌊 (నాగావళి నది)
                </text>
              </g>

              {/* 2. Champavathi River (Through Mentada, Gajapathinagaram, Nellimarla, Denkada into Pusapatirega Bay of Bengal) */}
              <g className="cursor-pointer group">
                <path d="M 330,440 Q 420,500 520,570 T 630,640 T 735,680" fill="none" stroke="#0284c7" strokeWidth="3.6" strokeLinecap="round" />
                <circle r="3.8" fill="#38bdf8" className="pointer-events-none">
                  <animateMotion path="M 330,440 Q 420,500 520,570 T 630,640 T 735,680" dur="4.2s" repeatCount="indefinite" />
                </circle>
                <text x="470" y="530" fill="#0369a1" fontSize="10" fontWeight="bold" fontStyle="italic" paintOrder="stroke" stroke="#ffffff" strokeWidth="3" className="pointer-events-none select-none">
                  Champavathi River (చంపావతి నది)
                </text>
              </g>

              {/* 3. Gosthani River (Through Thatipudi S.Kota, Anandapuram into Bheemili Bay of Bengal) */}
              <g className="cursor-pointer group">
                <path d="M 230,600 Q 320,680 430,760 T 570,840 T 730,800" fill="none" stroke="#0284c7" strokeWidth="3.8" strokeLinecap="round" />
                <circle r="3.8" fill="#38bdf8" className="pointer-events-none">
                  <animateMotion path="M 230,600 Q 320,680 430,760 T 570,840 T 730,800" dur="4s" repeatCount="indefinite" />
                </circle>
                <text x="350" y="720" fill="#0369a1" fontSize="10" fontWeight="bold" fontStyle="italic" paintOrder="stroke" stroke="#ffffff" strokeWidth="3" className="pointer-events-none select-none">
                  Gosthani River (గోస్తని నది)
                </text>
              </g>
            </g>
          )}

          {/* ============================================================== */}
          {/* KEY PROMINENT RESERVOIRS ON UNIFIED GRID                       */}
          {/* ============================================================== */}
          {/* Thotapalli Barrage (Garugubilli) */}
          <ellipse cx="530" cy="280" rx="20" ry="12" fill="url(#comb-lake-grad)" stroke="#0284c7" strokeWidth="1.5" />
          <text x="530" y="284" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" paintOrder="stroke" stroke="#0369a1" strokeWidth="2" className="pointer-events-none select-none">
            Thotapalli (78.2M)
          </text>

          {/* Janjavathi Dam (Komarada) */}
          <ellipse cx="430" cy="140" rx="18" ry="10" fill="url(#comb-lake-grad)" stroke="#0284c7" strokeWidth="1.5" />
          <text x="430" y="143" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" paintOrder="stroke" stroke="#0369a1" strokeWidth="2" className="pointer-events-none select-none">
            Janjavathi (42.5M)
          </text>

          {/* Thatipudi Reservoir (S.Kota) */}
          <ellipse cx="240" cy="595" rx="19" ry="11" fill="url(#comb-lake-grad)" stroke="#0284c7" strokeWidth="1.5" />
          <text x="240" y="598" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" paintOrder="stroke" stroke="#0369a1" strokeWidth="2" className="pointer-events-none select-none">
            Thatipudi (94.2M)
          </text>

          {/* Meghadrigedda (Gopalapatnam) */}
          <ellipse cx="405" cy="940" rx="18" ry="11" fill="url(#comb-lake-grad)" stroke="#0284c7" strokeWidth="1.5" />
          <text x="405" y="943" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" paintOrder="stroke" stroke="#0369a1" strokeWidth="2" className="pointer-events-none select-none">
            Meghadrigedda (34.2M)
          </text>

          {/* Mudasarlova (Visakhapatnam Rural) */}
          <ellipse cx="525" cy="935" rx="16" ry="10" fill="url(#comb-lake-grad)" stroke="#0284c7" strokeWidth="1.5" />
          <text x="525" y="938" fill="#ffffff" fontSize="6.5" fontWeight="bold" textAnchor="middle" paintOrder="stroke" stroke="#0369a1" strokeWidth="2" className="pointer-events-none select-none">
            Mudasarlova (18.5M)
          </text>
        </g>
      </svg>
    </div>
  );
};
