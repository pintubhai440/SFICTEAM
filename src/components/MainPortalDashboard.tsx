import React from 'react';
import { WaterBody, CitizenComplaint, UserRoleType } from '../types/nirikshan';
import { InteractiveIndiaMap } from './InteractiveIndiaMap';
import { 
  Droplets, 
  ShieldCheck, 
  User, 
  Building2, 
  UserCheck, 
  Wrench, 
  AlertTriangle, 
  Phone, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface MainPortalDashboardProps {
  waterBodies: WaterBody[];
  complaints: CitizenComplaint[];
  onSelectRole: (role: UserRoleType) => void;
  onOpenLodgeModal: () => void;
  onOpenDirectoryModal: () => void;
}

export const MainPortalDashboard: React.FC<MainPortalDashboardProps> = ({
  waterBodies,
  complaints,
  onSelectRole,
  onOpenLodgeModal,
  onOpenDirectoryModal,
}) => {
  const greenCount = waterBodies.filter((w) => w.statusColor === 'green').length;
  const blueCount = waterBodies.filter((w) => w.statusColor === 'blue').length;
  const yellowCount = waterBodies.filter((w) => w.statusColor === 'yellow').length;
  const redCount = waterBodies.filter((w) => w.statusColor === 'red').length;
  const greyCount = waterBodies.filter((w) => w.statusColor === 'grey').length;

  return (
    <div className="space-y-6">
      {/* Hero Apex Command Header */}
      <div className="bg-gradient-to-r from-[#0a192f] via-[#10243e] to-[#0047ab] text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-blue-900/50 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 relative overflow-hidden">
        {/* Glow ambient background accent */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-blue-500/15 blur-3xl pointer-events-none"></div>

        <div className="space-y-2.5 max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-mono text-sky-200 border border-white/15">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NATIONAL WATER INTEGRITY & SURVEILLANCE ECOSYSTEM</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Nir-ikshan: National & Andhra Pradesh Water Accountability Command
          </h2>

          <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed font-normal">
            Real-time geospatial hydrological surveillance across India and deep micro-watershed monitoring in <strong>Vizianagaram</strong> & <strong>Parvathipuram Manyam</strong>. Select your role above to access citizen grievance lodging, district triage, field inspector telemetry, or engineering remediation.
          </p>
        </div>

        {/* Quick Action Badges */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-2.5 w-full lg:w-auto relative z-10 shrink-0">
          <button
            onClick={() => onSelectRole('user')}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer"
          >
            <User className="w-4 h-4" />
            <span>Open Citizen Portal (User Data)</span>
          </button>

          <button
            onClick={onOpenLodgeModal}
            className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md shadow-rose-900/30 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-98 cursor-pointer animate-pulse"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Lodge Complain (शिकायत दर्ज करें)</span>
          </button>
        </div>
      </div>

      {/* 5-Color KPI Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Green */}
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
              🟢 BAHUT ACHHA
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-1">{greenCount}</div>
          <p className="text-[11px] text-emerald-700 mt-0.5 font-medium">Pristine / High Flow</p>
        </div>

        {/* Blue */}
        <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-sky-800 uppercase tracking-wider">
              🔵 NORMAL
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-900 mt-1">{blueCount}</div>
          <p className="text-[11px] text-sky-700 mt-0.5 font-medium">Acceptable Quality</p>
        </div>

        {/* Yellow */}
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
              🟡 MIDDLE PROBLEM
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-1">{yellowCount}</div>
          <p className="text-[11px] text-amber-700 mt-0.5 font-medium">Moderate Silt/Waste</p>
        </div>

        {/* Red */}
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider">
              🔴 DANGER ZONE
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-1">{redCount}</div>
          <p className="text-[11px] text-rose-700 mt-0.5 font-medium">Severe Hazard / Breach</p>
        </div>

        {/* Grey */}
        <div className="bg-slate-100 border border-slate-300 p-4 rounded-2xl shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
              ⚪ EXTINCT BED
            </span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">{greyCount}</div>
          <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Existence Se Mit Gaya</p>
        </div>
      </div>

      {/* Main Interactive All-India Map */}
      <InteractiveIndiaMap
        waterBodies={waterBodies}
        complaints={complaints}
        currentRole="admin"
        onLodgeComplaint={onOpenLodgeModal}
      />

      {/* Regional Catchment Inventory Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#0047ab]" />
              <span>National & Andhra Pradesh Water Body Registry ({waterBodies.length})</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click on any water body on the map or review field test parameters below
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500">
                <th className="p-3">Water Body / Catchment</th>
                <th className="p-3">State / District</th>
                <th className="p-3">Type</th>
                <th className="p-3">Water Level</th>
                <th className="p-3">TDS Level</th>
                <th className="p-3">Waste / Threat</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {waterBodies.slice(0, 10).map((wb) => (
                <tr key={wb.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{wb.name}</div>
                    {wb.teluguName && (
                      <div className="text-[10px] text-[#0047ab] font-bold">{wb.teluguName}</div>
                    )}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-slate-800">{wb.state || 'Andhra Pradesh'}</span>
                    <div className="text-[10px] text-slate-500">{wb.district}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px]">
                      {wb.type}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${wb.waterLevelPercent}%` }}
                        ></div>
                      </div>
                      <span className="font-bold">{wb.waterLevelPercent}%</span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-800">
                    {wb.tdsPpm} ppm
                  </td>
                  <td className="p-3">
                    <span className="text-[11px] text-slate-600">{wb.wasteLevel}</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      wb.statusColor === 'green'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : wb.statusColor === 'blue'
                        ? 'bg-sky-100 text-sky-800 border-sky-300'
                        : wb.statusColor === 'yellow'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : wb.statusColor === 'red'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : 'bg-slate-200 text-slate-800 border-slate-300'
                    }`}>
                      {wb.statusColor.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
