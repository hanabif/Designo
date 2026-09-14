import React, { useState, useEffect, useRef } from 'react';
import { Cpu, Play, ShieldAlert, CheckCircle2, RefreshCw, AlertTriangle, Code } from 'lucide-react';
import mermaid from 'mermaid';
import { api } from '../services/api';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
});

export const DiagramStudioView: React.FC = () => {
  const [prompt, setPrompt] = useState('Design distributed CDN with origin shield & edge POPs');
  const [title, setTitle] = useState('Global CDN Architecture');
  const [diagram, setDiagram] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [reviewing, setReviewing] = useState(false);
  const mermaidRef = useRef<HTMLDivElement>(null);

  const defaultMermaidCode = `graph TD
  Client[Client Browser / Mobile] --> Edge[Edge POP Geo-DNS]
  Edge --> Cache{Edge LRU Cache}
  Cache -- Hit --> Delivery[Deliver Content]
  Cache -- Miss --> Shield[Origin Shield POP]
  Shield --> Storage[(AWS S3 / R2 Bucket)]`;

  useEffect(() => {
    renderMermaid(diagram?.diagramCode || defaultMermaidCode);
  }, [diagram]);

  const renderMermaid = async (code: string) => {
    if (!mermaidRef.current) return;
    try {
      mermaidRef.current.innerHTML = '';
      const { svg } = await mermaid.render(`mermaid-svg-${Date.now()}`, code);
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = svg;
      }
    } catch {
      if (mermaidRef.current) {
        mermaidRef.current.innerHTML = `<pre class="font-mono" style="padding:16px; background:#fff; border-radius:8px;">${code}</pre>`;
      }
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setReview(null);

    try {
      const data = await api.generateDiagram({ title, prompt });
      setDiagram(data);
    } catch (err) {
      // Fallback local synthesis
      setDiagram({
        id: 'diag-dev-1',
        title,
        prompt,
        diagramCode: `graph TD\n  Client[Mobile Client] --> GW[API Gateway]\n  GW --> Service[Core Microservice]\n  Service --> Cache[(Redis Cache)]\n  Service --> DB[(PostgreSQL)]`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    setReviewing(true);
    try {
      if (diagram?.id && !diagram.id.startsWith('diag-dev')) {
        const res = await api.reviewDiagram({ diagramId: diagram.id });
        setReview(res);
      } else {
        setTimeout(() => {
          setReview({
            completenessScore: 85,
            spofRisks: ['Single core microservice boundary without redundant replica scaling.'],
            securityRisks: ['Missing WAF and API token validation gateway.'],
            scalabilityRisks: ['Redis cache lacks clustering partition configuration.'],
            reliabilityRisks: ['No dead-letter queue configured on asynchronous DB worker.'],
            summary: 'Good structural baseline. Implement multi-AZ database replication and rate-limiting gateways for production stability.',
          });
          setReviewing(false);
        }, 1200);
      }
    } catch {
      setReviewing(false);
    }
  };

  return (
    <div className="container section-rhythm">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Cpu size={20} color="#f54e00" />
          <h2 className="display-lg">AI Diagram Generator & Architect Reviewer</h2>
        </div>
        <p style={{ color: 'var(--color-body)', fontSize: '16px' }}>
          Synthesize architecture flowcharts from natural language and run automated Single Point of Failure (SPOF) and risk audits.
        </p>
      </div>

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="card-surface" style={{ marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr 160px', gap: '16px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Diagram Title</label>
            <input
              type="text"
              className="text-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Architecture Specification Prompt</label>
            <input
              type="text"
              className="text-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Design Uber real-time driver location tracking with WebSocket gateway & Redis geospatial index"
              required
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ height: '44px' }}>
            {loading ? 'Synthesizing...' : 'Generate Diagram'}
          </button>
        </div>
      </form>

      {/* Main Diagram & Review Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Rendered Mermaid Canvas */}
        <div className="card-surface" style={{ minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              marginBottom: '20px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--color-hairline)',
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{diagram?.title || title}</h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="badge-pill">MERMAID.JS</span>
              <button onClick={handleReview} className="btn-secondary" disabled={reviewing} style={{ padding: '4px 12px', fontSize: '12px' }}>
                <ShieldAlert size={14} />
                {reviewing ? 'Auditing...' : 'Run AI Diagram Review'}
              </button>
            </div>
          </div>

          {/* SVG Container */}
          <div
            ref={mermaidRef}
            style={{
              flex: 1,
              backgroundColor: 'var(--color-canvas-soft)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--color-hairline)',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
              overflow: 'auto',
            }}
          />
        </div>

        {/* AI Diagram Review Report Panel */}
        <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 600 }}>Architectural Audit Report</h3>
            {review && <span className="badge-pill" style={{ backgroundColor: 'var(--color-ink)', color: '#fff' }}>Score: {review.completenessScore}/100</span>}
          </div>

          {!review ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--color-muted)' }}>
              <ShieldAlert size={40} color="var(--color-hairline-strong)" style={{ marginBottom: '12px' }} />
              <p style={{ fontSize: '14px' }}>Click "Run AI Diagram Review" to perform SPOF detection, security, and scalability risk analysis.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: 'var(--color-body)', lineHeight: 1.5 }}>{review.summary}</div>

              {/* SPOF Risks */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#cf2d56', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <AlertTriangle size={14} />
                  Single Points of Failure (SPOF)
                </div>
                {review.spofRisks?.map((risk: string, i: number) => (
                  <div key={i} className="ide-pane" style={{ fontSize: '12px', padding: '8px 12px', marginBottom: '4px', backgroundColor: '#fff' }}>
                    • {risk}
                  </div>
                ))}
              </div>

              {/* Security Risks */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ink)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  Security & Scalability Risks
                </div>
                {review.securityRisks?.concat(review.scalabilityRisks || []).map((risk: string, i: number) => (
                  <div key={i} className="ide-pane" style={{ fontSize: '12px', padding: '8px 12px', marginBottom: '4px', backgroundColor: 'var(--color-canvas-soft)' }}>
                    • {risk}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
