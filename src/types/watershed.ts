export type WaterStatus = 'normal' | 'watch' | 'stressed' | 'critical' | 'insufficient_data';

export type DataConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type DataSourceType = 'GOVERNMENT_OBSERVED' | 'SATELLITE_DERIVED' | 'MODELLED_ESTIMATE' | 'FIELD_VERIFIED' | 'DATA_UNAVAILABLE';

export interface StressFactor {
  name: string;
  percentage: number;
  description: string;
  source: string;
  date: string;
  method: string;
}

export interface GroundwaterObservation {
  year: number;
  season: 'Pre-Monsoon' | 'Post-Monsoon' | 'Rabi' | 'Zaid';
  depthMetersBgl: number; // meters below ground level (higher = deeper/worse)
  historicalAvgMeters: number;
  rechargeRateMmYear: number;
}

export interface RainfallObservation {
  year: number;
  season: string;
  recordedMm: number;
  normalMm: number;
  anomalyPercent: number;
}

export interface RechargeAsset {
  id: string;
  name: string;
  type: 'Check Dam' | 'Recharge Pit' | 'Recharge Well' | 'Percolation Tank' | 'Farm Pond' | 'Rooftop RWH' | 'Silt Trap';
  capacityCuM: number;
  installationYear: number;
  status: 'Functional' | 'Partially Silted' | 'Critically Damaged' | 'Dry/Non-Functional' | 'Under Maintenance';
  latitude: number;
  longitude: number;
  village: string;
  lastVerifiedDate: string;
  verificationSource: string;
  verifiedBy: string;
  photoUrl: string;
  maintenanceAgency: string;
}

export interface FieldVerificationSubmission {
  id: string;
  assetId: string;
  assetName: string;
  watershedId: string;
  submittedBy: string;
  role: 'Field Officer' | 'Gram Panchayat SPOC' | 'Community Auditor' | 'Hydrologist';
  statusReported: 'Functional' | 'Partially Silted' | 'Critically Damaged' | 'Dry/Non-Functional' | 'Under Maintenance';
  latitude: number;
  longitude: number;
  timestamp: string;
  photoUrl: string;
  remarks: string;
  isVerified: boolean;
}

export interface FieldProgressLog {
  id: string;
  timestamp: string;
  officerName: string;
  role: string;
  note: string;
  stage: 'Excavation & Silt Removal' | 'Masonry & Bund Reinforcement' | 'Filter Media Refit' | 'Pre-Monsoon Catchment Clearing' | 'Hydraulic Testing' | 'Community Social Audit';
  percentageComplete: number;
  gpsCoordinates?: { lat: number; lng: number };
  photoEvidenceUrl?: string;
}

export interface ActionTask {
  id: string;
  watershedId: string;
  title: string;
  category: 'Recharge Structure Verification' | 'RWH Follow-up' | 'Groundwater Monitoring' | 'Irrigation Review' | 'Desiltation Campaign';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  responsibleAgency: string;
  assignedOfficer: string;
  deadline: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'EVIDENCE_SUBMITTED' | 'VERIFIED_CLOSED';
  evidenceSummary?: string;
  verifiedDate?: string;
  progressLogs?: FieldProgressLog[];
}

export interface LedgerCycle {
  seasonLabel: string;
  year: number;
  rainfallInflowCuM: number;
  naturalInfiltrationCuM: number;
  artificialRechargeCapturedCuM: number;
  estimatedIrrigationExtractionCuM: number;
  domesticLivestockDrawCuM: number;
  netAquiferBalanceCuM: number; // positive = surplus, negative = deficit
  observedGroundwaterShiftMeters: number; // + = recovered, - = dropped
  recordedStatus: WaterStatus;
}

export interface SatelliteMetrics {
  ndviCropHealth: number; // 0 to 1
  irrigatedAreaHectares: number;
  imperviousBuiltupGrowthPercent: number; // 5 year growth
  surfaceWaterBodySpreadSqKm: number;
  potentialRechargeSuitability: 'Excellent' | 'Moderate' | 'Poor';
  lastSatellitePass: string;
}

