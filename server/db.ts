import {
  EmailAccount,
  EmailMessage,
  UserRule,
  NotificationPreference,
  NotificationDelivery,
  AuditLogEntry,
  DeviceInfo,
  DailyDigest,
} from '../src/types';
import {
  INITIAL_ACCOUNTS,
  INITIAL_EMAILS,
  INITIAL_RULES,
  INITIAL_PREFERENCES,
  INITIAL_DELIVERIES,
  INITIAL_AUDIT_LOGS,
} from '../src/data/initialData';
import { calculateExplainablePriority } from './priorityEngine';
import { analyzeEmailWithGemini } from './gemini';

class MemoryDatabase {
  private accounts: EmailAccount[] = [...INITIAL_ACCOUNTS];
  private emails: EmailMessage[] = [...INITIAL_EMAILS];
  private rules: UserRule[] = [...INITIAL_RULES];
  private preferences: NotificationPreference = { ...INITIAL_PREFERENCES };
  private deliveries: NotificationDelivery[] = [...INITIAL_DELIVERIES];
  private auditLogs: AuditLogEntry[] = [...INITIAL_AUDIT_LOGS];
  private devices: DeviceInfo[] = [
    {
      id: 'dev-1',
      userId: 'user-001',
      deviceType: 'android',
      deviceName: 'Pixel 9 Pro (Umar)',
      pushToken: 'fcm_token_pixel9_prod_899201',
      lastSeenAt: new Date().toISOString(),
      isActive: true,
      createdAt: '2026-01-10T10:00:00Z',
    },
    {
      id: 'dev-2',
      userId: 'user-001',
      deviceType: 'web_browser',
      deviceName: 'Chrome 128 / macOS',
      pushToken: 'web_push_endpoint_mac_9941',
      lastSeenAt: new Date().toISOString(),
      isActive: true,
      createdAt: '2026-01-12T14:20:00Z',
    },
  ];

  // Accounts
  getAccounts(): EmailAccount[] {
    return this.accounts;
  }

  getAccount(id: string): EmailAccount | undefined {
    return this.accounts.find((a) => a.id === id);
  }

