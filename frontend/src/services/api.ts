import type {
  User,
  AuthResponse,
  Question,
  InterviewSession,
  InterviewMessage,
  EvaluationReport,
  Diagram,
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function getAuthToken(): string | null {
  return localStorage.getItem('designo_access_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('designo_access_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('designo_access_token');
  localStorage.removeItem('designo_refresh_token');
}

export function saveAuthTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem('designo_access_token', accessToken);
  if (refreshToken) localStorage.setItem('designo_refresh_token', refreshToken);
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

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Cannot reach the Designo API at ${API_BASE}. Start the backend service, or set VITE_API_URL to its address.`);
    }
    throw error;
  }

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
  updateProfile: (data: Record<string, unknown>) => request<User>('/users/me', { method: 'PATCH', body: JSON.stringify(data) }),

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
  getBillingHistory: () => request<any>('/billing/history'),
  checkout: (plan: string) => request<any>('/billing/checkout', { method: 'POST', body: JSON.stringify({ plan }) }),
  logout: (refreshToken: string) => request<any>('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),

  // Diagrams
  generateDiagram: (data: { title: string; prompt: string; format?: string; interviewId?: string }) =>
    request<Diagram>('/diagrams/generate', { method: 'POST', body: JSON.stringify(data) }),
  reviewDiagram: (data: { diagramId: string; diagramCode?: string }) =>
    request<any>('/diagrams/review', { method: 'POST', body: JSON.stringify(data) }),
  getDiagrams: () => request<Diagram[]>('/diagrams'),
  getDiagram: (id: string) => request<Diagram>(`/diagrams/${id}`),
};
