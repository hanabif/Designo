import React, { useEffect, useRef, useState } from 'react';

/**
 * Mermaid renders fully client-side (no API key, no network calls).
 * The library is lazy-loaded so it only lands in the bundle chunk when a
 * diagram is actually shown.
 */
let mermaidLib: Promise<typeof import('mermaid').default> | null = null;
let initDone = false;

function loadMermaid() {
  if (!mermaidLib) {
    mermaidLib = import('mermaid').then(async (m) => {
      const mermaid = m.default;
      if (!initDone) {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'base',
          themeVariables: {
            primaryColor: '#ede9fe',
            primaryTextColor: '#0a0a0f',
            primaryBorderColor: '#6b38d4',
            secondaryColor: '#f4f1fb',
            tertiaryColor: '#faf9fe',
            lineColor: '#8e8ea0',
            fontFamily: "'Inter', sans-serif",
            fontSize: '14px',
          },
          flowchart: { htmlLabels: true, useMaxWidth: true, curve: 'basis' },
          securityLevel: 'strict',
        });
        initDone = true;
      }
      return mermaid;
    });
  }
  return mermaidLib;
}

export interface MermaidDiagramProps {
  /** Raw Mermaid source returned by the backend (e.g. `graph TD ...`). */
  code: string;
  /** Render scale, where 1 = 100% of the container width. */
  zoom?: number;
  className?: string;
}

/**
 * Renders Mermaid source code to an inline SVG. Falls back to showing the
 * raw source (plus the parser error) if the diagram cannot be rendered,
 * so a malformed AI response never blanks the canvas.
 */
export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, zoom = 1, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderSeq = useRef(0);
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !code.trim()) {
      setIsRendering(false);
      return;
    }
    const seq = ++renderSeq.current;
    let cancelled = false;
    setIsRendering(true);

    (async () => {
      // Unique id per attempt: mermaid registers DOM ids from this and
      // refuses (or collides) when the same id renders twice.
      const renderId = `mmd-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
      try {
        const mermaid = await loadMermaid();
        const { svg, bindFunctions } = await mermaid.render(renderId, code);
        if (cancelled || seq !== renderSeq.current) return;
        el.innerHTML = svg;
        setError(null);
        bindFunctions?.(el);
      } catch (err) {
        // Mermaid leaves a helper <div> in document.body when a parse fails.
        document.getElementById(`d${renderId}`)?.remove();
        if (cancelled || seq !== renderSeq.current) return;
        el.innerHTML = '';
        setError(err instanceof Error ? err.message : 'Failed to render diagram.');
      } finally {
        if (!cancelled && seq === renderSeq.current) setIsRendering(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [code]);

  return (
    <div className={`relative ${className}`}>
      <style>{`
        .mermaid-canvas svg {
          width: 100% !important;
          height: auto !important;
          max-width: none !important;
          display: block;
        }
      `}</style>

      {/* Zoom is applied as layout width (not transform) so scrollbars track it. */}
      <div style={{ width: `${Math.max(zoom, 0.25) * 100}%` }}>
        <div
          ref={containerRef}
          className="mermaid-canvas"
          role="img"
          aria-label="Architecture diagram"
        />
      </div>

      {isRendering && !error && (
        <p className="py-6 text-center font-mono text-xs text-[#8e8ea0]">Rendering diagram…</p>
      )}

      {error && (
        <div className="space-y-3">
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-[#b45309]">
            The diagram could not be rendered ({error}). Showing raw Mermaid source instead.
          </p>
          <pre className="overflow-auto whitespace-pre-wrap rounded-xl border border-[#e5e1ea] bg-[#faf9fe] p-5 font-mono text-xs text-[#0a0a0f]">
            {code}
          </pre>
        </div>
      )}
    </div>
  );
};