import React, { useState } from 'react';
import {
  MailCheck,
  Plus,
  RefreshCw,
  Trash2,
  Lock,
  ShieldCheck,
  AlertCircle,
  Clock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import { EmailAccount } from '../types';

interface ConnectedAccountsViewProps {
  accounts: EmailAccount[];
  onOpenConnectModal: (provider: 'gmail' | 'outlook') => void;
  onResyncAccount: (id: string) => void;
  onDisconnectAccount: (id: string, purgeData: boolean) => void;
}

export const ConnectedAccountsView: React.FC<ConnectedAccountsViewProps> = ({
  accounts,
  onOpenConnectModal,
  onResyncAccount,
  onDisconnectAccount,
}) => {
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const isLimitReached = accounts.length >= 10;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header & Quota Card (Section 8) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MailCheck className="h-5 w-5 text-indigo-400" />
              <h1 className="text-xl font-bold text-white">Authorized Connected Mailboxes</h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Connect up to <strong>10 authorized Gmail and Outlook accounts</strong> via OAuth 2.0.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenConnectModal('gmail')}
              disabled={isLimitReached}
              className="flex items-center gap-1.5 rounded-xl bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-red-500 transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Connect Gmail</span>
            </button>

            <button
              onClick={() => onOpenConnectModal('outlook')}
              disabled={isLimitReached}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-md hover:bg-blue-500 transition disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Connect Outlook</span>
            </button>
          </div>
        </div>

        {/* Quota Progress */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Mailbox Quota Utilization</span>
            <span className="font-bold text-indigo-300">
              {accounts.length} / 10 Accounts Connected ({10 - accounts.length} remaining)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                isLimitReached ? 'bg-rose-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${(accounts.length / 10) * 100}%` }}
            />
          </div>
          {isLimitReached && (
            <p className="text-xs text-rose-400 font-medium">
              Maximum account quota reached (10/10). Please disconnect an existing account to connect a new one.
            </p>
          )}
        </div>
      </div>

      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm text-white shadow ${
                    acc.provider === 'gmail' ? 'bg-red-600' : 'bg-blue-600'
                  }`}
                >
                  {acc.provider === 'gmail' ? 'G' : 'O'}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{acc.displayName}</h3>
                  <p className="text-xs text-slate-400">{acc.emailAddress}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  acc.status === 'active'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : acc.status === 'syncing'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}
              >
                {acc.status}
              </span>
            </div>

            {/* Sync Meta */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[11px]">Synced Messages:</span>
                <span className="font-semibold text-slate-200">{acc.totalEmailsCount} emails</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Last Sync Timestamp:</span>
                <span className="font-semibold text-slate-200">
                  {new Date(acc.lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            {/* Scopes & Encryption */}
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>AES-256 Encrypted Tokens</span>
              </div>
              <span className="font-mono text-slate-500">{acc.scopes[0]}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
              <button
                onClick={() => onResyncAccount(acc.id)}
                className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-medium"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Trigger Sync</span>
              </button>

              <button
                onClick={() => setDisconnectingId(acc.id)}
                className="flex items-center gap-1 text-rose-400 hover:text-rose-300 font-medium"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Disconnect</span>
              </button>
            </div>

            {/* Disconnect Safeguard Dialog (Section 42) */}
            {disconnectingId === acc.id && (
              <div className="rounded-lg border border-rose-500/40 bg-rose-950/40 p-3 text-xs space-y-2 mt-2">
                <div className="flex items-center gap-1.5 text-rose-300 font-bold">
                  <AlertCircle className="h-4 w-4" />
                  <span>Data Retention Choice</span>
                </div>
                <p className="text-slate-300">
                  How would you like to handle stored email intelligence for <strong>{acc.emailAddress}</strong>?
                </p>
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    onClick={() => {
                      onDisconnectAccount(acc.id, false);
                      setDisconnectingId(null);
                    }}
                    className="rounded bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    Disconnect Only
                  </button>
                  <button
                    onClick={() => {
                      onDisconnectAccount(acc.id, true);
                      setDisconnectingId(null);
                    }}
                    className="rounded bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-500 transition"
                  >
                    Disconnect + Purge Stored Data
                  </button>
                  <button
                    onClick={() => setDisconnectingId(null)}
                    className="text-xs text-slate-400 hover:underline ml-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
