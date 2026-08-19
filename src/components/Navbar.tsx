import React from 'react';
import {
  ShieldAlert,
  Search,
  Bell,
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Lock,
  Mail,
  Zap,
  Keyboard,
} from 'lucide-react';
import { EmailAccount } from '../types';

interface NavbarProps {
  accounts: EmailAccount[];
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
  onOpenSimulation: () => void;
  onOpenDigest: () => void;
  onOpenShortcuts?: () => void;
  criticalCount: number;
  onNavigateToInboxWithCritical: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  accounts,
  selectedAccountId,
  onSelectAccount,
  onOpenSimulation,
  onOpenDigest,
  onOpenShortcuts,
  criticalCount,
  onNavigateToInboxWithCritical,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/95 backdrop-blur-md px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Tagline */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-blue-600 to-cyan-500 shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
            <ShieldAlert className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">MailSentinel</span>
              <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-indigo-300 ring-1 ring-indigo-500/40">
                AI Pro
              </span>
            </div>
            <p className="hidden text-xs text-slate-400 sm:block">AI-powered command center for email</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative max-w-md flex-1 hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="global-search-input"
            type="text"
            placeholder="Search all accounts, entities, subjects, summaries... (Press /)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900/80 py-2 pl-9 pr-12 text-sm text-slate-200 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
            ⌘K
          </span>
        </div>

        {/* Action Controls & Indicators */}
        <div className="flex items-center gap-2.5">
          {/* Critical Alert Pill */}
          {criticalCount > 0 && (
            <button
              onClick={onNavigateToInboxWithCritical}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-300 shadow-sm transition hover:bg-rose-500/20 animate-pulse"
              title="View Critical Emails"
            >
              <span className="h-2 w-2 rounded-full bg-rose-500"></span>
              <span>{criticalCount} Critical</span>
            </button>
          )}

          {/* Account Quick Filter */}
          <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 p-1">
            <button
              onClick={() => onSelectAccount('all')}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                selectedAccountId === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Inboxes ({accounts.length}/10)
            </button>
            {accounts.slice(0, 3).map((acc) => (
              <button
                key={acc.id}
                onClick={() => onSelectAccount(acc.id)}
                className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition ${
                  selectedAccountId === acc.id
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={acc.emailAddress}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${acc.provider === 'gmail' ? 'bg-red-400' : 'bg-blue-400'}`} />
                <span className="max-w-[80px] truncate">{acc.displayName.split(' ')[0]}</span>
              </button>
            ))}
          </div>

          {/* Keyboard Shortcuts Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              className="hidden sm:flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px] font-mono text-slate-500">?</span>
            </button>
          )}

          {/* AI Morning Briefing Button */}
          <button
            onClick={onOpenDigest}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 transition hover:bg-indigo-500/20"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">AI Daily Briefing</span>
          </button>

          {/* Ingest Simulation Button */}
          <button
            onClick={onOpenSimulation}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-500/20 transition hover:brightness-110 active:scale-95"
            title="Compose & Simulate Incoming Email (Shortcut: C)"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulate Email</span>
            <kbd className="hidden md:inline rounded bg-white/20 px-1 py-0.2 text-[10px] font-mono font-bold">C</kbd>
          </button>

          {/* User Profile Pill */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-200 ring-1 ring-slate-700">
                UI
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-slate-950">
                <Lock className="h-2 w-2 text-slate-950" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

