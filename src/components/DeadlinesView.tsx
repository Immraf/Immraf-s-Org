import React, { useState } from 'react';
import {
  CalendarClock,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { EmailMessage } from '../types';

interface DeadlinesViewProps {
  emails: EmailMessage[];
  onSelectEmail: (email: EmailMessage) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({ emails, onSelectEmail }) => {
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const deadlineEmails = emails.filter((e) => e.analysis?.deadline);

  const toggleTask = (id: string) => {
    setCompletedTasks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MailSentinel AI//Email Deadlines//EN
${deadlineEmails
  .map(
    (e, idx) => `BEGIN:VEVENT
UID:mailsentinel-${e.id}-${idx}
SUMMARY:${e.subject}
DESCRIPTION:Extracted by MailSentinel AI from ${e.sender}. Next Step: ${e.analysis?.recommendedAction || ''}
STATUS:CONFIRMED
END:VEVENT`
  )
  .join('\n')}
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'mailsentinel-deadlines.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Extracted Deadlines & Action Items</h1>
          </div>
          <p className="text-xs text-slate-400">
            Automatically extracted by Gemini 3.7 entity parser from all connected inboxes.
          </p>
        </div>

        <button
          onClick={handleExportICS}
          className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition shadow-sm"
        >
          <Download className="h-4 w-4 text-indigo-400" />
          <span>Export All to Calendar (.ICS)</span>
        </button>
      </div>

      {/* Deadlines List */}
      <div className="space-y-4">
        {deadlineEmails.map((email) => {
          const isDone = completedTasks[email.id];
          const isCritical = email.analysis?.priority === 'critical';

          return (
            <div
              key={email.id}
              className={`rounded-xl border p-5 transition shadow-sm ${
                isDone
                  ? 'border-slate-800 bg-slate-950/40 opacity-60'
                  : isCritical
                  ? 'border-rose-500/40 bg-gradient-to-r from-rose-950/30 to-slate-900/90'
                  : 'border-amber-500/30 bg-gradient-to-r from-amber-950/20 to-slate-900/90'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <button
                    onClick={() => toggleTask(email.id)}
                    className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      isDone
                        ? 'border-emerald-500 bg-emerald-500 text-slate-950'
                        : 'border-slate-700 bg-slate-800 hover:border-indigo-500'
                    }`}
                  >
                    {isDone && <CheckCircle2 className="h-4 w-4" />}
                  </button>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-md">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Deadline: {email.analysis?.deadline}</span>
                      </span>

                      <span className="text-xs text-slate-400 font-medium">
                        From: <strong className="text-slate-200">{email.senderName || email.sender}</strong>
                      </span>

                      <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 uppercase">
                        {email.analysis?.category}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-semibold ${
                        isDone ? 'line-through text-slate-500' : 'text-white'
                      }`}
                    >
                      {email.subject}
                    </h3>

                    {email.analysis?.recommendedAction && (
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-medium pt-1">
                        <Zap className="h-3.5 w-3.5 text-amber-400" />
                        <span>Next Step: {email.analysis.recommendedAction}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectEmail(email)}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition shrink-0 flex items-center gap-1"
                >
                  <span>Inspect Email</span>
                  <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
