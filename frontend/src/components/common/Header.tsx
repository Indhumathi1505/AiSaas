import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bot,
  Bell,
  Sparkles,
  Sun,
  Moon,
  ChevronDown,
  ShieldCheck,
  Building2,
  Check,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    user,
    isCopilotOpen,
    setIsCopilotOpen,
    notifications,
    markNotificationsRead,
    setActiveTab,
    updateProfile,
    logout,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const toggleTheme = () => {
    if (!user) return;
    const nextTheme = user.theme === 'dark' ? 'light' : 'dark';
    updateProfile({ theme: nextTheme });
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Search Trigger & Workspace Label */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-sm font-medium">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>{user?.workspaceName || 'Personal AI Workspace'}</span>
          <span className="text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
            Personal
          </span>
        </div>


      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-3">
        {/* Copilot Toggle */}
        <button
          onClick={() => setIsCopilotOpen(!isCopilotOpen)}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-xs ${
            isCopilotOpen
              ? 'bg-indigo-600 text-white shadow-indigo-200'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${isCopilotOpen ? 'animate-spin' : ''}`} />
          <span>Copilot</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <span className="font-semibold text-slate-800">Notifications ({notifications.length})</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markNotificationsRead}
                    className="text-indigo-600 hover:underline flex items-center space-x-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      setShowNotifMenu(false);
                      setActiveTab('notifications');
                    }}
                    className={`px-4 py-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="font-semibold text-slate-800 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setShowNotifMenu(false);
                    setActiveTab('notifications');
                  }}
                  className="text-indigo-600 hover:underline font-medium"
                >
                  View All Activity
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          title="Toggle Theme"
        >
          {user?.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Profile Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center space-x-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <img
              src={user?.avatarUrl}
              alt={user?.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
            />
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-800 leading-tight">{user?.name}</div>
              <div className="text-[10px] text-slate-500">{user?.email}</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="font-semibold text-slate-800">{user?.name}</p>
                <p className="text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-medium">
                  <ShieldCheck className="w-3 h-3" />
                  <span>2FA Verified</span>
                </div>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab('settings');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Workspace Settings
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setActiveTab('reports');
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Executive Reports
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-600"
                >
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
