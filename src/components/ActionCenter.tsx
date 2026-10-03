import React, { useState } from 'react';
import { MicroWatershed, ActionTask, FieldProgressLog } from '../types/watershed';
import { 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  User, 
  Building, 
  Calendar, 
  AlertTriangle, 
  UploadCloud, 
  FileCheck,
  Plus,
  ClipboardList,
  MapPin,
  ChevronDown,
  ChevronUp,
  Camera,
  CheckCircle2,
  FileText,
  Activity,
  Send,
  Sliders
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionCenterProps {
  watersheds: MicroWatershed[];
  selectedWatershedId: string;
  onSelectWatershed: (id: string) => void;
  userRole: string;
}

export const ActionCenter: React.FC<ActionCenterProps> = ({
  watersheds,
  selectedWatershedId,
  onSelectWatershed,
  userRole,
}) => {
  const currentWs = watersheds.find((w) => w.id === selectedWatershedId) || watersheds[0];
  const [tasks, setTasks] = useState<ActionTask[]>(currentWs.tasks);
  
  // Close Task Modal
  const [selectedTaskToClose, setSelectedTaskToClose] = useState<ActionTask | null>(null);
  const [closeRemarks, setCloseRemarks] = useState<string>('');

  // Field Verification Log Modal
  const [loggingTask, setLoggingTask] = useState<ActionTask | null>(null);
  const [logOfficerName, setLogOfficerName] = useState<string>('');
  const [logStage, setLogStage] = useState<FieldProgressLog['stage']>('Excavation & Silt Removal');
  const [logProgressPercent, setLogProgressPercent] = useState<number>(50);
  const [logSiteNote, setLogSiteNote] = useState<string>('');
  const [logGps, setLogGps] = useState<{ lat: number; lng: number }>({
    lat: currentWs.coordinates.lat,
    lng: currentWs.coordinates.lng,
  });

  // Expanded logs drawer state for each task
  const [expandedLogTaskIds, setExpandedLogTaskIds] = useState<Record<string, boolean>>({
    'TASK-KLR-01': true, // open first task by default
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync if currentWs changed
  React.useEffect(() => {
    setTasks(currentWs.tasks);
  }, [currentWs]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const toggleExpandLogs = (taskId: string) => {
    setExpandedLogTaskIds((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  // Open Log Modal
  const handleOpenLogModal = (task: ActionTask) => {
    setLoggingTask(task);
    setLogOfficerName(task.assignedOfficer || userRole);
    // Find latest progress or default
    const latestLog = task.progressLogs?.[task.progressLogs.length - 1];
    setLogProgressPercent(latestLog ? Math.min(100, latestLog.percentageComplete + 20) : 40);
    setLogSiteNote('');
    setLogGps({
      lat: Number((currentWs.coordinates.lat + (Math.random() - 0.5) * 0.005).toFixed(6)),
      lng: Number((currentWs.coordinates.lng + (Math.random() - 0.5) * 0.005).toFixed(6)),
    });
  };

  // Handle GPS simulation update
  const handleRefreshGps = () => {
    setLogGps({
      lat: Number((currentWs.coordinates.lat + (Math.random() - 0.5) * 0.003).toFixed(6)),
      lng: Number((currentWs.coordinates.lng + (Math.random() - 0.5) * 0.003).toFixed(6)),
    });
  };

  // Submit Field Verification Log
  const handleSubmitProgressLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loggingTask) return;

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

    const newLog: FieldProgressLog = {
      id: `LOG-${Date.now().toString().slice(-5)}`,
      timestamp: timeString,
      officerName: logOfficerName || userRole,
      role: userRole,
      note: logSiteNote,
      stage: logStage,
      percentageComplete: logProgressPercent,
      gpsCoordinates: logGps,
    };

    const updatedTasks = tasks.map((t) => {
      if (t.id === loggingTask.id) {
        const existingLogs = t.progressLogs || [];
        const nextStatus = logProgressPercent >= 100 ? 'EVIDENCE_SUBMITTED' : 'IN_PROGRESS';
        return {
          ...t,
          status: nextStatus as any,
          evidenceSummary: logSiteNote,
          progressLogs: [...existingLogs, newLog],
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    currentWs.tasks = updatedTasks;
    // ensure logs drawer is opened
    setExpandedLogTaskIds((prev) => ({ ...prev, [loggingTask.id]: true }));
    setLoggingTask(null);

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#0284c7', '#0047ab', '#10b981'],
    });

    triggerToast(`Field Verification Log recorded with timestamp & GPS coordinates for ${loggingTask.id}!`);
  };

  // Open Close Modal
  const handleOpenCloseModal = (task: ActionTask) => {
    setSelectedTaskToClose(task);
    setCloseRemarks(task.evidenceSummary || 'Work inspected and physically completed on-site.');
  };

  // Confirm Close Task
  const handleConfirmCloseTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToClose) return;

    const now = new Date();
    const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} IST`;

    const closingLog: FieldProgressLog = {
      id: `LOG-CLOSE-${Date.now().toString().slice(-4)}`,
      timestamp: timeString,
      officerName: userRole,
      role: userRole,
      note: `Final sign-off & social audit closure: ${closeRemarks}`,
      stage: 'Community Social Audit',
      percentageComplete: 100,
    };

    const updatedTasks = tasks.map((t) => {
      if (t.id === selectedTaskToClose.id) {
        const existingLogs = t.progressLogs || [];
        return {
          ...t,
          status: 'VERIFIED_CLOSED' as const,
          evidenceSummary: closeRemarks,
          verifiedDate: new Date().toISOString().slice(0, 10),
          progressLogs: [...existingLogs, closingLog],
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    currentWs.tasks = updatedTasks;
    setSelectedTaskToClose(null);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#0284c7', '#3b82f6'],
    });

    triggerToast(`Action Task ${selectedTaskToClose.id} verified and officially closed!`);
  };

  const getPriorityBadge = (p: ActionTask['priority']) => {
    switch (p) {
      case 'CRITICAL':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'HIGH':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MEDIUM':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusBadge = (s: ActionTask['status']) => {
    switch (s) {
      case 'VERIFIED_CLOSED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'IN_PROGRESS':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'EVIDENCE_SUBMITTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'PENDING':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b2a4a] text-white px-5 py-3 rounded-xl shadow-xl border border-sky-400 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div className="text-xs">
            <div className="font-bold text-white">Action Center Notification</div>
            <div className="text-blue-200">{toastMessage}</div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-[#0047ab]" />
            Micro-Watershed Action Center & Field Verification Log (कार्य योजना एवं फील्ड सत्यापन)
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Track-B Governance Framework: Capture timestamped progress logs, geo-tagged site notes, and physical verification audits.
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

      {/* Task Summary Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs text-slate-500">Total Action Items</span>
          <div className="text-2xl font-bold font-mono text-slate-900 mt-1">{tasks.length}</div>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs text-rose-700 font-semibold">Critical Overdue/Active</span>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {tasks.filter((t) => t.priority === 'CRITICAL' && t.status !== 'VERIFIED_CLOSED').length}
          </div>
        </div>
        <div className="bg-sky-50 border border-sky-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs text-sky-800 font-semibold">Field In-Progress</span>
          <div className="text-2xl font-bold font-mono text-sky-700 mt-1">
            {tasks.filter((t) => t.status === 'IN_PROGRESS').length}
          </div>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl shadow-xs">
          <span className="text-xs text-emerald-800 font-semibold">Verified & Closed</span>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {tasks.filter((t) => t.status === 'VERIFIED_CLOSED').length}
          </div>
        </div>
      </div>

      {/* Tasks List with Field Verification Logs */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Assigned Action Recommendations for {currentWs.name}
            </h3>
            <p className="text-xs text-slate-500">
              Roadmap §10 & §11: Log timestamped site observations to verify ongoing desiltation, civil repairs, or monitoring.
            </p>
          </div>
          <span className="text-xs font-mono bg-white px-2.5 py-1 rounded border border-slate-200 text-slate-700 font-semibold flex items-center gap-1">
            <ClipboardList className="w-3.5 h-3.5 text-blue-600" />
            Field Verification Trail Active
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.map((task) => {
            const logs = task.progressLogs || [];
            const latestLog = logs[logs.length - 1];
            const currentProgress = task.status === 'VERIFIED_CLOSED' ? 100 : (latestLog?.percentageComplete || 0);
            const isLogsExpanded = !!expandedLogTaskIds[task.id];

            return (
              <div key={task.id} className="p-5 hover:bg-slate-50/60 transition-colors space-y-4">
                {/* Main Task Header Row */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {task.category}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {task.id}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {task.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        <strong>Agency:</strong> {task.responsibleAgency}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <strong>Officer:</strong> {task.assignedOfficer}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <strong>Deadline:</strong> {task.deadline}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2 max-w-md">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-slate-500 font-medium">Physical Completion:</span>
                        <span className="font-mono font-bold text-[#0047ab]">{currentProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            currentProgress === 100
                              ? 'bg-emerald-500'
                              : currentProgress > 50
                              ? 'bg-[#0047ab]'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${currentProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="shrink-0 flex flex-wrap md:flex-col items-end gap-2">
                    <button
                      onClick={() => handleOpenLogModal(task)}
                      className="py-1.5 px-3 text-xs font-bold text-[#0047ab] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Log Site Note / Update</span>
                    </button>

                    {task.status !== 'VERIFIED_CLOSED' ? (
                      <button
                        onClick={() => handleOpenCloseModal(task)}
                        className="py-1.5 px-3 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1"
                      >
                        <FileCheck className="w-3.5 h-3.5" />
                        <span>Sign & Close with Evidence</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        Closed & Verified
                      </span>
                    )}

                    {logs.length > 0 && (
                      <button
                        onClick={() => toggleExpandLogs(task.id)}
                        className="text-xs text-slate-500 hover:text-slate-800 font-semibold flex items-center gap-1 mt-1"
                      >
                        <span>{isLogsExpanded ? 'Hide' : 'View'} Logs ({logs.length})</span>
                        {isLogsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                </div>

                {/* Collapsible Field Verification Log Timeline Drawer */}
                {isLogsExpanded && logs.length > 0 && (
                  <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <ClipboardList className="w-4 h-4 text-[#0047ab]" />
                        Field Verification Trail ({logs.length} Timestamped Entries)
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Auditable Site Log
                      </span>
                    </div>

                    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-blue-200 pl-6">
                      {logs.map((log, idx) => (
                        <div key={log.id || idx} className="relative space-y-1 bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                          {/* Timeline dot */}
                          <div className="absolute -left-6 top-3 w-2.5 h-2.5 rounded-full bg-[#0047ab] ring-4 ring-white" />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">
                                {log.officerName}
                              </span>
                              <span className="text-[10px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 rounded border border-blue-200">
                                {log.stage}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {log.timestamp}
                            </span>
                          </div>

                          <p className="text-xs text-slate-700 leading-relaxed font-sans pt-1">
                            {log.note}
                          </p>

                          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100 font-mono">
                            <span className="flex items-center gap-1 text-[10px]">
                              <MapPin className="w-3 h-3 text-sky-600" />
                              {log.gpsCoordinates
                                ? `GPS: ${log.gpsCoordinates.lat.toFixed(4)}°N, ${log.gpsCoordinates.lng.toFixed(4)}°E`
                                : 'GPS: Verified on Site'}
                            </span>
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                              Milestone: {log.percentageComplete}% Complete
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Field Verification Log Entry Modal */}
      {loggingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="bg-[#1b2a4a] text-white p-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-300 uppercase tracking-wider block">
                  FIELD VERIFICATION & SITE NOTE CAPTURE
                </span>
                <h3 className="text-base font-bold text-white">
                  Log Task Progress Update
                </h3>
              </div>
              <button
                onClick={() => setLoggingTask(null)}
                className="text-slate-300 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitProgressLog} className="p-5 space-y-4">
              {/* Task reference */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase block">Selected Action Task:</span>
                <div className="font-bold text-slate-900">{loggingTask.title}</div>
                <div className="text-[11px] text-blue-700 font-mono">
                  ID: {loggingTask.id} • Assigned: {loggingTask.assignedOfficer}
                </div>
              </div>

              {/* Officer Name & Milestone Stage */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Inspecting Officer / Auditor
                  </label>
                  <input
                    type="text"
                    required
                    value={logOfficerName}
                    onChange={(e) => setLogOfficerName(e.target.value)}
                    placeholder="e.g. S. Nagaraj (AEE)"
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Milestone Stage
                  </label>
                  <select
                    value={logStage}
                    onChange={(e) => setLogStage(e.target.value as any)}
                    className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="Excavation & Silt Removal">Excavation & Silt Removal</option>
                    <option value="Masonry & Bund Reinforcement">Masonry & Bund Reinforcement</option>
                    <option value="Filter Media Refit">Filter Media Refit</option>
                    <option value="Pre-Monsoon Catchment Clearing">Pre-Monsoon Catchment Clearing</option>
                    <option value="Hydraulic Testing">Hydraulic Testing</option>
                    <option value="Community Social Audit">Community Social Audit</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span>Physical Completion Progress:</span>
                  <span className="font-mono text-[#0047ab] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {logProgressPercent}% Complete
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={logProgressPercent}
                  onChange={(e) => setLogProgressPercent(Number(e.target.value))}
                  className="w-full accent-[#0047ab] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>0% Initiated</span>
                  <span>50% Mid-way</span>
                  <span>100% Fully Executed</span>
                </div>
              </div>

              {/* Geo-tag & Timestamp auto stamps */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-slate-400 font-sans">GPS Geo-Tag</span>
                    <button
                      type="button"
                      onClick={handleRefreshGps}
                      className="text-[10px] text-[#0047ab] font-sans hover:underline flex items-center gap-0.5"
                    >
                      <MapPin className="w-2.5 h-2.5" />
                      Sync
                    </button>
                  </div>
                  <div className="text-slate-800 text-[11px] font-semibold">
                    {logGps.lat.toFixed(4)}°N, {logGps.lng.toFixed(4)}°E
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                  <span className="text-[10px] text-slate-400 font-sans block mb-0.5">Auto Timestamp</span>
                  <div className="text-slate-800 text-[11px] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    Live IST Timestamp
                  </div>
                </div>
              </div>

              {/* Site Note Textarea */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Site Observation Note & Measurements (Mandatory)
                </label>
                <textarea
                  rows={3}
                  required
                  value={logSiteNote}
                  onChange={(e) => setLogSiteNote(e.target.value)}
                  placeholder="Record machinery deployed, silt volume extracted (tonnes), filter media condition, labor count, contractor issues..."
                  className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setLoggingTask(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  Save & Append Verification Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Task Modal */}
      {selectedTaskToClose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900">
                Sign & Close Task: {selectedTaskToClose.id}
              </h3>
              <button
                onClick={() => setSelectedTaskToClose(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmCloseTask} className="space-y-3">
              <div className="text-xs text-slate-700 font-semibold bg-slate-50 p-2 rounded-lg border border-slate-200">
                {selectedTaskToClose.title}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Verified Physical Evidence / Inspection Sign-off
                </label>
                <textarea
                  rows={3}
                  value={closeRemarks}
                  onChange={(e) => setCloseRemarks(e.target.value)}
                  placeholder="Record verification details, e.g. excavation completed, invoice verified, geofenced inspection logged..."
                  className="w-full text-xs text-slate-800 border border-slate-300 rounded-lg p-2.5 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedTaskToClose(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Confirm Verified Closure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
