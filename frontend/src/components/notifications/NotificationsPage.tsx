import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markNotificationsRead } = useApp();

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-6 h-6 text-indigo-600" />
            <span>Activity & System Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time notifications for subscription anomalies, AI document analysis, and goal milestones
          </p>
        </div>

        <button
          onClick={markNotificationsRead}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          Mark All Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all flex items-start space-x-3.5 ${
              !n.isRead
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950 shadow-xs'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 shrink-0 mt-0.5">
              {n.category === 'subscription_alert' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
              {n.category === 'goal_achieved' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {n.category === 'ai_suggestion' && <Sparkles className="w-4 h-4 text-amber-500" />}
              {!['subscription_alert', 'goal_achieved', 'ai_suggestion'].includes(n.category) && (
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs">{n.title}</h4>
                <span className="text-[10px] text-slate-400">
                  {new Date(n.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
