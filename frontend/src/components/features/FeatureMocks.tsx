import React from 'react';
import { LOGO_MARK_PATH } from '../Logo';

/**
 * Feature-stage mock screens for the landing "Everything included" section.
 *
 * These are high-fidelity SVG impressions of the real app views, drawn in the
 * product palette, and act as the default visual for each feature tab. If a
 * real screenshot exists at  /screenshots/features/<feature-id>.png  the
 * LandingFeatures section layers it on top automatically — no code changes.
 */

const INK = '#0a0a0f';
const MUTED = '#5e5e6e';
const DIM = '#8e8ea0';
const BORDER = '#e5e1ea';
const PURPLE = '#6b38d4';
const PURPLE_LIGHT = '#8b5cf6';
const LAVENDER = '#ede9fe';
const BG2 = '#f4f1fb';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';

const SANS = "'Plus Jakarta Sans', sans-serif";
const MONO = "'JetBrains Mono', monospace";
const SERIF = "'Zodiak-Variable', Georgia, serif";

/** Small brand mark used in every mock's top bar. */
const Mark: React.FC<{ x: number; y: number; scale?: number; fill?: string }> = ({ x, y, scale = 0.42, fill = PURPLE }) => (
  <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d={LOGO_MARK_PATH} fillRule="evenodd" clipRule="evenodd" fill={fill} />
  </g>
);

const Frame: React.FC<{ title: string; right?: React.ReactNode; children: React.ReactNode }> = ({ title, right, children }) => (
  <svg viewBox="0 0 1200 750" className="h-full w-full" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={title}>
    <rect width="1200" height="750" fill="#faf9fe" />
    <rect width="1200" height="64" fill="#ffffff" />
    <line x1="0" y1="64" x2="1200" y2="64" stroke={BORDER} />
    <Mark x={24} y={16} />
    <text x={64} y={40} fontFamily={MONO} fontSize={13} fontWeight={600} fill={PURPLE} letterSpacing="0.08em">
      {title}
    </text>
    {right}
    {children}
  </svg>
);


/* ── 1. Live AI Interview ────────────────────────────────────────────────── */

