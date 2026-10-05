import React from 'react';
import { Download, Play, CheckCircle2, AlertCircle, Award, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from './ui';

interface EvaluationReportViewProps {
  onReplay: () => void;
  onNavigateRoadmap: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  onReplay,
  onNavigateRoadmap,
}) => {
  const overallScore = 86;
  const performanceLabel = 'STRONG HIRE (L6 STAFF CALIBRATED)';

  const categoryBreakdown = [
    { name: '1. Requirements & Scope Clarification', weight: '15%', score: 92, status: 'Exemplary' },
    { name: '2. High-Level Architecture & Topologies', weight: '25%', score: 88, status: 'Strong Hire' },
    { name: '3. Data Contracts & Storage Modeling', weight: '20%', score: 74, status: 'Hire' },
    { name: '4. Concurrency, Caching & Fan-Out', weight: '20%', score: 94, status: 'Exemplary' },
    { name: '5. Fault Tolerance & SPOF Resilience', weight: '15%', score: 78, status: 'Hire' },
    { name: '6. Communication & Justification of Trade-offs', weight: '5%', score: 85, status: 'Strong Hire' },
  ];

  const strengths = [
    'Articulated concrete mathematical QPS estimation (25k writes/sec, 3.2 MB/sec throughput) before choosing in-memory storage.',
    'Proposed a hybrid fan-out pipeline (Redis Geospatial + Kafka partition by GeoHash cell), preventing write amplification.',
    'Correctly integrated probabilistic leases (XFetch) to neutralize cache stampedes during concurrent spikes.',
  ];

  const areasToImprove = [
    'Database Sharding strategy lacks explicit composite partition key choice for cross-city boundary queries.',
    'Quorum consistency parameters (N, R, W) were left unspecified during network partition recovery scenarios.',
    'Did not calculate operational memory eviction policies (allkeys-lru vs volatile-lru) under extreme OOM conditions.',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e1ea]">
        <div>
          <Badge variant="primary" icon={<Award size={13} />} className="mb-2">
            EVALUATION REPORT #DES-9104
          </Badge>
          <h1 className="font-display font-bold text-3xl text-[#0a0a0f]">
            Mock Interview Evaluation
          </h1>
          <p className="text-xs text-[#5e5e6e] font-mono mt-1">
            Scenario: Design Uber Dispatch // Duration: 42m 18s // Calibrated: Google L6 Loop
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            iconLeft={<Download size={14} />}
          >
            Export PDF
          </Button>
          <Button
            variant="dark"
            size="sm"
            iconLeft={<Play size={13} fill="currentColor" />}
            onClick={onReplay}
          >
            Replay Session
          </Button>
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#f3f0ff] via-white to-[#faf9fe] border border-[#8b5cf6]/20 p-8 mb-10 shadow-xs flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* Circular Score Ring */}
          <div className="w-28 h-28 rounded-full border-8 border-[#ede9fe] border-t-[#6b38d4] flex flex-col items-center justify-center shrink-0 shadow-xs bg-white">
            <span className="font-display font-black text-3xl text-[#0a0a0f]">{overallScore}</span>
            <span className="font-mono text-[10px] text-[#8e8ea0] uppercase">/ 100 PTS</span>
          </div>

          <div>
            <Badge variant="success" icon={<CheckCircle2 size={13} />} className="mb-2">
              {performanceLabel}
            </Badge>
            <h2 className="font-display font-bold text-2xl text-[#0a0a0f]">
              Ready for Tier-1 Staff Loop
            </h2>
            <p className="text-xs sm:text-sm text-[#5e5e6e] mt-1 max-w-lg leading-relaxed">
              Your architectural reasoning demonstrates Staff-level command over concurrency and data pipelines. Minor gaps in partition failure tolerance can be closed with 2 targeted drills.
            </p>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          className="shrink-0 shadow-md"
          iconRight={<ArrowRight size={14} />}
          onClick={onNavigateRoadmap}
        >
          Sync Gaps to Roadmap
        </Button>
      </div>

      {/* Rubric Category Breakdown Table */}
      <Card padding="lg" className="mb-10">
        <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-6">
          Weighted Competency Breakdown
        </h3>

        <div className="space-y-4">
          {categoryBreakdown.map((cat, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-xs sm:text-sm text-[#0a0a0f]">{cat.name}</span>
                  <span className="text-[10px] font-mono text-[#8e8ea0] bg-white px-2 py-0.5 rounded border border-[#e5e1ea]">
                    Weight: {cat.weight}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-[#0a0a0f]">{cat.score}%</span>
                  <Badge variant="primary">
                    {cat.status}
                  </Badge>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#e5e1ea] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6b38d4] rounded-full transition-all duration-500"
                  style={{ width: `${cat.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths & Critical Gaps (2 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Strengths */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4 text-[#10b981]">
            <CheckCircle2 size={18} />
            <h3 className="font-display font-bold text-base text-[#0a0a0f]">Key Strengths Demonstrated</h3>
          </div>
          <div className="space-y-3">
            {strengths.map((str, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-[#0a0a0f] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 shrink-0" />
                <span>{str}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Areas to Improve */}
        <Card padding="md">
          <div className="flex items-center gap-2 mb-4 text-[#f59e0b]">
            <AlertCircle size={18} />
            <h3 className="font-display font-bold text-base text-[#0a0a0f]">Missed Trade-Offs &amp; Vulnerabilities</h3>
          </div>
          <div className="space-y-3">
            {areasToImprove.map((gap, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs text-[#0a0a0f] leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] mt-1.5 shrink-0" />
                <span>{gap}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
