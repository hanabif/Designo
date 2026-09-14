import React, { useState, useEffect } from 'react';
import { Map, BookOpen, Target, CheckCircle2, ArrowUpRight, Flame } from 'lucide-react';
import { api } from '../services/api';

export const LearningRoadmapView: React.FC = () => {
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    api
      .getRecommendations()
      .then((data) => setRecommendations(data))
      .catch(() => {
        setRecommendations({
          weakAreas: ['Database Sharding', 'Rate Limiting Gateways', 'CAP Theorem & Quorums'],
          learningRoadmap: [
            {
              topic: 'Database Sharding & Hotspot Mitigation',
              priority: 'HIGH',
              reason: 'Your evaluation score in Database & Storage design is currently below target threshold.',
              resources: [
                'Designing Data-Intensive Applications: Chapter 6 (Partitioning)',
                'Study Twitter celebrity fan-out sharding keys',
                'Consistent Hashing & Virtual Nodes practice',
              ],
            },
            {
              topic: 'Distributed Rate Limiting & Token Bucket',
              priority: 'HIGH',
              reason: 'Essential requirement for protecting backend API gateways under surge traffic.',
              resources: [
                'Token Bucket vs Leaky Bucket algorithms',
                'Redis Lua script atomic counter rate limiters',
                'Sliding Window Log implementation',
              ],
            },
            {
              topic: 'CAP Theorem & Multi-Region Replication',
              priority: 'MEDIUM',
              reason: 'Core topic tested heavily in Senior / Staff Google & AWS system design rounds.',
              resources: [
                'PACELC Theorem & Eventual Consistency models',
                'Cassandra Tunable Consistency (Quorum R+W > N)',
              ],
            },
          ],
        });
      });
  }, []);

  const items = recommendations?.learningRoadmap || [];

  return (
    <div className="container section-rhythm">
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Map size={20} color="#f54e00" />
          <h2 className="display-lg">Personalized AI Learning Roadmap</h2>
        </div>
        <p style={{ color: 'var(--color-body)', fontSize: '16px' }}>
          Targeted study recommendations synthesized by AI Mentor based on your recent evaluation weak spots.
        </p>
      </div>

      {/* Weak Areas Banner */}
      <div className="card-surface" style={{ marginBottom: '32px', backgroundColor: '#fff', border: '1px solid var(--color-hairline-strong)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Flame size={20} color="#f54e00" />
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Identified Priority Improvement Areas</h3>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {recommendations?.weakAreas?.map((area: string) => (
            <span key={area} className="badge-pill" style={{ backgroundColor: '#fdf2f2', color: '#9b1c1c', border: '1px solid #f8b4b4' }}>
              • {area}
            </span>
          ))}
        </div>
      </div>

      {/* Roadmap Topic Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {items.map((item: any, i: number) => {
          const isHigh = item.priority === 'HIGH';
          return (
            <div key={i} className="card-surface" style={{ borderLeft: isHigh ? '4px solid var(--color-primary)' : '1px solid var(--color-hairline)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span className="badge-pill" style={{ backgroundColor: isHigh ? 'var(--color-primary)' : 'var(--color-ink)', color: '#fff' }}>
                    {item.priority} PRIORITY
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{item.topic}</h3>
                </div>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-body)', marginBottom: '16px', lineHeight: 1.5 }}>
                {item.reason}
              </p>

              <div style={{ backgroundColor: 'var(--color-canvas-soft)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--color-hairline)' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Recommended Actionable Study Items
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {item.resources?.map((res: string, idx: number) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--color-ink)' }}>
                      <CheckCircle2 size={16} color="#1f8a65" />
                      <span>{res}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