export interface StakeholderContact {
  id: string;
  name: string;
  designation: string;
  category: 'Gram Panchayat' | 'Water Committee' | 'Nodal Officer' | 'Community Auditor';
  phone: string;
  email: string;
  villageOrOffice: string;
  availability: string;
  grievancesResolvedCount: number;
  avatarUrl?: string;
}

export interface GramSabhaMeeting {
  id: string;
  date: string;
  title: string;
  location: string;
  agenda: string;
  attendeesExpected: number;
}

export interface GrievanceSubmission {
  id: string;
  watershedId: string;
  citizenName: string;
  citizenPhone: string;
  assignedToStakeholderId: string;
  issueType: 'Broken Check Dam' | 'Choked Recharge Well' | 'Illegal Tanker Extraction' | 'Silted Lake Inlet' | 'Drinking Water Shortage';
  description: string;
  village: string;
  status: 'SUBMITTED' | 'FORWARDED_TO_PANCHAYAT' | 'FIELD_INVESTIGATION' | 'RESOLVED';
  timestamp: string;
}

export interface EndangeredZoneComplaint {
  id: string;
  watershedId: string;
  watershedName: string;
  locationLandmark: string;
  gpsCoordinates: { lat: number; lng: number };
  hazardType: 'Critical Dry Borewell / Well Collapse' | 'Contaminated Toxic Water Influx' | 'Check Dam / Bund Breach Risk' | 'Illegal Deep Drilling Overdraft' | 'Drying Up of Community Reservoir' | 'Encroached Water Body / Silt Choke';
  severity: 'CRITICAL_HAZARD' | 'HIGH_ALERT' | 'MODERATE_WATCH';
  reportedBy: string;
  contactPhone: string;
  description: string;
  screenshotUrl: string;
  timestamp: string;
  assignedPanchayat: string;
  assignedNodalOfficer: string;
  status: 'PENDING_VERIFICATION' | 'INSPECTION_ORDERED' | 'EMERGENCY_ACTION_TAKEN' | 'RESOLVED';
  inspectionNotes?: string;
}

export interface MicroWatershed {
  id: string;
  name: string;
  code: string;
  district: string;
  state: string;
  basin: string;
  areaSqKm: number;
  coordinates: {
    lat: number;
    lng: number;
    svgX: number;
    svgY: number;
  };
  currentStatus: WaterStatus;
  stressScore: number; // 0 to 100 (100 = max stress)
  dataConfidence: DataConfidence;
  activeAlertsCount: number;
  
  // Hydrology Metrics
  groundwaterCurrentBgl: number;
  groundwaterHistoricalAvgBgl: number;
  groundwaterTrend1YrPercent: number; // e.g. -14% (deepened)
  groundwaterTrend5YrPercent: number;
  rainfallCurrentSeasonMm: number;
  rainfallNormalMm: number;
  rainfallDeficitPercent: number;

  // Recharge stats
  totalRechargeAssets: number;
  functionalAssetsCount: number;
  needsRepairCount: number;
  
  // Modelled Recovery
  estimatedRecoveryWeeks: string;
  recoveryModelConfidence: 'High' | 'Medium' | 'Low';
  modelledInfiltrationRateMmDay: number;
  soilType: string;
  aquiferFormation: string;

  // Breakdown factors
  stressDecomposition: StressFactor[];
  
  // Time Series
  groundwaterHistory: GroundwaterObservation[];
  rainfallHistory: RainfallObservation[];
  
  // Ledger
  ledger: LedgerCycle[];

  // Satellite Metrics
  satellite: SatelliteMetrics;
  
  // Assets
  assets: RechargeAsset[];

  // Tasks
  tasks: ActionTask[];

  // Stakeholder Engagement & Community Accountability
  stakeholders: StakeholderContact[];
  upcomingMeetings: GramSabhaMeeting[];

  // Before & After Outcome Measurement
  seasonalAudit: {
    beforeLabel: string;
    beforeTrend: string;
    beforeFunctionalAssets: number;
    beforeStressScore: number;
    afterLabel: string;
    afterTrend: string;
    afterFunctionalAssets: number;
    afterStressScore: number;
    verifiedImprovementSummary: string;
  };
}
