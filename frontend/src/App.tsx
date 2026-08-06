import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CopilotDrawer } from './components/common/CopilotDrawer';
import { Dashboard } from './components/dashboard/Dashboard';
import { DocumentWorkspace } from './components/document/DocumentWorkspace';
import { SqlGeneratorWorkspace } from './components/sql/SqlGeneratorWorkspace';
import { PdfAiWorkspace } from './components/pdf/PdfAiWorkspace';
import { FinanceTracker } from './components/finance/FinanceTracker';
import { CopilotFullView } from './components/copilot/CopilotFullView';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { NotificationsPage } from './components/notifications/NotificationsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { AuthPage } from './components/auth/AuthPage';
import { AdminPortal } from './components/auth/AdminPortal';

const MainLayout: React.FC = () => {
  const { activeTab, isLoading, isAuthenticated } = useApp();

  if (window.location.pathname === '/admin') {
    return <AdminPortal />;
  }

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#0a0a0f] flex items-center justify-center text-white text-xs">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-mono text-indigo-300">Synchronizing Nexus AI Workspace...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden font-sans text-slate-800">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'sql' && <SqlGeneratorWorkspace />}
          {activeTab === 'documents' && <DocumentWorkspace />}
          {activeTab === 'pdf' && <PdfAiWorkspace />}
          {activeTab === 'finance' && <FinanceTracker />}
          {activeTab === 'copilot' && <CopilotFullView />}
          {activeTab === 'reports' && <ReportsAnalytics />}
          {activeTab === 'notifications' && <NotificationsPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Sliding Copilot Drawer */}
      <CopilotDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
