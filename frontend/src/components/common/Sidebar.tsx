import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileText,
  FileSearch,
  TrendingUp,
  Bot,
  Search,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  Layers,
  Database,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
    { id: 'sql', label: 'AI SQL Generator', icon: Database, badge: 'NEW' },
    { id: 'documents', label: 'AI Document Workspace', icon: FileText, badge: 'AI' },
    { id: 'pdf', label: 'PDF AI Intelligence', icon: FileSearch },
    { id: 'finance', label: 'AI Finance Tracker', icon: TrendingUp },
    { id: 'copilot', label: 'Copilot Hub', icon: Bot, highlight: true },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'notifications', label: 'Activity & Alerts', icon: Bell, badgeCount: unreadCount },
    { id: 'settings', label: 'Workspace Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div>
        {/* Brand Logo Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-white text-base tracking-tight block">Nexus AI</span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">
              Enterprise SaaS
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                } ${item.highlight && !isActive ? 'border border-indigo-500/30 bg-indigo-950/20 text-indigo-300' : ''}`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] bg-indigo-500/30 text-indigo-300 font-semibold px-1.5 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                )}
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="text-[10px] bg-rose-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Copilot Quick Banner */}
      <div className="p-3.5 m-3 rounded-xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/40 text-xs">
        <div className="flex items-center space-x-2 text-indigo-300 font-semibold mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Groq LLaMA 3 Active</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Contextually integrated with Document, PDF & Financial telemetry engines.
        </p>
      </div>
    </aside>
  );
};
