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
  register: (data: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request<any>('/users/me'),

  // Questions
  getQuestions: () => request<any[]>('/questions'),

  // Interviews
  startInterview: (data: { questionId: string; difficulty: string; companyTrack: string }) =>
    request<any>('/interviews/start', { method: 'POST', body: JSON.stringify(data) }),
  getInterview: (id: string) => request<any>(`/interviews/${id}`),
  getInterviewHistory: () => request<any[]>('/interviews/history'),
  sendInterviewMessage: (id: string, content: string) =>
    request<any>(`/interviews/${id}/message`, { method: 'POST', body: JSON.stringify({ content }) }),
  finishInterview: (id: string) =>
    request<any>(`/interviews/${id}/finish`, { method: 'POST' }),

  // Evaluations & Analytics
  generateEvaluation: (interviewId: string) =>
    request<any>('/evaluations/generate', { method: 'POST', body: JSON.stringify({ interviewId }) }),
  getEvaluation: (id: string) => request<any>(`/evaluations/${id}`),
  getAnalyticsDashboard: () => request<any>('/analytics/dashboard'),
  getAnalyticsProgress: () => request<any>('/analytics/progress'),
  getRecommendations: () => request<any>('/recommendations'),

  // Diagrams
  generateDiagram: (data: { title: string; prompt: string; format?: string; interviewId?: string }) =>
    request<any>('/diagrams/generate', { method: 'POST', body: JSON.stringify(data) }),
  reviewDiagram: (data: { diagramId: string; diagramCode?: string }) =>
    request<any>('/diagrams/review', { method: 'POST', body: JSON.stringify(data) }),
  getDiagrams: () => request<any[]>('/diagrams'),
  getDiagram: (id: string) => request<any>(`/diagrams/${id}`),
};
