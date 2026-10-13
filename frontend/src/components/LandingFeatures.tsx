import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, ChartColumn, Check, Library, MessagesSquare, Route, Workflow } from 'lucide-react';
import {
  DiagramStudioMock,
  EvaluationReportMock,
  LiveInterviewMock,
  QuestionBankMock,
  RoadmapMock,
} from './features/FeatureMocks';
import liveAiInterviewShot from '../assets/screenshots/live-ai-interview.png';
import evaluationReportsShot from '../assets/screenshots/evaluation-reports.png';
import diagramStudioShot from '../assets/screenshots/diagram-studio.png';
import questionBankShot from '../assets/screenshots/question-bank.png';
import adaptiveRoadmapShot from '../assets/screenshots/adaptive-roadmap.png';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Feature {
  /** Slug used for the real screenshot drop-in: /screenshots/features/<id>.png */
  id: string;
  icon: React.ElementType;
  tabTitle: string;
  tabBlurb: string;
  eyebrow: string;
  heading: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaTo: string;
  /** Real app screenshot bundled from src/assets/screenshots. */
  shot: string;
  Mock: React.FC;
}

/**
 * The five feature demos. Each tab shows a copy column on the left and the
 * feature's real app screenshot on the right (bundled from
 * src/assets/screenshots), with the palette-matched SVG mock layered behind
 * as a fallback while the image loads.
 */
const FEATURES: Feature[] = [
  {
    id: 'live-ai-interview',
    icon: MessagesSquare,
    tabTitle: 'Live AI Interview',
    tabBlurb: 'Real-time mock sessions',
    eyebrow: 'LIVE AI INTERVIEW',
    heading: 'An examiner that pushes back.',
    body: 'Multi-stage mock sessions where the AI probes requirements, challenges your trade-offs and stress-tests failure plans — out loud, in real time.',
    bullets: ['Four-stage loop: requirements → design → deep dive → retro', 'Follow-ups adapt to every answer you give', 'Score ticker updates while you talk'],
    ctaLabel: 'Start a session',
    ctaTo: '/interview',
    shot: liveAiInterviewShot,
    Mock: LiveInterviewMock,
  },
  {
    id: 'evaluation-reports',
    icon: ChartColumn,
    tabTitle: 'Evaluation Reports',
    tabBlurb: 'Weighted scoring & feedback',
    eyebrow: 'EVALUATION REPORTS',
    heading: 'Feedback with teeth.',
    body: 'Every session is scored on a weighted rubric — scope, high-level design, bottlenecks and fault tolerance — with per-dimension notes and a hire-signal rating.',
    bullets: ['Weighted rubric across four dimensions', 'Strengths and fix-first improvements', 'Hire-signal rating per session'],
    ctaLabel: 'See a report',
    ctaTo: '/report',
    shot: evaluationReportsShot,
    Mock: EvaluationReportMock,
  },
  {
    id: 'diagram-studio',
    icon: Workflow,
    tabTitle: 'Diagram Studio',
    tabBlurb: 'Mermaid & SVG canvas',
    eyebrow: 'DIAGRAM STUDIO',
    heading: 'Draw it. Then defend it.',
    body: 'Sketch architecture mid-interview on an infinite canvas — generate Mermaid from plain English and let the evaluator flag single points of failure.',
    bullets: ['AI-generated Mermaid & SVG output', 'SPF and concurrency bottleneck detection', 'Export to Mermaid, SVG or PNG'],
    ctaLabel: 'Open the studio',
    ctaTo: '/diagrams',
    shot: diagramStudioShot,
    Mock: DiagramStudioMock,
  },
  {
    id: 'question-bank',
    icon: Library,
    tabTitle: 'Question Bank',
    tabBlurb: 'Tiered scenario library',
    eyebrow: 'QUESTION BANK',
    heading: 'A library that levels with you.',
    body: 'Tiered system-design scenarios — from URL Shorteners to Global CDNs — filterable by difficulty, tag and company track.',
    bullets: ['Beginner → Staff difficulty tiers', 'Filter by tag, track and interview format', 'One click launches a tuned live session'],
    ctaLabel: 'Browse questions',
    ctaTo: '/questions',
    shot: questionBankShot,
    Mock: QuestionBankMock,
  },
  {
    id: 'adaptive-roadmap',
    icon: Route,
    tabTitle: 'Adaptive Roadmap',
    tabBlurb: 'Gap-targeted learning path',
    eyebrow: 'ADAPTIVE ROADMAP',
    heading: 'Your syllabus, rewritten weekly.',
    body: 'Scores feed a personalised path that targets your exact gaps — Raft, partitioning, rate limiting — and recalibrates after every report.',
    bullets: ['Gap-targeted concept sequence', 'Progress tracked per concept', 'Re-sorts after every evaluation'],
    ctaLabel: 'View roadmap',
    ctaTo: '/roadmap',
    shot: adaptiveRoadmapShot,
    Mock: RoadmapMock,
  },
];

/** Idle seconds before the showcase advances itself to the next tab. */
const AUTOPLAY_SECONDS = 6.5;

