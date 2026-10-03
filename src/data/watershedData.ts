import { MicroWatershed } from '../types/watershed';
import { getStakeholdersForWatershed } from './stakeholderData';

export const OFFICIAL_DATA_SOURCES = [
  {
    name: 'India-WRIS',
    title: 'Water Resources Information System of India',
    agency: 'Ministry of Jal Shakti, Department of Water Resources',
    url: 'https://indiawris.gov.in/',
    description: 'Centralised repository for nationwide hydro-meteorological data, river basins, reservoir storages, and groundwater levels.',
    badge: 'GOVERNMENT OBSERVED',
    updateCadence: 'Daily / Telemetric & Quarterly Piezometer Logs',
  },
  {
    name: 'NWIC NWDP',
    title: 'National Water Data Portal',
    agency: 'National Water Informatics Centre',
    url: 'https://nwdp.nwic.gov.in/',
    description: 'Automated data pipelines delivering real-time telemetry from DWLR (Digital Water Level Recorders) and rain gauges.',
    badge: 'REAL-TIME TELEMETRY',
    updateCadence: 'Hourly to Daily Piezometric Push',
  },
  {
    name: 'CGWB Portal',
    title: 'Central Ground Water Board Assessment',
    agency: 'Central Ground Water Board (Govt of India)',
    url: 'https://cgwb.gov.in/',
    description: 'Dynamic groundwater resources assessment, stage of extraction calculations, aquifer mapping (NAQUIM), and artificial recharge master plans.',
    badge: 'STATUTORY AUDIT',
    updateCadence: 'Annual Pre/Post-Monsoon Assessment',
  },
  {
    name: 'Bhuvan NRSC',
    title: 'ISRO Geospatial Platform - Water Resources',
    agency: 'National Remote Sensing Centre (NRSC) / ISRO',
    url: 'https://bhuvan.nrsc.gov.in/',
    description: 'Satellite-derived Land Use / Land Cover (LULC), surface water body spread, normalized difference vegetation index (NDVI), and geomorphological lineaments.',
    badge: 'SATELLITE DERIVED',
    updateCadence: '15-Day Sentinel / Cartosat Composites',
  }
];

