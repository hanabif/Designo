import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Circle,
  Lock,
  Map as MapIcon,
  Play,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';
import { Button, Badge, Card } from './ui';
import { api, ApiError, getAuthToken } from '../services/api';
import type { User } from '../types';
import { readCompletedModules, writeCompletedModules } from '../lib/roadmapProgress';

type Priority = 'HIGH' | 'MEDIUM' | 'LOW';
type ModuleStatus = 'completed' | 'in_progress' | 'available';

/** Timeline entry derived from one `GET /recommendations` roadmap item. */
interface RoadmapModule {
  /** Stable id derived from the topic, used as the completion key. */
  id: string;
  title: string;
  desc: string;
  priority: Priority;
  resources: string[];
  status: ModuleStatus;
  /** True when the entry came from an evaluation report's "Sync gaps" action. */
  synced: boolean;
}

/** Optional router state written by EvaluationReportView's "Sync Gaps" button. */
interface RoadmapSyncState {
  weaknesses?: string[];
  evaluationId?: string;
  score?: number;
  questionTitle?: string;
}

interface LearningRoadmapViewProps {
  user?: User | null;
  onOpenAuth?: () => void;
}

const PRIORITY_RANK: Record<Priority, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

const PRIORITY_CHIP: Record<Priority, string> = {
  HIGH: 'text-[#b45309] bg-[#fef3c7]',
  MEDIUM: 'text-[#6b38d4] bg-[#f4f1fb]',
  LOW: 'text-[#5e5e6e] bg-[#f1f0f5]',
};

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
  return slug || 'module';
}

function asPriority(value: unknown): Priority {
  const raw = String(value ?? '').toUpperCase();
  return raw === 'MEDIUM' ? 'MEDIUM' : raw === 'LOW' ? 'LOW' : 'HIGH';
}

function asResourceList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    .map((item) => item.trim());
}

/**
 * Turn the `/recommendations` payload plus any weaknesses handed over by the
 * evaluation report into the timeline this view renders.
 *
 * The API only guarantees `{ topic, priority, reason, resources }`, so every
 * field is read defensively — an LLM that drops or renames a key must degrade
 * to sensible copy rather than render an empty card.
 */
function buildModules(
  roadmapItems: unknown,
  syncedWeaknesses: string[],
  completed: Set<string>,
): RoadmapModule[] {
  const items = Array.isArray(roadmapItems) ? roadmapItems : [];
  const modules: RoadmapModule[] = [];
  const seen = new Set<string>();

  const push = (raw: unknown, synced: boolean) => {
    const topic =
      typeof raw === 'string'
        ? raw.trim()
        : typeof (raw as { topic?: unknown } | null)?.topic === 'string'
          ? String((raw as { topic: string }).topic).trim()
          : '';
    if (!topic) return;

    const id = slugify(topic);
    if (seen.has(id)) {
      // Already present — just flag it so the UI shows it came from the report.
      const existing = modules.find((module) => module.id === id);
      if (existing && synced) existing.synced = true;
      return;
    }
    seen.add(id);

    const record = (raw ?? {}) as { reason?: unknown; resources?: unknown };
    modules.push({
      id,
      title: topic,
      desc:
        typeof record.reason === 'string' && record.reason.trim()
          ? record.reason.trim()
          : synced
            ? 'Imported from your evaluation report as an area to improve.'
            : 'Surfaced from your recent evaluation score categories.',
      priority: synced ? 'HIGH' : asPriority((raw as { priority?: unknown } | null)?.priority),
      resources: asResourceList(record.resources),
      status: 'available',
      synced,
    });
  };

  items.forEach((item) => push(item, false));
  syncedWeaknesses.forEach((weakness) => push(weakness, true));

  // Report-synced gaps are the freshest signal, then HIGH -> MEDIUM -> LOW.
  // Array.prototype.sort is stable, so equal priorities keep API order.
  modules.sort((a, b) => {
    if (a.synced !== b.synced) return a.synced ? -1 : 1;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });

  let currentAssigned = false;
  for (const module of modules) {
    if (completed.has(module.id)) {
      module.status = 'completed';
    } else if (!currentAssigned) {
      module.status = 'in_progress';
      currentAssigned = true;
    } else {
      module.status = 'available';
    }
  }

  return modules;
}

