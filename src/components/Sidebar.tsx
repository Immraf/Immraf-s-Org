import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  CalendarClock,
  MailCheck,
  SlidersHorizontal,
  BellRing,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
} from 'lucide-react';

export type NavTab =
  | 'dashboard'
  | 'inbox'
  | 'rag'
  | 'deadlines'
  | 'accounts'
  | 'rules'
  | 'notifications'
  | 'security';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  unreadCount: number;
  criticalCount: number;
  deadlinesCount: number;
  accountsCount: number;
  rulesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadCount,
  criticalCount,
  deadlinesCount,
  accountsCount,
  rulesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Command Center',
      icon: LayoutDashboard,
      badge: criticalCount > 0 ? `${criticalCount} alert` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    },
    {
      id: 'inbox' as NavTab,
      label: 'Unified Inbox',
      icon: Inbox,
      badge: unreadCount > 0 ? `${unreadCount}` : undefined,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    },
    {
      id: 'rag' as NavTab,
      label: 'AI Knowledge / Ask',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'deadlines' as NavTab,
      label: 'Deadlines & Tasks',
      icon: CalendarClock,
      badge: deadlinesCount > 0 ? `${deadlinesCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    },
    {
      id: 'accounts' as NavTab,
      label: 'Connected Accounts',
      icon: MailCheck,
      badge: `${accountsCount}/10`,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'rules' as NavTab,
      label: 'Custom Rules Engine',
      icon: SlidersHorizontal,
      badge: `${rulesCount}`,
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'notifications' as NavTab,
      label: 'Multi-Channel Alerts',
      icon: BellRing,
    },
    {
      id: 'security' as NavTab,
      label: 'Security & Audit Center',
      icon: ShieldCheck,
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-slate-800 bg-slate-950 flex flex-col justify-between p-3">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          Navigation
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 ring-1 ring-indigo-500/40 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`h-4 w-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Security Status Box */}
      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Defense System</span>
          </div>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" />
        </div>
        <p className="text-[11px] text-slate-400 mb-2">
          Prompt-injection shield active. Tokens protected with AES-256 envelope encryption.
        </p>
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>RAG / Vector Engine</span>
          <span className="text-emerald-400">pgvector v16</span>
        </div>
      </div>
    </aside>
  );
};
