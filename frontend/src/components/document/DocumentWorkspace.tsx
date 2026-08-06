import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Plus,
  Save,
  CheckCircle2,
  Sparkles,
  BookOpen,
  History,
  Share2,
  Download,
  Trash2,
  Bold,
  Italic,
  List,
  Heading1,
  Heading2,
  Quote,
  Code,
  Wand2,
  Search,
  X,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { DocumentItem, DictionaryResult } from '../../types';

export const DocumentWorkspace: React.FC = () => {
  const {
    documents,
    activeDocument,
    setActiveDocument,
    createDocument,
    updateDocument,
    deleteDocument,
    templates,
  } = useApp();

  const [editorContent, setEditorContent] = useState<string>(activeDocument?.content || '');
  const [editorTitle, setEditorTitle] = useState<string>(activeDocument?.title || '');
  const [isSaving, setIsSaving] = useState(false);

  // AI Drawers
  const [showTemplates, setShowTemplates] = useState(false);
  const [showGrammarDrawer, setShowGrammarDrawer] = useState(false);
  const [grammarResult, setGrammarResult] = useState<any>(null);
  const [isCheckingGrammar, setIsCheckingGrammar] = useState(false);

  const [selectedWord, setSelectedWord] = useState('');
  const [dictionaryResult, setDictionaryResult] = useState<DictionaryResult | null>(null);
  const [isSearchingDict, setIsSearchingDict] = useState(false);

  const [rewriteMode, setRewriteMode] = useState<'professional' | 'academic' | 'casual'>('professional');
  const [isRewriting, setIsRewriting] = useState(false);

  const [generatorType, setGeneratorType] = useState<string>('meeting_notes');
  const [generatorTopic, setGeneratorTopic] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sync state when active document changes
  React.useEffect(() => {
    if (activeDocument) {
      setEditorTitle(activeDocument.title);
      setEditorContent(activeDocument.content);
    }
  }, [activeDocument?.id]);

  const handleSave = async () => {
    if (!activeDocument) return;
    setIsSaving(true);
    try {
      await updateDocument(activeDocument.id, {
        title: editorTitle,
        content: editorContent,
      }, true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = async () => {
    const newDoc = await createDocument('New Workspace Document', '# New Document\n\nType your content or use AI Generator...');
    setActiveDocument(newDoc);
  };

  const handleApplyTemplate = async (tplContent: string, tplTitle: string) => {
    const newDoc = await createDocument(tplTitle, tplContent);
    setActiveDocument(newDoc);
    setShowTemplates(false);
  };

  const runGrammarCheck = async () => {
    setIsCheckingGrammar(true);
    try {
      const res = await fetch('/api/ai/grammar-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editorContent }),
      });
      const data = await res.json();
      setGrammarResult(data);
      setShowGrammarDrawer(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingGrammar(false);
    }
  };

  const lookupDictionary = async () => {
    if (!selectedWord.trim()) return;
    setIsSearchingDict(true);
    try {
      const res = await fetch('/api/ai/dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: selectedWord.trim() }),
      });
      const data = await res.json();
      setDictionaryResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearchingDict(false);
    }
  };

  const runRewrite = async (mode: 'professional' | 'academic' | 'casual') => {
    setRewriteMode(mode);
    setIsRewriting(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editorContent, mode }),
      });
      const data = await res.json();
      if (data.rewrittenText) {
        setEditorContent(data.rewrittenText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleGenerateContent = async () => {
    if (!generatorTopic.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: generatorType, topic: generatorTopic }),
      });
      const data = await res.json();
      if (data.generatedContent) {
        setEditorContent((prev) => prev + '\n\n' + data.generatedContent);
        setGeneratorTopic('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setEditorContent((prev) => prev + `\n${prefix} ` + suffix);
  };

  const copyDocument = () => {
    navigator.clipboard.writeText(editorContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex bg-slate-50 overflow-hidden">
      {/* Sidebar: Documents List */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-800 text-xs flex items-center space-x-2">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>Documents ({documents.length})</span>
          </div>
          <button
            onClick={handleCreateNew}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1"
            title="New Document"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="p-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Browse AI Templates</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setActiveDocument(doc)}
              className={`p-3 rounded-xl cursor-pointer transition-all ${
                activeDocument?.id === doc.id
                  ? 'bg-indigo-50 border border-indigo-200 text-indigo-900 shadow-2xs'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-600">
                  {doc.folder}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(doc.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
              <h4 className="font-bold text-xs mt-1 truncate">{doc.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.content.replace(/#/g, '')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Center: Rich Text AI Editor */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <input
            type="text"
            value={editorTitle}
            onChange={(e) => setEditorTitle(e.target.value)}
            className="text-base font-bold text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-600 outline-none px-1 py-0.5"
            placeholder="Document Title..."
          />

          <div className="flex items-center space-x-2">
            <button
              onClick={runGrammarCheck}
              disabled={isCheckingGrammar}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isCheckingGrammar ? 'Checking...' : 'AI Grammar'}</span>
            </button>

            <button
              onClick={() => setShowVersionHistory(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              <History className="w-3.5 h-3.5 text-slate-500" />
              <span>Versions ({activeDocument?.versions.length || 0})</span>
            </button>

            <button
              onClick={copyDocument}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-xs font-medium transition-colors flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center space-x-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Formatting & AI Tools Bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2">
          {/* Rich Formatting Shortcuts */}
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => insertMarkdown('**', '**')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('*', '*')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('#')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Heading 1"
            >
              <Heading1 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('##')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Heading 2"
            >
              <Heading2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('-')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Bullet List"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('>')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Blockquote"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => insertMarkdown('```', '\n```')}
              className="p-1 hover:bg-slate-100 rounded text-slate-700"
              title="Code Block"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Tone Rewriters */}
          <div className="flex items-center space-x-1 text-slate-600 font-medium">
            <span className="text-[10px] text-slate-400">AI Rewrite:</span>
            <button
              onClick={() => runRewrite('professional')}
              disabled={isRewriting}
              className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 rounded text-[11px]"
            >
              Professional
            </button>
            <button
              onClick={() => runRewrite('academic')}
              disabled={isRewriting}
              className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 rounded text-[11px]"
            >
              Academic
            </button>
            <button
              onClick={() => runRewrite('casual')}
              disabled={isRewriting}
              className="px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 text-slate-700 rounded text-[11px]"
            >
              Casual
            </button>
          </div>
        </div>

        {/* AI Generator Bar */}
        <div className="px-4 py-2 bg-indigo-50/50 border-b border-indigo-100 flex items-center space-x-2 text-xs">
          <Wand2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="font-semibold text-indigo-900 shrink-0">AI Generator:</span>
          <select
            value={generatorType}
            onChange={(e) => setGeneratorType(e.target.value)}
            className="bg-white border border-indigo-200 rounded-lg px-2 py-1 text-xs text-slate-700 outline-none"
          >
            <option value="meeting_notes">Meeting Notes</option>
            <option value="blog">Blog Post</option>
            <option value="email">Executive Email</option>
            <option value="sop">Standard Operating Procedure</option>
            <option value="project_report">Project Status Report</option>
            <option value="resume">Resume / CV Section</option>
            <option value="checklist">Action Checklist</option>
            <option value="sql">SQL Query</option>
          </select>
          <input
            type="text"
            value={generatorTopic}
            onChange={(e) => setGeneratorTopic(e.target.value)}
            placeholder="Topic or summary details e.g., Q3 Cloud Migration Strategy..."
            className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-1 text-xs outline-none"
          />
          <button
            onClick={handleGenerateContent}
            disabled={!generatorTopic.trim() || isGenerating}
            className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-semibold text-xs transition-colors shrink-0"
          >
            {isGenerating ? 'Generating...' : 'Generate & Insert'}
          </button>
        </div>

        {/* Text Area Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <textarea
            value={editorContent}
            onChange={(e) => setEditorContent(e.target.value)}
            className="w-full h-full min-h-[400px] text-sm text-slate-800 leading-relaxed outline-none resize-none font-mono"
            placeholder="Write your document content here with Markdown formatting..."
          />
        </div>

        {/* Bottom AI Dictionary Lookup Bar */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="font-medium text-slate-600">AI Dictionary Lookup:</span>
            <input
              type="text"
              value={selectedWord}
              onChange={(e) => setSelectedWord(e.target.value)}
              placeholder="Enter word e.g., Telemetry..."
              className="bg-white border border-slate-200 rounded px-2 py-0.5 text-xs outline-none"
            />
            <button
              onClick={lookupDictionary}
              className="px-2.5 py-0.5 bg-indigo-600 text-white rounded text-xs font-semibold"
            >
              Lookup
            </button>
          </div>

          <div className="text-[11px] text-slate-400">
            {editorContent.split(/\s+/).filter(Boolean).length} words • {editorContent.length} characters
          </div>
        </div>
      </div>

      {/* Right Drawer: AI Grammar / Dictionary Result */}
      {(showGrammarDrawer || dictionaryResult) && (
        <div className="w-80 bg-white border-l border-slate-200 p-4 overflow-y-auto space-y-4 text-xs animate-in slide-in-from-right">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-800 text-sm">
              {dictionaryResult ? 'AI Dictionary' : 'AI Grammar Insights'}
            </h3>
            <button
              onClick={() => {
                setShowGrammarDrawer(false);
                setDictionaryResult(null);
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {dictionaryResult && (
            <div className="space-y-2 bg-indigo-50/60 p-3 rounded-xl border border-indigo-100">
              <div className="font-bold text-slate-900 text-sm">{dictionaryResult.word}</div>
              <div className="text-slate-500 italic">{dictionaryResult.phonetic} • {dictionaryResult.partOfSpeech}</div>
              <p className="text-slate-700 mt-1">{dictionaryResult.definition}</p>
              {dictionaryResult.synonyms?.length > 0 && (
                <div className="mt-2">
                  <span className="font-semibold text-slate-700">Synonyms: </span>
                  <span className="text-indigo-600">{dictionaryResult.synonyms.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {grammarResult && (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="font-bold text-emerald-800">Grammar Score: {grammarResult.score}/100</span>
                <p className="text-emerald-700 text-[11px] mt-0.5">{grammarResult.summary}</p>
              </div>

              {grammarResult.corrections?.map((c: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="text-rose-600 font-semibold line-through">{c.original}</div>
                  <div className="text-emerald-600 font-semibold">{c.suggestion}</div>
                  <div className="text-[10px] text-slate-400">{c.reason}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Select AI Document Template</h3>
              <button onClick={() => setShowTemplates(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {templates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => handleApplyTemplate(tpl.content, tpl.title)}
                  className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 cursor-pointer transition-all"
                >
                  <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                    <span>{tpl.title}</span>
                    <span className="px-2 py-0.5 text-[10px] bg-slate-100 text-slate-600 rounded">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-1">{tpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
