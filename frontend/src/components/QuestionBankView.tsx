import React, { useState, useEffect } from 'react';
import { BookOpen, Play, Search, Tag, Filter } from 'lucide-react';
import { api } from '../services/api';

interface QuestionBankViewProps {
  onSelectQuestion: (questionId: string, difficulty: string, companyTrack: string) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({ onSelectQuestion }) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [trackFilter, setTrackFilter] = useState<string>('GENERAL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Default seed questions if database is empty
  const defaultQuestions = [
    {
      id: 'q1',
      title: 'Design URL Shortener (TinyURL)',
      difficulty: 'BEGINNER',
      description: 'Design a high-scale URL shortening service like TinyURL or bit.ly handling 100M daily short URLs with custom aliases and analytics.',
      tags: ['Hashing', 'Base62 Encoding', 'Key Generation Service', 'Caching'],
      expectedComponents: ['API Gateway', 'KGS (Key Generation)', 'Redis Cache', 'RDBMS / NoSQL'],
    },
    {
      id: 'q2',
      title: 'Design Twitter / X News Feed',
      difficulty: 'INTERMEDIATE',
      description: 'Design a social media newsfeed system supporting post publishing, timeline generation, and fan-out to 500 million active users.',
      tags: ['Fan-out Service', 'Redis Timeline Arrays', 'Kafka', 'Media Storage'],
      expectedComponents: ['Tweet Service', 'Fanout Worker', 'Timeline Cache', 'CDN'],
    },
    {
      id: 'q3',
      title: 'Design WhatsApp / Real-Time Messaging Platform',
      difficulty: 'ADVANCED',
      description: 'Design an end-to-end encrypted real-time chat application handling 2 billion active users, group messaging, and online status sync.',
      tags: ['WebSockets', 'TCP/IP Gateway', 'Cassandra Chat Storage', 'Push Notification'],
      expectedComponents: ['Gateway Server', 'Session Store', 'Message DB (Cassandra)', 'Media Storage (S3)'],
    },
    {
      id: 'q4',
      title: 'Design Global CDN & Distributed Edge Cache',
      difficulty: 'STAFF',
      description: 'Design a multi-region Content Delivery Network with dynamic edge routing, cache invalidation, and Geo-DNS load balancing.',
      tags: ['GeoDNS', 'Consistent Hashing', 'BGP Anycast', 'LRU Cache Invalidation'],
      expectedComponents: ['Edge POPs', 'Origin Shield', 'Cache Invalidation Engine', 'DNS Resolver'],
    },
  ];

  useEffect(() => {
    api
      .getQuestions()
      .then((data) => {
        if (data && data.length > 0) setQuestions(data);
        else setQuestions(defaultQuestions);
      })
      .catch(() => setQuestions(defaultQuestions))
      .finally(() => setLoading(false));
  }, []);

  const filtered = questions.filter((q) => {
    const matchesDifficulty = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDifficulty && matchesSearch;
  });

  return (
    <div className="container section-rhythm">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <BookOpen size={20} color="#f54e00" />
          <h2 className="display-lg">System Design Question Bank</h2>
        </div>
        <p style={{ color: 'var(--color-body)', fontSize: '16px' }}>
          Select an interview question and target company focus track to launch a multi-stage mock interview.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div
        className="card-surface"
        style={{
          marginBottom: '32px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '280px' }}>
          <Search size={18} color="var(--color-muted)" />
          <input
            type="text"
            className="text-input"
            placeholder="Search questions by keyword or system component..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="var(--color-muted)" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)' }}>Difficulty:</span>
            {['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'STAFF'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  border: difficultyFilter === level ? '1px solid var(--color-ink)' : '1px solid var(--color-hairline-strong)',
                  background: difficultyFilter === level ? 'var(--color-ink)' : 'transparent',
                  color: difficultyFilter === level ? '#ffffff' : 'var(--color-body)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {level}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-muted)' }}>Company Track:</span>
            <select
              value={trackFilter}
              onChange={(e) => setTrackFilter(e.target.value)}
              className="text-input"
              style={{ padding: '6px 12px', width: 'auto', fontSize: '13px' }}
            >
              <option value="GENERAL">General Track</option>
              <option value="GOOGLE">Google (Scalability & Performance)</option>
              <option value="AMAZON">Amazon (Trade-offs & Ops)</option>
              <option value="META">Meta (Massive Scale)</option>
              <option value="NETFLIX">Netflix (Reliability)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
        {filtered.map((q) => (
          <div key={q.id} className="card-surface" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="badge-pill">{q.difficulty}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>
                  Track: {trackFilter}
                </span>
              </div>

              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '10px' }}>{q.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--color-body)', marginBottom: '16px', lineHeight: 1.5 }}>
                {q.description}
              </p>

              {/* Tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                {q.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '11px',
                      backgroundColor: 'var(--color-canvas-soft)',
                      border: '1px solid var(--color-hairline)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--color-muted)',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectQuestion(q.id, q.difficulty, trackFilter)}
              className="btn-primary"
              style={{ width: '100%' }}
            >
              <Play size={16} />
              Start Mock Interview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
