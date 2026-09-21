import React from 'react';
import { CheckCircle2, Lock, Play, RotateCcw, Clock, Sparkles } from 'lucide-react';

export const LearningRoadmapView: React.FC = () => {
  const nodes = [
    {
      id: 'n1',
      title: 'Database Sharding & Key Design',
      desc: 'Split massive datasets across multiple physical database instances using hash or range partitioning.',
      estTime: '20 min',
      status: 'completed',
      btnText: 'Review Module',
    },
    {
      id: 'n2',
      title: 'Replication & Sync Protocol',
      desc: 'Keep data copies in sync across primary and standby nodes with asynchronous vs synchronous replication.',
      estTime: '25 min',
      status: 'in_progress',
      btnText: 'Continue Module',
    },
    {
      id: 'n3',
      title: 'CAP Theorem & PACELC Trade-offs',
      desc: 'Master the consistency vs availability vs partition-tolerance tradeoffs during network partitions.',
      estTime: '30 min',
      status: 'locked',
      btnText: 'Start Module',
    },
    {
      id: 'n4',
      title: 'B-Tree & LSM-Tree Indexing Strategies',
      desc: 'Optimize database reads and write amplification using proper index choices for OLTP vs OLAP.',
      estTime: '20 min',
      status: 'locked',
      btnText: 'Start Module',
    },
  ];

  return (
    <div className="container section-padding" style={{ maxWidth: '840px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '32px' }}>
        <span className="badge-accent" style={{ marginBottom: '8px' }}>
          <Sparkles size={12} /> Personalized Learning Path
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: 400 }}>System Design Roadmap</h1>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--color-bg-secondary)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            fontSize: '13px',
            marginTop: '12px',
          }}
        >
          <span>Because you're working on: <strong>Database Design & Sharding</strong></span>
        </div>
      </div>

      {/* Path Nodes List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        {/* Connecting Vertical Line */}
        <div
          style={{
            position: 'absolute',
            left: '23px',
            top: '24px',
            bottom: '24px',
            width: '2px',
            backgroundColor: 'var(--color-border-strong)',
            zIndex: 1,
          }}
        />

        {nodes.map((node, i) => {
          const isCompleted = node.status === 'completed';
          const isInProgress = node.status === 'in_progress';
          const isLocked = node.status === 'locked';

          return (
            <div
              key={node.id}
              className="card-solid"
              style={{
                position: 'relative',
                zIndex: 2,
                marginLeft: '48px',
                border: isInProgress ? '2px solid var(--color-text)' : '1px solid var(--color-border-subtle)',
                backgroundColor: isCompleted ? '#ffffff' : isInProgress ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                opacity: isLocked ? 0.75 : 1,
              }}
            >
              {/* Timeline Node Icon Circle on the Left Line */}
              <div
                style={{
                  position: 'absolute',
                  left: '-48px',
                  top: '24px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#1f8a65' : isInProgress ? 'var(--color-text)' : 'var(--color-card-solid)',
                  border: '2px solid var(--color-border-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  color: '#ffffff',
                }}
              >
                {isCompleted && <CheckCircle2 size={14} />}
                {isInProgress && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />}
                {isLocked && <Lock size={12} color="var(--color-text-muted)" />}
              </div>

              {/* Node Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <span className="badge-subtle" style={{ fontSize: '11px', marginBottom: '4px' }}>
                    Node {i + 1} · {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Locked'}
                  </span>
                  <h3 style={{ fontSize: '18px', fontWeight: 600 }}>{node.title}</h3>
                </div>

                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                  <Clock size={12} /> {node.estTime}
                </span>
              </div>

              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
                {node.desc}
              </p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                {isCompleted ? (
                  <button className="btn-filled" style={{ fontSize: '13px' }}>
                    <RotateCcw size={14} /> {node.btnText}
                  </button>
                ) : isInProgress ? (
                  <button className="btn-dark" style={{ fontSize: '13px' }}>
                    <Play size={14} /> {node.btnText}
                  </button>
                ) : (
                  <button className="btn-filled" style={{ fontSize: '13px' }} disabled>
                    <Lock size={14} /> {node.btnText}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
