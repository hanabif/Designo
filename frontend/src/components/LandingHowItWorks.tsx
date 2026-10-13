import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion, useMotionTemplate, useSpring } from 'motion/react';
import { ArrowRight, Check, MessagesSquare, Target, UserRound } from 'lucide-react';
import { Badge } from './ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Step {
  id: 'target' | 'loop' | 'report';
  icon: React.ElementType;
  chip: string;
  title: string;
  text: string;
}

/**
 * No "Step 1 / Step 2" labels — each card is introduced by a thematic chip
 * and a self-explanatory mock-UI scene instead of a number.
 */
const STEPS: Step[] = [
  {
    id: 'target',
    icon: UserRound,
    chip: 'Target profile',
    title: 'Dial in your target',
    text: 'Onboarding captures your experience level, role, years and target company. The question mix, difficulty and evaluation bar all adapt to that profile.',
  },
  {
    id: 'loop',
    icon: MessagesSquare,
    chip: 'Live loop',
    title: 'Run a live mock loop',
    text: 'The AI interviewer drives a multi-stage session — requirements, high-level design, deep dives — while you sketch architecture in the Diagram Studio.',
  },
  {
    id: 'report',
    icon: Target,
    chip: 'Report card',
    title: 'Score, review, improve',
    text: 'Get a weighted report across Scope, HLD, Bottlenecks and Fault Tolerance, then follow an adaptive roadmap that targets your weakest concepts.',
  },
];

const HEADLINE_WORDS = 'From signup to offer in three moves'.split(' ');

const RING_RADIUS = 26;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
const SCORE = 82;

const SCORE_DIMS = [
  { label: 'Scope', value: 88 },
  { label: 'HLD', value: 74 },
  { label: 'Bottlenecks', value: 92 },
  { label: 'Fault tol.', value: 81 },
];

const AVATARS = [
  { initials: 'SD', gradient: 'linear-gradient(135deg, #8b5cf6, #d946ef)' },
  { initials: 'ML', gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)' },
  { initials: 'RK', gradient: 'linear-gradient(135deg, #10b981, #3b82f6)' },
];

const canHover =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;
const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;


/* ── Mock-UI visuals inside the card panels ── */

const TargetVisual: React.FC = () => (
  <div className="flex h-full w-full flex-col items-center justify-center gap-2.5">
    {/* Avatar cluster */}
    <div data-visual-piece className="flex">
      {AVATARS.map((avatar, index) => (
        <span
          key={avatar.initials}
          className={`hw-float flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white ${
            index > 0 ? '-ml-2.5' : ''
          }`}
          style={{
            backgroundImage: avatar.gradient,
            animationDelay: `${index * 0.45}s`,
          }}
        >
          {avatar.initials}
        </span>
      ))}
    </div>

    {/* Target chip */}
    <span
      data-visual-piece
      className="inline-flex items-center gap-1.5 rounded-full border border-[#e5e1ea] bg-white/85 px-2.5 py-1 font-mono text-[10px] text-[#5e5e6e] shadow-sm"
    >
      <Check size={11} className="text-emerald-600" />
      Staff · Google · 5 yrs
    </span>

    {/* CTA pill */}
    <span
      data-visual-piece
      className="inline-flex items-center gap-1.5 rounded-full bg-[#0a0a0f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-[0_10px_24px_-10px_rgba(10,10,15,0.5)] transition-shadow duration-300 hover:shadow-[0_14px_28px_-10px_rgba(10,10,15,0.6)]"
    >
      Start for free
      <ArrowRight
        size={13}
        className="transition-transform duration-200 group-hover:translate-x-0.5"
      />
    </span>

    {/* Script-style note with a hand-drawn arrow pointing back at the pill */}
    <span
      data-visual-piece
      className="flex items-center gap-1 text-[11px] italic text-[#8e8ea0]"
    >
      <svg
        width="20"
        height="14"
        viewBox="0 0 20 14"
        fill="none"
        aria-hidden="true"
        className="text-[#b6aed0]"
      >
        <path
          d="M1.5 12.5C3 6.5 8 3 16.5 3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M13.2 1L17 3.1L14.6 6.4"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      aimed straight at your offer
    </span>
  </div>
);

