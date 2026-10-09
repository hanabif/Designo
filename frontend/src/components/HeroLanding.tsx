import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Check, Sparkles, Cpu } from 'lucide-react';
import { Button, Badge } from './ui';
import { useLenisScroll } from '../hooks/useLenisScroll';
import GridRise from './GridRise';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { LandingHowItWorks } from './LandingHowItWorks';
import { LandingFeatures } from './LandingFeatures';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface HeroLandingProps {
  onStartInterview?: () => void;
  onExploreQuestions?: () => void;
  onSelectPricing?: () => void;
  onOpenAuth?: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartInterview: propOnStartInterview,
  onExploreQuestions: propOnExploreQuestions,
  onSelectPricing: propOnSelectPricing,
  onOpenAuth,
}) => {
  const navigate = useNavigate();
  const { scrollTo } = useLenisScroll();
  const onStartInterview = propOnStartInterview || (() => navigate('/dashboard'));
  const onExploreQuestions = propOnExploreQuestions || (() => navigate('/questions'));
  const onSelectPricing = propOnSelectPricing || (() => navigate('/billing'));

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
          className="w-full h-full"
          brightness={0.62}
          accentColor={[0.42, 0.22, 0.83]}
          riseStrength={1.15}
        />
        {/* fade-out at the bottom so the grid blends into the page */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#faf9fe] to-transparent" />
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
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: -8, scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 18 }}
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6b38d4] to-[#8b5cf6] flex items-center justify-center shadow-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" fillOpacity="0.9" />
                <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
            <span className="font-display font-extrabold text-[18px] tracking-tight text-[#0a0a0f]">
              Designo
            </span>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAuth}
              className="font-sans text-sm font-medium text-[#5e5e6e] hover:text-[#0a0a0f] transition-colors px-4 py-2 rounded-lg hover:bg-[#f0edf8]"
            >
              Sign In
            </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-8">
            <div data-hero-badge className="mb-6 inline-block">
              <Badge variant="primary" icon={<Sparkles size={13} />}>
                AUTONOMOUS ARCHITECTURE LOOPS
              </Badge>
            </div>
            <h1 className="font-display font-extrabold text-[44px] sm:text-[68px] lg:text-[80px] leading-[0.96] tracking-[-0.035em] text-[#0a0a0f]">
              <span data-hero-line className="block">SYSTEMS</span>
              <span data-hero-line className="block italic font-light text-[#6b38d4]">ARCHITECTED</span>
              <span data-hero-line className="block">AT SCALE.</span>
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end space-y-6 pb-2">
            <p data-hero-aside className="font-sans text-base md:text-lg text-[#5e5e6e] leading-relaxed">
              Practice System Design with AI before your Big Tech interview
            </p>
            <div data-hero-aside className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                variant="dark"
                size="lg"
                iconRight={<ArrowRight size={16} />}
                onClick={onStartInterview}
              >
                Start Free Practice
              </Button>
              <Button
                variant="outline"
                size="lg"
                iconLeft={<Play size={16} className="text-[#6b38d4]" fill="currentColor" />}
                onClick={() => scrollTo('#simulation', { offset: -80 })}
              >
                Watch Simulation
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={onExploreQuestions}
              >
                Explore Library
              </Button>
            </div>
            <div data-hero-aside className="flex items-center gap-3 text-xs font-mono text-[#8e8ea0] pt-2">
              <span>CALIBRATED FOR:</span>
              <span className="text-[#0a0a0f] font-semibold">GOOGLE</span>
              <span>•</span>
              <span className="text-[#0a0a0f] font-semibold">META</span>
              <span>•</span>
              <span className="text-[#0a0a0f] font-semibold">AMAZON</span>
              <span>•</span>
              <span className="text-[#0a0a0f] font-semibold">STRIPE</span>
            </div>
          </div>
        </div>

        {/* Floating Architecture Terminal Card */}
        <div id="simulation" data-hero-card className="relative w-full rounded-2xl md:rounded-[2rem] bg-white text-[#0a0a0f] p-3 md:p-4 shadow-[0_20px_50px_-15px_rgba(139,92,246,0.14)] border border-[#e5e1ea] scroll-mt-24">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between px-4 py-3 rounded-xl bg-[#f7f5fa] border border-[#e5e1ea] mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              </div>
              <span className="font-mono text-xs text-[#0a0a0f] font-medium pl-2 border-l border-[#dcd7e5]">
                SESSION #DES-9104 // Distributed Cache Invalidation &amp; Fan-out
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Badge variant="success" icon={<span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}>
                EVALUATOR ACTIVE
              </Badge>
              <Badge variant="primary">
                STAGE 4 OF 9
              </Badge>
            </div>
          </div>

          {/* 2-Column Live Interactive Simulation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-[440px]">
            {/* Left: AI & Candidate Chat */}
            <div className="lg:col-span-5 p-5 rounded-xl bg-[#faf9fe] border border-[#e5e1ea] flex flex-col justify-between">
              <div className="space-y-4">
                {/* AI Question */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#ede9fe] border border-[#8b5cf6]/30 flex items-center justify-center shrink-0 text-[#6b38d4] font-bold text-xs">
                    AI
                  </div>
                  <div data-sim-reveal className="rounded-2xl rounded-tl-sm p-4 bg-white border border-[#e5e1ea] shadow-xs">
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] text-[#6b38d4] font-semibold tracking-wider">
                      <span>ARCHITECT AI</span>
                      <span className="text-[#8e8ea0] font-normal">14:02:18</span>
                    </div>
                    <p className="font-sans text-xs md:text-[13px] leading-relaxed text-[#0a0a0f]">
                      "Under a sudden spike of 250k write QPS, your cache-aside strategy risks severe thundering herd if keys expire concurrently. How do you redesign invalidation without introducing write tail-latency?"
                    </p>
                  </div>
                </div>

                {/* Candidate Answer */}
                <div className="flex items-start gap-3 justify-end">
                  <div data-sim-reveal className="rounded-2xl rounded-tr-sm p-4 bg-[#f3f0ff] border border-[#8b5cf6]/20 shadow-xs max-w-[92%]">
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] gap-4">
                      <span className="text-[#5e5e6e] font-medium">YOU (L6 TRACK)</span>
                      <span className="text-emerald-600 font-semibold">+18pts Score Impact</span>
                    </div>
                    <p className="font-sans text-xs md:text-[13px] leading-relaxed text-[#0a0a0f]">
                      "Shift to an asynchronous CDC pipeline using Debezium over Postgres WAL into Kafka, paired with distributed Redis probabilistic leases (XFetch algorithm). This bounds p99 write latency strictly to database commit (~3.8ms)."
                    </p>
                    <div className="mt-3 pt-2 border-t border-[#8b5cf6]/20 flex items-center justify-between font-mono text-[11px] text-[#5e5e6e]">
                      <span>WAL Latency: ~3.8ms</span>
                      <span className="text-[#6b38d4] font-medium">Stampede Risk: &lt;0.02%</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white border border-[#e5e1ea] flex items-center justify-center shrink-0 font-bold text-xs text-[#0a0a0f]">
                    ME
                  </div>
                </div>

                {/* Live Metric */}
                <div data-sim-reveal className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Check size={16} className="text-emerald-600" />
                    <span className="text-xs text-[#0a0a0f]">
                      <strong>Vector:</strong> Fault Tolerance &amp; Concurrency
                    </span>
                  </div>
                  <span className="font-mono text-xs font-semibold text-emerald-700">STRONG HIRE (94%)</span>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-3 border-t border-[#e5e1ea] flex items-center gap-2 font-mono text-xs text-[#5e5e6e]">
                <span className="text-[#6b38d4] font-bold">&gt;</span>
                <span>Synthesizing fallback queue strategy...</span>
                <span className="w-2 h-4 bg-[#6b38d4] animate-pulse ml-auto" />
              </div>
            </div>

            {/* Right: Architecture Diagram Mock */}
            <div className="lg:col-span-7 p-5 rounded-xl bg-[#faf9fe] border border-[#e5e1ea] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center justify-between mb-4 border-b border-[#e5e1ea] pb-3">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-[#6b38d4]" />
                  <span className="font-mono text-xs font-semibold text-[#0a0a0f]">
                    LIVE TOPOLOGY GRAPH // CDC &amp; REDIS CLUSTER
                  </span>
                </div>
                <Badge variant="success">
                  HEALTH: 99.999%
                </Badge>
              </div>

              {/* Diagram Flow Visual */}
              <div data-sim-reveal className="grid grid-cols-3 gap-3 my-auto py-4">
                <div className="p-4 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-center">
                  <div className="font-mono text-[10px] text-[#8e8ea0] uppercase">Ingestion</div>
                  <div className="font-semibold text-sm text-[#0a0a0f] mt-1">Postgres 16</div>
                  <div className="font-mono text-[11px] text-[#6b38d4] mt-2">Write Ahead Log</div>
                  <div className="mt-2 text-[10px] bg-[#f4f1fb] text-[#5e5e6e] py-0.5 rounded">p99 ~3.8ms</div>
                </div>

                <div className="p-4 rounded-xl bg-[#ede9fe]/40 border border-[#8b5cf6]/30 shadow-xs text-center relative">
                  <div className="font-mono text-[10px] text-[#6b38d4] uppercase font-semibold">Streaming</div>
                  <div className="font-semibold text-sm text-[#0a0a0f] mt-1">Kafka Cluster</div>
                  <div className="font-mono text-[11px] text-[#5e5e6e] mt-2">Debezium CDC</div>
                  <div className="mt-2 text-[10px] bg-emerald-50 text-emerald-700 py-0.5 rounded font-medium">Zero Drop</div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-center">
                  <div className="font-mono text-[10px] text-[#8e8ea0] uppercase">Cache Layer</div>
                  <div className="font-semibold text-sm text-[#0a0a0f] mt-1">Redis Clustered</div>
                  <div className="font-mono text-[11px] text-[#6b38d4] mt-2">XFetch Leases</div>
                  <div className="mt-2 text-[10px] bg-[#f4f1fb] text-[#5e5e6e] py-0.5 rounded">Hit Rate 98.6%</div>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div data-sim-reveal className="pt-3 border-t border-[#e5e1ea] flex items-center justify-between text-xs font-mono text-[#5e5e6e]">
                <span>Throughput: <strong>250,000 QPS</strong></span>
                <span>Active Shards: <strong>32</strong></span>
                <span>Tail Latency: <strong className="text-emerald-600">4.1ms</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Benchmark Strip */}
      <section id="benchmarks" className="border-y border-[#e5e1ea] bg-white py-10 mb-20 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div data-bench-item>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#0a0a0f]" data-counter="42" data-suffix="ms">42ms</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Evaluation Latency</div>
          </div>
          <div data-bench-item>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#6b38d4]" data-counter="98.4" data-decimals="1" data-suffix="%">98.4%</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Staff+ Calibration</div>
          </div>
          <div data-bench-item>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#0a0a0f]" data-counter="1200" data-suffix="+">1,200+</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Architecture Components</div>
          </div>
          <div data-bench-item>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#10b981]" data-counter="14800" data-suffix="+">14,800+</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Simulations Completed</div>
          </div>
        </div>
      </section>

      {/* ── How it works + full feature breakdown ── */}
      <LandingHowItWorks />

      <LandingFeatures />

      {/* CTA Banner */}
      <section id="start" className="max-w-7xl mx-auto px-6 md:px-12 mt-16 scroll-mt-24">
        <div data-cta className="rounded-3xl bg-gradient-to-r from-[#0a0a0f] via-[#1a1528] to-[#0a0a0f] text-white p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              Ready to crush your next System Design loop?
            </h2>
            <p className="font-sans text-sm md:text-base text-neutral-300">
              Start a realistic mock interview right now. No credit card required.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <Button
                variant="primary"
                size="lg"
                className="shadow-lg"
                iconRight={<ArrowRight size={16} />}
                onClick={onStartInterview}
              >
                Launch Mock Interview
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 400, damping: 24 }}
            >
              <Button variant="outline" size="lg" onClick={onSelectPricing}>
                View Plans
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};
