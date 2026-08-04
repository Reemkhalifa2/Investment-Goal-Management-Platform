export type GoalStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type GoalRiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Sent to POST /api/financial-goals
 * Matches FinancialGoalDTO fields required on create.
 */
export interface investmentGoalRequest {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // ISO date, e.g. "2032-08-01"
  status: GoalStatus;
  riskLevel: GoalRiskLevel;
  userId: number;
}

/**
 * Returned by the backend after saving/fetching.
 */
export interface investmentGoalResponse extends investmentGoalRequest {
  id: number;
  progressPercentage: number;
}