import React from 'react';
import { Play, Sparkles, Flame, Bot } from 'lucide-react';

interface DashboardViewProps {
  user?: any;
  onStartNewInterview?: () => void;
  onNavigateTab: (tab: string) => void;
  onOpenSetupModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  onNavigateTab,
  onOpenSetupModal,
}) => {
  const userName = user?.fullName || user?.email || 'Architect Candidate';

  const recentInterviews = [
    {
      id: 'int-1',
      title: 'Design Uber / Real-Time Location Dispatch',
      track: 'Google Track',
      score: 82,
      date: 'Sep 18, 2026',
      status: 'Completed',
    },
    {
      id: 'int-2',
      title: 'Design Global Twitter / X News Feed',
      track: 'Meta Track',
      score: 74,
      date: 'Sep 15, 2026',
      status: 'Completed',
    },
    {
      id: 'int-3',
      title: 'Design WhatsApp / End-to-End Chat',
      track: 'Amazon Track',
      score: 68,
      date: 'Sep 10, 2026',
      status: 'In Progress',
    },
  ];

  const recommendedTopics = [
    { title: 'Database Sharding & Partitioning', progress: 40, est: '20 min' },
    { title: 'Consistent Hashing & GeoDNS Routing', progress: 65, est: '15 min' },
    { title: 'CAP Theorem & Quorum Consistency', progress: 15, est: '25 min' },
  ];

  return (
    <div className="container section-padding" style={{ position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <span className="badge-accent" style={{ marginBottom: '6px' }}>
            <Sparkles size={12} /> Personal Workspace
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 400 }}>Welcome back, {userName}</h1>
        </div>

        <button onClick={onOpenSetupModal} className="btn-accent" style={{ padding: '12px 20px' }}>
          <Play size={16} /> Start New Interview
        </button>
      </div>

      {/* Stat Row (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="card-solid">
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Total Mock Interviews</div>
          <div style={{ fontSize: '32px', fontWeight: 600 }}>24</div>
          <div style={{ fontSize: '12px', color: '#1f8a65', marginTop: '4px' }}>+4 this week</div>
        </div>

        <div className="card-solid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Average Score</div>
            <div style={{ fontSize: '32px', fontWeight: 600 }}>78</div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Top 15% quantile</div>
          </div>
          {/* Score Circular Ring */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'conic-gradient(#171717 78%, #e8e7e6 0%)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>
              78%
            </div>
          </div>
        </div>

        <div className="card-solid">
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Practice Hours</div>
          <div style={{ fontSize: '32px', fontWeight: 600 }}>16.5h</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>Avg 45m / session</div>
        </div>

        <div className="card-solid">
          <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>Current Streak</div>
          <div style={{ fontSize: '32px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            5 days <Flame size={24} color="#d97706" />
          </div>
          <div style={{ fontSize: '12px', color: '#d97706', marginTop: '4px' }}>Best streak: 12 days</div>
        </div>
      </div>

      {/* Main Grid: Recent Interviews (Left) vs Recommended Next (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px' }}>
        {/* Recent Interviews */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 500 }}>Recent Interview Sessions</h3>
            <button onClick={() => onNavigateTab('questions')} className="btn-ghost" style={{ fontSize: '13px' }}>
              View Question Bank →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {recentInterviews.map((item) => (
              <div key={item.id} className="card-solid" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge-subtle">{item.track}</span>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{item.date}</span>
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: 600 }}>{item.title}</h4>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text)' }}>{item.score}/100</div>
                    <div style={{ fontSize: '11px', color: item.status === 'Completed' ? '#1f8a65' : '#d97706' }}>{item.status}</div>
                  </div>
                  <button onClick={() => onNavigateTab('report')} className="btn-filled" style={{ fontSize: '13px' }}>
                    {item.status === 'Completed' ? 'Replay / Report' : 'Resume'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Next Topics */}
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 500 }}>Recommended Next</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>Targeting weak score areas</p>
          </div>

          <div className="card-cofounder" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recommendedTopics.map((top) => (
              <div key={top.title} style={{ paddingBottom: '12px', borderBottom: '1px solid var(--color-border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 500, marginBottom: '6px' }}>
                  <span>{top.title}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{top.est}</span>
                </div>

                <div style={{ height: '6px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${top.progress}%`, backgroundColor: 'var(--color-text)' }} />
                </div>

                <button onClick={() => onNavigateTab('roadmap')} className="btn-ghost" style={{ padding: 0, fontSize: '12px', color: 'var(--color-text)' }}>
                  Continue module →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating AI Assistant Orb */}
      <button
        onClick={() => onNavigateTab('interview')}
        title="Launch AI Architecture Assistant"
        style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-text)',
          color: '#ffffff',
          border: 'none',
          boxShadow: 'var(--shadow-dropdown)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          cursor: 'pointer',
          zIndex: 90,
          transition: 'transform 0.2s ease',
        }}
      >
        <Bot size={26} color="var(--color-primary)" />
      </button>
    </div>
  );
};
