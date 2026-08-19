import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  Key,
  FileCheck,
  Clock,
  Search,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { AuditLogEntry, DeviceInfo } from '../types';

interface SecurityAuditViewProps {
  auditLogs: AuditLogEntry[];
  devices: DeviceInfo[];
}

export const SecurityAuditView: React.FC<SecurityAuditViewProps> = ({ auditLogs, devices }) => {
  const [filterAction, setFilterAction] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    if (filterAction !== 'all' && log.action !== filterAction) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        log.details.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <h1 className="text-xl font-bold text-white">Security Command & Cryptographic Audit</h1>
            </div>
            <p className="text-xs text-slate-400">
              Zero-trust architecture, OAuth scope enforcement, AES-256 token encryption, and immutable audit trails.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Security Posture: 98/100 (Optimal)</span>
          </div>
        </div>

        {/* Cryptographic Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-300 font-semibold">
              <Lock className="h-3.5 w-3.5" />
              <span>Envelope Encryption</span>
            </div>
            <p className="text-[11px] text-slate-400">
              OAuth tokens encrypted using AES-256-GCM backed by hardware KMS.
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-300 font-semibold">
              <Key className="h-3.5 w-3.5" />
              <span>Minimal Scope Principle</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Restricted to <code className="text-emerald-400">gmail.readonly</code> & <code className="text-emerald-400">Mail.Read</code>.
            </p>
          </div>

          <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Prompt-Injection Defense</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Sandboxed untrusted email data delimiter & strict system prompt policies.
            </p>
          </div>
        </div>
      </div>

      {/* Authorized Devices */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-white">Authorized Devices & Push Endpoints</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {devices.map((dev) => (
            <div
              key={dev.id}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950 p-3"
            >
              <div className="flex items-center gap-3">
                {dev.deviceType === 'android' ? (
                  <Smartphone className="h-5 w-5 text-indigo-400" />
                ) : (
                  <Laptop className="h-5 w-5 text-blue-400" />
                )}
                <div>
                  <div className="font-semibold text-white">{dev.deviceName}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Token: {dev.pushToken.slice(0, 16)}...</div>
                </div>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Active
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable Audit Logs (Section 41) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Immutable Security Audit Logs ({filteredLogs.length})</h3>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-200"
            >
              <option value="all">All Actions</option>
              <option value="LOGIN">LOGIN</option>
              <option value="OAUTH_CONNECT">OAUTH_CONNECT</option>
              <option value="AI_ANALYSIS">AI_ANALYSIS</option>
              <option value="NOTIFICATION_SENT">NOTIFICATION_SENT</option>
              <option value="EMAIL_ACTION">EMAIL_ACTION</option>
              <option value="DATA_DELETED">DATA_DELETED</option>
            </select>

            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1 text-xs text-slate-200"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-slate-800/80 bg-slate-950 p-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-indigo-500/20 border border-indigo-500/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-indigo-300">
                    {log.action}
                  </span>
                  <span className="text-slate-300 font-medium">{log.details}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Source: {log.ipAddress} • ID: {log.id}
                </div>
              </div>

              <span className="text-[11px] text-slate-400 shrink-0 font-mono">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
