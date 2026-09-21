import React, { useState } from 'react';
import { Sparkles, Upload, Download, Share2, ZoomIn, ZoomOut, History } from 'lucide-react';

export const DiagramStudioView: React.FC = () => {
  const [mode, setMode] = useState<'generator' | 'review'>('generator');

  // Generator State
  const [prompt, setPrompt] = useState('Design WhatsApp real-time messaging system with WebSockets, Cassandra message store, and Redis online status cache.');
  const [selectedFormat, setSelectedFormat] = useState('Mermaid');
  const [history] = useState([
    { title: 'WhatsApp Chat System', date: 'Sep 19', format: 'Mermaid' },
    { title: 'Uber Driver Matching', date: 'Sep 17', format: 'SVG' },
    { title: 'TinyURL Key Generation', date: 'Sep 12', format: 'Draw.io' },
  ]);

  const annotations = [
    {
      id: 'a1',
      type: 'Single Point of Failure',
      severity: 'High',
      color: '#dc2626',
      explanation: 'The primary MySQL master database has no standby replica. A hardware failure here crashes the entire write path.',
    },
    {
      id: 'a2',
      type: 'Scalability Risk',
      severity: 'Medium',
      color: '#d97706',
      explanation: 'The Timeline Push worker is synchronous. High-volume celebrity accounts will cause worker queue backups.',
    },
    {
      id: 'a3',
      type: 'Optimization Suggestion',
      severity: 'Low',
      color: '#2563eb',
      explanation: 'Introduce an Edge CDN Origin Shield to absorb static media requests before hitting origin S3 buckets.',
    },
  ];

  return (
    <div className="container section-padding">
      {/* Tab Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <span className="badge-accent" style={{ marginBottom: '6px' }}>
            <Sparkles size={12} /> Architecture Studio
          </span>
          <h1 style={{ fontSize: '32px', fontWeight: 400 }}>
            {mode === 'generator' ? 'Diagram Generator' : 'Diagram Review & SPOF Audit'}
          </h1>
        </div>

        {/* Mode Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--color-bg-secondary)', padding: '4px', borderRadius: 'var(--radius-button)' }}>
          <button
            onClick={() => setMode('generator')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-button)',
              border: 'none',
              backgroundColor: mode === 'generator' ? 'var(--color-card-solid)' : 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            Diagram Generator
          </button>
          <button
            onClick={() => setMode('review')}
            style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-button)',
              border: 'none',
              backgroundColor: mode === 'review' ? 'var(--color-card-solid)' : 'transparent',
              fontWeight: 500,
              fontSize: '14px',
              color: 'var(--color-text)',
              cursor: 'pointer',
            }}
          >
            Diagram Review (Audit)
          </button>
        </div>
      </div>

      {/* SCREEN 9: Diagram Generator */}
      {mode === 'generator' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px', minHeight: '520px' }}>
          {/* Left Panel: Controls & History */}
          <div className="card-solid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                System Architecture Prompt
              </label>
              <textarea
                className="input-cofounder"
                style={{ height: '110px', resize: 'none', marginBottom: '16px' }}
                placeholder="Describe the system you want to design... e.g. Design WhatsApp"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />

              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Output Format
              </label>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {['Mermaid', 'SVG', 'PNG', 'Draw.io'].map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setSelectedFormat(fmt)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 'var(--radius-pill)',
                      border: selectedFormat === fmt ? '1px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: selectedFormat === fmt ? 'var(--color-primary)' : 'var(--color-bg)',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {fmt}
                  </button>
                ))}
              </div>

              <button
                className="btn-dark"
                style={{ width: '100%', justifyContent: 'center', marginBottom: '28px' }}
              >
                <Sparkles size={16} color="var(--color-primary)" /> Generate Diagram
              </button>

              {/* History List */}
              <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                <History size={12} style={{ display: 'inline', marginRight: '4px' }} /> Previously Generated
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {history.map((h, i) => (
                  <div key={i} style={{ padding: '8px 12px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-button)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 500 }}>{h.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Canvas & Floating Toolbar */}
          <div className="card-cofounder" style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '440px' }}>
            {/* Floating Toolbar */}
            <div
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                backgroundColor: 'var(--color-card-solid)',
                border: '1px solid var(--color-border-subtle)',
                borderRadius: 'var(--radius-button)',
                padding: '4px 8px',
                display: 'flex',
                gap: '8px',
                boxShadow: 'var(--shadow-low)',
              }}
            >
              <button className="btn-ghost" style={{ padding: '4px' }} title="Zoom In"><ZoomIn size={16} /></button>
              <button className="btn-ghost" style={{ padding: '4px' }} title="Zoom Out"><ZoomOut size={16} /></button>
              <button className="btn-ghost" style={{ padding: '4px' }} title="Export"><Download size={16} /></button>
              <button className="btn-ghost" style={{ padding: '4px' }} title="Share"><Share2 size={16} /></button>
            </div>

            {/* Generated Node Graph Canvas */}
            <div style={{ width: '100%', maxWidth: '540px', backgroundColor: '#ffffff', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)', padding: '24px', boxShadow: 'var(--shadow-low)' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                graph TD // WhatsApp Architecture ({selectedFormat})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
                <div style={{ padding: '10px 20px', border: '2px solid var(--color-text)', borderRadius: 'var(--radius-button)', backgroundColor: 'var(--color-primary)', fontWeight: 600, fontSize: '14px' }}>
                  📱 WebSocket Mobile Gateway
                </div>
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>↓ TCP / TLS Persistent Session</div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ padding: '10px 16px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-button)', backgroundColor: 'var(--color-bg)', fontSize: '13px', fontWeight: 500 }}>
                    ⚡ Session Store (Redis Cluster)
                  </div>
                  <div style={{ padding: '10px 16px', border: '1px solid var(--color-border-strong)', borderRadius: 'var(--radius-button)', backgroundColor: 'var(--color-bg)', fontSize: '13px', fontWeight: 500 }}>
                    📦 Message DB (Cassandra)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCREEN 10: Diagram Review & SPOF Audit */}
      {mode === 'review' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Upload Zone */}
          <div
            className="card-solid"
            style={{
              border: '2px dashed var(--color-border-strong)',
              textAlign: 'center',
              padding: '36px',
              backgroundColor: 'var(--color-bg-secondary)',
              cursor: 'pointer',
            }}
          >
            <Upload size={32} color="var(--color-text-secondary)" style={{ marginBottom: '10px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 500 }}>Drag and drop your architecture diagram, or click to upload</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Accepts PNG, SVG, Draw.io files up to 25MB</p>
          </div>

          {/* Two Column Results */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px' }}>
            {/* Left: Diagram Visual with Annotated Markers */}
            <div className="card-solid" style={{ position: 'relative', minHeight: '380px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
                  Uploaded Diagram: system_architecture_sketch.png
                </div>

                {/* Annotated Diagram Node Graph */}
                <div style={{ padding: '24px', border: '1px solid var(--color-border-subtle)', borderRadius: 'var(--radius-card)', backgroundColor: '#ffffff', display: 'inline-block', position: 'relative' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div style={{ padding: '12px', border: '1px solid #171717', borderRadius: '8px' }}>Load Balancer</div>
                    <span>──►</span>
                    {/* SPOF Red Marker */}
                    <div style={{ position: 'relative', padding: '12px', border: '2px solid #dc2626', borderRadius: '8px', backgroundColor: '#fee2e2' }}>
                      Primary MySQL DB
                      <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#dc2626', color: '#fff', fontSize: '10px', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Review Report Cards */}
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 500, marginBottom: '16px' }}>Review Audit Report</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {annotations.map((ann) => (
                  <div key={ann.id} className="card-solid" style={{ borderLeft: `4px solid ${ann.color}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: ann.color }}>{ann.type}</span>
                      <span className="badge-subtle" style={{ fontSize: '11px' }}>{ann.severity} Severity</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>{ann.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
