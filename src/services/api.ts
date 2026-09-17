import {
  PredictPayload,
  PredictResponse,
  Transaction,
  Alert,
  Customer,
  FeedbackPayload,
  FeedbackResponse,
  MetricsResponse,
  SystemMetrics
} from '../types';

// API Base URL from env variable, defaulting to http://localhost:8000
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || (import.meta as any).env?.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

let isBackendAvailable = false;
let lastCheckTime = 0;

// Internal Mock Database for seamless fallback / demo mode
const mockCustomers: Customer[] = [
  {
    customer_id: 'C1001',
    name: 'Rahul Sharma',
    average_amount: 2500,
    normal_locations: ['Pune', 'Mumbai'],
    known_devices: ['DEV001 (iPhone 14)', 'DEV002 (MacBook Pro)'],
    typical_transaction_time: '09:00 – 22:00',
    transaction_frequency: '3.4 tx/day',
    risk_tier: 'Low Risk',
    recent_transactions: [],
    baseline_history: [
      { date: 'Sep 10', amount: 1500, baseline: 2500, is_anomaly: false },
      { date: 'Sep 11', amount: 2200, baseline: 2500, is_anomaly: false },
      { date: 'Sep 12', amount: 3100, baseline: 2500, is_anomaly: false },
      { date: 'Sep 13', amount: 2700, baseline: 2500, is_anomaly: false },
      { date: 'Sep 14', amount: 1800, baseline: 2500, is_anomaly: false },
      { date: 'Sep 15', amount: 2400, baseline: 2500, is_anomaly: false },
      { date: 'Sep 16', amount: 45000, baseline: 2500, is_anomaly: true },
    ]
  },
  {
    customer_id: 'C1002',
    name: 'Priya Patel',
    average_amount: 8200,
    normal_locations: ['Bengaluru', 'Chennai'],
    known_devices: ['DEV003 (Samsung S23)', 'DEV004 (iPad Air)'],
    typical_transaction_time: '08:00 – 20:00',
    transaction_frequency: '5.1 tx/day',
    risk_tier: 'Moderate Risk',
    recent_transactions: [],
    baseline_history: [
      { date: 'Sep 10', amount: 7500, baseline: 8200, is_anomaly: false },
      { date: 'Sep 11', amount: 8900, baseline: 8200, is_anomaly: false },
      { date: 'Sep 12', amount: 9100, baseline: 8200, is_anomaly: false },
      { date: 'Sep 13', amount: 8100, baseline: 8200, is_anomaly: false },
      { date: 'Sep 14', amount: 125000, baseline: 8200, is_anomaly: true },
    ]
  },
  {
    customer_id: 'C1003',
    name: 'Vikram Malhotra',
    average_amount: 14500,
    normal_locations: ['Delhi NCR', 'Gurugram'],
    known_devices: ['DEV005 (Pixel 8 Pro)'],
    typical_transaction_time: '10:00 – 23:00',
    transaction_frequency: '1.8 tx/day',
    risk_tier: 'Low Risk',
    recent_transactions: [],
    baseline_history: [
      { date: 'Sep 10', amount: 12000, baseline: 14500, is_anomaly: false },
      { date: 'Sep 11', amount: 15400, baseline: 14500, is_anomaly: false },
      { date: 'Sep 12', amount: 13800, baseline: 14500, is_anomaly: false },
      { date: 'Sep 13', amount: 16100, baseline: 14500, is_anomaly: false },
    ]
  }
];

