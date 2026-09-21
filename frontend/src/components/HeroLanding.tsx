import React from 'react';
import { ArrowRight, Play, Check, Sparkles } from 'lucide-react';

interface HeroLandingProps {
  onStartInterview: () => void;
  onExploreQuestions: () => void;
  onSelectPricing?: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartInterview,
  onExploreQuestions,
  onSelectPricing,
}) => {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', paddingBottom: '64px' }}>
      {/* Hero Section */}
      <section className="section-padding" style={{ textAlign: 'center', paddingTop: '72px', paddingBottom: '48px' }}>
        <div className="container">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <span className="badge-accent">
              <Sparkles size={12} /> Designo AI Platform v1.0
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              Structured mock interviews & architecture diagram feedback
            </span>
          </div>

          <h1 className="display-mega" style={{ maxWidth: '920px', margin: '0 auto 20px auto' }}>
            Master the System Design Interview — with an AI that never gets tired
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--color-text-secondary)', maxWidth: '720px', margin: '0 auto 36px auto', lineHeight: 1.6 }}>
            Practice realistic mock interviews, get objective scores, and close your knowledge gaps — on your schedule.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onStartInterview} className="btn-accent" style={{ padding: '12px 24px', fontSize: '16px' }}>
              Get Started Free <ArrowRight size={16} />
            </button>

            <button onClick={onExploreQuestions} className="btn-filled" style={{ padding: '12px 24px', fontSize: '16px' }}>
              <Play size={16} /> Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Floating Mock UI Visual */}
      <section className="container" style={{ marginBottom: '64px' }}>
        <div className="card-cofounder" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Header Bar */}
          <div
            style={{
              height: '40px',
              backgroundColor: 'var(--color-bg-secondary)',
              borderBottom: '1px solid var(--color-border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', marginLeft: '12px' }}>
                designo-live // session-481 // google-scale-track
              </span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <span className="badge-accent" style={{ fontSize: '11px', padding: '2px 8px' }}>Step 4: High-Level Design</span>
            </div>
          </div>

          {/* Split Content Visual: Live Chat Snippet + Architecture Fragment */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '380px' }}>
            {/* Left: Chat Snippet */}
            <div style={{ padding: '24px', borderRight: '1px solid var(--color-border-subtle)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>
                    AI
                  </div>
                  <div style={{ backgroundColor: 'var(--color-card-solid)', border: '1px solid var(--color-border-subtle)', padding: '12px 16px', borderRadius: 'var(--radius-card)', fontSize: '14px', flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>AI INTERVIEWER</div>
                    How will your fan-out engine deliver feed items to 10M active users when a top celebrity posts?
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-end', maxWidth: '85%' }}>
                  <div style={{ backgroundColor: 'var(--color-dark-btn)', color: '#ffffff', padding: '12px 16px', borderRadius: 'var(--radius-card)', fontSize: '14px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.8, marginBottom: '4px' }}>YOU (CANDIDATE)</div>
                    We implement a hybrid fan-out model: Push for regular users to Redis Timeline lists, Pull-on-read for accounts with {'>'}100k followers to avoid write amplification.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                <input className="input-cofounder" placeholder="Type your architecture response..." readOnly value="Adding Kafka message partitioning by User ID..." />
                <button className="btn-dark" onClick={onStartInterview}>Send</button>
              </div>
            </div>

            {/* Right: Architecture Diagram Fragment */}
            <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <div style={{ width: '100%', maxWidth: '360px', backgroundColor: 'var(--color-card-solid)', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)', padding: '20px', boxShadow: 'var(--shadow-low)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '12px', fontFamily: 'var(--font-mono)' }}>
                  Architecture Blueprint (Mermaid Fragment)
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
                  <div style={{ border: '1px border var(--color-border-strong)', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Client / Gateway</span>
                    <span>[GeoDNS]</span>
                  </div>
                  <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>↓</div>
                  <div style={{ border: '1px border var(--color-border-strong)', padding: '8px', borderRadius: '6px', backgroundColor: '#e6f4ef', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Fanout Workers</span>
                    <span>[Kafka Cluster]</span>
                  </div>
                  <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>↓</div>
                  <div style={{ border: '1px border var(--color-border-strong)', padding: '8px', borderRadius: '6px', backgroundColor: 'var(--color-bg)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Timeline Cache</span>
                    <span>[Redis Cluster]</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works (3 Columns) */}
      <section className="container" style={{ marginBottom: '64px' }}>
        <h2 style={{ fontSize: '28px', textAlign: 'center', marginBottom: '36px' }}>How Designo Works</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          <div className="card-cofounder">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>
              1
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Interview</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Practice a structured, 9-stage mock interview with an AI interviewer tuned to real Tier-1 company standards.
            </p>
          </div>

          <div className="card-cofounder">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>
              2
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Evaluate</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Get an objective score across 7 weighted categories, pinpointing SPOF risks and architectural weak spots.
            </p>
          </div>

          <div className="card-cofounder">
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '18px', marginBottom: '16px' }}>
              3
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Learn</h3>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '15px' }}>
              Follow a personalized study roadmap built dynamically from your weakest performance categories.
            </p>
          </div>
        </div>
      </section>

      {/* Company-Track Strip */}
      <section style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '40px 0', marginBottom: '64px', borderTop: '1px solid var(--color-border-subtle)', borderBottom: '1px solid var(--color-border-subtle)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
            Targeted Interview Focus Tracks
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '24px' }}>
            {[
              { name: 'Google', focus: 'Scalability & Algorithms' },
              { name: 'Amazon', focus: 'Tradeoffs & Operations' },
              { name: 'Meta', focus: 'Massive Scale & Storage' },
              { name: 'Netflix', focus: 'High Reliability & Resiliency' },
            ].map((c) => (
              <div key={c.name} className="card-solid" style={{ padding: '16px 24px', minWidth: '200px' }}>
                <div style={{ fontWeight: 600, fontSize: '18px', marginBottom: '2px' }}>{c.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Focus: {c.focus}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview (3 Cards) */}
      <section className="container" style={{ marginBottom: '64px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 400, marginBottom: '8px' }}>Flexible Plans for Every Engineer</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>Start free, upgrade when you need unlimited mock interviews.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {/* Free Card */}
          <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Free</h3>
              <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>$0 <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/ month</span></div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> 3 mock interviews per month</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> Basic category score reports</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> Access to standard question bank</li>
              </ul>
            </div>
            <button onClick={onStartInterview} className="btn-filled" style={{ width: '100%', justifyContent: 'center' }}>Get Started Free</button>
          </div>

          {/* Pro Card (Highlighted Most Popular) */}
          <div className="card-solid" style={{ border: '2px solid var(--color-text)', backgroundColor: 'var(--color-primary)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '20px', backgroundColor: 'var(--color-dark-btn)', color: '#ffffff', fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: 'var(--radius-pill)' }}>
              Most Popular
            </div>

            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Pro</h3>
              <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>$29 <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--color-text-secondary)' }}>/ month</span></div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--color-text)" /> Unlimited mock interviews</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--color-text)" /> Advanced 7-category evaluation reports</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="var(--color-text)" /> Diagram Studio & SPOF risk auditor</li>
              </ul>
            </div>
            <button onClick={onStartInterview} className="btn-dark" style={{ width: '100%', justifyContent: 'center' }}>Upgrade to Pro</button>
          </div>

          {/* Enterprise Card */}
          <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '8px' }}>Enterprise</h3>
              <div style={{ fontSize: '32px', fontWeight: 600, marginBottom: '16px' }}>Custom</div>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '24px' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> Team seats & organizational analytics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> Custom company question tracks</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={16} color="#1f8a65" /> Admin management panel</li>
              </ul>
            </div>
            <button onClick={onSelectPricing} className="btn-filled" style={{ width: '100%', justifyContent: 'center' }}>Contact Sales</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '40px', fontSize: '14px', color: 'var(--color-text-secondary)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '6px' }}>Designo AI — System Design Interview Coach</div>
            <p style={{ fontSize: '13px' }}>Helping software engineers master architecture mock interviews.</p>
          </div>

          <div style={{ display: 'flex', gap: '40px' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Product</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                <span>Question Library</span>
                <span>Diagram Studio</span>
                <span>Learning Roadmap</span>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: 'var(--color-text)', marginBottom: '8px' }}>Company</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '13px' }}>
                <span>About Us</span>
                <span>Careers</span>
                <span>Privacy & Terms</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
