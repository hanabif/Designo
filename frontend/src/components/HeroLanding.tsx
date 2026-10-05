import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Check, Sparkles, Cpu, Zap, Activity, Layers, Award } from 'lucide-react';
import { Button, Card, Badge } from './ui';

interface HeroLandingProps {
  onStartInterview?: () => void;
  onExploreQuestions?: () => void;
  onSelectPricing?: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onStartInterview: propOnStartInterview,
  onExploreQuestions: propOnExploreQuestions,
  onSelectPricing: propOnSelectPricing,
}) => {
  const navigate = useNavigate();
  const onStartInterview = propOnStartInterview || (() => navigate('/dashboard'));
  const onExploreQuestions = propOnExploreQuestions || (() => navigate('/questions'));
  void (propOnSelectPricing || (() => navigate('/billing')));
  return (
    <div className="bg-[#faf9fe] text-[#0a0a0f] pb-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#ede9fe]/80 via-[#f4f1fb]/40 to-transparent blur-[120px] -z-10 rounded-full" />
      <div className="pointer-events-none absolute top-48 right-[-140px] w-[500px] h-[500px] rounded-full border-[50px] border-[#ede9fe]/70 blur-[40px] -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-16 pb-16">
        {/* Top Protocol Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e1ea] pb-5 mb-12">
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#5e5e6e] uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10b981]" />
            </span>
            <span>Zero-Latency First Principles Simulator</span>
            <span className="text-neutral-300">•</span>
            <span className="text-[#6b38d4] font-semibold">Model 4.2 Calibrated</span>
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] text-[#5e5e6e]">
            <span>FAANG+ BENCHMARKS</span>
            <span>// 42MS EVALUATION</span>
          </div>
        </div>

        {/* Editorial Headline Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end mb-16">
          <div className="lg:col-span-8">
            <Badge variant="primary" icon={<Sparkles size={13} />} className="mb-6">
              AUTONOMOUS ARCHITECTURE LOOPS
            </Badge>
            <h1 className="font-display font-extrabold text-[44px] sm:text-[68px] lg:text-[80px] leading-[0.96] tracking-[-0.035em] text-[#0a0a0f]">
              SYSTEMS <br />
              <span className="italic font-light text-[#6b38d4]">ARCHITECTED</span> <br />
              AT SCALE.
            </h1>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end space-y-6 pb-2">
            <p className="font-sans text-base md:text-lg text-[#5e5e6e] leading-relaxed">
              Practice unsparing mock technical loops with an AI calibrated by Staff and Principal engineers.
              Objectively scored on mathematical rigor, data contracts, and fault tolerance.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
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
                onClick={onExploreQuestions}
              >
                Explore Library
              </Button>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-[#8e8ea0] pt-2">
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
        <div className="relative w-full rounded-2xl md:rounded-[2rem] bg-white text-[#0a0a0f] p-3 md:p-4 shadow-[0_20px_50px_-15px_rgba(139,92,246,0.14)] border border-[#e5e1ea]">
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
                  <div className="rounded-2xl rounded-tl-sm p-4 bg-white border border-[#e5e1ea] shadow-xs">
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
                  <div className="rounded-2xl rounded-tr-sm p-4 bg-[#f3f0ff] border border-[#8b5cf6]/20 shadow-xs max-w-[92%]">
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
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
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
              <div className="grid grid-cols-3 gap-3 my-auto py-4">
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
              <div className="pt-3 border-t border-[#e5e1ea] flex items-center justify-between text-xs font-mono text-[#5e5e6e]">
                <span>Throughput: <strong>250,000 QPS</strong></span>
                <span>Active Shards: <strong>32</strong></span>
                <span>Tail Latency: <strong className="text-emerald-600">4.1ms</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Numerical Benchmark Strip */}
      <section className="border-y border-[#e5e1ea] bg-white py-10 mb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#0a0a0f]">42ms</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Evaluation Latency</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#6b38d4]">98.4%</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Staff+ Calibration</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#0a0a0f]">1,200+</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Architecture Components</div>
          </div>
          <div>
            <div className="font-display font-bold text-3xl md:text-4xl text-[#10b981]">14,800+</div>
            <div className="font-mono text-xs text-[#5e5e6e] uppercase tracking-wider mt-1">Simulations Completed</div>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="primary" className="mb-4">
            CORE PLATFORM CAPABILITIES
          </Badge>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
            Engineered for High-Stakes Technical Loops
          </h2>
          <p className="font-sans text-[#5e5e6e] mt-3">
            Traditional interview prep gives you generic flashcards. Designo subjects your architecture to real-time stress testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card padding="md" hover>
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center mb-4">
              <Zap size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">AI Interviewer</h3>
            <p className="text-xs text-[#5e5e6e] leading-relaxed">
              Dynamically probes requirements, asks challenging trade-off questions, and tests failure scenarios.
            </p>
          </Card>

          <Card padding="md" hover>
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center mb-4">
              <Layers size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">Diagram Evaluator</h3>
            <p className="text-xs text-[#5e5e6e] leading-relaxed">
              Analyzes Mermaid &amp; SVG architecture diagrams, flagging Single Points of Failure and concurrency bottlenecks.
            </p>
          </Card>

          <Card padding="md" hover>
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center mb-4">
              <Activity size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">Objective Scoring</h3>
            <p className="text-xs text-[#5e5e6e] leading-relaxed">
              Multi-dimensional scoring across Scope, High-Level Design, Bottlenecks, and Fault Tolerance with actionable feedback.
            </p>
          </Card>

          <Card padding="md" hover>
            <div className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">Adaptive Roadmap</h3>
            <p className="text-xs text-[#5e5e6e] leading-relaxed">
              Creates a tailored learning path targeting your specific gaps (e.g. Raft consensus, DB partitioning, or rate limiters).
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 mt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#0a0a0f] via-[#1a1528] to-[#0a0a0f] text-white p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              Ready to crush your next System Design loop?
            </h2>
            <p className="font-sans text-sm md:text-base text-neutral-300">
              Start a realistic mock interview right now. No credit card required.
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Button
              variant="primary"
              size="lg"
              className="shadow-lg"
              iconRight={<ArrowRight size={16} />}
              onClick={onStartInterview}
            >
              Launch Mock Interview
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
