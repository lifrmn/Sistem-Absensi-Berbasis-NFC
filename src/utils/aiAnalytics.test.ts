import { describe, expect, it } from 'vitest';
import { analyzeAttendancePattern, generateMockRecentAttendance, predictStudentRisk } from './aiAnalytics';

describe('aiAnalytics', () => {
  it('should generate deterministic recent attendance', () => {
    const first = generateMockRecentAttendance(80);
    const second = generateMockRecentAttendance(80);

    expect(first).toEqual(second);
    expect(first).toHaveLength(5);
  });

  it('should classify high-risk students', () => {
    const pattern = analyzeAttendancePattern(2, 3, [false, false, true, false, false]);
    const risk = predictStudentRisk(40, [false, false, true, false, false], 5);

    expect(pattern.riskLevel).toBe('tinggi');
    expect(risk.riskLevel).toBe('tinggi');
    expect(risk.riskScore).toBeGreaterThanOrEqual(60);
  });
});
