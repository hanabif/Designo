import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Play, Search, Lock, Clock, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { Question } from '../types';
import { Button, Card, Badge, Skeleton } from './ui';

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
  // Roadmap "Practice This Gap" lands here with ?q=<topic> — pre-fill the
  // search so the bank opens filtered to the gap being practised.
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState<DisplayQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>(() => searchParams.get('q') ?? '');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) setSearchQuery(q);
  }, [searchParams]);
  const [loadError, setLoadError] = useState('');
  /** Topic/category chip filter derived from the bank's tags (FR-03 tags). */
  const [tagFilter, setTagFilter] = useState<string>('ALL');
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState('');

  useEffect(() => {
    api
      .getQuestions()
      .then((data: any) => {
        if (data && data.length > 0) setQuestions(data);
        else setQuestions([]);
      })
      .catch((error: Error) => { setQuestions([]); setLoadError(error.message); })
      .finally(() => setIsLoading(false));
  }, []);

  const difficultyTiers = ['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Staff'];

  // Topic categories derived from question tags — the second axis of
  // diversity alongside FR-03's difficulty tiers.
  const tagCounts = new Map<string, number>();
  questions.forEach((q) =>
    (q.tags ?? []).forEach((raw) => {
      const tag = raw.trim().toLowerCase();
      if (tag) tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }),
  );
  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const query = searchQuery.trim().toLowerCase();
  const filtered = questions.filter((q) => {
    const matchesDifficulty =
      difficultyFilter === 'ALL' || q.difficulty.toUpperCase() === difficultyFilter.toUpperCase();
    const desc = q.description || q.summary || '';
    const matchesSearch =
      !query ||
      q.title.toLowerCase().includes(query) ||
      desc.toLowerCase().includes(query) ||
      (q.tags ?? []).some((tag) => tag.toLowerCase().includes(query));
    const matchesTag =
      tagFilter === 'ALL' || (q.tags ?? []).some((tag) => tag.trim().toLowerCase() === tagFilter);
    return matchesDifficulty && matchesSearch && matchesTag;
  });

  /**
   * No match for the searched gap → create one on demand (dedupes server-side,
   * reuses the shared bank when a matching question already exists).
   */
  const generateForTopic = async () => {
    const topic = searchQuery.trim();
    if (!topic || generating) return;
    setGenerating(true);
    setGenerateError('');
    try {
      const res = await api.generateQuestion(
        topic,
        difficultyFilter !== 'ALL' ? difficultyFilter.toUpperCase() : undefined,
      );
      const created: DisplayQuestion = {
        ...res.question,
        description: res.question.description ?? '',
      };
      setQuestions((prev) => [created, ...prev.filter((q) => q.id !== created.id)]);
      // Guarantee the result is visible under the current filters.
      setTagFilter('ALL');
      if (!res.generated) setDifficultyFilter('ALL');
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : 'Could not generate a question.');
    } finally {
      setGenerating(false);
    }
  };

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

  /** Deterministic colour per tag so categories read at a glance. */
  const tagStyle = (tag: string, idx: number): string => {
    const palette = [
      'bg-[#ede9fe] text-[#6b38d4]',
      'bg-[#dbeafe] text-[#1d4ed8]',
      'bg-[#d1fae5] text-[#047857]',
      'bg-[#fef3c7] text-[#b45309]',
      'bg-[#fce7f3] text-[#be185d]',
    ];
    let hash = idx;
    for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
    return palette[hash % palette.length];
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

        {/* Topic categories derived from tags */}
        {topTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-[#e5e1ea] pt-3">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-[0.15em] text-[#8e8ea0]">
              Topics
            </span>
            <button
              onClick={() => setTagFilter('ALL')}
              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all cursor-pointer ${
                tagFilter === 'ALL'
                  ? 'bg-[#6b38d4] text-white shadow-xs'
                  : 'bg-[#faf9fc] text-[#5e5e6e] border border-[#e5e1ea] hover:bg-white'
              }`}
            >
              All
            </button>
            {topTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setTagFilter(tag === tagFilter ? 'ALL' : tag)}
                className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                  tagFilter === tag
                    ? 'bg-[#6b38d4] text-white shadow-xs'
                    : 'bg-[#faf9fc] text-[#5e5e6e] border border-[#e5e1ea] hover:bg-white'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

      {loadError && <p role="alert" className="mb-4 text-sm text-red-700">Question library unavailable: {loadError}</p>}
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && Array.from({ length: 6 }, (_, index) => (
          <Card key={`question-skeleton-${index}`} padding="md" className="min-h-[260px]">
            <div className="mb-4 flex justify-between"><Skeleton className="h-5 w-24 rounded-full" /><Skeleton className="h-5 w-20 rounded-full" /></div>
            <Skeleton className="mb-3 h-5 w-3/4" />
            <Skeleton className="mb-2 h-3 w-full" /><Skeleton className="mb-2 h-3 w-5/6" /><Skeleton className="mb-6 h-3 w-2/3" />
            <div className="flex justify-between border-t border-[#e5e1ea] pt-4"><Skeleton className="h-4 w-16" /><Skeleton className="h-8 w-28 rounded-xl" /></div>
          </Card>
        ))}
        {!isLoading && filtered.length === 0 && !loadError && (
          <div className="col-span-full rounded-xl border border-[#e5e1ea] bg-white p-8 text-center">
            <p className="text-sm text-[#5e5e6e]">
              {query ? (
                <>
                  No questions match <span className="font-semibold text-[#0a0a0f]">“{searchQuery.trim()}”</span> yet.
                </>
              ) : (
                'No questions are available yet. Please try again later.'
              )}
            </p>
            {generateError && (
              <p role="alert" className="mt-3 text-xs text-red-600">{generateError}</p>
            )}
            {query && (
              <div className="mt-5">
                <Button
                  variant="dark"
                  size="sm"
                  iconLeft={<Sparkles size={14} />}
                  onClick={generateForTopic}
                  disabled={generating}
                >
                  {generating ? 'Generating…' : 'Generate a question for this topic'}
                </Button>
                <p className="mt-2.5 text-xs text-[#8e8ea0]">
                  Writes one into the bank, tailored to this gap — ready for a mock loop.
                </p>
              </div>
            )}
          </div>
        )}
        {!isLoading && filtered.map((item) => (
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
              <p className="mb-4 line-clamp-3 text-xs leading-relaxed text-[#5e5e6e]">
                {item.description || item.summary}
              </p>

              {/* Tags (colour-coded by tag) */}
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.tags.map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${tagStyle(t, idx)}`}
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
