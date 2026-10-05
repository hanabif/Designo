import React, { useState } from 'react';
import { Sparkles, Download, ZoomIn, ZoomOut, Layers, Cpu } from 'lucide-react';
import { Button, Card, Badge } from './ui';

export const DiagramStudioView: React.FC = () => {
  const [mode, setMode] = useState<'generator' | 'review'>('generator');

  // Generator State
  const [prompt, setPrompt] = useState(
    'Design a real-time messaging pipeline handling 50k msgs/sec with WebSocket Envoy gateways, Apache Kafka event queues, Redis online status cluster, and ScyllaDB for chat history.'
  );
  const [selectedFormat, setSelectedFormat] = useState('Mermaid');
  const [isGenerating, setIsGenerating] = useState(false);

  const annotations = [
    {
      id: 'a1',
      type: 'Single Point of Failure (SPOF)',
      severity: 'Critical',
      variant: 'danger' as const,
      title: 'Postgres Primary Writer Lacks Multi-AZ Replica',
      explanation: 'If the primary database node crashes during traffic spikes, the write path goes completely offline. Mitigate with Aurora multi-AZ standby.',
    },
    {
      id: 'a2',
      type: 'Bottleneck Risk',
      severity: 'Medium',
      variant: 'warning' as const,
      title: 'Synchronous Timeline Fan-out Ingestion',
      explanation: 'Broadcasting messages directly to Redis follower timelines synchronously will block worker threads for accounts with >50k contacts.',
    },
    {
      id: 'a3',
      type: 'Optimization Opportunity',
      severity: 'Low',
      variant: 'primary' as const,
      title: 'Missing CDN Origin Shielding',
      explanation: 'Direct media uploads to S3 buckets should be fronted by Cloudflare edge caching to absorb redundant thumbnail downloads.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#e5e1ea]">
        <div>
          <Badge variant="primary" icon={<Cpu size={13} />} className="mb-2">
            DIAGRAM ENGINE // MERMAID &amp; SVG SYNTHESIZER
          </Badge>
          <h1 className="font-display font-bold text-3xl text-[#0a0a0f]">
            {mode === 'generator' ? 'Architecture Diagram Generator' : 'Architecture Audit & SPOF Review'}
          </h1>
          <p className="text-xs text-[#5e5e6e] mt-1">
            {mode === 'generator'
              ? 'Generate production-grade topologies from natural language specifications.'
              : 'Automated vulnerability scanner identifying bottlenecks, SPOFs, and partition failure points.'}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center p-1 rounded-full bg-[#f4f1fb] border border-[#e5e1ea]">
          <button
            onClick={() => setMode('generator')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === 'generator'
                ? 'bg-[#0a0a0f] text-white shadow-xs'
                : 'text-[#5e5e6e] hover:text-[#0a0a0f]'
            }`}
          >
            Diagram Generator
          </button>
          <button
            onClick={() => setMode('review')}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
              mode === 'review'
                ? 'bg-[#0a0a0f] text-white shadow-xs'
                : 'text-[#5e5e6e] hover:text-[#0a0a0f]'
            }`}
          >
            SPOF &amp; Risk Audit
          </button>
        </div>
      </div>

      {/* Mode 1: Generator */}
      {mode === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Controls (4 cols) */}
          <Card padding="md" className="lg:col-span-4 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
                  System Architecture Prompt
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full p-3 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white resize-none"
                  placeholder="Describe system components, scale parameters, and databases..."
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
                  Export Format
                </label>
                <div className="flex gap-2">
                  {['Mermaid', 'SVG Topology', 'ASCII'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setSelectedFormat(fmt)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                        selectedFormat === fmt
                          ? 'bg-[#ede9fe] text-[#6b38d4] border-[#6b38d4]'
                          : 'bg-[#faf9fc] text-[#5e5e6e] border-[#e5e1ea] hover:bg-white'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
                  Inject Components
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {['Envoy Proxy', 'Kafka Cluster', 'Redis GeoSet', 'Postgres 16', 'ScyllaDB', 'S3 Origin'].map(
                    (comp) => (
                      <button
                        key={comp}
                        onClick={() => setPrompt((prev) => `${prev}, include ${comp}`)}
                        className="px-2.5 py-1 rounded-full bg-[#f4f1fb] hover:bg-[#ede9fe] text-[10px] font-mono text-[#5e5e6e] hover:text-[#6b38d4] border border-[#e5e1ea] transition-colors cursor-pointer"
                      >
                        + {comp}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            <Button
              variant="dark"
              size="md"
              fullWidth
              loading={isGenerating}
              iconLeft={<Sparkles size={14} />}
              onClick={() => {
                setIsGenerating(true);
                setTimeout(() => setIsGenerating(false), 800);
              }}
            >
              {isGenerating ? 'Synthesizing Architecture...' : 'Generate Architecture Diagram'}
            </Button>
          </Card>

          {/* Right Canvas (8 cols) */}
          <Card padding="md" className="lg:col-span-8 flex flex-col justify-between min-h-[500px]">
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e1ea]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#0a0a0f]">
                <Layers size={15} className="text-[#6b38d4]" />
                <span className="font-semibold">Topology Canvas // Real-Time Messaging Spec</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-1.5 rounded-lg border border-[#e5e1ea] text-[#5e5e6e] hover:bg-[#faf9fc] cursor-pointer"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg border border-[#e5e1ea] text-[#5e5e6e] hover:bg-[#faf9fc] cursor-pointer"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={14} />
                </button>
                <Button variant="outline" size="sm" iconLeft={<Download size={13} />}>
                  Export
                </Button>
              </div>
            </div>

            {/* Architecture Node Visual */}
            <div className="my-auto py-8 px-4 rounded-xl bg-[#faf9fe] border border-[#e5e1ea] flex flex-col items-center justify-center space-y-4">
              <div className="p-3.5 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-xs font-semibold text-[#0a0a0f] w-72 text-center">
                Client Layer (Web / iOS / Android)
              </div>
              <span className="font-mono text-[10px] text-[#8e8ea0]">↓ WSS (TLS 1.3)</span>

              <div className="p-3.5 rounded-xl bg-[#ede9fe] border border-[#8b5cf6]/30 shadow-xs text-xs font-bold text-[#6b38d4] w-80 text-center">
                Edge Gateway (Envoy Proxy + JWT Auth)
              </div>
              <span className="font-mono text-[10px] text-[#8e8ea0]">↓ Async Pub/Sub</span>

              <div className="grid grid-cols-3 gap-3 w-full max-w-lg">
                <div className="p-3 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-center">
                  <div className="font-mono text-[10px] text-[#8e8ea0]">Queue</div>
                  <div className="font-bold text-xs text-[#0a0a0f] mt-1">Kafka Cluster</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-center">
                  <div className="font-mono text-[10px] text-[#8e8ea0]">Status Cache</div>
                  <div className="font-bold text-xs text-[#0a0a0f] mt-1">Redis Clustered</div>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-center">
                  <div className="font-mono text-[10px] text-[#8e8ea0]">History Store</div>
                  <div className="font-bold text-xs text-[#0a0a0f] mt-1">ScyllaDB / Cassandra</div>
                </div>
              </div>
            </div>

            {/* Bottom Sizing */}
            <div className="pt-3 border-t border-[#e5e1ea] flex items-center justify-between text-xs font-mono text-[#5e5e6e]">
              <span>Throughput: <strong>50,000 writes/sec</strong></span>
              <span>Replication Factor: <strong>3</strong></span>
              <span className="text-emerald-600 font-semibold">Active Standby Ready</span>
            </div>
          </Card>
        </div>
      )}

      {/* Mode 2: SPOF & Risk Review */}
      {mode === 'review' && (
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">
              Detected Vulnerabilities &amp; Bottlenecks (3 Issues Found)
            </h3>
            <p className="text-xs text-[#5e5e6e] mb-6">
              AI scanned your proposed topology against high-scale distributed failure conditions.
            </p>

            <div className="space-y-4">
              {annotations.map((ann) => (
                <div
                  key={ann.id}
                  className="p-5 rounded-2xl bg-[#faf9fc] border border-[#e5e1ea] flex flex-col sm:flex-row items-start justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={ann.variant}>
                        {ann.severity.toUpperCase()} // {ann.type}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-sm text-[#0a0a0f]">{ann.title}</h4>
                    <p className="text-xs text-[#5e5e6e] leading-relaxed max-w-2xl">{ann.explanation}</p>
                  </div>

                  <Button variant="secondary" size="sm" className="shrink-0">
                    Apply Recommended Fix
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
