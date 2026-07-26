import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, ShieldCheck, User, Bot, Lock, Save, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, auditLogs } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [workspaceName, setWorkspaceName] = useState(user?.workspaceName || '');
  const [aiModel, setAiModel] = useState(user?.aiModel || 'gemini-3.6-flash');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled ?? true);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      workspaceName,
      aiModel,
      twoFactorEnabled,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          <span>Workspace & Profile Settings</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage workspace parameters, role-based security, two-factor authentication, and AI model defaults
        </p>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div className="space-y-4 text-xs">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-600" />
            <span>UserProfile Details</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Email Address (Read-Only)</label>
              <input
                type="text"
                value={user?.email || 'indhumathirsj@gmail.com'}
                disabled
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-lg p-2.5 text-xs outline-none font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Active AI Engine</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none font-medium"
              >
                <option value="gemini-3.6-flash">Gemini 3.6 Flash (Recommended Default)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security & 2FA */}
        <div className="space-y-3 text-xs pt-2">
          <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Security & Authentication</span>
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="font-bold text-slate-800">Two-Factor Authentication (2FA)</div>
              <p className="text-[11px] text-slate-500 mt-0.5">Require OTP verification upon enterprise session login.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-2"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : <Save className="w-4 h-4" />}
            <span>{saved ? 'Changes Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Security Audit Trail */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <Lock className="w-4 h-4 text-indigo-600" />
          <span>Security & Audit Log Trail</span>
        </h3>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-800 flex items-center space-x-2">
                  <span>{log.action}</span>
                  <span className="text-[10px] text-slate-400">IP: {log.ipAddress}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{log.details}</p>
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
