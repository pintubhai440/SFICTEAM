import React, { useState } from 'react';
import { WaterBody, CitizenComplaint, OfficerContact } from '../types/nirikshan';
import { InteractiveAndhraMap } from './InteractiveAndhraMap';
import { 
  ShieldCheck, 
  Building2, 
  AlertTriangle, 
  Droplets, 
  CheckCircle2, 
  Download, 
  Users, 
  FileText,
  MapPin,
  TrendingUp,
  Activity
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

interface AdminDashboardProps {
  waterBodies: WaterBody[];
  complaints: CitizenComplaint[];
  officers: OfficerContact[];
  onOpenDirectoryModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  waterBodies,
  complaints,
  officers,
  onOpenDirectoryModal,
}) => {
  const [districtScope, setDistrictScope] = useState<'all' | 'Vizianagaram' | 'Parvathipuram Manyam'>('all');
  const [isExporting, setIsExporting] = useState(false);

  // Statistics
  const greenCount = waterBodies.filter((w) => w.statusColor === 'green').length;
  const blueCount = waterBodies.filter((w) => w.statusColor === 'blue').length;
  const yellowCount = waterBodies.filter((w) => w.statusColor === 'yellow').length;
  const redCount = waterBodies.filter((w) => w.statusColor === 'red').length;
  const greyCount = waterBodies.filter((w) => w.statusColor === 'grey').length;

  const totalComplaints = complaints.length;
  const resolvedComplaints = complaints.filter((c) => c.status === 'RESOLVED').length;
  const inProgressComplaints = complaints.filter((c) => c.status !== 'RESOLVED' && c.status !== 'REJECTED').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedComplaints / totalComplaints) * 100) : 100;

  const handleDownloadStatePdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        doc.setFillColor(27, 42, 74);
        doc.rect(0, 0, 210, 26, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text('GOVERNMENT OF ANDHRA PRADESH • WATER RESOURCES DEPARTMENT', 14, 11);
        doc.setFontSize(8);
        doc.setTextColor(186, 230, 253);
        doc.text('NIR-IKSHAN: STATE WATER SURVEILLANCE & GRIEVANCE REDRESSAL AUDIT REPORT', 14, 17);
        doc.text(`DATE: ${new Date().toLocaleDateString()} | JURISDICTION: VIZIANAGARAM & PARVATHIPURAM MANYAM`, 14, 22);

        doc.setTextColor(27, 42, 74);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('1. STATE WATER BODY HEALTH SUMMARY (5-COLOR CODE)', 14, 36);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(`• Green (Bahut Achha / Pristine): ${greenCount} bodies`, 14, 43);
        doc.text(`• Blue (Normal / Acceptable Quality): ${blueCount} bodies`, 14, 49);
        doc.text(`• Yellow (Middle Problem / Moderate Stress): ${yellowCount} bodies`, 14, 55);
        doc.text(`• Red (Danger Zone / Critical Effluent or Breach): ${redCount} bodies`, 14, 61);
        doc.text(`• Grey (Existence Se Mit Gaya / Extinct Bed): ${greyCount} bodies`, 14, 67);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('2. CITIZEN GRIEVANCE REDRESSAL PERFORMANCE', 14, 80);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.text(`Total Complaints Logged: ${totalComplaints}`, 14, 87);
        doc.text(`Active / In Remediation: ${inProgressComplaints}`, 14, 93);
        doc.text(`Successfully Remediated & Closed: ${resolvedComplaints} (${resolutionRate}% resolution rate)`, 14, 99);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('3. WATER BODIES INVENTORY', 14, 112);

        let curY = 120;
        waterBodies.forEach((wb, i) => {
          if (curY > 270) {
            doc.addPage();
            curY = 20;
          }
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.text(`${i + 1}. ${wb.name} (${wb.district}) - STATUS: ${wb.statusColor.toUpperCase()}`, 14, curY);
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7.5);
          doc.text(`Water Level: ${wb.waterLevelPercent}% | TDS: ${wb.tdsPpm} ppm | Waste: ${wb.wasteLevel}`, 14, curY + 4.5);
          curY += 10;
        });

        doc.save(`NirIkshan_State_Audit_${new Date().toISOString().slice(0, 10)}.pdf`);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        console.error('PDF error:', err);
      } finally {
        setIsExporting(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Admin Apex Banner */}
      <div className="bg-gradient-to-r from-[#1b2a4a] via-[#0047ab] to-sky-900 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-sky-200 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            <span>AP STATE APEX COMMAND DASHBOARD • GOVT OF ANDHRA PRADESH</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
            State Water Governance Oversight (రాష్ట్ర జల పర్యవేక్షణ)
          </h2>
          <p className="text-xs sm:text-sm text-sky-200">
            State-wide administrative control across <strong>Vizianagaram</strong> & <strong>Parvathipuram Manyam</strong>. Real-time water body degradation index, citizen grievance turnaround, and field staff monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadStatePdf}
            disabled={isExporting}
            className="px-4 py-2.5 bg-white text-[#0047ab] hover:bg-sky-50 font-bold rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download State Audit (PDF)'}</span>
          </button>

          <button
            onClick={onOpenDirectoryModal}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs border border-white/20 flex items-center gap-1.5 transition-colors"
          >
            <Users className="w-4 h-4 text-sky-300" />
            <span>Staff Directory</span>
          </button>
        </div>
      </div>

      {/* 5-Color KPI Health Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Green */}
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase">🟢 BAHUT ACHHA</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-1">{greenCount}</div>
          <p className="text-[10px] text-emerald-700 mt-0.5">Pristine / High Flow</p>
        </div>

        {/* Blue */}
        <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-800 uppercase">🔵 NORMAL</span>
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-sky-900 mt-1">{blueCount}</div>
          <p className="text-[10px] text-sky-700 mt-0.5">Acceptable Quality</p>
        </div>

        {/* Yellow */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase">🟡 MIDDLE PROBLEM</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-1">{yellowCount}</div>
          <p className="text-[10px] text-amber-700 mt-0.5">Moderate Silt/Waste</p>
        </div>

        {/* Red */}
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase">🔴 DANGER ZONE</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
          </div>
          <div className="text-2xl font-extrabold text-rose-900 mt-1">{redCount}</div>
          <p className="text-[10px] text-rose-700 mt-0.5">Severe Waste / Breach</p>
        </div>

        {/* Grey */}
        <div className="bg-slate-100 border border-slate-300 p-3.5 rounded-xl col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-700 uppercase">⚪ EXTINCT BED</span>
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
          </div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{greyCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Existence Se Mit Gaya</p>
        </div>
      </div>

      {/* Geospatial Map Section for Admin (Andhra Pradesh Scope) */}
      <InteractiveAndhraMap
        waterBodies={waterBodies}
        complaints={complaints}
        currentRole="admin"
      />

      {/* Performance Split across Vizianagaram & Parvathipuram Manyam */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Vizianagaram District Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Vizianagaram District Circle</h4>
              <p className="text-xs text-slate-500">Nodal Officer: Er. N. Subba Rao (+91 94901 82210)</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-100 text-[#0047ab] px-2 py-0.5 rounded">
              {waterBodies.filter((w) => w.district === 'Vizianagaram').length} Water Bodies
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">COMPLAINTS</span>
              <span className="font-bold text-slate-800">
                {complaints.filter((c) => c.district === 'Vizianagaram').length}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">IN ACTION</span>
              <span className="font-bold text-amber-600">
                {complaints.filter((c) => c.district === 'Vizianagaram' && c.status !== 'RESOLVED').length}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">RESOLVED</span>
              <span className="font-bold text-emerald-600">
                {complaints.filter((c) => c.district === 'Vizianagaram' && c.status === 'RESOLVED').length}
              </span>
            </div>
          </div>
        </div>

        {/* Parvathipuram Manyam District Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Parvathipuram Manyam Circle</h4>
              <p className="text-xs text-slate-500">Nodal Officer: Smt. P. Hemalatha (+91 94902 44321)</p>
            </div>
            <span className="text-xs font-mono font-bold bg-blue-100 text-[#0047ab] px-2 py-0.5 rounded">
              {waterBodies.filter((w) => w.district === 'Parvathipuram Manyam').length} Water Bodies
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">COMPLAINTS</span>
              <span className="font-bold text-slate-800">
                {complaints.filter((c) => c.district === 'Parvathipuram Manyam').length}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">IN ACTION</span>
              <span className="font-bold text-amber-600">
                {complaints.filter((c) => c.district === 'Parvathipuram Manyam' && c.status !== 'RESOLVED').length}
              </span>
            </div>
            <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold block">RESOLVED</span>
              <span className="font-bold text-emerald-600">
                {complaints.filter((c) => c.district === 'Parvathipuram Manyam' && c.status === 'RESOLVED').length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
