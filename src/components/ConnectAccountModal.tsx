import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, CheckCircle2, ArrowRight } from 'lucide-react';
import { EmailAccount } from '../types';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: 'gmail' | 'outlook';
  onAccountConnected: (accountData: {
    emailAddress: string;
    displayName: string;
    provider: 'gmail' | 'outlook';
  }) => Promise<void>;
}

export const ConnectAccountModal: React.FC<ConnectAccountModalProps> = ({
  isOpen,
  onClose,
  provider,
  onAccountConnected,
}) => {
  const [emailAddress, setEmailAddress] = useState<string>(
    provider === 'gmail' ? 'umar.research@gmail.com' : 'umar.consulting@outlook.com'
  );
  const [displayName, setDisplayName] = useState<string>(
    provider === 'gmail' ? 'Umar Personal & Research' : 'Umar Tech Advisory'
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  if (!isOpen) return null;

  const isGmail = provider === 'gmail';

  const handleConnect = async () => {
    if (!emailAddress || !displayName) return;
    setIsConnecting(true);
    try {
      await onAccountConnected({
        emailAddress,
        displayName,
        provider,
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold text-sm text-white shadow ${
                isGmail ? 'bg-red-600' : 'bg-blue-600'
              }`}
            >
              {isGmail ? 'G' : 'O'}
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Authorize {isGmail ? 'Google Gmail' : 'Microsoft Outlook'} Mailbox
              </h2>
              <p className="text-xs text-slate-400">OAuth 2.0 PKCE Verification • Strict Least-Privilege</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Security & Scopes Notice (Section 11) */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>Strict Read-Only Permission Disclosure</span>
          </div>
          <p className="text-slate-300 leading-relaxed">
            MailSentinel AI requests minimal read-only scope (
            <code className="text-emerald-400 font-mono">
              {isGmail ? 'https://www.googleapis.com/auth/gmail.readonly' : 'Mail.Read'}
            </code>
            ). MailSentinel AI cannot modify, delete, or send emails from your provider without explicit user confirmation.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <Lock className="h-3 w-3 text-emerald-400" />
            <span>OAuth access tokens are encrypted with AES-256-GCM envelope encryption.</span>
          </div>
        </div>

        {/* Input fields */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Email Account Address</label>
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Account Label / Friendly Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={isConnecting || !emailAddress}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-md transition disabled:opacity-50 ${
              isGmail ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{isConnecting ? 'Authenticating...' : `Grant OAuth & Sync ${isGmail ? 'Gmail' : 'Outlook'}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
