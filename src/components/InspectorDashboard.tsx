import React, { useState } from 'react';
import { CitizenComplaint, InspectorReport, WaterBody } from '../types/nirikshan';
import { 
  UserCheck, 
  MapPin, 
  Camera, 
  Upload, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Droplet, 
  Activity, 
  Send, 
  X, 
  Clock,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface InspectorDashboardProps {
  complaints: CitizenComplaint[];
  waterBodies: WaterBody[];
  onSubmitInspectionReport: (complaintId: string, report: InspectorReport) => void;
  onSubmitPostWorkVerification: (
    complaintId: string,
    isSatisfactory: boolean,
    photoUrl: string,
    remarks: string
  ) => void;
}

export const InspectorDashboard: React.FC<InspectorDashboardProps> = ({
  complaints,
  waterBodies,
  onSubmitInspectionReport,
  onSubmitPostWorkVerification,
}) => {
  const [selectedComplaint, setSelectedComplaint] = useState<CitizenComplaint | null>(null);
  const [selectedVerificationComplaint, setSelectedVerificationComplaint] = useState<CitizenComplaint | null>(null);

  // Inspection Form States
  const [gps, setGps] = useState<{ lat: number; lng: number }>({ lat: 18.1695, lng: 83.4688 });
  const [isFetchingGps, setIsFetchingGps] = useState(false);
  const [waterPresence, setWaterPresence] = useState<InspectorReport['waterPresence']>('Moderate');
  const [wasteLevel, setWasteLevel] = useState<InspectorReport['wasteLevel']>('Heavy');
  const [wasteType, setWasteType] = useState<InspectorReport['wasteType']>('Plastic & Polythene');
  const [sourcePinDescription, setSourcePinDescription] = useState('');
  const [tdsReadingPpm, setTdsReadingPpm] = useState<number>(650);
  const [sitePhotoUrl, setSitePhotoUrl] = useState(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80'
  );
  const [isComplaintValid, setIsComplaintValid] = useState(true);
  const [validationRemarks, setValidationRemarks] = useState('');

  // Post-work verification states
  const [isSatisfactory, setIsSatisfactory] = useState(true);
  const [verificationPhotoUrl, setVerificationPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
  );
  const [verificationRemarks, setVerificationRemarks] = useState('');

  // Filter tasks
  const pendingInspections = complaints.filter(
    (c) => c.status === 'INSPECTOR_ASSIGNED' || c.status === 'SUBMITTED'
  );
  const pendingVerifications = complaints.filter(
    (c) => c.status === 'VERIFICATION_PENDING' || (c.status === 'WORKER_IN_PROGRESS' && c.workExecution?.status === 'COMPLETED')
  );
  const completedInspections = complaints.filter(
    (c) => c.status === 'INSPECTION_COMPLETED' || c.status === 'WORKER_IN_PROGRESS' || c.status === 'RESOLVED'
  );

  const handleFetchGps = () => {
    setIsFetchingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGps({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
          setIsFetchingGps(false);
        },
        () => {
          setGps({
            lat: Number((18.15 + (Math.random() - 0.5) * 0.05).toFixed(6)),
            lng: Number((83.42 + (Math.random() - 0.5) * 0.05).toFixed(6)),
          });
          setIsFetchingGps(false);
        }
      );
    } else {
      setIsFetchingGps(false);
    }
  };

  const handleOpenInspectionModal = (c: CitizenComplaint) => {
    setSelectedComplaint(c);
    setGps(c.coordinates);
    setSourcePinDescription(`Upstream inflow canal at ${c.locationLandmark}`);
    setValidationRemarks(`Site verified on ground. Citizen complaint authentic and requires immediate intervention.`);
  };

  const handleSubmitInspection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

    const report: InspectorReport = {
      id: `INS-REP-2026-${Math.floor(100 + Math.random() * 900)}`,
      inspectorName: selectedComplaint.assignedInspector || 'Er. M. Chaitanya Varma',
      inspectorPhone: selectedComplaint.assignedInspectorPhone || '+91 98480 33419',
      inspectedAt: timeStr,
      gpsCoordinates: gps,
      waterPresence,
      wasteLevel,
      wasteType,
      sourcePinDescription,
      tdsReadingPpm,
      sitePhotoUrl,
      isComplaintValid,
      validationRemarks,
    };

    onSubmitInspectionReport(selectedComplaint.id, report);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setSelectedComplaint(null);
  };

  const handleConfirmVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVerificationComplaint) return;

    onSubmitPostWorkVerification(
      selectedVerificationComplaint.id,
      isSatisfactory,
      verificationPhotoUrl,
      verificationRemarks || (isSatisfactory ? 'Remedial work inspected on site. Debris removed and flow restored.' : 'Defects found. Work must be re-executed.')
    );
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    setSelectedVerificationComplaint(null);
  };

  return (
    <div className="space-y-6">
      {/* Inspector Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-[#1b2a4a] to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-mono text-emerald-300 border border-white/10">
            <UserCheck className="w-3.5 h-3.5" />
            <span>FIELD WATER QUALITY & INVESTIGATION CELL</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1">
            Field Inspector Mobile Workstation (క్షేత్ర స్థాయి తనిఖీ)
          </h2>
          <p className="text-xs sm:text-sm text-sky-200">
            Mobile-optimized protocol: Log on-site GPS, assess water presence, measure machine TDS level, identify contamination source pin, and verify complaint validity.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-emerald-300 font-bold block">PENDING INVESTIGATION</span>
            <span className="text-lg font-bold text-white">{pendingInspections.length}</span>
          </div>
          <div className="bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-center">
            <span className="text-[10px] text-amber-300 font-bold block">POST-WORK RE-CHECK</span>
            <span className="text-lg font-bold text-white">{pendingVerifications.length}</span>
          </div>
        </div>
      </div>

      {/* 2 Workflow Columns: 1. Inspections to Conduct | 2. Post-Work Verifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Column 1: Pending Site Inspections */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-[#0047ab]">
                <MapPin className="w-4 h-4" />
              </span>
              <span>1. Assigned Site Inspections ({pendingInspections.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">TDS & Waste Source Protocol</span>
          </div>

          <div className="space-y-3">
            {pendingInspections.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                All assigned complaints inspected! Awaiting new dispatches from Nodal Officer.
              </div>
            ) : (
              pendingInspections.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold bg-[#0047ab] text-white px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Action Required
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.locationLandmark}</h4>
                    <p className="text-[11px] text-slate-500">{c.district} • {c.mandal} • {c.village}</p>
                  </div>

                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-sans">
                    "{c.shortDescription}"
                  </p>

                  <div className="text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Citizen: {c.citizenName} ({c.citizenPhone})</span>
                    <span className="font-mono">Lat: {c.coordinates.lat.toFixed(4)}°</span>
                  </div>

                  <button
                    onClick={() => handleOpenInspectionModal(c)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Conduct Field Inspection & Log TDS (तनिखी करें)</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Post-Worker Verification Re-Check */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <CheckCircle2 className="w-4 h-4" />
              </span>
              <span>2. Engineer Work Verification ({pendingVerifications.length})</span>
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Quality Sign-off</span>
          </div>

          <div className="space-y-3">
            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                No completed engineer jobs currently waiting for re-inspection sign-off.
              </div>
            ) : (
              pendingVerifications.map((c) => (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-mono font-bold bg-[#0047ab] text-white px-2 py-0.5 rounded">
                      {c.id}
                    </span>
                    <span className="text-[10px] font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                      Work Completed by Engineer
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{c.locationLandmark}</h4>
                    <p className="text-[11px] text-slate-500">Engineer: {c.assignedEngineer}</p>
                  </div>

                  {/* Before vs After Photos */}
                  {c.workExecution && (
                    <div className="grid grid-cols-2 gap-2 text-center text-[10px]">
                      <div>
                        <span className="font-bold text-slate-500 block mb-0.5">BEFORE WORK</span>
                        <img
                          src={c.workExecution.beforePhotoUrl || c.photoUrl}
                          alt="Before"
                          className="w-full h-20 rounded object-cover border border-slate-200"
                        />
                      </div>
                      <div>
                        <span className="font-bold text-emerald-700 block mb-0.5">AFTER WORK</span>
                        <img
                          src={c.workExecution.afterPhotoUrl || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'}
                          alt="After"
                          className="w-full h-20 rounded object-cover border border-emerald-300"
                        />
                      </div>
                    </div>
                  )}

                  <div className="p-2 bg-slate-50 text-[11px] text-slate-700 rounded border border-slate-100">
                    <strong>Work Summary:</strong> {c.workExecution?.workSummary || 'De-silted check dam and restored free canal flow.'}
                  </div>

                  <button
                    onClick={() => {
                      setSelectedVerificationComplaint(c);
                      setVerificationRemarks('Site verified. Water flow is normal, waste removed and water table stabilized. Case solved.');
                    }}
                    className="w-full py-2 bg-[#0047ab] hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify Quality & Close Case (सत्यापन करें)</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Conduct Field Inspection & TDS Machine Log Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-[#1b2a4a] text-white p-4 sm:p-5 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-emerald-200 uppercase font-bold">
                  NIR-IKSHAN STATUTORY FIELD INSPECTION REPORT
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  Field Investigation Protocol: {selectedComplaint.id}
                </h3>
                <p className="text-xs text-emerald-100">
                  {selectedComplaint.locationLandmark} ({selectedComplaint.district})
                </p>
              </div>
              <button onClick={() => setSelectedComplaint(null)} className="p-1 rounded-lg bg-white/10 hover:bg-white/20">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmitInspection} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* GPS Auto-detect */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block">On-Site GPS Coordinates</label>
                  <span className="font-mono text-slate-800 font-bold text-xs">
                    Lat: {gps.lat}° N, Lng: {gps.lng}° E
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleFetchGps}
                  className="px-3 py-1.5 bg-[#0047ab] text-white rounded-lg font-bold text-xs flex items-center gap-1"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{isFetchingGps ? 'Detecting...' : 'Re-Detect GPS'}</span>
                </button>
              </div>

              {/* Water Presence & Waste Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Water Presence / Quantity (जल की उपस्थिति)
                  </label>
                  <select
                    value={waterPresence}
                    onChange={(e) => setWaterPresence(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Abundant">Abundant Flow (पर्याप्त जल प्रवाह)</option>
                    <option value="Moderate">Moderate Flow (मध्यम प्रवाह)</option>
                    <option value="Low">Low / Depleted (अत्यंत कम जल)</option>
                    <option value="Stagnant Dry">Stagnant Dry Puddle (स्थिर सूखा)</option>
                    <option value="Extinct">Completely Dry Extinct Bed (पूर्णतः सूखा)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Waste / Contamination Level (कचरे का स्तर)
                  </label>
                  <select
                    value={wasteLevel}
                    onChange={(e) => setWasteLevel(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  >
                    <option value="Low">Low (हल्का कचरा)</option>
                    <option value="Moderate">Moderate (मध्यम कचरा)</option>
                    <option value="Heavy">Heavy Contamination (भारी कचरा)</option>
                    <option value="Severe Choke">Severe Choke / Toxic Hazard (गंभीर रुकावट)</option>
                  </select>
                </div>
              </div>

              {/* Waste Type */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Type of Waste / Pollutant (कचरे का प्रकार)
                </label>
                <select
                  value={wasteType}
                  onChange={(e) => setWasteType(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="Plastic & Polythene">Plastic & Polythene Packaging (प्लास्टिक एवं पॉलीथीन)</option>
                  <option value="Domestic Sewage">Domestic Sewage Outfall (घरेलू सीवेज/गंदा पानी)</option>
                  <option value="Industrial Chemical Effluent">Industrial Chemical Effluent (औद्योगिक रसायन एवं डाई)</option>
                  <option value="Agricultural Pesticide Runoff">Agricultural Pesticide Runoff (कीटनाशक एवं रासायनिक बहाव)</option>
                  <option value="Construction Debris & Bitumen">Construction Debris & Bitumen Gravel (निर्माण मलबा)</option>
                  <option value="Dead Biomass & Eutrophic Algae">Dead Biomass & Eutrophic Algae (सड़ा हुआ जलकुंभी एवं शैवाल)</option>
                </select>
              </div>

              {/* Source Pin Description (as requested: "source pin dalana hai ki kachra kahan se aa raha hai") */}
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Waste Source Pin Landmark (कचरा कहाँ से आ रहा है - स्रोत विवरण)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upstream textile dyeing unit ditch #2 / Municipal shandy market culvert"
                  value={sourcePinDescription}
                  onChange={(e) => setSourcePinDescription(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* TDS Water Level (Machine Reading) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5 text-blue-600" />
                    <span>TDS Water Level Machine Reading (TDS मीटर रीडिंग)</span>
                  </label>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    tdsReadingPpm < 300
                      ? 'bg-emerald-100 text-emerald-800'
                      : tdsReadingPpm <= 600
                      ? 'bg-blue-100 text-blue-800'
                      : tdsReadingPpm <= 1200
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {tdsReadingPpm} ppm ({tdsReadingPpm < 300 ? 'Pristine' : tdsReadingPpm <= 600 ? 'Acceptable' : tdsReadingPpm <= 1200 ? 'Moderate Alert' : 'Critical Hazard'})
                  </span>
                </div>

                <input
                  type="range"
                  min={50}
                  max={2500}
                  step={10}
                  value={tdsReadingPpm}
                  onChange={(e) => setTdsReadingPpm(Number(e.target.value))}
                  className="w-full accent-[#0047ab] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>50 ppm (Pure Spring)</span>
                  <span>500 ppm (BIS Safe Limit)</span>
                  <span>1200 ppm (High)</span>
                  <span>2500 ppm (Hazard)</span>
                </div>
              </div>

              {/* Site Photo */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 block">
                  Inspector Site Verification Photo (तनिखी का फोटो प्रमाण)
                </label>
                <div className="relative h-28 w-full rounded-lg overflow-hidden border border-slate-300">
                  <img src={sitePhotoUrl} alt="Inspection Photo" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-mono px-2 py-0.5 rounded">
                    OFFICIAL INSPECTION EVIDENCE
                  </span>
                </div>
              </div>

              {/* Complaint Validity Check */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <label className="text-[11px] font-bold text-slate-800 block">
                  Citizen Complaint Authenticity Check (शिकायत की वैधता)
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="validity"
                      checked={isComplaintValid}
                      onChange={() => setIsComplaintValid(true)}
                      className="text-emerald-600"
                    />
                    <span className="text-emerald-800">Authentic & Valid (शिकायत सही है)</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold cursor-pointer">
                    <input
                      type="radio"
                      name="validity"
                      checked={!isComplaintValid}
                      onChange={() => setIsComplaintValid(false)}
                      className="text-rose-600"
                    />
                    <span className="text-rose-800">Invalid / Disputed (शिकायत अमान्य)</span>
                  </label>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Official findings & remarks for Nodal Officer and Action Engineer..."
                  value={validationRemarks}
                  onChange={(e) => setValidationRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inspection Report to Nodal Officer</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Post-Work Verification Modal */}
      {selectedVerificationComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="bg-[#1b2a4a] text-white p-4 flex items-center justify-between">
              <h4 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Post-Remediation Quality Sign-off: {selectedVerificationComplaint.id}</span>
              </h4>
              <button onClick={() => setSelectedVerificationComplaint(null)}>
                <X className="w-5 h-5 text-white/80 hover:text-white" />
              </button>
            </div>

            <form onSubmit={handleConfirmVerification} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="font-bold text-slate-900 block">{selectedVerificationComplaint.locationLandmark}</span>
                <p className="text-slate-600">Action Worker: {selectedVerificationComplaint.assignedEngineer}</p>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Was the work executed satisfactorily?</label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer text-emerald-800">
                    <input
                      type="radio"
                      name="satisfaction"
                      checked={isSatisfactory}
                      onChange={() => setIsSatisfactory(true)}
                    />
                    <span>Yes, Problem Solved (Case Solved & Closed)</span>
                  </label>
                  <label className="flex items-center gap-1.5 font-bold cursor-pointer text-rose-800">
                    <input
                      type="radio"
                      name="satisfaction"
                      checked={!isSatisfactory}
                      onChange={() => setIsSatisfactory(false)}
                    />
                    <span>No, Unsatisfactory (Re-open: "phir se sahi karo")</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Inspector Verification Remarks</label>
                <textarea
                  rows={3}
                  required
                  value={verificationRemarks}
                  onChange={(e) => setVerificationRemarks(e.target.value)}
                  placeholder="Describe ground verification: e.g. checked on site, desilting complete, water free of trash..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVerificationComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 ${
                    isSatisfactory ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isSatisfactory ? 'Confirm Case Solved' : 'Send Back to Engineer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