export const LiveInterviewMock: React.FC = () => (
  <Frame
    title="DESIGNO // LIVE PROMPT"
    right={
      <g>
        <rect x={936} y={18} width={240} height={28} rx={14} fill={LAVENDER} />
        <text x={1056} y={37} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} fill={PURPLE} letterSpacing="0.06em">
          STAGE 2 / 4 · TRADE-OFFS
        </text>
      </g>
    }
  >
    <rect x={48} y={96} width={656} height={128} rx={16} fill="#ffffff" stroke={BORDER} />
    <text x={72} y={126} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={PURPLE} letterSpacing="0.08em">DESIGNO // REQUIREMENTS</text>
    <text x={72} y={154} fontFamily={SANS} fontSize={14.5} fill={INK}>Good. Before we design the cache layer — what's your</text>
    <text x={72} y={176} fontFamily={SANS} fontSize={14.5} fill={INK}>read budget per edge node, and which consistency</text>
    <text x={72} y={198} fontFamily={SANS} fontSize={14.5} fill={INK}>model do your clients actually expect?</text>

    <rect x={404} y={248} width={316} height={96} rx={16} fill="#f3f0ff" stroke="#c9b8f4" />
    <text x={428} y={280} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={MUTED} letterSpacing="0.08em">YOU (CANDIDATE)</text>
    <text x={428} y={308} fontFamily={SANS} fontSize={14.5} fill={INK}>p99 read budget is 80ms. Feeds</text>
    <text x={428} y={330} fontFamily={SANS} fontSize={14.5} fill={INK}>tolerate 30s stale-while-revalidate.</text>

    <rect x={48} y={368} width={656} height={128} rx={16} fill="#ffffff" stroke={BORDER} />
    <text x={72} y={398} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={PURPLE} letterSpacing="0.08em">DESIGNO // LIVE PROMPT</text>
    <text x={72} y={426} fontFamily={SANS} fontSize={14.5} fill={INK}>Alright — sketch how invalidation flows when an origin</text>
    <text x={72} y={448} fontFamily={SANS} fontSize={14.5} fill={INK}>write lands mid-peak. Use the diagram studio if it's</text>
    <text x={72} y={470} fontFamily={SANS} fontSize={14.5} fill={INK}>easier to show than tell.</text>

    <rect x={48} y={516} width={104} height={40} rx={14} fill="#ffffff" stroke={BORDER} />
    {[74, 96, 118].map((cx, i) => (
      <circle key={cx} cx={cx} cy={536} r={4} fill={PURPLE_LIGHT} opacity={1 - i * 0.28} />
    ))}

    <rect x={48} y={646} width={1104} height={58} rx={16} fill="#ffffff" stroke={BORDER} />
    <text x={76} y={681} fontFamily={SANS} fontSize={14} fill={DIM}>Type your answer…</text>
    <rect x={1032} y={657} width={104} height={36} rx={12} fill={PURPLE} />
    <text x={1084} y={680} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} fill="#ffffff" letterSpacing="0.08em">SEND</text>

    <rect x={744} y={96} width={408} height={534} rx={18} fill="#ffffff" stroke={BORDER} />
    <text x={772} y={130} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={DIM} letterSpacing="0.1em">LIVE SCORE</text>
    <g transform="rotate(-90 948 262)">
      <circle cx={948} cy={262} r={64} fill="none" stroke={LAVENDER} strokeWidth={12} />
      <circle cx={948} cy={262} r={64} fill="none" stroke={PURPLE} strokeWidth={12} strokeLinecap="round" strokeDasharray={`${0.68 * 402} 402`} />
    </g>
    <text x={948} y={278} textAnchor="middle" fontFamily={SERIF} fontSize={54} fontWeight={800} fill={INK}>68</text>
    <text x={948} y={356} textAnchor="middle" fontFamily={SANS} fontSize={13} fontWeight={600} fill={GREEN}>▲ +4 this round</text>

    <line x1={772} y1={392} x2={1124} y2={392} stroke={BORDER} />
    {[
      { n: '01', label: 'Requirements', state: 'done' },
      { n: '02', label: 'Trade-offs', state: 'active' },
      { n: '03', label: 'Deep Dive', state: 'todo' },
      { n: '04', label: 'Retro', state: 'todo' },
    ].map((s, i) => {
      const y = 428 + i * 48;
      return (
        <g key={s.n}>
          <circle cx={786} cy={y - 5} r={9} fill={s.state === 'done' ? GREEN : s.state === 'active' ? PURPLE : BG2} stroke={s.state === 'todo' ? BORDER : 'none'} />
          {s.state === 'done' && <path d={`M782 ${y - 5} l3 3 5.5 -6`} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          <text x={810} y={y} fontFamily={SANS} fontSize={14} fontWeight={s.state === 'active' ? 700 : 500} fill={s.state === 'todo' ? DIM : INK}>
            {s.n} · {s.label}
          </text>
          {s.state === 'active' && (
            <text x={1124} y={y} textAnchor="end" fontFamily={MONO} fontSize={10} fontWeight={600} fill={PURPLE} letterSpacing="0.08em">LIVE</text>
          )}
        </g>
      );
    })}
    <rect x={772} y={596} width={224} height={22} rx={11} fill="#ecfdf5" />
    <circle cx={786} cy={607} r={4} fill={GREEN} />
    <text x={798} y={611} fontFamily={MONO} fontSize={10} fontWeight={600} fill={GREEN} letterSpacing="0.06em">AI INTERVIEWER ONLINE</text>
  </Frame>
);

/* ── 2. Question Bank ────────────────────────────────────────────────────── */

