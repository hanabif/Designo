import React, { useState } from 'react';
import { X, Play, Check, ArrowRight } from 'lucide-react';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBegin: (questionId: string, difficulty: string, companyTrack: string) => void;
  questions: any[];
}

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  onClose,
  onBegin,
  questions,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id || 'q1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('INTERMEDIATE');
  const [selectedTrack, setSelectedTrack] = useState<string>('GOOGLE');

  if (!isOpen) return null;

  const selectedQuestionObj = questions.find((q) => q.id === selectedQuestionId) || questions[0] || {
    title: 'Design TinyURL / URL Shortener',
  };

  const tracks = [
    { id: 'GOOGLE', name: 'Google', keyword: 'Scalability & Algo', icon: '🔵' },
    { id: 'AMAZON', name: 'Amazon', keyword: 'Tradeoffs & Operations', icon: '🟠' },
    { id: 'META', name: 'Meta', keyword: 'Massive Scale & Storage', icon: '🔷' },
    { id: 'NETFLIX', name: 'Netflix', keyword: 'High Reliability & Resiliency', icon: '🔴' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(23, 23, 23, 0.4)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="card-solid"
        style={{
          width: '100%',
          maxWidth: '640px',
          padding: '28px',
          boxShadow: 'var(--shadow-dropdown)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <span className="badge-accent" style={{ marginBottom: '6px' }}>
              <Play size={12} /> Config Session
            </span>
            <h2 style={{ fontSize: '24px', fontWeight: 400 }}>Start a Mock Interview</h2>
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Form Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '24px' }}>
          {/* Step 1: Question Selection */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
              Step 1 — Target System Design Question
            </label>
            <select
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              className="input-cofounder"
            >
              {questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.difficulty})
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Difficulty Chips */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
              Step 2 — Target Difficulty Level
            </label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF'].map((level) => (
                <button
                  key={level}
                  onClick={() => setSelectedDifficulty(level)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: selectedDifficulty === level ? '1px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                    backgroundColor: selectedDifficulty === level ? 'var(--color-primary)' : 'var(--color-bg)',
                    color: 'var(--color-text)',
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Company Track Cards */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '8px' }}>
              Step 3 — Target Company Track
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {tracks.map((tr) => (
                <div
                  key={tr.id}
                  onClick={() => setSelectedTrack(tr.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-button)',
                    border: selectedTrack === tr.id ? '2px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                    backgroundColor: selectedTrack === tr.id ? 'var(--color-primary)' : 'var(--color-bg)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px' }}>
                      {tr.icon} {tr.name}
                    </span>
                    {selectedTrack === tr.id && <Check size={16} color="var(--color-text)" />}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Focus: {tr.keyword}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Strip */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderRadius: 'var(--radius-button)',
            padding: '12px 16px',
            marginBottom: '24px',
            fontSize: '13px',
            color: 'var(--color-text)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between',
          }}
        >
          <div>
            <strong>Summary:</strong> {selectedQuestionObj.title} · {selectedDifficulty} · {selectedTrack} Track
          </div>
          <span style={{ fontWeight: 600, color: 'var(--color-text-secondary)' }}>Est. 45 min</span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-ghost">
            Cancel
          </button>
          <button
            onClick={() => {
              onBegin(selectedQuestionId, selectedDifficulty, selectedTrack);
              onClose();
            }}
            className="btn-accent"
          >
            Begin Interview Session <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
