import React, { useState, useEffect } from 'react';
import { Shield, Users, Activity, Lock, ArrowLeft, Search } from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Fetch users
      const usersRes = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      
      if (!usersRes.ok) throw new Error('Invalid Admin Password');
      
      const usersData = await usersRes.json();
      setUsers(usersData);
      
      // Fetch logs
      const logsRes = await fetch('/api/admin/audit-logs', {
        headers: { 'Authorization': `Bearer ${password}` }
      });
      
      const logsData = await logsRes.json();
      // Sort logs by newest first
      setAuditLogs(logsData.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden">
          <a href="/" className="absolute top-6 left-6 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          
          <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 mt-4">
            <Shield className="w-8 h-8 text-indigo-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-2">Admin Portal</h2>
          <p className="text-slate-400 text-center mb-8 text-sm">Enter the master password to access user records and telemetry.</p>
          
          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="Admin Password"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Access Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-900">Nexus Admin Portal</h1>
        </div>
        
        <a href="/" className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors flex items-center space-x-2">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to App</span>
        </a>
      </header>
      
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-slate-700">Total Users</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">{users.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-700">Recent Logins</h3>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {auditLogs.filter(l => l.action === 'USER_LOGIN').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Directory */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-indigo-600" />
                <span>User Directory</span>
              </h2>
              <div className="relative w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase">
                      <th className="px-6 py-4 font-semibold">User Info</th>
                      <th className="px-6 py-4 font-semibold">Workspace</th>
                      <th className="px-6 py-4 font-semibold">AI Model Used</th>
                      <th className="px-6 py-4 font-semibold">Joined Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full border border-slate-200 object-cover" />
                            <div>
                              <div className="font-semibold text-sm text-slate-900">{user.name}</div>
                              <div className="text-xs text-slate-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {user.workspaceName}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                            {user.aiModel || 'gemini-3.6-flash'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                          No users found matching "{searchQuery}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Audit Log (Telemetry) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>Auth Telemetry Stream</span>
            </h2>
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-hidden h-[600px] flex flex-col">
              <div className="overflow-y-auto pr-2 space-y-3 flex-1">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        log.action === 'USER_SIGNUP' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-800">{log.user}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{log.details}</div>
                  </div>
                ))}
                
                {auditLogs.length === 0 && (
                  <div className="text-center p-8 text-slate-400 text-sm">
                    No login telemetry recorded yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
