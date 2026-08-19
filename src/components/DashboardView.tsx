import React from 'react';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Calendar,
  Layers,
  ChevronRight,
  Mail,
  Zap,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { EmailAccount, EmailMessage, PriorityLevel } from '../types';

interface DashboardViewProps {
  accounts: EmailAccount[];
  emails: EmailMessage[];
  onSelectEmail: (email: EmailMessage) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenDigest: () => void;
  onResyncAccount: (accountId: string) => void;
  onOpenSimulation: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  accounts,
  emails,
  onSelectEmail,
  onNavigateToTab,
  onOpenDigest,
  onResyncAccount,
  onOpenSimulation,
}) => {
  const criticalEmails = emails.filter((e) => e.analysis?.priority === 'critical');
  const highEmails = emails.filter((e) => e.analysis?.priority === 'high');
  const mediumEmails = emails.filter((e) => e.analysis?.priority === 'medium');
  const lowEmails = emails.filter((e) => e.analysis?.priority === 'low' || e.analysis?.priority === 'informational');

  // Attention queue (Critical + Unread High)
  const attentionQueue = emails.filter(
    (e) => e.analysis?.priority === 'critical' || (e.analysis?.priority === 'high' && !e.isRead)
  );

  // Deadlines extracted
  const deadlineItems = emails
    .filter((e) => e.analysis?.deadline)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Security Command Active</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Good afternoon, Umar</h1>
          <p className="text-sm text-slate-400">
            MailSentinel AI is actively monitoring <strong>{accounts.length} authorized accounts</strong>. 
            {criticalEmails.length > 0 ? (
              <span className="text-rose-400 font-medium"> {criticalEmails.length} critical alert requires your immediate action.</span>
            ) : (
              ' All systems are nominal and secure.'
            )}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDigest}
            className="flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-4 py-2.5 text-sm font-medium text-indigo-200 transition hover:bg-indigo-600/30 shadow-sm"
          >
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span>Generate Executive Briefing</span>
          </button>
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110"
          >
            <Zap className="h-4 w-4" />
            <span>Test Ingestion</span>
          </button>
        </div>
      </div>

      {/* Priority Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Emails */}
        <div
          onClick={() => onNavigateToTab('inbox')}
          className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-700 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Total Emails</span>
            <Mail className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white">{emails.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Across {accounts.length} connected inboxes</div>
        </div>

        {/* Critical */}
        <div
          onClick={() => onNavigateToTab('inbox')}
          className="cursor-pointer rounded-xl border border-rose-500/30 bg-rose-950/20 p-4 transition hover:border-rose-500/50 hover:bg-rose-950/30"
        >
          <div className="flex items-center justify-between text-xs text-rose-300 mb-2">
            <span className="font-semibold">🔴 Critical (85-100)</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-rose-300">{criticalEmails.length}</div>
          <div className="text-[11px] text-rose-400/80 mt-1">Immediate action required</div>
        </div>

        {/* High */}
        <div
          onClick={() => onNavigateToTab('inbox')}
          className="cursor-pointer rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 transition hover:border-amber-500/50 hover:bg-amber-950/30"
        >
          <div className="flex items-center justify-between text-xs text-amber-300 mb-2">
            <span className="font-semibold">🟠 High (65-84)</span>
            <Flame className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-300">{highEmails.length}</div>
          <div className="text-[11px] text-amber-400/80 mt-1">Supervisors & Interviews</div>
        </div>

        {/* Medium */}
        <div
          onClick={() => onNavigateToTab('inbox')}
          className="cursor-pointer rounded-xl border border-yellow-500/20 bg-yellow-950/10 p-4 transition hover:border-yellow-500/40 hover:bg-yellow-950/20"
        >
          <div className="flex items-center justify-between text-xs text-yellow-300 mb-2">
            <span>🟡 Medium (35-64)</span>
            <Clock className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-yellow-200">{mediumEmails.length}</div>
          <div className="text-[11px] text-yellow-400/70 mt-1">Invoices & Routine tasks</div>
        </div>

        {/* Low / Informational */}
        <div
          onClick={() => onNavigateToTab('inbox')}
          className="cursor-pointer rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-4 transition hover:border-emerald-500/40 hover:bg-emerald-950/20"
        >
          <div className="flex items-center justify-between text-xs text-emerald-300 mb-2">
            <span>🟢 Low (0-34)</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-300">{lowEmails.length}</div>
          <div className="text-[11px] text-emerald-400/70 mt-1">Newsletters & Digests</div>
        </div>
      </div>

      {/* Main Grid: Needs Attention + Deadlines & Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Needs Your Attention (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500" />
              <h2 className="text-base font-bold text-white tracking-tight">🚨 Needs Your Attention</h2>
              <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
                {attentionQueue.length} items
              </span>
            </div>
            <button
              onClick={() => onNavigateToTab('inbox')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>View All in Inbox</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {attentionQueue.map((email) => {
              const isCritical = email.analysis?.priority === 'critical';
              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`group cursor-pointer rounded-xl border p-4 transition shadow-sm hover:shadow-md ${
                    isCritical
                      ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-slate-900/80 hover:border-rose-500/60'
                      : 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/80 hover:border-amber-500/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500 text-white shadow-sm'
                            : 'bg-amber-500 text-slate-950'
                        }`}
                      >
                        {isCritical ? 'Critical 96' : `High ${email.analysis?.priorityScore || 80}`}
                      </span>
                      <span className="text-xs font-semibold text-slate-200 truncate max-w-[200px]">
                        {email.senderName || email.sender}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {email.accountEmail.split('@')[0]}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      {new Date(email.receivedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
                    {email.subject}
                  </h3>

                  {email.analysis?.summary && (
                    <p className="text-xs text-slate-300 line-clamp-2 mb-3 bg-slate-950/40 p-2 rounded-lg border border-slate-800/60">
                      <strong className="text-indigo-300 font-medium">AI Summary:</strong> {email.analysis.summary}
                    </p>
                  )}

                  {/* Footer tags & recommended action */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-xs">
                    {email.analysis?.recommendedAction ? (
                      <div className="flex items-center gap-1.5 text-amber-300/90 truncate mr-2">
                        <Zap className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                        <span className="truncate">Next: {email.analysis.recommendedAction}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400">Action recommended</div>
                    )}
                    <span className="text-indigo-400 group-hover:translate-x-0.5 transition-transform shrink-0 font-medium flex items-center gap-1">
                      Inspect <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deadlines + Connected Accounts */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('deadlines')}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
              >
                View Timeline
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlineItems.map((email) => (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className="cursor-pointer rounded-lg border border-slate-800/80 bg-slate-950/60 p-2.5 transition hover:border-indigo-500/40 hover:bg-slate-900"
                >
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-amber-300">
                      {email.analysis?.deadline}
                    </span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                      {email.analysis?.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 truncate font-medium">{email.subject}</p>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    From: {email.senderName || email.sender}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Connected Mailboxes Quota (Section 8) */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Mailbox Sync Status</h3>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs font-mono font-medium text-slate-300">
                {accounts.length} / 10 Active
              </span>
            </div>

            <div className="space-y-2">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800/60 bg-slate-950/50 px-3 py-2 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded font-bold text-[10px] text-white ${
                        acc.provider === 'gmail' ? 'bg-red-600' : 'bg-blue-600'
                      }`}
                    >
                      {acc.provider === 'gmail' ? 'G' : 'O'}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate">{acc.displayName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{acc.emailAddress}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      Active
                    </span>
                    <button
                      onClick={() => onResyncAccount(acc.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
                      title="Trigger Sync"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateToTab('accounts')}
              className="w-full rounded-lg border border-slate-700/80 bg-slate-800/60 py-1.5 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 transition"
            >
              Manage & Connect Mailboxes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
