export type WaterBodyStatusColor = 'green' | 'blue' | 'yellow' | 'red' | 'grey';

export type WrisDatasetType = 
  | 'reservoir' 
  | 'river_level' 
  | 'river_discharge' 
  | 'rainfall' 
  | 'groundwater' 
  | 'basin_river_level' 
  | 'basin_river_discharge' 
  | 'basin_reservoir' 
  | 'basin_rainfall';

export interface WaterBody {
  id: string;
  name: string;
  teluguName?: string;
  state?: string; // e.g. "Andhra Pradesh", "Rajasthan", "Maharashtra", "Karnataka", "Punjab", etc.
  type: 'Lake' | 'Reservoir' | 'River' | 'Canal' | 'Traditional Tank / Cheruvu' | 'Check Dam' | 'Rainfall Station' | 'Groundwater Well';
  datasetType?: WrisDatasetType;
  endpoint?: string;
  agency?: string;
  liveTelemetry?: {
    storageBMC?: number;
    storageMCM?: number;
    fullCapacityMCM?: number;
    waterLevelM?: number;
    dangerLevelM?: number;
    dischargeCusecs?: number;
    rainfallMm?: number;
    departurePercent?: number;
    depthToWaterM_bgl?: number;
    rechargeTrend?: string;
    subBasin?: string;
  };
  district: string;
  mandal: string;
  village: string;
  coordinates: { lat: number; lng: number };
  statusColor: WaterBodyStatusColor;
  statusLabel: string; // e.g. "Bahut Achha (Pristine)", "Normal", "Middle Problem", "Danger Zone", "Extinct / Silt Choked"
  waterLevelPercent: number; // 0 to 100
  tdsPpm: number; // ppm
  wasteLevel: 'None' | 'Low' | 'Moderate' | 'Heavy' | 'Extinct';
  lastInspected: string;
  description: string;
  imageUrl: string;
}

export type UserRoleType = 'overview' | 'admin' | 'user' | 'nodal_vizianagaram' | 'nodal_parvathipuram' | 'inspector' | 'engineer';

export interface CitizenComplaint {
  id: string; // e.g. "CMP-AP-2026-101"
  citizenName: string;
  citizenAge: number;
  citizenGender: 'Male' | 'Female' | 'Other';
  citizenPhone: string;
  state?: string;
  district: string;
  mandal: string;
  village: string;
  locationLandmark: string;
  coordinates: { lat: number; lng: number };
  shortDescription: string;
  photoUrl?: string;
  submittedAt: string;
  status: 
    | 'SUBMITTED' 
    | 'INSPECTOR_ASSIGNED' 
    | 'INSPECTION_COMPLETED' 
    | 'ACTION_ASSIGNED' 
    | 'WORKER_IN_PROGRESS' 
    | 'VERIFICATION_PENDING' 
    | 'RESOLVED' 
    | 'REJECTED';
  assignedNodalOfficer: string;
  assignedInspector?: string;
  assignedInspectorPhone?: string;
  assignedEngineer?: string;
  assignedEngineerPhone?: string;
  inspectionReport?: InspectorReport;
  workExecution?: EngineerWorkExecution;
}

export interface InspectorReport {
  id: string;
  inspectorName: string;
  inspectorPhone: string;
  inspectedAt: string;
  gpsCoordinates: { lat: number; lng: number };
  waterPresence: 'Abundant' | 'Moderate' | 'Low' | 'Stagnant Dry' | 'Extinct';
  wasteLevel: 'Low' | 'Moderate' | 'Heavy' | 'Severe Choke';
  wasteType: 
    | 'Plastic & Polythene' 
    | 'Domestic Sewage' 
    | 'Industrial Chemical Effluent' 
    | 'Agricultural Pesticide Runoff' 
    | 'Construction Debris & Bitumen' 
    | 'Dead Biomass & Eutrophic Algae';
  sourcePinDescription: string; // e.g. "Upstream textile dye discharge canal #2"
  tdsReadingPpm: number; // machine reading
  sitePhotoUrl: string;
  isComplaintValid: boolean;
  validationRemarks: string;
  postWorkVerification?: {
    verifiedAt: string;
    isSatisfactory: boolean;
    verificationPhotoUrl: string;
    remarks: string;
  };
}

export interface EngineerWorkExecution {
  id: string;
  engineerName: string;
  engineerPhone: string;
  assignedAt: string;
  deadline: string; // strict deadline
  status: 'PENDING_ACCEPTANCE' | 'ACCEPTED' | 'BLOCKED' | 'COMPLETED';
  blockReason?: string;
  beforePhotoUrl?: string;
  afterPhotoUrl?: string;
  workSummary?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface OfficerContact {
  id: string;
  name: string;
  designation: string;
  role: 'Nodal Officer' | 'Inspector' | 'Action Engineer' | 'District Collectorate';
  district: 'Vizianagaram' | 'Parvathipuram Manyam' | 'State Level (AP)';
  phone: string;
  email: string;
  officeAddress: string;
  avatarUrl: string;
  status: 'Active on Field' | 'On Duty' | 'Inspection Dispatch';
}
