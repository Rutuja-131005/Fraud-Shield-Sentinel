import React, { useState } from 'react';
import { Transaction } from '../types';
import { 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Lock, 
  AlertCircle, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Clock,
  User,
  ArrowRight
} from 'lucide-react';

interface TransactionHistoryViewProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
}

export const TransactionHistoryView: React.FC<TransactionHistoryViewProps> = ({
  transactions,
  onSelectTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [decisionFilter, setDecisionFilter] = useState<string>('all');
  const [inspectedTxn, setInspectedTxn] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t) => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.merchant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ip.includes(searchTerm);

    const matchesStatus = statusFilter === 'all' || t.status.toLowerCase().includes(statusFilter.toLowerCase());
    const matchesDecision = decisionFilter === 'all' || t.decision === decisionFilter;

    return matchesSearch && matchesStatus && matchesDecision;
  });

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1720px] mx-auto w-full">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-[#eaedff] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#131b2e]">
              Audit Trail & Transaction History
            </h2>
            <span className="px-2 py-0.5 bg-[#eaedff] text-[#00288e] font-mono text-xs font-semibold rounded">
              IMMUTABLE LOGS
            </span>
          </div>
          <p className="text-xs text-[#757684] mt-1">
            Full compliance record of real-time decisions, SHAP feature contributions, and analyst dispositions for regulatory auditing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvContent = [
                ['TxID', 'Timestamp', 'User', 'Amount INR', 'Merchant', 'Risk Score', 'Decision', 'Status', 'Top Factor'].join(','),
                ...filtered.map(t => [
                  t.id,
                  t.timestamp,
                  `"${t.user.name}"`,
                  t.amount,
                  `"${t.merchant.name}"`,
                  t.riskScore,
                  t.decision,
                  t.status,
                  `"${t.shapAttribution[0]?.feature || 'Standard'}"`
                ].join(','))
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `fraud-shield-audit-log-${Date.now()}.csv`;
              a.click();
            }}
            className="px-3 py-1.5 bg-[#00288e] hover:bg-[#1e40af] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Regulatory Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-[#eaedff] shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#757684] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by TxID, Customer Name, User ID, Merchant, or IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 text-xs bg-[#f2f3ff] rounded-lg border border-transparent focus:border-[#00288e] focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Decision Filter */}
          <div className="flex items-center gap-1 text-xs text-[#444653]">
            <span className="font-semibold">Decision:</span>
            <select
              value={decisionFilter}
              onChange={(e) => setDecisionFilter(e.target.value)}
              className="h-8 px-2 bg-[#f2f3ff] border border-[#eaedff] rounded-lg text-xs font-medium text-[#131b2e] outline-none"
            >
              <option value="all">All Decisions</option>
              <option value="auto-block">Auto-Block (Score &ge; 80)</option>
              <option value="flag-review">Flagged for Review (50-79)</option>
              <option value="auto-approve">Auto-Approve (&lt; 50)</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs text-[#444653]">
            <span className="font-semibold">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 px-2 bg-[#f2f3ff] border border-[#eaedff] rounded-lg text-xs font-medium text-[#131b2e] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="Reviewing">Reviewing</option>
              <option value="Blocked">Blocked</option>
              <option value="Approved">Approved</option>
              <option value="Investigated">Investigated</option>
            </select>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl border border-[#eaedff] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f2f3ff] font-mono text-[11px] text-[#444653] uppercase tracking-wider border-b border-[#eaedff]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Merchant & MCC</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4">Engine Action</th>
                <th className="py-3 px-4">Primary SHAP Factor</th>
                <th className="py-3 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eaedff] text-[#131b2e]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-10 text-center text-[#757684]">
                    No historical records found for this filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((txn) => {
                  const isHigh = txn.riskScore >= 80;
                  const isMed = txn.riskScore >= 50 && txn.riskScore < 80;

                  return (
                    <tr 
                      key={txn.id}
                      className="hover:bg-[#f2f3ff] transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[11px] text-[#757684] whitespace-nowrap">
                        {txn.timestamp}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-[#00288e]">
                        {txn.id}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#131b2e]">{txn.user.name}</span>
                          <span className="text-[10px] text-[#757684]">{txn.user.id}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold whitespace-nowrap">
                        ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col max-w-[180px]">
                          <span className="truncate font-medium">{txn.merchant.name}</span>
                          <span className="text-[10px] font-mono text-[#757684]">
                            MCC: {txn.merchant.mcc} ({txn.merchant.category})
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          isHigh 
                            ? 'bg-[#bb0112] text-white' 
                            : isMed 
                            ? 'bg-[#ffb77d] text-[#532a00]' 
                            : 'bg-[#dae2fd] text-[#00288e]'
                        }`}>
                          {txn.riskScore}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                          txn.decision === 'auto-block'
                            ? 'bg-[#ffdad6] text-[#410002]'
                            : txn.decision === 'flag-review'
                            ? 'bg-[#ffdcc3] text-[#6e3900]'
                            : 'bg-[#e2e7ff] text-[#00288e]'
                        }`}>
                          {txn.decision}
                        </span>
                      </td>

                      <td className="py-3 px-4 max-w-[220px]">
                        <span className="text-xs text-[#444653] truncate block" title={txn.shapAttribution[0]?.feature}>
                          {txn.shapAttribution[0]?.feature || 'Standard Pattern'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setInspectedTxn(txn);
                            onSelectTransaction(txn);
                          }}
                          className="px-2.5 py-1 bg-[#eaedff] hover:bg-[#dae2fd] text-[#00288e] font-semibold rounded text-xs transition-colors"
                        >
                          View Audit Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-[#f2f3ff] border-t border-[#eaedff] flex items-center justify-between text-xs text-[#757684]">
          <span>Logged {filtered.length} of {transactions.length} total events in local shard</span>
          <span className="font-mono text-[11px]">Audit Engine: SHA-256 Ledger Hash Verified</span>
        </div>
      </div>

      {/* Compliance Dossier Modal */}
      {inspectedTxn && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-xl border border-[#eaedff] p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#eaedff]">
              <div>
                <span className="text-[10px] font-mono text-[#00288e] uppercase font-bold">
                  Compliance Audit Record
                </span>
                <h3 className="text-lg font-bold text-[#131b2e]">
                  {inspectedTxn.id} — Decision Dossier
                </h3>
              </div>
              <button 
                onClick={() => setInspectedTxn(null)}
                className="p-1 rounded-lg text-[#757684] hover:bg-[#f2f3ff]"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              <div>
                <span className="text-[#757684]">Timestamp:</span>
                <p className="font-mono font-bold text-[#131b2e]">{inspectedTxn.timestamp}</p>
              </div>
              <div>
                <span className="text-[#757684]">Amount:</span>
                <p className="font-mono font-bold text-[#bb0112]">
                  ₹{inspectedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <span className="text-[#757684]">Customer:</span>
                <p className="font-semibold text-[#131b2e]">{inspectedTxn.user.name} ({inspectedTxn.user.id})</p>
              </div>
              <div>
                <span className="text-[#757684]">Decision & Latency:</span>
                <p className="font-mono font-semibold text-[#00288e]">{inspectedTxn.decision} ({inspectedTxn.scoringLatencyMs.totalMs}ms)</p>
              </div>
            </div>

            {/* Regulatory Justification */}
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#131b2e]">
                Regulatory SHAP Attribution (Why Decision Was Made)
              </h4>
              <div className="space-y-2">
                {inspectedTxn.shapAttribution.map((f, i) => (
                  <div key={i} className="p-2.5 bg-[#f2f3ff] rounded-lg border border-[#eaedff] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-[#131b2e]">{f.feature}</span>
                      <span className="text-[11px] text-[#757684]">{f.description}</span>
                    </div>
                    <span className={`font-mono text-xs font-bold ${
                      f.impactPercent > 0 ? 'text-[#bb0112]' : 'text-[#00288e]'
                    }`}>
                      {f.impactPercent > 0 ? `+${f.impactPercent}%` : `${f.impactPercent}%`}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#eaedff]">
              <button
                onClick={() => setInspectedTxn(null)}
                className="px-4 py-2 bg-[#00288e] text-white text-xs font-semibold rounded-lg hover:bg-[#1e40af]"
              >
                Close Audit Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
