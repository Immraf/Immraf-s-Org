import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { UnifiedInboxView } from './components/UnifiedInboxView';
import { AIAskRAGView } from './components/AIAskRAGView';
import { DeadlinesView } from './components/DeadlinesView';
import { ConnectedAccountsView } from './components/ConnectedAccountsView';
import { RulesEngineView } from './components/RulesEngineView';
import { NotificationsView } from './components/NotificationsView';
import { SecurityAuditView } from './components/SecurityAuditView';
import { SimulationModal } from './components/SimulationModal';
import { AIDailyDigestModal } from './components/AIDailyDigestModal';
import { ConnectAccountModal } from './components/ConnectAccountModal';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import {
  EmailAccount,
  EmailMessage,
  UserRule,
  NotificationPreference,
  NotificationDelivery,
  AuditLogEntry,
  DeviceInfo,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [accounts, setAccounts] = useState<EmailAccount[]>([]);
  const [emails, setEmails] = useState<EmailMessage[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [inboxFilterPriority, setInboxFilterPriority] = useState<string>('all');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  const [rules, setRules] = useState<UserRule[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreference>({
    id: 'pref-001',
    userId: 'user-001',
    pushEnabled: true,
    whatsappEnabled: true,
    whatsappPhoneNumber: '+2348012345678',
    whatsappThreshold: 'critical',
    webPushEnabled: true,
    dailyDigestEnabled: true,
    dailyDigestTime: '08:00',
    timezone: 'Africa/Lagos',
    quietHoursEnabled: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
    allowCriticalInQuietHours: true,
  });
  const [deliveries, setDeliveries] = useState<NotificationDelivery[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);

  // Modals state
  const [isSimOpen, setIsSimOpen] = useState<boolean>(false);
  const [isDigestOpen, setIsDigestOpen] = useState<boolean>(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState<boolean>(false);
  const [connectModalProvider, setConnectModalProvider] = useState<'gmail' | 'outlook' | null>(null);

  // Shortcut visual feedback toast
  const [shortcutToast, setShortcutToast] = useState<string | null>(null);

  const showShortcutFeedback = useCallback((message: string) => {
    setShortcutToast(message);
    const timer = setTimeout(() => {
      setShortcutToast(null);
    }, 1600);
    return () => clearTimeout(timer);
  }, []);

  // Initial Fetch
  const fetchData = async () => {
    try {
      const [accRes, mailRes, rulesRes, notifRes, auditRes, devRes] = await Promise.all([
        fetch('/api/v1/accounts').then((r) => r.json()),
        fetch('/api/v1/emails').then((r) => r.json()),
        fetch('/api/v1/rules').then((r) => r.json()),
        fetch('/api/v1/notifications').then((r) => r.json()),
        fetch('/api/v1/audit-logs').then((r) => r.json()),
        fetch('/api/v1/devices').then((r) => r.json()),
      ]);

      if (accRes && accRes.accounts) setAccounts(accRes.accounts);
      if (mailRes && mailRes.emails) {
        setEmails(mailRes.emails);
        if (!selectedEmail && mailRes.emails.length > 0) {
          setSelectedEmail(mailRes.emails[0]);
        }
      }
      if (rulesRes && rulesRes.rules) setRules(rulesRes.rules);
      if (notifRes && notifRes.preferences) setPreferences(notifRes.preferences);
      if (notifRes && notifRes.deliveries) setDeliveries(notifRes.deliveries);
      if (auditRes && auditRes.auditLogs) setAuditLogs(auditRes.auditLogs);
      if (devRes && devRes.devices) setDevices(devRes.devices);
    } catch (e) {
      console.error('Error fetching data:', e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleSelectEmail = (email: EmailMessage) => {
    setSelectedEmail(email);
    setActiveTab('inbox');
    // Mark as read if not already
    if (!email.isRead) {
      handleMarkRead(email.id);
    }
  };

  const handleSelectEmailById = (emailId: string) => {
    const found = emails.find((e) => e.id === emailId);
    if (found) {
      handleSelectEmail(found);
    }
  };

  const handleArchiveEmail = async (emailId: string) => {
    try {
      await fetch('/api/v1/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'archive', emailId }),
      });
      setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, isArchived: true } : e)));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail((prev) => (prev ? { ...prev, isArchived: true } : null));
      }
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkRead = async (emailId: string) => {
    try {
      const email = emails.find((e) => e.id === emailId);
      const nextState = !email?.isRead;
      await fetch('/api/v1/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'mark_read', emailId }),
      });
      setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, isRead: nextState } : e)));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail((prev) => (prev ? { ...prev, isRead: nextState } : null));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleStar = async (emailId: string) => {
    try {
      const email = emails.find((e) => e.id === emailId);
      const nextState = !email?.isStarred;
      await fetch(`/api/v1/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isStarred: nextState }),
      });
      setEmails((prev) => prev.map((e) => (e.id === emailId ? { ...e, isStarred: nextState } : e)));
      if (selectedEmail?.id === emailId) {
        setSelectedEmail((prev) => (prev ? { ...prev, isStarred: nextState } : null));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendDraftReply = async (emailId: string, replyText: string) => {
    try {
      await fetch('/api/v1/actions/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actionType: 'send_draft', emailId, metadata: { replyText } }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateEmail = async (emailData: any) => {
    const res = await fetch('/api/v1/simulate/incoming-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(emailData),
    });
    const data = await res.json();
    if (data.email) {
      setEmails((prev) => [data.email, ...prev]);
      setSelectedEmail(data.email);
      setActiveTab('inbox');
      fetchData();
    }
  };

  const handleResyncAccount = async (accountId: string) => {
    try {
      await fetch(`/api/v1/accounts/${accountId}/resync`, { method: 'POST' });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConnectAccount = async (accountData: any) => {
    try {
      const res = await fetch('/api/v1/accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      });
      const data = await res.json();
      if (data.account) {
        setAccounts((prev) => [...prev, data.account]);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnectAccount = async (accountId: string, purgeData: boolean) => {
    try {
      await fetch(`/api/v1/accounts/${accountId}?purgeData=${purgeData}`, {
        method: 'DELETE',
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddRule = async (ruleData: any) => {
    try {
      const res = await fetch('/api/v1/rules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ruleData),
      });
      const data = await res.json();
      if (data.rule) {
        setRules((prev) => [...prev, data.rule]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleRule = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/v1/rules/${ruleId}/toggle`, { method: 'PATCH' });
      const data = await res.json();
      if (data.rule) {
        setRules((prev) => prev.map((r) => (r.id === ruleId ? data.rule : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteRule = async (ruleId: string) => {
    try {
      await fetch(`/api/v1/rules/${ruleId}`, { method: 'DELETE' });
      setRules((prev) => prev.filter((r) => r.id !== ruleId));
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<NotificationPreference>) => {
    const next = { ...preferences, ...updates };
    setPreferences(next);
    try {
      await fetch('/api/v1/notifications/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendTestNotification = async (channel: string) => {
    try {
      await fetch('/api/v1/notifications/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  // Keyboard Shortcuts Handlers
  const handleShortcutCompose = useCallback(() => {
    setIsSimOpen(true);
    showShortcutFeedback('Compose & Simulate Email [C]');
  }, [showShortcutFeedback]);

  const handleShortcutArchive = useCallback(() => {
    if (!selectedEmail && emails.length === 0) return;
    const target = selectedEmail || emails[0];
    if (!target) return;

    const currentIdx = emails.findIndex((e) => e.id === target.id);
    handleArchiveEmail(target.id);
    showShortcutFeedback('Email Archived [E]');

    // Auto-advance to next email if possible
    if (emails.length > 1) {
      const nextEmail = currentIdx < emails.length - 1 ? emails[currentIdx + 1] : emails[currentIdx - 1];
      if (nextEmail && nextEmail.id !== target.id) {
        setSelectedEmail(nextEmail);
      }
    }
  }, [selectedEmail, emails, handleArchiveEmail, showShortcutFeedback]);

  const handleShortcutMarkRead = useCallback(() => {
    if (!selectedEmail && emails.length === 0) return;
    const target = selectedEmail || emails[0];
    if (!target) return;

    handleMarkRead(target.id);
    showShortcutFeedback(target.isRead ? 'Marked Unread [R]' : 'Marked Read [R]');
  }, [selectedEmail, emails, handleMarkRead, showShortcutFeedback]);

  const handleShortcutToggleStar = useCallback(() => {
    if (!selectedEmail && emails.length === 0) return;
    const target = selectedEmail || emails[0];
    if (!target) return;

    handleToggleStar(target.id);
    showShortcutFeedback(target.isStarred ? 'Unstarred [S]' : 'Starred [S]');
  }, [selectedEmail, emails, handleToggleStar, showShortcutFeedback]);

  const handleShortcutNextEmail = useCallback(() => {
    if (emails.length === 0) return;
    if (!selectedEmail) {
      setSelectedEmail(emails[0]);
      return;
    }
    const currentIdx = emails.findIndex((e) => e.id === selectedEmail.id);
    if (currentIdx < emails.length - 1) {
      const next = emails[currentIdx + 1];
      setSelectedEmail(next);
      if (!next.isRead) handleMarkRead(next.id);
    }
  }, [emails, selectedEmail, handleMarkRead]);

  const handleShortcutPrevEmail = useCallback(() => {
    if (emails.length === 0) return;
    if (!selectedEmail) {
      setSelectedEmail(emails[0]);
      return;
    }
    const currentIdx = emails.findIndex((e) => e.id === selectedEmail.id);
    if (currentIdx > 0) {
      const prev = emails[currentIdx - 1];
      setSelectedEmail(prev);
      if (!prev.isRead) handleMarkRead(prev.id);
    }
  }, [emails, selectedEmail, handleMarkRead]);

  const handleShortcutSearchFocus = useCallback(() => {
    const input = document.getElementById('global-search-input') as HTMLInputElement | null;
    if (input) {
      input.focus();
      input.select();
    }
  }, []);

  const handleShortcutEscape = useCallback(() => {
    setIsSimOpen(false);
    setIsDigestOpen(false);
    setIsShortcutsOpen(false);
    setConnectModalProvider(null);
  }, []);

  // Global Keyboard Shortcuts Hook
  useKeyboardShortcuts({
    onCompose: handleShortcutCompose,
    onArchive: handleShortcutArchive,
    onMarkRead: handleShortcutMarkRead,
    onToggleStar: handleShortcutToggleStar,
    onNextEmail: handleShortcutNextEmail,
    onPrevEmail: handleShortcutPrevEmail,
    onSearchFocus: handleShortcutSearchFocus,
    onToggleHelp: () => setIsShortcutsOpen((prev) => !prev),
    onEscape: handleShortcutEscape,
  });

  // Derived counts
  const unreadCount = emails.filter((e) => !e.isRead).length;
  const criticalCount = emails.filter((e) => e.analysis?.priority === 'critical').length;
  const deadlinesCount = emails.filter((e) => e.analysis?.deadline).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        accounts={accounts}
        selectedAccountId={selectedAccountId}
        onSelectAccount={(id) => {
          setSelectedAccountId(id);
          setActiveTab('inbox');
        }}
        onOpenSimulation={() => setIsSimOpen(true)}
        onOpenDigest={() => setIsDigestOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        criticalCount={criticalCount}
        onNavigateToInboxWithCritical={() => {
          setInboxFilterPriority('critical');
          setActiveTab('inbox');
        }}
        searchQuery={globalSearch}
        onSearchChange={(q) => {
          setGlobalSearch(q);
          if (q.trim()) setActiveTab('inbox');
        }}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => {
            if (tab === 'inbox') setInboxFilterPriority('all');
            setActiveTab(tab);
          }}
          unreadCount={unreadCount}
          criticalCount={criticalCount}
          deadlinesCount={deadlinesCount}
          accountsCount={accounts.length}
          rulesCount={rules.length}
        />

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 bg-slate-950">
          {activeTab === 'dashboard' && (
            <DashboardView
              accounts={accounts}
              emails={emails}
              onSelectEmail={handleSelectEmail}
              onNavigateToTab={(t) => setActiveTab(t)}
              onOpenDigest={() => setIsDigestOpen(true)}
              onResyncAccount={handleResyncAccount}
              onOpenSimulation={() => setIsSimOpen(true)}
            />
          )}

          {activeTab === 'inbox' && (
            <UnifiedInboxView
              accounts={accounts}
              emails={emails}
              selectedEmail={selectedEmail}
              onSelectEmail={(e) => {
                setSelectedEmail(e);
                if (!e.isRead) handleMarkRead(e.id);
              }}
              onArchiveEmail={handleArchiveEmail}
              onMarkRead={handleMarkRead}
              onToggleStar={handleToggleStar}
              onSendDraftReply={handleSendDraftReply}
              activeFilterPriority={inboxFilterPriority}
              selectedAccountId={selectedAccountId}
            />
          )}

          {activeTab === 'rag' && <AIAskRAGView onSelectEmailById={handleSelectEmailById} />}

          {activeTab === 'deadlines' && (
            <DeadlinesView emails={emails} onSelectEmail={handleSelectEmail} />
          )}

          {activeTab === 'accounts' && (
            <ConnectedAccountsView
              accounts={accounts}
              onOpenConnectModal={(provider) => setConnectModalProvider(provider)}
              onResyncAccount={handleResyncAccount}
              onDisconnectAccount={handleDisconnectAccount}
            />
          )}

          {activeTab === 'rules' && (
            <RulesEngineView
              rules={rules}
              onAddRule={handleAddRule}
              onToggleRule={handleToggleRule}
              onDeleteRule={handleDeleteRule}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsView
              preferences={preferences}
              deliveries={deliveries}
              onUpdatePreferences={handleUpdatePreferences}
              onSendTestNotification={handleSendTestNotification}
            />
          )}

          {activeTab === 'security' && (
            <SecurityAuditView auditLogs={auditLogs} devices={devices} />
          )}
        </main>
      </div>

      {/* Modals */}
      <SimulationModal
        isOpen={isSimOpen}
        onClose={() => setIsSimOpen(false)}
        accounts={accounts}
        onSimulateEmail={handleSimulateEmail}
      />

      <AIDailyDigestModal
        isOpen={isDigestOpen}
        onClose={() => setIsDigestOpen(false)}
        onSelectEmailById={handleSelectEmailById}
      />

      <ConnectAccountModal
        isOpen={connectModalProvider !== null}
        onClose={() => setConnectModalProvider(null)}
        provider={connectModalProvider || 'gmail'}
        onAccountConnected={handleConnectAccount}
      />

      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Shortcut Action Toast */}
      {shortcutToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-slate-900/95 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl shadow-indigo-500/20 backdrop-blur-md animate-in slide-in-from-bottom-2 fade-in duration-150">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{shortcutToast}</span>
        </div>
      )}
    </div>
  );
}

export default App;
