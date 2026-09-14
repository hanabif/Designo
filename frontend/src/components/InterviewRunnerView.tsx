import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Send, CheckCircle2, Clock, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface InterviewRunnerViewProps {
  interviewId: string | null;
  onFinish: (interviewId: string) => void;
}

const STAGES = [
  'REQUIREMENTS_GATHERING',
  'NON_FUNCTIONAL_REQUIREMENTS',
  'CAPACITY_ESTIMATION',
  'HIGH_LEVEL_DESIGN',
  'DETAILED_DESIGN',
  'SCALABILITY',
  'RELIABILITY',
  'TRADEOFFS',
  'FINAL_ASSESSMENT',
];

const STAGE_LABELS: Record<string, string> = {
  REQUIREMENTS_GATHERING: '1. Requirements Gathering',
  NON_FUNCTIONAL_REQUIREMENTS: '2. Non-Functional Requirements',
  CAPACITY_ESTIMATION: '3. Capacity Estimation',
  HIGH_LEVEL_DESIGN: '4. High-Level Design',
  DETAILED_DESIGN: '5. Detailed Design',
  SCALABILITY: '6. Scalability & Partitioning',
  RELIABILITY: '7. Reliability & Fault Tolerance',
  TRADEOFFS: '8. Trade-offs & Alternatives',
  FINAL_ASSESSMENT: '9. Final Assessment',
};

