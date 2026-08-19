import React, { useState, useEffect } from 'react';
import { X, Sparkles, AlertTriangle, Calendar, CheckCircle2, Zap, ArrowRight } from 'lucide-react';
import { DailyDigest } from '../types';

interface AIDailyDigestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEmailById: (id: string) => void;
}

export const AIDailyDigestModal: React.FC<AIDailyDigestModalProps> = ({
  isOpen,
  onClose,
  onSelectEmailById,
}) => {
  const [digest, setDigest] = useState<DailyDigest | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch('/api/v1/summary/daily')
        .then((res) => res.json())
        .then((data) => setDigest(data))
        .catch((err) => console.error('Digest error:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-indigo-500/30 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Executive Morning Briefing</h2>
              <p className="text-xs text-slate-400">
                Synthesized across all inboxes • Generated {digest?.date || 'Today'}
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

        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <Sparkles className="h-6 w-6 text-indigo-400 animate-spin mx-auto" />
            <p className="text-sm">Synthesizing intelligence briefing with Gemini 3.7...</p>
          </div>
        ) : digest ? (
          <div className="space-y-4 text-xs">
            {/* Executive Synthesis */}
            <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800/80 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Executive Synthesis
              </div>
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                {digest.executiveSummary}
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-2.5">
                <span className="text-slate-400 block text-[11px]">Total Processed</span>
                <span className="text-lg font-bold text-white">{digest.totalReceived}</span>
              </div>
              <div className="rounded-lg border border-rose-500/30 bg-rose-950/20 p-2.5">
                <span className="text-rose-300 block text-[11px]">Critical Alerts</span>
                <span className="text-lg font-bold text-rose-300">{digest.criticalCount}</span>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-2.5">
                <span className="text-amber-300 block text-[11px]">High Priority</span>
                <span className="text-lg font-bold text-amber-300">{digest.highCount}</span>
              </div>
            </div>

            {/* Critical Highlights */}
            {digest.topPriorities && digest.topPriorities.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-rose-300 text-xs">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>High Priority Threads:</span>
                </div>
                <div className="space-y-2">
                  {digest.topPriorities.map((item) => (
                    <div
                      key={item.emailId}
                      onClick={() => {
                        onSelectEmailById(item.emailId);
                        onClose();
                      }}
                      className="cursor-pointer rounded-lg border border-slate-800 bg-slate-950/90 p-3 hover:border-indigo-500/50 hover:bg-slate-900 transition flex items-center justify-between gap-3 group"
                    >
                      <div className="space-y-1 truncate">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-bold ${
                              item.priority === 'critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                            }`}
                          >
                            {item.priority}
                          </span>
                          <span className="font-semibold text-slate-200 truncate">{item.subject}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{item.summary}</p>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Deadlines */}
            {digest.upcomingDeadlines && digest.upcomingDeadlines.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Upcoming Deadlines:</span>
                </div>
                <div className="space-y-1.5">
                  {digest.upcomingDeadlines.map((dl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        onSelectEmailById(dl.emailId);
                        onClose();
                      }}
                      className="cursor-pointer flex items-center justify-between gap-2 rounded-lg bg-slate-950/60 p-2.5 border border-slate-800 text-slate-300 text-xs hover:border-slate-700"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="font-medium text-white">{dl.task}</span>
                      </div>
                      <span className="text-[11px] text-amber-300 font-mono">{dl.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition"
          >
            Dismiss Briefing
          </button>
        </div>
      </div>
    </div>
  );
};
