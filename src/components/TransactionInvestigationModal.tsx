import React, { useState } from 'react';
import { Transaction, FeedbackAction } from '../types';
import { RiskScore } from './RiskScore';
import { RiskBadge } from './RiskBadge';
import { RiskFactors } from './RiskFactors';
import { BehaviorBaseline } from './BehaviorBaseline';
import { TransactionTimeline } from './TransactionTimeline';
import { API_SERVICE } from '../services/api';
import { 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  ArrowUpRight, 
  CheckCircle, 
  MessageSquare,
  AlertOctagon,
  Clock,
  Layers,
  MapPin,
  Smartphone
} from 'lucide-react';

interface TransactionInvestigationModalProps {
  transaction: Transaction | null;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const TransactionInvestigationModal: React.FC<TransactionInvestigationModalProps> = ({
  transaction,
  onClose,
  onRefreshData
}) => {
  if (!transaction) return null;

  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(transaction.investigation_status || 'UNREVIEWED');

  const handleAnalystAction = async (action: FeedbackAction) => {
    setSubmitting(true);
    setFeedbackSuccessMsg(null);

    try {
      const res = await API_SERVICE.postFeedback({
        transaction_id: transaction.transaction_id || transaction.id,
        action,
        comment: comment.trim() || `Analyst performed ${action} action.`
      });

      setCurrentStatus(res.investigation_status);
      setFeedbackSuccessMsg(`Feedback recorded successfully: Action [${action}] applied to ${transaction.transaction_id}. Original risk score (${transaction.risk_score}) preserved.`);
      setComment('');
      
      if (onRefreshData) {
        onRefreshData();
      }
    } catch (e) {
      console.error('Failed to submit analyst feedback:', e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col text-slate-100 font-sans my-auto">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-mono font-extrabold text-slate-100">
                  {transaction.transaction_id}
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  ({transaction.merchant})
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans">
                Analyst Deep Investigation Page • ID: {transaction.customer_id}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Success Notification Banner */}
        {feedbackSuccessMsg && (
          <div className="m-5 mb-0 p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-3 shadow-lg">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="flex flex-col">
              <span className="font-bold">{feedbackSuccessMsg}</span>
              <span className="text-[10px] text-emerald-400/80 mt-0.5">
                Note: Original ML Risk Score ({transaction.risk_score}/100) and Risk Level ({transaction.risk_level}) are preserved separately from Investigation Status ({currentStatus}).
              </span>
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Top Status & Risk Banner */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {/* Risk Gauge */}
            <RiskScore
              score={transaction.risk_score}
              riskLevel={transaction.risk_level}
              decision={transaction.decision}
              fraudProb={transaction.fraud_probability}
              anomalyScore={transaction.anomaly_score}
              showBreakdown={true}
            />

            {/* Status & Quick Info */}
            <div className="md:col-span-2 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Status & Classification (Separated Fields)
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Risk Level:</span>
                  <RiskBadge level={transaction.risk_level} size="sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Investigation Status</span>
                  <div className="mt-1">
                    <RiskBadge status={currentStatus} size="sm" />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Transaction Amount</span>
                  <span className="text-sm font-bold text-slate-100 mt-1 block">
                    ₹{transaction.amount?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Origin Location</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                    {transaction.location}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Device ID</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block truncate">
                    {transaction.device_id}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">XGBoost Fraud Prob</span>
                  <span className="text-xs font-bold text-rose-400 mt-1 block">
                    {((transaction.fraud_probability ?? 0) * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase block">Isolation Anomaly</span>
                  <span className="text-xs font-bold text-amber-400 mt-1 block">
                    {((transaction.anomaly_score ?? 0) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Customer Name: <strong className="text-slate-200">{transaction.customer_name || transaction.customer_id}</strong></span>
                <span>Time: <span className="font-mono text-slate-300">{new Date(transaction.timestamp).toLocaleTimeString()} IST</span></span>
              </div>
            </div>
          </div>

          {/* Explainability Section */}
          <RiskFactors reasons={transaction.reasons} />

          {/* Behavioral Baseline */}
          <BehaviorBaseline transaction={transaction} />

          {/* Scoring & Review Timeline */}
          <TransactionTimeline transaction={transaction} />

          {/* Analyst Actions & Feedback Form */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Analyst Actions & Feedback Logging (POST /api/feedback)
              </h3>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-mono text-slate-400">
                Analyst Investigation Notes / Rationale:
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g. Spoke with cardholder via phone verification. Confirmed legitimate high-value electronics purchase in Mumbai."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors font-mono min-h-[70px]"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <button
                disabled={submitting}
                onClick={() => handleAnalystAction('INVESTIGATE')}
                className="px-4 py-2.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/60 text-blue-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <UserCheck className="w-4 h-4" />
                [Investigate]
              </button>

              <button
                disabled={submitting}
                onClick={() => handleAnalystAction('MARK_LEGITIMATE')}
                className="px-4 py-2.5 rounded-xl bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/60 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                [Mark Legitimate]
              </button>

              <button
                disabled={submitting}
                onClick={() => handleAnalystAction('CONFIRM_FRAUD')}
                className="px-4 py-2.5 rounded-xl bg-rose-900/40 hover:bg-rose-800/60 border border-rose-700/60 text-rose-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                [Confirm Fraud]
              </button>

              <button
                disabled={submitting}
                onClick={() => handleAnalystAction('ESCALATE')}
                className="px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-800/60 border border-purple-700/60 text-purple-300 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 text-purple-400" />
                [Escalate]
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
