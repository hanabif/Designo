import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import {
  Bell,
  ChartColumn,
  CreditCard,
  Library,
  MessagesSquare,
  Route,
  Target,
  UserRound,
  Workflow,
} from 'lucide-react';
import { Badge, Card } from './ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Feature {
  title: string;
  text: string;
  tag: string;
  icon: React.ElementType;
}

const ENGINES = ['AI Interviewer', 'AI Evaluator', 'AI Mentor', 'AI Progress Tracker'];

/** Every feature of the platform — mirrors FR-01 … FR-11 in Designo.md. */
const FEATURES: Feature[] = [
  {
    icon: UserRound,
    tag: 'Profile',
    title: 'Onboarding & Profiles',
    text: 'A short setup captures your experience level, role, years and target company/level — everything downstream adapts to it.',
  },
  {
    icon: Library,
    tag: 'FR-03',
    title: 'Question Bank',
    text: 'A tiered library from Beginner (URL Shortener, Parking Lot) to Staff (Global CDN, Event Streaming), filterable by tag, difficulty and company track.',
  },
  {
    icon: MessagesSquare,
    tag: 'FR-04',
    title: 'Live AI Interviews',
    text: 'Multi-stage mock sessions where the AI probes requirements, challenges trade-offs and stress-tests failure scenarios in a live chat.',
  },
  {
    icon: Target,
    tag: 'FR-05',
    title: 'Evaluation Reports',
    text: 'Weighted scoring across Scope, High-Level Design, Bottlenecks and Fault Tolerance, with per-dimension feedback and hire-signal ratings.',
  },
  {
    icon: Workflow,
    tag: 'FR-06 / 07',
    title: 'Diagram Studio',
    text: 'Generate and edit Mermaid & SVG architecture diagrams, then let the evaluator flag Single Points of Failure and concurrency bottlenecks.',
  },
  {
    icon: ChartColumn,
    tag: 'FR-08',
    title: 'Analytics Dashboard',
    text: 'Track attempts, accuracy, response time and weak-area trends over time so you always know what to practise next.',
  },
  {
    icon: Route,
    tag: 'FR-09',
    title: 'Adaptive Roadmaps',
    text: 'A personalised learning path targeting your specific gaps — Raft consensus, DB partitioning, rate limiters — with progress tracked per concept.',
  },
  {
    icon: Bell,
    tag: 'FR-10',
    title: 'Notifications',
    text: 'In-app notifications for evaluation results, roadmap recommendations and system updates, all managed from your notification centre.',
  },
  {
    icon: CreditCard,
    tag: 'FR-11',
    title: 'Plans, Roles & Admin',
    text: 'Start free and upgrade when ready. Pro unlocks deeper reports and analytics, while the admin console manages users, content and roles.',
  },
];

/**
 * Landing "full feature set" section.
 * GSAP staggers the cards in on scroll; Motion provides the hover lift and
 * icon nudge micro-interactions.
 */
export const LandingFeatures: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-features-header]', {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
        });
        gsap.from('[data-engines] > *', {
          y: 12,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-engines]', start: 'top 88%', once: true },
        });
        gsap.from('[data-feature]', {
          y: 32,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-feature-grid]', start: 'top 85%', once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      id="features"
      ref={rootRef}
      className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20 scroll-mt-24"
    >
      <div data-features-header className="text-center max-w-2xl mx-auto mb-8">
        <Badge variant="primary" className="mb-4">
          EVERYTHING INCLUDED
        </Badge>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          One platform, the whole interview loop
        </h2>
        <p className="font-sans text-[#5e5e6e] mt-3">
          Practice questions, live AI sessions, diagram tooling, scored reports, analytics and
          an adaptive roadmap — all driven by the same profile.
        </p>
      </div>

      {/* Four AI engines strip */}
      <div
        data-engines
        className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 mb-12 font-mono text-[11px] uppercase tracking-widest text-[#5e5e6e]"
      >
        {ENGINES.map((engine, index) => (
          <React.Fragment key={engine}>
            {index > 0 && <span className="text-[#cbc3d7]">/</span>}
            <span className="px-2 py-0.5 rounded-full bg-[#f4f1fb] border border-[#e5e1ea] text-[#5e5e6e]">
              {engine}
            </span>
          </React.Fragment>
        ))}
      </div>

      <div data-feature-grid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} data-feature className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="h-full"
              >
                <Card
                  padding="md"
                  className="h-full flex flex-col hover:border-[#cbc3d7] hover:shadow-[0_14px_34px_-10px_rgba(107,56,212,0.16)]"
                >
                  <div className="flex items-start justify-between mb-4">
                    <motion.div
                      whileHover={{ rotate: -6, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      className="w-10 h-10 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center"
                    >
                      <Icon size={20} />
                    </motion.div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#8e8ea0] pt-1.5">
                      {feature.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-[15px] text-[#0a0a0f] mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-[#5e5e6e] leading-relaxed">{feature.text}</p>
                </Card>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingFeatures;
