import React, { useState, useEffect } from 'react';
import { Pause, Save, CheckCircle2, Clock, Send, Paperclip, Code2 } from 'lucide-react';
import { api } from '../services/api';

interface InterviewRunnerViewProps {
  interviewId: string;
  onFinish: (interviewId: string) => void;
}

export const InterviewRunnerView: React.FC<InterviewRunnerViewProps> = ({ interviewId, onFinish }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(3);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      sender: 'ai',
      stage: 'Requirements Gathering',
      content: 'Welcome to your system design interview. We will design a Global Real-Time Ride Hashing & Dispatch System (like Uber). Let’s begin by defining core functional requirements.',
      timestamp: '10:00 AM',
    },
    {
      id: 'm2',
      sender: 'user',
      content: '1. Riders can request a ride and get matched with nearby drivers in real-time.\n2. Drivers can accept/reject rides.\n3. Real-time location tracking for active rides.',
      timestamp: '10:02 AM',
    },
    {
      id: 'm3',
      sender: 'ai',
      stage: 'High-Level Design',
      content: 'Great. Let’s move to High-Level Design. How would you handle driver location updates (100k active drivers emitting location every 4 seconds) without overloading the primary database?',
      timestamp: '10:05 AM',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [notes, setNotes] = useState<string>('• Drivers send lat/lng every 4s over WebSockets\n• Spatial Indexing using H3 or GeoHash in Redis\n• Kafka topic partitioned by Geohash region cell ID');
  const [activeTab, setActiveTab] = useState<'notes' | 'whiteboard'>('notes');
  const [timerSeconds, setTimerSeconds] = useState<number>(1680);

  const stages = [
    'Requirements Gathering',
    'Non-Functional Req.',
    'Capacity Estimation',
    'High-Level Design',
    'Detailed Design',
    'Scalability',
    'Reliability',
    'Tradeoffs',
    'Final Assessment',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      const res = await api.sendInterviewMessage(interviewId, currentInput);
      if (res && res.message) {
        setMessages((prev) => [...prev, { ...res.message, sender: 'ai' }]);
      }
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            stage: stages[currentStageIndex],
            content: `That's a solid architectural decision. Let's analyze fault tolerance: What happens if your Redis Geospatial cluster loses a primary master node during peak surge hours?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }, 1000);
    }
  };

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-bg)' }}>
      {/* Top Bar: Progress Rail (1-9) + Timer + Pause/Save */}
      <div
        style={{
          height: '56px',
          backgroundColor: 'var(--color-bg-secondary)',
          borderBottom: '1px solid var(--color-border-subtle)',
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        {/* Stage Progress Rail */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', flex: 1, marginRight: '24px' }}>
          {stages.map((stg, i) => (
            <div
              key={stg}
              onClick={() => setCurrentStageIndex(i)}
              style={{
                fontSize: '12px',
                fontWeight: i === currentStageIndex ? 600 : 400,
                padding: '4px 10px',
                borderRadius: 'var(--radius-pill)',
                backgroundColor: i === currentStageIndex ? 'var(--color-text)' : i < currentStageIndex ? 'var(--color-primary)' : 'var(--color-bg)',
                color: i === currentStageIndex ? '#ffffff' : 'var(--color-text)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{i + 1}. {stg}</span>
              {i < currentStageIndex && <CheckCircle2 size={12} color="#1f8a65" />}
            </div>
          ))}
        </div>

        {/* Right Timer & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
            <Clock size={16} /> {formatTimer(timerSeconds)}
          </div>

          <button className="btn-filled" style={{ padding: '6px 12px', fontSize: '13px' }}>
            <Pause size={14} /> Pause
          </button>

          <button onClick={() => onFinish(interviewId)} className="btn-accent" style={{ padding: '6px 14px', fontSize: '13px' }}>
            <Save size={14} /> Complete & Evaluate
          </button>
        </div>
      </div>

      {/* Main Body Split: Chat Thread (Left) vs Right Collapsible Panel */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 360px', overflow: 'hidden' }}>
        {/* Chat Thread Area */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: 'var(--color-bg)' }}>
          {/* Messages Scroll Container */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {messages.map((m) => (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  justify: m.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    backgroundColor: m.sender === 'user' ? 'var(--color-dark-btn)' : 'var(--color-card-solid)',
                    color: m.sender === 'user' ? '#ffffff' : 'var(--color-text)',
                    borderRadius: 'var(--radius-card)',
                    padding: '16px 20px',
                    border: m.sender === 'user' ? 'none' : '1px solid var(--color-border-subtle)',
                    boxShadow: 'var(--shadow-low)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', opacity: 0.8 }}>
                    <span style={{ fontWeight: 600 }}>{m.sender === 'user' ? 'Candidate' : `AI Interviewer (${m.stage || 'Live Evaluation'})`}</span>
                    <span>{m.timestamp}</span>
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: 1.5, whitespace: 'pre-wrap' }}>{m.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input Bar */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--color-border-subtle)', backgroundColor: 'var(--color-card-solid)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button title="Attach Diagram Sketch" className="btn-filled" style={{ padding: '10px' }}>
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                className="input-cofounder"
                placeholder="Propose your architecture, data schema, or fault-tolerance strategy..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button onClick={handleSendMessage} className="btn-accent" style={{ padding: '10px 20px' }}>
                <Send size={16} /> Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Collapsible Panel: Scratchpad / Notes */}
        <div
          style={{
            backgroundColor: 'var(--color-bg-secondary)',
            borderLeft: '1px solid var(--color-border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          {/* Panel Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid var(--color-border-subtle)' }}>
            <button
              onClick={() => setActiveTab('notes')}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === 'notes' ? 'var(--color-card-solid)' : 'transparent',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              📝 Running Notes
            </button>
            <button
              onClick={() => setActiveTab('whiteboard')}
              style={{
                flex: 1,
                padding: '12px',
                background: activeTab === 'whiteboard' ? 'var(--color-card-solid)' : 'transparent',
                border: 'none',
                fontWeight: 600,
                fontSize: '14px',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              🎨 Scratchpad
            </button>
          </div>

          {/* Content Area */}
          <div style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
            {activeTab === 'notes' ? (
              <textarea
                style={{
                  width: '100%',
                  height: '100%',
                  minHeight: '320px',
                  backgroundColor: 'var(--color-card-solid)',
                  border: '1px solid var(--color-border-subtle)',
                  borderRadius: 'var(--radius-button)',
                  padding: '14px',
                  fontSize: '14px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text)',
                  outline: 'none',
                  resize: 'none',
                }}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Keep scratchpad notes, capacity calculations, or SQL query draft..."
              />
            ) : (
              <div
                style={{
                  backgroundColor: 'var(--color-card-solid)',
                  border: '1px dashed var(--color-border-strong)',
                  borderRadius: 'var(--radius-button)',
                  height: '100%',
                  minHeight: '320px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justify: 'center',
                  padding: '24px',
                  textAlign: 'center',
                }}
              >
                <Code2 size={32} color="var(--color-text-muted)" style={{ marginBottom: '12px' }} />
                <p style={{ fontSize: '14px', fontWeight: 500 }}>Mermaid Quick Sketch</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                  Generate or sketch your component diagram in the Diagram Studio.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