const LoopVisual: React.FC = () => (
  <div className="flex h-full w-full flex-col justify-center gap-2">
    <div
      data-visual-piece
      className="max-w-[88%] self-start rounded-2xl rounded-tl-sm border border-[#e5e1ea] bg-white/85 px-3 py-1.5 text-[11px] leading-snug text-[#3f3f4d] shadow-[0_2px_8px_-4px_rgba(10,10,15,0.12)]"
    >
      Design a rate limiter for 250k QPS
    </div>
    <div
      data-visual-piece
      className="max-w-[84%] self-end rounded-2xl rounded-br-sm bg-[#6b38d4] px-3 py-1.5 text-[11px] leading-snug text-white shadow-[0_8px_20px_-8px_rgba(107,56,212,0.45)]"
    >
      Requirements first — 10k rps per region
    </div>
    <div
      data-visual-piece
      className="self-start rounded-2xl rounded-tl-sm border border-[#e5e1ea] bg-white/85 px-3 py-2 shadow-sm"
      aria-hidden="true"
    >
      <span className="flex gap-1">
        <span
          className="hw-typing-dot h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/55"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="hw-typing-dot h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/55"
          style={{ animationDelay: '0.15s' }}
        />
        <span
          className="hw-typing-dot h-1.5 w-1.5 rounded-full bg-[#8b5cf6]/55"
          style={{ animationDelay: '0.3s' }}
        />
      </span>
    </div>
    <div data-visual-piece className="pt-1">
      <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-widest text-[#8e8ea0]">
        <span>Stage 2 · Deep dive</span>
        <span>60%</span>
      </div>
      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[#d6cdee]">
        <div
          data-bar-fill
          className="h-full w-[60%] origin-left rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"
        />
      </div>
    </div>
  </div>
);

const ReportVisual: React.FC = () => (
  <div className="flex h-full w-full flex-col justify-center gap-2.5">
    <span
      data-visual-piece
      className="inline-flex w-fit items-center gap-1.5 self-end rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-600"
    >
      <Check size={11} />
      Hire signal
    </span>
    <div data-visual-piece className="flex items-center gap-4">
      {/* Score ring */}
      <div className="relative h-[70px] w-[70px] shrink-0">
        <svg width="70" height="70" viewBox="0 0 70 70" className="-rotate-90">
          <circle
            cx="35"
            cy="35"
            r={RING_RADIUS}
            fill="none"
            stroke="rgba(107,56,212,0.16)"
            strokeWidth="7"
          />
          <circle
            data-score-ring
            cx="35"
            cy="35"
            r={RING_RADIUS}
            fill="none"
            stroke="url(#hw-score-gradient)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={RING_CIRCUMFERENCE * (1 - SCORE / 100)}
          />
          <defs>
            <linearGradient id="hw-score-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            data-score
            className="font-display text-xl font-bold tabular-nums text-[#0a0a0f]"
          >
            {SCORE}
          </span>
          <span className="font-mono text-[8px] uppercase tracking-widest text-[#8e8ea0]">
            score
          </span>
        </div>
      </div>
      {/* Weighted dimensions */}
      <div className="min-w-0 flex-1 space-y-2">
        {SCORE_DIMS.map((dim) => (
          <div key={dim.label}>
            <div className="flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[#8e8ea0]">
              <span className="truncate">{dim.label}</span>
              <span className="text-[#5e5e6e]">{dim.value}</span>
            </div>
            <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-[#d6cdee]">
              <div
                data-bar-fill
                style={{ width: `${dim.value}%` }}
                className="h-full origin-left rounded-full bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VISUALS: Record<Step['id'], React.FC> = {
  target: TargetVisual,
  loop: LoopVisual,
  report: ReportVisual,
};


/* ── Step card: dark mock panel + copy, with pointer tilt & spotlight ── */

const StepCard: React.FC<{ step: Step }> = ({ step }) => {
  const rotateX = useSpring(0, { stiffness: 170, damping: 18, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 170, damping: 18, mass: 0.5 });
  const spotX = useSpring(-320, { stiffness: 240, damping: 30 });
  const spotY = useSpring(-320, { stiffness: 240, damping: 30 });

  const spotlight = useMotionTemplate`radial-gradient(240px circle at ${spotX}px ${spotY}px, rgba(139, 92, 246, 0.20), rgba(139, 92, 246, 0.05) 45%, transparent 72%)`;

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!canHover || prefersReducedMotion()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateX.set((0.5 - py) * 7);
    rotateY.set((px - 0.5) * 8);
    spotX.set(event.clientX - rect.left);
    spotY.set(event.clientY - rect.top);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    spotX.set(-320);
    spotY.set(-320);
  };

  const Icon = step.icon;
  const Visual = VISUALS[step.id];

  return (
    <div data-step className="h-full">
      <motion.div
        className="h-full"
        style={{ rotateX, rotateY, transformPerspective: 1000 }}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      >
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e5e1ea] bg-white shadow-[0_2px_8px_-2px_rgba(10,10,15,0.06)] transition-[border-color,box-shadow] duration-300 hover:border-[#cbc3d7] hover:shadow-[0_22px_50px_-16px_rgba(107,56,212,0.3)]">
          {/* Soft lavender mock panel */}
          <div className="relative h-48 shrink-0 overflow-hidden border-b border-[#e5e1ea] bg-gradient-to-br from-[#f7f4ff] via-[#f2eefe] to-[#e8e0fb] sm:h-56">
            {/* Dot-grid texture */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(rgba(107,56,212,0.16) 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />
            {/* Ambient glows */}
            <div className="absolute -bottom-16 left-1/2 h-28 w-64 -translate-x-1/2 rounded-full bg-[#6b38d4] opacity-25 blur-3xl transition-opacity duration-500 group-hover:opacity-45" />
            <div className="absolute -right-10 -top-12 h-24 w-24 rounded-full bg-[#d946ef] opacity-15 blur-2xl transition-opacity duration-500 group-hover:opacity-30" />
            {/* Cursor-tracking spotlight */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{ background: spotlight }}
            />
            {/* Parallax layer (scrubbed by ScrollTrigger) */}
            <div
              data-visual-layer
              className="absolute inset-0 flex items-center justify-center p-4"
            >
              <div className="flex h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                <Visual />
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-1 flex-col gap-2.5 p-5 sm:p-6">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#e5e1ea] bg-[#f4f1fb] px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6b38d4]">
              <Icon size={11} strokeWidth={2.4} />
              {step.chip}
            </span>
            <h3 className="font-display text-lg font-bold text-[#0a0a0f]">
              {step.title}
            </h3>
            <p className="text-sm leading-relaxed text-[#5e5e6e]">{step.text}</p>
          </div>
        </article>
      </motion.div>
    </div>
  );
};


/**
 * Landing "How it works" section.
 *
 * Choreography — the moment the section scrolls into view (right after the
 * demo screen) the headline appears ALONE, word by word; a beat later the
 * badge, subcopy and the three cards slide in, followed by the mock-UI
 * scenes building themselves piece by piece.
 *
 * GSAP owns the scroll timeline (disabled under prefers-reduced-motion),
 * Motion owns the hover tilt / spotlight micro-interactions, and Lenis
 * drives the smooth scroll (kept in sync with ScrollTrigger in SmoothScroll).
 */
export const LandingHowItWorks: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const scoreEl = rootRef.current?.querySelector<HTMLElement>('[data-score]');

        // Master entrance timeline: headline alone first, then everything else.
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: rootRef.current,
            // Fire the instant the section peeks past the demo screen.
            start: 'top 92%',
            once: true,
          },
        });

        tl.from('[data-hw-word]', {
          yPercent: 118,
          autoAlpha: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power4.out',
        })
          .from(
            '[data-hw-badge]',
            { y: -12, autoAlpha: 0, scale: 0.85, duration: 0.45, ease: 'back.out(2.2)' },
            0.45
          )
          .from('[data-hw-sub]', { y: 16, autoAlpha: 0, duration: 0.55 }, 0.55)
          // The three cards slide in from below, converging from the sides.
          .from(
            '[data-step]',
            {
              y: 90,
              x: (index: number) => (index - 1) * 36,
              scale: 0.95,
              autoAlpha: 0,
              duration: 0.85,
              stagger: 0.12,
            },
            0.65
          )
          // Mock-UI scenes assemble piece by piece.
          .from('[data-visual-piece]', { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.05 }, 1.15)
          .from(
            '[data-bar-fill]',
            { scaleX: 0, transformOrigin: 'left center', duration: 0.8, stagger: 0.08, ease: 'power2.out' },
            1.35
          )
          .from(
            '[data-score-ring]',
            { strokeDashoffset: RING_CIRCUMFERENCE, duration: 1, ease: 'power2.out' },
            1.3
          );

        // Score counts up alongside the ring draw.
        if (scoreEl) {
          scoreEl.textContent = '0';
          const counter = { value: 0 };
          tl.to(
            counter,
            {
              value: SCORE,
              duration: 1,
              ease: 'power2.out',
              onUpdate: () => {
                scoreEl.textContent = String(Math.round(counter.value));
              },
            },
            1.35
          );
        }

        // Scrubbed parallax drift inside the dark panels while scrolling.
        gsap.utils.toArray<HTMLElement>('[data-visual-layer]').forEach((layer, index) => {
          gsap.fromTo(
            layer,
            { yPercent: index % 2 === 0 ? -5 : 5 },
            {
              yPercent: index % 2 === 0 ? 5 : -5,
              ease: 'none',
              scrollTrigger: {
                trigger: rootRef.current,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.8,
              },
            }
          );
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );


  return (
    <section
      id="how-it-works"
      ref={rootRef}
      className="max-w-7xl mx-auto px-6 md:px-12 pt-10 pb-16 md:pt-14 md:pb-24 scroll-mt-24"
    >
      <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
        <h2 className="font-display text-3xl font-bold leading-[1.1] text-[#0a0a0f] sm:text-4xl md:text-5xl">
          {HEADLINE_WORDS.map((word, index) => (
            <React.Fragment key={`${word}-${index}`}>
              {index > 0 && ' '}
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <span data-hw-word className="inline-block will-change-transform">
                  {word}
                </span>
              </span>
            </React.Fragment>
          ))}
        </h2>
        <div data-hw-badge className="mt-5">
          <Badge variant="primary">Signup → offer</Badge>
        </div>
        <p data-hw-sub className="mt-4 font-sans text-[#5e5e6e]">
          Designo mirrors the real loop: set your target, practise under pressure, then fix
          exactly what the evaluation flags.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STEPS.map((step) => (
          <StepCard key={step.id} step={step} />
        ))}
      </div>
    </section>
  );
};

export default LandingHowItWorks;

