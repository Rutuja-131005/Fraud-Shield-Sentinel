import React, { useState } from 'react';
import { Transaction, RiskLevel, InvestigationStatus } from '../types';
import { TransactionTable } from './TransactionTable';
import { Search, Filter, RefreshCw, SlidersHorizontal } from 'lucide-react';

interface TransactionsViewProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onRefreshData: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  transactions,
  onSelectTransaction,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredTransactions = transactions.filter((tx) => {
    // Search
    const matchesSearch =
      tx.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.customer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.customer_name && tx.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      tx.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.merchant?.toLowerCase().includes(searchTerm.toLowerCase());

    // Risk Filter
    const matchesRisk = riskFilter === 'ALL' || tx.risk_level === riskFilter;

    // Status Filter
    const matchesStatus = statusFilter === 'ALL' || tx.investigation_status === statusFilter;

    return matchesSearch && matchesRisk && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Filter Controls Header */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Transaction ID, Customer, Location, Merchant..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Risk Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">HIGH (≥70)</option>
              <option value="MEDIUM">MEDIUM (40-69)</option>
              <option value="LOW">LOW (&lt;40)</option>
            </select>
          </div>

          {/* Investigation Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="UNREVIEWED">Unreviewed</option>
              <option value="INVESTIGATING">In Progress</option>
              <option value="CLEARED">Cleared</option>
              <option value="CONFIRMED_FRAUD">Confirmed Fraud</option>
              <option value="ESCALATED">Escalated</option>
            </select>
          </div>

          <button
            onClick={onRefreshData}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="Refresh Ingested Log"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionTable
        transactions={filteredTransactions}
        onSelectTransaction={onSelectTransaction}
        title="Payment Gateway Ingested Transactions"
      />

    </div>
  );
};