/**
 * Landing "Everything included" showcase (inspired by tabbed product tours).
 *
 * - Five feature tabs; clicking one crossfades the screen and restages copy.
 * - If the user leaves it alone for AUTOPLAY_SECONDS the tour advances itself
 *   (GSAP progress bar on the active tab); it pauses on hover/focus and while
 *   scrolled out of view, and is disabled entirely for reduced-motion users.
 * - Lenis (global SmoothScroll) drives the page; ScrollTrigger stays in sync
 *   via the lenis→ScrollTrigger bridge, so entrance reveals and the ambient
 *   blob parallax land smoothly.
 */
export const LandingFeatures: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const copyRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const progressTweenRef = useRef<gsap.core.Tween | null>(null);

  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [inView, setInView] = useState(false);

  const reduceMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  /* Scroll choreography: staged entrance, blob parallax, in-view tracking. */
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-feat-reveal]', {
          y: 28, autoAlpha: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
        });
        gsap.from('[data-feat-tab]', {
          y: 20, autoAlpha: 0, duration: 0.55, stagger: 0.06, ease: 'power2.out',
          scrollTrigger: { trigger: '[data-feat-tablist]', start: 'top 88%', once: true },
        });
        gsap.from('[data-feat-stage]', {
          y: 44, autoAlpha: 0, duration: 0.85, ease: 'power3.out',
          scrollTrigger: { trigger: '[data-feat-stage]', start: 'top 88%', once: true },
        });
        gsap.to('[data-feat-blob]', {
          yPercent: -18, ease: 'none',
          scrollTrigger: { trigger: rootRef.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
        });
      });

      const viewTrigger = ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top 75%',
        end: 'bottom 25%',
        onToggle: (self) => setInView(self.isActive),
      });
      return () => {
        viewTrigger.kill();
        mm.revert();
      };
    },
    { scope: rootRef },
  );

  /* Tab switching: crossfade stage panels, restage the copy column. */
  useGSAP(
    () => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        if (i === active) {
          gsap.fromTo(
            panel,
            { autoAlpha: 0, y: 24, scale: 0.985 },
            { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out', overwrite: 'auto' },
          );
        } else {
          gsap.to(panel, { autoAlpha: 0, y: -12, scale: 0.99, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        }
      });
      copyRefs.current.forEach((block, i) => {
        if (!block) return;
        if (i === active) {
          gsap.set(block, { autoAlpha: 1, y: 0 });
          gsap.fromTo(
            Array.from(block.children),
            { autoAlpha: 0, y: 16 },
            { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.06, ease: 'power2.out', overwrite: 'auto' },
          );
        } else {
          gsap.to(block, { autoAlpha: 0, duration: 0.25, ease: 'power1.out', overwrite: 'auto' });
        }
      });
    },
    { dependencies: [active], scope: rootRef, revertOnUpdate: true },
  );

  /* Idle autoplay: advance tabs when the user leaves the tour alone. */
  useEffect(() => {
    progressTweenRef.current?.kill();
    progressTweenRef.current = null;
    const bar = progressRef.current;
    if (!bar) return undefined;
    gsap.set(bar, { scaleX: 0, transformOrigin: 'left center' });
    if (reduceMotion || !inView) return undefined;
    const tween = gsap.to(bar, {
      scaleX: 1,
      duration: AUTOPLAY_SECONDS,
      ease: 'none',
      onComplete: () => setActive((current) => (current + 1) % FEATURES.length),
    });
    progressTweenRef.current = tween;
    return () => {
      tween.kill();
      progressTweenRef.current = null;
    };
  }, [active, inView, reduceMotion]);

  /* Pause the countdown while the user is hovering/focusing inside the section. */
  useEffect(() => {
    progressTweenRef.current?.paused(hovering);
  }, [hovering]);

  const handleTablistKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const dir = event.key === 'ArrowRight' ? 1 : -1;
    const next = (active + dir + FEATURES.length) % FEATURES.length;
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="features"
      ref={rootRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
      className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24 scroll-mt-24"
    >
      {/* Section header */}
      <div data-feat-reveal className="mb-10 text-center max-w-2xl mx-auto">
        
        <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[1.08] text-[#0a0a0f]">
          The whole interview loop, one workspace
        </h2>
        <p className="mt-4 font-sans text-[15px] leading-relaxed text-[#5e5e6e]">
          Five tools that feed each other — practise, get scored, fix the gap, repeat.
          Pick a tab, or let the tour itself.
        </p>
      </div>

      {/* Feature tabs (bordered strip, inspiration-style cells) */}
      <div
        data-feat-tablist
        role="tablist"
        aria-label="Platform features"
        onKeyDown={handleTablistKeyDown}
        className="mb-10 flex snap-x snap-mandatory overflow-x-auto rounded-2xl border border-[#e5e1ea] bg-white lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {FEATURES.map((feature, i) => {
          const Icon = feature.icon;
          const isActive = i === active;
          return (
            <button
              key={feature.id}
              ref={(el) => { tabRefs.current[i] = el; }}
              data-feat-tab
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={`feature-panel-${feature.id}`}
              id={`feature-tab-${feature.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative min-w-[196px] flex-1 snap-start border-r border-[#e5e1ea] px-5 py-4 text-left transition-colors last:border-r-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#8b5cf6]/50 ${isActive ? 'bg-[#faf9fe]' : 'hover:bg-[#f4f1fb]/60'}`}
            >
              <div className="flex items-center justify-between">
                <span className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-[#ede9fe] text-[#6b38d4]' : 'bg-[#f4f1fb] text-[#8e8ea0]'}`}>
                  <Icon size={16} />
                </span>
                <span className={`font-mono text-[10px] tracking-widest ${isActive ? 'text-[#6b38d4]' : 'text-[#cbc3d7]'}`}>
                  0{i + 1}
                </span>
              </div>
              <div className={`mt-2.5 text-[13px] font-bold ${isActive ? 'text-[#0a0a0f]' : 'text-[#5e5e6e]'}`}>
                {feature.tabTitle}
              </div>
              <div className="mt-0.5 truncate font-sans text-[11px] text-[#8e8ea0]">{feature.tabBlurb}</div>

              {isActive && (
                <>
                  {/* Corner ticks mark the active cell (inspiration detail) */}
                  <span aria-hidden="true" className="pointer-events-none absolute left-1.5 top-1.5 h-2 w-2 border-l border-t border-[#6b38d4]" />
                  <span aria-hidden="true" className="pointer-events-none absolute right-1.5 top-1.5 h-2 w-2 border-r border-t border-[#6b38d4]" />
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 left-1.5 h-2 w-2 border-b border-l border-[#6b38d4]" />
                  <span aria-hidden="true" className="pointer-events-none absolute bottom-1.5 right-1.5 h-2 w-2 border-b border-r border-[#6b38d4]" />
                  {/* Idle-autoplay countdown */}
                  {!reduceMotion && (
                    <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] overflow-hidden">
                      <span ref={(el) => { progressRef.current = el; }} className="block h-full w-full origin-left scale-x-0 bg-gradient-to-r from-[#6b38d4] to-[#8b5cf6]" />
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Split: copy left, feature screen right */}
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Copy column (one stacked block per feature) */}
        <div className="relative min-h-[420px] lg:col-span-4">
          {FEATURES.map((feature, i) => (
            <div
              key={feature.id}
              ref={(el) => { copyRefs.current[i] = el; }}
              aria-hidden={i !== active}
              className={`absolute inset-x-0 top-0 ${i === active ? '' : 'invisible opacity-0'}`}
            >
              <div className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6b38d4]">
                <span className="mr-2 inline-block h-2 w-2 bg-[#6b38d4]" />
                {String(i + 1).padStart(2, '0')} / 0{FEATURES.length} — {feature.eyebrow}
              </div>
              <h3 className="font-display text-[26px] font-bold leading-tight text-[#0a0a0f] lg:text-[30px]">
                {feature.heading}
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#5e5e6e]">{feature.body}</p>
              <ul className="mt-5 space-y-2">
                {feature.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 font-sans text-[13px] text-[#0a0a0f]">
                    <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ede9fe] text-[#6b38d4]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
              <Link
                to={feature.ctaTo}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0a0a0f] px-5 py-2.5 font-sans text-[13px] font-semibold text-white transition-colors hover:bg-[#1f1f29]"
              >
                {feature.ctaLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>

        {/* Stage: ambient blurred backdrop + white app frame */}
        <div data-feat-stage className="relative lg:col-span-8">
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden rounded-[28px] bg-[#f4f1fb]">
            <div data-feat-blob className="absolute -left-16 -top-20 h-72 w-72 rounded-full bg-[#8b5cf6]/30 blur-[70px]" />
            <div data-feat-blob className="absolute -bottom-24 right-0 h-80 w-80 rounded-full bg-[#6b38d4]/25 blur-[80px]" />
            <div data-feat-blob className="absolute right-1/4 top-1/3 h-60 w-60 rounded-full bg-[#d946ef]/15 blur-[70px]" />
          </div>

          <div className="relative overflow-hidden rounded-[20px] border border-white/70 bg-white shadow-[0_32px_64px_-24px_rgba(107,56,212,0.35)]">
            <div className="relative aspect-[16/10] w-full">
              {FEATURES.map((feature, i) => {
                const Mock = feature.Mock;
                const isActive = i === active;
                return (
                  <div
                    key={feature.id}
                    id={`feature-panel-${feature.id}`}
                    role="tabpanel"
                    aria-labelledby={`feature-tab-${feature.id}`}
                    ref={(el) => { panelRefs.current[i] = el; }}
                    aria-hidden={!isActive}
                    className={`absolute inset-0 ${isActive ? '' : 'invisible opacity-0'}`}
                  >
                    <Mock />
                    <img
                      src={feature.shot}
                      alt={`${feature.tabTitle} screenshot`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFeatures;

