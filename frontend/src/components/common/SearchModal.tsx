import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Sparkles, FileText, FileSearch, TrendingUp, ArrowRight } from 'lucide-react';
import { SearchResult } from '../../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, setActiveDocument, setActivePdf, documents, pdfDocuments } = useApp();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'document' | 'pdf' | 'finance'>('all');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const handleSearch = async (searchTerm: string) => {
    setQuery(searchTerm);
    if (!searchTerm.trim()) {
      setResults([]);
      setAiSummary('');
      return;
    }

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
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isSearchOpen) return null;

  const filteredResults = results.filter((r) => (filter === 'all' ? true : r.type === filter));

  const navigateToSource = (item: SearchResult) => {
    setIsSearchOpen(false);
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-indigo-600 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search documents, PDFs, financial records, or ask Gemini..."
            className="w-full bg-transparent text-slate-800 text-sm outline-none placeholder:text-slate-400 font-medium"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 hover:bg-slate-200 text-slate-500 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Categories */}
        <div className="px-4 py-2 bg-white border-b border-slate-100 flex items-center space-x-2 text-xs font-medium">
          {(['all', 'document', 'pdf', 'finance'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1 rounded-full capitalize transition-colors ${
                filter === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {aiSummary && (
            <div className="p-3.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 text-xs text-indigo-900">
              <div className="flex items-center space-x-1.5 font-semibold text-indigo-700 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>AI Answer Synthesis</span>
              </div>
              <p className="leading-relaxed">{aiSummary}</p>
            </div>
          )}

          {isSearching ? (
            <div className="text-center py-8 text-xs text-slate-500">Searching workspace with Gemini...</div>
          ) : filteredResults.length > 0 ? (
            <div className="space-y-2">
              {filteredResults.map((res) => (
                <div
                  key={res.id}
                  onClick={() => navigateToSource(res)}
                  className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div className="flex items-start space-x-3">
                    <div className="mt-0.5 p-2 bg-indigo-50 rounded-lg text-indigo-600 shrink-0">
                      {res.type === 'document' && <FileText className="w-4 h-4" />}
                      {res.type === 'pdf' && <FileSearch className="w-4 h-4" />}
                      {res.type === 'finance' && <TrendingUp className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-xs flex items-center space-x-2">
                        <span>{res.title}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.2 rounded uppercase">
                          {res.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{res.snippet}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors shrink-0 ml-2" />
                </div>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-8 text-xs text-slate-500">No matching workspace records found for "{query}".</div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-400">
              Type keywords above e.g., "Roadmap", "Security Whitepaper", "Budget", or "Subscriptions".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
