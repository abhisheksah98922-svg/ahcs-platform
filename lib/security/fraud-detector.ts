/**
 * AHCS Fraud & Abuse Risk Signal Engine
 * Analyzes velocity bursts, abnormal token query scans, and suspicious patterns.
 * Flags events for human officer adjudication without unfair automated lockouts.
 */

import { db } from '@/lib/db/store';
import { FraudAlertRecord } from '@/lib/db/types';

export interface FraudAnalysisResult {
  isSuspicious: boolean;
  riskScore: number; // 0 to 100
  reasons: string[];
  alertCreated?: FraudAlertRecord;
}

export function evaluateQrScanRisk(tokenId: string, currentIp: string | null): FraudAnalysisResult {
  const auditLogs = db.getAuditLogsByTarget('CARD', tokenId);
  const now = Date.now();
  const recentWindowMs = 60 * 1000; // 1 minute window

  // Count scans in the past minute from different IPs
  const recentScans = auditLogs.filter(
    l => l.action === 'EMERGENCY_ACCESS_TRIGGERED' && now - new Date(l.createdAt).getTime() < recentWindowMs
  );

  const reasons: string[] = [];
  let riskScore = 0;

  if (recentScans.length > 5) {
    riskScore += 40;
    reasons.push(`High scan velocity: ${recentScans.length} scans detected in under 60 seconds`);
  }

  const distinctIps = new Set(recentScans.map(s => s.ipAddress).filter(Boolean));
  if (currentIp) distinctIps.add(currentIp);

  if (distinctIps.size >= 3) {
    riskScore += 45;
    reasons.push(`Distributed geographic pattern: ${distinctIps.size} distinct IP addresses querying token simultaneously`);
  }

  const isSuspicious = riskScore >= 50;

  let alert: FraudAlertRecord | undefined;
  if (isSuspicious) {
    alert = db.createFraudAlert({
      targetType: 'QR_SCAN',
      targetId: tokenId,
      riskScore,
      reasons,
      status: 'OPEN',
    });
  }

  return {
    isSuspicious,
    riskScore,
    reasons,
    alertCreated: alert,
  };
}

export function evaluateFailedPaymentRisk(accountId: string): FraudAnalysisResult {
  const orders = db.getPaymentOrdersByAccountId(accountId);
  const failedOrders = orders.filter(o => o.status === 'FAILED');

  const reasons: string[] = [];
  let riskScore = 0;

  if (failedOrders.length >= 3) {
    riskScore = Math.min(90, failedOrders.length * 20);
    reasons.push(`Multiple consecutive payment transaction failures (${failedOrders.length} failed orders)`);
  }

  const isSuspicious = riskScore >= 50;

  let alert: FraudAlertRecord | undefined;
  if (isSuspicious) {
    alert = db.createFraudAlert({
      targetType: 'PAYMENT',
      targetId: accountId,
      riskScore,
      reasons,
      status: 'OPEN',
    });
  }

  return {
    isSuspicious,
    riskScore,
    reasons,
    alertCreated: alert,
  };
}
