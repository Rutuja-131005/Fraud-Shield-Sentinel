import React from 'react';
import { Transaction } from '../types';
import { RiskBadge } from './RiskBadge';
import { Eye, ExternalLink, ArrowUpDown } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
  title?: string;
  limit?: number;
}

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  title = "Recent Ingested Transactions",
  limit
}) => {
  const displayList = limit ? transactions.slice(0, limit) : transactions;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {title && (
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              {title}
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2.5 py-1 rounded border border-slate-800">
            {transactions.length} Total Records
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">Transaction ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4 text-right">Amount (₹)</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4 text-center">Risk Score</th>
              <th className="py-3 px-4">Risk Level</th>
              <th className="py-3 px-4">Decision</th>
              <th className="py-3 px-4">Inv. Status</th>
              <th className="py-3 px-4 text-right">Time</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-slate-300 font-mono">
            {displayList && displayList.length > 0 ? (
              displayList.map((tx) => (
                <tr
                  key={tx.id || tx.transaction_id}
                  onClick={() => onSelectTransaction(tx)}
                  className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                >
                  <td className="py-3 px-4 font-bold text-blue-400 flex items-center gap-1.5">
                    <span>{tx.transaction_id}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">
                    <div>{tx.customer_name || tx.customer_id}</div>
                    <div className="text-[10px] font-mono text-slate-500">{tx.customer_id}</div>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">
                    ₹{tx.amount?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-sans">
                    {tx.location}
                  </td>
                  <td className="py-3 px-4 text-slate-400 truncate max-w-[110px]" title={tx.device_id}>
                    {tx.device_id}
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-sm">
                    <span className={tx.risk_score >= 70 ? 'text-rose-400' : tx.risk_score >= 40 ? 'text-amber-400' : 'text-emerald-400'}>
                      {tx.risk_score}
                    </span>
                    <span className="text-[10px] text-slate-500">/100</span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={tx.risk_level} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge decision={tx.decision} size="sm" />
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge status={tx.investigation_status || 'UNREVIEWED'} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                    {tx.timestamp ? new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '03:15 IST'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTransaction(tx);
                      }}
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      title="Investigate Transaction"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={11} className="py-8 text-center text-slate-500 font-sans">
                  No transactions recorded yet. Click [Simulate Transaction] above to test.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
