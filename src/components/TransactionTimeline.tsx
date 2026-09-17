import React from 'react';
import { Transaction } from '../types';
import { Clock, ShieldAlert, Cpu, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

interface TransactionTimelineProps {
  transaction: Transaction;
}

export const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ transaction }) => {
  const isHighRisk = transaction.risk_level === 'HIGH';
  const isMediumRisk = transaction.risk_level === 'MEDIUM';

  const events = [
    {
      time: transaction.created_at ? new Date(transaction.created_at).toLocaleTimeString() : '03:15:02 IST',
      title: 'Payment Gateway Ingestion',
      description: `Transaction ${transaction.transaction_id} payload received from ${transaction.location} (${transaction.merchant}).`,
      icon: Clock,
      color: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
    },
    {
      time: transaction.created_at ? new Date(new Date(transaction.created_at).getTime() + 12).toLocaleTimeString() : '03:15:02 IST',
      title: 'Behavioral Feature Extraction',
      description: `Compared ₹${transaction.amount.toLocaleString()} against customer 90-day baseline. Calculated Z-score & velocity vectors.`,
      icon: Cpu,
      color: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
    },
    {
      time: transaction.created_at ? new Date(new Date(transaction.created_at).getTime() + 28).toLocaleTimeString() : '03:15:02 IST',
      title: 'Dual ML Engine Scoring',
      description: `XGBoost Fraud Prob: ${(transaction.fraud_probability * 100).toFixed(1)}% • Isolation Forest Anomaly: ${(transaction.anomaly_score * 100).toFixed(1)}%. Calculated Risk Score: ${transaction.risk_score}/100.`,
      icon: ShieldAlert,
      color: isHighRisk ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    },
    {
      time: transaction.created_at ? new Date(new Date(transaction.created_at).getTime() + 35).toLocaleTimeString() : '03:15:02 IST',
      title: `Automated Decision: ${transaction.decision}`,
      description: `Risk Level classified as ${transaction.risk_level}. Decision engine routed transaction to ${transaction.decision}.`,
      icon: isHighRisk ? AlertTriangle : CheckCircle2,
      color: isHighRisk ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' : isMediumRisk ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
    }
  ];

  if (transaction.investigation_status && transaction.investigation_status !== 'UNREVIEWED') {
    events.push({
      time: transaction.reviewed_at ? new Date(transaction.reviewed_at).toLocaleTimeString() : 'Recent',
      title: `Analyst Action: ${transaction.investigation_status.replace('_', ' ')}`,
      description: transaction.analyst_comment || `Investigation status updated to ${transaction.investigation_status}. Original risk score (${transaction.risk_score}) preserved.`,
      icon: UserCheck,
      color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
    });
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Scoring & Investigation Timeline
        </h4>
        <span className="text-[10px] font-mono text-slate-400">
          Latency: &lt; 38 ms total
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {events.map((evt, idx) => {
          const Icon = evt.icon;
          return (
            <div key={idx} className="relative flex items-start gap-3">
              <div className={`absolute -left-6 p-1 rounded-full border bg-slate-950 ${evt.color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 w-full">
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span className="font-bold text-slate-200">{evt.title}</span>
                  <span className="font-mono text-[10px] text-slate-500">{evt.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
