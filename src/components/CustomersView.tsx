import React, { useState, useEffect } from 'react';
import { Customer, Transaction } from '../types';
import { BehaviorBaseline } from './BehaviorBaseline';
import { TransactionTable } from './TransactionTable';
import { API_SERVICE } from '../services/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Users, User, DollarSign, MapPin, Smartphone, Clock, Activity } from 'lucide-react';

interface CustomersViewProps {
  onSelectTransaction: (tx: Transaction) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ onSelectTransaction }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('C1001');
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let isMounted = true;
    API_SERVICE.getCustomer(selectedCustomerId).then((data) => {
      if (isMounted && data) {
        setCustomer(data);
      }
    });
    return () => { isMounted = false; };
  }, [selectedCustomerId]);

  const customerList = [
    { id: 'C1001', name: 'Rahul Sharma', tier: 'Low Risk' },
    { id: 'C1002', name: 'Priya Patel', tier: 'Moderate Risk' },
    { id: 'C1003', name: 'Vikram Malhotra', tier: 'Low Risk' }
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Customer Selection Header */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">
              Customer Profile & Behavioral Baseline Intelligence
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Analyze historical spending limits, geographic bounds, and hardware footprints
            </p>
          </div>
        </div>

        {/* Customer Selector Buttons */}
        <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
          {customerList.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={`px-3.5 py-2 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCustomerId === c.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              {c.id} ({c.name.split(' ')[0]})
            </button>
          ))}
        </div>
      </div>

      {customer && (
        <>
          {/* Customer Profile Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Customer ID</span>
              <span className="text-sm font-bold font-mono text-blue-400 mt-1">{customer.customer_id}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{customer.name}</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Average Amount</span>
              <span className="text-sm font-bold font-mono text-slate-100 mt-1">
                ₹{customer.average_amount?.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">90-Day Baseline</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Normal Locations</span>
              <span className="text-xs font-bold text-slate-200 mt-1 truncate">
                {customer.normal_locations?.join(', ')}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Verified Geofence</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Known Devices</span>
              <span className="text-xs font-bold text-slate-200 mt-1 truncate">
                {customer.known_devices?.[0]}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">{customer.known_devices?.length} Registered</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Typical Time</span>
              <span className="text-xs font-bold text-slate-200 mt-1 truncate">
                {customer.typical_transaction_time}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Active Window</span>
            </div>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Tx Frequency</span>
              <span className="text-xs font-bold text-slate-200 mt-1">
                {customer.transaction_frequency}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">Mean Velocity</span>
            </div>
          </div>

          {/* Behavioral Baseline Chart */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                Historical Transaction Amounts vs Behavioral Baseline Threshold
              </h3>
              <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                Baseline Limit: ₹{customer.average_amount * 3}
              </span>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={customer.baseline_history}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Amount']}
                  />
                  <ReferenceLine y={customer.average_amount} stroke="#3b82f6" strokeDasharray="5 5" label={{ value: 'Avg Baseline', fill: '#60a5fa', fontSize: 10 }} />
                  <Line type="monotone" dataKey="amount" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: '#f43f5e' }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Detailed Baseline Component */}
          <BehaviorBaseline customer={customer} />

          {/* Customer Recent Transactions */}
          <TransactionTable
            transactions={customer.recent_transactions || []}
            onSelectTransaction={onSelectTransaction}
            title={`Recent Ingested Transactions for Customer ${customer.customer_id}`}
          />
        </>
      )}

    </div>
  );
};
