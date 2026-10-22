import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Cpu, LayoutGrid, BookOpen, Terminal, BarChart3, Map, Bell, Award, Clock, ChevronRight, PanelLeft } from 'lucide-react';
import { Button } from './ui';
import GridRise from './GridRise';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { Logo } from './Logo';
import { LandingHowItWorks } from './LandingHowItWorks';
import { LandingFeatures } from './LandingFeatures';
import GradientCTA from './GradientCTA';

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Sidebar navigation shown in the hero's live-dashboard mock. */
const DEMO_NAV: Array<{ label: string; icon: React.ElementType; active?: boolean }> = [
  { label: 'Dashboard', icon: LayoutGrid, active: true },
  { label: 'Questions', icon: BookOpen },
  { label: 'Simulator', icon: Terminal },
  { label: 'Diagram Studio', icon: Cpu },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Roadmap', icon: Map },
];

interface HeroLandingProps {
  onStartInterview?: () => void;
  onExploreQuestions?: () => void;
  onOpenAuth?: () => void;
  /** Signed-in user — the header swaps "Sign In" for "Dashboard". */
  user?: import('../types').User | null;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartInterview: propOnStartInterview,
  onOpenAuth,
  user,
}) => {
  const navigate = useNavigate();
  const onStartInterview = propOnStartInterview || (() => navigate('/dashboard'));

  // Transparent at the top so the GridRise background blends through the
  // header; a soft frosted surface only kicks in once the user scrolls past
  // the hero so overlapping content stays readable.
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setIsHeaderScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Under prefers-reduced-motion none of this runs and the page simply
      // renders in its final, static state (all tweens are gsap.from()).
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // 1. Hero entrance — badge → headline lines → copy/CTAs → terminal card
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from('[data-hero-badge]', { y: 14, autoAlpha: 0, duration: 0.45 })
          .from('[data-hero-line]', { y: 46, autoAlpha: 0, duration: 0.75, stagger: 0.08 }, '-=0.2')
          .from('[data-hero-aside]', { y: 22, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, '-=0.5')
          .from('[data-hero-card]', { y: 56, autoAlpha: 0, scale: 0.985, duration: 0.9 }, '-=0.35');

        // 2. Terminal card contents settle in as it scrolls into view
        gsap.from('[data-sim-reveal]', {
          y: 14,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#simulation', start: 'top 85%', once: true },
        });

        // 3. Benchmark figures count up when the strip enters the viewport
        gsap.utils.toArray<HTMLElement>('[data-counter]').forEach((el) => {
          const end = Number(el.dataset.counter ?? '0');
          const decimals = Number(el.dataset.decimals ?? '0');
          const suffix = el.dataset.suffix ?? '';
          const format = (value: number) =>
            `${value.toLocaleString('en-US', {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}${suffix}`;
          const counter = { value: 0 };
          el.textContent = format(0);
          gsap.fromTo(
            counter,
            { value: 0 },
            {
              value: end,
              duration: 1.6,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = format(counter.value);
              },
              scrollTrigger: { trigger: el, start: 'top 92%', once: true },
            }
          );
        });

        gsap.from('[data-bench-item]', {
          y: 20,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#benchmarks', start: 'top 88%', once: true },
        });

        // 4. Closing CTA banner
        gsap.from('[data-cta]', {
          y: 30,
          autoAlpha: 0,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: { trigger: '#start', start: 'top 88%', once: true },
        });
      });

      ScrollTrigger.refresh();
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className="bg-[#faf9fe] text-[#0a0a0f] pb-24 relative overflow-hidden">
      {/* ── Grid Rise WebGL background ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[680px] z-0 overflow-hidden"
      >
        <GridRise
          className="h-full w-full"
          color="#ffffff"
          relief={0}
          accent="#de7dfa"
          background="#f4f2f8"
          accentStrength={0.85}
          cellSize={0.06}
          gap={0.08}
          rounding={0.1}
          amplitude={0.05}
          lift={0.06}
          liftRadius={0.6}
          speed={0.6}
          zoom={4}
          orbit={45}
          distance={1.5}
          altitude={1}
          haze={1}
          samples={2}
          dpr={2}
          maxFps={60}
          drift={0.28}
          ease={0.1}
          interactive
          paused={false}
        />
        {/* fade-out at the bottom so the grid blends into the page */}
        <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-[#faf9fe] via-[#faf9fe]/70 to-transparent" />
        {/* side vignettes */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#faf9fe] to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#faf9fe] to-transparent" />
      </div>
      {/* Retained ambient glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#ede9fe]/50 via-[#f4f1fb]/20 to-transparent blur-[120px] rounded-full z-0" />
      <div className="pointer-events-none absolute top-48 right-[-140px] w-[500px] h-[500px] rounded-full border-[50px] border-[#ede9fe]/40 blur-[40px] z-0" />

      {/* Landing Top Nav — logo + auth actions only, blended over the grid */}
      <header
        className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
          isHeaderScrolled
            ? 'border-[#e5e1ea] bg-[#faf9fe]/80 backdrop-blur-md'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 18 }}
          >
            <Logo size={30} wordmarkClassName="text-[19px]" />
          </motion.div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="font-sans text-sm font-medium text-[#5e5e6e] hover:text-[#0a0a0f] transition-colors px-4 py-2 rounded-lg hover:bg-[#f0edf8]"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="font-sans text-sm font-medium text-[#5e5e6e] hover:text-[#0a0a0f] transition-colors px-4 py-2 rounded-lg hover:bg-[#f0edf8]"
              >
                Sign In
              </button>
            )}
            <Button
              variant="dark"
              size="sm"
              iconRight={<ArrowRight size={14} />}
              onClick={onStartInterview}
            >
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-16">

        {/* Editorial Headline Grid */}
        <div className="mb-20 max-w-5xl md:mb-28">
          <h1 className="font-display font-extrabold text-[44px] sm:text-[68px] lg:text-[80px] leading-[0.96] tracking-[-0.035em] text-[#0a0a0f]">
            <span data-hero-line className="block">Practice</span>
            <span data-hero-line className="block italic font-light text-[#6b38d4]">System Design</span>
            <span data-hero-line className="block">with AI.</span>
          </h1>
          <div data-hero-aside className="mt-8">
            <Button
              variant="dark"
              size="lg"
              iconRight={<ArrowRight size={16} />}
              onClick={onStartInterview}
            >
              Start Free Practice
            </Button>
          </div>
        </div>

        {/* Dedicated product-preview surface */}
        <div className="relative isolate overflow-hidden rounded-[2rem] border border-[#e5e1ea] bg-gradient-to-br from-[#f4f1fb] via-[#ede9fe] to-[#f7f5fa] px-4 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-[#8b5cf6]/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/80 blur-3xl" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3 px-1 sm:mb-8">
              <div>
                <div className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#6b38d4]">Inside your workspace</div>
                <h2 className="font-display text-xl font-bold tracking-tight text-[#0a0a0f] sm:text-2xl">Every session scored. Every gap, queued for drills.</h2>
              </div>
              <span className="font-mono text-[11px] text-[#5e5e6e]">Dashboard, history and next steps in one view</span>
            </div>

        {/* Live dashboard workspace */}
        <div id="simulation" data-hero-card className="relative w-full overflow-hidden rounded-2xl md:rounded-[1.75rem] bg-white text-[#0a0a0f] shadow-[0_24px_70px_-20px_rgba(67,42,117,0.28)] border border-white/90 scroll-mt-24">
          <div className="flex">
            {/* Sidebar */}
            <aside className="hidden w-56 shrink-0 flex-col border-r border-[#e5e1ea] bg-white p-4 lg:flex">
              <div className="mb-7 flex items-center justify-between">
                <Logo size={22} wordmarkClassName="text-[17px]" />
                <span className="flex h-6 w-6 items-center justify-center rounded-md border border-[#e5e1ea] text-[#8e8ea0]">
                  <PanelLeft size={12} />
                </span>
              </div>
              <div className="mb-2 px-3 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8e8ea0]">
                Workspace
              </div>
              <nav className="space-y-1">
                {DEMO_NAV.map(({ label, icon: Icon, active }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium ${
                      active ? 'bg-[#ede9fe] text-[#6b38d4]' : 'text-[#5e5e6e]'
                    }`}
                  >
                    <Icon size={15} className={active ? 'text-[#6b38d4]' : 'text-[#8e8ea0]'} />
                    {label}
                  </div>
                ))}
              </nav>
              <div className="mt-auto space-y-3 pt-5">
                <div className="border-t border-[#e5e1ea]" />
                <div className="flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium text-[#5e5e6e]">
                  <Bell size={15} className="text-[#8e8ea0]" />
                  Notifications
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#6b38d4]" />
                </div>
                <div className="flex items-center justify-center gap-2 rounded-full bg-[#0a0a0f] py-2.5 text-[13px] font-medium text-white">
                  <Play size={12} fill="currentColor" />
                  Mock Interview
                </div>
              </div>
            </aside>

            {/* Main dashboard surface */}
            <div className="min-w-0 flex-1 bg-[#faf9fe] p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e5e1ea] pb-5">
                <div data-sim-reveal>
                  <h3 className="font-display text-2xl font-extrabold tracking-[-0.02em] text-[#0a0a0f] sm:text-[32px] sm:leading-[1.08]">
                    Welcome back
                  </h3>
                  <p className="mt-2 text-xs text-[#5e5e6e] sm:text-[13px]">
                    Your dashboard reflects your saved interview sessions and feedback.
                  </p>
                </div>
                <div data-sim-reveal className="flex items-center gap-2.5">
                  <span className="rounded-full border border-[#dcd7e5] bg-white px-4 py-2.5 text-[13px] font-medium text-[#0a0a0f]">
                    Browse Library
                  </span>
                  <span className="flex items-center gap-2 rounded-full bg-[#0a0a0f] px-4 py-2.5 text-[13px] font-medium text-white">
                    <Play size={12} fill="currentColor" />
                    Launch Mock Interview
                  </span>
                </div>
              </div>

              {/* Stat cards */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div data-sim-reveal className="rounded-2xl border border-[#e5e1ea] bg-white p-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#5e5e6e]">
                    <span>Interviews Completed</span>
                    <Award size={16} className="text-[#6b38d4]" />
                  </div>
                  <div className="font-display text-5xl font-extrabold leading-none text-[#0a0a0f]">4</div>
                </div>

                <div data-sim-reveal className="rounded-2xl border border-[#e5e1ea] bg-white p-5">
                  <div className="mb-3 font-mono text-[11px] uppercase tracking-wider text-[#5e5e6e]">Average Score</div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-display text-5xl font-extrabold leading-none text-[#0a0a0f]">
                      80<span className="text-lg font-normal text-[#8e8ea0]">/100</span>
                    </div>
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-[#ede9fe] border-t-[#6b38d4] font-display text-xs font-bold text-[#6b38d4]">
                      80%
                    </div>
                  </div>
                </div>

                <div data-sim-reveal className="rounded-2xl border border-[#e5e1ea] bg-white p-5">
                  <div className="mb-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-wider text-[#5e5e6e]">
                    <span>Practice Time</span>
                    <Clock size={16} className="text-[#6b38d4]" />
                  </div>
                  <div className="flex items-baseline gap-1.5 font-display text-5xl font-extrabold leading-none text-[#0a0a0f]">
                    <span>32</span>
                    <span className="text-xl font-bold text-[#5e5e6e]">min</span>
                  </div>
                </div>
              </div>

              {/* Recent interviews + recommended drills */}
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div data-sim-reveal className="rounded-2xl border border-[#e5e1ea] bg-white p-5 lg:col-span-2">
                  <h4 className="font-display text-lg font-bold tracking-tight text-[#0a0a0f]">Recent Mock Interviews</h4>
                  <p className="mt-1 text-xs text-[#5e5e6e]">Turn-by-turn evaluations from your latest sessions</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[#e5e1ea] pt-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-sm font-bold text-[#0a0a0f]">Event Streaming Platform</span>
                        <span className="rounded-full bg-[#ede9fe] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#6b38d4]">General Track</span>
                      </div>
                      <div className="mt-1.5 font-mono text-[11px] text-[#8e8ea0]">10/10/2026 · 4 min · STAFF</div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-full border border-[#8b5cf6]/25 bg-[#f3f0ff] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#6b38d4]">In Progress</span>
                      <span className="flex items-center gap-1.5 rounded-full bg-[#6b38d4] px-4 py-1.5 text-xs font-medium text-white">
                        <Play size={11} fill="currentColor" />
                        Resume
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#dcd7e5] text-[#5e5e6e]">
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>

                <div data-sim-reveal className="rounded-2xl border border-[#e5e1ea] bg-white p-5">
                  <h4 className="font-display text-lg font-bold tracking-tight text-[#0a0a0f]">Recommended Next Drills</h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#5e5e6e]">Targeted exercises derived from your missed trade-offs in recent mock loops.</p>
                  <div className="mt-4 rounded-xl border border-[#e5e1ea] bg-[#faf9fe] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-[13px] font-semibold leading-snug text-[#0a0a0f]">Cloud Cost Optimization &amp; Frugal Architectures</span>
                      <span className="shrink-0 rounded-full bg-[#ede9fe] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#6b38d4]">High</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded bg-[#ede9fe] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#6b38d4]">High</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e8ea0]">Priority</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
          </div>
        </div>
      </section>


      {/* ── How it works + full feature breakdown ── */}
      <LandingHowItWorks />

      <LandingFeatures onFeatureAction={(to) => user ? navigate(to) : onOpenAuth?.()} />

      {/* CTA Banner — animated gradient card (Feral UI gradient engine) */}
      <section id="start" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <div
          data-cta
          className="relative rounded-3xl overflow-hidden shadow-xl isolate min-h-[320px] md:min-h-[380px] flex items-center"
        >
          {/* "Midnight bloom" animated FLOW gradient backdrop */}
          <GradientCTA
            className="pointer-events-none"
            speed={36}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', aspectRatio: 'auto' }}
          />
          {/* Legibility scrim — keeps copy readable over the moving gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(8,6,20,0.66)_0%,rgba(8,6,20,0.34)_46%,rgba(8,6,20,0)_78%)]"
          />
          <div className="relative z-10 p-8 md:p-14 w-full">
            <div className="max-w-xl">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3 drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)]">
                Ready to crush your next System Design loop?
              </h2>
              <p className="font-sans text-sm md:text-base text-white/85">
                Start a realistic mock interview right now. No credit card required.
              </p>
            </div>
            <div className="flex items-center gap-4 mt-7">
              <motion.div
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="shadow-[0_10px_30px_-8px_rgba(8,6,20,0.55)]"
                  iconRight={<ArrowRight size={16} />}
                  onClick={onStartInterview}
                >
                  Get Started
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
