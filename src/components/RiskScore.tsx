import React from 'react';
import { RiskLevel, Decision } from '../types';
import { RiskBadge } from './RiskBadge';
import { ShieldAlert, AlertTriangle, ShieldCheck } from 'lucide-react';

interface RiskScoreProps {
  score: number; // 0 to 100
  riskLevel: RiskLevel;
  decision: Decision;
  fraudProb?: number; // 0.0 to 1.0
  anomalyScore?: number; // 0.0 to 1.0
  showBreakdown?: boolean;
}

export const RiskScore: React.FC<RiskScoreProps> = ({
  score,
  riskLevel,
  decision,
  fraudProb,
  anomalyScore,
  showBreakdown = true
}) => {
  const getColor = () => {
    if (score >= 70) return {
      stroke: '#f43f5e',
      text: 'text-rose-400',
      bg: 'bg-rose-950/40 border-rose-800/50',
      glow: 'shadow-rose-900/20'
    };
    if (score >= 40) return {
      stroke: '#f59e0b',
      text: 'text-amber-400',
      bg: 'bg-amber-950/40 border-amber-800/50',
      glow: 'shadow-amber-900/20'
    };
    return {
      stroke: '#10b981',
      text: 'text-emerald-400',
      bg: 'bg-emerald-950/40 border-emerald-800/50',
      glow: 'shadow-emerald-900/20'
    };
  };

  const style = getColor();
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={`p-5 rounded-2xl border ${style.bg} ${style.glow} shadow-xl flex flex-col items-center justify-between gap-4 text-center relative overflow-hidden bg-slate-900/90 backdrop-blur-md`}>
      {/* Background Accent Pulse */}
      <div className={`absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl opacity-20 ${score >= 70 ? 'bg-rose-500' : score >= 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} />

      <div className="w-full flex items-center justify-between text-xs text-slate-400 font-mono">
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-slate-300">
          {score >= 70 ? <ShieldAlert className="w-4 h-4 text-rose-400" /> : score >= 40 ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
          Aggregated Risk Score
        </span>
        <RiskBadge level={riskLevel} size="sm" />
      </div>

      {/* Circle Gauge */}
      <div className="relative w-32 h-32 flex items-center justify-center my-1">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke={style.stroke}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-mono text-3xl font-extrabold ${style.text}`}>
            {score}
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            out of 100
          </span>
        </div>
      </div>

      {/* Decision Tag */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Automated Decision:</span>
          <RiskBadge decision={decision} size="md" />
        </div>
      </div>

      {/* Dual Engine Breakdown */}
      {showBreakdown && (fraudProb !== undefined || anomalyScore !== undefined) && (
        <div className="w-full pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 flex flex-col items-start">
            <span className="text-[10px] text-slate-400 uppercase">XGBoost Fraud</span>
            <span className="font-bold text-slate-200 mt-0.5">
              {((fraudProb ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
          <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800/60 flex flex-col items-start">
            <span className="text-[10px] text-slate-400 uppercase">Isolation Anomaly</span>
            <span className="font-bold text-slate-200 mt-0.5">
              {((anomalyScore ?? 0) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
