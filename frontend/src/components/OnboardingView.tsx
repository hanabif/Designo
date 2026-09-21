import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

interface OnboardingViewProps {
  onComplete: (profile: any) => void;
  onSkip: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState<number>(1);
  const [experienceLevel, setExperienceLevel] = useState<string>('Mid-Level');
  const [position, setPosition] = useState<string>('Software Engineer');
  const [years, setYears] = useState<number>(4);
  const [targetCompany, setTargetCompany] = useState<string>('Google');
  const [targetLevel, setTargetLevel] = useState<string>('Senior (L5)');
  const [preferredDifficulty, setPreferredDifficulty] = useState<string>('Medium');

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
        preferredDifficulty,
      });
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div className="card-solid" style={{ padding: '36px' }}>
        {/* Stepper Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <span className="badge-accent" style={{ marginBottom: '6px' }}>
              <Sparkles size={12} /> Profile Personalization
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 400 }}>
              {step === 1 && 'Tell us about yourself'}
              {step === 2 && 'Set your interview target'}
              {step === 3 && 'Choose your starting difficulty'}
            </h2>
          </div>
          {/* Stepper Dots */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  width: s === step ? '24px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  backgroundColor: s === step ? 'var(--color-text)' : s < step ? '#1f8a65' : 'var(--color-border-strong)',
                  transition: 'all 0.2s ease',
                  boxShadow: s === step ? '0 0 8px rgba(0,0,0,0.2)' : 'none',
                }}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Tell us about yourself */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
                Experience Level
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['Student', 'Junior', 'Mid-Level', 'Senior', 'Staff'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 'var(--radius-button)',
                      border: experienceLevel === lvl ? '2px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: experienceLevel === lvl ? 'var(--color-primary)' : 'var(--color-bg)',
                      fontWeight: 500,
                      cursor: 'pointer',
                    }}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Current Position
              </label>
              <input
                type="text"
                className="input-cofounder"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Backend Engineer, Full-Stack Lead"
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', fontWeight: 600 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Years of Experience</span>
                <span>{years} Years</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-text)' }}
              />
            </div>
          </div>
        )}

        {/* Step 2: Set your target */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
                Target Company
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                {['Google', 'Amazon', 'Meta', 'Netflix', 'Microsoft', 'Apple'].map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setTargetCompany(comp)}
                    style={{
                      padding: '12px',
                      borderRadius: 'var(--radius-button)',
                      border: targetCompany === comp ? '2px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                      backgroundColor: targetCompany === comp ? 'var(--color-primary)' : 'var(--color-bg)',
                      fontWeight: 600,
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <span>{comp}</span>
                    {targetCompany === comp && <Check size={16} />}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                Target Level
              </label>
              <select className="input-cofounder" value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)}>
                <option value="Mid (L4 / IC4)">Mid (L4 / IC4)</option>
                <option value="Senior (L5 / IC5)">Senior (L5 / IC5)</option>
                <option value="Staff (L6 / E6)">Staff (L6 / E6)</option>
                <option value="Principal (L7+)">Principal (L7+)</option>
              </select>
            </div>
          </div>
        )}

        {/* Step 3: Choose your difficulty */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block' }}>
              Preferred Difficulty
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { level: 'Easy', desc: 'Core fundamentals & clear requirements' },
                { level: 'Medium', desc: 'Standard production scale & trade-offs' },
                { level: 'Hard', desc: 'Massive multi-region scale & SPOF audits' },
              ].map((item) => (
                <div
                  key={item.level}
                  onClick={() => setPreferredDifficulty(item.level)}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-card)',
                    border: preferredDifficulty === item.level ? '2px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                    backgroundColor: preferredDifficulty === item.level ? 'var(--color-primary)' : 'var(--color-bg)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>{item.level}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'var(--color-bg-secondary)', padding: '12px 16px', borderRadius: 'var(--radius-button)', fontSize: '13px' }}>
              🎯 <strong>Customized Path:</strong> We will tailor your interview questions, mock interviewer persona, and scoring criteria based on {targetCompany} ({targetLevel}).
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--color-border-subtle)' }}>
          <button onClick={onSkip} className="btn-ghost" style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Skip for now
          </button>
          <button onClick={handleNext} className="btn-accent">
            {step === 3 ? 'Complete Setup' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
