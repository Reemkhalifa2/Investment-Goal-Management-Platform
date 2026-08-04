<<<<<<< HEAD
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

/**
 * Sent to POST /api/financial-goals
 * Matches FinancialGoalDTO fields required on create.
 */
=======
export type GoalStatus =
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED';

export type GoalRiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

>>>>>>> c77d725ff7104984766e81c3ee35687b2364b2f3
export interface investmentGoalRequest {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
<<<<<<< HEAD
  targetDate: string; // ISO date, e.g. "2032-08-01"
  status: string;
  riskLevel: RiskLevel;
  userId: number;
}

/**
 * Returned by the backend after saving/fetching.
 */
export interface investmentGoalResponse extends investmentGoalRequest {
  id: number;
  progressPercentage: number;
=======
  targetDate: string;
  status: GoalStatus;
  riskLevel: GoalRiskLevel;
  userId: number;
}

export interface investmentGoalResponse {
  id: number;
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: GoalStatus;
  riskLevel: GoalRiskLevel;
  userId: number;
  progressPercentage?: number;
>>>>>>> c77d725ff7104984766e81c3ee35687b2364b2f3
}