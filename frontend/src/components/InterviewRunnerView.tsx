import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';


interface InterviewRunnerViewProps {
  interviewId?: string;
  onFinish?: (interviewId: string) => void;
}

export const InterviewRunnerView: React.FC<InterviewRunnerViewProps> = ({
  interviewId: propInterviewId,
  onFinish: propOnFinish,
}) => {
  const { interviewId: paramInterviewId } = useParams<{ interviewId?: string }>();
  const navigate = useNavigate();
  const interviewId = propInterviewId || paramInterviewId || 'session-demo-1';

  const onFinish = (id: string) => {
    if (propOnFinish) {
      propOnFinish(id);
    } else {
      navigate('/report');
    }
  };
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(3);
  const [messages, setMessages] = useState<any[]>([
    {
      id: 'm1',
      sender: 'ai',
      stage: 'Scope & Requirements',
      content: 'Welcome to your system design interview. We will design a Global Real-Time Ride Hashing & Dispatch System (like Uber). Let’s begin by defining core functional requirements and traffic estimates.',
      timestamp: '14:00',
    },
    {
      id: 'm2',
      sender: 'user',
      content: '1. Riders can request a ride and get matched with nearby drivers within 5 seconds.\n2. Drivers broadcast location coordinates (lat/long) every 4 seconds.\n3. Dynamic surge pricing calculated per H3 hexagon cell.\nTraffic: 100k active concurrent drivers, 25k requests/sec at peak.',
      scoreDelta: '+12pts',
      timestamp: '14:02',
    },
    {
      id: 'm3',
      sender: 'ai',
      stage: 'High-Level Architecture',
      content: 'Under a sudden surge of 100k drivers broadcasting GPS coordinates every 4 seconds (25k writes/sec), your database will choke if written directly to disk. What caching and pub/sub topology do you deploy to buffer ingest?',
      timestamp: '14:04',
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [rightTab, setRightTab] = useState<'topology' | 'scratchpad' | 'math'>('topology');
  const [notes, setNotes] = useState<string>(
`// Math & Sizing Estimates
100k active drivers * 128 bytes GPS payload = ~12.8 MB/sec
Kafka partition strategy: key = GeoHash(lat, lng, precision=6)
Redis Cluster: In-memory GeoSet with 60s TTL for active drivers
Workers consume from Kafka, update Redis GeoSet, push to WebSocket Gateway`
  );
  const [timerSeconds, setTimerSeconds] = useState<number>(2450);

  const stages = [
    'Requirements',
    'Capacity Math',
    'API Contracts',
    'High-Level Design',
    'Deep Dive',
    'Fault Tolerance',
    'Bottlenecks',
    'Wrap-up',
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
      scoreDelta: '+16pts',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');

    try {
      const res: any = await api.sendInterviewMessage(interviewId, currentInput);
      if (res) {
        const replyMsg = res.message || res.content || res;
        const aiMsg = typeof replyMsg === 'object' && replyMsg.content ? replyMsg : {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          stage: stages[currentStageIndex],
          content: typeof replyMsg === 'string' ? replyMsg : (replyMsg.text || JSON.stringify(replyMsg)),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, { ...aiMsg, sender: 'ai' }]);
      }
    } catch {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            stage: stages[currentStageIndex],
            content: "Excellent reasoning on utilizing Redis GeoSet and Kafka. Now, how do you handle split-brain or network partitions if the Redis master node drops during a citywide surge event?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        if (currentStageIndex < stages.length - 1) {
          setCurrentStageIndex((prev) => prev + 1);
        }
      }, 900);
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#faf9fe]">
      {/* Top Session Bar */}
      <div className="h-14 px-6 bg-white border-b border-[#e5e1ea] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
            <span className="font-display font-bold text-sm text-[#0a0a0f]">
              Design Uber / Real-Time Dispatch System
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <span className="text-[#8e8ea0]">•</span>
            <span className="text-[#6b38d4] font-semibold bg-[#ede9fe] px-2.5 py-0.5 rounded-full">
              Stage {currentStageIndex + 1}: {stages[currentStageIndex]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className="flex items-center gap-2 font-mono text-xs bg-[#faf9fc] border border-[#e5e1ea] px-3 py-1.5 rounded-full text-[#0a0a0f]">
            <Clock size={14} className="text-[#6b38d4]" />
            <span className="font-semibold">{formatTimer(timerSeconds)}</span>
          </div>

          <button
            onClick={() => onFinish(interviewId)}
            className="px-4 py-1.5 rounded-full bg-[#0a0a0f] hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all"
          >
            End &amp; Evaluate Session
          </button>
        </div>
      </div>

      {/* Main 2-Column Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Column: Chat Dialogue (7 cols) */}
        <div className="lg:col-span-7 flex flex-col border-r border-[#e5e1ea] bg-[#faf9fe] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" data-lenis-prevent>
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div
                  key={m.id}
                  className={`flex items-start gap-3 ${isAi ? '' : 'justify-end'}`}
                >
                  {isAi && (
                    <div className="w-8 h-8 rounded-full bg-[#ede9fe] border border-[#8b5cf6]/30 flex items-center justify-center shrink-0 font-bold text-xs text-[#6b38d4]">
                      AI
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 shadow-xs ${
                      isAi
                        ? 'bg-white border border-[#e5e1ea] rounded-tl-sm text-[#0a0a0f]'
                        : 'bg-[#f3f0ff] border border-[#8b5cf6]/20 rounded-tr-sm text-[#0a0a0f]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1.5 font-mono text-[10px]">
                      <span className={isAi ? 'text-[#6b38d4] font-semibold' : 'text-[#5e5e6e]'}>
                        {isAi ? `ARCHITECT AI // ${m.stage || 'Live Prompt'}` : 'YOU (CANDIDATE)'}
                      </span>
                      <div className="flex items-center gap-2">
                        {m.scoreDelta && (
                          <span className="text-[#10b981] font-semibold">{m.scoreDelta}</span>
                        )}
                        <span className="text-[#8e8ea0]">{m.timestamp}</span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-[13px] leading-relaxed whitespace-pre-line font-sans">
                      {m.content}
                    </p>
                  </div>

                  {!isAi && (
                    <div className="w-8 h-8 rounded-full bg-white border border-[#e5e1ea] flex items-center justify-center shrink-0 font-bold text-xs text-[#0a0a0f]">
                      ME
                    </div>
                  )}
                </div>
              );
            })}

            {/* Live Evaluator Metric Pill */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>
                  <strong>Active Evaluation Vector:</strong> Scalability &amp; In-Memory Data Structures
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-700">SCORE: 88% STRONG HIRE</span>
            </div>
          </div>

          {/* Chat Input Toolbar */}
          <div className="p-4 bg-white border-t border-[#e5e1ea]">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => setInputMessage((prev) => prev + "How does our p99 SLA respond if partition count scales 4x?")}
                className="text-[11px] font-mono text-[#5e5e6e] bg-[#faf9fc] hover:bg-[#ede9fe] hover:text-[#6b38d4] px-2.5 py-1 rounded-full border border-[#e5e1ea] transition-colors"
              >
                + Clarify SLA Limits
              </button>
              <button
                onClick={() => setInputMessage((prev) => prev + "I propose deploying a dual-region active-active cluster with quorum replication.")}
                className="text-[11px] font-mono text-[#5e5e6e] bg-[#faf9fc] hover:bg-[#ede9fe] hover:text-[#6b38d4] px-2.5 py-1 rounded-full border border-[#e5e1ea] transition-colors"
              >
                + Propose Active-Active Cluster
              </button>
            </div>

            <div className="flex items-end gap-2">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Explain your architectural design, data models, or ask clarification questions... (Press Enter to send)"
                rows={2}
                className="flex-1 p-3 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-none focus:border-[#6b38d4] focus:bg-white resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="p-3 rounded-xl bg-[#0a0a0f] hover:bg-neutral-800 disabled:opacity-40 text-white transition-all shadow-xs"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Whiteboard & Scratchpad (5 cols) */}
        <div className="lg:col-span-5 flex flex-col bg-white overflow-hidden">
          {/* Tab Header */}
          <div className="h-12 px-4 border-b border-[#e5e1ea] flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setRightTab('topology')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rightTab === 'topology'
                    ? 'bg-[#ede9fe] text-[#6b38d4]'
                    : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                }`}
              >
                Topology Graph
              </button>
              <button
                onClick={() => setRightTab('scratchpad')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rightTab === 'scratchpad'
                    ? 'bg-[#ede9fe] text-[#6b38d4]'
                    : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                }`}
              >
                Scratchpad
              </button>
              <button
                onClick={() => setRightTab('math')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  rightTab === 'math'
                    ? 'bg-[#ede9fe] text-[#6b38d4]'
                    : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
                }`}
              >
                Capacity Math
              </button>
            </div>

            <span className="text-[11px] font-mono text-[#8e8ea0]">AUTO-SAVING</span>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4 overflow-y-auto" data-lenis-prevent>
            {rightTab === 'topology' && (
              <div className="h-full flex flex-col justify-between">
                <div className="rounded-2xl border border-[#e5e1ea] bg-[#faf9fe] p-4 relative overflow-hidden flex-1 flex flex-col justify-center">
                  <div className="text-center space-y-3 py-4">
                    {/* Node 1 */}
                    <div className="inline-block p-3 rounded-xl bg-white border border-[#e5e1ea] shadow-xs text-xs font-semibold text-[#0a0a0f]">
                      100k Mobile GPS Clients (Drivers / Riders)
                    </div>
                    <div className="text-[#8e8ea0] font-mono text-[10px]">↓ WebSockets / TLS 1.3</div>
                    {/* Node 2 */}
                    <div className="inline-block p-3 rounded-xl bg-[#ede9fe] border border-[#8b5cf6]/30 shadow-xs text-xs font-bold text-[#6b38d4]">
                      WebSocket Edge Gateway Cluster (Envoy Proxy)
                    </div>
                    <div className="text-[#8e8ea0] font-mono text-[10px]">↓ Partitioned Events (GeoHash Cell)</div>
                    {/* Node 3 */}
                    <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                      <div className="p-3 rounded-xl bg-white border border-[#e5e1ea] text-center shadow-xs">
                        <div className="font-mono text-[10px] text-[#8e8ea0]">Buffer Stream</div>
                        <div className="text-xs font-bold text-[#0a0a0f] mt-1">Kafka Queue</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-[#e5e1ea] text-center shadow-xs">
                        <div className="font-mono text-[10px] text-[#8e8ea0]">Spatial Index</div>
                        <div className="text-xs font-bold text-[#0a0a0f] mt-1">Redis GeoSet</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-[#faf9fc] border border-[#e5e1ea] flex items-center justify-between text-xs font-mono text-[#5e5e6e]">
                  <span>P99 Write Latency: <strong>3.8ms</strong></span>
                  <span className="text-[#10b981] font-semibold">Zero Packet Drop</span>
                </div>
              </div>
            )}

            {rightTab === 'scratchpad' && (
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-full p-4 font-mono text-xs text-[#0a0a0f] bg-[#faf9fc] border border-[#e5e1ea] rounded-xl focus:outline-none focus:bg-white resize-none leading-relaxed"
                placeholder="Type your notes, API contracts, database schemas..."
              />
            )}

            {rightTab === 'math' && (
              <div className="space-y-4 text-xs font-mono text-[#0a0a0f]">
                <div className="p-4 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
                  <div className="text-[#6b38d4] font-bold text-sm mb-2">QPS Calculations</div>
                  <p className="text-[#5e5e6e] leading-relaxed">
                    • 100,000 active concurrent drivers<br />
                    • Broadcast interval = 4 seconds<br />
                    • <strong>Write QPS = 100,000 / 4 = 25,000 req/sec</strong><br />
                    • Payload size per broadcast = ~128 bytes<br />
                    • Ingress bandwidth = 25,000 * 128 bytes = <strong>3.2 MB/sec</strong>
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
                  <div className="text-[#6b38d4] font-bold text-sm mb-2">Memory Footprint</div>
                  <p className="text-[#5e5e6e] leading-relaxed">
                    • 100,000 driver objects in Redis GeoSet<br />
                    • Driver location record (ID + Lat + Lng + Timestamp) = ~64 bytes<br />
                    • Total RAM = 100,000 * 64 bytes = ~6.4 MB<br />
                    • <strong>Easily fits in single node RAM (32-shard cluster for redundancy)</strong>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
