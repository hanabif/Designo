import React, { useState } from 'react';
import { Play, Check, Sparkles, Clock } from 'lucide-react';
import { Modal, Button, Badge } from './ui';
import type { Question } from '../types';

interface InterviewSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBegin: (questionId: string, difficulty: string, companyTrack: string) => void;
  questions: Question[];
}

export const InterviewSetupModal: React.FC<InterviewSetupModalProps> = ({
  isOpen,
  onClose,
  onBegin,
  questions,
}) => {
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>(questions[0]?.id || 'q1');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Intermediate');
  const [selectedTrack, setSelectedTrack] = useState<string>('Google');
  const [interviewerStyle, setInterviewerStyle] = useState<string>('Calibrated');
  const [timeLimit, setTimeLimit] = useState<string>('45 min');

  const tracks = [
    { id: 'Google', name: 'Google', focus: 'Scalability & First Principles' },
    { id: 'Meta', name: 'Meta', focus: 'High QPS & Social Fan-out' },
    { id: 'Amazon', name: 'Amazon', focus: 'Operational Trade-offs & SLAs' },
    { id: 'Netflix', name: 'Netflix', focus: 'Chaos Resiliency & Edge CDNs' },
  ];

  const interviewerStyles = [
    { id: 'Coach', label: 'Supportive Coach', desc: 'Provides subtle hints when stuck' },
    { id: 'Calibrated', label: 'Calibrated Principal', desc: 'Standard FAANG loop evaluation' },
    { id: 'BarRaiser', label: 'Ruthless Bar Raiser', desc: 'Probes aggressive edge-case failures' },
  ];

  const modalBadge = (
    <Badge variant="primary" icon={<Sparkles size={12} />}>
      SESSION INITIALIZATION
    </Badge>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      badge={modalBadge}
      title="Configure Mock Interview"
      subtitle="Tune parameters to replicate your exact upcoming company loop."
      maxWidth="xl"
    >
      <div className="space-y-5">
        {/* Question Selection */}
        <div>
          <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
            1. Target Architecture Scenario
          </label>
          <select
            value={selectedQuestionId}
            onChange={(e) => setSelectedQuestionId(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] font-sans focus:outline-hidden focus:border-[#6b38d4] focus:bg-white"
          >
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.title} ({q.difficulty})
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
            2. Target Difficulty Level
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {['Beginner', 'Intermediate', 'Advanced', 'Staff'].map((level) => {
              const isSelected = selectedDifficulty.toLowerCase() === level.toLowerCase();
              return (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedDifficulty(level)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer ${
                    isSelected
                      ? 'bg-[#ede9fe] text-[#6b38d4] border-[#6b38d4] shadow-xs'
                      : 'bg-[#faf9fc] text-[#5e5e6e] border-[#e5e1ea] hover:bg-white'
                  }`}
                >
                  {level}
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Track */}
        <div>
          <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
            3. Company Rubric &amp; Track
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {tracks.map((track) => {
              const isSelected = selectedTrack.toLowerCase() === track.id.toLowerCase();
              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => setSelectedTrack(track.id)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#f3f0ff] border-[#6b38d4] shadow-xs'
                      : 'bg-[#faf9fc] border-[#e5e1ea] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#6b38d4]' : 'text-[#0a0a0f]'}`}>
                      {track.name}
                    </span>
                    {isSelected && <Check size={14} className="text-[#6b38d4]" />}
                  </div>
                  <div className="text-[11px] text-[#5e5e6e] font-mono">{track.focus}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interviewer Persona */}
        <div>
          <label className="block font-mono text-xs uppercase text-[#5e5e6e] font-semibold mb-2">
            4. AI Interviewer Persona
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {interviewerStyles.map((item) => {
              const isSelected = interviewerStyle === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setInterviewerStyle(item.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#ede9fe] text-[#6b38d4] border-[#6b38d4]'
                      : 'bg-[#faf9fc] text-[#5e5e6e] border-[#e5e1ea] hover:bg-white'
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className="text-[10px] text-[#8e8ea0] mt-0.5 line-clamp-1">{item.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Limit */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#faf9fc] border border-[#e5e1ea]">
          <div className="flex items-center gap-2 text-xs text-[#0a0a0f]">
            <Clock size={16} className="text-[#6b38d4]" />
            <span className="font-semibold">Session Duration</span>
          </div>
          <div className="flex items-center gap-1.5">
            {['30 min', '45 min', '60 min'].map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setTimeLimit(time)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  timeLimit === time
                    ? 'bg-[#0a0a0f] text-white font-semibold'
                    : 'text-[#5e5e6e] hover:bg-white'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#e5e1ea]">
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="dark"
          size="md"
          iconLeft={<Play size={14} fill="currentColor" />}
          onClick={() => {
            onBegin(selectedQuestionId, selectedDifficulty, selectedTrack);
            onClose();
          }}
        >
          Launch Live Session
        </Button>
      </div>
    </Modal>
  );
};
