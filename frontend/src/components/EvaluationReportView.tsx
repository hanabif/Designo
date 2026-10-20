import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Download, Play, CheckCircle2, AlertCircle, Award, ArrowRight } from 'lucide-react';
import { Button, Card, Badge } from './ui';
import { api } from '../services/api';

interface EvaluationReportViewProps {
  onReplay?: () => void;
  onNavigateRoadmap?: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  onReplay: propOnReplay,
  onNavigateRoadmap: propOnNavigateRoadmap,
}) => {
  const navigate = useNavigate();
  const { evaluationId } = useParams();
  const [report, setReport] = useState<any>(null);
  const [reportError, setReportError] = useState('');
  // Replay the exact conversation this report evaluated. Fall back to the bare
  // /interview route, which lists every session so the user can pick one.
  const onReplay = propOnReplay || (() => {
    const interviewId = report?.interview?.id ?? report?.interviewId;
    navigate(interviewId ? `/interview/${interviewId}` : '/interview');
  });
  useEffect(() => {
    if (!evaluationId) return;
    let active = true;
    const load = async () => {
      try {
        const result = await api.getEvaluation(evaluationId);
        if (active) setReport(result);
        if (active && result.status !== 'COMPLETED' && result.status !== 'FAILED') window.setTimeout(load, 2000);
      } catch (error) { if (active) setReportError(error instanceof Error ? error.message : 'Report unavailable.'); }
    };
    void load();
    return () => { active = false; };
  }, [evaluationId]);
  const overallScore = report?.overallScore ?? '—';
  const performanceLabel = report?.status !== 'COMPLETED' ? (report?.status === 'FAILED' ? 'EVALUATION FAILED' : 'EVALUATION IN PROGRESS') : overallScore >= 85 ? 'STRONG HIRE' : overallScore >= 75 ? 'HIRE' : 'NEEDS PRACTICE';
  const categoryBreakdown = report ? [
    ['Requirements & Scope Clarification', 'requirementsScore'], ['High-Level Architecture', 'architectureScore'], ['Scalability', 'scalabilityScore'], ['Database Design', 'databaseDesignScore'], ['Reliability', 'reliabilityScore'], ['Security', 'securityScore'], ['Cost Awareness', 'costAwarenessScore'],
  ].map(([name, key]) => ({ name, weight: '—', score: report[key] ?? 0, status: (report[key] ?? 0) >= 85 ? 'Strong' : (report[key] ?? 0) >= 70 ? 'Developing' : 'Needs Practice' })) : [];
  const strengths: string[] = report?.strengths || [];
  const areasToImprove: string[] = report?.weaknesses || report?.recommendations || [];

  /**
   * Honest summary derived STRICTLY from this report's numbers.
   * The previous copy was hardcoded praise ("Staff-level command…") which
   * read as fiction for low-signal sessions — e.g. a loop with no answers.
   */
  const summary = (() => {
    const score = typeof overallScore === 'number' ? overallScore : 0;
    const weakest = [...categoryBreakdown]
      .sort((a, b) => a.score - b.score)
      .filter((cat) => cat.score < 70)
      .slice(0, 2)
      .map((cat) => cat.name);
    const weakText = weakest.length ? ` Lowest areas: ${weakest.join(' and ')}.` : '';

    if (report?.status === 'FAILED') {
      return {
        headline: 'Evaluation failed',
        text: 'The evaluator could not score this session — replay it and re-run the evaluation to get a real report.',
      };
    }
    if (report?.status !== 'COMPLETED') {
      return {
        headline: 'Evaluation in progress',
        text: 'Scoring is still running. This summary updates as soon as the evaluator finishes.',
      };
    }
    if (strengths.length === 0 || score < 40) {
      return {
        headline: 'This loop does not reflect your ability yet',
        text: `The report scored ${score}/100 with ${strengths.length} strength${strengths.length === 1 ? '' : 's'} because little or no reasoning was submitted — there is nothing here to praise. Re-run the session and talk through each stage; the evaluator grades exactly what you say.${weakText}`,
      };
    }
    if (score >= 85) {
      return {
        headline: 'Ready for Tier-1 Staff Loop',
        text: `${score}/100 with ${strengths.length} demonstrated strength${strengths.length === 1 ? '' : 's'} across the weighted rubric.${weakText}`,
      };
    }
    if (score >= 75) {
      return {
        headline: 'Hire-level, with gaps to close',
        text: `${score}/100 across ${categoryBreakdown.length} weighted categories, ${areasToImprove.length} item${areasToImprove.length === 1 ? '' : 's'} flagged for practice.${weakText}`,
      };
    }
    if (score >= 50) {
      return {
        headline: 'Developing — core gaps remain',
        text: `${score}/100. ${areasToImprove.length} trade-off gap${areasToImprove.length === 1 ? '' : 's'} surfaced in this loop.${weakText}`,
      };
    }
    return {
      headline: 'Needs significant practice',
      text: `${score}/100. Focus the fundamentals before the next loop — ${areasToImprove.length} gap${areasToImprove.length === 1 ? '' : 's'} flagged.${weakText}`,
    };
  })();

  // Hand the weaknesses straight to the roadmap so "Sync Gaps to Roadmap"
  // actually imports them — LearningRoadmapView reads this router state.
  const onNavigateRoadmap =
    propOnNavigateRoadmap ||
    (() =>
      navigate('/roadmap', {
        state: {
          weaknesses: areasToImprove,
          evaluationId: report?.id,
          score: typeof report?.overallScore === 'number' ? report.overallScore : undefined,
          questionTitle: report?.interview?.question?.title,
        },
      }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Action Bar */}
      {reportError && <p role="alert" className="mb-4 text-sm text-red-700">{reportError}</p>}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e1ea]">
        <div>
          <Badge variant="primary" icon={<Award size={13} />} className="mb-2">
            {report?.id ? `EVALUATION REPORT #${report.id.slice(-8).toUpperCase()}` : 'EVALUATION REPORT'}
          </Badge>
          <h1 className="font-display font-bold text-3xl text-[#0a0a0f]">
            Mock Interview Evaluation
          </h1>
          <p className="text-xs text-[#5e5e6e] font-mono mt-1">
            Scenario: {report?.interview?.question?.title || '—'} // {report?.status === 'COMPLETED' ? 'Completed evaluation' : 'Awaiting evaluation'}
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
            <Badge
              variant={
                report?.status === 'FAILED'
                  ? 'danger'
                  : report?.status !== 'COMPLETED'
                    ? 'primary'
                    : overallScore >= 75
                      ? 'success'
                      : overallScore >= 50
                        ? 'warning'
                        : 'danger'
              }
              icon={<CheckCircle2 size={13} />}
              className="mb-2"
            >
              {performanceLabel}
            </Badge>
            <h2 className="font-display font-bold text-2xl text-[#0a0a0f]">
              {summary.headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#5e5e6e] mt-1 max-w-lg leading-relaxed">
              {summary.text}
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
                  <Badge
                    variant={cat.score >= 85 ? 'success' : cat.score >= 70 ? 'primary' : 'danger'}
                  >
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