const QB_CARDS = [
  { title: 'Global CDN Design', diff: 'Advanced', diffFill: '#fef2f2', diffText: RED, desc: 'Design an edge network serving 50M req/min with', desc2: 'regional failover and signed cache keys.', tags: ['CDN', 'CACHING', 'EDGE'] },
  { title: 'Event-Streaming Platform', diff: 'Staff', diffFill: LAVENDER, diffText: PURPLE, desc: 'A Kafka-style backbone: partitioning, consumer', desc2: 'groups, replay and exactly-once semantics.', tags: ['STREAMING', 'KAFKA'] },
  { title: 'URL Shortener at Scale', diff: 'Beginner', diffFill: '#ecfdf5', diffText: GREEN, desc: 'Base62 keys, read-heavy ratio of 100:1, custom', desc2: 'aliases and a global hit counter.', tags: ['API', 'DESIGN'] },
  { title: 'Rate Limiter for Payments', diff: 'Intermediate', diffFill: '#fffbeb', diffText: AMBER, desc: 'Distributed limiting across regions with strict', desc2: 'p99 overhead budgets and burst windows.', tags: ['LIMITER', 'REDIS'] },
];

export const QuestionBankMock: React.FC = () => (
  <Frame
    title="QUESTION BANK"
    right={<text x={1152} y={40} textAnchor="end" fontFamily={MONO} fontSize={11} fill={DIM} letterSpacing="0.06em">48 SCENARIOS</text>}
  >
    <text x={48} y={122} fontFamily={SERIF} fontSize={30} fontWeight={800} fill={INK}>System Design Question Library</text>
    <text x={48} y={150} fontFamily={SANS} fontSize={14} fill={MUTED}>Tiered from warm-ups to Staff loops — tuned to your target level.</text>
    {['All', 'Beginner', 'Intermediate', 'Advanced', 'Staff'].map((chip, i) => {
      const x = [48, 106, 216, 340, 444][i];
      const w = [44, 98, 112, 90, 62][i];
      const on = i === 0;
      return (
        <g key={chip}>
          <rect x={x} y={172} width={w} height={30} rx={15} fill={on ? INK : '#ffffff'} stroke={on ? INK : BORDER} />
          <text x={x + w / 2} y={192} textAnchor="middle" fontFamily={SANS} fontSize={12.5} fontWeight={600} fill={on ? '#ffffff' : MUTED}>{chip}</text>
        </g>
      );
    })}
    <rect x={996} y={172} width={156} height={30} rx={15} fill="#ffffff" stroke={BORDER} />
    <text x={1074} y={192} textAnchor="middle" fontFamily={SANS} fontSize={12.5} fontWeight={600} fill={MUTED}>Company track ▾</text>

    {QB_CARDS.map((c, i) => {
      const x = i % 2 === 0 ? 48 : 612;
      const y = i < 2 ? 228 : 468;
      return (
        <g key={c.title}>
          <rect x={x} y={y} width={540} height={216} rx={18} fill="#ffffff" stroke={BORDER} />
          <rect x={x + 424} y={y + 24} width={92} height={26} rx={13} fill={c.diffFill} />
          <text x={x + 470} y={y + 42} textAnchor="middle" fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={c.diffText} letterSpacing="0.04em">{c.diff.toUpperCase()}</text>
          <text x={x + 28} y={y + 52} fontFamily={SERIF} fontSize={21} fontWeight={700} fill={INK}>{c.title}</text>
          <text x={x + 28} y={y + 86} fontFamily={SANS} fontSize={13.5} fill={MUTED}>{c.desc}</text>
          <text x={x + 28} y={y + 108} fontFamily={SANS} fontSize={13.5} fill={MUTED}>{c.desc2}</text>
          {c.tags.map((t, ti) => {
            const tx = x + 28 + ti * 96;
            return (
              <g key={t}>
                <rect x={tx} y={y + 132} width={86} height={24} rx={12} fill={BG2} stroke={BORDER} />
                <text x={tx + 43} y={y + 148} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fontWeight={600} fill={MUTED} letterSpacing="0.06em">{t}</text>
              </g>
            );
          })}
          <text x={x + 512} y={y + 190} textAnchor="end" fontFamily={MONO} fontSize={11} fontWeight={600} fill={PURPLE} letterSpacing="0.08em">START →</text>
        </g>
      );
    })}
    <text x={48} y={722} fontFamily={SANS} fontSize={12.5} fill={DIM}>One click starts a live AI session tuned to the question's difficulty and track.</text>
  </Frame>
);

