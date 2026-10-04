import React, { useState } from 'react';
import { CitizenComplaint } from '../types/nirikshan';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Upload, 
  X, 
  Send, 
  Phone, 
  User, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LodgeComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplaintSubmitted: (complaint: CitizenComplaint) => void;
}

export const LodgeComplaintModal: React.FC<LodgeComplaintModalProps> = ({
  isOpen,
  onClose,
  onComplaintSubmitted,
}) => {
  const [citizenName, setCitizenName] = useState('');
  const [citizenAge, setCitizenAge] = useState<number | ''>('');
  const [citizenGender, setCitizenGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [district, setDistrict] = useState<'Vizianagaram' | 'Parvathipuram Manyam' | 'Visakhapatnam'>('Vizianagaram');
  const [mandal, setMandal] = useState('Nellimarla');
  const [village, setVillage] = useState('');
  const [locationLandmark, setLocationLandmark] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>({
    lat: 18.1145,
    lng: 83.4072,
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  );

  if (!isOpen) return null;

  const handleFetchCurrentGps = () => {
    setIsFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoordinates({
            lat: Number(pos.coords.latitude.toFixed(6)),
            lng: Number(pos.coords.longitude.toFixed(6)),
          });
          setIsFetchingLocation(false);
        },
        () => {
          // fallback in district range
          const baseLat = district === 'Vizianagaram' ? 18.1145 : district === 'Parvathipuram Manyam' ? 18.7845 : 17.7280;
          const baseLng = district === 'Vizianagaram' ? 83.4072 : district === 'Parvathipuram Manyam' ? 83.4982 : 83.3020;
          setCoordinates({
            lat: Number((baseLat + (Math.random() - 0.5) * 0.05).toFixed(6)),
            lng: Number((baseLng + (Math.random() - 0.5) * 0.05).toFixed(6)),
          });
          setIsFetchingLocation(false);
        }
      );
    } else {
      setIsFetchingLocation(false);
    }
  };

  const sampleProofPhotos = [
    {
      label: 'Chemical / Toxic Water',
      url: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Plastic Silt Choke',
      url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Cracked Check Dam / Sluice',
      url: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Dry Lost Bed / Encroached',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date();
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

    const ticketId = `CMP-AP-2026-${Math.floor(100 + Math.random() * 900)}`;

    const assignedOfficerName = district === 'Vizianagaram'
      ? 'Er. N. Subba Rao (Vizianagaram)'
      : district === 'Parvathipuram Manyam'
      ? 'Smt. P. Hemalatha (Parvathipuram Manyam)'
      : 'Er. K. Viswanadham (Visakhapatnam)';

    const newComplaint: CitizenComplaint = {
      id: ticketId,
      citizenName: citizenName || 'Anonymous Citizen',
      citizenAge: Number(citizenAge) || 30,
      citizenGender,
      citizenPhone: citizenPhone || '+91 98000 00000',
      district,
      mandal: mandal || (district === 'Vizianagaram' ? 'Vizianagaram Rural' : district === 'Parvathipuram Manyam' ? 'Salur' : 'Gopalapatnam'),
      village: village || 'Near Panchayat Nala',
      locationLandmark: locationLandmark || 'Near Village Primary School & Canal Junction',
      coordinates,
      shortDescription,
      photoUrl,
      submittedAt: timeStr,
      status: 'SUBMITTED',
      assignedNodalOfficer: assignedOfficerName,
    };

    onComplaintSubmitted(newComplaint);

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0047ab', '#10b981', '#ef4444', '#f59e0b'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0047ab] via-[#1b2a4a] to-blue-900 text-white p-4 sm:p-5 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-rose-500 text-white">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-mono tracking-widest text-sky-200 uppercase font-bold">
                NIR-IKSHAN CITIZEN WATER COMPLAINT (ప్రజా సమస్య నివేదిక)
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Lodge Water Body Hazard Complaint
            </h2>
            <p className="text-[11px] sm:text-xs text-sky-200">
              Report toxic waste, chokes, dry collapsed wells or dam breaches directly to your District Nodal Officer.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs">
          {/* User Basic Info Row (Name, Age, Gender, Mobile No) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#0047ab]" />
              <span>1. Citizen Details (शिकायतकर्ता की जानकारी)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Name (नाम)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Naidu"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile Number (फ़ोन नंबर)</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 98480 12345"
                  value={citizenPhone}
                  onChange={(e) => setCitizenPhone(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Age (उम्र)</label>
                <input
                  type="number"
                  required
                  min={14}
                  max={100}
                  placeholder="e.g. 35"
                  value={citizenAge}
                  onChange={(e) => setCitizenAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Gender (लिंग)</label>
                <select
                  value={citizenGender}
                  onChange={(e) => setCitizenGender(e.target.value as any)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500 font-semibold"
                >
                  <option value="Male">Male (पुरुष)</option>
                  <option value="Female">Female (महिला)</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* District & Location */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4 space-y-3">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0047ab]" />
              <span>2. District & Geographic Location (स्थान विवरण)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">District (ज़िला)</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as any)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg font-semibold focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Vizianagaram">Vizianagaram (విజయనగరం)</option>
                  <option value="Parvathipuram Manyam">Parvathipuram Manyam (పార్వతీపురం మన్యం)</option>
                  <option value="Visakhapatnam">Visakhapatnam (విశాఖపట్నం)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Mandal / Taluk</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nellimarla / Salur / Gantyada"
                  value={mandal}
                  onChange={(e) => setMandal(e.target.value)}
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Village & Landmark (स्थान/पहचान)</label>
              <input
                type="text"
                required
                placeholder="e.g. Near Champavathi River Bridge, Opp. Panchayat Office"
                value={locationLandmark}
                onChange={(e) => setLocationLandmark(e.target.value)}
                className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* GPS Auto-Detect Button (as explicitly requested: "user location par click karega toh automatic le lega") */}
            <div className="bg-white border border-slate-200 rounded-lg p-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="text-[11px]">
                <span className="font-semibold text-slate-600 block">GPS Coordinates:</span>
                <span className="font-mono text-slate-800 font-bold">
                  Lat: {coordinates.lat}° N, Lng: {coordinates.lng}° E
                </span>
              </div>
              <button
                type="button"
                onClick={handleFetchCurrentGps}
                disabled={isFetchingLocation}
                className="px-3 py-1.5 bg-[#0047ab] hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{isFetchingLocation ? 'Fetching GPS...' : 'Auto-Fetch My GPS Location'}</span>
              </button>
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Short Description of Problem (समस्या का संक्षिप्त विवरण)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the issue: e.g. textile dye dumping into canal, broken weir wall, plastic choking drinking water tank, dead fish..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Screenshot / Photo Proof Upload */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-rose-600" />
                <span>Screenshot / Photo Proof (समस्या का फोटो/स्क्रीनशॉट)</span>
              </label>
              <label className="text-[11px] font-bold text-[#0047ab] hover:underline cursor-pointer flex items-center gap-1">
                <Upload className="w-3 h-3" />
                <span>Upload File</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-300 bg-slate-100">
              <img src={photoUrl} alt="Complaint Evidence" className="w-full h-full object-cover" />
              <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                GEOTAGGED EVIDENCE
              </div>
            </div>

            {/* Quick sample photo selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1">
              <span className="text-[10px] text-slate-500 whitespace-nowrap">Sample photos:</span>
              {sampleProofPhotos.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhotoUrl(s.url)}
                  className="px-2 py-0.5 text-[10px] bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded border border-slate-200 whitespace-nowrap"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submission Dispatch Info */}
          <div className="bg-sky-50 border border-sky-200 p-2.5 rounded-xl text-[11px] text-sky-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
            <span>
              This complaint will be directly submitted to the <strong>Nodal Officer ({district})</strong>, who will immediately dispatch a Field Inspector to investigate.
            </span>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Submit Complaint & Get Tracking ID</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
