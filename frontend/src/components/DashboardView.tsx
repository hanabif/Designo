import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Sparkles, Flame, ArrowRight, Award, Clock, TrendingUp, ChevronRight, Layers } from 'lucide-react';
import type { User } from '../types';
import { Button, Card, Badge } from './ui';
import { api } from '../services/api';
import { getPracticeSeconds, getTotalPracticeSeconds, formatDuration } from '../lib/practiceTime';

interface DashboardViewProps {
  user?: User | null;
  onStartNewInterview?: () => void;
  onNavigateTab?: (tab: string) => void;
  onOpenSetupModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigateTab: propOnNavigateTab,
  onOpenSetupModal,
}) => {
  const navigate = useNavigate();
  const onNavigateTab = (tab: string) => {
    if (propOnNavigateTab) {
      propOnNavigateTab(tab);
    } else {
      navigate(tab.startsWith('/') ? tab : `/${tab}`);
    }
  };
  const userName = user?.fullName || user?.name || user?.email?.split('@')[0] || 'Architect Candidate';

  const [recentInterviews, setRecentInterviews] = useState<Array<{ id: string; evaluationId?: string; status: string; title: string; track: string; difficulty: string; score: string; verdict: string; date: string; duration: string }>>([]);
  const [interviewCount, setInterviewCount] = useState(0);
  const [averageScore, setAverageScore] = useState<number | null>(null);
  const [practiceTime, setPracticeTime] = useState('0 min');
  const [practiceTracked, setPracticeTracked] = useState(false);
  const [recommendedTopics, setRecommendedTopics] = useState<Array<{ title: string; progress: number; est: string; category: string }>>([]);
  const [topCompetency, setTopCompetency] = useState<{ name: string; score: number } | null>(null);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    Promise.all([api.getInterviewHistory(), api.getAnalyticsDashboard(), api.getRecommendations()]).then(([history, analytics, recommendations]) => {
      setInterviewCount(analytics.interviewMetrics?.totalInterviews ?? history.length);
      setAverageScore(analytics.performanceMetrics?.averageScore ?? null);
      const scoredAreas = Object.entries(analytics.categoryMetrics || {}).filter((entry): entry is [string, number] => typeof entry[1] === 'number').sort((a, b) => b[1] - a[1]);
      if (scoredAreas.length) setTopCompetency({ name: scoredAreas[0][0], score: scoredAreas[0][1] });
      setRecommendedTopics((recommendations.learningRoadmap || []).slice(0, 3).map((item: any) => ({ title: item.topic, progress: 0, est: item.priority || 'Recommended', category: item.priority || 'Focus area' })));
      const totalPracticeSeconds = getTotalPracticeSeconds();
      setPracticeTime(formatDuration(totalPracticeSeconds));
      setPracticeTracked(totalPracticeSeconds > 0);
      setRecentInterviews(history.slice(0, 3).map((item: any) => {
        const score = item.evaluation?.overallScore;
        const inProgress = item.status === 'IN_PROGRESS';
        const trackedSeconds = getPracticeSeconds(item.id);
        return { id: item.id, evaluationId: item.evaluation?.id, status: item.status, title: item.question?.title ?? 'Interview session', track: `${item.companyTrack} Track`, difficulty: item.difficulty, score: score == null ? (inProgress ? '—' : 'Pending') : `${score}/100`, verdict: score == null ? (inProgress ? 'In Progress' : item.status) : score >= 85 ? 'Strong Hire' : score >= 75 ? 'Hire' : 'Needs Practice', date: new Date(item.createdAt).toLocaleDateString(), duration: trackedSeconds > 0 ? formatDuration(trackedSeconds) : '—' };
      }));
    }).catch((error: Error) => setLoadError(error.message));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-8 border-b border-[#e5e1ea]">
        <div>
          <Badge variant="primary" icon={<Sparkles size={12} />} className="mb-3">
            PERSONALIZED INTERVIEW PREP
          </Badge>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
            Welcome back, {userName}
          </h1>
          <p className="text-sm text-[#5e5e6e] mt-1">
            Your dashboard reflects your saved interview sessions and feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => onNavigateTab('questions')}
          >
            Browse Library
          </Button>
          <Button
            variant="dark"
            size="md"
            iconLeft={<Play size={14} fill="currentColor" />}
            onClick={onOpenSetupModal}
          >
            Launch Mock Interview
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#5e5e6e] font-mono uppercase mb-2">
            <span>Interviews Completed</span>
            <Award size={16} className="text-[#6b38d4]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#0a0a0f]">{interviewCount}</div>
          <div className="text-xs text-[#10b981] font-medium mt-2 flex items-center gap-1">
            <span>Completed practice sessions</span>
          </div>
        </Card>

        <Card padding="md" className="flex items-center justify-between">
          <div>
            <div className="text-xs text-[#5e5e6e] font-mono uppercase mb-2">Average Score</div>
            <div className="font-display font-extrabold text-3xl text-[#0a0a0f]">{averageScore ?? '—'}<span className="text-lg font-normal text-[#8e8ea0]">{averageScore === null ? '' : '/100'}</span></div>
            <div className="text-xs text-[#6b38d4] font-medium mt-2">Strong Hire Baseline</div>
          </div>
          <div className="w-14 h-14 rounded-full border-4 border-[#ede9fe] border-t-[#6b38d4] flex items-center justify-center font-display font-bold text-xs text-[#6b38d4]">
            {averageScore ?? '—'}{averageScore === null ? '' : '%'}
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#5e5e6e] font-mono uppercase mb-2">
            <span>Practice Time</span>
            <Clock size={16} className="text-[#6b38d4]" />
          </div>
          <div className="font-display font-extrabold text-3xl text-[#0a0a0f]">{practiceTime}</div>
          <div className="text-xs text-[#10b981] font-medium mt-2 flex items-center gap-1">
            <Flame size={13} className="text-amber-500 fill-amber-500" />
            <span>{practiceTracked ? 'Counted live while you practice' : 'Launch an interview — time tracks automatically'}</span>
          </div>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#5e5e6e] font-mono uppercase mb-2">
            <span>Top Competency</span>
            <TrendingUp size={16} className="text-[#10b981]" />
          </div>
          <div className="font-display font-extrabold text-xl text-[#0a0a0f] truncate">{topCompetency?.name ?? '—'}</div>
          <div className="text-xs text-[#5e5e6e] mt-2">
            {topCompetency ? `${topCompetency.score}% average score` : 'Complete an interview to see your strongest area.'}
          </div>
        </Card>
      </div>

      {/* Main Grid: Recent Interviews (Left) + Roadmap & Drills (Right) */}
      {loadError && <p role="alert" className="mb-5 text-sm text-red-700">Could not load your saved interview data: {loadError}</p>}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent Sessions Table */}
          <Card padding="md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display font-bold text-lg text-[#0a0a0f]">Recent Mock Interviews</h3>
                <p className="text-xs text-[#5e5e6e]">Turn-by-turn evaluations from your latest sessions</p>
              </div>
              <button
                onClick={() => { const latestReport = recentInterviews.find((session) => session.evaluationId); if (latestReport?.evaluationId) navigate(`/report/${latestReport.evaluationId}`); }}
                className="text-xs text-[#6b38d4] font-semibold hover:underline cursor-pointer"
              >
                View Latest Report
              </button>
            </div>

            <div className="divide-y divide-[#e5e1ea]">
              {!recentInterviews.length && <p className="py-5 text-sm text-[#5e5e6e]">Your interview history will appear here when you finish a session.</p>}
              {recentInterviews.map((session) => (
                <div key={session.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm text-[#0a0a0f]">{session.title}</span>
                      <Badge variant="primary">
                        {session.track}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#8e8ea0] font-mono">
                      <span>{session.date}</span>
                      <span>•</span>
                      <span>{session.duration}</span>
                      <span>•</span>
                      <span>{session.difficulty}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <div className="text-right">
                      <div className="font-display font-bold text-base text-[#0a0a0f]">{session.score}</div>
                      <Badge variant={session.status === 'IN_PROGRESS' ? 'primary' : 'success'}>
                        {session.verdict}
                      </Badge>
                    </div>
                    {session.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => navigate(`/interview/${session.id}`)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#6b38d4] hover:bg-[#5a2fc0] text-white text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                        title="Resume this interview where you left off"
                        aria-label="Resume Interview"
                      >
                        <Play size={13} />
                        Resume
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (session.status === 'IN_PROGRESS') navigate(`/interview/${session.id}`);
                        else if (session.evaluationId) navigate(`/report/${session.evaluationId}`);
                        else onNavigateTab('report');
                      }}
                      className="p-2 rounded-full border border-[#e5e1ea] text-[#5e5e6e] hover:text-[#0a0a0f] hover:bg-[#faf9fc] cursor-pointer transition-colors"
                      title={session.status === 'IN_PROGRESS' ? 'Open Interview' : 'Inspect Report'}
                      aria-label={session.status === 'IN_PROGRESS' ? 'Open Interview' : 'Inspect Report'}
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Studio Launch Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#f3f0ff] to-[#faf9fe] border border-[#8b5cf6]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#6b38d4] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Layers size={24} />
              </div>
              <div>
                <h4 className="font-display font-bold text-base text-[#0a0a0f]">Architecture Diagram Studio</h4>
                <p className="text-xs text-[#5e5e6e]">Generate Mermaid topologies or let the AI audit your system diagrams for SPOFs.</p>
              </div>
            </div>
            <Button
              variant="dark"
              size="sm"
              className="shrink-0"
              onClick={() => onNavigateTab('diagrams')}
            >
              Open Studio
            </Button>
          </div>
        </div>

        {/* Right Column (4 cols): Active Roadmap & Weak Area Drills */}
        <div className="lg:col-span-4 space-y-6">
          <Card padding="md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-[#0a0a0f]">Recommended Next Drills</h3>
              <button
                onClick={() => onNavigateTab('roadmap')}
                className="text-xs text-[#6b38d4] font-semibold hover:underline cursor-pointer"
              >
                Roadmap
              </button>
            </div>
            <p className="text-xs text-[#5e5e6e] mb-4">
              Targeted exercises derived from your missed trade-offs in recent mock loops.
            </p>

            <div className="space-y-4">
              {recommendedTopics.map((topic, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[#0a0a0f] truncate">{topic.title}</span>
                    <span className="text-[11px] font-mono text-[#8e8ea0]">{topic.est}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#5e5e6e]">
                    <span className="bg-[#ede9fe] text-[#6b38d4] px-2 py-0.5 rounded font-semibold">{topic.category}</span>
                    <span>{topic.est}</span>
                  </div>
                </div>
              ))}
            </div>
            {!recommendedTopics.length && <p className="text-xs text-[#8e8ea0]">Recommendations will appear after interview evaluations are available.</p>}

            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="mt-5"
              iconRight={<ArrowRight size={13} />}
              onClick={() => onNavigateTab('roadmap')}
            >
              Explore Full 6-Week Roadmap
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
