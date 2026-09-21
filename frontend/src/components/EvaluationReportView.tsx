import React from 'react';
import { Download, Share2, Play, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

interface EvaluationReportViewProps {
  onReplay: () => void;
  onNavigateRoadmap: () => void;
}

export const EvaluationReportView: React.FC<EvaluationReportViewProps> = ({
  onReplay,
  onNavigateRoadmap,
}) => {
  const overallScore = 82;
  const performanceLabel = 'Strong Performance (Tier-1 Qualified)';

  const categoryBreakdown = [
    { name: 'Requirements Gathering', weight: 15, score: 92 },
    { name: 'Architecture & High-Level Design', weight: 25, score: 85 },
    { name: 'Scalability & Fan-Out', weight: 20, score: 88 },
    { name: 'Database & Data Modeling', weight: 10, score: 65 },
    { name: 'Reliability & SPOF Detection', weight: 15, score: 78 },
    { name: 'Security & Encryption', weight: 10, score: 80 },
    { name: 'Cost Awareness & Capacity', weight: 5, score: 90 },
  ];

  const strengths = [
    'Clearly defined read/write query ratio (100:1) before selecting storage strategy.',
    'Proposed Hybrid Fan-out model eliminating write amplification for 100k+ follower accounts.',
    'Effective use of GeoHash spatial indexing with Redis geospatial clusters.',
  ];

  const areasToImprove = [
    'Didn’t address single point of failure in the ingress load balancer tier.',
    'Database Sharding strategy lacks explicit partition key choice for cross-shard queries.',
    'Quorum consistency parameters (N, R, W) were left unspecified during network partition scenario.',
  ];

  const recommendedTopics = [
    'Database Sharding & Key Design',
    'CAP Theorem & Quorum Tunings',
    'Active-Active Load Balancer SPOFs',
    'Consistent Hashing & Virtual Nodes',
  ];

  return (
    <div className="container section-padding" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      {/* Top Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <span className="badge-accent" style={{ marginBottom: '6px' }}>
            <Award size={12} /> Evaluation Report #8492
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 400 }}>Interview Evaluation Report</h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-filled" style={{ fontSize: '13px' }}>
            <Download size={14} /> Export PDF
          </button>
          <button className="btn-filled" style={{ fontSize: '13px' }}>
            <Share2 size={14} /> Share
          </button>
          <button onClick={onReplay} className="btn-dark" style={{ fontSize: '13px' }}>
            <Play size={14} /> Replay Interview
          </button>
        </div>
      </div>

      {/* Hero Score Ring Banner */}
      <div
        className="card-solid"
        style={{
          backgroundColor: 'var(--color-primary)',
          padding: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
          marginBottom: '36px',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        {/* Score Ring */}
        <div
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'conic-gradient(#171717 82%, #ffffff 0%)',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            flexShrink: 0,
            boxShadow: 'var(--shadow-low)',
          }}
        >
          <div
            style={{
              width: '94px',
              height: '94px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 600, lineHeight: 1 }}>{overallScore}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>OUT OF 100</span>
          </div>
        </div>

        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
            Overall Assessment Outcome
          </div>
          <h2 style={{ fontSize: '28px', fontWeight: 500, marginBottom: '8px' }}>{performanceLabel}</h2>
          <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', maxWidth: '600px' }}>
            You demonstrated senior-level system design competencies, particularly in scalability and requirements gathering. Focus on addressing database sharding edge-cases to reach Staff level.
          </p>
        </div>
      </div>

      {/* 7 Category Breakdown Bars */}
      <div className="card-solid" style={{ marginBottom: '36px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '24px' }}>7 Weighted Category Breakdown</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {categoryBreakdown.map((cat) => (
            <div key={cat.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ fontWeight: 500 }}>
                  {cat.name} <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>({cat.weight}% weight)</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{cat.score}/100</span>
              </div>

              <div style={{ height: '8px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${cat.score}%`,
                    backgroundColor: cat.score >= 80 ? '#1f8a65' : cat.score >= 70 ? 'var(--color-text)' : '#d97706',
                    borderRadius: '4px',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths (Green) vs Areas to Improve (Amber) Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px', marginBottom: '36px' }}>
        {/* Strengths Card */}
        <div className="card-solid" style={{ borderLeft: '4px solid #1f8a65' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CheckCircle2 size={20} color="#1f8a65" />
            <h3 style={{ fontSize: '18px', fontWeight: 500 }}>Key Strengths Demonstrated</h3>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {strengths.map((str, i) => (
              <li key={i} style={{ fontSize: '14px', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#1f8a65', fontWeight: 600 }}>✓</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas to Improve Card */}
        <div className="card-solid" style={{ borderLeft: '4px solid #d97706' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={20} color="#d97706" />
            <h3 style={{ fontSize: '18px', fontWeight: 500 }}>Areas to Improve</h3>
          </div>

          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {areasToImprove.map((area, i) => (
              <li key={i} style={{ fontSize: '14px', color: 'var(--color-text)', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#d97706', fontWeight: 600 }}>!</span>
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Next Steps Strip */}
      <div className="card-cofounder" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ fontWeight: 600, fontSize: '16px' }}>Recommended Study Topics for Improvement</div>
          <button onClick={onNavigateRoadmap} className="btn-ghost" style={{ fontSize: '13px', color: 'var(--color-text)' }}>
            Open Full Learning Roadmap →
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
          {recommendedTopics.map((top) => (
            <div
              key={top}
              onClick={onNavigateRoadmap}
              style={{
                backgroundColor: 'var(--color-card-solid)',
                border: '1px solid var(--color-border-subtle)',
                padding: '10px 16px',
                borderRadius: 'var(--radius-button)',
                fontSize: '13px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Sparkles size={14} color="#2563eb" /> {top}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
