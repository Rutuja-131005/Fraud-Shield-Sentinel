import React, { useState } from 'react';
import { Transaction, SystemMetrics, PredictResponse } from '../types';
import { KPIStat } from './KPIStat';
import { RiskScore } from './RiskScore';
import { RiskBadge } from './RiskBadge';
import { RiskFactors } from './RiskFactors';
import { TransactionTable } from './TransactionTable';
import { API_SERVICE } from '../services/api';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { 
  ReceiptText, 
  ShieldAlert, 
  Bell, 
  Activity, 
  Play, 
  AlertTriangle,
  CheckCircle2,
  Zap,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  transactions: Transaction[];
  systemMetrics: SystemMetrics;
  onSelectTransaction: (tx: Transaction) => void;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  transactions,
  systemMetrics,
  onSelectTransaction,
  onRefreshData
}) => {
  const [simulating, setSimulating] = useState<boolean>(false);
  const [latestPrediction, setLatestPrediction] = useState<PredictResponse | null>(null);

  // Prepare data for Risk Distribution Pie Chart
  const pieData = [
    { name: 'LOW RISK', value: systemMetrics.riskDistribution.LOW || 1, color: '#10b981' },
    { name: 'MEDIUM RISK', value: systemMetrics.riskDistribution.MEDIUM || 1, color: '#f59e0b' },
    { name: 'HIGH RISK', value: systemMetrics.riskDistribution.HIGH || 1, color: '#f43f5e' }
  ];

  const handleSimulateNormal = async () => {
    setSimulating(true);
    try {
      const pred = await API_SERVICE.predictTransaction({
        customer_id: 'C1001',
        amount: 1850,
        merchant: 'Grocery Supermarket',
        location: 'Pune',
        device_id: 'DEV001',
        is_new_device: false,
        hour: 14,
        transactions_last_10min: 1
      });
      setLatestPrediction(pred);
      onRefreshData();
    } catch (e) {
      console.error('Normal simulation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  const handleSimulateSuspicious = async () => {
    setSimulating(true);
    try {
      const pred = await API_SERVICE.predictTransaction({
        customer_id: 'C1001',
        amount: 45000,
        merchant: 'Electronics Superstore',
        location: 'Mumbai',
        device_id: 'DEV999',
        is_new_device: true,
        hour: 3,
        transactions_last_10min: 8
      });
      setLatestPrediction(pred);
      onRefreshData();
    } catch (e) {
      console.error('Suspicious simulation error:', e);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 1. Top KPI Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPIStat
          title="Transactions Today"
          value={systemMetrics.transactionsToday}
          subtitle="Processed payment stream"
          icon={ReceiptText}
          variant="default"
        />

        <KPIStat
          title="High Risk Transactions"
          value={systemMetrics.highRiskCount}
          subtitle="Scored ≥ 70 Risk Level"
          icon={ShieldAlert}
          variant={systemMetrics.highRiskCount > 0 ? "danger" : "default"}
          trend={{ value: `${systemMetrics.highRiskCount} critical`, isUp: true, isPositiveGood: false }}
        />

        <KPIStat
          title="Fraud Alerts"
          value={systemMetrics.fraudAlertsCount}
          subtitle="Requires analyst action"
          icon={Bell}
          variant={systemMetrics.fraudAlertsCount > 0 ? "warning" : "default"}
        />

        <KPIStat
          title="Average Risk Score"
          value={`${systemMetrics.averageRiskScore}/100`}
          subtitle="System-wide aggregate"
          icon={Activity}
          variant={systemMetrics.averageRiskScore >= 50 ? "warning" : "success"}
        />
      </div>

      {/* 2. Prominent Section: Live Transaction Monitoring Simulator */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold text-slate-100 flex items-center gap-2">
                Live Transaction Monitoring & Real-time Predict Simulator
              </h2>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Inject transactions into POST /api/predict and evaluate dual ML scoring response in real time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              disabled={simulating}
              onClick={handleSimulateNormal}
              className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              [Simulate Normal Transaction]
            </button>

            <button
              disabled={simulating}
              onClick={handleSimulateSuspicious}
              className="px-4 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold flex items-center gap-2 transition-all shadow-sm animate-pulse"
            >
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              [Simulate Suspicious Transaction]
            </button>
          </div>
        </div>

        {/* Display Simulated Prediction Result */}
        {latestPrediction ? (
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs font-mono border-b border-slate-800/80 pb-2">
              <span className="text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Latest Prediction Result from POST /api/predict
              </span>
              <span className="text-slate-500">
                Timestamp: {new Date(latestPrediction.created_at).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-center">
              {/* Score Gauge */}
              <RiskScore
                score={latestPrediction.risk_score}
                riskLevel={latestPrediction.risk_level}
                decision={latestPrediction.decision}
                fraudProb={latestPrediction.fraud_probability}
                anomalyScore={latestPrediction.anomaly_score}
                showBreakdown={true}
              />

              {/* Transaction Metadata & Explainability */}
              <div className="lg:col-span-2 space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">TX ID</span>
                    <span className="font-bold text-blue-400 truncate block mt-0.5">{latestPrediction.transaction_id}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Amount</span>
                    <span className="font-bold text-slate-100 block mt-0.5">₹{latestPrediction.amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Customer</span>
                    <span className="font-bold text-slate-200 block mt-0.5">{latestPrediction.customer_id}</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase block">Location / Device</span>
                    <span className="font-bold text-slate-200 truncate block mt-0.5">{latestPrediction.location} ({latestPrediction.device_id})</span>
                  </div>
                </div>

                <RiskFactors reasons={latestPrediction.reasons} />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-xs font-mono text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800/60">
            Click either button above to test the real-time POST /api/predict transaction scoring engine.
          </div>
        )}
      </div>

      {/* 3. Middle Section: Risk Distribution Chart & Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart for LOW, MEDIUM, HIGH Risk Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Risk Level Distribution
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              LOW / MED / HIGH
            </span>
          </div>

          <div className="h-48 w-full my-2 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 font-mono text-center text-xs pt-3 border-t border-slate-800">
            <div className="p-2 rounded bg-emerald-950/30 border border-emerald-900/50">
              <span className="text-[10px] text-emerald-400 font-bold block">LOW</span>
              <span className="font-extrabold text-slate-100">{systemMetrics.riskDistribution.LOW}</span>
            </div>
            <div className="p-2 rounded bg-amber-950/30 border border-amber-900/50">
              <span className="text-[10px] text-amber-400 font-bold block">MEDIUM</span>
              <span className="font-extrabold text-slate-100">{systemMetrics.riskDistribution.MEDIUM}</span>
            </div>
            <div className="p-2 rounded bg-rose-950/30 border border-rose-900/50">
              <span className="text-[10px] text-rose-400 font-bold block">HIGH</span>
              <span className="font-extrabold text-slate-100">{systemMetrics.riskDistribution.HIGH}</span>
            </div>
          </div>
        </div>

        {/* System Architecture Summary Card */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              FraudShield AI Dual Scoring Pipeline
            </h3>
            <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
              Sub-100ms Synchronous Response
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-blue-400 uppercase text-[11px] block">
                1. Supervised XGBoost Model
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Calculates probability of known fraud patterns trained on labeled chargeback data. Handles severe class imbalance using pos-weighting.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
              <span className="font-mono font-bold text-purple-400 uppercase text-[11px] block">
                2. Isolation Forest Anomaly Engine
              </span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Detects behavioral outliers from 90-day baseline profiles. Measures distance in feature space for zero-day attack vectors.
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between font-mono text-xs">
            <span className="text-slate-400">Risk Aggregation Weighting:</span>
            <span className="font-bold text-slate-200">
              60% XGBoost Probability + 40% Anomaly Score
            </span>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions Table */}
      <TransactionTable
        transactions={transactions}
        onSelectTransaction={onSelectTransaction}
        title="Recent Transactions Stream"
      />

    </div>
  );
};
