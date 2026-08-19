import { PriorityBreakdown, PriorityLevel, UserRule } from '../src/types';

export interface PriorityCalculationResult {
  score: number;
  level: PriorityLevel;
  breakdown: PriorityBreakdown;
}

export function calculateExplainablePriority(
  subject: string,
  sender: string,
  body: string,
  category: string,
  userRules: UserRule[] = [],
  deadline?: string
): PriorityCalculationResult {
  const text = `${subject} ${body} ${sender}`.toLowerCase();

  // 1. Sender Reputation Score (0 - 25)
  let senderScore = 12;
  if (sender.includes('.gov') || sender.includes('security') || sender.includes('bank')) {
    senderScore = 24;
  } else if (sender.includes('.edu') || sender.includes('university') || sender.includes('prof')) {
    senderScore = 23;
  } else if (sender.includes('talent') || sender.includes('recruit') || sender.includes('careers')) {
    senderScore = 21;
  } else if (sender.includes('billing') || sender.includes('invoice') || sender.includes('payments')) {
    senderScore = 17;
  } else if (sender.includes('promo') || sender.includes('newsletter') || sender.includes('marketing')) {
    senderScore = 4;
  }

  // 2. Urgency Indicator Score (0 - 25)
  let urgencyScore = 10;
  if (
    text.includes('urgent') ||
    text.includes('immediate') ||
    text.includes('action required') ||
    text.includes('lockout') ||
    text.includes('compromise') ||
    text.includes('freeze')
  ) {
    urgencyScore = 25;
  } else if (
    text.includes('deadline') ||
    text.includes('asap') ||
    text.includes('due date') ||
    text.includes('rsvp') ||
    text.includes('confirm availability')
  ) {
    urgencyScore = 20;
  } else if (text.includes('upcoming') || text.includes('meeting') || text.includes('reminder')) {
    urgencyScore = 14;
  } else if (text.includes('weekly digest') || text.includes('newsletter') || text.includes('roundup')) {
    urgencyScore = 3;
  }

  // 3. Deadline Proximity Score (0 - 25)
  let deadlineScore = 0;
  if (deadline) {
    deadlineScore = 22;
  } else if (text.includes('today') || text.includes('24 hours') || text.includes('within 24h')) {
    deadlineScore = 24;
  } else if (text.includes('friday') || text.includes('tomorrow') || text.includes('before')) {
    deadlineScore = 18;
  } else if (text.includes('next week') || text.includes('scheduled')) {
    deadlineScore = 12;
  }

  // 4. Content Impact Score (0 - 25)
  let impactScore = 10;
  if (category === 'security') {
    impactScore = 25;
  } else if (category === 'financial' && (text.includes('fraud') || text.includes('suspicious') || text.includes('failed'))) {
    impactScore = 24;
  } else if (category === 'academic' || category === 'career') {
    impactScore = 20;
  } else if (category === 'government') {
    impactScore = 19;
  } else if (category === 'financial') {
    impactScore = 16;
  } else if (category === 'newsletter' || category === 'marketing' || category === 'social') {
    impactScore = 3;
  }

  // 5. User Rules Adjustment & Overrides
  let rulesAdjustment = 0;
  let ruleTriggeredName: string | null = null;
  let ruleForcedPriority: PriorityLevel | null = null;

  for (const rule of userRules) {
    if (!rule.isActive) continue;

    let matched = false;
    if (rule.conditionType === 'sender_domain' && sender.toLowerCase().includes(rule.conditionValue.toLowerCase())) {
      matched = true;
    } else if (rule.conditionType === 'sender_email' && sender.toLowerCase() === rule.conditionValue.toLowerCase()) {
      matched = true;
    } else if (rule.conditionType === 'subject_contains') {
      const keywords = rule.conditionValue.split(',').map((k) => k.trim().toLowerCase());
      if (keywords.some((k) => subject.toLowerCase().includes(k))) {
        matched = true;
      }
    } else if (rule.conditionType === 'has_deadline' && deadline) {
      matched = true;
    }

    if (matched) {
      ruleTriggeredName = rule.name;
      if (rule.actionType === 'set_priority' || rule.actionType === 'mark_critical') {
        ruleForcedPriority = rule.priorityOverride || (rule.actionType === 'mark_critical' ? 'critical' : 'high');
      } else if (rule.actionType === 'require_immediate_notification') {
        rulesAdjustment += 20;
      }
    }
  }

  // Calculate raw sum (0 - 100)
  let rawScore = senderScore + urgencyScore + deadlineScore + impactScore + rulesAdjustment;
  rawScore = Math.min(100, Math.max(0, rawScore));

  // Determine Level from bands
  let level: PriorityLevel;
  if (ruleForcedPriority) {
    level = ruleForcedPriority;
    if (level === 'critical') rawScore = Math.max(88, rawScore);
    if (level === 'high') rawScore = Math.max(68, rawScore);
  } else {
    if (rawScore >= 85) {
      level = 'critical';
    } else if (rawScore >= 65) {
      level = 'high';
    } else if (rawScore >= 35) {
      level = 'medium';
    } else if (rawScore >= 10) {
      level = 'low';
    } else {
      level = 'informational';
    }
  }

  let explanation = `Evaluated with sender reputation (${senderScore}/25), urgency indicators (${urgencyScore}/25), deadline proximity (${deadlineScore}/25), and content impact (${impactScore}/25).`;
  if (ruleTriggeredName) {
    explanation += ` Matched user rule "${ruleTriggeredName}".`;
  }

  return {
    score: rawScore,
    level,
    breakdown: {
      senderReputationScore: senderScore,
      urgencyIndicatorScore: urgencyScore,
      deadlineProximityScore: deadlineScore,
      contentImpactScore: impactScore,
      rulesAdjustment,
      explanation,
    },
  };
}
