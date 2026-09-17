import React, { useState, useEffect } from 'react';
import { MetricsResponse } from '../types';
import { ModelMetricsCard } from './ModelMetrics';
import { API_SERVICE } from '../services/api';
import { Activity, Cpu, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ModelMonitoringView: React.FC = () => {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchMetrics = () => {
    setLoading(true);
    API_SERVICE.getMetrics()
      .then((data) => setMetrics(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Model Monitoring Header */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              Model Diagnostic & Drift Monitoring
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Live performance evaluation of XGBoost Classifier & Isolation Forest Anomaly Engine
            </p>
          </div>
        </div>

        <button
          onClick={fetchMetrics}
          className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors flex items-center gap-2 font-mono text-xs font-bold shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Model Diagnostics
        </button>
      </div>

      {/* Model Metrics Card */}
      <ModelMetricsCard metrics={metrics} loading={loading} />

    </div>
  );
};
