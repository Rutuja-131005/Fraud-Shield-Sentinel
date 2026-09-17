import React, { useState, useEffect } from 'react';
import { NavTab } from './Sidebar';
import { Shield, Clock, Search, Bell, UserCheck } from 'lucide-react';

interface HeaderProps {
  currentTab: NavTab;
  highRiskCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, highRiskCount }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Fraud Analytics & Risk Dashboard',
      subtitle: 'Real-time Payment Gateway Monitoring & Dual ML Scoring Engine'
    },
    transactions: {
      title: 'Transaction Audit & Investigation Log',
      subtitle: 'Comprehensive payment stream history and explainable risk scores'
    },
    alerts: {
      title: 'High Risk Fraud & Review Alerts',
      subtitle: 'Actionable queue for SOC risk analysts and dispute investigators'
    },
    customers: {
      title: 'Customer Behavioral Intelligence',
      subtitle: '90-day baseline profiles, authorized hardware, and geographic drift'
    },
    'model-monitoring': {
      title: 'ML Model Performance & Diagnostics',
      subtitle: 'XGBoost Supervised Fraud Model & Isolation Forest Anomaly Monitor'
    }
  };

  const currentMeta = titles[currentTab] || titles.dashboard;

  return (
    <header className="h-20 bg-slate-950 border-b border-slate-800/80 px-8 flex items-center justify-between text-slate-100 font-sans sticky top-0 z-40 backdrop-blur-md">
      <div className="flex flex-col">
        <h1 className="text-lg font-mono font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
          {currentMeta.title}
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          {currentMeta.subtitle}
        </p>
      </div>

      <div className="flex items-center gap-5">
        {/* Real-time Clock */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-slate-300">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>{timeStr || '03:15:00 IST'}</span>
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden lg:block w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search TX-ID, Customer, IP..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono"
          />
        </div>

        {/* Alert Indicator */}
        <div className="relative">
          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300">
            <Bell className="w-4 h-4" />
          </div>
          {highRiskCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center animate-pulse">
              {highRiskCount}
            </span>
          )}
        </div>

        {/* Analyst Profile */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 font-mono font-bold text-xs shadow-inner">
            <UserCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-bold text-slate-200 font-sans">
              Analyst SOC-1
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              Tier-1 Security Ops
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
