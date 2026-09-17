export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type Decision = 'PROCEED' | 'REVIEW' | 'ALERT';

export type InvestigationStatus = 'UNREVIEWED' | 'INVESTIGATING' | 'CLEARED' | 'CONFIRMED_FRAUD' | 'ESCALATED';

export type FeedbackAction = 'INVESTIGATE' | 'MARK_LEGITIMATE' | 'CONFIRM_FRAUD' | 'ESCALATE';

export interface PredictPayload {
  customer_id: string;
  amount: number;
  merchant?: string;
  location?: string;
  device_id?: string;
  is_new_device?: boolean;
  hour?: number;
  transactions_last_10min?: number;
}

export interface PredictResponse {
  transaction_id: string;
  customer_id: string;
  amount: number;
  merchant: string;
  location: string;
  device_id: string;
  fraud_probability: number; // e.g. 0.91 (0.0 to 1.0)
  anomaly_score: number;    // e.g. 0.87 (0.0 to 1.0)
  risk_score: number;       // 0 to 100
  risk_level: RiskLevel;
  decision: Decision;
  reasons: string[];
  created_at: string;
  investigation_status?: InvestigationStatus;
}

export interface Transaction {
  id: string;
  transaction_id: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  merchant: string;
  location: string;
  device_id: string;
  is_new_device: boolean;
  timestamp: string;
  created_at: string;
  fraud_probability: number;
  anomaly_score: number;
  risk_score: number;
  risk_level: RiskLevel;
  decision: Decision;
  reasons: string[];
  investigation_status: InvestigationStatus;
  analyst_comment?: string;
  reviewed_at?: string;
}

export interface Alert {
  id: string;
  transaction_id: string;
  customer_id: string;
  customer_name?: string;
  amount: number;
  risk_score: number;
  risk_level: RiskLevel;
  decision: Decision;
  status: InvestigationStatus;
  created_at: string;
  location?: string;
  device_id?: string;
}

export interface CustomerBaselinePoint {
  date: string;
  amount: number;
  baseline: number;
  is_anomaly: boolean;
}

export interface Customer {
  customer_id: string;
  name: string;
  average_amount: number;
  normal_locations: string[];
  known_devices: string[];
  typical_transaction_time: string;
  transaction_frequency: string;
  risk_tier: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  recent_transactions: Transaction[];
  baseline_history: CustomerBaselinePoint[];
}

export interface FeedbackPayload {
  transaction_id: string;
  action: FeedbackAction;
  comment?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  transaction_id: string;
  action: FeedbackAction;
  comment?: string;
  investigation_status: InvestigationStatus;
}

export interface MetricsResponse {
  precision: number;
  recall: number;
  f1: number;
  pr_auc: number;
  false_positive_rate: number;
  false_negative_rate: number;
  transaction_count: number;
  high_risk_count: number;
  average_risk_score: number;
  supervised_model: string;
  anomaly_model: string;
  last_trained_at?: string;
}

export interface SystemMetrics {
  transactionsToday: number;
  highRiskCount: number;
  fraudAlertsCount: number;
  averageRiskScore: number;
  riskDistribution: {
    LOW: number;
    MEDIUM: number;
    HIGH: number;
  };
}
