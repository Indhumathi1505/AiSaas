import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Sparkles, FileText, FileSearch, TrendingUp, ArrowRight } from 'lucide-react';
import { SearchResult } from '../../types';

export const SemanticSearchPage: React.FC = () => {
  const { setActiveTab, setActiveDocument, setActivePdf, documents, pdfDocuments } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'document' | 'pdf' | 'finance'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleExecuteSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch('/api/ai/semantic-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm }),
      });
      const data = await res.json();
      setResults(data.results || []);
      setAiSummary(data.aiSummary || '');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const filtered = results.filter((r) => (filterType === 'all' ? true : r.type === filterType));

  const navigateToSource = (item: SearchResult) => {
    if (item.type === 'document') {
      const doc = documents.find((d) => d.id === item.id);
      if (doc) setActiveDocument(doc);
      setActiveTab('documents');
    } else if (item.type === 'pdf') {
      const pdf = pdfDocuments.find((p) => p.id === item.id);
      if (pdf) setActivePdf(pdf);
      setActiveTab('pdf');
    } else if (item.type === 'finance') {
      setActiveTab('finance');
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <Search className="w-6 h-6 text-indigo-600" />
          <span>Semantic AI Search</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Perform multi-collection vector-style queries across active documents, indexed PDFs, and financial logs.
        </p>
      </div>

      <form onSubmit={handleExecuteSearch} className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-md">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g. Q3 Roadmap AI Strategy, Security Whitepaper TLS, or SaaS Burn Rate..."
          className="flex-1 bg-transparent px-4 py-2 text-xs text-slate-800 outline-none font-medium"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
        >
          {isSearching ? 'Searching...' : 'Search'}
        </button>
      </form>

      {/* Category Filter Chips */}
      <div className="flex space-x-2 text-xs font-semibold">
        {(['all', 'document', 'pdf', 'finance'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-xl capitalize transition-colors ${
              filterType === t ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {aiSummary && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-xs text-indigo-950 space-y-1">
          <div className="flex items-center space-x-1.5 font-bold text-indigo-700">
            <Sparkles className="w-4 h-4" />
            <span>AI Multi-Document Synthesis</span>
          </div>
          <p className="leading-relaxed">{aiSummary}</p>
        </div>
      )}

      {/* Results List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => navigateToSource(item)}
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-indigo-500/50 hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 mt-0.5">
                {item.type === 'document' && <FileText className="w-5 h-5" />}
                {item.type === 'pdf' && <FileSearch className="w-5 h-5" />}
                {item.type === 'finance' && <TrendingUp className="w-5 h-5" />}
              </div>
              <div>
                <div className="font-bold text-slate-800 text-xs flex items-center space-x-2">
                  <span>{item.title}</span>
                  <span className="px-2 py-0.2 bg-slate-100 text-slate-500 text-[10px] rounded uppercase font-semibold">
                    {item.type}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.snippet}</p>
                <div className="text-[10px] text-slate-400 mt-2">Match Relevance: {(item.matchScore * 100).toFixed(0)}% • {item.date}</div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
};
