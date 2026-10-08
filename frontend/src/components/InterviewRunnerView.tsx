import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Send, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { addPracticeSeconds, getPracticeSeconds, formatDuration } from '../lib/practiceTime';


interface InterviewRunnerViewProps {
  interviewId?: string;
  onFinish?: (interviewId: string) => void;
}

// Canonical backend stage order (mirrors STAGE_SEQUENCE on the server).
const BACKEND_STAGE_SEQUENCE = [
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

// Visible stage pills shown in the session header (8 buckets).
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

// The backend persists 9 interview stages while the header pill shows 8
// buckets; map the saved stage onto the closest visible one so a resumed
// session lands back where it left off instead of restarting at Stage 1.
const stageIndexOf = (backendStage?: string) => {
  const index = backendStage ? BACKEND_STAGE_SEQUENCE.indexOf(backendStage) : -1;
  if (index < 0) return 0;
  return Math.min(Math.floor((index * stages.length) / BACKEND_STAGE_SEQUENCE.length), stages.length - 1);
};

export const InterviewRunnerView: React.FC<InterviewRunnerViewProps> = ({
  interviewId: propInterviewId,
  onFinish: propOnFinish,
}) => {
  const { interviewId: paramInterviewId } = useParams<{ interviewId?: string }>();
  const navigate = useNavigate();
  const interviewId = propInterviewId || paramInterviewId || '';

  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [messages, setMessages] = useState<any[]>([]);
  const [requestError, setRequestError] = useState('');
  const [interviewTitle, setInterviewTitle] = useState('System Design Interview');
  const [interviewStatus, setInterviewStatus] = useState<string>('IN_PROGRESS');
  const [isLoadingSession, setIsLoadingSession] = useState<boolean>(true);
  const [sessionHistory, setSessionHistory] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(2450);
  // Non-null while "End & Evaluate Session" is running (finish + evaluation).
  const [finishPhase, setFinishPhase] = useState<'finishing' | 'evaluating' | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const onFinish = async (id: string) => {
    if (propOnFinish) {
      propOnFinish(id);
      return;
    }
    if (finishPhase) return; // Already finishing — ignore double clicks.
    setRequestError('');
    setFinishPhase('finishing');
    try {
      await api.finishInterview(id);
      setFinishPhase('evaluating');
      const report = await api.generateEvaluation(id);
      navigate(`/report/${report.id}`);
    } catch (error) {
      setFinishPhase(null);
      setRequestError(error instanceof Error ? error.message : 'Could not finish this interview.');
    }
  };

  useEffect(() => {
    if (!interviewId) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [interviewId]);

  // Track actual practice time: 1 second per tick while this session is live.
  // Persisted per interview so the dashboard can total it up later.
  useEffect(() => {
    if (!interviewId || interviewStatus !== 'IN_PROGRESS') return;
    const interval = setInterval(() => addPracticeSeconds(interviewId, 1), 1000);
    return () => clearInterval(interval);
  }, [interviewId, interviewStatus]);

  // With no interview id in the URL (e.g. the "Simulator" nav link), load the
  // user's history and show it as a pickable list instead of a blank chat.
  useEffect(() => {
    if (interviewId) return;
    let active = true;
    setIsLoadingSession(true);
    api.getInterviewHistory()
      .then((history: any[]) => {
        if (!active) return;
        setSessionHistory(history || []);
        setIsLoadingSession(false);
      })
      .catch((error: Error) => {
        if (active) {
          setRequestError(error.message);
          setIsLoadingSession(false);
        }
      });
    return () => { active = false; };
  }, [interviewId]);

  // Load the persisted conversation so a session left mid-interview resumes
  // exactly where it stopped (messages, stage, and replay/read-only state).
  useEffect(() => {
    if (!interviewId) return;
    let active = true;
    setIsLoadingSession(true);
    api.getInterview(interviewId).then((interview: any) => {
      if (!active) return;
      setInterviewTitle(interview.question?.title || 'System Design Interview');
      setInterviewStatus(interview.status || 'IN_PROGRESS');
      setMessages((interview.messages || []).map((message: any) => ({ id: message.id, sender: message.role === 'USER' ? 'user' : 'ai', stage: message.stage, content: message.content, timestamp: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) })));
      setCurrentStageIndex(stageIndexOf(interview.currentStage));
      setIsLoadingSession(false);
    }).catch((error: Error) => {
      if (active) {
        setRequestError(error.message);
        setIsLoadingSession(false);
      }
    });
    return () => { active = false; };
  }, [interviewId]);

  // Keep the newest turn in view whenever a session is reopened or a reply lands.
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isLoadingSession]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    if (!interviewId) { setRequestError('Start an interview from the dashboard or question library first.'); return; }
    if (interviewStatus !== 'IN_PROGRESS') { setRequestError('This session has already ended. Start a new interview from the dashboard to keep practicing.'); return; }

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputMessage;
    setInputMessage('');
    setRequestError('');

    try {
      const res: any = await api.sendInterviewMessage(interviewId, currentInput);
      const reply = res.assistantMessage || res.message || res;
      if (reply?.content) {
        setMessages((prev) => [...prev, { ...reply, sender: 'ai', timestamp: new Date(reply.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      }
      if (res.currentStage) setCurrentStageIndex(stageIndexOf(res.currentStage));
      else setCurrentStageIndex((prev) => Math.min(prev + 1, stages.length - 1));
    } catch (error) {
      setMessages((prev) => prev.filter((message) => message.id !== userMsg.id));
      setRequestError(error instanceof Error ? error.message : 'Message could not be sent.');
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-[#faf9fe]">
      {/* Top Session Bar */}
      <div className="h-14 px-6 bg-white border-b border-[#e5e1ea] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full animate-pulse ${interviewId ? 'bg-[#10b981]' : 'bg-[#8e8ea0]'}`}></span>
            <span className="font-display font-bold text-sm text-[#0a0a0f]">
              {interviewId ? interviewTitle : 'Interview Simulator'}
            </span>
            {!interviewId && (
              <span className="font-mono text-[10px] text-[#8e8ea0] uppercase tracking-wider">
                Session History // Pick a chat
              </span>
            )}
          </div>
          {interviewId && (
            <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8e8ea0]">•</span>
              <span className="text-[#6b38d4] font-semibold bg-[#ede9fe] px-2.5 py-0.5 rounded-full">
                Stage {currentStageIndex + 1}: {stages[currentStageIndex]}
              </span>
              {interviewStatus !== 'IN_PROGRESS' && (
                <span className="hidden sm:inline font-mono text-xs font-semibold bg-[#faf9fc] border border-[#e5e1ea] text-[#5e5e6e] px-2.5 py-0.5 rounded-full">
                  SESSION ENDED — TRANSCRIPT
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          {interviewId && (
            <div className="flex items-center gap-2 font-mono text-xs bg-[#faf9fc] border border-[#e5e1ea] px-3 py-1.5 rounded-full text-[#0a0a0f]">
              <Clock size={14} className="text-[#6b38d4]" />
              <span className="font-semibold">{formatTimer(timerSeconds)}</span>
            </div>
          )}

          {interviewId && interviewStatus === 'IN_PROGRESS' && (
            <button
              onClick={() => onFinish(interviewId)}
              disabled={!!finishPhase}
              className="px-4 py-1.5 rounded-full bg-[#0a0a0f] hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-semibold shadow-xs transition-all"
            >
              {finishPhase ? 'Evaluating…' : 'End & Evaluate Session'}
            </button>
          )}
        </div>
      </div>
      {requestError && <div role="alert" className="mx-4 mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{requestError}</div>}

      {/* Finish & Evaluation Loading Overlay */}
      {finishPhase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/50 backdrop-blur-xs p-4"
          role="status"
          aria-live="polite"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white border border-[#e5e1ea] shadow-lg p-8 text-center">
            <div
              className="mx-auto mb-5 h-12 w-12 rounded-full border-4 border-[#ede9fe] border-t-[#6b38d4] animate-spin"
              aria-hidden="true"
            />
            <h2 className="font-display font-bold text-lg text-[#0a0a0f]">
              {finishPhase === 'finishing' ? 'Ending your session…' : 'Generating your evaluation…'}
            </h2>
            <p className="text-xs text-[#5e5e6e] mt-2 leading-relaxed">
              {finishPhase === 'finishing'
                ? 'Saving your interview transcript and preparing your evaluation report.'
                : 'Our AI interviewer is scoring your answers across 7 competencies. This usually takes a few seconds — please wait and do not refresh the page.'}
            </p>
            <div className="mt-5 h-1.5 w-full rounded-full bg-[#e5e1ea] overflow-hidden">
              <div
                className={`h-full bg-[#6b38d4] transition-all duration-500 ${finishPhase === 'finishing' ? 'w-1/3' : 'w-2/3 animate-pulse'}`}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area (full width) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {isLoadingSession && (
          <div className="flex-1 flex items-center justify-center font-mono text-xs text-[#5e5e6e]">
            {interviewId ? 'Restoring your session…' : 'Loading your interview sessions…'}
          </div>
        )}

        {!isLoadingSession && !interviewId && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6" data-lenis-prevent>
            <div className="max-w-3xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
                <h2 className="font-display font-bold text-xl text-[#0a0a0f]">Your interview sessions</h2>
                <button
                  onClick={() => navigate('/questions')}
                  className="px-4 py-2 rounded-full bg-[#0a0a0f] hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  + New interview
                </button>
              </div>
              <p className="text-xs text-[#5e5e6e] mb-5">
                Click any session to open its full chat — resume where you left off, or replay a finished interview.
              </p>

              {!sessionHistory.length ? (
                <div className="text-center p-8 rounded-2xl bg-white border border-[#e5e1ea] shadow-xs">
                  <h3 className="font-display font-bold text-lg text-[#0a0a0f]">No interviews yet</h3>
                  <p className="text-xs text-[#5e5e6e] mt-2 mb-6 leading-relaxed">
                    Every message is saved automatically — your sessions will appear here so you can reopen their chats anytime.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 rounded-full bg-white border border-[#e5e1ea] text-[#0a0a0f] text-xs font-semibold hover:bg-[#faf9fc] transition-all"
                  >
                    Go to dashboard
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessionHistory.map((session: any) => {
                    const inProgress = session.status === 'IN_PROGRESS';
                    const abandoned = session.status === 'ABANDONED';
                    const score = session.evaluation?.overallScore;
                    const tracked = getPracticeSeconds(session.id);
                    const statusLabel = inProgress ? 'In progress' : abandoned ? 'Abandoned' : 'Completed';
                    const statusClass = inProgress
                      ? 'bg-[#ede9fe] text-[#6b38d4]'
                      : abandoned
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-emerald-50 text-[#10b981]';
                    return (
                      <button
                        key={session.id}
                        onClick={() => navigate(`/interview/${session.id}`)}
                        className="w-full text-left p-4 rounded-2xl bg-white border border-[#e5e1ea] hover:border-[#8b5cf6]/50 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full shrink-0 ${inProgress ? 'bg-[#6b38d4]' : 'bg-[#10b981]'}`} />
                            <h3 className="font-semibold text-sm text-[#0a0a0f] truncate">{session.question?.title ?? 'Interview session'}</h3>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 text-[11px] font-mono text-[#5e5e6e]">
                            <span>{session.companyTrack} Track</span>
                            <span>•</span>
                            <span>{session.difficulty}</span>
                            <span>•</span>
                            <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                            {tracked > 0 && (<><span>•</span><span>{formatDuration(tracked)}</span></>)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <div className="font-display font-bold text-sm text-[#0a0a0f]">{score != null ? `${score}/100` : inProgress ? 'Resume →' : 'View chat'}</div>
                            <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusClass}`}>{statusLabel}</span>
                          </div>
                          <ChevronRight size={16} className="text-[#8e8ea0]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {!isLoadingSession && interviewId && (
        <div className="flex flex-col flex-1 overflow-hidden">
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

            {messages.length > 0 && interviewStatus === 'IN_PROGRESS' && <p className="rounded-xl border border-[#e5e1ea] bg-white p-3 text-xs text-[#5e5e6e]">Your evaluation is generated after you finish this session.</p>}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input Toolbar */}
          <div className="p-4 bg-white border-t border-[#e5e1ea]">
            {interviewStatus !== 'IN_PROGRESS' && (
              <p className="mb-2 rounded-lg border border-[#e5e1ea] bg-[#faf9fc] px-3 py-2 text-xs text-[#5e5e6e]">
                This session has ended — you're viewing the full transcript. Start a new interview from the dashboard to practice again.
              </p>
            )}
            <div className={`flex items-center gap-2 mb-2 ${interviewStatus !== 'IN_PROGRESS' ? 'hidden' : ''}`}>
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
                placeholder={interviewStatus === 'IN_PROGRESS' ? "Explain your architectural design, data models, or ask clarification questions... (Press Enter to send)" : 'This interview has ended — transcript is read-only.'}
                disabled={interviewStatus !== 'IN_PROGRESS'}
                rows={2}
                className="flex-1 p-3 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-none focus:border-[#6b38d4] focus:bg-white resize-none"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || interviewStatus !== 'IN_PROGRESS'}
                className="p-3 rounded-xl bg-[#0a0a0f] hover:bg-neutral-800 disabled:opacity-40 text-white transition-all shadow-xs"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
          </div>
        )}



      </div>
    </div>
  );
};
