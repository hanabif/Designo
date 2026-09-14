import React, { useState, useEffect } from 'react';
import { BarChart3, Award, TrendingUp, CheckCircle, AlertTriangle, Lightbulb, Clock } from 'lucide-react';
import { api } from '../services/api';

export const AnalyticsDashboardView: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    api
      .getAnalyticsDashboard()
      .then((data) => setDashboard(data))
      .catch(() => {
        setDashboard({
          interviewMetrics: { totalInterviews: 8, interviewsThisMonth: 4, practiceHours: 12.5 },
          performanceMetrics: { averageScore: 82, bestScore: 92, worstScore: 72 },
          categoryMetrics: [
            { category: 'Requirements Gathering', weight: '15%', score: 88 },
            { category: 'Architecture & System Boundaries', weight: '25%', score: 84 },
            { category: 'Scalability & Fan-out', weight: '20%', score: 82 },
            { category: 'Database & Caching Design', weight: '10%', score: 78 },
            { category: 'Reliability & Fault Tolerance', weight: '15%', score: 80 },
            { category: 'Security & Auth Gateways', weight: '10%', score: 85 },
            { category: 'Cost & Operational Awareness', weight: '5%', score: 75 },
          ],
        });
      });

    api
      .getInterviewHistory()
      .then((data) => setHistory(data))
      .catch(() => {
        setHistory([
          { id: '1', question: { title: 'Design Twitter Feed System' }, difficulty: 'INTERMEDIATE', companyTrack: 'GOOGLE', status: 'COMPLETED', createdAt: new Date() },
          { id: '2', question: { title: 'Design WhatsApp Real-time Chat' }, difficulty: 'ADVANCED', companyTrack: 'META', status: 'COMPLETED', createdAt: new Date() },
        ]);
      });
  }, []);

  const categories = dashboard?.categoryMetrics || [];

  return (
    <div className="container section-rhythm">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <BarChart3 size={20} color="#f54e00" />
          <h2 className="display-lg">Candidate Performance & Evaluation Dashboard</h2>
        </div>
        <p style={{ color: 'var(--color-body)', fontSize: '16px' }}>
          Objective analysis across weighted evaluation pillars and historical practice sessions.
        </p>
      </div>

      {/* Metric KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="card-surface">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>Average Score</div>
          <div className="display-lg" style={{ color: 'var(--color-primary)' }}>
            {dashboard?.performanceMetrics?.averageScore || 82}/100
          </div>
        </div>

        <div className="card-surface">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>Total Mock Sessions</div>
          <div className="display-lg">{dashboard?.interviewMetrics?.totalInterviews || 8}</div>
        </div>

        <div className="card-surface">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>Practice Hours</div>
          <div className="display-lg">{dashboard?.interviewMetrics?.practiceHours || 12.5} hrs</div>
        </div>

        <div className="card-surface">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px' }}>Best Score</div>
          <div className="display-lg" style={{ color: '#1f8a65' }}>
            {dashboard?.performanceMetrics?.bestScore || 92}/100
          </div>
        </div>
      </div>

      {/* Category Breakdown & Evaluation Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        {/* Category Weighted Breakdown */}
        <div className="card-surface">
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px' }}>Weighted Pillar Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {categories.map((cat: any) => (
              <div key={cat.category}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                  <span>
                    <strong style={{ fontWeight: 600 }}>{cat.category}</strong>{' '}
                    <span style={{ fontSize: '11px', color: 'var(--color-muted)' }}>({cat.weight})</span>
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cat.score}/100</span>
                </div>
                <div style={{ height: '8px', backgroundColor: 'var(--color-hairline)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.score}%`, backgroundColor: 'var(--color-primary)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses Panel */}
        <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 600 }}>AI Feedback & Observations</h3>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f8a65', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CheckCircle size={16} />
              Demonstrated Strengths
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="ide-pane" style={{ backgroundColor: '#ffffff', fontSize: '13px', padding: '10px 14px' }}>
                • Strong identification of push vs pull fan-out trade-offs in high-scale feed feeds.
              </div>
              <div className="ide-pane" style={{ backgroundColor: '#ffffff', fontSize: '13px', padding: '10px 14px' }}>
                • Accurate API gateway rate-limiting and JWT token verification structure.
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#cf2d56', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <AlertTriangle size={16} />
              Key Areas for Improvement
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="ide-pane" style={{ backgroundColor: 'var(--color-canvas-soft)', fontSize: '13px', padding: '10px 14px' }}>
                • Database sharding key selection requires explicit hotspot handling for celebrity keys.
              </div>
              <div className="ide-pane" style={{ backgroundColor: 'var(--color-canvas-soft)', fontSize: '13px', padding: '10px 14px' }}>
                • Quantitative back-of-the-envelope estimations should precede component sizing.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="card-surface">
        <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Interview History Log</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-hairline-strong)', color: 'var(--color-muted)' }}>
                <th style={{ padding: '12px' }}>Question</th>
                <th style={{ padding: '12px' }}>Track</th>
                <th style={{ padding: '12px' }}>Difficulty</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-hairline)' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{item.question?.title || 'System Design Interview'}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="badge-pill">{item.companyTrack || 'GENERAL'}</span>
                  </td>
                  <td style={{ padding: '12px' }}>{item.difficulty || 'INTERMEDIATE'}</td>
                  <td style={{ padding: '12px' }}>
                    <span className="timeline-pill pill-done">{item.status}</span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