export const RAW_MICRO_WATERSHEDS_DATA: Omit<MicroWatershed, 'stakeholders' | 'upcomingMeetings'>[] = [
  {
    id: 'ws-kolar-palavanhalli',
    name: 'Palavanhalli Micro-Watershed (Kolar Basin)',
    code: 'KA-KLR-W04-PAL',
    district: 'Kolar',
    state: 'Karnataka',
    basin: 'Palar River Basin',
    areaSqKm: 42.6,
    coordinates: {
      lat: 13.1367,
      lng: 78.1292,
      svgX: 388,
      svgY: 720,
    },
    currentStatus: 'critical',
    stressScore: 84,
    dataConfidence: 'HIGH',
    activeAlertsCount: 3,
    groundwaterCurrentBgl: 64.2, // meters below ground level
    groundwaterHistoricalAvgBgl: 38.5,
    groundwaterTrend1YrPercent: -18.4,
    groundwaterTrend5YrPercent: -42.1,
    rainfallCurrentSeasonMm: 412,
    rainfallNormalMm: 740,
    rainfallDeficitPercent: -44.3,
    totalRechargeAssets: 24,
    functionalAssetsCount: 9,
    needsRepairCount: 15,
    estimatedRecoveryWeeks: '7 to 11 weeks post adequate rainfall (min 160mm cumulative)',
    recoveryModelConfidence: 'Medium',
    modelledInfiltrationRateMmDay: 4.8,
    soilType: 'Red Loamy to Sandy Loam on Weathered Crystalline Gneiss',
    aquiferFormation: 'Fissured & Fractured Granitic Gneiss (Hard Rock Aquifer)',
    stressDecomposition: [
      {
        name: 'Groundwater Table Overdraft',
        percentage: 38,
        description: 'Borewell draw exceeds sustainable replenishment rate (Stage of GW Extraction > 192%).',
        source: 'CGWB NAQUIM Piezometer Station #KA-KLR-09',
        date: 'August 2026',
        method: 'DWLR Telemetric Hydrograph & Volumetric Water Balance'
      },
      {
        name: 'Agricultural Extraction Pressure',
        percentage: 28,
        description: 'Intensive commercial horticulture (tomato, capsicum, mulberry) dependent 100% on deep borewells.',
        source: 'NRSC Bhuvan LULC & Crop Phenology Layer',
        date: 'July 2026',
        method: 'Satellite Irrigated Land Area Estimation & Crop Evapotranspiration Proxy'
      },
      {
        name: 'Rainfall Deficit & Runoff Deficit',
        percentage: 19,
        description: 'Monsoon delay resulted in -44.3% deficit against 30-year IMD gridded normal.',
        source: 'IMD Gridded Rainfall & India-WRIS Hydromet',
        date: 'September 2026',
        method: 'Automatic Weather Station (AWS) Gridded Kriging'
      },
      {
        name: 'Recharge Infrastructure Inefficacy',
        percentage: 15,
        description: '15 out of 24 structures heavily silted, breached bunds, or missing catchment diversion channels.',
        source: 'District Watershed Cell Ground Truth Audit',
        date: 'August 2026',
        method: 'Field Audit with Geo-tagged Visual Inspection'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 52.1, historicalAvgMeters: 36.2, rechargeRateMmYear: 42 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 49.3, historicalAvgMeters: 33.1, rechargeRateMmYear: 58 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 56.4, historicalAvgMeters: 37.0, rechargeRateMmYear: 39 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 53.8, historicalAvgMeters: 34.2, rechargeRateMmYear: 45 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 61.2, historicalAvgMeters: 37.8, rechargeRateMmYear: 31 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 58.7, historicalAvgMeters: 35.0, rechargeRateMmYear: 36 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 66.5, historicalAvgMeters: 38.5, rechargeRateMmYear: 28 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 64.2, historicalAvgMeters: 36.4, rechargeRateMmYear: 33 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 680, normalMm: 740, anomalyPercent: -8.1 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 615, normalMm: 740, anomalyPercent: -16.8 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 520, normalMm: 740, anomalyPercent: -29.7 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 412, normalMm: 740, anomalyPercent: -44.3 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 22152000,
        naturalInfiltrationCuM: 1772160,
        artificialRechargeCapturedCuM: 320000,
        estimatedIrrigationExtractionCuM: 3890000,
        domesticLivestockDrawCuM: 420000,
        netAquiferBalanceCuM: -2217840,
        observedGroundwaterShiftMeters: -2.5,
        recordedStatus: 'stressed'
      },
      {
        seasonLabel: 'Rabi 2025-26 Cycle',
        year: 2026,
        rainfallInflowCuM: 3120000,
        naturalInfiltrationCuM: 156000,
        artificialRechargeCapturedCuM: 45000,
        estimatedIrrigationExtractionCuM: 2950000,
        domesticLivestockDrawCuM: 390000,
        netAquiferBalanceCuM: -3139000,
        observedGroundwaterShiftMeters: -5.3,
        recordedStatus: 'critical'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 17551200,
        naturalInfiltrationCuM: 1228584,
        artificialRechargeCapturedCuM: 298000,
        estimatedIrrigationExtractionCuM: 3410000,
        domesticLivestockDrawCuM: 410000,
        netAquiferBalanceCuM: -2293416,
        observedGroundwaterShiftMeters: -2.3,
        recordedStatus: 'critical'
      }
    ],
    satellite: {
      ndviCropHealth: 0.44,
      irrigatedAreaHectares: 1840,
      imperviousBuiltupGrowthPercent: 12.8,
      surfaceWaterBodySpreadSqKm: 0.84,
      potentialRechargeSuitability: 'Moderate',
      lastSatellitePass: '2026-09-24 (Sentinel-2 MSI, NRSC)'
    },
    assets: [
      {
        id: 'ASSET-KLR-001',
        name: 'Palavanhalli Main Nala Check Dam',
        type: 'Check Dam',
        capacityCuM: 18500,
        installationYear: 2018,
        status: 'Partially Silted',
        latitude: 13.1412,
        longitude: 78.1345,
        village: 'Palavanhalli',
        lastVerifiedDate: '2026-08-14',
        verificationSource: 'Field Inspection App v2.4 (GPS & Photo Tagged)',
        verifiedBy: 'S. Nagaraj (AEE, Minor Irrigation, Kolar)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Minor Irrigation Sub-Division & Gram Panchayat'
      },
      {
        id: 'ASSET-KLR-002',
        name: 'Gollahalli Percolation Tank #2',
        type: 'Percolation Tank',
        capacityCuM: 32000,
        installationYear: 2016,
        status: 'Critically Damaged',
        latitude: 13.1289,
        longitude: 78.1210,
        village: 'Gollahalli',
        lastVerifiedDate: '2026-07-29',
        verificationSource: 'Gram Sabha Social Audit Report',
        verifiedBy: 'Manjula R. (Gram Panchayat Secretary)',
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Zilla Panchayat Watershed Development Wing'
      },
      {
        id: 'ASSET-KLR-003',
        name: 'Kundahalli Borewell Injection Recharge Shaft',
        type: 'Recharge Well',
        capacityCuM: 6200,
        installationYear: 2021,
        status: 'Functional',
        latitude: 13.1455,
        longitude: 78.1420,
        village: 'Kundahalli',
        lastVerifiedDate: '2026-09-02',
        verificationSource: 'CGWB Artificial Recharge Monitoring Protocol',
        verifiedBy: 'Dr. V. Prasad (Scientist-D, CGWB South Zone)',
        photoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Village Water & Sanitation Committee (VWSC)'
      },
      {
        id: 'ASSET-KLR-004',
        name: 'Govt Higher Primary School Rooftop RWH & Filter',
        type: 'Rooftop RWH',
        capacityCuM: 450,
        installationYear: 2022,
        status: 'Functional',
        latitude: 13.1320,
        longitude: 78.1255,
        village: 'Palavanhalli',
        lastVerifiedDate: '2026-08-20',
        verificationSource: 'School Management Committee & Jal Jeevan Mission Audit',
        verifiedBy: 'Ramesh K. (Headmaster & Jal Doot)',
        photoUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'School Education Dept & Gram Panchayat'
      },
      {
        id: 'ASSET-KLR-005',
        name: 'Vokkaliga Farm Pond Cascade #4',
        type: 'Farm Pond',
        capacityCuM: 4200,
        installationYear: 2020,
        status: 'Dry/Non-Functional',
        latitude: 13.1388,
        longitude: 78.1189,
        village: 'Karisiddanahalli',
        lastVerifiedDate: '2026-09-12',
        verificationSource: 'Farmer Self-Reporting via Kisan Drone Survey',
        verifiedBy: 'Suresh Gowda (Lead Farmer)',
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Beneficiary Farmer Group'
      }
    ],
    tasks: [
      {
        id: 'TASK-KLR-01',
        watershedId: 'ws-kolar-palavanhalli',
        title: 'Emergency Desilting & Silt-Trap clearing for Palavanhalli Check Dam',
        category: 'Desiltation Campaign',
        priority: 'CRITICAL',
        responsibleAgency: 'Minor Irrigation Sub-Division, Kolar',
        assignedOfficer: 'S. Nagaraj (AEE)',
        deadline: '2026-10-15',
        status: 'IN_PROGRESS',
        evidenceSummary: 'Excavator deployed; 380 tonnes of clay silt extracted from upstream storage pool.',
        progressLogs: [
          {
            id: 'LOG-KLR-001',
            timestamp: '2026-09-28 10:45 IST',
            officerName: 'S. Nagaraj',
            role: 'Assistant Executive Engineer (Minor Irrigation)',
            note: 'Site possession handed to JCB excavation team. Upstream pool silt depth measured at 1.8m average.',
            stage: 'Excavation & Silt Removal',
            percentageComplete: 30,
            gpsCoordinates: { lat: 13.1412, lng: 78.1345 }
          },
          {
            id: 'LOG-KLR-002',
            timestamp: '2026-10-01 16:20 IST',
            officerName: 'Manjula R.',
            role: 'Gram Panchayat Secretary',
            note: 'Community joint inspection with 8 farmers. 380 tonnes extracted and carted to farmer fields as fertile topsoil.',
            stage: 'Excavation & Silt Removal',
            percentageComplete: 65,
            gpsCoordinates: { lat: 13.1415, lng: 78.1348 }
          }
        ]
      },
      {
        id: 'TASK-KLR-02',
        watershedId: 'ws-kolar-palavanhalli',
        title: 'Geotechnical inspection of breached spillway at Gollahalli Percolation Tank',
        category: 'Recharge Structure Verification',
        priority: 'CRITICAL',
        responsibleAgency: 'Zilla Panchayat Engineering Cell',
        assignedOfficer: 'Anand Kumar (Executive Engineer)',
        deadline: '2026-10-18',
        status: 'PENDING'
      },
      {
        id: 'TASK-KLR-03',
        watershedId: 'ws-kolar-palavanhalli',
        title: 'Borewell metering & Micro-irrigation shift audit for 120 commercial horticulture farmers',
        category: 'Irrigation Review',
        priority: 'HIGH',
        responsibleAgency: 'Dept. of Horticulture & Agriculture',
        assignedOfficer: 'Girija M. (Assistant Director)',
        deadline: '2026-10-30',
        status: 'IN_PROGRESS'
      },
      {
        id: 'TASK-KLR-04',
        watershedId: 'ws-kolar-palavanhalli',
        title: 'Installation of DWLR Telemetric Logger at Kundahalli Observation Well',
        category: 'Groundwater Monitoring',
        priority: 'MEDIUM',
        responsibleAgency: 'CGWB & Karnataka Ground Water Authority',
        assignedOfficer: 'Dr. V. Prasad (CGWB)',
        deadline: '2026-11-10',
        status: 'PENDING'
      }
    ],
    seasonalAudit: {
      beforeLabel: 'Pre-Monsoon 2025 Baseline',
      beforeTrend: 'Steady decline: -1.8m/yr; 15/24 assets abandoned/silted',
      beforeFunctionalAssets: 9,
      beforeStressScore: 88,
      afterLabel: 'Post-Remediation 2026 Projection',
      afterTrend: 'Stabilization expected if 8 key structures desilted and RWH functional',
      afterFunctionalAssets: 17,
      afterStressScore: 62,
      verifiedImprovementSummary: 'Modelled net capture capacity increases from 3.2 lakh CuM to 7.8 lakh CuM. Piezometric stabilization requires 2 continuous seasonal replenishment cycles.'
    }
  },
  {
    id: 'ws-anantapur-kalyandurg',
    name: 'Kalyandurg Micro-Watershed (Pennar Basin)',
    code: 'AP-ATP-W12-KLY',
    district: 'Anantapur',
    state: 'Andhra Pradesh',
    basin: 'Pennar River Basin',
    areaSqKm: 58.2,
    coordinates: {
      lat: 14.5512,
      lng: 77.1064,
      svgX: 372,
      svgY: 692,
    },
    currentStatus: 'stressed',
    stressScore: 71,
    dataConfidence: 'HIGH',
    activeAlertsCount: 2,
    groundwaterCurrentBgl: 42.8,
    groundwaterHistoricalAvgBgl: 27.4,
    groundwaterTrend1YrPercent: -11.2,
    groundwaterTrend5YrPercent: -28.6,
    rainfallCurrentSeasonMm: 388,
    rainfallNormalMm: 520,
    rainfallDeficitPercent: -25.4,
    totalRechargeAssets: 38,
    functionalAssetsCount: 19,
    needsRepairCount: 19,
    estimatedRecoveryWeeks: '5 to 8 weeks post episodic rain spell (>120mm)',
    recoveryModelConfidence: 'Medium',
    modelledInfiltrationRateMmDay: 3.9,
    soilType: 'Red Gravelly Soils overlying Peninsular Gneissic Complex',
    aquiferFormation: 'Weathered Granite-Gneiss with low specific yield (1.5-2.5%)',
    stressDecomposition: [
      {
        name: 'Deep Borewell Pumping for Groundnut/Sweet Lime',
        percentage: 36,
        description: 'Excessive agricultural extraction in dryland rain-shadow pocket.',
        source: 'AP Ground Water Dept & CGWB District Report',
        date: 'July 2026',
        method: 'Borewell Density Mapping (44 borewells/sq km)'
      },
      {
        name: 'Rain-Shadow Chronic Rainfall Deficit',
        percentage: 27,
        description: 'Semi-arid tract receives erratic episodic rain with high run-off loss.',
        source: 'India-WRIS / IMD Rain Gauge Station Kalyandurg',
        date: 'September 2026',
        method: 'Decadal Rain Gauge Isohyetal Analysis'
      },
      {
        name: 'Farm Pond Desiltation Backlog',
        percentage: 21,
        description: '19 traditional cheruvus (tanks) and recharge ponds choked with silt.',
        source: 'Andhra Pradesh Water Resources Information & Social Audit',
        date: 'August 2026',
        method: 'Village Panchayati Water Audit Register'
      },
      {
        name: 'Soil Hardpan & Low Natural Infiltration',
        percentage: 16,
        description: 'Hard calcrete layer limits gravity infiltration without engineered sub-surface shafts.',
        source: 'NRSC Soil & Land Degradation Atlas',
        date: 'June 2026',
        method: 'Geomorphological Soil Profiling'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 36.5, historicalAvgMeters: 25.5, rechargeRateMmYear: 38 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 32.1, historicalAvgMeters: 23.0, rechargeRateMmYear: 52 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 38.8, historicalAvgMeters: 26.2, rechargeRateMmYear: 34 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 34.5, historicalAvgMeters: 23.8, rechargeRateMmYear: 44 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 42.1, historicalAvgMeters: 26.9, rechargeRateMmYear: 29 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 38.3, historicalAvgMeters: 24.5, rechargeRateMmYear: 37 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 45.2, historicalAvgMeters: 27.4, rechargeRateMmYear: 26 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 42.8, historicalAvgMeters: 25.1, rechargeRateMmYear: 30 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 504, normalMm: 520, anomalyPercent: -3.1 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 462, normalMm: 520, anomalyPercent: -11.2 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 410, normalMm: 520, anomalyPercent: -21.2 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 388, normalMm: 520, anomalyPercent: -25.4 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 23862000,
        naturalInfiltrationCuM: 1431720,
        artificialRechargeCapturedCuM: 410000,
        estimatedIrrigationExtractionCuM: 3250000,
        domesticLivestockDrawCuM: 380000,
        netAquiferBalanceCuM: -1788280,
        observedGroundwaterShiftMeters: -1.8,
        recordedStatus: 'stressed'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 22581600,
        naturalInfiltrationCuM: 1354896,
        artificialRechargeCapturedCuM: 435000,
        estimatedIrrigationExtractionCuM: 3380000,
        domesticLivestockDrawCuM: 395000,
        netAquiferBalanceCuM: -1985104,
        observedGroundwaterShiftMeters: -1.6,
        recordedStatus: 'stressed'
      }
    ],
    satellite: {
      ndviCropHealth: 0.49,
      irrigatedAreaHectares: 2410,
      imperviousBuiltupGrowthPercent: 7.2,
      surfaceWaterBodySpreadSqKm: 1.12,
      potentialRechargeSuitability: 'Moderate',
      lastSatellitePass: '2026-09-22 (Cartosat-3 / Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-ATP-001',
        name: 'Kalyandurg Cheruvu Tank Feeder Channel',
        type: 'Percolation Tank',
        capacityCuM: 45000,
        installationYear: 2014,
        status: 'Partially Silted',
        latitude: 14.5580,
        longitude: 77.1120,
        village: 'Kalyandurg Rural',
        lastVerifiedDate: '2026-08-19',
        verificationSource: 'Field Inspection GPS App',
        verifiedBy: 'K. Venkataswamy (DEE, Water Resources Dept)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Irrigation & CAD Dept'
      },
      {
        id: 'ASSET-ATP-002',
        name: 'Mudigallu Cascade Check Dam #3',
        type: 'Check Dam',
        capacityCuM: 14200,
        installationYear: 2019,
        status: 'Functional',
        latitude: 14.5420,
        longitude: 77.0980,
        village: 'Mudigallu',
        lastVerifiedDate: '2026-09-08',
        verificationSource: 'Watershed Mission Audit',
        verifiedBy: 'Lakshmikanth (Watershed Development Officer)',
        photoUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Gram Panchayat Mudigallu'
      }
    ],
    tasks: [
      {
        id: 'TASK-ATP-01',
        watershedId: 'ws-anantapur-kalyandurg',
        title: 'Community Desilting Drive under MGNREGS for Kalyandurg Cheruvu',
        category: 'Desiltation Campaign',
        priority: 'HIGH',
        responsibleAgency: 'Panchayat Raj & Rural Development',
        assignedOfficer: 'R. Narayana (MPDO Kalyandurg)',
        deadline: '2026-10-25',
        status: 'IN_PROGRESS',
        evidenceSummary: '820 person-days mobilized; cleared silt from 1.2km inlet feeder channel.'
      }
    ],
    seasonalAudit: {
      beforeLabel: 'Post-Monsoon 2024 Baseline',
      beforeTrend: 'Rapid seasonal drawdown (-2.4m/season)',
      beforeFunctionalAssets: 14,
      beforeStressScore: 78,
      afterLabel: 'Current Status 2026',
      afterTrend: 'Drawdown slowed to -1.6m after 5 check dam repairs',
      afterFunctionalAssets: 19,
      afterStressScore: 71,
      verifiedImprovementSummary: 'Desiltation of 5 check dams restored 1.15 lakh CuM additional monsoon detention capacity.'
    }
  },
  {
    id: 'ws-latur-manjra',
    name: 'Manjra River Micro-Watershed (Latur Basin)',
    code: 'MH-LTR-W08-MAN',
    district: 'Latur',
    state: 'Maharashtra',
    basin: 'Godavari Basin (Manjra Sub-basin)',
    areaSqKm: 64.0,
    coordinates: {
      lat: 18.4088,
      lng: 76.5604,
      svgX: 366,
      svgY: 574,
    },
    currentStatus: 'watch',
    stressScore: 54,
    dataConfidence: 'HIGH',
    activeAlertsCount: 1,
    groundwaterCurrentBgl: 18.6,
    groundwaterHistoricalAvgBgl: 16.2,
    groundwaterTrend1YrPercent: 4.8, // improved recently due to desiltation!
    groundwaterTrend5YrPercent: -8.4,
    rainfallCurrentSeasonMm: 685,
    rainfallNormalMm: 720,
    rainfallDeficitPercent: -4.8,
    totalRechargeAssets: 46,
    functionalAssetsCount: 36,
    needsRepairCount: 10,
    estimatedRecoveryWeeks: '3 to 5 weeks (High resilience observed post Jalyukt Shivar desilting)',
    recoveryModelConfidence: 'High',
    modelledInfiltrationRateMmDay: 6.2,
    soilType: 'Deep Black Cotton Soil (Regur) overlying Deccan Basalt Trap',
    aquiferFormation: 'Weathered & Vesicular Deccan Basalt (Jointed Lava Flows)',
    stressDecomposition: [
      {
        name: 'Sugarcane & Cash Crop Irrigation Demand',
        percentage: 34,
        description: 'Sugarcane belt in riverbed floodplains continues heavy summer pumping.',
        source: 'Maharashtra Water Resources & Agriculture Dept',
        date: 'August 2026',
        method: 'Remote Sensing Crop Signature & Mill Crushing Returns'
      },
      {
        name: 'Monsoon Intra-Seasonal Dry Spells',
        percentage: 26,
        description: '3-week dry spell in July required protective irrigation from farm ponds.',
        source: 'IMD Pune & WRD Hydrology Project Maharashtra',
        date: 'September 2026',
        method: 'Rainfall Gap Index (RGI)'
      },
      {
        name: 'Sediment Influx in Nala Bunds',
        percentage: 22,
        description: 'Black cotton soil erosion deposits fine clay in check dam impoundments.',
        source: 'Ground Truth Verification by Jal Biradari & GSDA',
        date: 'July 2026',
        method: 'Bathymetric Silt Depth Probing'
      },
      {
        name: 'Urban Fringe Extraction (Latur City Outskirts)',
        percentage: 18,
        description: 'Commercial water tankers draw from peripheral agricultural borewells.',
        source: 'Latur Municipal Corporation & Police Vigilance Cell',
        date: 'August 2026',
        method: 'Tanker Permit & Piezometer Correlation'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 24.5, historicalAvgMeters: 17.5, rechargeRateMmYear: 45 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 18.2, historicalAvgMeters: 14.8, rechargeRateMmYear: 65 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 22.8, historicalAvgMeters: 17.2, rechargeRateMmYear: 48 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 17.4, historicalAvgMeters: 14.5, rechargeRateMmYear: 68 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 21.0, historicalAvgMeters: 16.8, rechargeRateMmYear: 52 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 16.5, historicalAvgMeters: 14.2, rechargeRateMmYear: 72 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 19.8, historicalAvgMeters: 16.5, rechargeRateMmYear: 58 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 18.6, historicalAvgMeters: 15.0, rechargeRateMmYear: 64 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 620, normalMm: 720, anomalyPercent: -13.8 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 745, normalMm: 720, anomalyPercent: +3.4 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 790, normalMm: 720, anomalyPercent: +9.7 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 685, normalMm: 720, anomalyPercent: -4.8 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 50560000,
        naturalInfiltrationCuM: 5056000,
        artificialRechargeCapturedCuM: 2180000,
        estimatedIrrigationExtractionCuM: 5400000,
        domesticLivestockDrawCuM: 850000,
        netAquiferBalanceCuM: +986000,
        observedGroundwaterShiftMeters: +1.2,
        recordedStatus: 'normal'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 43840000,
        naturalInfiltrationCuM: 4384000,
        artificialRechargeCapturedCuM: 1940000,
        estimatedIrrigationExtractionCuM: 5620000,
        domesticLivestockDrawCuM: 880000,
        netAquiferBalanceCuM: -176000,
        observedGroundwaterShiftMeters: -0.4,
        recordedStatus: 'watch'
      }
    ],
    satellite: {
      ndviCropHealth: 0.68,
      irrigatedAreaHectares: 3820,
      imperviousBuiltupGrowthPercent: 5.4,
      surfaceWaterBodySpreadSqKm: 3.42,
      potentialRechargeSuitability: 'Excellent',
      lastSatellitePass: '2026-09-28 (Sentinel-2, ISRO Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-LTR-001',
        name: 'Sai Barrage Desilted Channel',
        type: 'Check Dam',
        capacityCuM: 120000,
        installationYear: 2017,
        status: 'Functional',
        latitude: 18.4120,
        longitude: 76.5680,
        village: 'Sai',
        lastVerifiedDate: '2026-09-15',
        verificationSource: 'Jal Biradari Community Hydrology Audit',
        verifiedBy: 'Dr. Rajendra Singh Team & GSDA Officer',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Zilla Parishad & Jal Shakti Abhiyan Committee'
      }
    ],
    tasks: [
      {
        id: 'TASK-LTR-01',
        watershedId: 'ws-latur-manjra',
        title: 'Maintain silt traps on Sai upstream nala before post-monsoon runoff closes',
        category: 'Recharge Structure Verification',
        priority: 'MEDIUM',
        responsibleAgency: 'Gram Panchayat Sai',
        assignedOfficer: 'Balaji Patil (Gram Rozgar Sahayak)',
        deadline: '2026-10-22',
        status: 'IN_PROGRESS'
      }
    ],
    seasonalAudit: {
      beforeLabel: '2016 Historic Drought Peak',
      beforeTrend: 'Water train necessity; water table at 32m bgl; 0 functional dams',
      beforeFunctionalAssets: 4,
      beforeStressScore: 96,
      afterLabel: 'Post-Desiltation 2025-26',
      afterTrend: 'Water table held at 18.6m bgl; 36 functional structures; storage sustained',
      afterFunctionalAssets: 36,
      afterStressScore: 54,
      verifiedImprovementSummary: 'Deep riverbed widening (18km) and 36 check dam cascade created 2.8 crore CuM subsurface retention capacity.'
    }
  },
  {
    id: 'ws-jodhpur-luni',
    name: 'Osian-Luni Arid Micro-Watershed',
    code: 'RJ-JDH-W02-OSN',
    district: 'Jodhpur',
    state: 'Rajasthan',
    basin: 'Luni River (Ephemeral Basin)',
    areaSqKm: 82.4,
    coordinates: {
      lat: 26.2389,
      lng: 73.0243,
      svgX: 254,
      svgY: 378,
    },
    currentStatus: 'critical',
    stressScore: 91,
    dataConfidence: 'HIGH',
    activeAlertsCount: 4,
    groundwaterCurrentBgl: 68.4,
    groundwaterHistoricalAvgBgl: 44.0,
    groundwaterTrend1YrPercent: -22.5,
    groundwaterTrend5YrPercent: -48.2,
    rainfallCurrentSeasonMm: 194,
    rainfallNormalMm: 310,
    rainfallDeficitPercent: -37.4,
    totalRechargeAssets: 32,
    functionalAssetsCount: 8,
    needsRepairCount: 24,
    estimatedRecoveryWeeks: '14 to 20 weeks (High evaporation rate > 2200mm/yr; low porous sand)',
    recoveryModelConfidence: 'Low',
    modelledInfiltrationRateMmDay: 2.1,
    soilType: 'Aridisols (Desert Sand) overlying Sandstone & Malani Rhyolite Basement',
    aquiferFormation: 'Jodhpur Sandstone (Confined to Semi-Confined, Deep Saline Interface)',
    stressDecomposition: [
      {
        name: 'Deep Aquifer Over-Draft (Tube Well Depth > 180m)',
        percentage: 42,
        description: 'Borewells tapping fossil water in deep sandstone formations with zero active recharge.',
        source: 'CGWB Western Region State Assessment',
        date: 'June 2026',
        method: 'Isotopic Age Dating & Piezometer Logging'
      },
      {
        name: 'Arid Rainfall Deficit & Hyper-Evaporation',
        percentage: 26,
        description: 'Rainfall erratic; surface water evaporates before deep percolation occurs.',
        source: 'India-WRIS / IMD Jodhpur AWS',
        date: 'August 2026',
        method: 'Penman-Monteith Evapotranspiration Modelling'
      },
      {
        name: 'Traditional Tanka & Beri Maintenance Neglect',
        percentage: 20,
        description: 'Ancestral rainwater harvesting structures (tankas & khadins) silted or bypassed.',
        source: 'Panchayat Samiti Social Audit & AFPRO Ground Survey',
        date: 'July 2026',
        method: 'Village Heritage RWH Register'
      },
      {
        name: 'Salinity Ingress & Geogenic Fluoride Spike',
        percentage: 12,
        description: 'Falling water table draws brackish water into shallow agricultural wells.',
        source: 'Rajasthan Ground Water Dept Laboratory Reports',
        date: 'August 2026',
        method: 'Total Dissolved Solids (TDS) & Fluoride Colorimetry'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 58.2, historicalAvgMeters: 41.0, rechargeRateMmYear: 18 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 55.4, historicalAvgMeters: 39.5, rechargeRateMmYear: 22 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 61.8, historicalAvgMeters: 42.1, rechargeRateMmYear: 15 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 59.1, historicalAvgMeters: 40.5, rechargeRateMmYear: 19 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 65.4, historicalAvgMeters: 43.0, rechargeRateMmYear: 12 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 63.1, historicalAvgMeters: 41.5, rechargeRateMmYear: 14 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 71.0, historicalAvgMeters: 44.0, rechargeRateMmYear: 10 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 68.4, historicalAvgMeters: 42.2, rechargeRateMmYear: 12 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 285, normalMm: 310, anomalyPercent: -8.0 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 240, normalMm: 310, anomalyPercent: -22.5 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 215, normalMm: 310, anomalyPercent: -30.6 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 194, normalMm: 310, anomalyPercent: -37.4 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 17716000,
        naturalInfiltrationCuM: 708640,
        artificialRechargeCapturedCuM: 142000,
        estimatedIrrigationExtractionCuM: 2890000,
        domesticLivestockDrawCuM: 490000,
        netAquiferBalanceCuM: -2529360,
        observedGroundwaterShiftMeters: -2.3,
        recordedStatus: 'critical'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 15985600,
        naturalInfiltrationCuM: 639424,
        artificialRechargeCapturedCuM: 128000,
        estimatedIrrigationExtractionCuM: 2980000,
        domesticLivestockDrawCuM: 510000,
        netAquiferBalanceCuM: -2722576,
        observedGroundwaterShiftMeters: -2.7,
        recordedStatus: 'critical'
      }
    ],
    satellite: {
      ndviCropHealth: 0.29,
      irrigatedAreaHectares: 1240,
      imperviousBuiltupGrowthPercent: 8.5,
      surfaceWaterBodySpreadSqKm: 0.22,
      potentialRechargeSuitability: 'Poor',
      lastSatellitePass: '2026-09-25 (Sentinel-2 MSI, NRSC)'
    },
    assets: [
      {
        id: 'ASSET-JDH-001',
        name: 'Osian Ancient Khadin Water Harvesting Bund',
        type: 'Percolation Tank',
        capacityCuM: 28000,
        installationYear: 1998,
        status: 'Critically Damaged',
        latitude: 26.2450,
        longitude: 73.0310,
        village: 'Osian',
        lastVerifiedDate: '2026-07-18',
        verificationSource: 'Panchayat Samiti Technical Report',
        verifiedBy: 'M. P. Bishnoi (Assistant Engineer)',
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Gram Panchayat Osian'
      }
    ],
    tasks: [
      {
        id: 'TASK-JDH-01',
        watershedId: 'ws-jodhpur-luni',
        title: 'Emergency revival of 24 traditional Khadin bunds before winter rains',
        category: 'Recharge Structure Verification',
        priority: 'CRITICAL',
        responsibleAgency: 'Watershed Development & Soil Conservation, Jodhpur',
        assignedOfficer: 'R. K. Rathore (Superintending Engineer)',
        deadline: '2026-11-05',
        status: 'PENDING'
      }
    ],
    seasonalAudit: {
      beforeLabel: 'Pre-Monsoon 2024',
      beforeTrend: 'Depletion rate -3.2m/year; 8/32 assets functional',
      beforeFunctionalAssets: 8,
      beforeStressScore: 94,
      afterLabel: 'Current Status 2026',
      afterTrend: 'Depletion rate -2.7m/year; critical overdraft persists',
      afterFunctionalAssets: 8,
      afterStressScore: 91,
      verifiedImprovementSummary: 'No net improvement recorded due to unaddressed bund breaches and rainfall deficit.'
    }
  },
  {
    id: 'ws-bundelkhand-mahoba',
    name: 'Mahoba-Chhatarpur Granitic Micro-Watershed',
    code: 'UP-MHB-W05-CHT',
    district: 'Mahoba',
    state: 'Uttar Pradesh',
    basin: 'Ken-Betwa Inter-Basin',
    areaSqKm: 52.8,
    coordinates: {
      lat: 25.2917,
      lng: 79.8722,
      svgX: 420,
      svgY: 382,
    },
    currentStatus: 'stressed',
    stressScore: 78,
    dataConfidence: 'HIGH',
    activeAlertsCount: 2,
    groundwaterCurrentBgl: 29.4,
    groundwaterHistoricalAvgBgl: 18.2,
    groundwaterTrend1YrPercent: -9.8,
    groundwaterTrend5YrPercent: -24.0,
    rainfallCurrentSeasonMm: 580,
    rainfallNormalMm: 850,
    rainfallDeficitPercent: -31.7,
    totalRechargeAssets: 42,
    functionalAssetsCount: 16,
    needsRepairCount: 26,
    estimatedRecoveryWeeks: '6 to 9 weeks post monsoon runoff accumulation',
    recoveryModelConfidence: 'Medium',
    modelledInfiltrationRateMmDay: 3.5,
    soilType: 'Bundelkhand Granite Soils (Rakar & Parwa) with low water retention',
    aquiferFormation: 'Archean Bundelkhand Granite (Impermeable Basement with Secondary Fractures)',
    stressDecomposition: [
      {
        name: 'Historic Chandela Tank Siltation & Encroachment',
        percentage: 35,
        description: 'Ancient interconnected tank cascades silted up and feeder canals obstructed by road construction.',
        source: 'Bundelkhand Jal Sahayak & CGWB Northern Region',
        date: 'July 2026',
        method: 'Drone Topographic Survey & Historical Revenue Maps'
      },
      {
        name: 'Monsoon Rainfall Deficit (-31.7%)',
        percentage: 28,
        description: 'Consecutive dry years led to failure of surface detention ponds.',
        source: 'IMD Lucknow & NWIC Hydro-met Network',
        date: 'August 2026',
        method: 'Standardized Precipitation Index (SPI)'
      },
      {
        name: 'Borewell Drilling into Compact Granite',
        percentage: 22,
        description: 'Unregulated drilling beyond 120m into dry fractured granite zones.',
        source: 'UP Ground Water Dept District Registration Cell',
        date: 'June 2026',
        method: 'Rig Registration & Resistivity Survey Correlation'
      },
      {
        name: 'Evaporation Losses from Shallow Depressions',
        percentage: 15,
        description: 'High summer heat causes 35-40% direct water loss from shallow open farm ponds.',
        source: 'IIT Roorkee Water Resources Dept Field Station',
        date: 'August 2026',
        method: 'Class-A Evaporation Pan Calibration'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 22.5, historicalAvgMeters: 17.0, rechargeRateMmYear: 40 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 18.1, historicalAvgMeters: 14.5, rechargeRateMmYear: 55 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 24.8, historicalAvgMeters: 17.5, rechargeRateMmYear: 35 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 20.4, historicalAvgMeters: 15.0, rechargeRateMmYear: 46 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 28.2, historicalAvgMeters: 18.0, rechargeRateMmYear: 30 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 23.5, historicalAvgMeters: 15.4, rechargeRateMmYear: 38 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 32.1, historicalAvgMeters: 18.2, rechargeRateMmYear: 26 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 29.4, historicalAvgMeters: 16.0, rechargeRateMmYear: 31 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 790, normalMm: 850, anomalyPercent: -7.0 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 710, normalMm: 850, anomalyPercent: -16.4 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 640, normalMm: 850, anomalyPercent: -24.7 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 580, normalMm: 850, anomalyPercent: -31.7 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 33792000,
        naturalInfiltrationCuM: 2703360,
        artificialRechargeCapturedCuM: 620000,
        estimatedIrrigationExtractionCuM: 4210000,
        domesticLivestockDrawCuM: 520000,
        netAquiferBalanceCuM: -1406640,
        observedGroundwaterShiftMeters: -1.7,
        recordedStatus: 'stressed'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 30624000,
        naturalInfiltrationCuM: 2449920,
        artificialRechargeCapturedCuM: 580000,
        estimatedIrrigationExtractionCuM: 4350000,
        domesticLivestockDrawCuM: 540000,
        netAquiferBalanceCuM: -1860080,
        observedGroundwaterShiftMeters: -1.9,
        recordedStatus: 'stressed'
      }
    ],
    satellite: {
      ndviCropHealth: 0.41,
      irrigatedAreaHectares: 2180,
      imperviousBuiltupGrowthPercent: 6.8,
      surfaceWaterBodySpreadSqKm: 1.45,
      potentialRechargeSuitability: 'Moderate',
      lastSatellitePass: '2026-09-20 (Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-MHB-001',
        name: 'Madan Sagar Historic Chandela Tank',
        type: 'Percolation Tank',
        capacityCuM: 85000,
        installationYear: 1952,
        status: 'Partially Silted',
        latitude: 25.2980,
        longitude: 79.8810,
        village: 'Mahoba Urban Outskirts',
        lastVerifiedDate: '2026-08-04',
        verificationSource: 'UP Irrigation & Water Resources Dept',
        verifiedBy: 'Sanjay Srivastava (Executive Engineer)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Nagar Palika Parishad & Irrigation Dept'
      }
    ],
    tasks: [
      {
        id: 'TASK-MHB-01',
        watershedId: 'ws-bundelkhand-mahoba',
        title: 'Revitalize Madan Sagar feeder channel & clear 3 check dams upstream',
        category: 'Desiltation Campaign',
        priority: 'CRITICAL',
        responsibleAgency: 'UP Minor Irrigation Dept',
        assignedOfficer: 'R. P. Singh (Assistant Engineer)',
        deadline: '2026-10-28',
        status: 'IN_PROGRESS'
      }
    ],
    seasonalAudit: {
      beforeLabel: 'Post-Monsoon 2024',
      beforeTrend: 'Water level at 20.4m bgl; 12 functional structures',
      beforeFunctionalAssets: 12,
      beforeStressScore: 82,
      afterLabel: 'Current Status 2026',
      afterTrend: 'Water level dropped to 29.4m bgl due to rainfall deficit; 16 functional',
      afterFunctionalAssets: 16,
      afterStressScore: 78,
      verifiedImprovementSummary: '4 check dams repaired prevented acute village well failure during heatwave.'
    }
  },
  {
    id: 'ws-coimbatore-noyyal',
    name: 'Noyyal Basin Micro-Watershed (Sulur-Coimbatore)',
    code: 'TN-CBE-W07-SLR',
    district: 'Coimbatore',
    state: 'Tamil Nadu',
    basin: 'Cauvery River Basin (Noyyal Sub-basin)',
    areaSqKm: 48.0,
    coordinates: {
      lat: 11.0168,
      lng: 77.0125,
      svgX: 362,
      svgY: 785,
    },
    currentStatus: 'normal',
    stressScore: 38,
    dataConfidence: 'HIGH',
    activeAlertsCount: 0,
    groundwaterCurrentBgl: 14.2,
    groundwaterHistoricalAvgBgl: 18.5,
    groundwaterTrend1YrPercent: +12.4, // improving!
    groundwaterTrend5YrPercent: +18.2,
    rainfallCurrentSeasonMm: 690,
    rainfallNormalMm: 620,
    rainfallDeficitPercent: +11.3,
    totalRechargeAssets: 54,
    functionalAssetsCount: 48,
    needsRepairCount: 6,
    estimatedRecoveryWeeks: '1 to 3 weeks (High saturation & functional check dam cascade)',
    recoveryModelConfidence: 'High',
    modelledInfiltrationRateMmDay: 7.8,
    soilType: 'Red Soil & Calcareous Alluvium over Hornblende-Biotite Gneiss',
    aquiferFormation: 'Weathered Gneissic Hard Rock with Deep Induced Fracture Network',
    stressDecomposition: [
      {
        name: 'Industrial Textile Wastewater Dilution Pressure',
        percentage: 32,
        description: 'Treated effluent recycling monitoring and TDS management in Noyyal channel.',
        source: 'TN Pollution Control Board (TNPCB) & WRIS Water Quality',
        date: 'August 2026',
        method: 'Continuous Online Effluent Monitoring System (COEMS)'
      },
      {
        name: 'Peri-Urban Borewell Pumping for Commercial Establishments',
        percentage: 28,
        description: 'High commercial demand along NH-544 corridor.',
        source: 'State Ground & Surface Water Resources Data Centre, Chennai',
        date: 'July 2026',
        method: 'Commercial Groundwater Extraction Metering'
      },
      {
        name: 'Maintenance of Silt Traps along Noyyal Canals',
        percentage: 22,
        description: '6 feeder check dams require minor desilting post northeast monsoon.',
        source: 'Siruthuli NGO & PWD Water Resources Dept',
        date: 'September 2026',
        method: 'Community Jal Yatra Field Audit'
      },
      {
        name: 'Seasonal Evaporation Loss from Open Percolation Ponds',
        percentage: 18,
        description: 'Open tanks face 5-8mm/day summer pan evaporation loss.',
        source: 'TNAU Hydrology Research Station, Coimbatore',
        date: 'August 2026',
        method: 'Meteorological Tower Energy Balance'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 21.2, historicalAvgMeters: 19.5, rechargeRateMmYear: 62 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 16.4, historicalAvgMeters: 17.2, rechargeRateMmYear: 84 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 18.5, historicalAvgMeters: 19.0, rechargeRateMmYear: 68 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 14.8, historicalAvgMeters: 16.8, rechargeRateMmYear: 92 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 16.9, historicalAvgMeters: 18.5, rechargeRateMmYear: 74 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 13.5, historicalAvgMeters: 16.2, rechargeRateMmYear: 98 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 15.8, historicalAvgMeters: 18.5, rechargeRateMmYear: 78 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 14.2, historicalAvgMeters: 16.0, rechargeRateMmYear: 94 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 580, normalMm: 620, anomalyPercent: -6.4 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 640, normalMm: 620, anomalyPercent: +3.2 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 710, normalMm: 620, anomalyPercent: +14.5 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 690, normalMm: 620, anomalyPercent: +11.3 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 34080000,
        naturalInfiltrationCuM: 3748800,
        artificialRechargeCapturedCuM: 2450000,
        estimatedIrrigationExtractionCuM: 4100000,
        domesticLivestockDrawCuM: 1100000,
        netAquiferBalanceCuM: +998800,
        observedGroundwaterShiftMeters: +1.3,
        recordedStatus: 'normal'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 33120000,
        naturalInfiltrationCuM: 3643200,
        artificialRechargeCapturedCuM: 2380000,
        estimatedIrrigationExtractionCuM: 4180000,
        domesticLivestockDrawCuM: 1120000,
        netAquiferBalanceCuM: +723200,
        observedGroundwaterShiftMeters: +0.7,
        recordedStatus: 'normal'
      }
    ],
    satellite: {
      ndviCropHealth: 0.72,
      irrigatedAreaHectares: 2940,
      imperviousBuiltupGrowthPercent: 14.2,
      surfaceWaterBodySpreadSqKm: 2.85,
      potentialRechargeSuitability: 'Excellent',
      lastSatellitePass: '2026-09-26 (Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-CBE-001',
        name: 'Sulur Big Tank Rejuvenation Weir',
        type: 'Percolation Tank',
        capacityCuM: 92000,
        installationYear: 2019,
        status: 'Functional',
        latitude: 11.0250,
        longitude: 77.0210,
        village: 'Sulur',
        lastVerifiedDate: '2026-09-18',
        verificationSource: 'Siruthuli NGO & TN PWD Joint Verification',
        verifiedBy: 'S. Shanmugam (Executive Engineer, WRD)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'PWD Water Resources Dept & Sulur Town Panchayat'
      }
    ],
    tasks: [
      {
        id: 'TASK-CBE-01',
        watershedId: 'ws-coimbatore-noyyal',
        title: 'Routine silt trap cleaning at Sulur Inlet Sluice #2',
        category: 'Recharge Structure Verification',
        priority: 'MEDIUM',
        responsibleAgency: 'Sulur Town Panchayat',
        assignedOfficer: 'Murugan K. (Sanitary Inspector)',
        deadline: '2026-10-31',
        status: 'IN_PROGRESS'
      }
    ],
    seasonalAudit: {
      beforeLabel: '2019 Baseline Before Rejuvenation',
      beforeTrend: 'Water level at 24m bgl; 18 functional check dams',
      beforeFunctionalAssets: 18,
      beforeStressScore: 74,
      afterLabel: '2026 Rejuvenated Status',
      afterTrend: 'Water level recovered to 14.2m bgl; 48 functional structures',
      afterFunctionalAssets: 48,
      afterStressScore: 38,
      verifiedImprovementSummary: 'Community desiltation of 32 cascaded ponds created permanent 4.2 million CuM storage surplus.'
    }
  },
  {
    id: 'ws-delhi-najafgarh',
    name: 'Najafgarh-Dwarka Urban Micro-Watershed',
    code: 'DL-SWD-W01-NJF',
    district: 'South West Delhi',
    state: 'Delhi (NCT)',
    basin: 'Yamuna River Sub-basin',
    areaSqKm: 34.5,
    coordinates: {
      lat: 28.6139,
      lng: 77.0423,
      svgX: 350,
      svgY: 282,
    },
    currentStatus: 'critical',
    stressScore: 89,
    dataConfidence: 'HIGH',
    activeAlertsCount: 3,
    groundwaterCurrentBgl: 39.8,
    groundwaterHistoricalAvgBgl: 16.5,
    groundwaterTrend1YrPercent: -14.6,
    groundwaterTrend5YrPercent: -39.4,
    rainfallCurrentSeasonMm: 520,
    rainfallNormalMm: 640,
    rainfallDeficitPercent: -18.7,
    totalRechargeAssets: 68,
    functionalAssetsCount: 22,
    needsRepairCount: 46,
    estimatedRecoveryWeeks: '8 to 12 weeks post stormwater filter retrofits',
    recoveryModelConfidence: 'Medium',
    modelledInfiltrationRateMmDay: 3.2,
    soilType: 'Older Alluvium (Sandy Silt to Clayey Silt) with Quartzite Ridge Flanks',
    aquiferFormation: 'Quaternary Alluvium overlying Alwar Quartzite (Delhi Ridge System)',
    stressDecomposition: [
      {
        name: 'Impervious Concrete Surface Sealing',
        percentage: 40,
        description: '78% of watershed area covered by roads, paved colonies, and flyovers preventing natural infiltration.',
        source: 'NRSC Bhuvan Urban Atlas & DDA Master Plan 2041',
        date: 'July 2026',
        method: 'Impervious Surface Fraction (ISF) High-Res Classification'
      },
      {
        name: 'Illegal Tube Well Extraction for High-Rise Societies',
        percentage: 31,
        description: 'Over 400 residential societies draw groundwater due to municipal pipeline deficit.',
        source: 'Delhi Jal Board (DJB) Enforcement Directorate',
        date: 'August 2026',
        method: 'Power Consumption Anomaly Detection on Dedicated Tubewell Lines'
      },
      {
        name: 'Choked Stormwater Inlets & Filter Failure',
        percentage: 18,
        description: '46 roadside injection pits choked with road dust, plastics, and bitumen runoff.',
        source: 'MCD & DJB Joint Stormwater Audit',
        date: 'August 2026',
        method: 'Physical Inspection of Perforated Well Casings'
      },
      {
        name: 'Stormwater Diversion into Sewage Drains',
        percentage: 11,
        description: 'Rain runoff mixed with municipal greywater bypasses potential recharge shafts.',
        source: 'Central Ground Water Authority (CGWA) Inspection Report',
        date: 'June 2026',
        method: 'Chemical COD/BOD Tracing in Stormwater Canals'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 32.5, historicalAvgMeters: 15.0, rechargeRateMmYear: 24 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 29.8, historicalAvgMeters: 13.5, rechargeRateMmYear: 32 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 35.1, historicalAvgMeters: 15.5, rechargeRateMmYear: 20 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 32.4, historicalAvgMeters: 14.0, rechargeRateMmYear: 28 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 38.0, historicalAvgMeters: 16.0, rechargeRateMmYear: 18 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 35.6, historicalAvgMeters: 14.5, rechargeRateMmYear: 24 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 42.2, historicalAvgMeters: 16.5, rechargeRateMmYear: 15 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 39.8, historicalAvgMeters: 15.0, rechargeRateMmYear: 20 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 680, normalMm: 640, anomalyPercent: +6.2 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 590, normalMm: 640, anomalyPercent: -7.8 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 560, normalMm: 640, anomalyPercent: -12.5 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 520, normalMm: 640, anomalyPercent: -18.7 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 19320000,
        naturalInfiltrationCuM: 772800, // heavily suppressed by concrete
        artificialRechargeCapturedCuM: 310000,
        estimatedIrrigationExtractionCuM: 420000,
        domesticLivestockDrawCuM: 3850000, // intense urban draw
        netAquiferBalanceCuM: -3187200,
        observedGroundwaterShiftMeters: -2.4,
        recordedStatus: 'critical'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 17940000,
        naturalInfiltrationCuM: 717600,
        artificialRechargeCapturedCuM: 340000,
        estimatedIrrigationExtractionCuM: 410000,
        domesticLivestockDrawCuM: 3950000,
        netAquiferBalanceCuM: -3302400,
        observedGroundwaterShiftMeters: -2.2,
        recordedStatus: 'critical'
      }
    ],
    satellite: {
      ndviCropHealth: 0.32,
      irrigatedAreaHectares: 340,
      imperviousBuiltupGrowthPercent: 24.6,
      surfaceWaterBodySpreadSqKm: 0.48,
      potentialRechargeSuitability: 'Moderate',
      lastSatellitePass: '2026-09-27 (Cartosat-3 / Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-DL-001',
        name: 'Sector 23 Dwarka Stormwater Recharge Shaft System',
        type: 'Recharge Well',
        capacityCuM: 12500,
        installationYear: 2020,
        status: 'Partially Silted',
        latitude: 28.5820,
        longitude: 77.0390,
        village: 'Dwarka Sector 23',
        lastVerifiedDate: '2026-08-25',
        verificationSource: 'DJB Rainwater Harvesting Cell Field Inspection',
        verifiedBy: 'Alok Saxena (Executive Engineer, DJB)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Delhi Jal Board (DJB)'
      },
      {
        id: 'ASSET-DL-002',
        name: 'Najafgarh Jheel Wetland Wetland Silt Trap Basin',
        type: 'Silt Trap',
        capacityCuM: 48000,
        installationYear: 2022,
        status: 'Functional',
        latitude: 28.5200,
        longitude: 76.9600,
        village: 'Kanganheri',
        lastVerifiedDate: '2026-09-10',
        verificationSource: 'Delhi Wetland Authority & INTACH Survey',
        verifiedBy: 'Dr. Manu Bhatnagar (Principal Director, Natural Heritage)',
        photoUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Delhi Wetland Authority & Irrigation & Flood Control Dept'
      }
    ],
    tasks: [
      {
        id: 'TASK-DL-01',
        watershedId: 'ws-delhi-najafgarh',
        title: 'Retrofit dual-chamber geotextile silt filters on 46 Dwarka injection wells',
        category: 'Recharge Structure Verification',
        priority: 'CRITICAL',
        responsibleAgency: 'Delhi Jal Board & DDA',
        assignedOfficer: 'Alok Saxena (DJB)',
        deadline: '2026-10-20',
        status: 'IN_PROGRESS',
        evidenceSummary: 'Contractor mobilized; 14 chambers cleaned and replaced with basalt gravel media.'
      }
    ],
    seasonalAudit: {
      beforeLabel: '2023 Pre-Monsoon Baseline',
      beforeTrend: 'Falling by 2.6m/yr; deep cone of depression under Dwarka sub-city',
      beforeFunctionalAssets: 16,
      beforeStressScore: 92,
      afterLabel: 'Current Status 2026',
      afterTrend: 'Decline rate held at 2.2m/yr; stormwater injection trials active',
      afterFunctionalAssets: 22,
      afterStressScore: 89,
      verifiedImprovementSummary: '6 newly desilted stormwater shafts injected 1.4 lakh CuM urban runoff during July rains.'
    }
  },
  {
    id: 'ws-bathinda-malwa',
    name: 'Bathinda South-West Micro-Watershed',
    code: 'PB-BTI-W03-MLW',
    district: 'Bathinda',
    state: 'Punjab',
    basin: 'Indus Basin (Ghaggar-Sutlej Interfluve)',
    areaSqKm: 76.0,
    coordinates: {
      lat: 30.2110,
      lng: 74.9455,
      svgX: 312,
      svgY: 224,
    },
    currentStatus: 'critical',
    stressScore: 95,
    dataConfidence: 'HIGH',
    activeAlertsCount: 5,
    groundwaterCurrentBgl: 36.2,
    groundwaterHistoricalAvgBgl: 12.0,
    groundwaterTrend1YrPercent: -26.0,
    groundwaterTrend5YrPercent: -62.0,
    rainfallCurrentSeasonMm: 310,
    rainfallNormalMm: 440,
    rainfallDeficitPercent: -29.5,
    totalRechargeAssets: 28,
    functionalAssetsCount: 6,
    needsRepairCount: 22,
    estimatedRecoveryWeeks: '16 to 24 weeks (Requires major crop-diversification away from summer paddy)',
    recoveryModelConfidence: 'Medium',
    modelledInfiltrationRateMmDay: 2.8,
    soilType: 'Light Textured Alluvium (Sandy Loam) with Clay Intercalations',
    aquiferFormation: 'Quaternary Deep Alluvial Multi-layered Aquifer System',
    stressDecomposition: [
      {
        name: 'Intensive Summer Paddy Tube Well Overdraft',
        percentage: 52,
        description: 'Free agricultural electricity and non-basmati paddy cultivation driving stage of extraction to 260%.',
        source: 'Punjab Water Resources Dept & CGWB North-Western Region',
        date: 'July 2026',
        method: 'Submersible Pump Census & Energy Feeder Consumption Metrics'
      },
      {
        name: 'Monsoon Deficit in Semi-Arid Malwa Belt',
        percentage: 22,
        description: 'Below-average monsoon rains unable to replenish regional cone of depression.',
        source: 'India-WRIS / IMD Bathinda Observatory',
        date: 'August 2026',
        method: 'Panchayat Level Automatic Rain Gauge Data'
      },
      {
        name: 'Direct Drainage of Silt-laden Canal Water into Pits',
        percentage: 16,
        description: 'Recharge wells clogged by heavy agricultural runoff without sand/gravel gravel pack maintenance.',
        source: 'PAU Ludhiana Water Engineering Field Station',
        date: 'July 2026',
        method: 'Core Sample Permeability Testing'
      },
      {
        name: 'Uranium & Arsenic Chemical Mobilization',
        percentage: 10,
        description: 'Severe deep overdraft oxidizing aquifer matrix, mobilizing deep trace minerals.',
        source: 'Bhabha Atomic Research Centre & CGWB Hydrochemical Survey',
        date: 'May 2026',
        method: 'ICP-MS Mass Spectrometry'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 28.5, historicalAvgMeters: 10.5, rechargeRateMmYear: 16 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 25.8, historicalAvgMeters: 9.8, rechargeRateMmYear: 22 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 31.2, historicalAvgMeters: 11.0, rechargeRateMmYear: 14 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 28.6, historicalAvgMeters: 10.2, rechargeRateMmYear: 18 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 34.8, historicalAvgMeters: 11.5, rechargeRateMmYear: 12 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 32.2, historicalAvgMeters: 10.8, rechargeRateMmYear: 15 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 38.9, historicalAvgMeters: 12.0, rechargeRateMmYear: 9 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 36.2, historicalAvgMeters: 11.2, rechargeRateMmYear: 11 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 395, normalMm: 440, anomalyPercent: -10.2 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 360, normalMm: 440, anomalyPercent: -18.2 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 330, normalMm: 440, anomalyPercent: -25.0 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 310, normalMm: 440, anomalyPercent: -29.5 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 25080000,
        naturalInfiltrationCuM: 1755600,
        artificialRechargeCapturedCuM: 180000,
        estimatedIrrigationExtractionCuM: 6850000,
        domesticLivestockDrawCuM: 620000,
        netAquiferBalanceCuM: -5534400,
        observedGroundwaterShiftMeters: -3.6,
        recordedStatus: 'critical'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 23560000,
        naturalInfiltrationCuM: 1649200,
        artificialRechargeCapturedCuM: 195000,
        estimatedIrrigationExtractionCuM: 7120000,
        domesticLivestockDrawCuM: 640000,
        netAquiferBalanceCuM: -5915800,
        observedGroundwaterShiftMeters: -4.1,
        recordedStatus: 'critical'
      }
    ],
    satellite: {
      ndviCropHealth: 0.62,
      irrigatedAreaHectares: 6820,
      imperviousBuiltupGrowthPercent: 6.2,
      surfaceWaterBodySpreadSqKm: 0.35,
      potentialRechargeSuitability: 'Moderate',
      lastSatellitePass: '2026-09-24 (Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-PB-001',
        name: 'Kotshamir Canal Tail Injection Well',
        type: 'Recharge Well',
        capacityCuM: 8400,
        installationYear: 2021,
        status: 'Dry/Non-Functional',
        latitude: 30.1980,
        longitude: 74.9620,
        village: 'Kotshamir',
        lastVerifiedDate: '2026-08-11',
        verificationSource: 'Punjab Water Resources Dept Field Verification',
        verifiedBy: 'Harpreet Singh (Sub-Divisional Officer)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'Punjab Water Regulation and Development Authority'
      }
    ],
    tasks: [
      {
        id: 'TASK-PB-01',
        watershedId: 'ws-bathinda-malwa',
        title: 'Urgent retrofitting of high-flow filtration pits on 22 non-functional agricultural recharge wells',
        category: 'Recharge Structure Verification',
        priority: 'CRITICAL',
        responsibleAgency: 'Punjab Water Resources Dept & PAU Extension',
        assignedOfficer: 'Harpreet Singh (SDO)',
        deadline: '2026-10-25',
        status: 'PENDING'
      }
    ],
    seasonalAudit: {
      beforeLabel: '2022 Baseline',
      beforeTrend: 'Water level at 22m bgl; 10 functional structures',
      beforeFunctionalAssets: 10,
      beforeStressScore: 89,
      afterLabel: 'Current Status 2026',
      afterTrend: 'Water level reached 36.2m bgl; critical stage of extraction',
      afterFunctionalAssets: 6,
      afterStressScore: 95,
      verifiedImprovementSummary: 'Extreme depletion ongoing; urgent DSR (Direct Seeded Rice) and canal-water artificial recharge required.'
    }
  },
  {
    id: 'ws-saurashtra-rajkot',
    name: 'Aji River Basin Micro-Watershed (Rajkot)',
    code: 'GJ-RJK-W06-AJI',
    district: 'Rajkot',
    state: 'Gujarat',
    basin: 'Aji River Basin',
    areaSqKm: 56.4,
    coordinates: {
      lat: 22.3039,
      lng: 70.8022,
      svgX: 232,
      svgY: 462,
    },
    currentStatus: 'watch',
    stressScore: 48,
    dataConfidence: 'HIGH',
    activeAlertsCount: 1,
    groundwaterCurrentBgl: 16.8,
    groundwaterHistoricalAvgBgl: 22.4,
    groundwaterTrend1YrPercent: +8.2, // benefited by Sardar Patel Check Dam scheme
    groundwaterTrend5YrPercent: +14.5,
    rainfallCurrentSeasonMm: 620,
    rainfallNormalMm: 580,
    rainfallDeficitPercent: +6.9,
    totalRechargeAssets: 62,
    functionalAssetsCount: 49,
    needsRepairCount: 13,
    estimatedRecoveryWeeks: '2 to 4 weeks (Check dam cascade actively holding runoff)',
    recoveryModelConfidence: 'High',
    modelledInfiltrationRateMmDay: 5.4,
    soilType: 'Medium Black Soils & Coastal Saline Margins over Deccan Trap Basalt',
    aquiferFormation: 'Deccan Trap Weathered/Vesicular Basalt & Fractured Joint System',
    stressDecomposition: [
      {
        name: 'Cotton & Groundnut Micro-Irrigation Demand',
        percentage: 36,
        description: 'Extensive drip irrigation installed, but summer dry season still relies on open dug wells.',
        source: 'GGRC (Gujarat Green Revolution Company) & Dept of Agriculture',
        date: 'July 2026',
        method: 'Micro-Irrigation Subsidy Database & GIS Verification'
      },
      {
        name: 'Siltation of Check Dam Upstream Basins',
        percentage: 30,
        description: '13 check dams in upstream tributaries require desiltation under Sujalam Sufalam scheme.',
        source: 'Gujarat Water Resources Development Corporation (GWRDC)',
        date: 'August 2026',
        method: 'Annual Desiltation Audit Registry'
      },
      {
        name: 'Salinity Ingress in Downstream Coastal Reach',
        percentage: 20,
        description: 'Falling sweet water hydraulic gradient allows seawater intrusion along estuarine reaches.',
        source: 'Central Ground Water Board West Central Region',
        date: 'June 2026',
        method: 'Electrical Resistivity Tomography (ERT) & Chloride Profiling'
      },
      {
        name: 'Peri-Urban Industrial Extraction',
        percentage: 14,
        description: 'Engineering and foundry clusters drawing from private tubewells.',
        source: 'Rajkot Municipal Corporation & GIDC',
        date: 'August 2026',
        method: 'Industrial Water Audit Reports'
      }
    ],
    groundwaterHistory: [
      { year: 2023, season: 'Pre-Monsoon', depthMetersBgl: 24.2, historicalAvgMeters: 23.5, rechargeRateMmYear: 48 },
      { year: 2023, season: 'Post-Monsoon', depthMetersBgl: 17.5, historicalAvgMeters: 19.8, rechargeRateMmYear: 72 },
      { year: 2024, season: 'Pre-Monsoon', depthMetersBgl: 22.1, historicalAvgMeters: 23.0, rechargeRateMmYear: 52 },
      { year: 2024, season: 'Post-Monsoon', depthMetersBgl: 16.2, historicalAvgMeters: 19.2, rechargeRateMmYear: 78 },
      { year: 2025, season: 'Pre-Monsoon', depthMetersBgl: 20.8, historicalAvgMeters: 22.8, rechargeRateMmYear: 56 },
      { year: 2025, season: 'Post-Monsoon', depthMetersBgl: 15.4, historicalAvgMeters: 18.8, rechargeRateMmYear: 82 },
      { year: 2026, season: 'Pre-Monsoon', depthMetersBgl: 19.2, historicalAvgMeters: 22.4, rechargeRateMmYear: 60 },
      { year: 2026, season: 'Post-Monsoon', depthMetersBgl: 16.8, historicalAvgMeters: 18.2, rechargeRateMmYear: 76 }
    ],
    rainfallHistory: [
      { year: 2023, season: 'Monsoon Total', recordedMm: 540, normalMm: 580, anomalyPercent: -6.9 },
      { year: 2024, season: 'Monsoon Total', recordedMm: 610, normalMm: 580, anomalyPercent: +5.2 },
      { year: 2025, season: 'Monsoon Total', recordedMm: 660, normalMm: 580, anomalyPercent: +13.8 },
      { year: 2026, season: 'Monsoon Current', recordedMm: 620, normalMm: 580, anomalyPercent: +6.9 }
    ],
    ledger: [
      {
        seasonLabel: 'Monsoon 2025 Cycle',
        year: 2025,
        rainfallInflowCuM: 37224000,
        naturalInfiltrationCuM: 3722400,
        artificialRechargeCapturedCuM: 2650000,
        estimatedIrrigationExtractionCuM: 4520000,
        domesticLivestockDrawCuM: 780000,
        netAquiferBalanceCuM: +1072400,
        observedGroundwaterShiftMeters: +1.4,
        recordedStatus: 'normal'
      },
      {
        seasonLabel: 'Monsoon 2026 Current Audit',
        year: 2026,
        rainfallInflowCuM: 34968000,
        naturalInfiltrationCuM: 3496800,
        artificialRechargeCapturedCuM: 2480000,
        estimatedIrrigationExtractionCuM: 4680000,
        domesticLivestockDrawCuM: 810000,
        netAquiferBalanceCuM: +486800,
        observedGroundwaterShiftMeters: +0.6,
        recordedStatus: 'watch'
      }
    ],
    satellite: {
      ndviCropHealth: 0.64,
      irrigatedAreaHectares: 3480,
      imperviousBuiltupGrowthPercent: 9.1,
      surfaceWaterBodySpreadSqKm: 2.15,
      potentialRechargeSuitability: 'Excellent',
      lastSatellitePass: '2026-09-27 (Sentinel-2, NRSC Bhuvan)'
    },
    assets: [
      {
        id: 'ASSET-GJ-001',
        name: 'Aji Tributary Check Dam #12 (Sardar Patel Scheme)',
        type: 'Check Dam',
        capacityCuM: 38000,
        installationYear: 2016,
        status: 'Functional',
        latitude: 22.3120,
        longitude: 70.8140,
        village: 'Kuvadva',
        lastVerifiedDate: '2026-09-05',
        verificationSource: 'Gujarat Water Resources Development Corporation',
        verifiedBy: 'D. C. Jadeja (Executive Engineer)',
        photoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        maintenanceAgency: 'GWRDC & Gram Panchayat Kuvadva'
      }
    ],
    tasks: [
      {
        id: 'TASK-GJ-01',
        watershedId: 'ws-saurashtra-rajkot',
        title: 'Desilting of 13 upstream check dams under Sujalam Sufalam Jal Abhiyan phase VI',
        category: 'Desiltation Campaign',
        priority: 'MEDIUM',
        responsibleAgency: 'GWRDC & Rural Development Dept',
        assignedOfficer: 'D. C. Jadeja (EE)',
        deadline: '2026-11-15',
        status: 'IN_PROGRESS'
      }
    ],
    seasonalAudit: {
      beforeLabel: '2015 Baseline',
      beforeTrend: 'Water level at 28m bgl; recurring summer tanker dependence',
      beforeFunctionalAssets: 21,
      beforeStressScore: 79,
      afterLabel: '2026 Current Status',
      afterTrend: 'Water level stabilized at 16.8m bgl; 49 functional check dams',
      afterFunctionalAssets: 49,
      afterStressScore: 48,
      verifiedImprovementSummary: 'Check dam cascade prevented runoff into Arabian Sea, adding 2.4 million CuM recharge cushion.'
    }
  }
];

export const MICRO_WATERSHEDS_DATA: MicroWatershed[] = RAW_MICRO_WATERSHEDS_DATA.map((ws) => {
  const meta = getStakeholdersForWatershed(ws.id);
  return {
    ...ws,
    stakeholders: meta.stakeholders,
    upcomingMeetings: meta.upcomingMeetings,
  };
});

export const NATIONAL_STATS_OVERVIEW = {
  activeJurisdictionsCount: 16,
  totalMonitoredWatersheds: 8,
  activeCriticalAlerts: 3,
  watchAlerts: 2,
  normalWatersheds: 3,
  totalRechargeAssetsTracked: 332,
  functionalRechargeAssets: 196,
  fieldVerificationsSubmittedThisMonth: 84,
  averageNationalStressIndex: 67.4,
  southernZoneNodal: 'IISc Bengaluru (South Zone Nodal Institute - SFIC)',
  sficTheme: 'Theme 2: Samriddh Annadata, Samriddh Bharat',
  sficCategory: 'Track A (Technology Solution) & Track B (Governance & Accountability)',
  lastSyncedTimestamp: '2026-10-02 12:45 IST',
};
