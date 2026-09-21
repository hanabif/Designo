import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Search, Lock, Clock, ArrowUpDown } from 'lucide-react';
import { api } from '../services/api';

interface QuestionBankViewProps {
  onSelectQuestion: (questionId: string, difficulty: string, companyTrack: string) => void;
}

const defaultQuestions = [
  {
    id: 'q1',
    title: 'Design URL Shortener (TinyURL)',
    difficulty: 'Beginner',
    description: 'Design a high-scale URL shortening service like TinyURL handling 100M daily short URLs with custom aliases and analytics.',
    tags: ['Hashing', 'Base62', 'KGS Service', 'Caching'],
    estTime: '45 min',
    isPro: false,
  },
  {
    id: 'q2',
    title: 'Design Twitter / X News Feed',
    difficulty: 'Intermediate',
    description: 'Design a social media newsfeed system supporting post publishing, timeline generation, and fan-out to 500 million active users.',
    tags: ['Fan-out Service', 'Redis Timelines', 'Kafka', 'CDN'],
    estTime: '45 min',
    isPro: false,
  },
  {
    id: 'q3',
    title: 'Design Uber / Real-Time Dispatch System',
    difficulty: 'Advanced',
    description: 'Design a real-time driver matching and geo-location tracking service with quad-tree index updates and surge pricing engines.',
    tags: ['QuadTree', 'GeoHash', 'WebSockets', 'Surge Engine'],
    estTime: '50 min',
    isPro: false,
  },
  {
    id: 'q4',
    title: 'Design Global CDN & Distributed Cache',
    difficulty: 'Staff',
    description: 'Design a multi-region Content Delivery Network with dynamic edge routing, cache invalidation, and Geo-DNS load balancing.',
    tags: ['GeoDNS', 'Consistent Hashing', 'BGP Anycast', 'LRU'],
    estTime: '60 min',
    isPro: true,
  },
  {
    id: 'q5',
    title: 'Design Netflix Video Streaming Pipeline',
    difficulty: 'Advanced',
    description: 'Design dynamic adaptive bitrate video encoding, regional origin shields, and microservice DRM delivery.',
    tags: ['Bitrate Encoding', 'Origin Shield', 'S3', 'CDN'],
    estTime: '45 min',
    isPro: true,
  },
];

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [sortOption, setSortOption] = useState<string>('popular');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    api
      .getQuestions()
      .then((data) => {
        if (data && data.length > 0) setQuestions(data);
        else setQuestions(defaultQuestions);
      })
      .catch(() => setQuestions(defaultQuestions));
  }, []);

  const filtered = (questions.length > 0 ? questions : defaultQuestions).filter((q) => {
    const matchesDifficulty =
      difficultyFilter === 'ALL' || q.difficulty.toUpperCase() === difficultyFilter.toUpperCase();
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="container section-padding">
      {/* Page Title */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-accent" style={{ marginBottom: '6px' }}>
          <BookOpen size={12} /> System Design Bank
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 400 }}>Question Library</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px', marginTop: '4px' }}>
          Browse curated system design interview problems asked by top tech firms.
        </p>
      </div>

      {/* Toolbar: Search, Filters & Sort */}
      <div
        className="card-solid"
        style={{
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--color-text-muted)" />
          <input
            type="text"
            className="input-cofounder"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Difficulty Chips */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)' }}>Difficulty:</span>
          {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF'].map((level) => (
            <button
              key={level}
              onClick={() => setDifficultyFilter(level)}
              style={{
                padding: '6px 12px',
                borderRadius: 'var(--radius-pill)',
                border: difficultyFilter === level ? '1px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                backgroundColor: difficultyFilter === level ? 'var(--color-primary)' : 'var(--color-bg)',
                color: 'var(--color-text)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {level === 'ALL' ? 'All' : level.charAt(0) + level.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Sort Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ArrowUpDown size={16} color="var(--color-text-secondary)" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="input-cofounder"
            style={{ width: 'auto', padding: '6px 12px', fontSize: '13px' }}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest</option>
            <option value="difficulty-asc">Difficulty ↑</option>
            <option value="difficulty-desc">Difficulty ↓</option>
          </select>
        </div>
      </div>

      {/* Question Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filtered.map((q) => {
          const isLocked = q.isPro;

          return (
            <div
              key={q.id}
              className="card-solid"
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
                backgroundColor: isLocked ? 'var(--color-bg-secondary)' : 'var(--color-card-solid)',
              }}
            >
              {/* Sheen Overlay & Lock Badge for Pro Locked Cards */}
              {isLocked && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: 'var(--color-text)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Lock size={12} /> Pro Only
                </div>
              )}

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span className="badge-accent">{q.difficulty}</span>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> {q.estTime || '45 min'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{q.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {q.description}
                </p>

                {/* Tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                  {q.tags?.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '11px',
                        backgroundColor: 'var(--color-bg)',
                        border: '1px solid var(--color-border-subtle)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-subtle)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {isLocked ? (
                <button className="btn-filled" style={{ width: '100%', justifyContent: 'center' }} disabled>
                  <Lock size={14} /> Unlock with Pro
                </button>
              ) : (
                <button
                  onClick={() => onSelectQuestion(q.id, q.difficulty, 'GENERAL')}
                  className="btn-dark"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <Play size={15} /> Start Mock Interview
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