export const InterviewRunnerView: React.FC<InterviewRunnerViewProps> = ({
  interviewId,
  onFinish,
}) => {
  const [interview, setInterview] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputContent, setInputContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiStatus, setAiStatus] = useState<'idle' | 'thinking' | 'editing' | 'done'>('idle');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (interviewId) {
      loadInterview(interviewId);
    }
  }, [interviewId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, aiStatus]);

  const loadInterview = async (id: string) => {
    try {
      const data = await api.getInterview(id);
      setInterview(data);
      setMessages(data.messages || []);
    } catch {
      // Create local mock interview if offline
      setInterview({
        id,
        currentStage: 'REQUIREMENTS_GATHERING',
        difficulty: 'INTERMEDIATE',
        companyTrack: 'GOOGLE',
        question: { title: 'Design Twitter Feed System' },
        status: 'IN_PROGRESS',
      });
      setMessages([
        {
          id: 'm1',
          role: 'ASSISTANT',
          content: 'Hello! Welcome to your System Design Mock Interview for "Design Twitter Feed System" on the Google Track. Let us begin with Stage 1: Requirements Gathering. What core functional features should our system support?',
          stage: 'REQUIREMENTS_GATHERING',
        },
      ]);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || loading || !interviewId) return;

    const userText = inputContent;
    setInputContent('');
    setLoading(true);
    setAiStatus('thinking');

    // Optimistic user turn update
    const tempUserMsg = {
      id: Date.now().toString(),
      role: 'USER',
      content: userText,
      stage: interview?.currentStage || 'REQUIREMENTS_GATHERING',
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      setAiStatus('editing');
      const res = await api.sendInterviewMessage(interviewId, userText);
      setMessages((prev) => [...prev, res.assistantMessage]);
      if (res.currentStage) {
        setInterview((prev: any) => ({ ...prev, currentStage: res.currentStage }));
      }
      setAiStatus('done');
    } catch (err: any) {
      // Development fallback mock response
      setTimeout(() => {
        const nextIndex = (STAGES.indexOf(interview?.currentStage || 'REQUIREMENTS_GATHERING') + 1) % STAGES.length;
        const nextStage = STAGES[nextIndex];
        const mockAssistantMsg = {
          id: (Date.now() + 1).toString(),
          role: 'ASSISTANT',
          content: `Thank you. I have recorded your proposal regarding "${userText.slice(0, 40)}...". Let's now move forward to Stage: ${STAGE_LABELS[nextStage]}. What are your estimates for daily throughput and storage requirements?`,
          stage: nextStage,
        };
        setMessages((prev) => [...prev, mockAssistantMsg]);
        setInterview((prev: any) => ({ ...prev, currentStage: nextStage }));
        setAiStatus('done');
      }, 1000);
    } finally {
      setLoading(false);
      setTimeout(() => setAiStatus('idle'), 2000);
    }
  };

  const handleFinishSession = async () => {
    if (!interviewId) return;
    try {
      await api.finishInterview(interviewId);
    } catch {
      // ignore
    }
    onFinish(interviewId);
  };

  const currentStageIndex = STAGES.indexOf(interview?.currentStage || 'REQUIREMENTS_GATHERING');

  return (
    <div className="container section-rhythm">
      {/* Header bar */}
      <div
        className="card-surface"
        style={{
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span className="badge-pill">{interview?.companyTrack || 'GOOGLE'} TRACK</span>
            <span style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Difficulty: {interview?.difficulty || 'INTERMEDIATE'}</span>
          </div>
          <h2 className="display-md" style={{ fontSize: '22px' }}>
            {interview?.question?.title || 'System Design Interview'}
          </h2>
        </div>

        <button onClick={handleFinishSession} className="btn-primary" style={{ backgroundColor: 'var(--color-ink)' }}>
          <ShieldCheck size={16} />
          Complete & Generate Evaluation
        </button>
      </div>

      {/* Main Grid split */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px' }}>
        {/* Left Sidebar: 9 Stages Timeline */}
        <div className="card-surface" style={{ padding: '20px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-muted)', marginBottom: '16px' }}>
            Interview Stage Roadmap
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STAGES.map((stg, idx) => {
              const isCurrent = interview?.currentStage === stg;
              const isPassed = idx < currentStageIndex;

              return (
                <div
                  key={stg}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: isCurrent ? '1px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                    backgroundColor: isCurrent ? 'var(--color-surface-card)' : isPassed ? 'var(--color-canvas-soft)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justify: 'space-between',
                    fontSize: '13px',
                    fontWeight: isCurrent ? 600 : 400,
                    color: isCurrent ? 'var(--color-primary)' : 'var(--color-ink)',
                  }}
                >
                  <span>{STAGE_LABELS[stg]}</span>
                  {isPassed && <CheckCircle2 size={14} color="#1f8a65" />}
                  {isCurrent && <span className="timeline-pill pill-thinking" style={{ fontSize: '9px', padding: '2px 6px' }}>ACTIVE</span>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Chat & Interaction Pane */}
        <div className="card-surface" style={{ display: 'flex', flexDirection: 'column', height: '620px', padding: '0', overflow: 'hidden' }}>
          {/* Action Bar status indicator */}
          <div
            style={{
              height: '44px',
              backgroundColor: 'var(--color-canvas-soft)',
              borderBottom: '1px solid var(--color-hairline)',
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0 20px',
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-body)' }}>
              Current Stage: <strong style={{ color: 'var(--color-ink)' }}>{STAGE_LABELS[interview?.currentStage || 'REQUIREMENTS_GATHERING']}</strong>
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {aiStatus === 'thinking' && <span className="timeline-pill pill-thinking">AI Thinking...</span>}
              {aiStatus === 'editing' && <span className="timeline-pill pill-edit">AI Synthesizing Turn...</span>}
              {aiStatus === 'done' && <span className="timeline-pill pill-done">Turn Complete</span>}
            </div>
          </div>

          {/* Chat Transcript Area */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {messages.map((msg, i) => {
              const isAssistant = msg.role === 'ASSISTANT';
              return (
                <div
                  key={msg.id || i}
                  style={{
                    alignSelf: isAssistant ? 'flex-start' : 'flex-end',
                    maxWidth: '82%',
                  }}
                >
                  <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>
                    {isAssistant ? 'AI Interviewer' : 'Candidate'} • Stage: {msg.stage}
                  </div>
                  <div
                    className="ide-pane"
                    style={{
                      backgroundColor: isAssistant ? '#ffffff' : 'var(--color-canvas-soft)',
                      borderColor: isAssistant ? 'var(--color-hairline-strong)' : 'var(--color-hairline)',
                      color: 'var(--color-ink)',
                      lineHeight: 1.6,
                      fontSize: '14px',
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Candidate Response Composer */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '16px 20px',
              backgroundColor: 'var(--color-canvas)',
              borderTop: '1px solid var(--color-hairline)',
              display: 'flex',
              gap: '12px',
            }}
          >
            <input
              type="text"
              className="text-input"
              placeholder="Type your architecture response or design proposal..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="btn-primary" disabled={loading || !inputContent.trim()}>
              <Send size={16} />
              Submit Response
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
