import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { TransactionsView } from './components/TransactionsView';
import { AlertsView } from './components/AlertsView';
import { CustomersView } from './components/CustomersView';
import { ModelMonitoringView } from './components/ModelMonitoringView';
import { TransactionInvestigationModal } from './components/TransactionInvestigationModal';
import { API_SERVICE } from './services/api';
import { Transaction, Alert, SystemMetrics } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const loadData = useCallback(async () => {
    try {
      const health = await API_SERVICE.checkHealth();
      setApiConnected(health.backend_connected);

      const txs = await API_SERVICE.getTransactions();
      setTransactions(txs);

      const alrts = await API_SERVICE.getAlerts();
      setAlerts(alrts);
    } catch (e) {
      console.error('Data refresh error:', e);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Refresh periodically every 8 seconds
    const interval = setInterval(loadData, 8000);
    return () => clearInterval(interval);
  }, [loadData]);

  const systemMetrics: SystemMetrics = API_SERVICE.getSystemMetrics(transactions);
  const highRiskCount = alerts.filter(a => a.risk_level === 'HIGH' && a.status === 'UNREVIEWED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex antialiased selection:bg-blue-600 selection:text-white">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        highRiskAlertsCount={highRiskCount}
        apiConnected={apiConnected}
        onToggleApiMode={loadData}
      />

      {/* Main Workspace */}
      <div className="pl-64 flex-1 flex flex-col min-w-0 min-h-screen bg-slate-950">
        {/* Header */}
        <Header
          currentTab={currentTab}
          highRiskCount={highRiskCount}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 pb-16">
          {currentTab === 'dashboard' && (
            <DashboardView
              transactions={transactions}
              systemMetrics={systemMetrics}
              onSelectTransaction={setSelectedTransaction}
              onRefreshData={loadData}
            />
          )}

          {currentTab === 'transactions' && (
            <TransactionsView
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
              onRefreshData={loadData}
            />
          )}

          {currentTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              transactions={transactions}
              onSelectTransaction={setSelectedTransaction}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersView
              onSelectTransaction={setSelectedTransaction}
            />
          )}

          {currentTab === 'model-monitoring' && (
            <ModelMonitoringView />
          )}
        </main>
      </div>

      {/* Transaction Investigation Modal */}
      {selectedTransaction && (
        <TransactionInvestigationModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
          onRefreshData={loadData}
        />
      )}
    </div>
  );
}

export default App;
