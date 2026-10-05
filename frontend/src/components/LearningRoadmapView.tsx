import React from 'react';
import { CheckCircle2, Lock, Play, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { Button, Badge } from './ui';

export const LearningRoadmapView: React.FC = () => {
  const modules = [
    {
      id: 'm1',
      week: 'WEEK 1',
      title: 'Database Sharding & Key Distribution',
      desc: 'Master horizontal database partitioning, consistent hashing rings, and composite partition keys for multi-tenant architectures.',
      estTime: '20 min',
      status: 'completed',
      tag: 'Storage Vector',
      gapClosed: 'Closed Gap from Uber Interview #8492',
    },
    {
      id: 'm2',
      week: 'WEEK 2',
      title: 'Distributed Consensus & Quorum Protocols',
      desc: 'Deep-dive into Raft leader election, Paxos commit invariants, split-brain mitigation, and PACELC trade-off calibration.',
      estTime: '25 min',
      status: 'in_progress',
      tag: 'Fault Tolerance',
      gapClosed: 'Active Focus // Google Staff Track',
    },
    {
      id: 'm3',
      week: 'WEEK 3',
      title: 'Asynchronous Event Streaming & CDC Pipelines',
      desc: 'Kafka partition rebalancing, consumer groups, Debezium Postgres WAL change-data-capture, and outbox patterns.',
      estTime: '30 min',
      status: 'locked',
      tag: 'Event Driven',
      gapClosed: 'Unlocks after Week 2 Quiz',
    },
    {
      id: 'm4',
      week: 'WEEK 4',
      title: 'Distributed In-Memory Caching & Thundering Herd',
      desc: 'Probabilistic early expiration (XFetch), cache-aside vs write-through, and cluster re-sharding without packet drops.',
      estTime: '35 min',
      status: 'locked',
      tag: 'Performance',
      gapClosed: 'Unlocks after Week 3',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-10 pb-6 border-b border-[#e5e1ea]">
        <Badge variant="primary" icon={<Sparkles size={13} />} className="mb-2">
          ADAPTIVE CURRICULUM // STAFF LOOP CALIBRATED
        </Badge>
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-[#0a0a0f]">
          Personalized System Design Roadmap
        </h1>
        <p className="text-sm text-[#5e5e6e] mt-1 max-w-2xl">
          Modules automatically re-order based on your weakest performance vectors in recent mock loops.
        </p>
      </div>

      {/* Progress Summary Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#f3f0ff] via-white to-[#faf9fe] border border-[#8b5cf6]/20 mb-10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-[#6b38d4] font-bold uppercase">Overall Completion</span>
          <div className="font-display font-bold text-2xl text-[#0a0a0f] mt-0.5">35% of 6-Week Curriculum</div>
          <p className="text-xs text-[#5e5e6e] mt-1">1 of 4 core modules mastered • Next: Distributed Consensus</p>
        </div>

        <div className="w-full sm:w-64">
          <div className="flex justify-between text-xs font-mono text-[#5e5e6e] mb-1.5">
            <span>Progress</span>
            <span className="font-bold text-[#6b38d4]">35%</span>
          </div>
          <div className="w-full h-2.5 bg-[#e5e1ea] rounded-full overflow-hidden">
            <div className="h-full bg-[#6b38d4] rounded-full" style={{ width: '35%' }} />
          </div>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l-2 border-[#e5e1ea] space-y-8 my-6">
        {modules.map((m) => {
          const isDone = m.status === 'completed';
          const isCurrent = m.status === 'in_progress';
          const isLocked = m.status === 'locked';

          return (
            <div key={m.id} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[31px] sm:-left-[39px] top-4 w-7 h-7 rounded-full flex items-center justify-center border-2 ${
                  isDone
                    ? 'bg-[#10b981] border-[#10b981] text-white'
                    : isCurrent
                    ? 'bg-[#6b38d4] border-[#6b38d4] text-white shadow-[0_0_12px_rgba(107,56,212,0.5)]'
                    : 'bg-white border-[#e5e1ea] text-[#8e8ea0]'
                }`}
              >
                {isDone ? (
                  <CheckCircle2 size={15} />
                ) : isCurrent ? (
                  <Play size={13} fill="currentColor" />
                ) : (
                  <Lock size={13} />
                )}
              </div>

              {/* Module Card */}
              <div
                className={`rounded-2xl p-6 border transition-all ${
                  isCurrent
                    ? 'bg-white border-[#6b38d4] shadow-md ring-2 ring-[#6b38d4]/10'
                    : isDone
                    ? 'bg-white border-[#e5e1ea] shadow-xs'
                    : 'bg-[#faf9fc] border-[#e5e1ea] opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="primary">
                      {m.week}
                    </Badge>
                    <span className="text-[11px] font-mono text-[#5e5e6e] bg-[#f4f1fb] px-2 py-0.5 rounded">
                      {m.tag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#8e8ea0]">
                    <Clock size={13} />
                    <span>{m.estTime}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-lg text-[#0a0a0f] mb-2">{m.title}</h3>
                <p className="text-xs sm:text-sm text-[#5e5e6e] leading-relaxed mb-4">{m.desc}</p>

                <div className="pt-4 border-t border-[#e5e1ea] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <Badge variant="success">
                    {m.gapClosed}
                  </Badge>

                  {isDone && (
                    <Button variant="outline" size="sm" className="self-end sm:self-auto">
                      Review Module Notes
                    </Button>
                  )}
                  {isCurrent && (
                    <Button
                      variant="dark"
                      size="sm"
                      className="self-end sm:self-auto"
                      iconRight={<ArrowRight size={13} />}
                    >
                      Resume Exercise
                    </Button>
                  )}
                  {isLocked && (
                    <span className="text-xs font-mono text-[#8e8ea0] flex items-center gap-1 self-end sm:self-auto">
                      <Lock size={12} /> Locked
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
