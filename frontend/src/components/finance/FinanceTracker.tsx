import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  Plus,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  PieChart as PieIcon,
  CreditCard,
  Sparkles,
  X,
  Trash2,
  Calendar,
  PiggyBank,
  CheckCircle2,
  TrendingDown,
  Target,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const FinanceTracker: React.FC = () => {
  const {
    transactions,
    budgets,
    goals,
    financialHealth,
    addTransaction,
    deleteTransaction,
    updateBudget,
    createGoal,
    depositToGoal,
  } = useApp();

  // Modals state
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [showAddBudgetModal, setShowAddBudgetModal] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  // Transaction form state
  const [txType, setTxType] = useState<'income' | 'expense'>('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txCategory, setTxCategory] = useState('Groceries & Dining');
  const [txDescription, setTxDescription] = useState('');
  const [txPaymentMethod, setTxPaymentMethod] = useState('Debit Card');
  const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmittingTx, setIsSubmittingTx] = useState(false);

  // Budget form state
  const [budgetCategory, setBudgetCategory] = useState('Housing & Rent');
  const [budgetLimit, setBudgetLimit] = useState('');

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [goalTargetDate, setGoalTargetDate] = useState('2026-12-31');

  // Month filter state
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  const INCOME_CATEGORIES = [
    'Salary',
    'Freelance & Side Business',
    'Investments & Dividends',
    'Gifts & Allowance',
    'Other Income',
  ];

  const EXPENSE_CATEGORIES = [
    'Housing & Rent',
    'Groceries & Dining',
    'Utilities & Bills',
    'Transport & Fuel',
    'Shopping & Personal Care',
    'Health & Fitness',
    'Entertainment & Subscriptions',
    'Education & Learning',
    'Savings & Investments',
    'Miscellaneous',
  ];

  // Filter transactions by selected month if needed
  const filteredTransactions = transactions.filter((t) => {
    if (selectedMonth === 'ALL') return true;
    return t.date.startsWith(selectedMonth);
  });

  const totalIncome = filteredTransactions
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === 'expense')
    .reduce((a, b) => a + b.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0.0';

  // Category breakdown for Pie Chart
  const expenseByCategory: Record<string, number> = {};
  filteredTransactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  const pieData = Object.keys(expenseByCategory).map((cat) => ({
    name: cat,
    value: expenseByCategory[cat],
  }));

  // If pieData is empty, show default budget allocations or placeholder
  const chartPieData = pieData.length > 0 ? pieData : budgets.filter((b) => b.spent > 0).map((b) => ({ name: b.category, value: b.spent }));

  const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6', '#3b82f6', '#ef4444', '#14b8a6'];

  // Bar chart data for budget limits vs actual spent
  const barChartData = budgets.map((b) => ({
    category: b.category,
    limit: b.monthlyLimit,
    spent: b.spent,
  }));

  const handleCreateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txAmount || Number(txAmount) <= 0) return;

    setIsSubmittingTx(true);
    try {
      await addTransaction({
        date: txDate,
        type: txType,
        amount: Number(txAmount),
        category: txCategory,
        description: txDescription || (txType === 'income' ? 'Personal Income' : 'Personal Expense'),
        paymentMethod: txPaymentMethod,
      });
      setShowAddTxModal(false);
      setTxAmount('');
      setTxDescription('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingTx(false);
    }
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budgetLimit || Number(budgetLimit) <= 0) return;
    await updateBudget(budgetCategory, Number(budgetLimit));
    setShowAddBudgetModal(false);
    setBudgetLimit('');
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !goalTargetAmount || Number(goalTargetAmount) <= 0) return;
    await createGoal({
      title: goalTitle,
      targetAmount: Number(goalTargetAmount),
      targetDate: goalTargetDate,
    });
    setShowAddGoalModal(false);
    setGoalTitle('');
    setGoalTargetAmount('');
  };

  const handleDepositGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositGoalId || !depositAmount || Number(depositAmount) <= 0) return;
    await depositToGoal(depositGoalId, Number(depositAmount));
    setDepositGoalId(null);
    setDepositAmount('');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
            <PiggyBank className="w-6 h-6 text-emerald-600" />
            <span>Personal AI Finance Tracker</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track your personal income, expenses, category budgets, savings goals, and AI-powered spending insights
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector Filter */}
          <div className="flex items-center space-x-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-semibold outline-none cursor-pointer"
            >
              <option value="ALL">All Time</option>
              <option value="2026-07">July 2026</option>
              <option value="2026-06">June 2026</option>
              <option value="2026-05">May 2026</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddTxModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Log Income / Expense</span>
          </button>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-900 text-white rounded-2xl shadow-md border border-emerald-800/50 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-emerald-300 font-semibold mb-2">
              <span>Financial Health Score</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold">{financialHealth?.healthScore || 85}/100</div>
            <p className="text-[11px] text-emerald-300/90 mt-1">{financialHealth?.cashFlowStatus}</p>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium mt-3">Verified by Gemini AI Personal Advisor</div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Income</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">${totalIncome.toLocaleString()}</div>
          <span className="text-[10px] text-emerald-600 font-medium flex items-center mt-2">
            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> Total Salary & Income Sources
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Total Expenses</span>
          <div className="text-2xl font-bold text-slate-800 mt-1">${totalExpense.toLocaleString()}</div>
          <span className="text-[10px] text-rose-500 font-medium flex items-center mt-2">
            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> Total Monthly Spending
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500">Net Savings Balance</span>
          <div className={`text-2xl font-bold mt-1 ${netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            ${netSavings.toLocaleString()}
          </div>
          <span className="text-[10px] text-indigo-600 font-semibold flex items-center mt-2">
            <Target className="w-3.5 h-3.5 mr-0.5" /> Savings Rate: {savingsRate}%
          </span>
        </div>
      </div>

      {/* AI Personal Financial Analyst Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-800 font-bold text-base">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          <span>Gemini Personal Financial Analysis</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Where You Can Spend More / Safe Capacity */}
          <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 font-bold text-emerald-900 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Where You Can Spend More (Safe Room)</span>
            </div>
            <p className="text-xs text-emerald-950 leading-relaxed">
              {financialHealth?.whereToSpendMore ||
                'Your income exceeds your fixed spending. You have flexible room to invest more in health, learning, or personal goals.'}
            </p>
          </div>

          {/* Card 2: Where You Should Cut Back / Lower Value Expenses */}
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-900 text-xs">
              <TrendingDown className="w-4 h-4 text-amber-600" />
              <span>Where To Cut Back & Spend Less</span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed">
              {financialHealth?.whereToSpendLess ||
                'Keep track of discretionary categories like dining out or shopping to optimize your monthly savings rate.'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section: Pie Chart & Budget vs Actual Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-indigo-600" />
              <span>Monthly Expense Breakdown</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Categorized Expenses</span>
          </div>

          {chartPieData.length > 0 ? (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {chartPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
              No expense transactions logged yet. Log your expenses to see an interactive pie chart breakdown.
            </div>
          )}
        </div>

        {/* Category Budget Limits vs Actual Spent Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Category Budget Limits vs. Actual Spending</h3>
            <button
              onClick={() => setShowAddBudgetModal(true)}
              className="text-xs text-indigo-600 font-semibold hover:underline flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Set Budget</span>
            </button>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-15} textAnchor="end" />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip formatter={(value: any) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="limit" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Monthly Limit ($)" />
                <Bar dataKey="spent" fill="#6366f1" radius={[4, 4, 0, 0]} name="Actual Spent ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Personal Savings Goals Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Personal Savings & Financial Goals</span>
            </h3>
            <p className="text-xs text-slate-500">Track and deposit towards your personal milestone targets</p>
          </div>

          <button
            onClick={() => setShowAddGoalModal(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1 border border-indigo-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Savings Goal</span>
          </button>
        </div>

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((g) => {
              const progressPct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
              return (
                <div key={g.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-slate-800">{g.title}</span>
                    <span className="text-[10px] text-slate-500">Target: {g.targetDate}</span>
                  </div>

                  <div className="flex items-baseline justify-between text-xs">
                    <span className="font-extrabold text-emerald-600 text-base">${g.currentAmount.toLocaleString()}</span>
                    <span className="text-slate-500 font-medium">of ${g.targetAmount.toLocaleString()} ({progressPct}%)</span>
                  </div>

                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => setDepositGoalId(g.id)}
                    className="w-full py-1.5 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-300 font-semibold text-xs rounded-lg transition-colors shadow-2xs"
                  >
                    + Deposit Money
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-slate-400 p-6 text-center border border-dashed border-slate-200 rounded-xl">
            No active savings goals. Create your first goal to track progress towards an emergency fund, travel, or major purchase!
          </div>
        )}
      </div>

      {/* Recent Transactions Log */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm">Personal Income & Expense Entries ({filteredTransactions.length})</h3>
          <span className="text-xs text-slate-400">Chronological Log</span>
        </div>

        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Description</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Method</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80">
                    <td className="py-2.5 px-3 font-medium text-slate-600">{tx.date}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-800">{tx.description}</td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{tx.category}</td>
                    <td className="py-2.5 px-3 text-slate-400">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          tx.type === 'income' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold ${
                        tx.type === 'income' ? 'text-emerald-600' : 'text-slate-800'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-slate-400 p-8 text-center border border-dashed border-slate-200 rounded-xl space-y-2">
            <p className="font-semibold text-slate-600">No transactions recorded yet.</p>
            <p>Click "Log Income / Expense" above to start building your personal financial telemetry!</p>
          </div>
        )}
      </div>

      {/* Modal: Add Transaction */}
      {showAddTxModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Log Personal Income / Expense</h3>
              <button onClick={() => setShowAddTxModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTx} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Entry Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('expense');
                      setTxCategory(EXPENSE_CATEGORIES[0]);
                    }}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      txType === 'expense' ? 'bg-rose-600 text-white border-rose-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setTxType('income');
                      setTxCategory(INCOME_CATEGORIES[0]);
                    }}
                    className={`py-2 rounded-lg font-bold border transition-colors ${
                      txType === 'income' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-700'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="e.g. 1200.00"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                >
                  {(txType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Description</label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="e.g. Monthly Rent, Organic Groceries, Freelance Contract..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-emerald-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Payment Method</label>
                  <select
                    value={txPaymentMethod}
                    onChange={(e) => setTxPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                  >
                    <option value="Debit Card">Debit Card</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="UPI / Wallet">UPI / Digital Wallet</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTxModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingTx}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                >
                  {isSubmittingTx ? 'Logging...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Set Budget Limit */}
      {showAddBudgetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Set Monthly Budget Limit</h3>
              <button onClick={() => setShowAddBudgetModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateBudget} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Expense Category</label>
                <select
                  value={budgetCategory}
                  onChange={(e) => setBudgetCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                >
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Monthly Budget Target ($)</label>
                <input
                  type="number"
                  value={budgetLimit}
                  onChange={(e) => setBudgetLimit(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-600"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddBudgetModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">
                  Save Budget Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Savings Goal */}
      {showAddGoalModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Create Personal Savings Goal</h3>
              <button onClick={() => setShowAddGoalModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Goal Title</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="e.g. Emergency Fund, New Laptop, Holiday Trip..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Amount ($)</label>
                <input
                  type="number"
                  value={goalTargetAmount}
                  onChange={(e) => setGoalTargetAmount(e.target.value)}
                  placeholder="e.g. 3000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Target Date</label>
                <input
                  type="date"
                  value={goalTargetDate}
                  onChange={(e) => setGoalTargetDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddGoalModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold">
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Deposit to Savings Goal */}
      {depositGoalId && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-2xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base">Deposit Savings</h3>
              <button onClick={() => setDepositGoalId(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositGoal} className="space-y-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Deposit Amount ($)</label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="e.g. 150"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs outline-none focus:bg-white focus:border-emerald-600"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setDepositGoalId(null)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
                  Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
