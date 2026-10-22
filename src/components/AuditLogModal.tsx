import React, { useState, useMemo } from 'react';
import type { AuditLogEntry } from '../types/feeSystem';
import {
  X,
  ShieldCheck,
  Clock,
  User,
  DollarSign,
  UserPlus,
  BellRing,
  Settings,
  Search,
  RefreshCw,
  Download,
  Filter,
} from 'lucide-react';

interface AuditLogModalProps {
  logs: AuditLogEntry[];
  onClose: () => void;
  onRefresh?: () => Promise<void> | void;
}

export const AuditLogModal: React.FC<AuditLogModalProps> = ({ logs, onClose, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const getLogIcon = (type: AuditLogEntry['type']) => {
    switch (type) {
      case 'PAYMENT':
        return <DollarSign className="w-4 h-4 text-emerald-700" />;
      case 'STUDENT_ADD':
        return <UserPlus className="w-4 h-4 text-blue-700" />;
      case 'STUDENT_EDIT':
        return <User className="w-4 h-4 text-amber-700" />;
      case 'REMINDER':
        return <BellRing className="w-4 h-4 text-purple-700" />;
      default:
        return <Settings className="w-4 h-4 text-stone-600" />;
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      if (selectedType !== 'ALL' && log.type !== selectedType) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const staff = (log.staffName || (log as any).staff_name || '').toLowerCase();
        const action = (log.action || '').toLowerCase();
        const details = (log.details || '').toLowerCase();
        const id = (log.id || '').toLowerCase();
        return staff.includes(q) || action.includes(q) || details.includes(q) || id.includes(q);
      }
      return true;
    });
  }, [logs, selectedType, searchTerm]);

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp (ISO)', 'Date & Time', 'Action', 'Category', 'Operator', 'Details'];
    const rows = filteredLogs.map((l) => [
      l.id,
      l.timestamp,
      new Date(l.timestamp).toLocaleString('en-IN'),
      `"${(l.action || '').replace(/"/g, '""')}"`,
      l.type,
      `"${(l.staffName || (l as any).staff_name || 'System Admin').replace(/"/g, '""')}"`,
      `"${(l.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `System_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-3xl w-full p-5 md:p-7 shadow-2xl overflow-hidden text-stone-900 relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-rose-800 text-stone-50 flex items-center justify-center font-bold shadow-md shadow-rose-800/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">System Audit & Transaction Logs</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-800/10 text-rose-800 border border-rose-800/20">
                  {logs.length} Total
                </span>
              </div>
              <p className="text-xs text-stone-500">Live chronological trail of fee collections, admissions, and system modifications</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh audit logs from database"
                className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200 flex items-center gap-1.5 text-xs font-semibold"
              >
                <RefreshCw className={`w-4 h-4 text-rose-800 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            )}
            <button
              onClick={handleExportCSV}
              title="Export logs to CSV"
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer border border-stone-200 flex items-center gap-1.5 text-xs font-semibold"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="space-y-3 pb-3 mb-2 border-b border-stone-200 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by action, details, student name, operator, or LOG-ID..."
              className="w-full pl-9 pr-8 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-rose-800/50 transition-all font-medium"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-0.5 rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Logs' },
              { id: 'PAYMENT', label: 'Fee Payments' },
              { id: 'STUDENT_ADD', label: 'Admissions' },
              { id: 'STUDENT_EDIT', label: 'Profile Edits' },
              { id: 'REMINDER', label: 'Reminders' },
              { id: 'SETTINGS', label: 'System & Sync' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`px-3 py-1 rounded-lg font-semibold text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === tab.id
                    ? 'bg-rose-800 text-stone-50 shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Timeline */}
        <div className="space-y-2.5 overflow-y-auto pr-1 text-xs flex-1">
          {filteredLogs.length === 0 ? (
            <div className="py-14 text-center text-stone-500 space-y-2">
              <Filter className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="font-semibold text-sm">No audit logs match current filters</p>
              <p className="text-xs text-stone-400">Try clearing search terms or selecting a different category</p>
            </div>
          ) : (
            filteredLogs.map((log) => {
              const operator = log.staffName || (log as any).staff_name || 'System Admin';
              return (
                <div
                  key={log.id}
                  className="bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/90 flex items-start justify-between gap-3 hover:border-stone-300 transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white border border-stone-200 flex items-center justify-center mt-0.5 shrink-0 shadow-xs">
                      {getLogIcon(log.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-stone-900 text-xs">{log.action}</h4>
                        <span className="text-[10px] text-stone-500 font-mono">({log.id})</span>
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-stone-200 text-stone-700">
                          {log.type}
                        </span>
                      </div>
                      <p className="text-stone-700 mt-1 text-[11.5px] leading-relaxed break-words">{log.details}</p>
                      <div className="flex items-center gap-3 text-[10px] text-stone-500 mt-2 flex-wrap">
                        <span className="flex items-center gap-1 font-medium text-stone-700">
                          <User className="w-3 h-3 text-stone-500" /> Operator: {operator}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono text-stone-500">
                          <Clock className="w-3 h-3 text-stone-500" />
                          {new Date(log.timestamp).toLocaleString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3.5 mt-3 border-t border-stone-200 flex items-center justify-between text-xs shrink-0">
          <p className="text-stone-500 text-[11px]">
            Showing <strong className="text-stone-800">{filteredLogs.length}</strong> of{' '}
            <strong className="text-stone-800">{logs.length}</strong> recorded audit transactions
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs cursor-pointer transition-colors"
          >
            Close Audit Log
          </button>
        </div>
      </div>
    </div>
  );
};
