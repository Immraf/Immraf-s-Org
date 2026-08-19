import React, { useState } from 'react';
import {
  BellRing,
  Smartphone,
  MessageSquare,
  Moon,
  Send,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { NotificationPreference, NotificationDelivery } from '../types';

interface NotificationsViewProps {
  preferences: NotificationPreference;
  deliveries: NotificationDelivery[];
  onUpdatePreferences: (updates: Partial<NotificationPreference>) => void;
  onSendTestNotification: (channel: string) => void;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  preferences,
  deliveries,
  onUpdatePreferences,
  onSendTestNotification,
}) => {
  const [testSentMsg, setTestSentMsg] = useState<string | null>(null);

  const handleTest = (channel: string) => {
    onSendTestNotification(channel);
    setTestSentMsg(`Test notification dispatched via ${channel}! Check delivery log below.`);
    setTimeout(() => setTestSentMsg(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-indigo-400" />
            <h1 className="text-xl font-bold text-white">Multi-Channel Notification Decision Center</h1>
          </div>
          <p className="text-xs text-slate-400">
            Configure delivery channels, WhatsApp Business Cloud API integration, FCM Push, and Quiet Hours filters.
          </p>
        </div>

        {testSentMsg && (
          <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-3 py-1.5 text-xs text-emerald-300 font-medium">
            {testSentMsg}
          </div>
        )}
      </div>

      {/* Channel Configuration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Business Platform Cloud API (Section 30) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">WhatsApp Business Cloud API</h3>
                <span className="text-[11px] text-emerald-400 font-medium">Official Cloud API (v21.0)</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.whatsappEnabled}
                onChange={(e) => onUpdatePreferences({ whatsappEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <p className="text-xs text-slate-400">
            Instant high-priority alerts delivered to your mobile device via verified Meta WhatsApp Business template.
          </p>

          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Target WhatsApp Phone Number</label>
              <input
                type="text"
                value={preferences.whatsappPhoneNumber}
                onChange={(e) => onUpdatePreferences({ whatsappPhoneNumber: e.target.value })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Notification Threshold</label>
              <select
                value={preferences.whatsappThreshold}
                onChange={(e) => onUpdatePreferences({ whatsappThreshold: e.target.value as any })}
                className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="critical">Critical Priority Only (Score 85+)</option>
                <option value="high">High + Critical Priority (Score 65+)</option>
              </select>
            </div>

            <div className="rounded-lg bg-slate-950/80 p-2.5 border border-slate-800 text-[11px] text-slate-400 font-mono space-y-1">
              <div className="text-emerald-400 font-semibold">Approved Template: mailsentinel_critical_alert_v2</div>
              <div>Body: &quot;🚨 [MailSentinel] &#123;&#123;priority&#125;&#125; Alert: &#123;&#123;subject&#125;&#125; from &#123;&#123;sender&#125;&#125;...&quot;</div>
            </div>

            <button
              onClick={() => handleTest('whatsapp')}
              className="w-full rounded-lg border border-emerald-500/40 bg-emerald-600/15 py-2 text-center text-xs font-semibold text-emerald-300 hover:bg-emerald-600/25 transition flex items-center justify-center gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Test WhatsApp Alert</span>
            </button>
          </div>
        </div>

        {/* Quiet Hours Scheduler & FCM (Section 34) */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                <Moon className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Quiet Hours Scheduler</h3>
                <span className="text-[11px] text-slate-400">Delay non-urgent notifications</span>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.quietHoursEnabled}
                onChange={(e) => onUpdatePreferences({ quietHoursEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
                <input
                  type="time"
                  value={preferences.quietHoursStart}
                  onChange={(e) => onUpdatePreferences({ quietHoursStart: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-semibold mb-1">End Time</label>
                <input
                  type="time"
                  value={preferences.quietHoursEnd}
                  onChange={(e) => onUpdatePreferences({ quietHoursEnd: e.target.value })}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-slate-300 font-medium">Bypass for Critical Security Alerts</span>
              <input
                type="checkbox"
                checked={preferences.allowCriticalInQuietHours}
                onChange={(e) => onUpdatePreferences({ allowCriticalInQuietHours: e.target.checked })}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
              />
            </div>

            <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800 space-y-1 text-[11px] text-slate-400">
              <div className="font-semibold text-indigo-300">Quiet Hours Priority Logic:</div>
              <div>• Low & Informational: Suppressed permanently</div>
              <div>• Medium & High: Delayed until morning summary</div>
              <div>• Critical: Dispatched immediately if bypass enabled</div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <span className="text-slate-300 font-medium">Firebase Push (FCM)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.pushEnabled}
                  onChange={(e) => onUpdatePreferences({ pushEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Live Delivery History Feed (Section 33 & 35) */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Live Multi-Channel Delivery Logs</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">Deduplication: Active</span>
        </div>

        <div className="space-y-2.5">
          {deliveries.map((d) => (
            <div
              key={d.id}
              className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950 p-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] uppercase font-bold ${
                      d.channel === 'whatsapp'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {d.channel.replace('_', ' ')}
                  </span>
                  <span className="font-semibold text-white">{d.title}</span>
                </div>
                <p className="text-slate-400 text-[11px]">{d.body}</p>
              </div>

              <div className="text-right shrink-0">
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {d.status}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {new Date(d.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
