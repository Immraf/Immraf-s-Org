import React from 'react';
import { Keyboard, X, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Actions & Ingestion',
      items: [
        { key: 'C', description: 'Compose & simulate incoming email' },
        { key: 'E', description: 'Archive currently selected email' },
        { key: 'R', description: 'Toggle read / unread on selected email' },
        { key: 'S', description: 'Star / unstar selected email' },
      ],
    },
    {
      category: 'Navigation & Browsing',
      items: [
        { key: 'J / ↓', description: 'Select next email in list' },
        { key: 'K / ↑', description: 'Select previous email in list' },
        { key: '/ or ⌘K', description: 'Focus global search input' },
        { key: 'Esc', description: 'Close modal or unfocus search' },
        { key: '?', description: 'Toggle this keyboard shortcuts guide' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30">
              <Keyboard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Power User Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Streamlined keyboard navigation and mailbox triage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          {shortcuts.map((group) => (
            <div key={group.category} className="space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {group.category}
              </h4>
              <div className="divide-y divide-slate-800 rounded-xl border border-slate-800/80 bg-slate-950/60 overflow-hidden">
                {group.items.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between px-4 py-2.5 text-xs text-slate-300"
                  >
                    <span>{item.description}</span>
                    <kbd className="flex items-center justify-center min-w-[28px] h-6 px-2 rounded border border-slate-700 bg-slate-800 font-mono text-[11px] font-bold text-indigo-300 shadow-sm">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-400" />
            Shortcuts are active globally across the app
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
