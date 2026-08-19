import {
  EmailAccount,
  EmailMessage,
  UserRule,
  NotificationPreference,
  NotificationDelivery,
  AuditLogEntry,
  DailyDigest,
} from '../types';

export const INITIAL_ACCOUNTS: EmailAccount[] = [
  {
    id: 'acc-1',
    userId: 'user-001',
    provider: 'gmail',
    emailAddress: 'umar.imran.personal@gmail.com',
    displayName: 'Umar Imran (Personal)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    totalEmailsCount: 142,
    unreadCount: 4,
    lastSyncedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    watchExpiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    tokenExpiresAt: new Date(Date.now() + 3500 * 1000).toISOString(),
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    userId: 'user-001',
    provider: 'gmail',
    emailAddress: 'u.imran@university.edu.ng',
    displayName: 'Umar Imran (Academic / Research)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
    totalEmailsCount: 89,
    unreadCount: 2,
    lastSyncedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    watchExpiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    tokenExpiresAt: new Date(Date.now() + 3200 * 1000).toISOString(),
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'acc-3',
    userId: 'user-001',
    provider: 'outlook',
    emailAddress: 'umar.imran@sentinelcorp.io',
    displayName: 'Umar Imran (Sentinel Enterprise)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    scopes: ['Mail.Read', 'User.Read'],
    totalEmailsCount: 215,
    unreadCount: 3,
    lastSyncedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    tokenExpiresAt: new Date(Date.now() + 3000 * 1000).toISOString(),
    createdAt: '2026-02-01T11:15:00Z',
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'em-001',
    accountId: 'acc-1',
    accountEmail: 'umar.imran.personal@gmail.com',
    providerMessageId: 'msg-sec-9921',
    threadId: 'th-sec-9921',
    sender: 'security-alerts@firstbank.com',
    senderName: 'FirstBank Security Center',
    senderDomain: 'firstbank.com',
    recipients: ['umar.imran.personal@gmail.com'],
    subject: 'URGENT: Suspicious Login Attempt Detected on Online Banking',
    snippet: 'We detected an unrecognized login attempt from an unknown device in Bucharest, Romania at 03:14 AM.',
    bodyText: `Dear Valued Customer,

We detected an unrecognized sign-in attempt to your FirstBank Online Banking account from an IP address originating in Bucharest, Romania (IP: 185.220.101.5) on August 19, 2026 at 03:14 AM UTC.

Device: Linux x86_64 / Unknown Browser
Location: Bucharest, Romania

If this was NOT you, please immediately freeze your account or review your active sessions via the secure portal:
https://online.firstbank.com/security/verify?token=89f2a910d

Your account has been temporarily placed under high-alert surveillance. If no confirmation is received within 24 hours (August 20, 2026, 03:14 UTC), external wire transfers will be locked as a preventive measure.

FirstBank Cyber Fraud Protection Division
Direct Hotline: +1 (800) 555-0199`,
    receivedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    labels: ['INBOX', 'Security', 'Bank'],
    hasAttachment: false,
    folder: 'inbox',
    analysis: {
      emailId: 'em-001',
      category: 'security',
      priority: 'critical',
      priorityScore: 96,
      summary: 'FirstBank detected an unrecognized login attempt from Bucharest, Romania. External transfers will be locked within 24 hours if unverified.',
      sentiment: 'urgent',
      actionRequired: true,
      recommendedAction: 'Verify active sessions immediately and lock external transactions if unauthorized via FirstBank portal.',
      deadline: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
      entities: [
        { id: 'ent-1', type: 'deadline', value: 'August 20, 2026, 03:14 UTC', confidence: 0.98 },
        { id: 'ent-2', type: 'organization', value: 'FirstBank Cyber Fraud Protection Division', confidence: 0.99 },
        { id: 'ent-3', type: 'location', value: 'Bucharest, Romania', confidence: 0.96 },
        { id: 'ent-4', type: 'phone', value: '+1 (800) 555-0199', confidence: 0.95 },
        { id: 'ent-5', type: 'url', value: 'https://online.firstbank.com/security/verify', confidence: 0.99 },
      ],
      priorityBreakdown: {
        senderReputationScore: 24,
        urgencyIndicatorScore: 25,
        deadlineProximityScore: 24,
        contentImpactScore: 23,
        rulesAdjustment: 0,
        explanation: 'Critical security alert with immediate threat of account compromise and automated 24-hour wire transfer lockout.',
      },
      confidence: 0.98,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-002',
    accountId: 'acc-2',
    accountEmail: 'u.imran@university.edu.ng',
    providerMessageId: 'msg-acad-4410',
    threadId: 'th-acad-4410',
    sender: 'prof.adebayo@university.edu.ng',
    senderName: 'Prof. Olumide Adebayo',
    senderDomain: 'university.edu.ng',
    recipients: ['u.imran@university.edu.ng'],
    subject: 'Feedback on Dissertation Chapter 3 & Revised Submission Deadline',
    snippet: 'I have reviewed your draft on Neural Network Architectures. Several revisions are necessary before departmental defense.',
    bodyText: `Dear Umar,

I have completed the preliminary review of your Dissertation Chapter 3 ("Distributed Neural Architectures for Adversarial Detection"). 

Overall the mathematical formulation is solid, but you need to expand Section 3.4 regarding computational complexity and add the empirical benchmark charts against standard baselines.

Please implement these revisions and submit the revised manuscript no later than Friday, August 22, 2026 at 5:00 PM West Africa Time (WAT). The postgraduate review committee meets on Monday morning, so late submissions will not be considered for the September defense session.

Also, please bring 3 printed spiral-bound copies to Room 402 Department of Computer Science.

Best regards,
Prof. Olumide Adebayo, Ph.D.
Dean, Postgraduate Research Committee
University of Ibadan`,
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    isRead: false,
    isStarred: true,
    labels: ['INBOX', 'Academic', 'Thesis'],
    hasAttachment: true,
    folder: 'inbox',
    analysis: {
      emailId: 'em-002',
      category: 'academic',
      priority: 'high',
      priorityScore: 82,
      summary: 'Prof. Adebayo reviewed Chapter 3; requires expanded Section 3.4 complexity analysis & benchmark charts. Revised manuscript due Friday, Aug 22 at 5:00 PM WAT.',
      sentiment: 'urgent',
      actionRequired: true,
      recommendedAction: 'Update Section 3.4 with computational benchmarks and prepare 3 printed copies for Room 402 before Friday 5:00 PM.',
      deadline: '2026-08-22T17:00:00+01:00',
      entities: [
        { id: 'ent-6', type: 'deadline', value: '2026-08-22T17:00:00+01:00 (Friday 5:00 PM WAT)', confidence: 0.99 },
        { id: 'ent-7', type: 'person', value: 'Prof. Olumide Adebayo', confidence: 0.98 },
        { id: 'ent-8', type: 'organization', value: 'Postgraduate Research Committee, University of Ibadan', confidence: 0.97 },
        { id: 'ent-9', type: 'location', value: 'Room 402, Department of Computer Science', confidence: 0.94 },
        { id: 'ent-10', type: 'task', value: 'Expand Section 3.4 complexity and add benchmark charts', confidence: 0.96 },
      ],
      priorityBreakdown: {
        senderReputationScore: 23,
        urgencyIndicatorScore: 21,
        deadlineProximityScore: 20,
        contentImpactScore: 18,
        rulesAdjustment: 0,
        explanation: 'Academic supervisor feedback with strict deadline impacting degree completion and defense eligibility.',
      },
      confidence: 0.96,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 118 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-003',
    accountId: 'acc-3',
    accountEmail: 'umar.imran@sentinelcorp.io',
    providerMessageId: 'msg-car-7732',
    threadId: 'th-car-7732',
    sender: 'talent@techcorp-global.com',
    senderName: 'Sarah Jenkins (TechCorp Talent Acquisition)',
    senderDomain: 'techcorp-global.com',
    recipients: ['umar.imran@sentinelcorp.io'],
    subject: 'Invitation: Lead AI Architect Final Round Interview (Technical Panel)',
    snippet: 'Congratulations on passing the system design evaluation. We would like to invite you for the panel interview with our CTO.',
    bodyText: `Hi Umar,

Congratulations! The engineering evaluation team was thoroughly impressed with your system design submission for the Lead AI Architect role.

We would love to invite you to the final technical panel interview with:
- Dr. Elena Rostova (VP of Artificial Intelligence)
- Marcus Vance (Chief Technology Officer)

Proposed Time Slot:
Date: Monday, August 24, 2026
Time: 2:00 PM – 3:30 PM EST (7:00 PM – 8:30 PM WAT)
Meeting URL: https://meet.techcorp-global.com/interview/ai-lead-umar

Please confirm your availability by replying to this email or accepting the calendar invite before Thursday, August 21 at 12:00 PM EST.

Warm regards,
Sarah Jenkins
Senior Executive Talent Partner | TechCorp Global`,
    receivedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: true,
    labels: ['INBOX', 'Career', 'Interviews'],
    hasAttachment: false,
    folder: 'inbox',
    analysis: {
      emailId: 'em-003',
      category: 'career',
      priority: 'high',
      priorityScore: 79,
      summary: 'TechCorp invited you to the final round technical panel interview with CTO & VP AI for Lead AI Architect on Aug 24. Availability confirmation needed by Aug 21, 12:00 PM EST.',
      sentiment: 'positive',
      actionRequired: true,
      recommendedAction: 'Confirm availability for Monday Aug 24 2:00 PM EST interview slot before Thursday 12:00 PM EST.',
      deadline: '2026-08-21T12:00:00-05:00',
      entities: [
        { id: 'ent-11', type: 'deadline', value: 'August 21, 2026, 12:00 PM EST (Confirmation Deadline)', confidence: 0.99 },
        { id: 'ent-12', type: 'meeting', value: 'August 24, 2026, 2:00 PM – 3:30 PM EST', confidence: 0.98 },
        { id: 'ent-13', type: 'person', value: 'Sarah Jenkins, Dr. Elena Rostova, Marcus Vance', confidence: 0.97 },
        { id: 'ent-14', type: 'organization', value: 'TechCorp Global', confidence: 0.98 },
        { id: 'ent-15', type: 'url', value: 'https://meet.techcorp-global.com/interview/ai-lead-umar', confidence: 0.99 },
      ],
      priorityBreakdown: {
        senderReputationScore: 21,
        urgencyIndicatorScore: 20,
        deadlineProximityScore: 19,
        contentImpactScore: 19,
        rulesAdjustment: 0,
        explanation: 'Executive career milestone: final panel interview invitation with time-sensitive RSVP confirmation deadline.',
      },
      confidence: 0.97,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 235 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-004',
    accountId: 'acc-3',
    accountEmail: 'umar.imran@sentinelcorp.io',
    providerMessageId: 'msg-fin-3819',
    threadId: 'th-fin-3819',
    sender: 'billing@cloudscale-infra.io',
    senderName: 'CloudScale Infrastructure Billing',
    senderDomain: 'cloudscale-infra.io',
    recipients: ['umar.imran@sentinelcorp.io'],
    subject: 'Invoice #CS-2026-0891 ($3,450.00) Due on August 25, 2026',
    snippet: 'Your monthly enterprise GPU cluster & Redis cache invoice is now ready for settlement.',
    bodyText: `Dear Umar Imran,

Your monthly invoice for GPU Compute Cluster (8x H100 SXM5 instances) and High-Availability Managed Redis for project MailSentinel is now generated.

Invoice Number: CS-2026-0891
Billing Period: July 15, 2026 – August 15, 2026
Total Amount Due: $3,450.00 USD
Payment Due Date: August 25, 2026

Payment Method on File: Corporate Visa ending in 9812. Automatic charging will initiate on August 25.

View PDF Invoice & Itemized Usage:
https://billing.cloudscale-infra.io/invoices/CS-2026-0891

Thank you for choosing CloudScale Infrastructure.`,
    receivedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    labels: ['INBOX', 'Finance', 'Invoices'],
    hasAttachment: true,
    folder: 'inbox',
    analysis: {
      emailId: 'em-004',
      category: 'financial',
      priority: 'medium',
      priorityScore: 58,
      summary: 'CloudScale invoice #CS-2026-0891 for $3,450.00 USD generated for GPU & Redis usage. Auto-billing on August 25, 2026.',
      sentiment: 'neutral',
      actionRequired: false,
      recommendedAction: 'Verify corporate card balance before August 25 scheduled auto-billing.',
      deadline: '2026-08-25T00:00:00Z',
      entities: [
        { id: 'ent-16', type: 'amount', value: '$3,450.00 USD', confidence: 0.99 },
        { id: 'ent-17', type: 'invoice_number', value: 'CS-2026-0891', confidence: 0.99 },
        { id: 'ent-18', type: 'deadline', value: 'August 25, 2026 (Payment Due Date)', confidence: 0.96 },
        { id: 'ent-19', type: 'organization', value: 'CloudScale Infrastructure', confidence: 0.97 },
      ],
      priorityBreakdown: {
        senderReputationScore: 16,
        urgencyIndicatorScore: 12,
        deadlineProximityScore: 14,
        contentImpactScore: 16,
        rulesAdjustment: 0,
        explanation: 'Regular recurring enterprise invoice scheduled for auto-debit; no immediate manual action required unless billing dispute.',
      },
      confidence: 0.94,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 17.5 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-005',
    accountId: 'acc-1',
    accountEmail: 'umar.imran.personal@gmail.com',
    providerMessageId: 'msg-news-1122',
    threadId: 'th-news-1122',
    sender: 'digest@morningbrew.com',
    senderName: 'Morning Brew',
    senderDomain: 'morningbrew.com',
    recipients: ['umar.imran.personal@gmail.com'],
    subject: 'Markets rebound as AI hardware investments reach all-time peak ☕',
    snippet: 'Good morning! Today we cover the latest semiconductor quarterly filings, electric aviation milestones, and coffee bean futures.',
    bodyText: `Good morning! Grab your mug, here is what is shaping global commerce today:

1. AI Hardware Boom: Top chipmaker revenues jump 48% YoY driven by enterprise data center buildouts.
2. Aviation Electrification: First hybrid-electric regional flight conducts successful transatlantic crossing.
3. Market Summary: S&P 500 up +1.2%, Nasdaq up +1.6%.

Click here to read the full edition in your browser.`,
    receivedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: false,
    labels: ['INBOX', 'Newsletters'],
    hasAttachment: false,
    folder: 'inbox',
    analysis: {
      emailId: 'em-005',
      category: 'newsletter',
      priority: 'low',
      priorityScore: 18,
      summary: 'Daily newsletter covering semiconductor revenue jumps, electric aviation test flights, and US market gains.',
      sentiment: 'neutral',
      actionRequired: false,
      entities: [
        { id: 'ent-20', type: 'organization', value: 'Morning Brew', confidence: 0.98 },
      ],
      priorityBreakdown: {
        senderReputationScore: 5,
        urgencyIndicatorScore: 3,
        deadlineProximityScore: 0,
        contentImpactScore: 10,
        rulesAdjustment: 0,
        explanation: 'Informative daily business newsletter with zero direct obligations or urgent actions.',
      },
      confidence: 0.92,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 25.5 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'em-006',
    accountId: 'acc-1',
    accountEmail: 'umar.imran.personal@gmail.com',
    providerMessageId: 'msg-gov-5531',
    threadId: 'th-gov-5531',
    sender: 'noreply@passport-immigration.gov',
    senderName: 'National Immigration Portal',
    senderDomain: 'passport-immigration.gov',
    recipients: ['umar.imran.personal@gmail.com'],
    subject: 'Biometric Passport Renewal Ready for Collection (App ID: #NG-PASS-88421)',
    snippet: 'Your standard 64-page electronic passport application #NG-PASS-88421 has been produced and is ready for pickup.',
    bodyText: `Dear Umar Imran,

Your passport renewal application has been successfully finalized.

Application Reference: #NG-PASS-88421
Document: 64-Page 10-Year Electronic Smart Passport
Collection Center: Central Passport Office, Old Secretariat Complex, Zone 3
Collection Window: Monday to Friday, 9:00 AM – 3:30 PM

Requirements for Collection:
1. Printout of this notification email.
2. Original National Identity Slip (NIN).
3. Previous expired passport document.

Uncollected passports will be archived at headquarters after 60 days (October 18, 2026).`,
    receivedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    isRead: true,
    isStarred: true,
    labels: ['INBOX', 'Government', 'Passport'],
    hasAttachment: false,
    folder: 'inbox',
    analysis: {
      emailId: 'em-006',
      category: 'government',
      priority: 'high',
      priorityScore: 74,
      summary: '10-year electronic passport is ready for pickup at Central Passport Office Zone 3. Bring NIN slip and expired passport.',
      sentiment: 'positive',
      actionRequired: true,
      recommendedAction: 'Pick up newly produced passport with NIN slip and previous passport during weekday hours 9:00 AM – 3:30 PM.',
      entities: [
        { id: 'ent-21', type: 'application_number', value: '#NG-PASS-88421', confidence: 0.99 },
        { id: 'ent-22', type: 'location', value: 'Central Passport Office, Old Secretariat Complex, Zone 3', confidence: 0.97 },
        { id: 'ent-23', type: 'organization', value: 'National Immigration Portal', confidence: 0.98 },
        { id: 'ent-24', type: 'time', value: '9:00 AM – 3:30 PM Weekdays', confidence: 0.95 },
      ],
      priorityBreakdown: {
        senderReputationScore: 22,
        urgencyIndicatorScore: 18,
        deadlineProximityScore: 16,
        contentImpactScore: 18,
        rulesAdjustment: 0,
        explanation: 'Official government identity document completion notice with action required for collection.',
      },
      confidence: 0.95,
      modelUsed: 'gemini-3.7-flash',
      processedAt: new Date(Date.now() - 35.8 * 60 * 60 * 1000).toISOString(),
    },
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_RULES: UserRule[] = [
  {
    id: 'rule-1',
    userId: 'user-001',
    name: 'University Supervisor Priority Escalation',
    isActive: true,
    conditionType: 'sender_domain',
    conditionValue: 'university.edu.ng',
    actionType: 'set_priority',
    actionValue: 'high',
    priorityOverride: 'high',
    createdAt: '2026-01-16T10:00:00Z',
  },
  {
    id: 'rule-2',
    userId: 'user-001',
    name: 'Bank & Security Instant WhatsApp Alert',
    isActive: true,
    conditionType: 'subject_contains',
    conditionValue: 'Suspicious Login, Fraud, Security Alert, Verification Code',
    actionType: 'require_immediate_notification',
    actionValue: 'whatsapp',
    priorityOverride: 'critical',
    createdAt: '2026-01-20T14:30:00Z',
  },
  {
    id: 'rule-3',
    userId: 'user-001',
    name: 'Auto-Filter Promotional Marketing',
    isActive: true,
    conditionType: 'sender_domain',
    conditionValue: 'promo, marketing, discount, offers',
    actionType: 'set_priority',
    actionValue: 'low',
    priorityOverride: 'low',
    createdAt: '2026-02-05T09:15:00Z',
  },
];

export const INITIAL_PREFERENCES: NotificationPreference = {
  id: 'pref-1',
  userId: 'user-001',
  pushEnabled: true,
  whatsappEnabled: true,
  whatsappPhoneNumber: '+234 803 123 4567',
  whatsappThreshold: 'critical',
  webPushEnabled: true,
  dailyDigestEnabled: true,
  dailyDigestTime: '08:00',
  timezone: 'Africa/Lagos',
  quietHoursEnabled: true,
  quietHoursStart: '22:00',
  quietHoursEnd: '07:00',
  allowCriticalInQuietHours: true,
};

export const INITIAL_DELIVERIES: NotificationDelivery[] = [
  {
    id: 'del-001',
    userId: 'user-001',
    emailId: 'em-001',
    emailSubject: 'URGENT: Suspicious Login Attempt Detected on Online Banking',
    sender: 'FirstBank Security Center',
    priority: 'critical',
    channel: 'whatsapp',
    status: 'delivered',
    title: '🚨 CRITICAL SECURITY ALERT: FirstBank',
    body: 'Suspicious login detected from Bucharest, Romania. External transfers locked in 24h if unverified.',
    deliveredAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    metadata: {
      whatsappMessageId: 'wamid.HBgLMjM0ODAzMTIzNDU2NxUCABEYEjA5ODcyMUFDREQ5ODczMUIA',
      templateName: 'mailsentinel_critical_alert_v2',
    },
  },
  {
    id: 'del-002',
    userId: 'user-001',
    emailId: 'em-001',
    emailSubject: 'URGENT: Suspicious Login Attempt Detected on Online Banking',
    sender: 'FirstBank Security Center',
    priority: 'critical',
    channel: 'push_fcm',
    status: 'delivered',
    title: '🚨 Critical Email: Bank Security Alert',
    body: 'FirstBank detected an unrecognized login attempt from Bucharest, Romania.',
    deliveredAt: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
  },
  {
    id: 'del-003',
    userId: 'user-001',
    emailId: 'em-002',
    emailSubject: 'Feedback on Dissertation Chapter 3 & Revised Submission Deadline',
    sender: 'Prof. Olumide Adebayo',
    priority: 'high',
    channel: 'push_fcm',
    status: 'delivered',
    title: '⚡ Academic Deadline: Prof. Adebayo',
    body: 'Revised Chapter 3 manuscript due Friday, August 22 at 5:00 PM WAT.',
    deliveredAt: new Date(Date.now() - 117 * 60 * 1000).toISOString(),
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'aud-001',
    userId: 'user-001',
    action: 'LOGIN',
    details: 'User authenticated via Multi-Factor Session (IP: 102.89.44.12)',
    ipAddress: '102.89.44.12',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: 'aud-002',
    userId: 'user-001',
    action: 'AI_ANALYSIS',
    details: 'AI analyzed em-001: Priority score 96 (Critical security alert)',
    ipAddress: 'Internal Worker',
    timestamp: new Date(Date.now() - 41 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: 'aud-003',
    userId: 'user-001',
    action: 'NOTIFICATION_SENT',
    details: 'Dispatched WhatsApp Critical Template to +234 803 123 4567 for em-001',
    ipAddress: 'Internal Dispatcher',
    timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    status: 'success',
  },
  {
    id: 'aud-004',
    userId: 'user-001',
    action: 'OAUTH_CONNECT',
    details: 'Connected Outlook Enterprise account: umar.imran@sentinelcorp.io (Scopes: Mail.Read, User.Read)',
    ipAddress: '102.89.44.12',
    timestamp: '2026-02-01T11:15:00Z',
    status: 'success',
  },
  {
    id: 'aud-005',
    userId: 'user-001',
    action: 'TOKEN_REFRESH',
    details: 'Automated token rotation for account acc-1 (Gmail Personal)',
    ipAddress: 'Token Refresh Service',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    status: 'success',
  },
];
