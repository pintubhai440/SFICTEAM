/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserRoleType, 
  WaterBody, 
  CitizenComplaint, 
  OfficerContact, 
  InspectorReport,
  EngineerWorkExecution
} from './types/nirikshan';
import { 
  INITIAL_WATER_BODIES, 
  INITIAL_OFFICER_CONTACTS, 
  INITIAL_CITIZEN_COMPLAINTS 
} from './data/nirikshanData';
import { RoleSelectorBar } from './components/RoleSelectorBar';
import { MainPortalDashboard } from './components/MainPortalDashboard';
import { CitizenDashboard } from './components/CitizenDashboard';
import { NodalOfficerDashboard } from './components/NodalOfficerDashboard';
import { InspectorDashboard } from './components/InspectorDashboard';
import { EngineerDashboard } from './components/EngineerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { LodgeComplaintModal } from './components/LodgeComplaintModal';
import { OfficerDirectoryModal } from './components/OfficerDirectoryModal';
import { AuthModal } from './components/AuthModal';
import { Droplets, Phone, AlertTriangle, ShieldCheck, Globe } from 'lucide-react';

export default function App() {
  // Default to overview landing page (national map and executive command, not user data)
  const [currentRole, setCurrentRole] = useState<UserRoleType>('overview');

  // Cache version to automatically purge stale mock data from previous sessions
  const STORAGE_VERSION = 'v8_isro_bhuvan_wbis_ndwi_grey';

  // Load persisted state or initial seed data with version check
  const [waterBodies, setWaterBodies] = useState<WaterBody[]>(() => {
    try {
      const version = localStorage.getItem('nir_storage_version');
      if (version !== STORAGE_VERSION) {
        localStorage.setItem('nir_storage_version', STORAGE_VERSION);
        localStorage.setItem('nir_water_bodies', JSON.stringify(INITIAL_WATER_BODIES));
        return INITIAL_WATER_BODIES;
      }
      const saved = localStorage.getItem('nir_water_bodies');
      return saved ? JSON.parse(saved) : INITIAL_WATER_BODIES;
    } catch {
      return INITIAL_WATER_BODIES;
    }
  });

  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    const saved = localStorage.getItem('nir_complaints');
    return saved ? JSON.parse(saved) : INITIAL_CITIZEN_COMPLAINTS;
  });

  const [officers] = useState<OfficerContact[]>(INITIAL_OFFICER_CONTACTS);

  // Auth states for the protected roles
  const [authenticatedRoles, setAuthenticatedRoles] = useState<Record<UserRoleType, boolean>>({
    overview: true,
    user: true,
    admin: false,
    nodal_vizianagaram: false,
    nodal_parvathipuram: false,
    inspector: false,
    engineer: false,
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAuthRole, setPendingAuthRole] = useState<UserRoleType>('admin');
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [isDirectoryModalOpen, setIsDirectoryModalOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('nir_water_bodies', JSON.stringify(waterBodies));
  }, [waterBodies]);

  useEffect(() => {
    localStorage.setItem('nir_complaints', JSON.stringify(complaints));
  }, [complaints]);

  // Role selection logic with auth gate
  const handleSelectRole = (role: UserRoleType) => {
    if (role === 'overview' || role === 'user') {
      setCurrentRole(role);
      return;
    }

    if (authenticatedRoles[role]) {
      setCurrentRole(role);
    } else {
      setPendingAuthRole(role);
      setIsAuthModalOpen(true);
    }
  };

  const handleLoginSuccess = (role: UserRoleType) => {
    setAuthenticatedRoles((prev) => ({ ...prev, [role]: true }));
    setCurrentRole(role);
  };

  const handleLogoutRole = (role: UserRoleType) => {
    setAuthenticatedRoles((prev) => ({ ...prev, [role]: false }));
    setCurrentRole('overview');
  };

  // --- Complaint & Workflow Handlers ---

  // 1. Citizen submits complaint
  const handleComplaintSubmitted = (newComplaint: CitizenComplaint) => {
    setComplaints([newComplaint, ...complaints]);
  };

  // 2. Nodal Officer assigns Inspector
  const handleAssignInspector = (
    complaintId: string,
    inspectorName: string,
    inspectorPhone: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'INSPECTOR_ASSIGNED',
              assignedInspector: inspectorName,
              assignedInspectorPhone: inspectorPhone,
            }
          : c
      )
    );
  };

  // 3. Inspector conducts inspection & logs TDS/Waste source
  const handleSubmitInspectionReport = (complaintId: string, report: InspectorReport) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId
          ? {
              ...c,
              status: 'INSPECTION_COMPLETED',
              inspectionReport: report,
            }
          : c
      )
    );
  };

  // 4. Nodal Officer deploys Action Engineer
  const handleAssignEngineer = (
    complaintId: string,
    engineerName: string,
    engineerPhone: string,
    deadline: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const workExec: EngineerWorkExecution = {
          id: `WRK-2026-${Math.floor(100 + Math.random() * 900)}`,
          engineerName,
          engineerPhone,
          assignedAt: new Date().toISOString().slice(0, 10),
          deadline,
          status: 'PENDING_ACCEPTANCE',
          beforePhotoUrl: c.photoUrl,
        };
        return {
          ...c,
          status: 'WORKER_IN_PROGRESS',
          assignedEngineer: engineerName,
          assignedEngineerPhone: engineerPhone,
          workExecution: workExec,
        };
      })
    );
  };

  // 5. Engineer accepts task with Before Photo
  const handleAcceptTask = (complaintId: string, beforePhotoUrl: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId || !c.workExecution) return c;
        return {
          ...c,
          status: 'WORKER_IN_PROGRESS',
          workExecution: {
            ...c.workExecution,
            status: 'ACCEPTED',
            beforePhotoUrl,
            startedAt: new Date().toISOString().slice(0, 10),
          },
        };
      })
    );
  };

  // 6. Engineer blocks task with reason
  const handleBlockTask = (complaintId: string, reason: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId || !c.workExecution) return c;
        return {
          ...c,
          workExecution: {
            ...c.workExecution,
            status: 'BLOCKED',
            blockReason: reason,
          },
        };
      })
    );
  };

  // 7. Engineer completes work with After Photo
  const handleCompleteTask = (complaintId: string, afterPhotoUrl: string, workSummary: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId || !c.workExecution) return c;
        return {
          ...c,
          status: 'VERIFICATION_PENDING',
          workExecution: {
            ...c.workExecution,
            status: 'COMPLETED',
            afterPhotoUrl,
            workSummary,
            completedAt: new Date().toISOString().slice(0, 10),
          },
        };
      })
    );
  };

  // 8. Inspector performs post-work site verification
  const handleSubmitPostWorkVerification = (
    complaintId: string,
    isSatisfactory: boolean,
    photoUrl: string,
    remarks: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const updatedReport: InspectorReport | undefined = c.inspectionReport
          ? {
              ...c.inspectionReport,
              postWorkVerification: {
                verifiedAt: new Date().toISOString().slice(0, 10),
                isSatisfactory,
                verificationPhotoUrl: photoUrl,
                remarks,
              },
            }
          : undefined;

        return {
          ...c,
          status: isSatisfactory ? 'RESOLVED' : 'WORKER_IN_PROGRESS',
          inspectionReport: updatedReport,
        };
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] w-full">
      {/* Topmost Official Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs w-full">
        <div className="bg-[#0b1b36] text-white text-[11px] px-3 sm:px-6 py-1.5 flex items-center justify-between border-b border-blue-900/60 font-medium">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
            <span className="text-sky-200 text-[10px] sm:text-[11px]">
              GOVT. OF ANDHRA PRADESH & NATIONAL WATER INFORMATICS • ALL INDIA WATER GRID
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] text-blue-300 font-mono hidden md:inline">
              SFIC 2026 WATER INTEGRITY NODE
            </span>
            <button
              onClick={() => setIsDirectoryModalOpen(true)}
              className="text-[10px] font-bold text-amber-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Phone className="w-3 h-3" />
              <span>Helpline Directory</span>
            </button>
          </div>
        </div>

        {/* Main Branding Bar */}
        <div className="px-3 sm:px-6 py-3 flex items-center justify-between gap-3 w-full">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentRole('overview')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0047ab] via-[#0284c7] to-[#10b981] flex items-center justify-center text-white shadow-md shadow-blue-500/25 shrink-0">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-[#0b1b36]">
                  Nir-ikshan <span className="text-xs font-semibold text-sky-600 font-sans">(नीर-ईक्षण)</span>
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 hidden sm:inline">
                  National Micro-Watershed Grid
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Geospatial Hydrological Surveillance, Citizen Grievance Triage & Remedial Engineering Engine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLodgeModalOpen(true)}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 cursor-pointer animate-pulse"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Lodge Complain</span>
            </button>

            <button
              onClick={() => setIsDirectoryModalOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-[#0047ab]" />
              <span>Officers</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-6">
        {/* PERMANENT 5-ROLE SELECTOR RIGHT ON THE DASHBOARD (NO THREE DOTS) */}
        <RoleSelectorBar
          currentRole={currentRole}
          onSelectRole={handleSelectRole}
          authenticatedRoles={authenticatedRoles}
          onLogoutRole={handleLogoutRole}
          onOpenLodgeModal={() => setIsLodgeModalOpen(true)}
          onOpenDirectoryModal={() => setIsDirectoryModalOpen(true)}
        />

        {/* 1. PORTAL HOME / OVERVIEW (DEFAULT ON FIRST VISIT - NO CITIZEN COMPLAINT CARDS HERE) */}
        {currentRole === 'overview' && (
          <MainPortalDashboard
            waterBodies={waterBodies}
            complaints={complaints}
            onSelectRole={handleSelectRole}
            onOpenLodgeModal={() => setIsLodgeModalOpen(true)}
            onOpenDirectoryModal={() => setIsDirectoryModalOpen(true)}
          />
        )}

        {/* 2. CITIZEN / NORMAL USER DASHBOARD (SHOWN ONLY WHEN USER CLICKS ON 'NORMAL USER') */}
        {currentRole === 'user' && (
          <CitizenDashboard
            complaints={complaints}
            waterBodies={waterBodies}
            onOpenLodgeModal={() => setIsLodgeModalOpen(true)}
            onOpenDirectoryModal={() => setIsDirectoryModalOpen(true)}
          />
        )}

        {/* 3. STATE ADMIN DASHBOARD (AP STATE AUDIT & PDF EXPORT) */}
        {currentRole === 'admin' && (
          <AdminDashboard
            waterBodies={waterBodies}
            complaints={complaints}
            officers={officers}
            onOpenDirectoryModal={() => setIsDirectoryModalOpen(true)}
          />
        )}

        {/* 4. NODAL OFFICER - VIZIANAGARAM */}
        {currentRole === 'nodal_vizianagaram' && (
          <NodalOfficerDashboard
            district="Vizianagaram"
            complaints={complaints}
            waterBodies={waterBodies}
            officers={officers}
            onAssignInspector={handleAssignInspector}
            onAssignEngineer={handleAssignEngineer}
          />
        )}

        {/* 5. NODAL OFFICER - PARVATHIPURAM MANYAM */}
        {currentRole === 'nodal_parvathipuram' && (
          <NodalOfficerDashboard
            district="Parvathipuram Manyam"
            complaints={complaints}
            waterBodies={waterBodies}
            officers={officers}
            onAssignInspector={handleAssignInspector}
            onAssignEngineer={handleAssignEngineer}
          />
        )}

        {/* 6. FIELD INSPECTOR MOBILE WORKSTATION */}
        {currentRole === 'inspector' && (
          <InspectorDashboard
            complaints={complaints}
            waterBodies={waterBodies}
            onSubmitInspectionReport={handleSubmitInspectionReport}
            onSubmitPostWorkVerification={handleSubmitPostWorkVerification}
          />
        )}

        {/* 7. ACTION WORKER / ENGINEER MOBILE WORKSTATION */}
        {currentRole === 'engineer' && (
          <EngineerDashboard
            complaints={complaints}
            waterBodies={waterBodies}
            onAcceptTask={handleAcceptTask}
            onBlockTask={handleBlockTask}
            onCompleteTask={handleCompleteTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0b1b36] text-slate-300 text-xs py-7 border-t border-blue-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">
                  Nir-ikshan (नीर-ईक्षण) — National & Andhra Pradesh Water Surveillance
                </h4>
                <p className="text-blue-300 text-[11px]">
                  All India Water Grid • Vizianagaram & Parvathipuram Manyam Circles • Water Resources Dept.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDirectoryModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/15"
            >
              <Phone className="w-3.5 h-3.5 text-amber-300" />
              <span>Verified Officer Contacts</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-blue-900/60 pt-3">
            <div>
              National Grid Portals: Overview • Normal User • State Admin • Vizianagaram Nodal • Parvathipuram Nodal • Field Inspector • Action Worker
            </div>
            <div className="font-mono text-emerald-400">
              Staff Credentials: admin@nir.com / 1234
            </div>
          </div>
        </div>
      </footer>

      {/* Lodge Complaint Modal (No login required) */}
      <LodgeComplaintModal
        isOpen={isLodgeModalOpen}
        onClose={() => setIsLodgeModalOpen(false)}
        onComplaintSubmitted={handleComplaintSubmitted}
      />

      {/* Officer Directory Modal */}
      <OfficerDirectoryModal
        isOpen={isDirectoryModalOpen}
        onClose={() => setIsDirectoryModalOpen(false)}
        officers={officers}
      />

      {/* Authentication Gate Modal (admin@nir.com / 1234) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        targetRole={pendingAuthRole}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
