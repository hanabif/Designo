import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, Download, ZoomIn, ZoomOut, Layers, Cpu, Code, Terminal, Maximize2, Minimize2 } from 'lucide-react';
import { Button, Card, Badge } from './ui';
import { api } from '../services/api';
import { MermaidDiagram } from './MermaidDiagram';
import { mermaidToAscii } from '../lib/mermaidAscii';

// Risk categories surfaced by the AI review, in display order.
const REVIEW_CATEGORIES = [
  { key: 'spofRisks', label: 'SPOF', severity: 'High', variant: 'warning' },
  { key: 'securityRisks', label: 'Security', severity: 'Risk', variant: 'danger' },
  { key: 'scalabilityRisks', label: 'Scalability', severity: 'Finding', variant: 'primary' },
  { key: 'reliabilityRisks', label: 'Reliability', severity: 'Finding', variant: 'primary' },
] as const;

export const DiagramStudioView: React.FC = () => {
  const [mode, setMode] = useState<'generator' | 'review'>('generator');

  // Generator State
  const [prompt, setPrompt] = useState(
    'Design a real-time messaging pipeline handling 50k msgs/sec with WebSocket Envoy gateways, Apache Kafka event queues, Redis online status cluster, and ScyllaDB for chat history.'
  );
  const [selectedFormat, setSelectedFormat] = useState('Mermaid');
  const [isGenerating, setIsGenerating] = useState(false);
  const [diagram, setDiagram] = useState<any>(null);
  const [review, setReview] = useState<any>(null);
  const [requestError, setRequestError] = useState('');
  // Canvas state: rendered SVG vs ASCII art vs raw Mermaid source, plus
  // toolbar zoom and a fullscreen overlay.
  const [viewMode, setViewMode] = useState<'rendered' | 'ascii' | 'source'>('rendered');
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const changeZoom = (delta: number) =>
    setZoom((z) => Math.min(2, Math.max(0.4, Math.round((z + delta) * 100) / 100)));

  // ASCII derivation never mutates state, so useMemo is the right tool; a
  // failed conversion falls back to the raw source with a note.
  const diagramCode = diagram?.diagramCode;
  const asciiResult = useMemo(() => {
    if (!diagramCode) return null;
    try {
      return { art: mermaidToAscii(diagramCode), error: '' };
    } catch (err) {
      return { art: '', error: err instanceof Error ? err.message : 'ASCII conversion failed.' };
    }
  }, [diagramCode]);

  // Escape exits fullscreen while the overlay is open.
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsFullscreen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen]);

  /** Download the current view: .svg / .txt / .mmd. */
  const exportDiagram = () => {
    if (!diagram?.diagramCode) return;
    const base = (diagram.title || 'diagram').replace(/[^\w-]+/g, '-').toLowerCase();
    let blob: Blob;
    let filename: string;
    const svgEl = canvasRef.current?.querySelector('svg');
    if (viewMode === 'ascii' && asciiResult?.art) {
      blob = new Blob([asciiResult.art], { type: 'text/plain' });
      filename = `${base}.txt`;
    } else if (viewMode === 'rendered' && svgEl) {
      const clone = svgEl.cloneNode(true) as SVGSVGElement;
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      blob = new Blob([new XMLSerializer().serializeToString(clone)], { type: 'image/svg+xml' });
      filename = `${base}.svg`;
    } else {
      blob = new Blob([diagram.diagramCode], { type: 'text/plain' });
      filename = `${base}.mmd`;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };
  useEffect(() => {
    api.getDiagrams().then((items) => { if (items.length) setDiagram(items[0]); }).catch((error: Error) => setRequestError(error.message));
  }, []);
  const generateDiagram = async () => {
    setIsGenerating(true);
    setRequestError('');
    try {
      const result = await api.generateDiagram({ title: 'Architecture Diagram', prompt, format: selectedFormat === 'SVG Topology' ? 'SVG' : 'MERMAID' });
      setDiagram(result);
      setReview(null);
    } catch (error) { setRequestError(error instanceof Error ? error.message : 'Diagram generation failed.'); }
    finally { setIsGenerating(false); }
  };
  const reviewDiagram = async () => {
    if (!diagram?.id) { setRequestError('Generate or select a saved diagram before reviewing it.'); return; }
    setIsGenerating(true);
    setRequestError('');
    try { setReview(await api.reviewDiagram({ diagramId: diagram.id })); }
    catch (error) { setRequestError(error instanceof Error ? error.message : 'Diagram review failed.'); }
    finally { setIsGenerating(false); }
  };

  // Flatten the AI review into per-category findings so each badge shows
  // WHERE the AI found the risk (SPOF / Security / Scalability / Reliability).
  const annotations = review
    ? REVIEW_CATEGORIES.flatMap((category) =>
        (Array.isArray(review[category.key]) ? review[category.key] : []).map((title: string, index: number) => ({
          id: `${category.key}-${index}`,
          title,
          explanation: review.summary,
          severity: category.severity,
          type: category.label,
          variant: category.variant,
        })),
      )
    : [];

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
                      onClick={() => {
                        setSelectedFormat(fmt);
                        // The chosen export format also selects how the
                        // canvas presents it: SVG Topology and Mermaid show
                        // the rendered graph; ASCII switches to box art.
                        setViewMode(fmt === 'ASCII' ? 'ascii' : 'rendered');
                      }}
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
              onClick={generateDiagram}
            >
              {isGenerating ? 'Synthesizing Architecture...' : 'Generate Architecture Diagram'}
            </Button>
          </Card>

          {/* Right Canvas (8 cols) — doubles as the fullscreen overlay */}
          <Card
            padding="md"
            className={`flex flex-col justify-between ${
              isFullscreen
                ? 'fixed inset-2 z-[60] min-h-0 overflow-auto shadow-[0_20px_60px_rgba(10,10,15,0.4)]'
                : 'lg:col-span-8 min-h-[500px]'
            }`}
          >
            {/* Canvas Toolbar */}
            <div className="flex items-center justify-between pb-4 border-b border-[#e5e1ea]">
              <div className="flex items-center gap-2 font-mono text-xs text-[#0a0a0f]">
                <Layers size={15} className="text-[#6b38d4]" />
              <span className="font-semibold">{diagram?.title || 'Generated topology'}</span>
                {diagram?.aiProvider && (
                  <span title={`Model: ${diagram.aiModel}`}>
                    <Badge variant={diagram.aiProvider === 'deterministic-fallback' ? 'warning' : 'primary'}>
                      {diagram.aiProvider === 'deterministic-fallback' ? 'LOCAL SAMPLE' : `AI // ${diagram.aiProvider}`}
                    </Badge>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg border border-[#e5e1ea] p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('rendered')}
                    aria-pressed={viewMode === 'rendered'}
                    className={`rounded-md px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                      viewMode === 'rendered' ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                    }`}
                  >
                    Rendered
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('ascii')}
                    aria-pressed={viewMode === 'ascii'}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                      viewMode === 'ascii' ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                    }`}
                  >
                    <Terminal size={12} /> ASCII
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('source')}
                    aria-pressed={viewMode === 'source'}
                    className={`flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold cursor-pointer ${
                      viewMode === 'source' ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                    }`}
                  >
                    <Code size={12} /> Source
                  </button>
                </div>
                <button
                  className="p-1.5 rounded-lg border border-[#e5e1ea] text-[#5e5e6e] hover:bg-[#faf9fc] cursor-pointer disabled:opacity-40"
                  aria-label="Zoom in"
                  onClick={() => changeZoom(0.15)}
                  disabled={viewMode !== 'rendered' || zoom >= 2}
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg border border-[#e5e1ea] text-[#5e5e6e] hover:bg-[#faf9fc] cursor-pointer disabled:opacity-40"
                  aria-label="Zoom out"
                  onClick={() => changeZoom(-0.15)}
                  disabled={viewMode !== 'rendered' || zoom <= 0.4}
                >
                  <ZoomOut size={14} />
                </button>
                <button
                  className="p-1.5 rounded-lg border border-[#e5e1ea] text-[#5e5e6e] hover:bg-[#faf9fc] cursor-pointer"
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Open fullscreen'}
                  aria-pressed={isFullscreen}
                  onClick={() => setIsFullscreen((v) => !v)}
                >
                  {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
                </button>
                <Button variant="outline" size="sm" iconLeft={<Download size={13} />} onClick={exportDiagram} disabled={!diagram?.diagramCode}>
                  {viewMode === 'ascii' ? 'Export TXT' : viewMode === 'rendered' ? 'Export SVG' : 'Export MMD'}
                </Button>
              </div>
            </div>

            {/* Architecture Node Visual */}
            {requestError && <p role="alert" className="mb-3 text-sm text-red-700">{requestError}</p>}
            {diagram?.aiProvider === 'deterministic-fallback' && (
              <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-[#b45309]">
                No live AI provider is configured — this is the built-in sample topology. Set GEMINI_API_KEY or GROQ_API_KEY in your backend .env to generate real AI diagrams.
              </p>
            )}
            {viewMode === 'rendered' ? (
              <div
                ref={canvasRef}
                className={`overflow-auto rounded-xl border border-[#e5e1ea] bg-white p-5 ${
                  isFullscreen ? 'flex-1 min-h-0' : 'my-auto max-h-[420px]'
                }`}
              >
                {diagram?.diagramCode ? (
                  <MermaidDiagram code={diagram.diagramCode} zoom={zoom} />
                ) : (
                  <p className="py-10 text-center text-xs text-[#8e8ea0]">
                    Generate a diagram to see the rendered architecture.
                  </p>
                )}
              </div>
            ) : viewMode === 'ascii' ? (
              <div className={`overflow-auto rounded-xl border border-[#e5e1ea] bg-[#0a0a0f] p-5 ${
                isFullscreen ? 'flex-1 min-h-0' : 'my-auto max-h-[420px]'
              }`}>
                {asciiResult?.art ? (
                  <pre className="whitespace-pre font-mono text-xs leading-[1.4] text-[#a7f3d0]">{asciiResult.art}</pre>
                ) : (
                  <pre className="whitespace-pre-wrap font-mono text-xs text-[#8e8ea0]">
                    {asciiResult?.error
                      ? `ASCII view unavailable: ${asciiResult.error}\n\n${diagram?.diagramCode ?? ''}`
                      : 'Generate a diagram to see its ASCII topology.'}
                  </pre>
                )}
              </div>
            ) : (
              <pre className={`overflow-auto whitespace-pre-wrap rounded-xl border border-[#e5e1ea] bg-[#faf9fe] p-5 font-mono text-xs text-[#0a0a0f] ${
                isFullscreen ? 'flex-1 min-h-0' : 'my-auto max-h-[420px]'
              }`}>{diagram?.diagramCode || 'Generate a diagram to see the Mermaid architecture returned by the backend.'}</pre>
            )}

            {/* Bottom Sizing */}
            <div className="pt-3 border-t border-[#e5e1ea] flex items-center justify-between text-xs font-mono text-[#5e5e6e]">
              <span>Format: <strong>{diagram?.format || '—'}</strong></span>
              <span className="hidden sm:inline">
                {isFullscreen ? 'Press Esc to exit fullscreen' : `Saved: ${diagram ? new Date(diagram.createdAt).toLocaleString() : '—'}`}
              </span>
              <div className="flex items-center gap-2">
                {isFullscreen && (
                  <Button variant="outline" size="sm" iconLeft={<Minimize2 size={13} />} onClick={() => setIsFullscreen(false)}>
                    Exit fullscreen
                  </Button>
                )}
                <Button variant="outline" size="sm" loading={isGenerating} onClick={reviewDiagram}>Review diagram</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Mode 2: SPOF & Risk Review */}
      {mode === 'review' && (
        <div className="space-y-6">
          <Card padding="lg">
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">
              AI Review Findings {review ? `(${annotations.length})` : ''}
              {review?.aiProvider && (
                <Badge
                  variant={review.aiProvider === 'deterministic-fallback' ? 'warning' : 'primary'}
                  className="ml-2 align-middle"
                >
                  {review.aiProvider === 'deterministic-fallback' ? 'LOCAL SAMPLE' : `AI // ${review.aiProvider}`}
                </Badge>
              )}
            </h3>
            <p className="text-xs text-[#5e5e6e] mb-6">Review the currently saved topology for single points of failure, security, scalability, and reliability risks.</p>
            {requestError && <p role="alert" className="mb-3 text-sm text-red-700">{requestError}</p>}
            {review && <p className="mb-4 rounded-xl bg-[#f3f0ff] p-4 text-sm text-[#5e5e6e]">Completeness: <strong>{review.completenessScore}/100.</strong> {review.summary}</p>}
            {review?.aiProvider === 'deterministic-fallback' && (
              <p className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-[#b45309]">
                Built-in sample results shown — set GEMINI_API_KEY or GROQ_API_KEY in your backend .env to run live AI audits.
              </p>
            )}
            {!review && <Button variant="dark" size="sm" loading={isGenerating} className="mb-4" onClick={reviewDiagram}>Run AI review</Button>}

            <div className="space-y-4">
              {annotations.map((ann: any) => (
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

                  <span className="shrink-0 text-xs text-[#8e8ea0]">AI suggestion</span>
                </div>
              ))}
              {review && annotations.length === 0 && <p className="text-sm text-[#5e5e6e]">No findings were returned for this diagram.</p>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
