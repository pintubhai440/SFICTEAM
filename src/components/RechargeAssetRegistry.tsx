import React, { useState } from 'react';
import { MicroWatershed, RechargeAsset, FieldVerificationSubmission } from '../types/watershed';
import { 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Filter, 
  Image as ImageIcon,
  Check,
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RechargeAssetRegistryProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
  userRole: string;
  onAssetStatusUpdated?: (assetId: string, newStatus: RechargeAsset['status']) => void;
}

export const RechargeAssetRegistry: React.FC<RechargeAssetRegistryProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  userRole,
  onAssetStatusUpdated,
}) => {
  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Verification Modal State
  const [verifyingAsset, setVerifyingAsset] = useState<RechargeAsset | null>(null);
  const [reportedStatus, setReportedStatus] = useState<RechargeAsset['status']>('Functional');
  const [inspectorRemarks, setInspectorRemarks] = useState<string>('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number }>({ lat: 13.1412, lng: 78.1345 });
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80'
  );
  const [recentSubmissions, setRecentSubmissions] = useState<FieldVerificationSubmission[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Filter assets
  const filteredAssets = currentWs.assets.filter((asset) => {
    const matchesType = filterType === 'all' || asset.type === filterType;
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleOpenVerifyModal = (asset: RechargeAsset) => {
    setVerifyingAsset(asset);
    setReportedStatus(asset.status);
    setGpsCoordinates({ lat: asset.latitude, lng: asset.longitude });
    setInspectorRemarks(`Physical condition verified on site. Desiltation clearance checked.`);
  };

  const handleFetchCurrentGps = () => {
    if (verifyingAsset) {
      // Add slight jitter to simulate realistic GPS accuracy
      setGpsCoordinates({
        lat: Number((verifyingAsset.latitude + (Math.random() - 0.5) * 0.001).toFixed(6)),
        lng: Number((verifyingAsset.longitude + (Math.random() - 0.5) * 0.001).toFixed(6)),
      });
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingAsset) return;

    const newSubmission: FieldVerificationSubmission = {
      id: `VERIF-${Date.now().toString().slice(-5)}`,
      assetId: verifyingAsset.id,
      assetName: verifyingAsset.name,
      watershedId: currentWs.id,
      submittedBy: userRole,
      role: 'Gram Panchayat SPOC',
      statusReported: reportedStatus,
      latitude: gpsCoordinates.lat,
      longitude: gpsCoordinates.lng,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
      photoUrl: photoPreview,
      remarks: inspectorRemarks,
      isVerified: true,
    };

    // Update in parent / local state
    verifyingAsset.status = reportedStatus;
    verifyingAsset.lastVerifiedDate = new Date().toISOString().slice(0, 10);
    verifyingAsset.verifiedBy = `${userRole} (Field Verified)`;
    if (onAssetStatusUpdated) {
      onAssetStatusUpdated(verifyingAsset.id, reportedStatus);
    }

    setRecentSubmissions([newSubmission, ...recentSubmissions]);
    setVerifyingAsset(null);

    // Confetti Celebration
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#06b6d4', '#10b981', '#3b82f6'],
    });

    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 4500);
  };

  const getStatusBadge = (status: RechargeAsset['status']) => {
    switch (status) {
      case 'Functional':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Partially Silted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Critically Damaged':
      case 'Dry/Non-Functional':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'Under Maintenance':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b2a4a] text-white px-5 py-3 rounded-xl shadow-xl border border-sky-400 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Field Verification Submitted & Signed!</div>
            <div className="text-blue-200">Asset record updated with GPS tag & timestamp in national registry.</div>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#0047ab]" />
            Recharge Asset Registry & Field Verification (सत्यापित परिसंपत्ति पंजी)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Physical tracking of check dams, percolation tanks, and recharge wells with GPS evidence.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-600">Watershed:</label>
          <select
            value={currentWs.id}
            onChange={(e) => onSelectWatershed(e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 cursor-pointer"
          >
            {watersheds.map((ws) => (
              <option key={ws.id} value={ws.id}>
                {ws.district} — {ws.name.split('(')[0]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by asset name, ID (e.g. ASSET-KLR-001), or village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-800 border-none focus:outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Filter Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-medium cursor-pointer"
          >
            <option value="all">All Structure Types ({currentWs.assets.length})</option>
            <option value="Check Dam">Check Dam</option>
            <option value="Percolation Tank">Percolation Tank</option>
            <option value="Recharge Well">Recharge Well</option>
            <option value="Rooftop RWH">Rooftop RWH</option>
            <option value="Farm Pond">Farm Pond</option>
          </select>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            {/* Asset Photo & Badges */}
            <div className="relative h-40 w-full overflow-hidden bg-slate-100">
              <img
                src={asset.photoUrl}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2.5 left-2.5">
                <span className="bg-[#1b2a4a]/90 text-white text-[10px] font-mono px-2 py-0.5 rounded border border-white/20">
                  {asset.id}
                </span>
              </div>
              <div className="absolute top-2.5 right-2.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(asset.status)}`}>
                  {asset.status}
                </span>
              </div>
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/70 backdrop-blur-xs text-white text-[11px] px-2 py-1 rounded flex items-center justify-between font-mono">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400" />
                  {asset.latitude.toFixed(4)}°N, {asset.longitude.toFixed(4)}°E
                </span>
                <span>{asset.village}</span>
              </div>
            </div>

            {/* Asset Details */}
            <div className="p-4 flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {asset.name}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Type:</span>
                  <span className="font-semibold text-slate-800">{asset.type}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Storage Capacity:</span>
                  <span className="font-semibold text-[#0047ab]">{asset.capacityCuM.toLocaleString()} m³</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Commissioned:</span>
                  <span className="font-semibold text-slate-800">{asset.installationYear}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Maintenance:</span>
                  <span className="font-semibold text-slate-800 truncate block" title={asset.maintenanceAgency}>
                    {asset.maintenanceAgency.split('&')[0]}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-0.5 pt-1">
                <div className="flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Last Verified: {asset.lastVerifiedDate}</span>
                </div>
                <div className="text-[10px] text-slate-600 truncate" title={asset.verifiedBy}>
                  <strong>Verifier:</strong> {asset.verifiedBy}
                </div>
              </div>
            </div>

            {/* Verification Button */}
            <div className="p-3 bg-slate-50/70 border-t border-slate-100">
              <button
                onClick={() => handleOpenVerifyModal(asset)}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                Submit Field Verification Audit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Field Verification Modal Dialog */}
      {verifyingAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#1b2a4a] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-300 uppercase tracking-wider block">
                  TRACK-B GOVERNANCE WORKFLOW (Roadmap §5 & §11)
                </span>
                <h3 className="text-base font-bold text-white">
                  Field Verification & Evidence Upload
                </h3>
              </div>
              <button
                onClick={() => setVerifyingAsset(null)}
                className="text-slate-300 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitVerification} className="p-5 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Asset Being Inspected
                </label>
                <div className="text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {verifyingAsset.id} — {verifyingAsset.name} ({verifyingAsset.type})
                </div>
              </div>

              {/* Status Radio Buttons */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  Reported Physical Condition
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(['Functional', 'Partially Silted', 'Critically Damaged', 'Dry/Non-Functional', 'Under Maintenance'] as const).map((st) => (
                    <label
                      key={st}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer font-medium ${
                        reportedStatus === st
                          ? 'border-[#0047ab] bg-blue-50 text-[#0047ab] font-bold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        checked={reportedStatus === st}
                        onChange={() => setReportedStatus(st)}
                        className="accent-[#0047ab]"
                      />
                      <span>{st}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GPS Stamp */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700">
                    Geo-Location Stamp (GPS Verification)
                  </label>
                  <button
                    type="button"
                    onClick={handleFetchCurrentGps}
                    className="text-[11px] font-semibold text-[#0047ab] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    Simulate Device GPS Sync
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Latitude</span>
                    <span>{gpsCoordinates.lat.toFixed(6)}° N</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">Longitude</span>
                    <span>{gpsCoordinates.lng.toFixed(6)}° E</span>
                  </div>
                </div>
              </div>

              {/* Photo Evidence Simulation */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Photo Evidence (Mandatory for Social Audit)
                </label>
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                  <img
                    src={photoPreview}
                    alt="Inspection Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <span className="bg-white/90 text-slate-800 text-[10px] font-bold px-2.5 py-1 rounded shadow-sm flex items-center gap-1">
                      <Camera className="w-3 h-3 text-[#0047ab]" />
                      Geo-Tagged Image Captured (Watermarked)
                    </span>
                  </div>
                </div>
              </div>

              {/* Inspector Remarks */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Inspection Notes & Remarks
                </label>
                <textarea
                  rows={2}
                  value={inspectorRemarks}
                  onChange={(e) => setInspectorRemarks(e.target.value)}
                  placeholder="Record structural cracks, silt level percentage, inlet choke status..."
                  className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setVerifyingAsset(null)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  Sign & Submit Audit Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
