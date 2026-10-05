import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { NotificationsModal } from './components/NotificationsModal';
import { InterviewSetupModal } from './components/InterviewSetupModal';
import { HeroLanding } from './components/HeroLanding';
import { OnboardingView } from './components/OnboardingView';
import { DashboardView } from './components/DashboardView';
import { QuestionBankView } from './components/QuestionBankView';
import { InterviewRunnerView } from './components/InterviewRunnerView';
import { EvaluationReportView } from './components/EvaluationReportView';
import { DiagramStudioView } from './components/DiagramStudioView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { BillingView } from './components/BillingView';
import { AdminPanelView } from './components/AdminPanelView';
import { NotFoundView } from './components/NotFoundView';
import { api, removeAuthToken } from './services/api';
import type { User, Question } from './types';

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    navigate('/');
  };

  const handleBeginInterview = async (questionId: string, difficulty: string, companyTrack: string) => {
    try {
      const interview = await api.startInterview({ questionId, difficulty, companyTrack });
      navigate(`/interview/${interview.id}`);
    } catch {
      // Fallback mock launch for instant interactive demo
      const mockId = `session-${Date.now()}`;
      navigate(`/interview/${mockId}`);
    }
  };

  const sampleQuestions: Question[] = [
    { id: 'q1', title: 'Design URL Shortener (TinyURL)', difficulty: 'Beginner', companyTrack: 'Google', category: 'Core Distributed' },
    { id: 'q2', title: 'Design Twitter / X News Feed', difficulty: 'Intermediate', companyTrack: 'Meta', category: 'High QPS & Social' },
    { id: 'q3', title: 'Design Uber / Real-Time Dispatch System', difficulty: 'Advanced', companyTrack: 'Uber', category: 'Geo & Real-Time' },
    { id: 'q4', title: 'Design Global CDN & Distributed Cache', difficulty: 'Staff', companyTrack: 'Netflix', category: 'Infra & Edge' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#faf9fe] text-[#0a0a0f] selection:bg-[#ede9fe] selection:text-[#6b38d4]">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HeroLanding
            onStartInterview={() => {
              if (!user) setIsAuthOpen(true);
              else navigate('/onboarding');
            }}
            onExploreQuestions={() => navigate('/questions')}
            onSelectPricing={() => navigate('/billing')}
          />} />

          <Route path="/onboarding" element={<OnboardingView
            onComplete={(profile) => {
              setUser((prev) => (prev ? { ...prev, profile } : { email: 'candidate@designo.ai', profile }));
              navigate('/dashboard');
            }}
            onSkip={() => navigate('/dashboard')}
          />} />

          <Route path="/dashboard" element={<DashboardView user={user} onOpenSetupModal={() => setIsSetupModalOpen(true)} />} />

          <Route path="/questions" element={<QuestionBankView
            onSelectQuestion={(qId, diff, track) => handleBeginInterview(qId, diff, track)}
          />} />

          <Route path="/interview" element={<InterviewRunnerView />} />
          <Route path="/interview/:interviewId" element={<InterviewRunnerView />} />

          <Route path="/report" element={<EvaluationReportView />} />

          <Route path="/diagrams" element={<DiagramStudioView />} />

          <Route path="/analytics" element={<AnalyticsDashboardView />} />

          <Route path="/roadmap" element={<LearningRoadmapView />} />

          <Route path="/billing" element={<BillingView user={user} />} />

          <Route path="/admin" element={<AdminPanelView user={user} />} />

          {/* Redirect legacy hash-based paths */}
          <Route path="/landing" element={<Navigate to="/" replace />} />

          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          navigate('/onboarding');
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />

      <InterviewSetupModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onBegin={handleBeginInterview}
        questions={sampleQuestions}
      />
    </div>
  );
}

export default App;