let mockTransactions: Transaction[] = [
  {
    id: 'TX-90214-MUM',
    transaction_id: 'TX-90214-MUM',
    customer_id: 'C1001',
    customer_name: 'Rahul Sharma',
    amount: 45000,
    merchant: 'Electronics Superstore',
    location: 'Mumbai',
    device_id: 'DEV999',
    is_new_device: true,
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    created_at: new Date(Date.now() - 5 * 60000).toISOString(),
    fraud_probability: 0.91,
    anomaly_score: 0.87,
    risk_score: 94,
    risk_level: 'HIGH',
    decision: 'ALERT',
    reasons: [
      'Transaction amount is significantly above customer baseline',
      'New device detected',
      'Unusual transaction time',
      'High transaction velocity'
    ],
    investigation_status: 'UNREVIEWED'
  },
  {
    id: 'TX-88301-BLR',
    transaction_id: 'TX-88301-BLR',
    customer_id: 'C1002',
    customer_name: 'Priya Patel',
    amount: 125000,
    merchant: 'Bullion Exchange Vault',
    location: 'Dubai',
    device_id: 'DEV888',
    is_new_device: true,
    timestamp: new Date(Date.now() - 18 * 60000).toISOString(),
    created_at: new Date(Date.now() - 18 * 60000).toISOString(),
    fraud_probability: 0.96,
    anomaly_score: 0.94,
    risk_score: 97,
    risk_level: 'HIGH',
    decision: 'ALERT',
    reasons: [
      'Transaction amount is significantly above customer baseline',
      'Unusual location (Cross-border location drift)',
      'New device detected',
      'High transaction velocity'
    ],
    investigation_status: 'INVESTIGATING'
  },
  {
    id: 'TX-77102-PUN',
    transaction_id: 'TX-77102-PUN',
    customer_id: 'C1001',
    customer_name: 'Rahul Sharma',
    amount: 1250,
    merchant: 'Starbucks Coffee',
    location: 'Pune',
    device_id: 'DEV001',
    is_new_device: false,
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
    fraud_probability: 0.04,
    anomaly_score: 0.08,
    risk_score: 12,
    risk_level: 'LOW',
    decision: 'PROCEED',
    reasons: [
      'Normal transaction amount within customer baseline',
      'Recognized trusted device',
      'Known primary billing location'
    ],
    investigation_status: 'CLEARED'
  },
  {
    id: 'TX-66409-DEL',
    transaction_id: 'TX-66409-DEL',
    customer_id: 'C1003',
    customer_name: 'Vikram Malhotra',
    amount: 18500,
    merchant: 'Luxury Dining Bistro',
    location: 'Gurugram',
    device_id: 'DEV005',
    is_new_device: false,
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    created_at: new Date(Date.now() - 120 * 60000).toISOString(),
    fraud_probability: 0.18,
    anomaly_score: 0.22,
    risk_score: 28,
    risk_level: 'LOW',
    decision: 'PROCEED',
    reasons: [
      'Slight elevation in amount within normal variance',
      'Recognized trusted device'
    ],
    investigation_status: 'CLEARED'
  },
  {
    id: 'TX-55104-HYD',
    transaction_id: 'TX-55104-HYD',
    customer_id: 'C1002',
    customer_name: 'Priya Patel',
    amount: 22000,
    merchant: 'Online Gaming Portal',
    location: 'Hyderabad',
    device_id: 'DEV003',
    is_new_device: false,
    timestamp: new Date(Date.now() - 210 * 60000).toISOString(),
    created_at: new Date(Date.now() - 210 * 60000).toISOString(),
    fraud_probability: 0.52,
    anomaly_score: 0.48,
    risk_score: 58,
    risk_level: 'MEDIUM',
    decision: 'REVIEW',
    reasons: [
      'Transaction amount above usual average',
      'Merchant category flagged for moderate risk'
    ],
    investigation_status: 'UNREVIEWED'
  }
];

let mockAlerts: Alert[] = mockTransactions
  .filter((tx) => tx.risk_level === 'HIGH' || tx.risk_level === 'MEDIUM')
  .map((tx) => ({
    id: `ALT-${tx.transaction_id.replace('TX-', '')}`,
    transaction_id: tx.transaction_id,
    customer_id: tx.customer_id,
    customer_name: tx.customer_name,
    amount: tx.amount,
    risk_score: tx.risk_score,
    risk_level: tx.risk_level,
    decision: tx.decision,
    status: tx.investigation_status,
    created_at: tx.created_at,
    location: tx.location,
    device_id: tx.device_id
  }));

