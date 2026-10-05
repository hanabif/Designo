import { useState, useEffect } from 'react';
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
import { api, removeAuthToken } from './services/api';
import type { User, Question, UserProfile } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState<string | null>(null);

  useEffect(() => {
    api
      .getMe()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    removeAuthToken();
    setUser(null);
    setActiveTab('landing');
  };

  const handleBeginInterview = async (questionId: string, difficulty: string, companyTrack: string) => {
    try {
      const interview = await api.startInterview({ questionId, difficulty, companyTrack });
      setActiveInterviewId(interview.id);
      setActiveTab('interview');
    } catch {
      // Fallback mock launch for instant interactive demo
      const mockId = `session-${Date.now()}`;
      setActiveInterviewId(mockId);
      setActiveTab('interview');
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
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenSetupModal={() => setIsSetupModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {activeTab === 'landing' && (
          <HeroLanding
            onStartInterview={() => {
              if (!user) setIsAuthOpen(true);
              else setActiveTab('onboarding');
            }}
            onExploreQuestions={() => setActiveTab('questions')}
            onSelectPricing={() => setActiveTab('billing')}
          />
        )}

        {activeTab === 'onboarding' && (
          <OnboardingView
            onComplete={(profile: UserProfile) => {
              setUser((prev) => (prev ? { ...prev, profile } : { email: 'candidate@designo.ai', profile }));
              setActiveTab('dashboard');
            }}
            onSkip={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView
            user={user}
            onStartNewInterview={() => setIsSetupModalOpen(true)}
            onNavigateTab={setActiveTab}
            onOpenSetupModal={() => setIsSetupModalOpen(true)}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView
            onSelectQuestion={(qId, diff, track) => {
              handleBeginInterview(qId, diff, track);
            }}
          />
        )}

        {activeTab === 'interview' && (
          <InterviewRunnerView
            interviewId={activeInterviewId || 'session-demo-1'}
            onFinish={() => setActiveTab('report')}
          />
        )}

        {activeTab === 'report' && (
          <EvaluationReportView
            onReplay={() => setActiveTab('interview')}
            onNavigateRoadmap={() => setActiveTab('roadmap')}
          />
        )}

        {activeTab === 'diagrams' && <DiagramStudioView />}

        {activeTab === 'analytics' && <AnalyticsDashboardView />}

        {activeTab === 'roadmap' && <LearningRoadmapView />}

        {activeTab === 'billing' && <BillingView user={user} />}

        {activeTab === 'admin' && <AdminPanelView user={user} />}
      </main>

      {/* Global Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setActiveTab('onboarding');
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
