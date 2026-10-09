import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { motion } from 'motion/react';
import { MessagesSquare, Target, UserRound } from 'lucide-react';
import { Badge, Card } from './ui';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Step {
  num: string;
  title: string;
  text: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    num: '01',
    icon: UserRound,
    title: 'Dial in your target',
    text: 'Onboarding captures your experience level, role, years and target company. The question mix, difficulty and evaluation bar all adapt to that profile.',
  },
  {
    num: '02',
    icon: MessagesSquare,
    title: 'Run a live mock loop',
    text: 'The AI interviewer drives a multi-stage session — requirements, high-level design, deep dives — while you sketch architecture in the Diagram Studio.',
  },
  {
    num: '03',
    icon: Target,
    title: 'Score, review, improve',
    text: 'Get a weighted report across Scope, HLD, Bottlenecks and Fault Tolerance, then follow an adaptive roadmap that targets your weakest concepts.',
  },
];

/**
 * Landing "How it works" section.
 * GSAP handles the scroll reveal (disabled under prefers-reduced-motion),
 * Motion handles the hover lift micro-interaction on each step card.
 */
export const LandingHowItWorks: React.FC = () => {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('[data-step-header]', {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
        });
        gsap.from('[data-step]', {
          y: 32,
          autoAlpha: 0,
          duration: 0.65,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-step-grid]', start: 'top 85%', once: true },
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
      className="max-w-7xl mx-auto px-6 md:px-12 py-14 md:py-20 scroll-mt-24"
    >
      <div data-step-header className="text-center max-w-2xl mx-auto mb-12">
        <Badge variant="primary" className="mb-4">
          HOW IT WORKS
        </Badge>
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          From signup to offer in three moves
        </h2>
        <p className="font-sans text-[#5e5e6e] mt-3">
          Designo mirrors the real loop: set your target, practise under pressure, then fix
          exactly what the evaluation flags.
        </p>
      </div>

      <div data-step-grid className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <div key={step.num} data-step className="h-full">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="h-full"
              >
                <Card
                  padding="lg"
                  className="h-full hover:border-[#cbc3d7] hover:shadow-[0_14px_34px_-10px_rgba(107,56,212,0.16)]"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-[#ede9fe] text-[#6b38d4] flex items-center justify-center">
                      <Icon size={20} />
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#c3bcdc] tracking-widest">
                      STEP {step.num}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#5e5e6e] leading-relaxed">{step.text}</p>
                </Card>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default LandingHowItWorks;