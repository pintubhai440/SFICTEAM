import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, AlertCircle, X, KeyRound } from 'lucide-react';
import { UserRoleType } from '../types/nirikshan';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole: UserRoleType;
  onLoginSuccess: (role: UserRoleType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  targetRole,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@nir.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const getRoleTitle = (role: UserRoleType) => {
    switch (role) {
      case 'admin':
        return 'State Administrator (AP Water Resources)';
      case 'nodal_vizianagaram':
        return 'Nodal Officer (Vizianagaram District)';
      case 'nodal_parvathipuram':
        return 'Nodal Officer (Parvathipuram Manyam District)';
      case 'inspector':
        return 'Field Water Inspector';
      case 'engineer':
        return 'Action Engineer / Worker';
      default:
        return 'Official Access';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() === 'admin@nir.com' && password.trim() === '1234') {
      setError('');
      onLoginSuccess(targetRole);
      onClose();
    } else {
      setError('Invalid credentials! Please use username: admin@nir.com and password: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b2a4a] via-[#0047ab] to-sky-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-white/10 text-sky-200">
                <ShieldCheck className="w-5 h-5 text-sky-300" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Nir-ikshan Official Portal</h3>
                <p className="text-[11px] text-sky-200">Govt of Andhra Pradesh • Water Resources</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900">
            <span className="font-bold block text-blue-950 mb-0.5">Authorizing Role:</span>
            <span className="font-semibold text-[#0047ab]">{getRoleTitle(targetRole)}</span>
            <div className="mt-1 text-[11px] text-slate-600 font-mono">
              Default credentials: <span className="font-bold text-slate-800">admin@nir.com</span> | Password: <span className="font-bold text-slate-800">1234</span>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">User Email / Username</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nir.com"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="1234"
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-[#0047ab] hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              <span>Secure Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
