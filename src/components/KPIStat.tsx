import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPIStatProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
    isPositiveGood?: boolean;
  };
  variant?: 'default' | 'danger' | 'warning' | 'success';
}

export const KPIStat: React.FC<KPIStatProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default'
}) => {
  const variantStyles = {
    default: 'bg-slate-900/80 border-slate-800 text-slate-100',
    danger: 'bg-rose-950/30 border-rose-900/50 text-rose-100',
    warning: 'bg-amber-950/30 border-amber-900/50 text-amber-100',
    success: 'bg-emerald-950/30 border-emerald-900/50 text-emerald-100'
  }[variant];

  const iconStyles = {
    default: 'bg-slate-800 text-blue-400',
    danger: 'bg-rose-900/50 text-rose-400',
    warning: 'bg-amber-900/50 text-amber-400',
    success: 'bg-emerald-900/50 text-emerald-400'
  }[variant];

  return (
    <div className={`p-4 rounded-xl border ${variantStyles} shadow-sm flex flex-col justify-between transition-all hover:border-slate-700/80`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
            {title}
          </span>
          <span className="text-2xl font-extrabold font-mono tracking-tight text-slate-100 mt-1">
            {value}
          </span>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconStyles}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {trend && (
            <span className={`font-semibold flex items-center gap-1 ${
              (trend.isUp && trend.isPositiveGood !== false) || (!trend.isUp && trend.isPositiveGood === false)
                ? 'text-emerald-400'
                : 'text-rose-400'
            }`}>
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
