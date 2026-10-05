export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Staff';

export type CompanyTrack = 'Google' | 'Meta' | 'Amazon' | 'Netflix' | 'Stripe' | 'Uber' | 'Apple' | 'OpenAI';

export interface UserProfile {
  experienceLevel?: string;
  position?: string;
  years?: number;
  targetCompany?: string;
  targetLevel?: string;
  focusAreas?: string[];
}

export interface User {
  id?: string;
  fullName?: string;
  name?: string;
  email: string;
  tier?: string;
  avatar?: string;
  role?: string;
  profile?: UserProfile;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Question {
  id: string;
  title: string;
  difficulty: Difficulty | string;
  companyTrack?: string;
  category?: string;
  summary?: string;
  recommendedTime?: string;
  completionsCount?: number;
  avgScore?: number;
  tags?: string[];
}

export interface InterviewMessage {
  id: string;
  sender: 'ai' | 'user' | 'system';
  stage?: string;
  content: string;
  timestamp: string;
  scoreDelta?: string;
}

export interface InterviewSession {
  id: string;
  questionId: string;
  title?: string;
  difficulty: string;
  companyTrack: string;
  score?: number;
  verdict?: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire';
  duration?: string;
  date?: string;
  messages?: InterviewMessage[];
  status?: 'active' | 'completed' | 'abandoned';
}

export interface CategoryScore {
  name: string;
  score: number;
  weight: number | string;
  status: string;
}

export interface EvaluationReport {
  id: string;
  interviewId: string;
  candidateName: string;
  targetRole: string;
  track: string;
  overallScore: number;
  verdict: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire';
  categoryScores: CategoryScore[];
  strengths: string[];
  areasToImprove: string[];
  recommendedTopics: string[];
  createdAt: string;
}

export interface Diagram {
  id: string;
  title: string;
  prompt: string;
  format?: string;
  code?: string;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  unread: boolean;
  title: string;
  desc: string;
  time: string;
  type?: 'eval' | 'milestone' | 'reminder' | 'digest';
}

export interface AuditLogEntry {
  id?: string;
  action: string;
  detail: string;
  timestamp: string;
  category?: string;
}
