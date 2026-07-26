import {
  UserProfile,
  DocumentItem,
  DocumentTemplate,
  PdfDocument,
  PdfChatMessage,
  FinanceTransaction,
  FinanceBudget,
  FinanceGoal,
  FinanceSubscription,
  CopilotMessage,
  NotificationItem,
  AuditLogItem,
} from '../types';

class Store {
  user: UserProfile = {
    id: 'usr_personal_01',
    name: 'Indhumathi',
    email: 'indhumathirsj@gmail.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    role: 'WORKSPACE_MEMBER',
    twoFactorEnabled: true,
    createdAt: new Date().toISOString(),
    workspaceName: 'Personal AI Workspace',
    aiModel: 'gemini-3.6-flash',
    theme: 'light',
  };

  // Default empty lists for documents and PDFs
  documents: DocumentItem[] = [];

  templates: DocumentTemplate[] = [
    {
      id: 'tpl_01',
      title: 'Personal Monthly Budget & Expense Plan',
      category: 'Personal',
      description: 'Track monthly income sources, fixed expenses, and savings targets.',
      content: `# Personal Monthly Budget Plan\n\n## Monthly Income Targets\n- Salary: $4,000\n- Side Business: $500\n\n## Target Spending Limits\n- Housing & Rent: $1,200\n- Groceries & Food: $400\n- Utilities & Bills: $180\n- Transport: $150\n- Savings & Emergency Reserve: $1,000`,
      iconName: 'TrendingUp',
    },
    {
      id: 'tpl_02',
      title: 'Personal Study & Document Notes',
      category: 'Academic',
      description: 'Structured layout for taking notes on books, research PDFs, or personal projects.',
      content: `# Personal Study & Document Notes\n\n## Title / Topic\n...\n\n## Core Key Takeaways\n1. \n2. \n3. \n\n## Action Items & Next Steps\n- [ ] Review PDF chapter 2\n- [ ] Update personal savings goal`,
      iconName: 'FileText',
    },
  ];

  pdfDocuments: PdfDocument[] = [];

  pdfChatHistories: Record<string, PdfChatMessage[]> = {};

  // Default empty financial tracking arrays
  transactions: FinanceTransaction[] = [];

  // Initial personal budget categories with 0 spent
  budgets: FinanceBudget[] = [
    { id: 'b_01', category: 'Housing & Rent', monthlyLimit: 1200.0, spent: 0 },
    { id: 'b_02', category: 'Groceries & Dining', monthlyLimit: 500.0, spent: 0 },
    { id: 'b_03', category: 'Utilities & Bills', monthlyLimit: 200.0, spent: 0 },
    { id: 'b_04', category: 'Transport & Fuel', monthlyLimit: 200.0, spent: 0 },
    { id: 'b_05', category: 'Shopping & Personal Care', monthlyLimit: 300.0, spent: 0 },
    { id: 'b_06', category: 'Entertainment & Subscriptions', monthlyLimit: 150.0, spent: 0 },
  ];

  goals: FinanceGoal[] = [
    {
      id: 'g_01',
      title: 'Personal Emergency Fund',
      targetAmount: 5000.0,
      currentAmount: 1200.0,
      targetDate: '2026-12-31',
      iconName: 'ShieldCheck',
    },
    {
      id: 'g_02',
      title: 'Vacation & Travel Savings',
      targetAmount: 2000.0,
      currentAmount: 600.0,
      targetDate: '2026-10-31',
      iconName: 'Plane',
    },
  ];

  subscriptions: FinanceSubscription[] = [];

  copilotMessages: CopilotMessage[] = [
    {
      id: 'copilot_init',
      sender: 'assistant',
      content: 'Hello Indhumathi! Welcome to your Personal AI Workspace. I am ready to help you analyze uploaded PDF documents, draft notes, manage your personal monthly income and expenses, and optimize your budget and savings goals. How can I assist you today?',
      timestamp: new Date().toISOString(),
      suggestedActions: [
        'Log a new income or expense entry',
        'Upload a PDF document for AI extraction',
        'Create a personal savings goal',
      ],
    },
  ];

  notifications: NotificationItem[] = [];

  auditLogs: AuditLogItem[] = [];
}

export const store = new Store();
