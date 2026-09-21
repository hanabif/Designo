import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const kpis = [
    { title: 'Total Interviews', value: '24', trend: '+12% this month', isUp: true },
    { title: 'Average Score', value: '78', trend: '+6 pts vs last week', isUp: true },
    { title: 'Best Score', value: '92', trend: 'Achieved on Google Track', isUp: true },
    { title: 'Practice Hours', value: '16.5h', trend: '+3.2h this week', isUp: true },
  ];

  const radarCategories = [
    { name: 'Scalability', score: 88, status: 'Strong' },
    { name: 'Security', score: 80, status: 'Good' },
    { name: 'Database Design', score: 62, status: 'Weakest' },
    { name: 'Reliability', score: 78, status: 'Good' },
    { name: 'Architecture', score: 85, status: 'Strong' },
    { name: 'Requirements Gathering', score: 92, status: 'Strongest' },
    { name: 'Cost Awareness', score: 90, status: 'Strong' },
  ];

  return (
    <div className="container section-padding">
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-accent" style={{ marginBottom: '6px' }}>
          <BarChart3 size={12} /> Performance Intelligence
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 400 }}>Analytics Dashboard</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', marginTop: '4px' }}>
          Track score improvements, category performance radar, and weak-point insights over time.
        </p>
      </div>

      {/* KPI Row (4 Cards with Sparkline indicator) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        {kpis.map((kpi) => (
          <div key={kpi.title} className="card-solid">
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>{kpi.title}</div>
            <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '12px', color: '#1f8a65', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <TrendingUp size={12} /> {kpi.trend}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid: Score Trend Chart (Left) & Radar Category Chart (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', marginBottom: '36px' }}>
        {/* Score Trend Area Visual */}
        <div className="card-solid">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 500 }}>Score Trend Over Time</h3>
            <span className="badge-subtle">Last 30 Days</span>
          </div>

          {/* SVG Area Chart Graphic */}
          <div style={{ width: '100%', height: '220px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 500 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#dae9fb" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#dae9fb" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,160 Q80,140 160,110 T320,70 T500,40 L500,200 L0,200 Z"
                fill="url(#scoreGrad)"
              />
              <path
                d="M0,160 Q80,140 160,110 T320,70 T500,40"
                fill="none"
                stroke="#171717"
                strokeWidth="3"
              />
            </svg>
          </div>
        </div>

        {/* Category Performance Radar */}
        <div className="card-solid">
          <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '20px' }}>Category Radar</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {radarCategories.map((c) => (
              <div key={c.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 500 }}>{c.name}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{c.score}/100</span>
                </div>
                <div style={{ height: '6px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: `${c.score}%`,
                      backgroundColor: c.score < 70 ? '#dc2626' : c.score > 90 ? '#1f8a65' : 'var(--color-text)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weak vs Strong Horizontal Bars List */}
      <div className="card-solid">
        <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px' }}>Weak vs. Strong Area Summary</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', backgroundColor: '#fee2e2', borderRadius: 'var(--radius-card)', border: '1px solid #fca5a5' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626', textTransform: 'uppercase' }}>Weakest Category</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginTop: '4px' }}>Database Design & Sharding (62%)</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Recommend reviewing partition keys and read-replica replication lag.
            </p>
          </div>

          <div style={{ padding: '16px', backgroundColor: '#e6f4ef', borderRadius: 'var(--radius-card)', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#1f8a65', textTransform: 'uppercase' }}>Strongest Category</div>
            <div style={{ fontSize: '18px', fontWeight: 600, color: '#171717', marginTop: '4px' }}>Requirements Gathering (92%)</div>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Consistently specifies QPS, write ratios, and SLA constraints accurately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
