import { EndangeredZoneComplaint } from '../types/watershed';

export const INITIAL_ENDANGERED_COMPLAINTS: EndangeredZoneComplaint[] = [
  {
    id: 'CMP-ENDANGERED-2026-001',
    watershedId: 'ws-kolar-palavanhalli',
    watershedName: 'Palavanhalli Micro-Watershed (Kolar Basin)',
    locationLandmark: 'Near Gollahalli Primary School & Nala Junction',
    gpsCoordinates: { lat: 13.1295, lng: 78.1215 },
    hazardType: 'Check Dam / Bund Breach Risk',
    severity: 'CRITICAL_HAZARD',
    reportedBy: 'Suresh Gowda (Local Farmer)',
    contactPhone: '+91 94481 99012',
    description: 'The right-bank stone masonry embankment of the percolation bund has cracked severely after the recent flash rain. Water is seeping under the foundation and will wash away the access culvert if not reinforced.',
    screenshotUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-01 09:30 IST',
    assignedPanchayat: 'Palavanhalli Gram Panchayat (Smt. Manjula Narayanaswamy)',
    assignedNodalOfficer: 'Er. S. Nagaraj (AEE Minor Irrigation)',
    status: 'INSPECTION_ORDERED',
    inspectionNotes: 'AEE deployed technical assistant to inspect foundation scouring; sandbags stacked as temporary buffer.'
  },
  {
    id: 'CMP-ENDANGERED-2026-002',
    watershedId: 'ws-delhi-najafgarh',
    watershedName: 'Najafgarh-Dwarka Urban Micro-Watershed',
    locationLandmark: 'Dwarka Sector 23 Stormwater Drain Culvert #4',
    gpsCoordinates: { lat: 28.5835, lng: 77.0410 },
    hazardType: 'Encroached Water Body / Silt Choke',
    severity: 'HIGH_ALERT',
    reportedBy: 'Anita Sharma (RWA Secretary)',
    contactPhone: '+91 98110 44521',
    description: 'Road contractor dumped bitumen debris and heavy gravel directly into the dual-chamber stormwater recharge shaft inlet, completely blinding the geotextile filter.',
    screenshotUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-09-30 16:45 IST',
    assignedPanchayat: 'Dwarka Municipal Ward #32',
    assignedNodalOfficer: 'Er. Alok Saxena (DJB RWH Cell)',
    status: 'EMERGENCY_ACTION_TAKEN',
    inspectionNotes: 'Show-cause notice served to contractor; JCB mobilized to excavate gravel and wash filter bed.'
  },
  {
    id: 'CMP-ENDANGERED-2026-003',
    watershedId: 'ws-anantapur-kalyandurg',
    watershedName: 'Kalyandurg Micro-Watershed (Pennar Basin)',
    locationLandmark: 'Mudigallu Cheruvu Feeder Inflow Canal',
    gpsCoordinates: { lat: 14.5440, lng: 77.0995 },
    hazardType: 'Critical Dry Borewell / Well Collapse',
    severity: 'CRITICAL_HAZARD',
    reportedBy: 'K. Ramanjaneyulu',
    contactPhone: '+91 94902 33110',
    description: 'Three community drinking borewells have completely dried up within 48 hours following uncontrolled 650ft borewell drilling by commercial orchards on hill flank.',
    screenshotUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    timestamp: '2026-10-02 08:15 IST',
    assignedPanchayat: 'Mudigallu Gram Panchayat',
    assignedNodalOfficer: 'Er. K. Venkataswamy (DWMA Project Director)',
    status: 'PENDING_VERIFICATION',
    inspectionNotes: 'Report submitted to Revenue Divisional Officer for immediate borewell rig seizure.'
  }
];
