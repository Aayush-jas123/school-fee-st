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
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'STUDENT_ADD':
        return <UserPlus className="w-4 h-4 text-violet-400" />;
      case 'STUDENT_EDIT':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'REMINDER':
        return <BellRing className="w-4 h-4 text-amber-400" />;
      default:
        return <Settings className="w-4 h-4 text-zinc-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden text-zinc-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/50 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">System Audit & Transaction Logs</h2>
              <p className="text-xs text-zinc-500">Chronological trail of staff actions and fee collection events</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Logs Timeline */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 text-xs">
          {logs.length === 0 ? (
            <p className="text-center text-zinc-600 py-8">No audit logs recorded yet.</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="bg-zinc-950/60 p-4 rounded-2xl border border-zinc-800/50 flex items-start justify-between gap-4 hover:border-zinc-700/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex items-center justify-center mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-xs">{log.action}</h4>
                      <span className="text-[10px] text-zinc-600 font-mono">({log.id})</span>
                    </div>
                    <p className="text-zinc-300 mt-0.5">{log.details}</p>
                    <div className="flex items-center gap-3 text-[10px] text-zinc-500 mt-2">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-zinc-600" /> Operator: {log.staffName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-zinc-600" />
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

        <div className="pt-4 mt-4 border-t border-zinc-800/50 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-zinc-800/60 hover:bg-zinc-700/60 text-zinc-200 font-semibold text-xs cursor-pointer"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
