import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  Zap,
  RefreshCw,
  Copy,
  Check,
  User,
  FileText,
  FileSearch,
  TrendingUp,
} from 'lucide-react';

export const CopilotFullView: React.FC = () => {
  const {
    copilotMessages,
    sendCopilotMessage,
    activeDocument,
    activePdf,
    financialHealth,
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [selectedContext, setSelectedContext] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSend = async (textToUse?: string) => {
    const query = textToUse || inputMsg;
    if (!query.trim() || isSending) return;

    setInputMsg('');
    setIsSending(true);
    try {
      await sendCopilotMessage(query, selectedContext);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const copyText = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const samplePrompts = [
    'Synthesize Q3 Product Roadmap and Security Whitepaper into an executive summary',
    'Evaluate financial burn rate against cloud compute allocations',
    'Generate a 5-step risk mitigation protocol for enterprise AI deployment',
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto h-[calc(100vh-4rem)] flex flex-col space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Nexus Copilot Enterprise Hub</h1>
            <p className="text-xs text-indigo-300">
              Powered by Groq LLaMA 3 • Unified Multimodal Workspace Context
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400">Context Mode:</span>
          <select
            value={selectedContext}
            onChange={(e) => setSelectedContext(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 outline-none font-semibold"
          >
            <option value="all">Full Workspace Context</option>
            <option value="documents">Active Document Only</option>
            <option value="pdf">PDF Whitepapers Only</option>
            <option value="finance">Financial Telemetry Only</option>
          </select>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 overflow-y-auto space-y-4 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400 font-medium">
              {msg.sender === 'user' ? (
                <>
                  <span>Alexandra</span>
                  <User className="w-3 h-3 text-slate-500" />
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Nexus Copilot</span>
                </>
              )}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[85%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>

              {msg.sender === 'assistant' && (
                <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Groq LLaMA 3</span>
                  <button
                    onClick={() => copyText(msg.content, msg.id)}
                    className="hover:text-indigo-600 flex items-center space-x-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-indigo-600 font-medium py-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Formulating contextual AI response with Groq LLaMA 3...</span>
          </div>
        )}
      </div>

      {/* Sample Prompts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="p-2.5 bg-indigo-50/60 hover:bg-indigo-100/80 text-indigo-900 border border-indigo-200/80 rounded-xl text-left text-[11px] font-medium transition-colors flex items-center justify-between group"
          >
            <span className="line-clamp-1">{p}</span>
            <Zap className="w-3 h-3 text-amber-500 shrink-0 ml-1" />
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-md"
      >
        <input
          type="text"
          value={inputMsg}
          onChange={(e) => setInputMsg(e.target.value)}
          placeholder="Ask Copilot anything about documents, PDFs, strategy, or financial health..."
          className="flex-1 bg-transparent px-4 py-2 text-xs text-slate-800 outline-none"
        />
        <button
          type="submit"
          disabled={!inputMsg.trim() || isSending}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
