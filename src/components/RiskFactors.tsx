import React from 'react';
import { 
  AlertTriangle, 
  Smartphone, 
  MapPin, 
  Clock, 
  Zap, 
  DollarSign, 
  HelpCircle,
  CheckCircle2
} from 'lucide-react';

interface RiskFactorsProps {
  reasons: string[];
  title?: string;
  className?: string;
}

export const RiskFactors: React.FC<RiskFactorsProps> = ({
  reasons,
  title = "Why was this transaction flagged?",
  className = ""
}) => {
  const getIconAndSeverity = (reason: string) => {
    const lower = reason.toLowerCase();
    if (lower.includes('amount') || lower.includes('baseline')) {
      return {
        icon: DollarSign,
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        severity: 'HIGH IMPACT'
      };
    }
    if (lower.includes('device')) {
      return {
        icon: Smartphone,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        severity: 'CRITICAL'
      };
    }
    if (lower.includes('location') || lower.includes('drift')) {
      return {
        icon: MapPin,
        color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
        severity: 'ELEVATED'
      };
    }
    if (lower.includes('time') || lower.includes('hour')) {
      return {
        icon: Clock,
        color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        severity: 'MODERATE'
      };
    }
    if (lower.includes('velocity') || lower.includes('frequency') || lower.includes('spike')) {
      return {
        icon: Zap,
        color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        severity: 'HIGH IMPACT'
      };
    }
    if (lower.includes('normal') || lower.includes('trusted')) {
      return {
        icon: CheckCircle2,
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        severity: 'PASS'
      };
    }
    return {
      icon: AlertTriangle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      severity: 'NOTICE'
    };
  };

  return (
    <div className={`p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-3 ${className}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-blue-400" />
          {title}
        </h4>
        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
          SHAP Feature Attribution
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {reasons && reasons.length > 0 ? (
          reasons.map((reason, idx) => {
            const { icon: Icon, color, severity } = getIconAndSeverity(reason);
            return (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-3 transition-all hover:border-slate-700"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`p-1.5 rounded-md border ${color} shrink-0 mt-0.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-200 font-medium leading-relaxed">
                    {reason}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                  {severity}
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-3 text-xs text-slate-500 italic">
            No anomalous risk factors identified.
          </div>
        )}
      </div>
    </div>
  );
};
