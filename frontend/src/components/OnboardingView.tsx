import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, GraduationCap, Terminal, Code, Award, Shield } from 'lucide-react';
import type { UserProfile } from '../types';
import { Button, Badge } from './ui';

interface OnboardingViewProps {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<string>('Senior');
  const [position, setPosition] = useState<string>('Backend Systems Engineer');
  const [years, setYears] = useState<number>(5);
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [targetLevel, setTargetLevel] = useState<string>('Senior (L5)');
  const [focusAreas, setFocusAreas] = useState<string[]>(['High Throughput', 'Caching & CDNs']);

  const levels = [
    { id: 'Student', label: 'Student', sub: 'Intern / Campus Grad', icon: GraduationCap },
    { id: 'Junior', label: 'Junior', sub: 'L3 / Software Eng I', icon: Terminal },
    { id: 'Mid-Level', label: 'Mid-Level', sub: 'L4 / Software Eng II', icon: Code },
    { id: 'Senior', label: 'Senior', sub: 'L5 / Senior SWE', icon: Award },
    { id: 'Staff+', label: 'Staff+', sub: 'L6+ / Principal Architect', icon: Shield },
  ];

  const companies = [
    'Google', 'Meta', 'Amazon', 'Netflix', 'Stripe', 'Uber', 'Apple', 'OpenAI',
  ];
  const roles = ['Frontend Engineer', 'Backend Engineer', 'Full-Stack Engineer', 'Mobile Engineer (iOS)', 'Mobile Engineer (Android)', 'Software Engineer', 'Platform Engineer', 'DevOps Engineer', 'Cloud Infrastructure Engineer', 'Site Reliability Engineer (SRE)', 'Data Engineer', 'Analytics Engineer', 'Machine Learning Engineer', 'AI Engineer', 'Data Scientist', 'Security Engineer', 'QA / Test Automation Engineer', 'Embedded Systems Engineer', 'Game Developer', 'Engineering Manager', 'Solutions Architect'];

  const allFocusAreas = [
    'High Throughput & Distributed',
    'Storage & Databases (SQL / NoSQL)',
    'Microservices & Async Messaging',
    'Caching & CDN Strategy',
    'Consensus & Fault Tolerance (Raft/Paxos)',
    'Rate Limiting & API Gateways',
  ];

  const toggleFocusArea = (area: string) => {
    if (focusAreas.includes(area)) {
      setFocusAreas(focusAreas.filter((a) => a !== area));
    } else {
      setFocusAreas([...focusAreas, area]);
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete({
        experienceLevel,
        position,
        years,
        targetCompany,
        targetLevel,
        focusAreas,
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#faf9fe] py-12 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ede9fe]/60 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-2xl bg-white border border-[#e5e1ea] rounded-3xl p-6 sm:p-10 shadow-[0_20px_50px_-15px_rgba(139,92,246,0.12)]">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#e5e1ea]">
          <div>
            <Badge variant="primary" icon={<Sparkles size={12} />} className="mb-2">
              STEP {step} OF 3
            </Badge>
            <h2 className="font-display font-bold text-2xl text-[#0a0a0f]">
              {step === 1 && 'Target Level & Background'}
              {step === 2 && 'Target Company & Trajectory'}
              {step === 3 && 'Key Focus Areas & Deep Dives'}
            </h2>
            <p className="text-xs text-[#5e5e6e] mt-1">
              Calibrate the AI interviewer to your current experience and interview goals.
            </p>
          </div>

          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-8 bg-[#6b38d4]'
                    : s < step
                    ? 'w-2.5 bg-[#10b981]'
                    : 'w-2.5 bg-[#e5e1ea]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Current Level & Years */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-3">
                Current Seniority / Target Band
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {levels.map((lvl) => {
                  const Icon = lvl.icon;
                  const isSelected = experienceLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setExperienceLevel(lvl.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#f3f0ff] border-[#6b38d4] shadow-xs'
                          : 'bg-[#faf9fc] border-[#e5e1ea] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 font-bold text-xs text-[#0a0a0f]">
                          <Icon size={16} className={isSelected ? 'text-[#6b38d4]' : 'text-[#8e8ea0]'} />
                          <span>{lvl.label}</span>
                        </div>
                        {isSelected && <Check size={14} className="text-[#6b38d4]" />}
                      </div>
                      <div className="text-[11px] text-[#5e5e6e] font-mono pl-6">{lvl.sub}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-1.5">
                  Current / Desired Role
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white"
                >
                  {roles.map((role) => <option key={role} value={role}>{role}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-1.5">
                  Years of Experience ({years} yrs)
                </label>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full h-2 bg-[#ede9fe] rounded-lg appearance-none cursor-pointer accent-[#6b38d4] mt-3"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Target Company & Trajectory */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-3">
                Target Company Caliber / Rubric
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {companies.map((comp) => {
                  const isSelected = targetCompany === comp;
                  return (
                    <button
                      key={comp}
                      type="button"
                      onClick={() => setTargetCompany(comp)}
                      className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                        isSelected
                          ? 'bg-[#6b38d4] text-white border-[#6b38d4] shadow-xs'
                          : 'bg-[#faf9fc] text-[#0a0a0f] border-[#e5e1ea] hover:bg-white'
                      }`}
                    >
                      {comp}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-3">
                Target Interview Level
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['Mid-Level (L4)', 'Senior (L5)', 'Staff / Lead (L6+)'].map((lvl) => {
                  const isSelected = targetLevel === lvl;
                  return (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setTargetLevel(lvl)}
                      className={`p-3 rounded-xl border text-center transition-all text-xs font-semibold cursor-pointer ${
                        isSelected
                          ? 'bg-[#ede9fe] text-[#6b38d4] border-[#6b38d4]'
                          : 'bg-[#faf9fc] text-[#0a0a0f] border-[#e5e1ea] hover:bg-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Focus Areas */}
        {step === 3 && (
          <div className="space-y-4">
            <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold">
              Select Your Primary Prep Priorities (Pick 2 or more)
            </label>
            <div className="space-y-2">
              {allFocusAreas.map((area) => {
                const isSelected = focusAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#f3f0ff] border-[#6b38d4] text-[#6b38d4]'
                        : 'bg-[#faf9fc] border-[#e5e1ea] text-[#0a0a0f] hover:bg-white'
                    }`}
                  >
                    <span className="text-xs font-semibold">{area}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#6b38d4] border-[#6b38d4] text-white' : 'border-[#cbc3d7]'
                      }`}
                    >
                      {isSelected && <Check size={12} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#e5e1ea]">
          <button
            onClick={onSkip}
            className="text-xs text-[#8e8ea0] hover:text-[#0a0a0f] transition-colors cursor-pointer"
          >
            Skip for now
          </button>

          <div className="flex items-center gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStep(step - 1)}
              >
                Back
              </Button>
            )}
            <Button
              variant="dark"
              size="md"
              iconRight={<ArrowRight size={14} />}
              onClick={handleNext}
            >
              {step === 3 ? 'Complete Setup' : 'Continue'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