// Utility to calculate Risk Score from Fraud Prob and Anomaly Score
export function calculateRisk(fraudProb: number, anomalyScore: number): {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  decision: 'PROCEED' | 'REVIEW' | 'ALERT';
} {
  // Prototype aggregate formula: 60% XGBoost Fraud Prob + 40% Isolation Forest Anomaly
  const aggregateScore = Math.round((fraudProb * 0.6 + anomalyScore * 0.4) * 100);
  const riskScore = Math.min(100, Math.max(0, aggregateScore));

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  let decision: 'PROCEED' | 'REVIEW' | 'ALERT' = 'PROCEED';

  if (riskScore >= 70) {
    riskLevel = 'HIGH';
    decision = 'ALERT';
  } else if (riskScore >= 40) {
    riskLevel = 'MEDIUM';
    decision = 'REVIEW';
  } else {
    riskLevel = 'LOW';
    decision = 'PROCEED';
  }

  return { riskScore, riskLevel, decision };
}

export const API_SERVICE = {
  // Check Health & Backend Connectivity
  async checkHealth(): Promise<{ status: string; backend_connected: boolean }> {
    const now = Date.now();
    if (now - lastCheckTime < 10000 && isBackendAvailable) {
      return { status: 'ok', backend_connected: isBackendAvailable };
    }
    lastCheckTime = now;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        isBackendAvailable = true;
        return { status: 'ok', backend_connected: true };
      }
    } catch {
      isBackendAvailable = false;
    }
    return { status: 'fallback_mock', backend_connected: false };
  },

  // Predict Endpoint (POST /api/predict)
  async predictTransaction(payload: PredictPayload): Promise<PredictResponse> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/predict`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          // Keep mock list synchronized for UI components
          this.syncNewTransactionFromBackend(data, payload);
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend predict failed, falling back to local simulation:', e);
    }

    // Fallback Mock Logic
    const isSuspicious = payload.amount > 15000 || payload.is_new_device || (payload.transactions_last_10min && payload.transactions_last_10min > 5);
    const fraud_probability = isSuspicious ? 0.88 + Math.random() * 0.1 : 0.02 + Math.random() * 0.12;
    const anomaly_score = isSuspicious ? 0.84 + Math.random() * 0.12 : 0.05 + Math.random() * 0.15;
    const { riskScore, riskLevel, decision } = calculateRisk(fraud_probability, anomaly_score);

    const reasons: string[] = [];
    if (payload.amount > 10000) reasons.push('Transaction amount is significantly above customer baseline');
    if (payload.is_new_device) reasons.push('New device detected');
    if (payload.hour !== undefined && (payload.hour < 6 || payload.hour > 23)) reasons.push('Unusual transaction time');
    if (payload.transactions_last_10min && payload.transactions_last_10min > 4) reasons.push('High transaction velocity');
    if (payload.location && payload.location !== 'Pune') reasons.push('Unusual location');

    if (reasons.length === 0) {
      reasons.push('Normal transaction parameters within user profile limits');
    }

    const txId = `TX-${Math.floor(10000 + Math.random() * 90000)}-SIM`;
    const createdAt = new Date().toISOString();

    const response: PredictResponse = {
      transaction_id: txId,
      customer_id: payload.customer_id || 'C1001',
      amount: payload.amount,
      merchant: payload.merchant || 'Retail Merchant',
      location: payload.location || 'Pune',
      device_id: payload.device_id || 'DEV999',
      fraud_probability: parseFloat(fraud_probability.toFixed(2)),
      anomaly_score: parseFloat(anomaly_score.toFixed(2)),
      risk_score: riskScore,
      risk_level: riskLevel,
      decision: decision,
      reasons,
      created_at: createdAt,
      investigation_status: 'UNREVIEWED'
    };

    // Store in internal mock state so tables update in real time
    const newTx: Transaction = {
      id: response.transaction_id,
      transaction_id: response.transaction_id,
      customer_id: response.customer_id,
      customer_name: mockCustomers.find(c => c.customer_id === response.customer_id)?.name || 'Rahul Sharma',
      amount: response.amount,
      merchant: response.merchant,
      location: response.location,
      device_id: response.device_id,
      is_new_device: payload.is_new_device || false,
      timestamp: createdAt,
      created_at: createdAt,
      fraud_probability: response.fraud_probability,
      anomaly_score: response.anomaly_score,
      risk_score: response.risk_score,
      risk_level: response.risk_level,
      decision: response.decision,
      reasons: response.reasons,
      investigation_status: 'UNREVIEWED'
    };

    mockTransactions = [newTx, ...mockTransactions];

    if (response.risk_level === 'HIGH' || response.risk_level === 'MEDIUM') {
      const newAlert: Alert = {
        id: `ALT-${response.transaction_id.replace('TX-', '')}`,
        transaction_id: response.transaction_id,
        customer_id: response.customer_id,
        customer_name: newTx.customer_name,
        amount: response.amount,
        risk_score: response.risk_score,
        risk_level: response.risk_level,
        decision: response.decision,
        status: 'UNREVIEWED',
        created_at: createdAt,
        location: response.location,
        device_id: response.device_id
      };
      mockAlerts = [newAlert, ...mockAlerts];
    }

    return response;
  },

  syncNewTransactionFromBackend(data: PredictResponse, payload: PredictPayload) {
    const existing = mockTransactions.find(t => t.transaction_id === data.transaction_id);
    if (!existing) {
      const newTx: Transaction = {
        id: data.transaction_id,
        transaction_id: data.transaction_id,
        customer_id: data.customer_id || payload.customer_id,
        customer_name: mockCustomers.find(c => c.customer_id === data.customer_id)?.name || 'Rahul Sharma',
        amount: data.amount || payload.amount,
        merchant: data.merchant || payload.merchant || 'Merchant',
        location: data.location || payload.location || 'Location',
        device_id: data.device_id || payload.device_id || 'DEV1',
        is_new_device: payload.is_new_device || false,
        timestamp: data.created_at || new Date().toISOString(),
        created_at: data.created_at || new Date().toISOString(),
        fraud_probability: data.fraud_probability,
        anomaly_score: data.anomaly_score,
        risk_score: data.risk_score,
        risk_level: data.risk_level,
        decision: data.decision,
        reasons: data.reasons,
        investigation_status: 'UNREVIEWED'
      };
      mockTransactions = [newTx, ...mockTransactions];

      if (data.risk_level === 'HIGH' || data.risk_level === 'MEDIUM') {
        const alert: Alert = {
          id: `ALT-${data.transaction_id.replace('TX-', '')}`,
          transaction_id: data.transaction_id,
          customer_id: newTx.customer_id,
          customer_name: newTx.customer_name,
          amount: newTx.amount,
          risk_score: data.risk_score,
          risk_level: data.risk_level,
          decision: data.decision,
          status: 'UNREVIEWED',
          created_at: newTx.created_at,
          location: newTx.location,
          device_id: newTx.device_id
        };
        mockAlerts = [alert, ...mockAlerts];
      }
    }
  },

  // Get Transactions (GET /api/transactions)
  async getTransactions(): Promise<Transaction[]> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/transactions`);
        if (res.ok) {
          const data = await res.json();
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend getTransactions failed, using local mock state:', e);
    }
    return mockTransactions;
  },

  // Get Transaction by ID (GET /api/transactions/{transaction_id})
  async getTransaction(transactionId: string): Promise<Transaction | null> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/transactions/${transactionId}`);
        if (res.ok) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn('Backend getTransaction failed:', e);
    }
    return mockTransactions.find(t => t.transaction_id === transactionId || t.id === transactionId) || null;
  },

  // Get Alerts (GET /api/alerts)
  async getAlerts(): Promise<Alert[]> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/alerts`);
        if (res.ok) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn('Backend getAlerts failed, using local mock state:', e);
    }
    return mockAlerts;
  },

  // Get Customer by ID (GET /api/customers/{customer_id})
  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/customers/${customerId}`);
        if (res.ok) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn('Backend getCustomer failed, using local mock state:', e);
    }
    const customer = mockCustomers.find(c => c.customer_id === customerId) || mockCustomers[0];
    customer.recent_transactions = mockTransactions.filter(t => t.customer_id === customerId);
    return customer;
  },

  // Post Feedback (POST /api/feedback)
  async postFeedback(payload: FeedbackPayload): Promise<FeedbackResponse> {
    let newStatus: 'CLEARED' | 'CONFIRMED_FRAUD' | 'INVESTIGATING' | 'ESCALATED' = 'CLEARED';
    if (payload.action === 'CONFIRM_FRAUD') newStatus = 'CONFIRMED_FRAUD';
    if (payload.action === 'INVESTIGATE') newStatus = 'INVESTIGATING';
    if (payload.action === 'ESCALATE') newStatus = 'ESCALATED';
    if (payload.action === 'MARK_LEGITIMATE') newStatus = 'CLEARED';

    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) {
          const data = await res.json();
          // Update local state to match
          this.updateLocalFeedbackState(payload.transaction_id, newStatus, payload.comment);
          return data;
        }
      }
    } catch (e) {
      console.warn('Backend feedback failed, recording in local mock state:', e);
    }

    // Local fallback update
    this.updateLocalFeedbackState(payload.transaction_id, newStatus, payload.comment);

    return {
      success: true,
      message: 'Feedback recorded successfully',
      transaction_id: payload.transaction_id,
      action: payload.action,
      comment: payload.comment,
      investigation_status: newStatus
    };
  },

  updateLocalFeedbackState(txId: string, status: any, comment?: string) {
    const txIndex = mockTransactions.findIndex(t => t.transaction_id === txId || t.id === txId);
    if (txIndex !== -1) {
      mockTransactions[txIndex].investigation_status = status;
      if (comment) mockTransactions[txIndex].analyst_comment = comment;
      mockTransactions[txIndex].reviewed_at = new Date().toISOString();
      // CRITICAL REQUIREMENT: Risk score and Risk Level are kept unchanged!
    }

    const alertIndex = mockAlerts.findIndex(a => a.transaction_id === txId);
    if (alertIndex !== -1) {
      mockAlerts[alertIndex].status = status;
    }
  },

  // Get Metrics (GET /api/metrics)
  async getMetrics(): Promise<MetricsResponse> {
    try {
      const health = await this.checkHealth();
      if (health.backend_connected) {
        const res = await fetch(`${API_BASE_URL}/api/metrics`);
        if (res.ok) {
          return await res.json();
        }
      }
    } catch (e) {
      console.warn('Backend metrics failed, returning benchmark metrics:', e);
    }

    const avgScore = Math.round(
      mockTransactions.reduce((acc, t) => acc + t.risk_score, 0) / (mockTransactions.length || 1)
    );

    return {
      precision: 0.942,
      recall: 0.918,
      f1: 0.930,
      pr_auc: 0.954,
      false_positive_rate: 0.012,
      false_negative_rate: 0.008,
      transaction_count: mockTransactions.length,
      high_risk_count: mockTransactions.filter(t => t.risk_level === 'HIGH').length,
      average_risk_score: avgScore,
      supervised_model: 'XGBoost Classifier v2.1',
      anomaly_model: 'Isolation Forest v1.4',
      last_trained_at: new Date(Date.now() - 86400000 * 2).toISOString()
    };
  },

  // Calculate System Overview KPIs
  getSystemMetrics(transactions: Transaction[]): SystemMetrics {
    const totalToday = transactions.length;
    const highRisk = transactions.filter(t => t.risk_level === 'HIGH').length;
    const alerts = transactions.filter(t => t.decision === 'ALERT' || t.risk_level === 'HIGH').length;
    const avgScore = Math.round(
      transactions.reduce((acc, t) => acc + t.risk_score, 0) / (totalToday || 1)
    );

    const lowCount = transactions.filter(t => t.risk_level === 'LOW').length;
    const medCount = transactions.filter(t => t.risk_level === 'MEDIUM').length;
    const highCount = transactions.filter(t => t.risk_level === 'HIGH').length;

    return {
      transactionsToday: totalToday,
      highRiskCount: highRisk,
      fraudAlertsCount: alerts,
      averageRiskScore: avgScore,
      riskDistribution: {
        LOW: lowCount,
        MEDIUM: medCount,
        HIGH: highCount
      }
    };
  }
};
