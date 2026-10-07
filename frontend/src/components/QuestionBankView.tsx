import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Search, Lock, Clock } from 'lucide-react';
import { api } from '../services/api';
import type { Question } from '../types';
import { Button, Card, Badge } from './ui';

interface QuestionBankViewProps {
  onSelectQuestion: (questionId: string, difficulty: string, companyTrack: string) => void;
}

interface DisplayQuestion extends Question {
  description: string;
  company?: string;
  estTime?: string;
  isPro?: boolean;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<DisplayQuestion[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    api
      .getQuestions()
      .then((data: any) => {
        if (data && data.length > 0) setQuestions(data);
        else setQuestions([]);
      })
      .catch((error: Error) => { setQuestions([]); setLoadError(error.message); });
  }, []);

  const difficultyTiers = ['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Staff'];
  const filtered = questions.filter((q) => {
    const matchesDifficulty =
      difficultyFilter === 'ALL' || q.difficulty.toUpperCase() === difficultyFilter.toUpperCase();
    const desc = q.description || q.summary || '';
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  const getDifficultyVariant = (diff: string): 'success' | 'warning' | 'primary' | 'neutral' => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return 'success';
      case 'intermediate':
        return 'neutral';
      case 'advanced':
        return 'warning';
      case 'staff':
        return 'primary';
      default:
        return 'neutral';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <Badge variant="primary" icon={<BookOpen size={12} />} className="mb-3">
          INTERVIEW SCENARIOS
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          System Design Question Library
        </h1>
        <p className="text-sm text-[#5e5e6e] mt-1 max-w-2xl">
          Practice scenarios from your interview question library.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="md" className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8e8ea0]" />
            <input
              type="text"
              placeholder="Search by topic, architecture pattern (e.g. Fan-out, CDN, Raft)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#faf9fc] border border-[#e5e1ea] rounded-xl text-xs sm:text-sm text-[#0a0a0f] focus:outline-hidden focus:border-[#6b38d4] focus:bg-white transition-all"
            />
          </div>

          {/* Difficulty Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {difficultyTiers.map((tier) => (
              <button
                key={tier}
                onClick={() => setDifficultyFilter(tier)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  difficultyFilter === tier
                    ? 'bg-[#0a0a0f] text-white shadow-xs'
                    : 'bg-[#faf9fc] text-[#5e5e6e] border border-[#e5e1ea] hover:bg-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

      {loadError && <p role="alert" className="mb-4 text-sm text-red-700">Question library unavailable: {loadError}</p>}
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && !loadError && <p className="col-span-full rounded-xl border border-[#e5e1ea] bg-white p-6 text-sm text-[#5e5e6e]">No questions are available yet. Please try again later.</p>}
        {filtered.map((item) => (
          <Card
            key={item.id}
            padding="md"
            hover
            className="flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant={getDifficultyVariant(item.difficulty)}>
                  {item.difficulty}
                </Badge>
                <div className="flex items-center gap-2">
                  {(item.company || item.companyTrack) && (
                    <span className="text-[11px] font-mono text-[#5e5e6e] bg-[#faf9fc] border border-[#e5e1ea] px-2 py-0.5 rounded">
                      {item.company || item.companyTrack}
                    </span>
                  )}
                  {item.isPro && (
                    <Badge variant="primary" icon={<Lock size={10} />}>
                      PRO
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2 group-hover:text-[#6b38d4] transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#5e5e6e] leading-relaxed mb-4">
                {item.description || item.summary}
              </p>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags.map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#f4f1fb] text-[10px] font-mono text-[#5e5e6e]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Row */}
            <div className="pt-4 border-t border-[#e5e1ea] flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-[#8e8ea0] font-mono">
                <Clock size={13} />
                <span>{item.estTime || item.recommendedTime || '45 min'}</span>
              </div>

              <Button
                variant="dark"
                size="sm"
                iconLeft={<Play size={12} fill="currentColor" />}
                onClick={() => onSelectQuestion(item.id, item.difficulty, item.company || item.companyTrack || 'General')}
              >
                Start Practice
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