export const LearningRoadmapView: React.FC<LearningRoadmapViewProps> = ({ user, onOpenAuth }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(() => Boolean(getAuthToken()));
  const [loadError, setLoadError] = useState('');
  const [unauthorized, setUnauthorized] = useState(() => !getAuthToken());
  const [reloadKey, setReloadKey] = useState(0);
  const [weakAreas, setWeakAreas] = useState<string[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<unknown>(null);
  const [completed, setCompleted] = useState<Set<string>>(() => new Set(readCompletedModules()));

  /** Router state handed over by EvaluationReportView's "Sync Gaps" button. */
  const syncState = useMemo(
    () => (location.state ?? null) as RoadmapSyncState | null,
    [location.state],
  );

  const syncedWeaknesses = useMemo(() => {
    const list = Array.isArray(syncState?.weaknesses) ? syncState.weaknesses : [];
    return list
      .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
      .map((item) => item.trim());
  }, [syncState]);

  useEffect(() => {
    // JWT-guarded endpoint: an anonymous visitor already renders the sign-in
    // card from the lazily-initialised state above, so skip the doomed 401.
    if (!getAuthToken()) return;

    let active = true;

    api
      .getRecommendations()
      .then((result) => {
        if (!active) return;
        setLoadError('');
        setRoadmapItems(result?.learningRoadmap ?? null);
        setWeakAreas(Array.isArray(result?.weakAreas) ? result.weakAreas : []);
      })
      .catch((error: unknown) => {
        if (!active) return;
        if (error instanceof ApiError && error.status === 401) {
          setUnauthorized(true);
          return;
        }
        setLoadError(error instanceof Error ? error.message : 'The roadmap service is unavailable.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id, reloadKey]);

  /** Reset the fetch state from an event handler, then refetch. */
  const retry = () => {
    const hasSession = Boolean(getAuthToken());
    setLoadError('');
    setUnauthorized(!hasSession);
    setLoading(hasSession);
    setReloadKey((key) => key + 1);
  };

  const modules = useMemo(
    () => buildModules(roadmapItems, syncedWeaknesses, completed),
    [roadmapItems, syncedWeaknesses, completed],
  );

  const completedCount = modules.filter((module) => module.status === 'completed').length;
  const percent = modules.length ? Math.round((completedCount / modules.length) * 100) : 0;
  const nextModule = modules.find((module) => module.status === 'in_progress');

  const toggleComplete = (module: RoadmapModule) => {
    const next = new Set(completed);
    if (next.has(module.id)) next.delete(module.id);
    else next.add(module.id);
    setCompleted(next);
    writeCompletedModules([...next]);
  };

  const practiceGap = () => navigate('/questions');
  const openAuth = () => {
    if (onOpenAuth) onOpenAuth();
    else navigate('/');
  };

  const syncLabel = syncState?.evaluationId
    ? `Evaluation Report #${syncState.evaluationId.slice(-8).toUpperCase()}`
    : 'your evaluation report';

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
          Modules automatically re-order based on your weakest performance vectors in recent mock loops
          {user?.targetCompany ? ` · Calibrated for ${user.targetCompany}${user.targetLevel ? ` · ${user.targetLevel}` : ''}` : ''}.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-8 h-8 border-2 border-[#6b38d4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[#5e5e6e]">Building your roadmap from recent evaluations…</p>
        </div>
      )}

      {/* Signed out — the endpoint is JWT-guarded, so offer the sign-in flow. */}
      {!loading && unauthorized && (
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#6b38d4]">
            <Lock size={22} />
          </div>
          <h2 className="font-display font-bold text-xl text-[#0a0a0f]">Sign in to open your roadmap</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5e5e6e]">
            Your roadmap is generated from the score categories of your completed mock interview
            evaluations, so it needs your account.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="md" onClick={openAuth}>Sign In to Continue</Button>
          </div>
        </Card>
      )}

      {/* Request failed and there is nothing to fall back on. */}
      {!loading && !unauthorized && loadError !== '' && modules.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <AlertCircle size={22} />
          </div>
          <h2 className="font-display font-bold text-xl text-[#0a0a0f]">Could not build your roadmap</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5e5e6e]">{loadError}</p>
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              size="md"
              iconLeft={<RefreshCw size={15} />}
              onClick={retry}
            >
              Retry
            </Button>
          </div>
        </Card>
      )}

      {/* Signed in, no failed request, but no completed evaluations yet. */}
      {!loading && !unauthorized && loadError === '' && modules.length === 0 && (
        <Card padding="lg" className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#6b38d4]">
            <MapIcon size={22} />
          </div>
          <h2 className="font-display font-bold text-xl text-[#0a0a0f]">No roadmap generated yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5e5e6e]">
            Complete a mock interview evaluation and the AI mentor will turn your weakest score
            categories into an ordered learning roadmap.
          </p>
          <div className="mt-6 flex justify-center">
            <Button size="md" onClick={() => navigate('/questions')}>Start a Mock Interview</Button>
          </div>
        </Card>
      )}



      {/* Roadmap */}
      {!loading && !unauthorized && modules.length > 0 && (
        <>
          {loadError !== '' && (
            <div
              role="alert"
              className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
            >
              <span className="flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                Live recommendations unavailable — showing what we could load. {loadError}
              </span>
              <Button
                variant="outline"
                size="sm"
                iconLeft={<RefreshCw size={13} />}
                onClick={retry}
              >
                Retry
              </Button>
            </div>
          )}

          {/* Gaps handed over by the evaluation report */}
          {syncedWeaknesses.length > 0 && (
            <div className="mb-8 flex items-start gap-3 rounded-2xl border border-[#8b5cf6]/30 bg-[#f3f0ff] px-5 py-4">
              <Target size={18} className="mt-0.5 shrink-0 text-[#6b38d4]" />
              <div className="min-w-0">
                <p className="text-xs font-mono font-bold uppercase text-[#6b38d4]">Gaps synced to roadmap</p>
                <p className="mt-1 text-sm text-[#5e5e6e]">
                  {syncedWeaknesses.length} {syncedWeaknesses.length === 1 ? 'area' : 'areas'} imported
                  from {syncLabel}
                  {typeof syncState?.score === 'number' ? ` (score ${syncState.score}/100)` : ''}.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {syncedWeaknesses.map((weakness) => (
                    <Badge key={weakness} variant="warning">
                      {weakness}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Summary Card — every figure below is derived from real state. */}
          <div className="mb-10 flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#8b5cf6]/20 bg-gradient-to-r from-[#f3f0ff] via-white to-[#faf9fe] p-6 shadow-xs sm:flex-row">
            <div>
              <span className="text-xs font-mono font-bold uppercase text-[#6b38d4]">Roadmap Progress</span>
              <div className="mt-0.5 font-display text-2xl font-bold text-[#0a0a0f]">
                {completedCount} of {modules.length} focus areas completed
              </div>
              <p className="mt-1 text-xs text-[#5e5e6e]">
                {weakAreas.length > 0
                  ? `Priority gaps: ${weakAreas.join(' · ')}`
                  : nextModule
                    ? `Next up: ${nextModule.title}`
                    : 'Every focus area is ticked off — start a new loop to refresh your roadmap.'}
              </p>
            </div>

            <div className="w-full sm:w-64">
              <div className="mb-1.5 flex justify-between text-xs font-mono text-[#5e5e6e]">
                <span>Progress</span>
                <span className="font-bold text-[#6b38d4]">{percent}%</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e5e1ea]">
                <div
                  className="h-full rounded-full bg-[#6b38d4] transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>


          {/* Roadmap Timeline */}
          <div className="relative my-6 space-y-8 border-l-2 border-[#e5e1ea] pl-6 sm:pl-8">
            {modules.map((m, index) => {
              const isDone = m.status === 'completed';
              const isCurrent = m.status === 'in_progress';

              return (
                <div key={m.id} className="relative group">
                  {/* Timeline Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-4 flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                      isDone
                        ? 'border-[#10b981] bg-[#10b981] text-white'
                        : isCurrent
                          ? 'border-[#6b38d4] bg-[#6b38d4] text-white shadow-[0_0_12px_rgba(107,56,212,0.5)]'
                          : 'border-[#e5e1ea] bg-white text-[#8e8ea0]'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 size={15} />
                    ) : isCurrent ? (
                      <Play size={13} fill="currentColor" />
                    ) : (
                      <Circle size={11} fill="currentColor" />
                    )}
                  </div>


                  {/* Module Card */}
                  <div
                    className={`rounded-2xl border p-6 transition-all ${
                      isCurrent
                        ? 'border-[#6b38d4] bg-white shadow-md ring-2 ring-[#6b38d4]/10'
                        : isDone
                          ? 'border-[#e5e1ea] bg-white shadow-xs'
                          : 'border-[#e5e1ea] bg-[#faf9fc] opacity-80'
                    }`}
                  >
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Badge variant="primary">
                          STEP {String(index + 1).padStart(2, '0')}
                        </Badge>
                        <span
                          className={`rounded px-2 py-0.5 text-[11px] font-mono ${PRIORITY_CHIP[m.priority]}`}
                        >
                          {m.priority} priority
                        </span>
                        {m.synced && (
                          <span className="rounded bg-[#ede9fe] px-2 py-0.5 text-[11px] font-mono text-[#6b38d4]">
                            SYNCED
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#8e8ea0]">
                        <BookOpen size={13} />
                        <span>
                          {m.resources.length > 0
                            ? `${m.resources.length} resource${m.resources.length === 1 ? '' : 's'}`
                            : 'Self-paced'}
                        </span>
                      </div>
                    </div>

                    <h3 className="mb-2 font-display text-lg font-bold text-[#0a0a0f]">{m.title}</h3>
                    <p className="mb-4 text-xs leading-relaxed text-[#5e5e6e] sm:text-sm">{m.desc}</p>

                    <div className="flex flex-col gap-3 border-t border-[#e5e1ea] pt-4 sm:flex-row sm:items-start sm:justify-between">
                      {/* Recommended resources straight from the API */}
                      {m.resources.length > 0 ? (
                        <ul className="space-y-1.5">
                          {m.resources.slice(0, 4).map((resource, resourceIndex) => (
                            <li
                              key={`${m.id}-${resourceIndex}`}
                              className="flex items-start gap-1.5 text-xs text-[#5e5e6e]"
                            >
                              <BookOpen size={12} className="mt-0.5 shrink-0 text-[#8b5cf6]" />
                              <span>{resource}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Badge variant="neutral">No resources suggested</Badge>
                      )}

                      <div className="flex shrink-0 flex-wrap items-center gap-2 self-end sm:self-auto">
                        {isDone ? (
                          <>
                            <span className="flex items-center gap-1 text-xs font-mono text-[#10b981]">
                              <CheckCircle2 size={13} /> Completed
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => toggleComplete(m)}>
                              Undo
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant={isCurrent ? 'dark' : 'outline'}
                              size="sm"
                              className="self-end sm:self-auto"
                              iconRight={<ArrowRight size={13} />}
                              onClick={practiceGap}
                            >
                              {isCurrent ? 'Practice This Gap' : 'Start Module'}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleComplete(m)}>
                              Mark Complete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

