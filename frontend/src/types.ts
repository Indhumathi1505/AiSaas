/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'ADMIN' | 'WORKSPACE_MEMBER' | 'VIEWER';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: Role;
  twoFactorEnabled: boolean;
  createdAt: string;
  workspaceName: string;
  aiModel: string;
  theme: 'light' | 'dark' | 'system';
}

export interface DocumentVersion {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  summary?: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  folder: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isShared: boolean;
  sharedWith: string[];
  versions: DocumentVersion[];
  readabilityScore?: number;
  grammarIssueCount?: number;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'Business' | 'Academic' | 'Technical' | 'Personal' | 'Legal';
  description: string;
  content: string;
  iconName: string;
}

export interface PdfDocument {
  id: string;
  filename: string;
  fileSize: string;
  pageCount: number;
  uploadedAt: string;
  extractedText: string;
  pageSummaries: { pageNumber: number; summary: string }[];
  flashcards: { question: string; answer: string }[];
  mcqs: { question: string; options: string[]; answerIndex: number; explanation: string }[];
  notes: string[];
  tables: { headers: string[]; rows: string[][] }[];
  references: string[];
}

export interface PdfChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  pageReference?: number;
}

export interface FinanceTransaction {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  isRecurring?: boolean;
}

export interface FinanceBudget {
  id: string;
  category: string;
  monthlyLimit: number;
  spent: number;
}

export interface FinanceGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  iconName: string;
}

export interface FinanceSubscription {
  id: string;
  name: string;
  monthlyCost: number;
  billingCycle: 'Monthly' | 'Yearly';
  lastUsedDate: string;
  isUnused: boolean;
  nextRenewal: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextUsed?: string;
  sources?: string[];
  suggestedActions?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'document' | 'pdf' | 'finance' | 'chat';
  snippet: string;
  matchScore: number;
  date: string;
  path: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'ai_suggestion' | 'budget_alert' | 'subscription_alert' | 'document_shared' | 'workspace_update' | 'goal_achieved';
  timestamp: string;
  isRead: boolean;
}

export interface AuditLogItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  ipAddress: string;
}

export interface DictionaryResult {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

export interface ReadabilityAnalysis {
  wordCount: number;
  characterCount: number;
  readingTimeMinutes: number;
  score: number;
  gradeLevel: string;
  passiveVoiceCount: number;
  complexSentenceCount: number;
  suggestions: string[];
}
