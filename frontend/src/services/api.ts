import type {
  User,
  AuthResponse,
  Question,
  InterviewSession,
  InterviewMessage,
  EvaluationReport,
  Diagram,
} from '../types';

const API_BASE = 'http://localhost:3001';

export function getAuthToken(): string | null {
  return localStorage.getItem('designo_access_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('designo_access_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('designo_access_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorBody.message || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password?: string; fullName?: string; name?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { email: string; password?: string }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<User>('/users/me'),

  // Questions
  getQuestions: () => request<Question[]>('/questions'),

  // Interviews
  startInterview: (data: { questionId: string; difficulty: string; companyTrack: string }) =>
    request<InterviewSession>('/interviews/start', { method: 'POST', body: JSON.stringify(data) }),
  getInterview: (id: string) => request<InterviewSession>(`/interviews/${id}`),
  getInterviewHistory: () => request<InterviewSession[]>('/interviews/history'),
  sendInterviewMessage: (id: string, content: string) =>
    request<InterviewMessage>(`/interviews/${id}/message`, { method: 'POST', body: JSON.stringify({ content }) }),
  finishInterview: (id: string) =>
    request<{ success: boolean; evaluationId?: string }>(`/interviews/${id}/finish`, { method: 'POST' }),

  // Evaluations & Analytics
  generateEvaluation: (interviewId: string) =>
    request<EvaluationReport>('/evaluations/generate', { method: 'POST', body: JSON.stringify({ interviewId }) }),
  getEvaluation: (id: string) => request<EvaluationReport>(`/evaluations/${id}`),
  getAnalyticsDashboard: () => request<any>('/analytics/dashboard'),
  getAnalyticsProgress: () => request<any>('/analytics/progress'),
  getRecommendations: () => request<any>('/recommendations'),

  // Diagrams
  generateDiagram: (data: { title: string; prompt: string; format?: string; interviewId?: string }) =>
    request<Diagram>('/diagrams/generate', { method: 'POST', body: JSON.stringify(data) }),
  reviewDiagram: (data: { diagramId: string; diagramCode?: string }) =>
    request<any>('/diagrams/review', { method: 'POST', body: JSON.stringify(data) }),
  getDiagrams: () => request<Diagram[]>('/diagrams'),
  getDiagram: (id: string) => request<Diagram>(`/diagrams/${id}`),
};
