import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  FileText,
  FileSearch,
  TrendingUp,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  CheckCircle2,
  DollarSign,
  Activity,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const Dashboard: React.FC = () => {
  const {
    user,
    documents,
    pdfDocuments,
    transactions,
    financialHealth,
    setActiveTab,
    setActiveDocument,
    setActivePdf,
    createDocument,
    setIsCopilotOpen,
  } = useApp();

  const handleNewDoc = async () => {
    const doc = await createDocument('New Strategic Note', '# New Strategic Note\n\nDrafting workspace objectives...');
    setActiveTab('documents');
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + b.amount, 0);

  const netSavings = totalIncome - totalExpense;

  const chartData = [
    { name: 'This Month', income: totalIncome, expense: totalExpense },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Executive AI Greeting Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Gemini 3.6 Personal AI Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'User'} 👋
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
              Your Personal AI Workspace is ready. Financial health is rated{' '}
              <span className="text-emerald-400 font-semibold">{financialHealth?.healthScore || 85}/100</span> with active personal finance telemetry.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleNewDoc}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl backdrop-blur-md border border-white/15 transition-all flex items-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Ask Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Active Notes</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">{documents.length}</div>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Ready for AI
            </span>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Indexed PDFs</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">{pdfDocuments.length}</div>
            <span className="text-[10px] text-indigo-600 font-medium flex items-center mt-1">
              <CheckCircle2 className="w-3 h-3 mr-0.5" /> Full Text AI Analyzed
            </span>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
            <FileSearch className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Financial Health Score</span>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {financialHealth?.healthScore || 85}
              <span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center mt-1">
              <ShieldCheck className="w-3 h-3 mr-0.5" /> Gemini Verified
            </span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-slate-500">Net Savings Balance</span>
            <div className={`text-2xl font-bold mt-1 ${netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ${netSavings.toLocaleString()}
            </div>
            <span className="text-[10px] text-indigo-600 font-medium flex items-center mt-1">
              <DollarSign className="w-3 h-3 mr-0.5" /> Personal Income - Expenses
            </span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Section: Financial Cash Flow Chart & Recent Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Financial Cash Flow Chart (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Financial Cash Flow Telemetry</h3>
              <p className="text-xs text-slate-500">Monthly Revenue vs Operational Expenditures</p>
            </div>
            <button
              onClick={() => setActiveTab('finance')}
              className="text-xs text-indigo-600 font-semibold hover:underline"
            >
              Open Finance Hub →
            </button>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
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
                <Bar dataKey="income" fill="#6366f1" radius={[6, 6, 0, 0]} name="Gross Income ($)" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} name="Expenditure ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: AI Telemetry & Insights */}
        <div className="bg-gradient-to-b from-indigo-900 to-slate-900 text-white rounded-2xl p-6 border border-indigo-800/50 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>AI Insights Engine</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">SaaS License Optimization</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              {financialHealth?.unusedSubscriptionAlert ||
                'Detected $165/mo in inactive SaaS seats (Figma Seat #4). Deactivating unutilized seats will increase net profit margin.'}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-800/60 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Cash Flow Status:</span>
              <span className="font-semibold text-emerald-400">{financialHealth?.cashFlowStatus}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Next Month Est. Expense:</span>
              <span className="font-semibold text-slate-200">
                ${financialHealth?.expensePredictionNextMonth?.toLocaleString() || '8,500'}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('finance')}
              className="w-full mt-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
            >
              Optimize Subscriptions
            </button>
          </div>
        </div>
      </div>

      {/* Recent Workspace Documents Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Workspace Documents</h3>
            <p className="text-xs text-slate-500">Collaborative drafts and technical specifications</p>
          </div>
          <button
            onClick={() => setActiveTab('documents')}
            className="text-xs text-indigo-600 font-semibold hover:underline"
          >
            View All Documents →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {documents.slice(0, 3).map((doc) => (
            <div
              key={doc.id}
              onClick={() => {
                setActiveDocument(doc);
                setActiveTab('documents');
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer bg-slate-50/50 hover:bg-white group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-100 text-indigo-700">
                  {doc.folder}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {new Date(doc.updatedAt).toLocaleDateString()}
                </span>
              </div>
              <h4 className="font-bold text-slate-800 text-xs group-hover:text-indigo-600 transition-colors line-clamp-1">
                {doc.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{doc.content.replace(/#/g, '')}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
