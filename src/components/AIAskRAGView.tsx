import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { EmailMessage, PriorityLevel } from '../types';

interface CitedEmail {
  emailId: string;
  subject: string;
  sender: string;
  receivedAt: string;
  relevanceSnippet: string;
  priority: PriorityLevel;
}

interface AIAskRAGViewProps {
  onSelectEmailById: (id: string) => void;
}

export const AIAskRAGView: React.FC<AIAskRAGViewProps> = ({ onSelectEmailById }) => {
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [citedEmails, setCitedEmails] = useState<CitedEmail[]>([]);
  const [suggestedFollowUps, setSuggestedFollowUps] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<
    { query: string; answer: string; cited: CitedEmail[]; timestamp: string }[]
  >([]);

  const sampleQuestions = [
    'What deadlines do I have this week?',
    'What did my supervisor say about my dissertation?',
    'Show all critical security warnings and bank alerts',
    'What interviews and job offers are pending?',
    'Find all unpaid invoices or upcoming payment dues',
  ];

  const handleAsk = async (qText?: string) => {
    const textToSearch = qText || query;
    if (!textToSearch.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/v1/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSearch }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setConfidence(data.confidence);
      setCitedEmails(data.citedEmails || []);
      setSuggestedFollowUps(data.suggestedFollowUps || []);

      setConversationHistory((prev) => [
        {
          query: textToSearch,
          answer: data.answer,
          cited: data.citedEmails || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
        ...prev,
      ]);
    } catch (e) {
      console.error('RAG Error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Card */}
      <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300">
              <Sparkles className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Semantic AI Knowledge Base & RAG</h1>
              <p className="text-xs text-slate-400">
                Ask natural-language questions across all connected inboxes with grounded citations.
              </p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-300 font-medium">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Fact-Grounded (Zero Hallucination)</span>
          </div>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <textarea
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
            placeholder="Ask anything (e.g., 'What are my deadlines for Friday?', 'Did my bank email me about a login?')..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950/90 p-3.5 pr-28 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleAsk()}
            disabled={isLoading || !query.trim()}
            className="absolute right-3 bottom-3.5 flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50 transition"
          >
            <span>{isLoading ? 'Searching...' : 'Ask AI'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Suggested Quick Queries */}
        <div className="space-y-1.5 pt-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Suggested Inquiries:
          </div>
          <div className="flex flex-wrap gap-2">
            {sampleQuestions.map((sq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(sq);
                  handleAsk(sq);
                }}
                className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-1 text-xs text-slate-300 hover:border-indigo-500/40 hover:bg-slate-900 transition flex items-center gap-1.5"
              >
                <MessageSquare className="h-3 w-3 text-indigo-400" />
                <span>{sq}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Answer Box */}
      {answer && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-bold text-white">Grounded Answer</span>
            </div>
            {confidence && (
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs text-emerald-300 font-medium">
                Confidence: {Math.round(confidence * 100)}%
              </span>
            )}
          </div>

          <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-medium bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            {answer}
          </div>

          {/* Source Citations */}
          {citedEmails.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Cited Source Emails ({citedEmails.length}):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {citedEmails.map((cited) => (
                  <div
                    key={cited.emailId}
                    onClick={() => onSelectEmailById(cited.emailId)}
                    className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950 p-3 hover:border-indigo-500/50 hover:bg-slate-900 transition group space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-indigo-300 truncate max-w-[180px]">
                        {cited.sender}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[10px] uppercase font-bold ${
                          cited.priority === 'critical'
                            ? 'bg-rose-500 text-white'
                            : cited.priority === 'high'
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {cited.priority}
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {cited.subject}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 italic">
                      "{cited.relevanceSnippet}"
                    </p>

                    <div className="text-[10px] text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1 font-medium pt-1">
                      <span>View in Inbox</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Follow-up Prompts */}
          {suggestedFollowUps.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-[11px] font-semibold text-slate-400">Suggested Follow-ups:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedFollowUps.map((fu, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(fu);
                      handleAsk(fu);
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800/80 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 transition"
                  >
                    {fu}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
