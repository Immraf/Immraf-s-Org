import React, { useState } from 'react';
import {
  Search,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Paperclip,
  Star,
  Archive,
  MailCheck,
  Send,
  Lock,
  Tag,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  DollarSign,
  UserCheck,
  Building,
  MapPin,
  FileText,
  Check,
} from 'lucide-react';
import { EmailAccount, EmailMessage, PriorityLevel, EmailCategory } from '../types';

interface UnifiedInboxViewProps {
  accounts: EmailAccount[];
  emails: EmailMessage[];
  selectedEmail: EmailMessage | null;
  onSelectEmail: (email: EmailMessage) => void;
  onArchiveEmail: (emailId: string) => void;
  onMarkRead: (emailId: string) => void;
  onToggleStar: (emailId: string) => void;
  onSendDraftReply: (emailId: string, replyText: string) => void;
  activeFilterPriority?: string;
  selectedAccountId?: string;
}

export const UnifiedInboxView: React.FC<UnifiedInboxViewProps> = ({
  accounts,
  emails,
  selectedEmail,
  onSelectEmail,
  onArchiveEmail,
  onMarkRead,
  onToggleStar,
  onSendDraftReply,
  activeFilterPriority = 'all',
  selectedAccountId = 'all',
}) => {
  const [priorityFilter, setPriorityFilter] = useState<string>(activeFilterPriority);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [accountFilter, setAccountFilter] = useState<string>(selectedAccountId);
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [localSearch, setLocalSearch] = useState<string>('');

  // Draft reply state
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [draftTone, setDraftTone] = useState<string>('professional');
  const [draftInstructions, setDraftInstructions] = useState<string>('');
  const [draftContent, setDraftContent] = useState<string>('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState<boolean>(false);
  const [showConfirmSend, setShowConfirmSend] = useState<boolean>(false);

  // Filter emails
  const filteredEmails = emails.filter((e) => {
    if (accountFilter !== 'all' && e.accountId !== accountFilter) return false;
    if (priorityFilter !== 'all' && e.analysis?.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && e.analysis?.category !== categoryFilter) return false;
    if (unreadOnly && e.isRead) return false;
    if (localSearch) {
      const q = localSearch.toLowerCase();
      const match =
        e.subject.toLowerCase().includes(q) ||
        e.sender.toLowerCase().includes(q) ||
        e.bodyText.toLowerCase().includes(q) ||
        e.analysis?.summary.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleGenerateDraft = async () => {
    if (!selectedEmail) return;
    setIsGeneratingDraft(true);
    try {
      const res = await fetch('/api/v1/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailId: selectedEmail.id,
          tone: draftTone,
          instructions: draftInstructions,
        }),
      });
      const data = await res.json();
      setDraftContent(data.draft || '');
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleConfirmSend = () => {
    if (!selectedEmail || !draftContent) return;
    onSendDraftReply(selectedEmail.id, draftContent);
    setShowConfirmSend(false);
    setIsDrafting(false);
    setDraftContent('');
  };

  const categories: EmailCategory[] = [
    'security',
    'financial',
    'academic',
    'career',
    'government',
    'newsletter',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
      {/* Inbox Control Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 p-3 space-y-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Account selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Account:</span>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Inboxes ({accounts.length})</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.displayName} ({a.emailAddress})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter current view..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Unread toggle */}
          <button
            onClick={() => setUnreadOnly(!unreadOnly)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              unreadOnly
                ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Unread Only</span>
          </button>
        </div>

        {/* Priority & Category Badges Filter */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase">Priority:</span>
          {['all', 'critical', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`capitalize rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                priorityFilter === p
                  ? p === 'critical'
                    ? 'bg-rose-500 text-white shadow'
                    : p === 'high'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-indigo-600 text-white'
                  : 'border border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}

          <span className="text-slate-700 mx-1">|</span>

          <span className="text-slate-500 text-[11px] font-semibold uppercase">Category:</span>
          <button
            onClick={() => setCategoryFilter('all')}
            className={`rounded-md px-2 py-1 text-xs transition ${
              categoryFilter === 'all'
                ? 'bg-slate-700 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`capitalize rounded-md px-2 py-1 text-xs transition ${
                categoryFilter === c
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Split Pane: Email List (Left) & Email Detail (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left List Pane */}
        <div className="w-full lg:w-[420px] shrink-0 border-r border-slate-800 overflow-y-auto divide-y divide-slate-800/80 bg-slate-950">
          {filteredEmails.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-2">
              <MailCheck className="h-8 w-8 text-slate-600" />
              <p className="text-sm font-medium">No emails matching current criteria</p>
              <button
                onClick={() => {
                  setPriorityFilter('all');
                  setCategoryFilter('all');
                  setAccountFilter('all');
                  setUnreadOnly(false);
                  setLocalSearch('');
                }}
                className="text-xs text-indigo-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              const priority = email.analysis?.priority || 'medium';
              const isCritical = priority === 'critical';
              const isHigh = priority === 'high';

              return (
                <div
                  key={email.id}
                  onClick={() => onSelectEmail(email)}
                  className={`p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                      : !email.isRead
                      ? 'bg-slate-900/40 hover:bg-slate-900/80'
                      : 'hover:bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isCritical
                            ? 'bg-rose-500 text-white'
                            : isHigh
                            ? 'bg-amber-500 text-slate-950'
                            : priority === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {priority} {email.analysis?.priorityScore}
                      </span>
                      <span
                        className={`text-xs truncate ${
                          !email.isRead ? 'font-bold text-white' : 'font-medium text-slate-300'
                        }`}
                      >
                        {email.senderName || email.sender}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(email.receivedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h4
                    className={`text-xs mb-1 line-clamp-1 ${
                      !email.isRead ? 'font-semibold text-slate-100' : 'text-slate-300'
                    }`}
                  >
                    {email.subject}
                  </h4>

                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                    {email.analysis?.summary || email.snippet}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/40">
                    <span className="rounded bg-slate-900 px-1.5 py-0.5 border border-slate-800 text-slate-400">
                      {email.analysis?.category}
                    </span>
                    {email.analysis?.deadline && (
                      <span className="flex items-center gap-1 text-amber-300/90 font-medium">
                        <Clock className="h-3 w-3" />
                        <span className="truncate max-w-[140px]">{email.analysis.deadline}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Detail Pane */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 hidden lg:block">
          {selectedEmail ? (
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Header Actions */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-500/20 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                    {selectedEmail.accountEmail}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Provider ID: {selectedEmail.providerMessageId}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleStar(selectedEmail.id)}
                    className={`flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs transition ${
                      selectedEmail.isStarred ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                    title="Star / Unstar Email (Shortcut: S)"
                  >
                    <Star className={`h-3.5 w-3.5 ${selectedEmail.isStarred ? 'fill-amber-400' : ''}`} />
                    <span>{selectedEmail.isStarred ? 'Starred' : 'Star'}</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.2 text-[10px] font-mono text-slate-400">S</kbd>
                  </button>

                  <button
                    onClick={() => onMarkRead(selectedEmail.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition"
                    title="Toggle Read / Unread (Shortcut: R)"
                  >
                    <MailCheck className="h-3.5 w-3.5" />
                    <span>{selectedEmail.isRead ? 'Mark Unread' : 'Mark Read'}</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.2 text-[10px] font-mono text-slate-400">R</kbd>
                  </button>

                  <button
                    onClick={() => onArchiveEmail(selectedEmail.id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition"
                    title="Archive Email (Shortcut: E)"
                  >
                    <Archive className="h-3.5 w-3.5" />
                    <span>Archive</span>
                    <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.2 text-[10px] font-mono text-slate-400">E</kbd>
                  </button>
                </div>
              </div>

              {/* Subject & Sender Meta */}
              <div>
                <h1 className="text-xl font-bold text-white mb-2">{selectedEmail.subject}</h1>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <div>
                    <span className="font-semibold text-slate-200">{selectedEmail.senderName}</span>{' '}
                    <span className="text-slate-500">&lt;{selectedEmail.sender}&gt;</span>
                  </div>
                  <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                </div>
              </div>

              {/* AI Intelligence Card (Section 18 & 23) */}
              {selectedEmail.analysis && (
                <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-900 p-5 space-y-4 shadow-lg ring-1 ring-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-indigo-400" />
                      <h3 className="text-sm font-bold text-white">AI Email Intelligence Analysis</h3>
                    </div>
                    <span className="rounded bg-indigo-500/20 px-2 py-0.5 text-[11px] font-semibold text-indigo-300">
                      Model: {selectedEmail.analysis.modelUsed}
                    </span>
                  </div>

                  {/* Summary */}
                  <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                      Executive Summary
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed font-medium">
                      {selectedEmail.analysis.summary}
                    </p>
                  </div>

                  {/* Priority Breakdown (Explainable Scoring) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">Explainable Priority Calculation</span>
                      <span className="font-bold text-indigo-300">
                        {selectedEmail.analysis.priorityScore} / 100 ({selectedEmail.analysis.priority.toUpperCase()})
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                      <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                        <div className="text-slate-400">Sender Rep.</div>
                        <div className="font-bold text-white mt-0.5">
                          {selectedEmail.analysis.priorityBreakdown.senderReputationScore} / 25
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                        <div className="text-slate-400">Urgency</div>
                        <div className="font-bold text-white mt-0.5">
                          {selectedEmail.analysis.priorityBreakdown.urgencyIndicatorScore} / 25
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                        <div className="text-slate-400">Deadline Prox.</div>
                        <div className="font-bold text-white mt-0.5">
                          {selectedEmail.analysis.priorityBreakdown.deadlineProximityScore} / 25
                        </div>
                      </div>
                      <div className="rounded-lg bg-slate-950/60 p-2 border border-slate-800">
                        <div className="text-slate-400">Content Impact</div>
                        <div className="font-bold text-white mt-0.5">
                          {selectedEmail.analysis.priorityBreakdown.contentImpactScore} / 25
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 italic">
                      {selectedEmail.analysis.priorityBreakdown.explanation}
                    </p>
                  </div>

                  {/* Extracted Entities */}
                  {selectedEmail.analysis.entities.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Extracted Entities & Structured Signals
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedEmail.analysis.entities.map((entity) => (
                          <div
                            key={entity.id}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-slate-300"
                          >
                            {entity.type === 'deadline' && <Calendar className="h-3 w-3 text-amber-400" />}
                            {entity.type === 'amount' && <DollarSign className="h-3 w-3 text-emerald-400" />}
                            {entity.type === 'person' && <UserCheck className="h-3 w-3 text-blue-400" />}
                            {entity.type === 'organization' && <Building className="h-3 w-3 text-purple-400" />}
                            {entity.type === 'location' && <MapPin className="h-3 w-3 text-rose-400" />}
                            {entity.type === 'application_number' && <FileText className="h-3 w-3 text-cyan-400" />}
                            <span className="font-medium">{entity.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Action */}
                  {selectedEmail.analysis.recommendedAction && (
                    <div className="flex items-center justify-between rounded-lg border border-amber-500/30 bg-amber-950/20 p-3 text-xs">
                      <div className="flex items-center gap-2 text-amber-300">
                        <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>Recommended Next Step:</strong> {selectedEmail.analysis.recommendedAction}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setIsDrafting(true);
                          handleGenerateDraft();
                        }}
                        className="rounded-lg bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition shrink-0 ml-2"
                      >
                        Draft Reply
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI Draft Reply Composer (Level 2 Recommend / Level 3 Confirm) */}
              {isDrafting && (
                <div className="rounded-xl border border-indigo-500/40 bg-slate-900/90 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4 text-indigo-400" />
                      <h4 className="text-sm font-bold text-white">AI-Assisted Reply Draft (Level 3 Confirmation Required)</h4>
                    </div>
                    <button
                      onClick={() => setIsDrafting(false)}
                      className="text-xs text-slate-400 hover:text-slate-200"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Tone:</span>
                    {['professional', 'concise', 'urgent acknowledgment', 'confirm availability'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setDraftTone(t)}
                        className={`rounded px-2 py-0.5 text-xs capitalize ${
                          draftTone === t
                            ? 'bg-indigo-600 text-white font-medium'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={4}
                    value={draftContent}
                    onChange={(e) => setDraftContent(e.target.value)}
                    placeholder="AI generated draft will appear here..."
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={handleGenerateDraft}
                      disabled={isGeneratingDraft}
                      className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                      <span>{isGeneratingDraft ? 'Generating Draft...' : 'Regenerate Draft'}</span>
                    </button>

                    <button
                      onClick={() => setShowConfirmSend(true)}
                      disabled={!draftContent}
                      className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Send with Confirmation</span>
                    </button>
                  </div>

                  {/* Explicit Confirmation Modal / Warning */}
                  {showConfirmSend && (
                    <div className="rounded-lg border border-amber-500/40 bg-amber-950/40 p-3 text-xs space-y-2 mt-2">
                      <div className="flex items-center gap-2 text-amber-300 font-bold">
                        <ShieldAlert className="h-4 w-4" />
                        <span>Security Level 3 Checkpoint</span>
                      </div>
                      <p className="text-slate-300">
                        MailSentinel AI will NEVER send emails autonomously. Are you sure you want to dispatch this email to <strong>{selectedEmail.sender}</strong>?
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={handleConfirmSend}
                          className="rounded bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition"
                        >
                          Yes, Send Email
                        </button>
                        <button
                          onClick={() => setShowConfirmSend(false)}
                          className="rounded border border-slate-700 bg-slate-800 px-3 py-1 text-xs text-slate-300 hover:bg-slate-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Original Email Body (Prompt-Injection Protected) */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
                  <span className="font-semibold text-slate-300">Original Email Body</span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <Lock className="h-3 w-3" /> Untrusted Data Sandbox
                  </span>
                </div>
                <div className="text-xs text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {selectedEmail.bodyText}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-3">
              <MailCheck className="h-10 w-10 text-slate-700" />
              <p className="text-sm font-medium">Select an email from the left pane to view intelligence analysis</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
