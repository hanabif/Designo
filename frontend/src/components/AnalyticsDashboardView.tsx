import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Card, Badge } from './ui';

export const AnalyticsDashboardView: React.FC = () => {
  const kpis = [
    { title: 'Total Interviews Completed', value: '24', trend: '+4 this week', isPositive: true },
    { title: 'Mean Loop Score', value: '81.4', trend: '+8.2 pts vs last month', isPositive: true },
    { title: 'Staff+ Benchmark Delta', value: '+6.2%', trend: 'Top 12th percentile', isPositive: true },
    { title: 'Prep Hours Logged', value: '18.5h', trend: '5-day streak active', isPositive: true },
  ];

  const radarCategories = [
    { name: 'Requirements & Scope Clarification', score: 92, status: 'Exemplary' },
    { name: 'Concurrency & In-Memory Caching', score: 94, status: 'Exemplary' },
    { name: 'High-Level Topologies & Microservices', score: 86, status: 'Strong Hire' },
    { name: 'Communication & Trade-off Articulation', score: 85, status: 'Strong Hire' },
    { name: 'Fault Tolerance & SPOF Resilience', score: 78, status: 'Hire' },
    { name: 'Distributed Storage & Sharding Keys', score: 68, status: 'Needs Practice' },
  ];

  const companyReadiness = [
    { name: 'Google L6 Staff Track', score: 86, readiness: 'Ready' },
    { name: 'Meta E5/E6 Production Track', score: 82, readiness: 'Ready' },
    { name: 'Amazon Principal Architect Track', score: 79, readiness: 'Borderline' },
    { name: 'Stripe Core Infrastructure Track', score: 76, readiness: 'Borderline' },
  ];

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
              <p className="text-xs text-[#5e5e6e]">Progression across 24 simulated mock loops</p>
            </div>
            <Badge variant="primary">
              +14% Growth
            </Badge>
          </div>

          {/* SVG Score Progression Graphic */}
          <div className="h-56 relative w-full pt-4">
            <svg width="100%" height="100%" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ede9fe" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,140 Q80,120 160,95 T320,60 T500,25 L500,180 L0,180 Z"
                fill="url(#purpleGrad)"
              />
              <path
                d="M0,140 Q80,120 160,95 T320,60 T500,25"
                fill="none"
                stroke="#6b38d4"
                strokeWidth="3.5"
              />
              {/* Highlight points */}
              <circle cx="160" cy="95" r="4.5" fill="#6b38d4" />
              <circle cx="320" cy="60" r="4.5" fill="#6b38d4" />
              <circle cx="500" cy="25" r="5" fill="#10b981" />
            </svg>
            <div className="flex justify-between text-[11px] font-mono text-[#8e8ea0] mt-2">
              <span>Day 1 (Score: 68)</span>
              <span>Day 15 (Score: 78)</span>
              <span className="text-[#10b981] font-bold">Latest (Score: 86)</span>
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

      {/* Target Company Matrix */}
      <Card padding="lg">
        <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-4">
          Company Loop Calibration Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {companyReadiness.map((comp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-xs text-[#0a0a0f]">{comp.name}</span>
                <Badge variant={comp.readiness === 'Ready' ? 'success' : 'warning'}>
                  {comp.readiness}
                </Badge>
              </div>
              <div className="font-display font-bold text-2xl text-[#0a0a0f]">{comp.score}%</div>
              <div className="text-[11px] text-[#5e5e6e] mt-1">Passing threshold: 75%</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
