import React from 'react';
import type { AuditLogEntry } from '../types/feeSystem';
import { X, ShieldCheck, Clock, User, DollarSign, UserPlus, BellRing, Settings } from 'lucide-react';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  onClose: () => void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose }) => {
  const getLogIcon = (type: AuditLogEntry['type']) => {
    switch (type) {
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-neutral-700" />;
      case 'STUDENT_ADD':
        return <UserPlus className="w-4 h-4 text-neutral-700" />;
      case 'STUDENT_EDIT':
        return <User className="w-4 h-4 text-neutral-700" />;
      case 'REMINDER':
        return <BellRing className="w-4 h-4 text-neutral-700" />;
      default:
        return <Settings className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-50/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden text-neutral-900 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 text-neutral-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900 tracking-tight">System Audit & Transaction Logs</h2>
              <p className="text-xs text-neutral-500">Chronological trail of staff actions and fee collection events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Timeline */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-xs">
          {logs.length === 0 ? (
            <p className="text-center text-neutral-600 py-8">No audit logs recorded yet.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-neutral-50/60 p-4 rounded-2xl border border-neutral-200 flex items-start justify-between gap-4 hover:border-neutral-200 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 flex items-center justify-center mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-neutral-900 text-xs">{log.action}</h4>
                      <span className="text-[10px] text-neutral-600 font-mono">({log.id})</span>
                    </div>
                    <p className="text-neutral-700 mt-0.5">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-neutral-600" /> Operator: {log.staffName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-neutral-600" />
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 mt-4 border-t border-neutral-200 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-100 hover:bg-zinc-700/60 text-neutral-800 font-semibold text-xs cursor-pointer"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
