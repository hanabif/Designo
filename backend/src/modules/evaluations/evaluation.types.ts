export const EVALUATION_QUEUE = 'evaluation';
export const EVALUATION_JOB = 'generate-evaluation';

export interface EvaluationResult {
  overallScore: number;
  requirementsScore: number;
  architectureScore: number;
  scalabilityScore: number;
  databaseDesignScore: number;
  reliabilityScore: number;
  securityScore: number;
  costAwarenessScore: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}
