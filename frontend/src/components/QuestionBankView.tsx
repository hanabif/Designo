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

const defaultQuestions: DisplayQuestion[] = [
  {
    id: 'q1',
    title: 'Design URL Shortener (TinyURL)',
    difficulty: 'Beginner',
    company: 'Google',
    companyTrack: 'Google',
    description: 'Design a highly available URL shortening service handling 100M daily short URLs with custom aliases, rate limiting, and real-time click analytics.',
    tags: ['Base62 Hashing', 'Key Generation Service', 'Redis Cache', 'B-Tree Indexing'],
    estTime: '45 min',
    isPro: false,
  },
  {
    id: 'q2',
    title: 'Design Twitter / X News Feed',
    difficulty: 'Intermediate',
    company: 'Meta',
    companyTrack: 'Meta',
    description: 'Design a social media newsfeed system supporting post publishing, timeline generation, and fan-out to 500 million active users with celebrity write-fallbacks.',
    tags: ['Hybrid Fan-out', 'Redis Timelines', 'Kafka Event Streaming', 'Origin Shield'],
    estTime: '45 min',
    isPro: false,
  },
  {
    id: 'q3',
    title: 'Design Uber / Real-Time Dispatch System',
    difficulty: 'Advanced',
    company: 'Uber',
    companyTrack: 'Uber',
    description: 'Design a real-time driver matching and geospatial tracking service with dynamic quad-tree updates, WebSockets, and distributed surge pricing engines.',
    tags: ['QuadTree / GeoHash', 'WebSocket Gateway', 'Surge Pricing Engine', 'Redis Pub/Sub'],
    estTime: '50 min',
    isPro: false,
  },
  {
    id: 'q4',
    title: 'Design Global CDN & Distributed Edge Cache',
    difficulty: 'Staff',
    company: 'Cloudflare',
    companyTrack: 'Cloudflare',
    description: 'Design a multi-region Content Delivery Network with dynamic edge routing, cache invalidation protocols, and Geo-DNS Anycast load balancing.',
    tags: ['Anycast BGP', 'Consistent Hashing', 'Origin Shielding', 'Cache Purge Mesh'],
    estTime: '60 min',
    isPro: true,
  },
  {
    id: 'q5',
    title: 'Design Netflix Video Streaming Pipeline',
    difficulty: 'Advanced',
    company: 'Netflix',
    companyTrack: 'Netflix',
    description: 'Design an adaptive bitrate video ingestion and transcode pipeline with chunked delivery, regional Open Connect CDN appliances, and DRM licensing.',
    tags: ['Bitrate Laddering', 'Open Connect Appliances', 'S3 Object Storage', 'Cassandra Metadata'],
    estTime: '45 min',
    isPro: true,
  },
  {
    id: 'q6',
    title: 'Design Distributed Message Queue (Kafka Clone)',
    difficulty: 'Staff',
    company: 'Amazon',
    companyTrack: 'Amazon',
    description: 'Design an append-only distributed commit log with partition rebalancing, zero-copy socket transfers, and leader-follower quorum replication.',
    tags: ['Commit Log', 'Zero-Copy OS Sendfile', 'Raft Consensus', 'Partition Rebalancing'],
    estTime: '60 min',
    isPro: true,
  },
];

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<DisplayQuestion[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [companyFilter, setCompanyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    api
      .getQuestions()
      .then((data: any) => {
        if (data && data.length > 0) setQuestions(data);
        else setQuestions(defaultQuestions);
      })
      .catch(() => setQuestions(defaultQuestions));
  }, []);

  const difficultyTiers = ['ALL', 'Beginner', 'Intermediate', 'Advanced', 'Staff'];
  const companyList = ['ALL', 'Google', 'Meta', 'Uber', 'Netflix', 'Amazon', 'Cloudflare'];

  const filtered = (questions.length > 0 ? questions : defaultQuestions).filter((q) => {
    const matchesDifficulty =
      difficultyFilter === 'ALL' || q.difficulty.toUpperCase() === difficultyFilter.toUpperCase();
    const companyName = q.company || q.companyTrack;
    const matchesCompany =
      companyFilter === 'ALL' || (companyName && companyName.toUpperCase() === companyFilter.toUpperCase());
    const desc = q.description || q.summary || '';
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesCompany && matchesSearch;
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
          FAANG+ SCENARIOS // 40+ ARCHITECTURE LABS
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          System Design Question Library
        </h1>
        <p className="text-sm text-[#5e5e6e] mt-1 max-w-2xl">
          Curated scenarios calibrated by Staff and Principal interviewers from Google, Meta, Amazon, and Netflix.
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

        {/* Company Filter Tags */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#e5e1ea] overflow-x-auto">
          <span className="text-[11px] font-mono text-[#8e8ea0] uppercase shrink-0">Company Track:</span>
          {companyList.map((comp) => (
            <button
              key={comp}
              onClick={() => setCompanyFilter(comp)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all shrink-0 cursor-pointer ${
                companyFilter === comp
                  ? 'bg-[#ede9fe] text-[#6b38d4] font-semibold border border-[#8b5cf6]/30'
                  : 'text-[#5e5e6e] hover:bg-[#faf9fc]'
              }`}
            >
              {comp}
            </button>
          ))}
        </div>
      </Card>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
