import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { api, ApiError, getAuthToken, removeAuthToken } from './services/api';
import type { User, Question } from './types';

export function App() {
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isSetupModalOpen, setIsSetupModalOpen] = useState<boolean>(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signup' | 'login'>('signup');
  const [user, setUser] = useState<User | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsRequestStarted, setQuestionsRequestStarted] = useState(false);
  const [questionsError, setQuestionsError] = useState('');
  const [appError, setAppError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Nothing to restore without an access token.
    if (!getAuthToken()) return;
    api
      .getMe()
      .then((userData) => setUser({ ...userData, profile: { experienceLevel: userData.experienceLevel, position: userData.currentPosition, years: userData.yearsOfExperience, targetCompany: userData.targetCompany, targetLevel: userData.targetLevel } }))
      .catch((error: unknown) => {
        // Only wipe the session when the tokens are genuinely rejected (the
        // API layer already attempted a refresh). Network hiccups or backend
        // downtime must NOT sign the user out.
        if (error instanceof ApiError && error.status === 401) {
          removeAuthToken();
        }
        setUser(null);
      });
  }, []);

  useEffect(() => {
    if (!isSetupModalOpen) { setQuestionsRequestStarted(false); return; }
    if (questions.length || questionsLoading || questionsRequestStarted) return;
    setQuestionsRequestStarted(true);
    setQuestionsLoading(true);
    setQuestionsError('');
    api.getQuestions()
      .then(setQuestions)
      .catch((error: Error) => setQuestionsError(`Could not connect to the interview API. Start the backend on port 3001 and try again. (${error.message})`))
      .finally(() => setQuestionsLoading(false));
  }, [isSetupModalOpen, questions.length, questionsLoading, questionsRequestStarted]);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('designo_refresh_token');
    if (refreshToken) void api.logout(refreshToken).catch(() => undefined);
    removeAuthToken();
    setUser(null);
    navigate('/');
  };

  const handleBeginInterview = async (questionId: string, difficulty: string, companyTrack: string) => {
    setAppError('');
    try {
      const track = ['GOOGLE', 'META', 'AMAZON', 'NETFLIX'].includes(companyTrack.toUpperCase()) ? companyTrack.toUpperCase() : 'GENERAL';
      const interview = await api.startInterview({ questionId, difficulty: difficulty.toUpperCase().replace('-', '_').replace('+', ''), companyTrack: track });
      navigate(`/interview/${interview.id}`);
    } catch (error) {
      setAppError(error instanceof Error ? error.message : 'Could not start the interview. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen bg-[#faf9fe] text-[#0a0a0f] selection:bg-[#ede9fe] selection:text-[#6b38d4] ${location.pathname === '/' ? 'flex flex-col' : 'flex flex-col md:flex-row'}`}>
      {location.pathname !== '/' && (
        <Navbar
          user={user}
          onOpenAuth={() => { setAuthInitialMode('login'); setIsAuthOpen(true); }}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenSetupModal={() => setIsSetupModalOpen(true)}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-1 min-w-0">
        {appError && <div role="alert" className="mx-4 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 md:mx-8">{appError}<button className="ml-3 underline" onClick={() => setAppError('')}>Dismiss</button></div>}
        <Routes>
          <Route path="/" element={<HeroLanding
            onStartInterview={() => {
              if (!user) setIsAuthOpen(true);
              else navigate('/dashboard');
            }}
            onExploreQuestions={() => navigate('/questions')}
            onSelectPricing={() => navigate('/billing')}
            onOpenAuth={() => { setAuthInitialMode('login'); setIsAuthOpen(true); }}
          />} />

          <Route path="/onboarding" element={<OnboardingView
            onComplete={async (profile) => {
              const experienceLevel = profile.experienceLevel === 'Staff+' ? 'STAFF' : profile.experienceLevel?.toUpperCase().replace('-', '_');
              const update = { experienceLevel, currentPosition: profile.position, yearsOfExperience: profile.years, targetCompany: profile.targetCompany, targetLevel: profile.targetLevel };
              try {
                const saved = await api.updateProfile(update);
                setUser({ ...saved, profile });
              } catch {
                setUser((prev) => (prev ? { ...prev, ...update, profile } : { email: 'candidate@designo.ai', ...update, profile }));
              }
              navigate('/dashboard');
            }}
            onSkip={() => navigate('/dashboard')}
          />} />

          <Route path="/profile" element={<ProfileSettingsView user={user} onSave={(updated) => setUser(updated)} />} />

          <Route path="/dashboard" element={<DashboardView user={user} onOpenSetupModal={() => setIsSetupModalOpen(true)} />} />

          <Route path="/questions" element={<QuestionBankView
            onSelectQuestion={(qId, diff, track) => handleBeginInterview(qId, diff, track)}
          />} />

          <Route path="/interview" element={<InterviewRunnerView />} />
          <Route path="/interview/:interviewId" element={<InterviewRunnerView />} />

          <Route path="/report" element={<EvaluationReportView />} />
          <Route path="/report/:evaluationId" element={<EvaluationReportView />} />

          <Route path="/diagrams" element={<DiagramStudioView />} />

          <Route path="/analytics" element={<AnalyticsDashboardView />} />

          <Route
            path="/roadmap"
            element={
              <LearningRoadmapView
                user={user}
                onOpenAuth={() => {
                  setAuthInitialMode('login');
                  setIsAuthOpen(true);
                }}
              />
            }
          />

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
        initialMode={authInitialMode}
        onSuccess={(loggedUser, isNewAccount) => {
          if (isNewAccount) setUser(loggedUser);
          else api.getMe().then((profile) => setUser({ ...profile, profile: { experienceLevel: profile.experienceLevel, position: profile.currentPosition, years: profile.yearsOfExperience, targetCompany: profile.targetCompany, targetLevel: profile.targetLevel } })).catch(() => setUser(loggedUser));
          navigate(isNewAccount ? '/onboarding' : '/dashboard');
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
        questions={questions}
        loadingQuestions={questionsLoading}
        questionsError={questionsError}
      />
    </div>
  );
}

export default App;