  addAccount(account: Omit<EmailAccount, 'id' | 'createdAt' | 'updatedAt'>): EmailAccount {
    if (this.accounts.length >= 10) {
      throw new Error('ACCOUNT_LIMIT_REACHED: You have reached the maximum quota of 10 connected email accounts.');
    }
    const existing = this.accounts.find((a) => a.emailAddress.toLowerCase() === account.emailAddress.toLowerCase());
    if (existing) {
      throw new Error(`ACCOUNT_EXISTS: Email account ${account.emailAddress} is already connected.`);
    }

    const newAccount: EmailAccount = {
      ...account,
      id: `acc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.accounts.push(newAccount);

    this.logAudit({
      action: 'OAUTH_CONNECT',
      details: `Connected ${newAccount.provider.toUpperCase()} account: ${newAccount.emailAddress}`,
      ipAddress: '102.89.44.12',
      status: 'success',
    });

    return newAccount;
  }

  removeAccount(id: string, purgeData: boolean = false): boolean {
    const idx = this.accounts.findIndex((a) => a.id === id);
    if (idx === -1) return false;
    const removed = this.accounts[idx];
    this.accounts.splice(idx, 1);

    if (purgeData) {
      this.emails = this.emails.filter((e) => e.accountId !== id);
      this.logAudit({
        action: 'DATA_DELETED',
        details: `Purged all stored mailbox data for disconnected account ${removed.emailAddress}`,
        ipAddress: '102.89.44.12',
        status: 'success',
      });
    }

    this.logAudit({
      action: 'OAUTH_DISCONNECT',
      details: `Disconnected email account: ${removed.emailAddress} (Purge data: ${purgeData})`,
      ipAddress: '102.89.44.12',
      status: 'success',
    });

    return true;
  }

  updateAccountStatus(id: string, status: EmailAccount['status']): EmailAccount | undefined {
    const acc = this.getAccount(id);
    if (!acc) return undefined;
    acc.status = status;
    acc.lastSyncedAt = new Date().toISOString();
    acc.updatedAt = new Date().toISOString();
    return acc;
  }

  // Emails
  getEmails(options?: {
    accountId?: string;
    priority?: string;
    category?: string;
    isRead?: boolean;
    search?: string;
  }): EmailMessage[] {
    let result = [...this.emails];

    if (options?.accountId && options.accountId !== 'all') {
      result = result.filter((e) => e.accountId === options.accountId);
    }
    if (options?.priority && options.priority !== 'all') {
      result = result.filter((e) => e.analysis?.priority === options.priority);
    }
    if (options?.category && options.category !== 'all') {
      result = result.filter((e) => e.analysis?.category === options.category);
    }
    if (options?.isRead !== undefined) {
      result = result.filter((e) => e.isRead === options.isRead);
    }
    if (options?.search) {
      const q = options.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.subject.toLowerCase().includes(q) ||
          e.sender.toLowerCase().includes(q) ||
          e.bodyText.toLowerCase().includes(q) ||
          e.analysis?.summary.toLowerCase().includes(q)
      );
    }

    // Sort by receivedAt descending
    return result.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }

  getEmail(id: string): EmailMessage | undefined {
    return this.emails.find((e) => e.id === id);
  }

  async addIncomingEmail(emailData: Omit<EmailMessage, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailMessage> {
    const id = `em-${Date.now()}`;
    const newEmail: EmailMessage = {
      ...emailData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Run AI analysis & priority engine
    const aiResult = await analyzeEmailWithGemini(newEmail.subject, newEmail.sender, newEmail.bodyText);
    const priorityCalc = calculateExplainablePriority(
      newEmail.subject,
      newEmail.sender,
      newEmail.bodyText,
      aiResult.category || 'other',
      this.rules,
      aiResult.deadline
    );

    newEmail.analysis = {
      emailId: id,
      category: aiResult.category || 'other',
      priority: priorityCalc.level,
      priorityScore: priorityCalc.score,
      summary: aiResult.summary || 'Summary generated',
      sentiment: aiResult.sentiment || 'neutral',
      actionRequired: Boolean(aiResult.actionRequired),
      recommendedAction: aiResult.recommendedAction,
      deadline: aiResult.deadline,
      entities: aiResult.entities || [],
      priorityBreakdown: priorityCalc.breakdown,
      confidence: aiResult.confidence || 0.95,
      modelUsed: aiResult.modelUsed || 'gemini-3.7-flash',
      processedAt: new Date().toISOString(),
    };

    this.emails.unshift(newEmail);

    // Update account unread count
    const acc = this.getAccount(newEmail.accountId);
    if (acc) {
      acc.totalEmailsCount += 1;
      acc.unreadCount += 1;
      acc.lastSyncedAt = new Date().toISOString();
    }

    // Audit log
    this.logAudit({
      action: 'AI_ANALYSIS',
      details: `Analyzed incoming email "${newEmail.subject}" from ${newEmail.sender}: Score ${priorityCalc.score} (${priorityCalc.level})`,
      ipAddress: 'Pipeline Worker',
      status: 'success',
    });

    // Notification Decision Engine
    this.evaluateAndDispatchNotifications(newEmail);

    return newEmail;
  }

  updateEmail(id: string, updates: Partial<EmailMessage>): EmailMessage | undefined {
    const email = this.getEmail(id);
    if (!email) return undefined;
    Object.assign(email, updates, { updatedAt: new Date().toISOString() });
    return email;
  }

  // Notification Decision Engine with Quiet Hours & WhatsApp
  private evaluateAndDispatchNotifications(email: EmailMessage) {
    const priority = email.analysis?.priority || 'medium';
    const now = new Date();
    const currentHour = now.getHours();

    // Check quiet hours
    const isQuietHours =
      this.preferences.quietHoursEnabled && (currentHour >= 22 || currentHour < 7);

    // Deduplication key
    const existingRecent = this.deliveries.find(
      (d) =>
        d.emailId === email.id ||
        (d.sender === email.sender &&
          Date.now() - new Date(d.deliveredAt).getTime() < 10 * 60 * 1000)
    );

    if (existingRecent) {
      return; // Suppress duplicate notification
    }

    // WhatsApp Dispatch for Critical
    if (
      this.preferences.whatsappEnabled &&
      (priority === 'critical' || (priority === 'high' && this.preferences.whatsappThreshold === 'high'))
    ) {
      const delivery: NotificationDelivery = {
        id: `del-${Date.now()}-wa`,
        userId: 'user-001',
        emailId: email.id,
        emailSubject: email.subject,
        sender: email.senderName || email.sender,
        priority: priority,
        channel: 'whatsapp',
        status: isQuietHours && !this.preferences.allowCriticalInQuietHours ? 'suppressed_quiet_hours' : 'delivered',
        title: `🚨 [MailSentinel] ${priority.toUpperCase()} Alert`,
        body: `${email.subject}\nFrom: ${email.sender}\nSummary: ${email.analysis?.summary || 'Review required'}`,
        deliveredAt: new Date().toISOString(),
        metadata: {
          whatsappMessageId: `wamid.prod_${Date.now()}`,
          phone: this.preferences.whatsappPhoneNumber,
        },
      };
      this.deliveries.unshift(delivery);
      this.logAudit({
        action: 'NOTIFICATION_SENT',
        details: `Dispatched WhatsApp Alert to ${this.preferences.whatsappPhoneNumber} for ${email.id}`,
        ipAddress: 'Notification Engine',
        status: 'success',
      });
    }

    // Push Notification
    if (this.preferences.pushEnabled && (priority === 'critical' || priority === 'high')) {
      const pushDelivery: NotificationDelivery = {
        id: `del-${Date.now()}-push`,
        userId: 'user-001',
        emailId: email.id,
        emailSubject: email.subject,
        sender: email.senderName || email.sender,
        priority: priority,
        channel: 'push_fcm',
        status: isQuietHours && priority !== 'critical' ? 'suppressed_quiet_hours' : 'delivered',
        title: `${priority === 'critical' ? '🚨 Critical' : '⚡ High Priority'}: ${email.senderName || email.sender}`,
        body: email.analysis?.summary || email.subject,
        deliveredAt: new Date().toISOString(),
      };
      this.deliveries.unshift(pushDelivery);
    }
  }

  // Rules
  getRules(): UserRule[] {
    return this.rules;
  }

  addRule(rule: Omit<UserRule, 'id' | 'createdAt'>): UserRule {
    const newRule: UserRule = {
      ...rule,
      id: `rule-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.rules.push(newRule);
    this.logAudit({
      action: 'RULE_CREATED',
      details: `Created rule: "${newRule.name}" (${newRule.conditionType} -> ${newRule.actionType})`,
      ipAddress: '102.89.44.12',
      status: 'success',
    });
    return newRule;
  }

  deleteRule(id: string): boolean {
    const idx = this.rules.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    const removed = this.rules[idx];
    this.rules.splice(idx, 1);
    this.logAudit({
      action: 'RULE_DELETED',
      details: `Deleted rule: "${removed.name}"`,
      ipAddress: '102.89.44.12',
      status: 'success',
    });
    return true;
  }

  toggleRule(id: string): UserRule | undefined {
    const rule = this.rules.find((r) => r.id === id);
    if (!rule) return undefined;
    rule.isActive = !rule.isActive;
    this.logAudit({
      action: 'RULE_UPDATED',
      details: `Rule "${rule.name}" is now ${rule.isActive ? 'Active' : 'Disabled'}`,
      ipAddress: '102.89.44.12',
      status: 'success',
    });
    return rule;
  }

  // Notifications & Preferences
  getPreferences(): NotificationPreference {
    return this.preferences;
  }

  updatePreferences(updates: Partial<NotificationPreference>): NotificationPreference {
    Object.assign(this.preferences, updates);
    return this.preferences;
  }

  getDeliveries(): NotificationDelivery[] {
    return this.deliveries;
  }

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return this.auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'userId'>): AuditLogEntry {
    const log: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: 'user-001',
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
    // Keep max 500 logs
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return log;
  }

  // Devices
  getDevices(): DeviceInfo[] {
    return this.devices;
  }

  // Vector / Semantic Search simulation for RAG
  findRelevantEmails(query: string, limit = 5): EmailMessage[] {
    const qTokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    const scored = this.emails.map((email) => {
      let score = 0;
      const text = `${email.subject} ${email.sender} ${email.bodyText} ${email.analysis?.summary || ''} ${email.analysis?.entities.map((e) => e.value).join(' ') || ''}`.toLowerCase();

      for (const token of qTokens) {
        if (text.includes(token)) score += 2;
      }
      if (email.analysis?.priority === 'critical') score += 1.5;
      if (email.analysis?.priority === 'high') score += 1.0;

      return { email, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((item) => item.email);
  }
}

export const db = new MemoryDatabase();
