import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, Badge } from './ui';
import { api } from '../services/api';

export const AnalyticsDashboardView: React.FC = () => {
  const [dashboard, setDashboard] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    Promise.all([api.getAnalyticsDashboard(), api.getAnalyticsProgress()]).then(([data, timeline]) => { setDashboard(data); setProgress(timeline); }).catch((error: Error) => setLoadError(error.message));
  }, []);
  const metrics = dashboard?.interviewMetrics;
  const performance = dashboard?.performanceMetrics;
  const categoryMetrics = dashboard?.categoryMetrics || {};
  const radarCategories = Object.entries(categoryMetrics).filter((entry): entry is [string, number] => typeof entry[1] === 'number').map(([name, score]) => ({ name, score, status: score >= 85 ? 'Strong' : score >= 70 ? 'Developing' : 'Needs Practice' }));
  const kpis = [
    { title: 'Interview Sessions', value: metrics?.totalInterviews ?? '—', trend: `${metrics?.interviewsThisMonth ?? 0} this month`, isPositive: true },
    { title: 'Mean Interview Score', value: performance?.averageScore ?? '—', trend: `Best: ${performance?.bestScore ?? '—'}`, isPositive: true },
    { title: 'Completed Evaluations', value: progress.length, trend: 'Based on saved reports', isPositive: true },
    { title: 'Practice Hours Logged', value: metrics?.practiceHours ? `${metrics.practiceHours}h` : '—', trend: 'Not tracked yet', isPositive: true },
  ];
  const chartData = progress.slice(-8);
  const chartPoints = chartData.map((item, index) => `${chartData.length < 2 ? 250 : index * (500 / (chartData.length - 1))},${165 - Math.max(0, Math.min(100, item.overallScore ?? 0)) * 1.5}`).join(' ');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8 pb-6 border-b border-[#e5e1ea]">
        <Badge variant="primary" icon={<BarChart3 size={13} />} className="mb-2">
          PERFORMANCE INTELLIGENCE &amp; RADAR
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          Readiness &amp; Score Analytics
        </h1>
        <p className="text-sm text-[#5e5e6e] mt-1">
          Longitudinal progress tracking calibrated against actual FAANG+ Staff &amp; Principal interview evaluations.
        </p>
      </div>
      {loadError && <p role="alert" className="mb-5 text-sm text-red-700">Could not load analytics: {loadError}</p>}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {kpis.map((kpi, idx) => (
          <Card key={idx} padding="md">
            <div className="text-xs text-[#5e5e6e] font-mono uppercase mb-2">{kpi.title}</div>
            <div className="font-display font-black text-3xl text-[#0a0a0f] mb-2">{kpi.value}</div>
            <div className="flex items-center gap-1 text-xs text-[#10b981] font-medium">
              <TrendingUp size={14} />
              <span>{kpi.trend}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
        {/* Score Progression (7 cols) */}
        <Card padding="lg" className="lg:col-span-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-[#0a0a0f]">Score Trajectory (Last 30 Days)</h3>
              <p className="text-xs text-[#5e5e6e]">Completed evaluation scores over time</p>
            </div>
            <Badge variant="primary">
              +14% Growth
            </Badge>
          </div>

          {/* SVG Score Progression Graphic */}
          <div className="h-56 relative w-full pt-4">
            {chartData.length ? <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none"><polyline points={chartPoints} fill="none" stroke="#6b38d4" strokeWidth="3.5" />{chartData.map((item, index) => <circle key={item.interviewId} cx={chartData.length < 2 ? 250 : index * (500 / (chartData.length - 1))} cy={165 - Math.max(0, Math.min(100, item.overallScore ?? 0)) * 1.5} r="4" fill="#6b38d4" />)}</svg> : <div className="flex h-full items-center justify-center text-sm text-[#8e8ea0]">Score history appears after your first completed evaluation.</div>}
            <div className="flex justify-between text-[11px] font-mono text-[#8e8ea0] mt-2">
              <span>{chartData[0] ? new Date(chartData[0].completedAt).toLocaleDateString() : 'No data'}</span>
              <span>{chartData.length ? `${chartData.length} evaluation${chartData.length === 1 ? '' : 's'}` : ''}</span>
              <span className="text-[#10b981] font-bold">{chartData.length ? `Latest: ${chartData[chartData.length - 1].overallScore}/100` : ''}</span>
            </div>
          </div>
        </Card>

        {/* Competency Radar Breakdown (5 cols) */}
        <Card padding="lg" className="lg:col-span-5">
          <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-1">Competency Radar</h3>
          <p className="text-xs text-[#5e5e6e] mb-6">Normalized performance across 6 system design vectors</p>

          <div className="space-y-4">
            {radarCategories.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#0a0a0f]">{c.name}</span>
                  <span className="font-mono font-bold text-[#6b38d4]">{c.score}%</span>
                </div>
                <div className="w-full h-2 bg-[#e5e1ea] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      c.score < 70 ? 'bg-[#f59e0b]' : c.score > 90 ? 'bg-[#10b981]' : 'bg-[#6b38d4]'
                    }`}
                    style={{ width: `${c.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Performance by evaluation category */}
      <Card padding="lg">
        <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-4">
          Evaluation Category Scores
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {radarCategories.map((comp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-[#0a0a0f]">{comp.name}</span>
                <Badge variant={comp.score >= 85 ? 'success' : 'warning'}>
                  {comp.status}
                </Badge>
              </div>
              <div className="font-display font-bold text-2xl text-[#0a0a0f]">{comp.score}%</div>
              <div className="text-[11px] text-[#5e5e6e] mt-1">Average from completed evaluations</div>
            </div>
          ))}
          {!radarCategories.length && <p className="text-sm text-[#5e5e6e]">Complete an interview to generate category score analytics.</p>}
        </div>
      </Card>
    </div>
  );
};
