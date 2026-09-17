import React from 'react';
import { RiskLevel, Decision, InvestigationStatus } from '../types';

interface RiskBadgeProps {
  level?: RiskLevel;
  decision?: Decision;
  status?: InvestigationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  decision,
  status,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-bold'
  }[size];

  if (level) {
    const config = {
      HIGH: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      MEDIUM: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      LOW: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
    }[level];

    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold rounded-md border ${config} ${sizeClasses}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${level === 'HIGH' ? 'bg-rose-500 animate-pulse' : level === 'MEDIUM' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
        {level} RISK
      </span>
    );
  }

  if (decision) {
    const config = {
      ALERT: 'bg-rose-600 text-white border-rose-500',
      REVIEW: 'bg-amber-600 text-white border-amber-500',
      PROCEED: 'bg-emerald-700 text-white border-emerald-600'
    }[decision];

    return (
      <span className={`inline-flex items-center gap-1 font-mono font-bold rounded-md border ${config} ${sizeClasses}`}>
        {decision}
      </span>
    );
  }

  if (status) {
    const config = {
      UNREVIEWED: 'bg-slate-800 text-slate-300 border-slate-700',
      INVESTIGATING: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      CLEARED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      CONFIRMED_FRAUD: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
      ESCALATED: 'bg-purple-500/15 text-purple-400 border-purple-500/30'
    }[status];

    const labelMap: Record<InvestigationStatus, string> = {
      UNREVIEWED: 'UNREVIEWED',
      INVESTIGATING: 'IN PROGRESS',
      CLEARED: 'CLEARED',
      CONFIRMED_FRAUD: 'CONFIRMED FRAUD',
      ESCALATED: 'ESCALATED'
    };

    return (
      <span className={`inline-flex items-center gap-1 font-mono font-semibold rounded-md border ${config} ${sizeClasses}`}>
        {labelMap[status]}
      </span>
    );
  }

  return null;
};
