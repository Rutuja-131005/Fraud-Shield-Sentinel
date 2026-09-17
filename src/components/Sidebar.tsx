import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ReceiptText, 
  Bell, 
  Users, 
  Activity,
  CheckCircle2,
  AlertCircle,
  Radio
} from 'lucide-react';

export type NavTab = 'dashboard' | 'transactions' | 'alerts' | 'customers' | 'model-monitoring';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  highRiskAlertsCount: number;
  apiConnected: boolean;
  onToggleApiMode?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  highRiskAlertsCount,
  apiConnected,
  onToggleApiMode
}) => {
  return (
    <aside 
      id="fraudshield-sidebar"
      className="fixed left-0 top-0 h-full w-64 bg-slate-950 border-r border-slate-800/80 z-50 flex flex-col justify-between select-none text-slate-300 font-sans"
    >
      <div className="flex flex-col">
        {/* Brand Logo Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-extrabold text-base tracking-wider text-slate-100 flex items-center gap-1">
                FraudShield<span className="text-blue-400">.AI</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight">
                RISK INTELLIGENCE PLATFORM
              </span>
            </div>
          </div>
        </div>

        {/* System Active Engine Telemetry */}
        <div className="px-4 py-3">
          <div className="px-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                DUAL SCORING ENGINE
              </span>
            </div>
            <span className="font-mono text-[11px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
              v2.4 READY
            </span>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex flex-col gap-1.5 px-3 mt-2">
          {/* Dashboard */}
          <button
            id="nav-dashboard"
            onClick={() => onSelectTab('dashboard')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left font-medium text-sm ${
              currentTab === 'dashboard'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4.5 h-4.5" />
              <span>Dashboard</span>
            </div>
          </button>

          {/* Transactions */}
          <button
            id="nav-transactions"
            onClick={() => onSelectTab('transactions')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left font-medium text-sm ${
              currentTab === 'transactions'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <ReceiptText className="w-4.5 h-4.5" />
              <span>Transactions</span>
            </div>
          </button>

          {/* Alerts */}
          <button
            id="nav-alerts"
            onClick={() => onSelectTab('alerts')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left font-medium text-sm ${
              currentTab === 'alerts'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Bell className="w-4.5 h-4.5" />
              <span>Alerts</span>
            </div>
            {highRiskAlertsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full font-mono text-[11px] font-bold bg-rose-500 text-white shadow-sm">
                {highRiskAlertsCount}
              </span>
            )}
          </button>

          {/* Customers */}
          <button
            id="nav-customers"
            onClick={() => onSelectTab('customers')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left font-medium text-sm ${
              currentTab === 'customers'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4.5 h-4.5" />
              <span>Customers</span>
            </div>
          </button>

          {/* Model Monitoring */}
          <button
            id="nav-model-monitoring"
            onClick={() => onSelectTab('model-monitoring')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-left font-medium text-sm ${
              currentTab === 'model-monitoring'
                ? 'bg-blue-600 text-white font-semibold shadow-lg shadow-blue-600/25 border border-blue-500/40'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Activity className="w-4.5 h-4.5" />
              <span>Model Monitoring</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Footer: System Status & API Connected */}
      <div className="p-4 flex flex-col gap-2 bg-slate-950 border-t border-slate-800/80">
        <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">
              System Status
            </span>
          </div>
          <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            OPERATIONAL
          </span>
        </div>

        <button
          onClick={onToggleApiMode}
          className="p-2.5 bg-slate-900/90 hover:bg-slate-800 rounded-xl border border-slate-800 flex items-center justify-between transition-colors text-left"
          title="Click to check or toggle API connection status"
        >
          <div className="flex items-center gap-2">
            {apiConnected ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            )}
            <span className="text-xs font-mono font-medium text-slate-300">
              API Connected
            </span>
          </div>
          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded ${
            apiConnected ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-400'
          }`}>
            {apiConnected ? 'FastAPI :8000' : 'Demo Mode'}
          </span>
        </button>
      </div>
    </aside>
  );
};
