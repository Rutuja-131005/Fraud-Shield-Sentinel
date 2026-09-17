import React from 'react';
import { Customer, Transaction } from '../types';
import { User, DollarSign, MapPin, Smartphone, Clock, Activity, CheckCircle2, AlertTriangle } from 'lucide-react';

interface BehaviorBaselineProps {
  customer?: Customer | null;
  transaction?: Transaction | null;
}

export const BehaviorBaseline: React.FC<BehaviorBaselineProps> = ({
  customer,
  transaction
}) => {
  if (!customer && !transaction) return null;

  const avgAmount = customer?.average_amount ?? 2500;
  const currentAmount = transaction?.amount ?? 45000;
  const amountRatio = (currentAmount / (avgAmount || 1)).toFixed(1);
  const isAmountSpike = currentAmount > avgAmount * 3;

  const normalLocations = customer?.normal_locations || ['Pune', 'Mumbai'];
  const currentLocation = transaction?.location || 'Mumbai';
  const isLocationMismatch = !normalLocations.some(loc => currentLocation.toLowerCase().includes(loc.toLowerCase()));

  const knownDevices = customer?.known_devices || ['DEV001'];
  const currentDevice = transaction?.device_id || 'DEV999';
  const isNewDevice = transaction?.is_new_device ?? !knownDevices.some(dev => dev.includes(currentDevice));

  return (
    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
            Customer Behavioral Baseline ({customer?.customer_id || transaction?.customer_id || 'C1001'})
          </h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
          90-Day Verified Profile
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Metric 1: Average Amount */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <DollarSign className="w-3.5 h-3.5 text-blue-400" />
              Transaction Amount
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isAmountSpike ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400'}`}>
              {amountRatio}x Baseline
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Baseline Average</span>
              <span className="text-sm font-bold text-slate-300">₹{avgAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">Current Transaction</span>
              <span className={`text-base font-bold ${isAmountSpike ? 'text-rose-400' : 'text-slate-100'}`}>
                ₹{currentAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 2: Location Profile */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              Normal Locations
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isLocationMismatch ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-400'}`}>
              {isLocationMismatch ? 'Divergent Location' : 'Verified Region'}
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Known Cities</span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[130px]">
                {normalLocations.join(', ')}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">Current Origin</span>
              <span className={`text-xs font-bold ${isLocationMismatch ? 'text-amber-400' : 'text-slate-100'}`}>
                {currentLocation}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Known Devices */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Smartphone className="w-3.5 h-3.5 text-rose-400" />
              Known Hardware
            </span>
            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isNewDevice ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/15 text-emerald-400'}`}>
              {isNewDevice ? 'New Unrecognized Device' : 'Authorized Hardware'}
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Registered Hardware</span>
              <span className="text-xs font-semibold text-slate-300 truncate max-w-[130px]">
                {knownDevices[0]}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">Current Hardware</span>
              <span className={`text-xs font-bold ${isNewDevice ? 'text-rose-400' : 'text-slate-100'}`}>
                {currentDevice}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 4: Hours & Frequency */}
        <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              Typical Hours & Velocity
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {customer?.transaction_frequency || '3.4 tx/day'}
            </span>
          </div>
          <div className="flex items-baseline justify-between font-mono mt-1">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Active Hours Window</span>
              <span className="text-xs font-semibold text-slate-300">
                {customer?.typical_transaction_time || '09:00 – 22:00'}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase">Current Time</span>
              <span className="text-xs font-bold text-slate-100">
                03:15 IST (Night)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
