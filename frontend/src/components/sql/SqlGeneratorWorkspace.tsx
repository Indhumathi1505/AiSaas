import React, { useState } from 'react';
import { Database, Copy, Check, Play } from 'lucide-react';

export const SqlGeneratorWorkspace: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedSql, setGeneratedSql] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('nexus_auth_token');
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ type: 'sql', topic: prompt }),
      });
      const data = await res.json();
      if (data.generatedContent) {
        setGeneratedSql(data.generatedContent);
      }
    } catch (error) {
      console.error(error);
      setGeneratedSql('Error generating SQL. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
          <Database className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold">AI SQL Generator</h1>
          <p className="text-xs text-indigo-300">Convert natural language to optimized SQL queries instantly</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <label className="block text-sm font-bold text-slate-800 mb-2">Describe your query</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Show all employees earning more than 50000 in the sales department..."
            className="w-full h-32 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 resize-none"
          />
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-xl flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>{isGenerating ? 'Generating...' : 'Generate SQL'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-slate-800">Generated SQL</label>
            {generatedSql && (
              <button
                onClick={copyToClipboard}
                className="text-xs font-semibold text-indigo-600 flex items-center space-x-1 hover:text-indigo-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            )}
          </div>
          <div className="flex-1 bg-slate-900 rounded-xl p-4 relative overflow-hidden">
             <textarea
               readOnly
               value={generatedSql}
               placeholder="Generated SQL will appear here..."
               className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm outline-none resize-none"
             />
          </div>
        </div>
      </div>
    </div>
  );
};
