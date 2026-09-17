import React, { useState } from 'react';
import { Alert, Transaction } from '../types';
import { AlertCard } from './AlertCard';
import { Bell, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface AlertsViewProps {
  alerts: Alert[];
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  transactions,
  onSelectTransaction
}) => {
  const [activeTab, setActiveTab] = useState<'HIGH' | 'MEDIUM'>('HIGH');

  const highAlerts = alerts.filter(a => a.risk_level === 'HIGH');
  const mediumAlerts = alerts.filter(a => a.risk_level === 'MEDIUM');

  const currentList = activeTab === 'HIGH' ? highAlerts : mediumAlerts;

  const handleAlertClick = (alert: Alert) => {
    const matchedTx = transactions.find(
      t => t.transaction_id === alert.transaction_id || t.id === alert.transaction_id
    ) || {
      id: alert.transaction_id,
      transaction_id: alert.transaction_id,
      customer_id: alert.customer_id,
      customer_name: alert.customer_name,
      amount: alert.amount,
      merchant: 'Merchant',
      location: alert.location || 'Location',
      device_id: alert.device_id || 'DEV1',
      is_new_device: true,
      timestamp: alert.created_at,
      created_at: alert.created_at,
      fraud_probability: alert.risk_score / 100,
      anomaly_score: alert.risk_score / 100,
      risk_score: alert.risk_score,
      risk_level: alert.risk_level,
      decision: alert.decision,
      reasons: ['Flagged by automated alert rules engine'],
      investigation_status: alert.status
    };

    onSelectTransaction(matchedTx);
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Alert Queue Tabs */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-950/80 text-rose-400 border border-rose-900/50">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              Fraud Alerts & Review Queue
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Select any alert to open full analyst investigation context
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('HIGH')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'HIGH'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            High Risk Alerts ({highAlerts.length})
          </button>

          <button
            onClick={() => setActiveTab('MEDIUM')}
            className={`px-4 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'MEDIUM'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Medium Risk Reviews ({mediumAlerts.length})
          </button>
        </div>
      </div>

      {/* Alert List Cards */}
      <div className="space-y-3">
        {currentList && currentList.length > 0 ? (
          currentList.map((alert) => (
            <AlertCard
              key={alert.id || alert.transaction_id}
              alert={alert}
              onSelect={handleAlertClick}
            />
          ))
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 font-mono text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-slate-200">No {activeTab} Risk alerts pending review.</p>
            <p className="text-slate-500">All alerts in this category have been cleared or investigated.</p>
          </div>
        )}
      </div>

    </div>
  );
};
