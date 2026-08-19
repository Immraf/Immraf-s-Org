import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { UserRule, PriorityLevel } from '../types';

interface RulesEngineViewProps {
  rules: UserRule[];
  onAddRule: (rule: Omit<UserRule, 'id' | 'createdAt'>) => void;
  onToggleRule: (id: string) => void;
  onDeleteRule: (id: string) => void;
}

export const RulesEngineView: React.FC<RulesEngineViewProps> = ({
  rules,
  onAddRule,
  onToggleRule,
  onDeleteRule,
}) => {
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [conditionType, setConditionType] = useState<UserRule['conditionType']>('sender_domain');
  const [conditionValue, setConditionValue] = useState<string>('');
  const [actionType, setActionType] = useState<UserRule['actionType']>('set_priority');
  const [actionValue, setActionValue] = useState<string>('high');
  const [priorityOverride, setPriorityOverride] = useState<PriorityLevel>('high');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !conditionValue) return;

    onAddRule({
      userId: 'user-001',
      name,
      isActive: true,
      conditionType,
      conditionValue,
      actionType,
      actionValue,
      priorityOverride: actionType === 'set_priority' ? priorityOverride : undefined,
    });

    setName('');
    setConditionValue('');
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Custom Rule Priority Engine</h1>
          </div>
          <p className="text-xs text-slate-400">
            Define custom conditions to override AI prioritization, escalate sender domains, or enforce instant WhatsApp alerts.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-indigo-500 transition"
        >
          <Plus className="h-4 w-4" />
          <span>{isCreating ? 'Cancel' : 'Create Custom Rule'}</span>
        </button>
      </div>

      {/* Creator Card */}
      {isCreating && (
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-indigo-500/40 bg-slate-900/90 p-5 space-y-4 shadow-xl"
        >
          <h3 className="text-sm font-bold text-white">New Prioritization Rule</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Rule Name</label>
              <input
                type="text"
                required
                placeholder="e.g., Escalation for University Supervisor"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Condition</label>
              <select
                value={conditionType}
                onChange={(e) => setConditionType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="sender_domain">Sender domain contains</option>
                <option value="sender_email">Sender email matches exactly</option>
                <option value="subject_contains">Subject contains keywords (comma-separated)</option>
                <option value="has_deadline">Email has extracted deadline</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Match Value / Keywords</label>
              <input
                type="text"
                required
                placeholder="e.g., university.edu.ng, firstbank.com"
                value={conditionValue}
                onChange={(e) => setConditionValue(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Action</label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="set_priority">Enforce Priority Level</option>
                <option value="require_immediate_notification">Dispatch Instant WhatsApp Alert</option>
                <option value="mark_critical">Force Critical Priority (Score 95+)</option>
                <option value="auto_archive_newsletter">Auto-Classify as Low Priority</option>
              </select>
            </div>

            {actionType === 'set_priority' && (
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Target Priority</label>
                <select
                  value={priorityOverride}
                  onChange={(e) => setPriorityOverride(e.target.value as any)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="critical">Critical (85-100)</option>
                  <option value="high">High (65-84)</option>
                  <option value="medium">Medium (35-64)</option>
                  <option value="low">Low (10-34)</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md"
            >
              Save Rule
            </button>
          </div>
        </form>
      )}

      {/* Rules List */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`rounded-xl border p-4 transition shadow-sm flex items-center justify-between gap-4 ${
              rule.isActive
                ? 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                : 'border-slate-800 bg-slate-950/40 opacity-50'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}
                />
                <h4 className="text-sm font-bold text-white">{rule.name}</h4>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400">
                  {rule.conditionType}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                IF <strong className="text-indigo-300">{rule.conditionType}</strong> contains "
                <span className="text-amber-300 font-mono">{rule.conditionValue}</span>" THEN{' '}
                <strong className="text-emerald-300">{rule.actionType}</strong> (
                {rule.priorityOverride || rule.actionValue})
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onToggleRule(rule.id)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                  rule.isActive
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                    : 'border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {rule.isActive ? 'Active' : 'Disabled'}
              </button>

              <button
                onClick={() => onDeleteRule(rule.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
                title="Delete rule"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
