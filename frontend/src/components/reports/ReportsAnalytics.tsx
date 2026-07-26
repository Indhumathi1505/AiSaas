import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Download, FileText, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const ReportsAnalytics: React.FC = () => {
  const { documents, transactions, financialHealth } = useApp();
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');

  const productivityData = [
    { period: 'Week 1', docsCreated: 4, aiEdits: 18, tasksDone: 12 },
    { period: 'Week 2', docsCreated: 6, aiEdits: 24, tasksDone: 19 },
    { period: 'Week 3', docsCreated: 3, aiEdits: 31, tasksDone: 15 },
    { period: 'Week 4', docsCreated: 8, aiEdits: 42, tasksDone: 28 },
  ];

  const exportReport = (format: 'PDF' | 'Excel') => {
    alert(`Exporting Executive Workspace Report as ${format}...`);
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <span>Workspace Reports & Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Productivity metrics, document revision telemetry, and executive financial reports
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-slate-100 p-1 rounded-xl flex text-xs font-semibold">
            {(['weekly', 'monthly', 'yearly'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  timeframe === t ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={() => exportReport('PDF')}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Productivity Telemetry Bar Chart */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Productivity & AI Copilot Interactions</h3>
            <p className="text-xs text-slate-500">Document edits and AI assistance volume over time</p>
          </div>
          <span className="text-xs font-semibold text-emerald-600 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> High Efficiency Rate
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={productivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="period" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="docsCreated" fill="#6366f1" radius={[6, 6, 0, 0]} name="Docs Created" />
              <Bar dataKey="aiEdits" fill="#10b981" radius={[6, 6, 0, 0]} name="AI Copilot Assists" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Document & Finance Summary Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Document Readability & Governance</span>
          </h3>
          <div className="space-y-2 text-xs">
            {documents.map((d) => (
              <div key={d.id} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">{d.title}</div>
                  <div className="text-[10px] text-slate-400">{d.versions.length} Revisions</div>
                </div>
                <div className="text-right font-semibold text-emerald-600">
                  Readability: {d.readabilityScore}/100
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Financial Burn & Savings Index</span>
          </h3>
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-2">
            <div className="font-bold text-emerald-950">
              Financial Health Rating: {financialHealth?.healthScore}/100
            </div>
            <p>{financialHealth?.savingsRecommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
