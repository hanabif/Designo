import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { HeroLanding } from './components/HeroLanding';
import { QuestionBankView } from './components/QuestionBankView';
import { InterviewRunnerView } from './components/InterviewRunnerView';
import { DiagramStudioView } from './components/DiagramStudioView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { LearningRoadmapView } from './components/LearningRoadmapView';
import { api, removeAuthToken } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
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
  };

  const handleSelectQuestion = async (questionId: string, difficulty: string, companyTrack: string) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }

    try {
      const interview = await api.startInterview({ questionId, difficulty, companyTrack });
      setActiveInterviewId(interview.id);
      setActiveTab('interview');
    } catch {
      // Mock session launch if API fails
      const mockId = `int-${Date.now()}`;
      setActiveInterviewId(mockId);
      setActiveTab('interview');
    }
  };

  const handleFinishInterview = async (interviewId: string) => {
    setActiveTab('analytics');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'landing' && (
          <HeroLanding
            onStartInterview={() => {
              if (!user) setIsAuthOpen(true);
              else setActiveTab('questions');
            }}
            onExploreQuestions={() => setActiveTab('questions')}
          />
        )}

        {activeTab === 'questions' && (
          <QuestionBankView onSelectQuestion={handleSelectQuestion} />
        )}

        {activeTab === 'interview' && (
          <InterviewRunnerView
            interviewId={activeInterviewId || 'demo-session-1'}
            onFinish={handleFinishInterview}
          />
        )}

        {activeTab === 'diagrams' && <DiagramStudioView />}

        {activeTab === 'analytics' && <AnalyticsDashboardView />}

        {activeTab === 'roadmap' && <LearningRoadmapView />}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          setActiveTab('questions');
        }}
      />

      {/* Footer */}
      <footer
        style={{
          backgroundColor: 'var(--color-canvas)',
          borderTop: '1px solid var(--color-hairline)',
          padding: '40px 0',
          marginTop: 'auto',
          fontSize: '14px',
          color: 'var(--color-body)',
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ color: 'var(--color-ink)' }}>Designo AI System Design Coach</strong>
            <p style={{ fontSize: '13px', color: 'var(--color-muted)', marginTop: '4px' }}>
              Built for software engineers preparing for Tier-1 Tech System Design Interviews.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', fontSize: '13px' }}>
            <a href="#questions" onClick={() => setActiveTab('questions')} style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Questions</a>
            <a href="#interview" onClick={() => setActiveTab('interview')} style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Simulator</a>
            <a href="#diagrams" onClick={() => setActiveTab('diagrams')} style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Diagram Studio</a>
            <a href="#analytics" onClick={() => setActiveTab('analytics')} style={{ color: 'var(--color-body)', textDecoration: 'none' }}>Analytics</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
