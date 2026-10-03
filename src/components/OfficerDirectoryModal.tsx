import React, { useState } from 'react';
import { OfficerContact } from '../types/nirikshan';
import { 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  X, 
  Search, 
  Building2, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';

interface OfficerDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  officers: OfficerContact[];
}

export const OfficerDirectoryModal: React.FC<OfficerDirectoryModalProps> = ({
  isOpen,
  onClose,
  officers,
}) => {
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterDistrict, setFilterDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filtered = officers.filter((off) => {
    const matchesRole = filterRole === 'all' || off.role === filterRole;
    const matchesDistrict = filterDistrict === 'all' || off.district === filterDistrict;
    const matchesSearch =
      off.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      off.phone.includes(searchQuery) ||
      off.officeAddress.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesDistrict && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b2a4a] via-[#0047ab] to-sky-900 text-white p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-white/10 text-sky-200">
                <Users className="w-5 h-5 text-sky-300" />
              </span>
              <span className="text-[11px] font-mono tracking-widest text-sky-200 uppercase font-bold">
                NIR-IKSHAN VERIFIED DIRECTORY • ANDHRA PRADESH
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Water Governance Officers & Field Staff Directory
            </h2>
            <p className="text-xs text-sky-200">
              Direct contact coordinates for Nodal Officers, Senior Field Inspectors, and Action Engineers in Vizianagaram & Parvathipuram Manyam.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by officer name, designation, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs w-full border-none focus:outline-none placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={filterDistrict}
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
            >
              <option value="all">All Districts</option>
              <option value="Vizianagaram">Vizianagaram</option>
              <option value="Parvathipuram Manyam">Parvathipuram Manyam</option>
              <option value="State Level (AP)">State Level (AP)</option>
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-semibold text-slate-700"
            >
              <option value="all">All Roles</option>
              <option value="Nodal Officer">Nodal Officers</option>
              <option value="Inspector">Field Inspectors</option>
              <option value="Action Engineer">Action Engineers</option>
              <option value="District Collectorate">District Collectorate</option>
            </select>
          </div>
        </div>

        {/* Officer Cards List */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((off) => (
            <div
              key={off.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:shadow-md transition-shadow flex gap-3.5 items-start"
            >
              <img
                src={off.avatarUrl}
                alt={off.name}
                className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
              />
              <div className="space-y-1.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-[#0047ab] border border-sky-200">
                    {off.role}
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {off.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 truncate">{off.name}</h4>
                <p className="text-xs text-slate-600 font-medium leading-tight">{off.designation}</p>

                <div className="pt-1 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{off.district}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{off.officeAddress}</span>
                  </div>
                </div>

                {/* Contact Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <a
                    href={`tel:${off.phone}`}
                    className="flex-1 py-1.5 px-2 bg-[#0047ab] hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call: {off.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${off.phone.replace(/[^0-9]/g, '')}?text=Namaste%20Sir,%20Regarding%20Nir-ikshan%20Water%20Surveillance.`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center justify-center transition-colors"
                    title="Send WhatsApp Message"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
