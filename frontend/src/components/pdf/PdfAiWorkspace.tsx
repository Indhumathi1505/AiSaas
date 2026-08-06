import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSearch,
  Upload,
  Send,
  Sparkles,
  Layers,
  BookOpen,
  HelpCircle,
  FileText,
  Bot,
  User,
  Trash2,
  ListChecks,
  Info,
} from 'lucide-react';
import { PdfChatMessage } from '../../types';

export const PdfAiWorkspace: React.FC = () => {
  const { pdfDocuments, activePdf, setActivePdf, deletePdfDocument } = useApp();

  const [activeTab, setActiveTab] = useState<'chat' | 'summaries' | 'flashcards' | 'mcqs' | 'notes'>('chat');
  const [chatMessages, setChatMessages] = useState<PdfChatMessage[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Load chat history for active PDF
  React.useEffect(() => {
    if (activePdf) {
      fetch(`/api/pdf/${activePdf.id}/chat`)
        .then((res) => res.json())
        .then((data) => setChatMessages(data))
        .catch(console.error);
    } else {
      setChatMessages([]);
    }
  }, [activePdf?.id]);

  const handleAsk = async () => {
    if (!inputQuestion.trim() || !activePdf || isAsking) return;

    const qText = inputQuestion;
    setInputQuestion('');
    setIsAsking(true);

    try {
      const res = await fetch(`/api/pdf/${activePdf.id}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: qText }),
      });
      const aiReply = await res.json();
      setChatMessages((prev) => [...prev, aiReply]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAsking(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      let textContent = '';

      if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
        // Dynamically load pdf.js from CDN
        const pdfjsLib: any = await new Promise((resolve, reject) => {
          if ((window as any).pdfjsLib) return resolve((window as any).pdfjsLib);
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
          script.onload = () => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            resolve((window as any).pdfjsLib);
          };
          script.onerror = () => reject(new Error('Failed to load PDF.js'));
          document.head.appendChild(script);
        });

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item: any) => item.str).join(' ');
          fullText += `\n${pageText}\n`;
        }
        textContent = fullText;
      } else {
        // Read as text for other formats like .txt, .md, .csv
        textContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve((event.target?.result as string) || '');
          reader.onerror = reject;
          reader.readAsText(file);
        });
      }

      const res = await fetch('/api/pdf/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          extractedText: textContent.trim().length > 0 ? textContent : `Document: ${file.name}\nNo text extracted.`,
        }),
      });
      const newPdf = await res.json();
      setActivePdf(newPdf);
    } catch (err) {
      console.error('Error uploading file:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-50 overflow-hidden">
      {/* Sidebar: Indexed PDFs */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-xs flex items-center space-x-2">
            <FileSearch className="w-4 h-4 text-purple-600" />
            <span>Indexed Documents ({pdfDocuments.length})</span>
          </div>
          <label className="p-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors flex items-center space-x-1 shadow-2xs">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".pdf,.txt,.md,.json,.csv,.doc,.docx" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {isUploading && (
          <div className="p-3 bg-purple-50 text-purple-700 text-xs font-medium text-center animate-pulse">
            Extracting text & running Gemini AI analysis...
          </div>
        )}

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {pdfDocuments.length > 0 ? (
            pdfDocuments.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => setActivePdf(pdf)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between group ${
                  activePdf?.id === pdf.id
                    ? 'bg-purple-50 border border-purple-200 text-purple-900 shadow-2xs'
                    : 'hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-purple-100 text-purple-700">
                      {pdf.fileSize}
                    </span>
                    <span className="text-[10px] text-slate-400">{pdf.pageCount} Pages</span>
                  </div>
                  <h4 className="font-bold text-xs mt-1 truncate">{pdf.filename}</h4>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePdfDocument(pdf.id);
                  }}
                  className="p-1 text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete Document"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 space-y-2">
              <FileSearch className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium text-slate-600">No documents indexed yet.</p>
              <p className="text-[11px]">Click the purple upload button above to add a PDF or text document for instant AI extraction!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Split View */}
      {activePdf ? (
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Document Text Preview */}
          <div className="w-1/2 bg-slate-100 p-6 overflow-y-auto border-r border-slate-200 flex flex-col space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{activePdf.filename}</h3>
                  <p className="text-[10px] text-slate-400">Uploaded on {new Date(activePdf.uploadedAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => deletePdfDocument(activePdf.id)}
                  className="text-xs text-rose-600 hover:underline flex items-center space-x-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-200/60 max-h-[68vh] overflow-y-auto">
                {activePdf.extractedText}
              </div>
            </div>
          </div>

          {/* Right: PDF AI Intelligence Tools */}
          <div className="w-1/2 bg-white flex flex-col overflow-hidden">
            {/* Hint Banner */}
            <div className="bg-purple-50 border-b border-purple-100 px-4 py-2 flex items-center justify-between text-[11px] text-purple-700 font-medium">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                <span>AI auto-generates Flashcards, MCQs, and Summaries! Click the tabs below to explore.</span>
              </div>
            </div>

            {/* Tool Tabs */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-1 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'chat' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>PDF Q&A Chat</span>
              </button>
              <button
                onClick={() => setActiveTab('summaries')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'summaries' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Page Summaries</span>
              </button>
              <button
                onClick={() => setActiveTab('flashcards')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'flashcards' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Flashcards</span>
              </button>
              <button
                onClick={() => setActiveTab('mcqs')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'mcqs' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>MCQs & Quiz</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  activeTab === 'notes' ? 'bg-purple-600 text-white shadow-2xs' : 'text-slate-600 hover:bg-slate-200'
                }`}
              >
                <ListChecks className="w-3.5 h-3.5" />
                <span>Key Notes</span>
              </button>
            </div>

            {/* Tab View Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeTab === 'chat' && (
                <div className="h-full flex flex-col justify-between space-y-4">
                  <div className="flex-1 overflow-y-auto space-y-3 text-xs">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 mb-0.5">
                          {msg.sender === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3 text-purple-600" />}
                          <span>{msg.sender === 'user' ? 'You' : 'PDF AI Assistant'}</span>
                        </div>
                        <div
                          className={`p-3 rounded-2xl max-w-[88%] leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-purple-600 text-white rounded-tr-none'
                              : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-tl-none'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    {isAsking && <div className="text-xs text-purple-600 font-medium">Analyzing document text via Gemini...</div>}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAsk();
                    }}
                    className="flex items-center space-x-2 border-t border-slate-200 pt-3"
                  >
                    <input
                      type="text"
                      value={inputQuestion}
                      onChange={(e) => setInputQuestion(e.target.value)}
                      placeholder="Ask any question about this document..."
                      className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs outline-none focus:bg-white focus:border-purple-600"
                    />
                    <button
                      type="submit"
                      disabled={!inputQuestion.trim() || isAsking}
                      className="p-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'summaries' && (
                <div className="space-y-3 text-xs">
                  {activePdf.pageSummaries?.map((ps) => (
                    <div key={ps.pageNumber} className="p-3.5 bg-purple-50/60 border border-purple-100 rounded-xl space-y-1">
                      <span className="font-bold text-purple-900">Section / Page {ps.pageNumber} Summary:</span>
                      <p className="text-slate-700 leading-relaxed">{ps.summary}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'flashcards' && (
                <div className="grid grid-cols-1 gap-3 text-xs">
                  {activePdf.flashcards?.map((fc, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                      <div className="font-bold text-purple-900">Question {idx + 1}: {fc.question}</div>
                      <div className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                        Answer: {fc.answer}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'mcqs' && (
                <div className="space-y-4 text-xs">
                  {activePdf.mcqs?.map((mcq, idx) => (
                    <div key={idx} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                      <div className="font-bold text-slate-900">{idx + 1}. {mcq.question}</div>
                      <div className="space-y-1.5 pl-2">
                        {mcq.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-slate-700 ${
                              optIdx === mcq.answerIndex
                                ? 'bg-emerald-50 border-emerald-300 font-semibold text-emerald-900'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            {opt} {optIdx === mcq.answerIndex && '✓ (Correct)'}
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-slate-500 italic pt-1">{mcq.explanation}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'notes' && (
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-800 mb-2">Key Extracted Takeaways & Notes:</div>
                  {activePdf.notes?.map((note, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start space-x-2 text-slate-700">
                      <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-xs text-slate-400 space-y-3">
          <FileSearch className="w-12 h-12 text-purple-400" />
          <p className="font-bold text-slate-700 text-sm">No Document Selected</p>
          <p className="max-w-md text-slate-500">
            Upload a PDF or text document using the upload button on the left sidebar to start Gemini AI text extraction, Q&A, and flashcard generation!
          </p>
        </div>
      )}
    </div>
  );
};
