import { StakeholderContact, GramSabhaMeeting } from '../types/watershed';

export const STAKEHOLDER_DATA_BY_WATERSHED: Record<string, {
  stakeholders: StakeholderContact[];
  upcomingMeetings: GramSabhaMeeting[];
}> = {
  'ws-kolar-palavanhalli': {
    stakeholders: [
      {
        id: 'STK-KLR-01',
        name: 'Smt. Manjula Narayanaswamy',
        designation: 'Gram Panchayat Adhyaksha (President)',
        category: 'Gram Panchayat',
        phone: '+91 94481 24510',
        email: 'adhyaksha.palavanhalli@karnataka.gov.in',
        villageOrOffice: 'Palavanhalli Gram Panchayat Office, Kolar',
        availability: 'Mon - Fri, 10:30 AM - 04:30 PM (Panchayat Bhavan)',
        grievancesResolvedCount: 42,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-02',
        name: 'Sri Venkateshappa G.',
        designation: 'Panchayat Development Officer (PDO)',
        category: 'Gram Panchayat',
        phone: '+91 98450 33812',
        email: 'pdo.palavanhalli.rdpr@karnataka.gov.in',
        villageOrOffice: 'RDPR Sub-Division, Kolar Taluk',
        availability: 'All Working Days (Field inspections on Wed & Sat)',
        grievancesResolvedCount: 68,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-03',
        name: 'Sri Byre Gowda',
        designation: 'Ward Member (Agriculture & Irrigation Representative)',
        category: 'Gram Panchayat',
        phone: '+91 99014 88721',
        email: 'byregowda.ward4@gmail.com',
        villageOrOffice: 'Gollahalli Ward #4, Palavanhalli',
        availability: 'Daily 08:00 AM - 11:00 AM (Farmer Contact Center)',
        grievancesResolvedCount: 29,
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-04',
        name: 'Dr. Muniyappa K. S.',
        designation: 'Village Water & Sanitation Committee (VWSC) Convener',
        category: 'Water Committee',
        phone: '+91 94802 61730',
        email: 'vwsc.palavanhalli@watermission.org',
        villageOrOffice: 'VWSC Jal Samiti Kendra, Palavanhalli',
        availability: 'Tuesdays & Thursdays, 02:00 PM - 05:00 PM',
        grievancesResolvedCount: 54,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-05',
        name: 'Smt. Shailaja R.',
        designation: 'Lead Jal Sathi & Community Auditor',
        category: 'Community Auditor',
        phone: '+91 97411 90244',
        email: 'jalsathi.kolar@shgfederation.in',
        villageOrOffice: 'Stree Shakti SHG Federation, Kundahalli',
        availability: 'Daily Community Visits (Morning 09:00 - 12:00)',
        grievancesResolvedCount: 37,
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-06',
        name: 'Er. S. Nagaraj',
        designation: 'Assistant Executive Engineer (AEE) - Minor Irrigation',
        category: 'Nodal Officer',
        phone: '+91 94483 11840',
        email: 'aee.mi.kolar@karnataka.gov.in',
        villageOrOffice: 'Minor Irrigation Sub-Division Office, Kolar District Center',
        availability: 'Mon - Fri, 10:00 AM - 05:30 PM',
        grievancesResolvedCount: 89,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-07',
        name: 'Dr. V. Prasad',
        designation: 'Senior Scientist & Groundwater Nodal Officer (CGWB)',
        category: 'Nodal Officer',
        phone: '+91 80 2341 6890',
        email: 'vprasad.cgwb@nic.in',
        villageOrOffice: 'Central Ground Water Board, South Western Region, Bengaluru',
        availability: 'Technical Hours: 11:00 AM - 04:00 PM',
        grievancesResolvedCount: 45,
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-KLR-08',
        name: 'Prof. Surjo Bose / SFIC Zonal Desk',
        designation: 'South Zone Nodal Institute Coordinator (IISc Bengaluru)',
        category: 'Nodal Officer',
        phone: '+91 80 2293 2500',
        email: 'sevafirst.south@iisc.ac.in',
        villageOrOffice: 'Indian Institute of Science (IISc), CV Raman Rd, Bengaluru - 560012',
        availability: 'SFIC Challenge Desk: Mon - Fri, 09:30 AM - 05:30 PM',
        grievancesResolvedCount: 112,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-KLR-01',
        date: '2026-10-14',
        title: 'Special Gram Sabha: Pre-Rabi Groundwater Allocation & Check Dam Silt Audit',
        location: 'Palavanhalli Gram Panchayat Community Hall',
        agenda: 'Review of 15 non-functional recharge structures, MGNREGS desilting sanction, and collective restriction on deep borewell drilling.',
        attendeesExpected: 180,
      },
      {
        id: 'MTG-KLR-02',
        date: '2026-10-28',
        title: 'VWSC & Jal Jeevan Mission Village Water Audit',
        location: 'Kundahalli Govt School Ground',
        agenda: 'Inspection of rooftop rainwater harvesting filters and distribution pipeline leakage repair.',
        attendeesExpected: 75,
      }
    ]
  },
  'ws-anantapur-kalyandurg': {
    stakeholders: [
      {
        id: 'STK-ATP-01',
        name: 'Sri K. Venkataramudu',
        designation: 'Sarpanch (Gram Panchayat President)',
        category: 'Gram Panchayat',
        phone: '+91 94402 78190',
        email: 'sarpanch.kalyandurg@ap.gov.in',
        villageOrOffice: 'Gram Panchayat Office, Kalyandurg Rural',
        availability: 'Daily 09:00 AM - 02:00 PM',
        grievancesResolvedCount: 38,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-ATP-02',
        name: 'Smt. P. Lakshmi Devi',
        designation: 'Panchayat Secretary (Grade-I)',
        category: 'Gram Panchayat',
        phone: '+91 98499 12345',
        email: 'sec.kalyandurg.pr@ap.gov.in',
        villageOrOffice: 'Mandal Parishad Office, Kalyandurg',
        availability: 'Mon - Fri 10:00 AM - 05:00 PM',
        grievancesResolvedCount: 62,
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-ATP-03',
        name: 'Sri B. Narayana Swamy',
        designation: 'Pani Samiti / Cheruvu Conservation Head',
        category: 'Water Committee',
        phone: '+91 94901 55670',
        email: 'panisamiti.kalyandurg@gmail.com',
        villageOrOffice: 'Water Users Association Office, Mudigallu',
        availability: 'Mon, Wed, Fri 08:30 AM - 12:30 PM',
        grievancesResolvedCount: 41,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-ATP-04',
        name: 'Er. K. Venkataswamy',
        designation: 'District Watershed Nodal Officer (DWMA)',
        category: 'Nodal Officer',
        phone: '+91 8554 220199',
        email: 'pd.dwma.atp@ap.gov.in',
        villageOrOffice: 'DWMA Project Director Office, Collectorate, Anantapur',
        availability: 'Working Days 10:30 AM - 05:00 PM',
        grievancesResolvedCount: 77,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-ATP-05',
        name: 'Prof. Surjo Bose / IISc Nodal Coordinator',
        designation: 'South Zone Nodal Institute Coordinator (IISc Bengaluru)',
        category: 'Nodal Officer',
        phone: '+91 80 2293 2500',
        email: 'sevafirst.south@iisc.ac.in',
        villageOrOffice: 'IISc Bengaluru South Zone Technical Desk',
        availability: 'Weekdays 09:30 AM - 05:30 PM',
        grievancesResolvedCount: 94,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-ATP-01',
        date: '2026-10-18',
        title: 'Drought Resilience & Cheruvu Desiltation Social Audit',
        location: 'Mudigallu Rythu Seva Kendram',
        agenda: 'Farmer consultation on drip irrigation subsidies, farm pond bund compaction, and groundnut water budgeting.',
        attendeesExpected: 140,
      }
    ]
  },
  'ws-latur-manjra': {
    stakeholders: [
      {
        id: 'STK-LTR-01',
        name: 'Sri Balaji Patil',
        designation: 'Gram Panchayat Sarpanch',
        category: 'Gram Panchayat',
        phone: '+91 94221 67800',
        email: 'sarpanch.sai.latur@maharashtra.gov.in',
        villageOrOffice: 'Gram Panchayat Office, Sai, Taluka Latur',
        availability: 'Mon - Sat, 09:00 AM - 01:00 PM',
        grievancesResolvedCount: 82,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-LTR-02',
        name: 'Sri Santosh Deshmukh',
        designation: 'Jal Biradari Community Hydrology Leader',
        category: 'Water Committee',
        phone: '+91 98230 45610',
        email: 'santosh.jalbiradari@laturwater.org',
        villageOrOffice: 'Manjra River Rejuvenation Samiti, Latur',
        availability: 'Daily Field Hours (10:00 AM - 04:00 PM)',
        grievancesResolvedCount: 96,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-LTR-03',
        name: 'Dr. Nitin Kulkarni',
        designation: 'Senior Hydrogeologist & Nodal Officer (GSDA)',
        category: 'Nodal Officer',
        phone: '+91 2382 245890',
        email: 'dd.gsda.latur@maharashtra.gov.in',
        villageOrOffice: 'Groundwater Surveys and Development Agency, Latur',
        availability: 'Office Days 10:00 AM - 05:00 PM',
        grievancesResolvedCount: 65,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-LTR-01',
        date: '2026-10-22',
        title: 'Manjra Basin Post-Monsoon Storage & Silt Trap Review',
        location: 'Sai Barrage Inspection Bungalow',
        agenda: 'Assessment of 36 check dams silt accumulation and sugarcane water allocation protocols.',
        attendeesExpected: 90,
      }
    ]
  },
  'ws-jodhpur-luni': {
    stakeholders: [
      {
        id: 'STK-JDH-01',
        name: 'Sri M. P. Bishnoi',
        designation: 'Panchayat Samiti Pradhan / Water Convener',
        category: 'Gram Panchayat',
        phone: '+91 94141 33201',
        email: 'pradhan.osian@rajasthan.gov.in',
        villageOrOffice: 'Panchayat Samiti Osian, Jodhpur District',
        availability: 'Mon - Fri 10:00 AM - 04:00 PM',
        grievancesResolvedCount: 46,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-JDH-02',
        name: 'Er. R. K. Rathore',
        designation: 'Superintending Engineer (Watershed & Soil Conservation)',
        category: 'Nodal Officer',
        phone: '+91 291 2541090',
        email: 'se.wdsc.jodhpur@rajasthan.gov.in',
        villageOrOffice: 'Watershed Development & Soil Conservation, Jodhpur',
        availability: 'Working Hours 09:30 AM - 06:00 PM',
        grievancesResolvedCount: 58,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-JDH-01',
        date: '2026-11-04',
        title: 'Osian Traditional Tanka & Khadin Revival Consultation',
        location: 'Osian Panchayat Samiti Hall',
        agenda: 'Rehabilitation of ancient stone percolation bunds before dry winter season.',
        attendeesExpected: 120,
      }
    ]
  },
  'ws-bundelkhand-mahoba': {
    stakeholders: [
      {
        id: 'STK-MHB-01',
        name: 'Sri Rameshwar Tiwari',
        designation: 'Gram Pradhan (Panchayat Head)',
        category: 'Gram Panchayat',
        phone: '+91 94502 89011',
        email: 'pradhan.mahobarural@up.gov.in',
        villageOrOffice: 'Gram Panchayat Mahoba Dehat',
        availability: 'Daily 08:30 AM - 01:30 PM',
        grievancesResolvedCount: 52,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-MHB-02',
        name: 'Er. Sanjay Srivastava',
        designation: 'Executive Engineer (Minor Irrigation & Chandela Tanks)',
        category: 'Nodal Officer',
        phone: '+91 5281 252341',
        email: 'ee.mi.mahoba@up.gov.in',
        villageOrOffice: 'Minor Irrigation Division, Mahoba',
        availability: 'Mon - Fri 10:00 AM - 05:00 PM',
        grievancesResolvedCount: 71,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-MHB-01',
        date: '2026-10-25',
        title: 'Madan Sagar Historic Tank Feeder Canal Clearance Drive',
        location: 'Madan Sagar Ghat, Mahoba',
        agenda: 'Community voluntary shramdaan and mechanical desilting coordination.',
        attendeesExpected: 160,
      }
    ]
  },
  'ws-coimbatore-noyyal': {
    stakeholders: [
      {
        id: 'STK-CBE-01',
        name: 'Thiru K. Murugan',
        designation: 'Town Panchayat Executive & Water Supply Officer',
        category: 'Gram Panchayat',
        phone: '+91 94433 21980',
        email: 'eo.sulur@tn.gov.in',
        villageOrOffice: 'Sulur Town Panchayat Office, Coimbatore',
        availability: 'Mon - Fri 10:00 AM - 05:00 PM',
        grievancesResolvedCount: 104,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-CBE-02',
        name: 'Er. S. Shanmugam',
        designation: 'Executive Engineer - PWD Water Resources Dept',
        category: 'Nodal Officer',
        phone: '+91 422 2390140',
        email: 'ee.wrd.noyyal@tn.gov.in',
        villageOrOffice: 'PWD WRD Office, Town Hall, Coimbatore',
        availability: 'All Working Days 10:00 AM - 05:30 PM',
        grievancesResolvedCount: 88,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-CBE-03',
        name: 'Prof. Surjo Bose / IISc Nodal Coordinator',
        designation: 'South Zone Nodal Institute Coordinator (IISc Bengaluru)',
        category: 'Nodal Officer',
        phone: '+91 80 2293 2500',
        email: 'sevafirst.south@iisc.ac.in',
        villageOrOffice: 'IISc Bengaluru South Zone Technical Desk',
        availability: 'Weekdays 09:30 AM - 05:30 PM',
        grievancesResolvedCount: 94,
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-CBE-01',
        date: '2026-10-30',
        title: 'Noyyal Basin Water Quality & Industrial Effluent Audit',
        location: 'Sulur Tank Inspection Pavilion',
        agenda: 'Review of online water quality telemetry sensors and feeder canal silt clearance.',
        attendeesExpected: 80,
      }
    ]
  },
  'ws-delhi-najafgarh': {
    stakeholders: [
      {
        id: 'STK-DL-01',
        name: 'Er. Alok Saxena',
        designation: 'Executive Engineer (Rainwater Harvesting Cell, DJB)',
        category: 'Nodal Officer',
        phone: '+91 11 2351 7890',
        email: 'ee.rwh.djb@delhi.gov.in',
        villageOrOffice: 'Delhi Jal Board HQ, Varunalaya Phase-II, Karol Bagh',
        availability: 'Mon - Fri 10:00 AM - 05:00 PM',
        grievancesResolvedCount: 115,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-DL-02',
        name: 'Dr. Manu Bhatnagar',
        designation: 'Director, Natural Heritage & Wetland Restoration',
        category: 'Water Committee',
        phone: '+91 11 2463 1818',
        email: 'wetlands.delhi@intach.org',
        villageOrOffice: 'Najafgarh Jheel Wetland Conservation Center',
        availability: 'Tue & Thu 11:00 AM - 04:00 PM',
        grievancesResolvedCount: 76,
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-DL-01',
        date: '2026-10-19',
        title: 'Dwarka Sub-City Stormwater Injection Pits Inspection',
        location: 'Sector 23 Community Center, Dwarka',
        agenda: 'Resident Welfare Association (RWA) consultation on filter media replacement in 46 injection shafts.',
        attendeesExpected: 110,
      }
    ]
  },
  'ws-bathinda-malwa': {
    stakeholders: [
      {
        id: 'STK-PB-01',
        name: 'S. Gurpreet Singh',
        designation: 'Sarpanch (Gram Panchayat Kotshamir)',
        category: 'Gram Panchayat',
        phone: '+91 98142 55431',
        email: 'sarpanch.kotshamir@punjab.gov.in',
        villageOrOffice: 'Gram Panchayat Bhavan, Kotshamir, Bathinda',
        availability: 'Mon - Sat 08:30 AM - 01:30 PM',
        grievancesResolvedCount: 49,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-PB-02',
        name: 'Er. Harpreet Singh',
        designation: 'Sub-Divisional Officer (SDO) - Punjab Water Resources',
        category: 'Nodal Officer',
        phone: '+91 164 2210870',
        email: 'sdo.canal.bti@punjab.gov.in',
        villageOrOffice: 'Canal Colony, Bathinda Division',
        availability: 'Working Days 09:30 AM - 05:00 PM',
        grievancesResolvedCount: 64,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-PB-01',
        date: '2026-10-26',
        title: 'Malwa Aquifer Overdraft & Direct Seeded Rice (DSR) Transition',
        location: 'Kotshamir Dana Mandi Kisan Shed',
        agenda: 'Farmer consultation on shifting away from summer paddy, canal tail recharge shafts, and tube-well metering.',
        attendeesExpected: 220,
      }
    ]
  },
  'ws-saurashtra-rajkot': {
    stakeholders: [
      {
        id: 'STK-GJ-01',
        name: 'Shri Pravinbhai Patel',
        designation: 'Gram Panchayat Sarpanch',
        category: 'Gram Panchayat',
        phone: '+91 98251 77620',
        email: 'sarpanch.kuvadva@gujarat.gov.in',
        villageOrOffice: 'Gram Panchayat Kuvadva, Rajkot Taluka',
        availability: 'Daily 09:00 AM - 02:00 PM',
        grievancesResolvedCount: 67,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
      },
      {
        id: 'STK-GJ-02',
        name: 'Er. D. C. Jadeja',
        designation: 'Executive Engineer - GWRDC & Check Dam Mission',
        category: 'Nodal Officer',
        phone: '+91 281 2470155',
        email: 'ee.gwrdc.rajkot@gujarat.gov.in',
        villageOrOffice: 'Gujarat Water Resources Development Corp, Rajkot',
        availability: 'Working Hours 10:30 AM - 06:00 PM',
        grievancesResolvedCount: 91,
        avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=240&q=80',
      }
    ],
    upcomingMeetings: [
      {
        id: 'MTG-GJ-01',
        date: '2026-11-08',
        title: 'Sujalam Sufalam Jal Abhiyan Check Dam Desiltation Review',
        location: 'Aji Dam Inspection Hall, Rajkot',
        agenda: 'Review of 49 functional check dam cascade and silt removal from upstream reservoirs.',
        attendeesExpected: 130,
      }
    ]
  }
};

