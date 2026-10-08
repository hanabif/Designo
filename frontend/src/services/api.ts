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

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Exchange the stored refresh token for a fresh access token (the backend
 * rotates refresh tokens). Single-flight: concurrent 401s share one refresh
 * request so parallel callers don't invalidate each other's rotation.
 */
let refreshPromise: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = localStorage.getItem('designo_refresh_token');
      if (!refreshToken) throw new ApiError('Session expired', 401);

      let res: Response;
      try {
        res = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        if (error instanceof TypeError) {
          throw new ApiError(`Cannot reach the Designo API at ${API_BASE}. Start the backend service, or set VITE_API_URL to its address.`, 0);
        }
        throw error;
      }

      if (res.status === 400 || res.status === 401) {
        // Refresh token revoked/expired: the session is truly over.
        removeAuthToken();
        throw new ApiError('Session expired', 401);
      }
      if (!res.ok) throw new ApiError('Session refresh failed', res.status);

      const data = await res.json();
      saveAuthTokens(data.accessToken, data.refreshToken);
      return data.accessToken as string;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });

    // Expired access token? Refresh once and retry the original request.
    if (
      res.status === 401 &&
      !endpoint.startsWith('/auth/') &&
      localStorage.getItem('designo_refresh_token')
    ) {
      try {
        const newToken = await refreshSession();
        headers['Authorization'] = `Bearer ${newToken}`;
        res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      } catch {
        // Fall through: the original 401 response is handled below.
      }
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new ApiError(`Cannot reach the Designo API at ${API_BASE}. Start the backend service, or set VITE_API_URL to its address.`, 0);
    }
    throw error;
  }

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: 'Request failed' }));
    const message = Array.isArray(errorBody.message)
      ? errorBody.message.join(', ')
      : errorBody.message || `HTTP ${res.status}`;
    throw new ApiError(message, res.status);
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