/* ── 3. Evaluation Report ────────────────────────────────────────────────── */

const RUBRIC = [
  { label: 'Scope & Requirements', value: 88 },
  { label: 'High-Level Design', value: 79 },
  { label: 'Bottlenecks & Scaling', value: 74 },
  { label: 'Fault Tolerance', value: 86 },
];

export const EvaluationReportMock: React.FC = () => (
  <Frame
    title="EVALUATION REPORT"
    right={
      <g>
        <rect x={1044} y={18} width={128} height={28} rx={14} fill="#ecfdf5" />
        <text x={1108} y={37} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} fill={GREEN} letterSpacing="0.06em">COMPLETE</text>
      </g>
    }
  >
    <text x={48} y={122} fontFamily={SERIF} fontSize={28} fontWeight={800} fill={INK}>Global CDN &amp; Edge Caching</text>
    <text x={48} y={150} fontFamily={SANS} fontSize={13.5} fill={MUTED}>Staff difficulty · 41 min · Session #7 · evaluated against the Staff rubric</text>

    {/* Score card */}
    <rect x={48} y={176} width={380} height={404} rx={18} fill="#ffffff" stroke={BORDER} />
    <g transform="rotate(-90 238 330)">
      <circle cx={238} cy={330} r={88} fill="none" stroke={LAVENDER} strokeWidth={16} />
      <circle cx={238} cy={330} r={88} fill="none" stroke={PURPLE} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${0.82 * 553} 553`} />
    </g>
    <text x={238} y={352} textAnchor="middle" fontFamily={SERIF} fontSize={76} fontWeight={800} fill={INK}>82</text>
    <text x={238} y={384} textAnchor="middle" fontFamily={SANS} fontSize={14} fill={DIM}>out of 100</text>
    <text x={238} y={492} textAnchor="middle" fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={DIM} letterSpacing="0.12em">HIRE SIGNAL</text>
    <text x={238} y={524} textAnchor="middle" fontFamily={SANS} fontSize={20} fontWeight={800} fill={PURPLE}>STRONG</text>

    {/* Rubric card */}
    <rect x={460} y={176} width={692} height={404} rx={18} fill="#ffffff" stroke={BORDER} />
    <text x={492} y={214} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={DIM} letterSpacing="0.12em">RUBRIC BREAKDOWN</text>
    {RUBRIC.map((r, i) => {
      const y = 262 + i * 66;
      return (
        <g key={r.label}>
          <text x={492} y={y} fontFamily={SANS} fontSize={14} fontWeight={600} fill={INK}>{r.label}</text>
          <text x={1120} y={y} textAnchor="end" fontFamily={MONO} fontSize={13} fontWeight={600} fill={PURPLE}>{r.value}</text>
          <rect x={492} y={y + 14} width={628} height={10} rx={5} fill={LAVENDER} />
          <rect x={492} y={y + 14} width={628 * (r.value / 100)} height={10} rx={5} fill={PURPLE} />
        </g>
      );
    })}
    <line x1={492} y1={522} x2={1120} y2={522} stroke={BORDER} />
    <text x={492} y={552} fontFamily={SANS} fontSize={13.5} fontStyle="italic" fill={MUTED}>“Sharp trade-off reasoning — tighten the invalidation story before Staff loops.”</text>

    {/* Bottom row */}
    <rect x={48} y={604} width={540} height={112} rx={18} fill="#ffffff" stroke={BORDER} />
    <text x={76} y={638} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={GREEN} letterSpacing="0.12em">STRENGTHS</text>
    <text x={76} y={668} fontFamily={SANS} fontSize={13.5} fill={INK}>✓ Clear capacity math on read path (88)</text>
    <text x={76} y={692} fontFamily={SANS} fontSize={13.5} fill={INK}>✓ Good multi-region failover story (86)</text>

    <rect x={612} y={604} width={540} height={112} rx={18} fill="#ffffff" stroke={BORDER} />
    <text x={640} y={638} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={RED} letterSpacing="0.12em">FIX NEXT</text>
    <text x={640} y={668} fontFamily={SANS} fontSize={13.5} fill={INK}>→ Cache invalidation under origin writes (74)</text>
    <text x={640} y={692} fontFamily={SANS} fontSize={13.5} fill={INK}>→ Name the hot-key mitigation explicitly</text>
  </Frame>
);

/* ── 4. Diagram Studio ───────────────────────────────────────────────────── */

const Node: React.FC<{ x: number; y: number; label: string; sub?: string; w?: number; accent?: boolean }> = ({ x, y, label, sub, w = 170, accent }) => (
  <g>
    <rect x={x} y={y} width={w} height={64} rx={14} fill="#ffffff" stroke={accent ? PURPLE_LIGHT : BORDER} strokeWidth={accent ? 1.6 : 1} />
    <text x={x + w / 2} y={sub ? y + 28 : y + 38} textAnchor="middle" fontFamily={SANS} fontSize={13.5} fontWeight={700} fill={INK}>{label}</text>
    {sub && <text x={x + w / 2} y={y + 48} textAnchor="middle" fontFamily={MONO} fontSize={9.5} fill={DIM} letterSpacing="0.04em">{sub}</text>}
  </g>
);

const Arrow: React.FC<{ d: string }> = ({ d }) => (
  <path d={d} fill="none" stroke="#b5adc4" strokeWidth={1.8} markerEnd="url(#qa-arrow)" />
);

export const DiagramStudioMock: React.FC = () => (
  <Frame
    title="DIAGRAM STUDIO"
    right={
      <g>
        <rect x={838} y={16} width={94} height={32} rx={9} fill={BG2} stroke={BORDER} />
        <rect x={932} y={16} width={54} height={32} rx={9} fill="#ffffff" stroke={BORDER} />
        <text x={885} y={37} textAnchor="middle" fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={PURPLE} letterSpacing="0.04em">MERMAID</text>
        <text x={959} y={37} textAnchor="middle" fontFamily={MONO} fontSize={10.5} fill={DIM} letterSpacing="0.04em">SVG</text>
        <rect x={1006} y={16} width={146} height={32} rx={10} fill={PURPLE} />
        <text x={1079} y={37} textAnchor="middle" fontFamily={MONO} fontSize={10.5} fontWeight={600} fill="#ffffff" letterSpacing="0.06em">✦ GENERATE</text>
      </g>
    }
  >
    <defs>
      <pattern id="qa-dots" width="24" height="24" patternUnits="userSpaceOnUse">
        <circle cx={1.5} cy={1.5} r={1.3} fill="#d9d3e6" />
      </pattern>
      <marker id="qa-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0 0 L8 4 L0 8 z" fill="#b5adc4" />
      </marker>
    </defs>

    <rect x={72} y={64} width={788} height={686} fill="#faf9fe" />
    <rect x={72} y={64} width={788} height={686} fill="url(#qa-dots)" />
    <rect x={0} y={64} width={72} height={686} fill="#ffffff" />
    <line x1={72} y1={64} x2={72} y2={750} stroke={BORDER} />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={20} y={96 + i * 56} width={32} height={32} rx={9} fill={i === 1 ? LAVENDER : BG2} stroke={i === 1 ? '#c9b8f4' : BORDER} />
    ))}
    <text x={36} y={117} textAnchor="middle" fontFamily={SANS} fontSize={15} fontWeight={700} fill={DIM}>+</text>

    <Arrow d="M285 210 L375 210" />
    <Arrow d="M545 210 L635 210" />
    <Arrow d="M720 274 L720 320 L460 320 L460 356" />
    <Arrow d="M720 274 L720 320 L695 320 L695 356" />
    <Arrow d="M460 420 L460 470" />
    <Arrow d="M375 500 L285 500" />

    <Node x={115} y={178} label="Clients" sub="MOBILE · WEB" />
    <Node x={375} y={178} label="CDN Edge" sub="SIGNED KEYS" />
    <Node x={635} y={178} label="Load Balancer" sub="L7 · 3 REGIONS" />
    <Node x={375} y={356} label="Redis Cache" sub="SWR 30S" />
    <Node x={610} y={356} label="API Gateway" sub="RATE LIMITED" accent />
    <Node x={375} y={470} label="Postgres Primary" sub="SINGLE WRITER" />
    <Node x={115} y={470} label="Read Replicas" sub="×3 REGIONS" />

    {/* SPOF flag on primary */}
    <rect x={388} y={548} width={144} height={24} rx={12} fill="#fef2f2" stroke="#fecaca" />
    <text x={460} y={564} textAnchor="middle" fontFamily={MONO} fontSize={10} fontWeight={600} fill={RED} letterSpacing="0.06em">⚠ SPOF FLAGGED</text>

    {/* Right source panel */}
    <rect x={860} y={64} width={340} height={686} fill="#ffffff" />
    <line x1={860} y1={64} x2={860} y2={750} stroke={BORDER} />
    <text x={888} y={100} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={DIM} letterSpacing="0.12em">MERMAID SOURCE</text>
    {[
      { t: 'graph TD', c: PURPLE },
      { t: 'C[Clients] --> D[CDN Edge]', c: INK },
      { t: 'D --> LB[Load Balancer]', c: INK },
      { t: 'LB --> CACHE[Redis Cache]', c: INK },
      { t: 'LB --> GW[API Gateway]', c: INK },
      { t: 'GW --> PG[(Postgres Primary)]', c: INK },
      { t: 'PG --> R[Read Replicas]', c: INK },
      { t: 'classDef spof fill:#fef2f2', c: MUTED },
      { t: 'class PG spof', c: RED },
    ].map((l, i) => (
      <text key={i} x={888} y={132 + i * 26} fontFamily={MONO} fontSize={11.5} fill={l.c}>{l.t}</text>
    ))}
    <line x1={888} y1={392} x2={1172} y2={392} stroke={BORDER} />
    <rect x={888} y={416} width={284} height={70} rx={12} fill="#fef2f2" stroke="#fecaca" />
    <text x={908} y={444} fontFamily={MONO} fontSize={10} fontWeight={600} fill={RED} letterSpacing="0.08em">EVALUATOR</text>
    <text x={908} y={468} fontFamily={SANS} fontSize={12.5} fontWeight={600} fill={INK}>1 single point of failure</text>
    <rect x={888} y={502} width={284} height={70} rx={12} fill="#fffbeb" stroke="#fde68a" />
    <text x={908} y={530} fontFamily={MONO} fontSize={10} fontWeight={600} fill={AMBER} letterSpacing="0.08em">CONCURRENCY</text>
    <text x={908} y={554} fontFamily={SANS} fontSize={12.5} fontWeight={600} fill={INK}>2 hot paths on cache write</text>
    <rect x={888} y={656} width={284} height={40} rx={12} fill={BG2} stroke={BORDER} />
    <text x={1030} y={681} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} fill={MUTED} letterSpacing="0.06em">⤓ EXPORT SVG · PNG</text>
  </Frame>
);

/* ── 5. Adaptive Roadmap ─────────────────────────────────────────────────── */

const ROADMAP_STEPS = [
  { title: 'Consistent Hashing', meta: 'MASTERED · 5/5 concepts', state: 'done' },
  { title: 'Rate Limiter Design', meta: 'MASTERED · 4/4 concepts', state: 'done' },
  { title: 'Data Partitioning', meta: 'IN PROGRESS · 2/5 concepts', state: 'active' },
  { title: 'Raft Consensus', meta: 'UNLOCKS AFTER PARTITIONING', state: 'locked' },
  { title: 'Queue Backpressure', meta: 'SCHEDULED · WEEK 6', state: 'locked' },
];

export const RoadmapMock: React.FC = () => (
  <Frame
    title="ADAPTIVE ROADMAP"
    right={<text x={1152} y={40} textAnchor="end" fontFamily={MONO} fontSize={11} fill={DIM} letterSpacing="0.06em">RECALIBRATED AFTER REPORT #7</text>}
  >
    <text x={48} y={122} fontFamily={SERIF} fontSize={28} fontWeight={800} fill={INK}>Your Staff loop, sequenced</text>
    <rect x={48} y={146} width={420} height={10} rx={5} fill={LAVENDER} />
    <rect x={48} y={146} width={176} height={10} rx={5} fill={PURPLE} />
    <text x={486} y={157} fontFamily={MONO} fontSize={12} fontWeight={600} fill={PURPLE}>42%</text>

    <line x1={110} y1={210} x2={110} y2={646} stroke={BORDER} strokeWidth={2} />
    {ROADMAP_STEPS.map((s, i) => {
      const y = 218 + i * 108;
      const done = s.state === 'done';
      const active = s.state === 'active';
      return (
        <g key={s.title}>
          <circle cx={110} cy={y} r={15} fill={done ? GREEN : active ? PURPLE : '#ffffff'} stroke={done || active ? 'none' : BORDER} strokeWidth={done || active ? 0 : 2} />
          {done && <path d={`M103 ${y} l4.5 4.5 8 -9`} stroke="#fff" strokeWidth={2.4} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
          {active && <circle cx={110} cy={y} r={6} fill="#ffffff" />}
          <text x={148} y={y - 2} fontFamily={SANS} fontSize={16} fontWeight={active ? 800 : 600} fill={s.state === 'locked' ? DIM : INK}>{s.title}</text>
          <text x={148} y={y + 20} fontFamily={MONO} fontSize={10} fontWeight={600} fill={active ? PURPLE : done ? GREEN : DIM} letterSpacing="0.06em">{s.meta}</text>
        </g>
      );
    })}

    <rect x={720} y={200} width={432} height={300} rx={18} fill="#ffffff" stroke={BORDER} />
    <text x={748} y={238} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={DIM} letterSpacing="0.12em">NEXT UP</text>
    <text x={748} y={274} fontFamily={SERIF} fontSize={22} fontWeight={700} fill={INK}>Data Partitioning</text>
    <text x={748} y={304} fontFamily={SANS} fontSize={13.5} fill={MUTED}>Why: flagged in Report #7 — Bottlenecks scored 74.</text>
    {[
      { t: '✓ Range vs hash partitioning', on: true },
      { t: '✓ Resharding without downtime', on: true },
      { t: 'Hot-key mitigation strategies', on: false },
      { t: 'Cross-partition queries', on: false },
    ].map((c, i) => (
      <g key={c.t}>
        <rect x={748} y={330 + i * 34} width={18} height={18} rx={6} fill={c.on ? PURPLE : '#ffffff'} stroke={c.on ? PURPLE : BORDER} />
        {c.on && <path d={`M752 ${339 + i * 34} l3.5 3.5 6 -7`} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        <text x={778} y={344 + i * 34} fontFamily={SANS} fontSize={13} fontWeight={500} fill={c.on ? INK : MUTED}>{c.t}</text>
      </g>
    ))}
    <rect x={748} y={448} width={200} height={36} rx={12} fill={INK} />
    <text x={848} y={471} textAnchor="middle" fontFamily={MONO} fontSize={11} fontWeight={600} fill="#ffffff" letterSpacing="0.06em">CONTINUE →</text>

    <rect x={720} y={528} width={432} height={118} rx={18} fill={BG2} stroke={BORDER} />
    <text x={748} y={566} fontFamily={MONO} fontSize={10.5} fontWeight={600} fill={PURPLE} letterSpacing="0.12em">WHY THIS ORDER</text>
    <text x={748} y={596} fontFamily={SANS} fontSize={13.5} fill={MUTED}>The roadmap re-sorts itself after every report, so the</text>
    <text x={748} y={618} fontFamily={SANS} fontSize={13.5} fill={MUTED}>weakest rubric dimension is always practised first.</text>
  </Frame>
);





