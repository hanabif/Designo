import React from 'react';
import { Terminal, Cpu, ShieldAlert, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

interface HeroLandingProps {
  onStartInterview: () => void;
  onExploreQuestions: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartInterview,
  onExploreQuestions,
}) => {
  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Hero Band */}
      <section className="section-rhythm" style={{ textAlign: 'center', paddingTop: '96px', paddingBottom: '64px' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <span className="badge-pill">AI System Design Coach v1.0</span>
            <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Multi-stage mock interviews & diagram evaluation</span>
          </div>

          <h1 className="display-mega" style={{ maxWidth: '900px', margin: '0 auto 24px auto' }}>
            Quietly-confident AI interviewer for software architects.
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--color-body)', maxWidth: '680px', margin: '0 auto 40px auto', lineHeight: 1.6 }}>
            Designo simulates realistic multi-stage system design interviews, evaluates architecture diagrams, detects single points of failure, and delivers objective weighted scoring.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <button onClick={onStartInterview} className="btn-primary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              Start Live Interview Session
              <ArrowRight size={16} />
            </button>

            <button onClick={onExploreQuestions} className="btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
              Browse Question Bank
            </button>
          </div>
        </div>
      </section>

      {/* Signature IDE Mockup Card */}
      <section className="container">
        <div className="card-surface" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--color-hairline-strong)' }}>
          {/* Mockup Title bar */}
          <div
            style={{
              height: '40px',
              backgroundColor: 'var(--color-canvas)',
              borderBottom: '1px solid var(--color-hairline)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-muted)', marginLeft: '12px', fontFamily: 'var(--font-mono)' }}>
                designo-session // google-track // twitter-feed.sys
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="timeline-pill pill-thinking">Thinking</span>
              <span className="timeline-pill pill-grep">Grepping</span>
              <span className="timeline-pill pill-read">Reading</span>
              <span className="timeline-pill pill-edit">Editing</span>
              <span className="timeline-pill pill-done">Done</span>
            </div>
          </div>

          {/* IDE Panes split */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 340px', minHeight: '440px' }}>
            {/* Sidebar */}
            <div style={{ backgroundColor: 'var(--color-canvas-soft)', borderRight: '1px solid var(--color-hairline)', padding: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
                Interview Stages (9)
              </div>
              {[
                '1. Requirements Gathering',
                '2. Non-Functional Req.',
                '3. Capacity Estimation',
                '4. High-Level Design',
                '5. Detailed Design',
                '6. Scalability',
                '7. Reliability',
                '8. Trade-offs',
                '9. Final Assessment',
              ].map((stage, i) => (
                <div
                  key={stage}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '13px',
                    backgroundColor: i === 3 ? 'var(--color-surface-card)' : 'transparent',
                    color: i === 3 ? 'var(--color-primary)' : 'var(--color-body)',
                    fontWeight: i === 3 ? 600 : 400,
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                  }}
                >
                  <span>{stage}</span>
                  {i < 3 && <CheckCircle2 size={14} color="#1f8a65" />}
                </div>
              ))}
            </div>

            {/* Main Chat/Editor Pane */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Design Global Twitter / X News Feed</h3>
                  <span className="badge-pill">Google Focus Track</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div className="ide-pane" style={{ backgroundColor: '#ffffff', borderColor: 'var(--color-hairline-strong)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>
                      Interviewer (Stage 4: High-Level Design)
                    </div>
                    Let's move into High-Level Design. How would you structure the timeline fan-out service to handle 500 million active users where top creators have 100M+ followers?
                  </div>

                  <div className="ide-pane" style={{ backgroundColor: 'var(--color-canvas-soft)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-ink)', marginBottom: '6px', fontSize: '12px', textTransform: 'uppercase' }}>
                      Candidate
                    </div>
                    I propose a Hybrid Fan-out architecture: Push-based fan-out for standard users into Redis caching arrays, and Pull-based query-time fan-out for high-profile accounts to eliminate write amplifications.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <input
                  type="text"
                  className="text-input"
                  placeholder="Propose architecture or trade-off response..."
                  readOnly
                  value="I'll use Kafka partition keys based on User ID for ordered tweet delivery."
                />
                <button className="btn-primary" onClick={onStartInterview}>
                  Submit Turn
                </button>
              </div>
            </div>

            {/* Live Evaluation Right Bar */}
            <div style={{ backgroundColor: 'var(--color-canvas-soft)', borderLeft: '1px solid var(--color-hairline)', padding: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
                Real-Time Scoring Metrics
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  { name: 'Requirements Gathering', weight: '15%', score: 90 },
                  { name: 'Architecture Design', weight: '25%', score: 85 },
                  { name: 'Scalability & Fan-out', weight: '20%', score: 88 },
                  { name: 'Database & Caching', weight: '10%', score: 82 },
                  { name: 'Reliability & SPOF', weight: '15%', score: 80 },
                ].map((item) => (
                  <div key={item.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.score}/100</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--color-hairline)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.score}%`, backgroundColor: 'var(--color-primary)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="section-rhythm container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          <div className="card-surface">
            <Cpu size={28} color="#f54e00" style={{ marginBottom: '16px' }} />
            <h3 className="display-md" style={{ fontSize: '20px', marginBottom: '10px' }}>9-Stage Structured Interview Flow</h3>
            <p style={{ color: 'var(--color-body)', fontSize: '14px', lineHeight: 1.6 }}>
              From requirements gathering to non-functional constraints, capacity estimations, database sharding, and fault tolerance.
            </p>
          </div>

          <div className="card-surface">
            <Terminal size={28} color="#f54e00" style={{ marginBottom: '16px' }} />
            <h3 className="display-md" style={{ fontSize: '20px', marginBottom: '10px' }}>Mermaid Diagram Generator & Auditor</h3>
            <p style={{ color: 'var(--color-body)', fontSize: '14px', lineHeight: 1.6 }}>
              Synthesize flowcharts from natural language and run automated SPOF, security, scalability, and reliability risk audits.
            </p>
          </div>

          <div className="card-surface">
            <ShieldAlert size={28} color="#f54e00" style={{ marginBottom: '16px' }} />
            <h3 className="display-md" style={{ fontSize: '20px', marginBottom: '10px' }}>Personalized Learning Roadmap</h3>
            <p style={{ color: 'var(--color-body)', fontSize: '14px', lineHeight: 1.6 }}>
              Receive AI mentor recommendations targeting your exact weak score categories (e.g. sharding, CAP theorem, indexing).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
