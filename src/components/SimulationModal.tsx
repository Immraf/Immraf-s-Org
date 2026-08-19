import React, { useState } from 'react';
import { X, Zap, Sparkles, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { EmailAccount } from '../types';

interface SimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: EmailAccount[];
  onSimulateEmail: (emailData: {
    accountId: string;
    subject: string;
    sender: string;
    senderName: string;
    bodyText: string;
  }) => Promise<void>;
}

export const SimulationModal: React.FC<SimulationModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSimulateEmail,
}) => {
  const [selectedAccountId, setSelectedAccountId] = useState<string>(accounts[0]?.id || '');
  const [subject, setSubject] = useState<string>('URGENT: Database Cluster Failover Alert');
  const [sender, setSender] = useState<string>('noc-alerts@cloudscale.net');
  const [senderName, setSenderName] = useState<string>('CloudScale Network Operations');
  const [bodyText, setBodyText] = useState<string>(
    `Primary database cluster node db-master-02 experienced an unexpected kernel panic at 10:14 UTC.
Failover to standby node db-standby-01 completed automatically, but secondary replication lag is at 42 seconds.
Action Required: The on-call engineering lead must review replication logs and approve manual sync reconciliation before 14:00 UTC.`
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const presets = [
    {
      title: '🚨 Critical Bank Alert',
      subject: 'Security Alert: Unauthorized Wire Transfer Attempt Blocked',
      sender: 'fraud-prevention@apexbank.com',
      senderName: 'ApexBank Fraud Division',
      bodyText:
        'A transfer of $12,500.00 USD was initiated from an unrecognized device in Frankfurt, Germany. The transaction was held pending immediate verification. Confirm or cancel via the security portal within 3 hours.',
    },
    {
      title: '⚡ Academic Supervisor Directive',
      subject: 'Urgent: Departmental Seminar Presentation Schedule Confirmed',
      sender: 'dean.academic@university.edu.ng',
      senderName: 'Dean of Postgraduate Studies',
      bodyText:
        'Your presentation on Distributed Neural Defense has been scheduled for Thursday, August 28 at 10:00 AM WAT in Hall B. Please submit your finalized slide deck by Wednesday 6:00 PM WAT.',
    },
    {
      title: '💼 Executive Job Offer',
      subject: 'Official Offer Letter: Principal AI Solutions Engineer',
      sender: 'hr-executive@quantum-ai.io',
      senderName: 'Quantum AI Executive Hiring',
      bodyText:
        'We are thrilled to extend an offer for the Principal AI Solutions Engineer position with an annual compensation package of $220,000 USD plus equity. Please sign and return the document before August 25, 2026.',
    },
    {
      title: '☕ Tech Newsletter',
      subject: 'Weekly AI Compute Roundup: Quantum Supremacy & GPU Trends',
      sender: 'editor@technews-weekly.com',
      senderName: 'TechNews Weekly',
      bodyText:
        'This week we analyze open-source reasoning models, 3nm wafer yields, and datacenter liquid cooling innovations. Read the full issue on our site.',
    },
  ];

  const handleApplyPreset = (preset: typeof presets[0]) => {
    setSubject(preset.subject);
    setSender(preset.sender);
    setSenderName(preset.senderName);
    setBodyText(preset.bodyText);
  };

  const handleSimulate = async () => {
    setIsSubmitting(true);
    try {
      await onSimulateEmail({
        accountId: selectedAccountId || accounts[0]?.id,
        subject,
        sender,
        senderName,
        bodyText,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Live Incoming Email Ingestion Simulator</h2>
              <p className="text-xs text-slate-400">
                Inject real test emails into MailSentinel AI and observe real-time AI parsing & priority scoring.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Quick Scenario Presets:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(p)}
                className="rounded-lg border border-slate-800 bg-slate-950/80 p-2 text-left text-xs font-semibold text-slate-300 hover:border-indigo-500/50 hover:bg-slate-950 transition truncate"
              >
                {p.title}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Target Account</label>
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.displayName} ({acc.emailAddress})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sender Name</label>
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sender Email</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Body Content</label>
            <textarea
              rows={4}
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-sans leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Pipeline will auto-calculate score and dispatch WhatsApp/FCM if Critical.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSimulate}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md hover:brightness-110 disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isSubmitting ? 'Analyzing with Gemini 3.7...' : 'Run Pipeline & Ingest'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