// Fallback default generator in case of any new watershed
export function getStakeholdersForWatershed(watershedId: string) {
  const data = STAKEHOLDER_DATA_BY_WATERSHED[watershedId];
  if (data) return data;

  return {
    stakeholders: [
      {
        id: `STK-${watershedId}-01`,
        name: 'Smt. Lakshmi Devi',
        designation: 'Gram Panchayat Adhyaksha',
        category: 'Gram Panchayat' as const,
        phone: '+91 94480 00000',
        email: 'sarpanch.panchayat@gov.in',
        villageOrOffice: 'Gram Panchayat Main Office',
        availability: 'Mon - Fri 10:00 AM - 04:00 PM',
        grievancesResolvedCount: 35,
      },
      {
        id: `STK-${watershedId}-02`,
        name: 'Dr. V. Prasad / CGWB Team',
        designation: 'Central Ground Water Board District Hydrogeologist',
        category: 'Nodal Officer' as const,
        phone: '+91 80 2341 0000',
        email: 'nodal.cgwb@nic.in',
        villageOrOffice: 'Regional Ground Water Authority',
        availability: 'Weekdays 10:30 AM - 05:00 PM',
        grievancesResolvedCount: 50,
      }
    ],
    upcomingMeetings: [
      {
        id: `MTG-${watershedId}-01`,
        date: '2026-10-20',
        title: 'Community Water Audit & Social Accountability Assembly',
        location: 'Gram Panchayat Community Center',
        agenda: 'Public review of water table levels, repair of broken recharge structures, and seasonal budgeting.',
        attendeesExpected: 100,
      }
    ]
  };
}
