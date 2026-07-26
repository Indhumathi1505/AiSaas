import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  Zap,
  FileText,
  FileSearch,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    activeTab,
    activeDocument,
    activePdf,
    financialHealth,
    copilotMessages,
    sendCopilotMessage,
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [copilotMessages]);

  if (!isCopilotOpen) return null;

  const handleSend = async (msgText?: string) => {
    const textToSend = msgText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    setInputMessage('');
    setIsSending(true);
    try {
      await sendCopilotMessage(textToSend, activeTab);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const quickPrompts = [
    { label: 'Summarize Active Document', action: () => handleSend('Please provide a concise executive summary of the open document.') },
    { label: 'Check Financial Health Score', action: () => handleSend('Explain our financial health score and cash flow status.') },
    { label: 'Draft Q3 Action Items', action: () => handleSend('Generate 5 key strategic action items based on our Q3 roadmap and budget.') },
    { label: 'PDF Key Takeaways', action: () => handleSend('Extract the top security takeaways from our uploaded PDF whitepaper.') },
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-slate-200 shadow-2xl z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4 animate-spin" />
          </div>
          <div>
            <h3 className="font-semibold text-sm leading-tight">Nexus AI Copilot</h3>
            <span className="text-[10px] text-indigo-300 font-mono">Gemini 3.6 Flash • Context Active</span>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Page Context Banner */}
      <div className="px-4 py-2 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center space-x-2 truncate">
          {activeTab === 'documents' && <FileText className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          {activeTab === 'pdf' && <FileSearch className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          {activeTab === 'finance' && <TrendingUp className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
          <span className="font-medium truncate">
            Context: {activeTab === 'documents' && (activeDocument?.title || 'Document')}
            {activeTab === 'pdf' && (activePdf?.filename || 'PDF')}
            {activeTab === 'finance' && 'Financial Telemetry'}
            {!['documents', 'pdf', 'finance'].includes(activeTab) && 'Executive Workspace View'}
          </span>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400 font-medium">
              {msg.sender === 'user' ? (
                <>
                  <span>You</span>
                  <User className="w-3 h-3 text-slate-500" />
                </>
              ) : (
                <>
                  <Bot className="w-3 h-3 text-indigo-600" />
                  <span>Nexus Copilot</span>
                </>
              )}
            </div>

            <div
              className={`p-3 rounded-2xl max-w-[90%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 border border-slate-200/80 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

              {msg.sender === 'assistant' && (
                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="italic">Contextual Gemini 3.6</span>
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className="hover:text-indigo-600 flex items-center space-x-1"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {isSending && (
          <div className="flex items-center space-x-2 text-indigo-600 font-medium text-xs py-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Copilot is formulating context response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Chips */}
      <div className="p-2 bg-slate-50 border-t border-slate-200 overflow-x-auto whitespace-nowrap flex space-x-1.5 text-[11px]">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={qp.action}
            className="px-2.5 py-1 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 rounded-lg transition-colors font-medium shrink-0 flex items-center space-x-1"
          >
            <Zap className="w-3 h-3 text-amber-500" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div className="p-3 border-t border-slate-200 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Copilot anything about this workspace..."
            className="flex-1 bg-slate-100 border border-slate-200 focus:border-indigo-500 focus:bg-white text-slate-800 text-xs rounded-lg px-3 py-2 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isSending}
            className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
