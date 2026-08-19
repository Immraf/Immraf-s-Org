export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low' | 'informational';

export type EmailCategory =
  | 'security'
  | 'financial'
  | 'academic'
  | 'career'
  | 'business'
  | 'personal'
  | 'government'
  | 'shopping'
  | 'travel'
  | 'marketing'
  | 'newsletter'
  | 'social'
  | 'notification'
  | 'spam'
  | 'other';

export type AccountProvider = 'gmail' | 'outlook';

export type AccountStatus = 'active' | 'syncing' | 'needs_reauth' | 'disabled' | 'error';

export type ActionPermissionLevel = 'LEVEL_1_READ' | 'LEVEL_2_RECOMMEND' | 'LEVEL_3_EXECUTE' | 'LEVEL_4_LIMITED_AUTOMATION';

export interface EmailAccount {
  id: string;
  userId: string;
  provider: AccountProvider;
  emailAddress: string;
  displayName: string;
  avatarUrl?: string;
  status: AccountStatus;
  scopes: string[];
  totalEmailsCount: number;
  unreadCount: number;
  lastSyncedAt: string;
  watchExpiresAt?: string;
  tokenExpiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExtractedEntity {
  id: string;
  type:
    | 'deadline'
    | 'date'
    | 'time'
    | 'amount'
    | 'currency'
    | 'person'
    | 'organization'
    | 'phone'
    | 'location'
    | 'url'
    | 'invoice_number'
    | 'tracking_number'
    | 'order_number'
    | 'application_number'
    | 'meeting'
    | 'task';
  value: string;
  confidence: number;
  metadata?: Record<string, any>;
}

export interface PriorityBreakdown {
  senderReputationScore: number; // 0-25
  urgencyIndicatorScore: number; // 0-25
  deadlineProximityScore: number; // 0-25
  contentImpactScore: number; // 0-25 (financial/security/academic criticality)
  rulesAdjustment: number; // +/- score based on user rules
  explanation: string;
}

export interface AIAnalysis {
  emailId: string;
  category: EmailCategory;
  priority: PriorityLevel;
  priorityScore: number; // 0-100
  summary: string;
  sentiment: 'urgent' | 'positive' | 'neutral' | 'negative';
  actionRequired: boolean;
  recommendedAction?: string;
  deadline?: string;
  entities: ExtractedEntity[];
  priorityBreakdown: PriorityBreakdown;
  confidence: number;
  modelUsed: string;
  processedAt: string;
}

export interface EmailMessage {
  id: string;
  accountId: string;
  accountEmail: string;
  providerMessageId: string;
  threadId: string;
  sender: string;
  senderName: string;
  senderDomain: string;
  recipients: string[];
  cc?: string[];
  bcc?: string[];
  subject: string;
  bodyText: string;
  bodyHtml?: string;
  snippet: string;
  receivedAt: string;
  isRead: boolean;
  isStarred?: boolean;
  isArchived?: boolean;
  labels: string[];
  hasAttachment: boolean;
  folder: 'inbox' | 'archive' | 'trash' | 'spam';
  analysis?: AIAnalysis;
  createdAt: string;
  updatedAt: string;
}

export interface UserRule {
  id: string;
  userId: string;
  name: string;
  isActive: boolean;
  conditionType: 'sender_domain' | 'sender_email' | 'subject_contains' | 'body_contains' | 'has_deadline';
  conditionValue: string;
  actionType: 'set_priority' | 'set_category' | 'require_immediate_notification' | 'auto_archive_newsletter' | 'mark_critical';
  actionValue: string;
  priorityOverride?: PriorityLevel;
  createdAt: string;
}

export interface NotificationPreference {
  id: string;
  userId: string;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  whatsappPhoneNumber: string;
  whatsappThreshold: PriorityLevel; // 'critical' or 'high'
  webPushEnabled: boolean;
  dailyDigestEnabled: boolean;
  dailyDigestTime: string; // "08:00"
  timezone: string; // e.g. "America/New_York", "Africa/Lagos", "Europe/London"
  quietHoursEnabled: boolean;
  quietHoursStart: string; // "22:00"
  quietHoursEnd: string; // "07:00"
  allowCriticalInQuietHours: boolean;
}

export interface NotificationDelivery {
  id: string;
  userId: string;
  emailId: string;
  emailSubject: string;
  sender: string;
  priority: PriorityLevel;
  channel: 'push_fcm' | 'whatsapp' | 'web_push' | 'daily_digest';
  status: 'delivered' | 'pending' | 'suppressed_quiet_hours' | 'failed';
  title: string;
  body: string;
  deliveredAt: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface DeviceInfo {
  id: string;
  userId: string;
  deviceType: 'android' | 'ios' | 'web_browser';
  deviceName: string;
  pushToken: string;
  lastSeenAt: string;
  isActive: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  action:
    | 'LOGIN'
    | 'LOGOUT'
    | 'OAUTH_CONNECT'
    | 'OAUTH_DISCONNECT'
    | 'TOKEN_REFRESH'
    | 'ACCOUNT_REAUTH_REQUIRED'
    | 'EMAIL_ACTION'
    | 'AI_ANALYSIS'
    | 'RULE_CREATED'
    | 'RULE_UPDATED'
    | 'RULE_DELETED'
    | 'NOTIFICATION_SENT'
    | 'DATA_DELETED'
    | 'RAG_QUERY'
    | 'SECURITY_EVENT';
  details: string;
  ipAddress: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  metadata?: Record<string, any>;
}

export interface DailyDigest {
  id: string;
  userId: string;
  date: string;
  totalReceived: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  topPriorities: {
    emailId: string;
    subject: string;
    sender: string;
    priority: PriorityLevel;
    summary: string;
    recommendedAction?: string;
  }[];
  upcomingDeadlines: {
    task: string;
    date: string;
    sourceEmailSubject: string;
    emailId: string;
  }[];
  executiveSummary: string;
  generatedAt: string;
}

export interface RagAskResponse {
  answer: string;
  confidence: number;
  citedEmails: {
    emailId: string;
    subject: string;
    sender: string;
    receivedAt: string;
    relevanceSnippet: string;
    priority: PriorityLevel;
  }[];
  suggestedFollowUps: string[];
}
