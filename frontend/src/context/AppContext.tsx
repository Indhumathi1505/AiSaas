import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  DocumentItem,
  DocumentTemplate,
  PdfDocument,
  FinanceTransaction,
  FinanceBudget,
  FinanceGoal,
  FinanceSubscription,
  CopilotMessage,
  NotificationItem,
  AuditLogItem,
} from '../types';

interface FinancialHealthData {
  healthScore: number;
  cashFlowStatus: string;
  expensePredictionNextMonth: number;
  whereToSpendMore?: string;
  whereToSpendLess?: string;
  savingsRecommendation: string;
  unusedSubscriptionAlert?: string;
  explanation: string;
}

interface AppContextType {
  user: UserProfile | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  documents: DocumentItem[];
  activeDocument: DocumentItem | null;
  setActiveDocument: (doc: DocumentItem | null) => void;
  templates: DocumentTemplate[];
  pdfDocuments: PdfDocument[];
  activePdf: PdfDocument | null;
  setActivePdf: (pdf: PdfDocument | null) => void;
  transactions: FinanceTransaction[];
  budgets: FinanceBudget[];
  goals: FinanceGoal[];
  subscriptions: FinanceSubscription[];
  financialHealth: FinancialHealthData | null;
  copilotMessages: CopilotMessage[];
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];
  isLoading: boolean;
  refreshData: () => Promise<void>;
  createDocument: (title?: string, content?: string, folder?: string) => Promise<DocumentItem>;
  updateDocument: (id: string, updates: Partial<DocumentItem>, createVersion?: boolean) => Promise<DocumentItem>;
  deleteDocument: (id: string) => Promise<void>;
  deletePdfDocument: (id: string) => Promise<void>;
  addTransaction: (tx: Partial<FinanceTransaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (category: string, monthlyLimit: number) => Promise<void>;
  createGoal: (goal: Partial<FinanceGoal>) => Promise<void>;
  depositToGoal: (id: string, amount: number) => Promise<void>;
  sendCopilotMessage: (message: string, contextPage?: string) => Promise<CopilotMessage>;
  markNotificationsRead: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, avatarUrl?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nexus_auth_token'));
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [activeDocument, setActiveDocument] = useState<DocumentItem | null>(null);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
  const [activePdf, setActivePdf] = useState<PdfDocument | null>(null);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [budgets, setBudgets] = useState<FinanceBudget[]>([]);
  const [goals, setGoals] = useState<FinanceGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<FinanceSubscription[]>([]);
  const [financialHealth, setFinancialHealth] = useState<FinancialHealthData | null>(null);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([]);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchJson = async (url: string, options?: RequestInit) => {
    const headers = new Headers(options?.headers);
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || `API Error: ${res.statusText}`);
    return data;
  };

  const login = async (email: string, password: string) => {
    const data = await fetchJson('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    setToken(data.token);
    localStorage.setItem('nexus_auth_token', data.token);
    setUser(data.user);
  };

  const signup = async (name: string, email: string, password: string, avatarUrl?: string) => {
    const data = await fetchJson('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, avatarUrl }),
    });
    setToken(data.token);
    localStorage.setItem('nexus_auth_token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('nexus_auth_token');
  };

  const refreshData = async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const [
        profileData,
        docsData,
        tplData,
        pdfsData,
        txData,
        bData,
        gData,
        sData,
        finHealthData,
        notifData,
        auditData,
      ] = await Promise.all([
        fetchJson('/api/auth/profile'),
        fetchJson('/api/documents'),
        fetchJson('/api/templates'),
        fetchJson('/api/pdf'),
        fetchJson('/api/finance/transactions'),
        fetchJson('/api/finance/budgets'),
        fetchJson('/api/finance/goals'),
        fetchJson('/api/finance/subscriptions'),
        fetchJson('/api/finance/ai-health'),
        fetchJson('/api/notifications'),
        fetchJson('/api/audit-logs'),
      ]);

      setUser(profileData.user);
      setDocuments(docsData);
      if (docsData.length > 0 && !activeDocument) setActiveDocument(docsData[0]);
      setTemplates(tplData);
      setPdfDocuments(pdfsData);
      if (pdfsData.length > 0 && !activePdf) setActivePdf(pdfsData[0]);
      setTransactions(txData);
      setBudgets(bData);
      setGoals(gData);
      setSubscriptions(sData);
      setFinancialHealth(finHealthData);
      setNotifications(notifData);
      setAuditLogs(auditData);
    } catch (error) {
      console.error('Error loading initial workspace data:', error);
      // If unauthorized, clear token
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [token]);

  const createDocument = async (title?: string, content?: string, folder?: string) => {
    const newDoc = await fetchJson('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, folder }),
    });
    setDocuments((prev) => [newDoc, ...prev]);
    setActiveDocument(newDoc);
    return newDoc;
  };

  const updateDocument = async (
    id: string,
    updates: Partial<DocumentItem>,
    createVersion = false
  ) => {
    const updated = await fetchJson(`/api/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...updates, createVersion }),
    });
    setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
    if (activeDocument?.id === id) setActiveDocument(updated);
    return updated;
  };

  const deleteDocument = async (id: string) => {
    await fetchJson(`/api/documents/${id}`, { method: 'DELETE' });
    setDocuments((prev) => prev.filter((d) => d.id !== id));
    if (activeDocument?.id === id) {
      const remaining = documents.filter((d) => d.id !== id);
      setActiveDocument(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const deletePdfDocument = async (id: string) => {
    await fetchJson(`/api/pdf/${id}`, { method: 'DELETE' });
    setPdfDocuments((prev) => prev.filter((p) => p.id !== id));
    if (activePdf?.id === id) {
      const remaining = pdfDocuments.filter((p) => p.id !== id);
      setActivePdf(remaining.length > 0 ? remaining[0] : null);
    }
  };

  const addTransaction = async (tx: Partial<FinanceTransaction>) => {
    const newTx = await fetchJson('/api/finance/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tx),
    });
    setTransactions((prev) => [newTx, ...prev]);
    const [health, bData] = await Promise.all([
      fetchJson('/api/finance/ai-health'),
      fetchJson('/api/finance/budgets'),
    ]);
    setFinancialHealth(health);
    setBudgets(bData);
  };

  const deleteTransaction = async (id: string) => {
    await fetchJson(`/api/finance/transactions/${id}`, { method: 'DELETE' });
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    const [health, bData] = await Promise.all([
      fetchJson('/api/finance/ai-health'),
      fetchJson('/api/finance/budgets'),
    ]);
    setFinancialHealth(health);
    setBudgets(bData);
  };

  const updateBudget = async (category: string, monthlyLimit: number) => {
    const updated = await fetchJson('/api/finance/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, monthlyLimit }),
    });
    setBudgets((prev) => {
      const exists = prev.some((b) => b.category === category);
      if (exists) return prev.map((b) => (b.category === category ? updated : b));
      return [...prev, updated];
    });
    const health = await fetchJson('/api/finance/ai-health');
    setFinancialHealth(health);
  };

  const createGoal = async (goal: Partial<FinanceGoal>) => {
    const newGoal = await fetchJson('/api/finance/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goal),
    });
    setGoals((prev) => [...prev, newGoal]);
  };

  const depositToGoal = async (id: string, amount: number) => {
    const updatedGoal = await fetchJson(`/api/finance/goals/${id}/deposit`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    });
    setGoals((prev) => prev.map((g) => (g.id === id ? updatedGoal : g)));
  };

  const sendCopilotMessage = async (message: string, contextPage?: string) => {
    const userMsg: CopilotMessage = {
      id: 'usr_' + Date.now(),
      sender: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };
    setCopilotMessages((prev) => [...prev, userMsg]);

    const reply = await fetchJson('/api/ai/copilot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        contextPage: contextPage || activeTab,
        documentContext: activeDocument ? activeDocument.content : undefined,
        pdfContext: activePdf ? activePdf.extractedText : undefined,
        financeContext: financialHealth ? financialHealth : undefined,
      }),
    });

    setCopilotMessages((prev) => [...prev, reply]);
    return reply;
  };

  const markNotificationsRead = async () => {
    await fetchJson('/api/notifications/read-all', { method: 'PUT' });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const res = await fetchJson('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.user) setUser(res.user);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        activeTab,
        setActiveTab,
        documents,
        activeDocument,
        setActiveDocument,
        templates,
        pdfDocuments,
        activePdf,
        setActivePdf,
        transactions,
        budgets,
        goals,
        subscriptions,
        financialHealth,
        copilotMessages,
        isCopilotOpen,
        setIsCopilotOpen,
        notifications,
        auditLogs,
        isLoading,
        refreshData,
        createDocument,
        updateDocument,
        deleteDocument,
        deletePdfDocument,
        addTransaction,
        deleteTransaction,
        updateBudget,
        createGoal,
        depositToGoal,
        sendCopilotMessage,
        markNotificationsRead,
        updateProfile,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
