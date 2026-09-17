import React from 'react';
import { Alert } from '../types';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, ArrowRight, AlertTriangle } from 'lucide-react';

interface AlertCardProps {
  alert: Alert;
  onSelect: (alert: Alert) => void;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onSelect }) => {
  const isHigh = alert.risk_level === 'HIGH';

  return (
    <div
      onClick={() => onSelect(alert)}
      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        isHigh
          ? 'bg-rose-950/20 border-rose-900/50 hover:border-rose-700/80 shadow-rose-950/20'
          : 'bg-amber-950/20 border-amber-900/50 hover:border-amber-700/80 shadow-amber-950/20'
      } shadow-md`}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2.5 rounded-lg shrink-0 mt-0.5 ${isHigh ? 'bg-rose-900/50 text-rose-400' : 'bg-amber-900/50 text-amber-400'}`}>
          {isHigh ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-sm text-slate-100">
              {alert.id}
            </span>
            <span className="text-xs font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
              {alert.transaction_id}
            </span>
            <RiskBadge level={alert.risk_level} size="sm" />
            <RiskBadge status={alert.status} size="sm" />
          </div>

          <div className="flex items-center gap-4 text-xs font-sans text-slate-300 mt-1">
            <span>Customer: <strong className="text-slate-100">{alert.customer_name || alert.customer_id}</strong></span>
            <span>Amount: <strong className="font-mono text-slate-100">₹{alert.amount?.toLocaleString('en-IN')}</strong></span>
            {alert.location && <span className="hidden sm:inline">Location: <span className="text-slate-400">{alert.location}</span></span>}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
        <div className="flex flex-col items-end font-mono">
          <span className="text-[10px] text-slate-400 uppercase">Risk Score</span>
          <span className={`text-xl font-extrabold ${isHigh ? 'text-rose-400' : 'text-amber-400'}`}>
            {alert.risk_score}<span className="text-xs text-slate-500">/100</span>
          </span>
        </div>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-blue-600 hover:text-white transition-colors text-xs font-semibold">
          <span>Investigate</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
