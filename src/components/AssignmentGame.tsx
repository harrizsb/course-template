import { useEffect, useRef, useState } from 'preact/hooks';
import type { KAPLAYCtx } from 'kaplay';
import { assignments, rubricByAssignment } from '../data';
import { button } from './starwind/button/variants';
import { input } from './starwind/input/variants';
import { card, cardContent, cardHeader, cardTitle, cardDescription } from './starwind/card/variants';
import { alert, alertDescription, alertTitle } from './starwind/alert/variants';
import { item, itemContent, itemDescription, itemActions, itemGroup } from './starwind/item/variants';

interface Props { assignmentId: number; }
type Level = 'high' | 'middle' | 'lower';
type Phase = 'splash' | 'playing' | 'ended';
const MULTIPLIER: Record<Level, number> = { high: 1, middle: 0.6, lower: 0.3 };

export default function AssignmentGame({ assignmentId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>('splash');
  const phaseRef = useRef<Phase>('splash');
  const [studentId, setStudentId] = useState('');
  const [error, setError] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [summary, setSummary] = useState('');
  const [levels, setLevels] = useState<Record<string, Level>>({});
  const [pending, setPending] = useState<string | null>(null);
  const [endDate, setEndDate] = useState('');
  const [finalScore, setFinalScore] = useState<number | null>(null);
  const pendingRef = useRef<string | null>(null);
  const levelsRef = useRef<Record<string, Level>>({});
  levelsRef.current = levels;
  pendingRef.current = pending;
  phaseRef.current = phase;

  const assignment = assignments.find((a) => a.id === assignmentId)!;
  const rubric = rubricByAssignment[assignmentId];
  const score = rubric.criteria.reduce((sum, c) => sum + (levels[c.id] ? c.weight * MULTIPLIER[levels[c.id]] : 0), 0);
  const maxScore = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
  const checkpoint = rubric.criteria.find((c) => c.id === pending);

  useEffect(() => {
    if (phase !== 'playing') return;
    let k: KAPLAYCtx | undefined;
    let cancelled = false;
    async function init() {
      try {
        const kaplay = (await import('kaplay')).default;
        const container = containerRef.current;
        if (!container || cancelled || phaseRef.current !== 'playing') return;
        k = kaplay({ root: container, width: 640, height: 260, background: [250, 250, 249], global: false, stretch: true, letterbox: true });
        k.setGravity(1200);
        const player = k.add([k.rect(24, 24), k.pos(40, 190), k.area(), k.body(), k.color(153, 27, 27), 'player']);
        k.add([k.rect(640, 24), k.pos(0, 236), k.area(), k.body({ isStatic: true }), k.color(64, 64, 64)]);
        rubric.criteria.forEach((criterion, index) => {
          const token = k!.add([k!.rect(22, 22), k!.pos(100 + index * 90, 190 - (index % 2) * 45), k!.area(), k!.color(217, 119, 6), 'criterion']);
          token.onCollide('player', () => {
            if (phaseRef.current !== 'playing' || pendingRef.current || levelsRef.current[criterion.id]) return;
            pendingRef.current = criterion.id;
            k?.destroy(token);
            setPending(criterion.id);
          });
        });
        k.onKeyDown('left', () => { if (phaseRef.current === 'playing' && !pendingRef.current) player.move(-220, 0); });
        k.onKeyDown('right', () => { if (phaseRef.current === 'playing' && !pendingRef.current) player.move(220, 0); });
        k.onKeyPress('space', () => { if (phaseRef.current === 'playing' && !pendingRef.current && player.isGrounded()) player.jump(500); });
      } catch { if (!cancelled) setError(true); }
    }
    void init();
    return () => { cancelled = true; k?.quit(); };
  }, [assignmentId, phase, rubric.criteria]);

  const start = () => {
    if (!studentId.trim()) return;
    setLevels({}); levelsRef.current = {}; setPending(null); pendingRef.current = null;
    setError(false); setCaptured(false); setSummary(''); setEndDate(''); setFinalScore(null);
    phaseRef.current = 'playing'; setPhase('playing');
  };

  const choose = (level: Level) => {
    if (!pending || phaseRef.current !== 'playing') return;
    const criterionId = pending;
    const next = { ...levelsRef.current, [criterionId]: level };
    levelsRef.current = next;
    pendingRef.current = null;
    setLevels(next); setPending(null);
    if (rubric.criteria.every((c) => Boolean(next[c.id]))) {
      const finalizedScore = rubric.criteria.reduce((sum, c) => sum + c.weight * MULTIPLIER[next[c.id]], 0);
      setFinalScore(finalizedScore);
      const date = new Date().toLocaleDateString('en-GB');
      setEndDate(date); phaseRef.current = 'ended'; setPhase('ended');
    }
  };

  const capture = async () => {
    if (phase !== 'ended') return;
    const capturedScore = finalScore ?? rubric.criteria.reduce((sum, c) => sum + c.weight * MULTIPLIER[levelsRef.current[c.id]], 0);
    const text = `CS499 A${assignmentId}${studentId.trim() ? ` - ${studentId.trim()}` : ''} - ${capturedScore.toFixed(1)}/${maxScore} - captured ${endDate}`;
    setSummary(text);
    try { await navigator.clipboard.writeText(text); setCaptured(true); } catch { setCaptured(false); }
  };

  return <div class="mt-5 space-y-3">
    {phase === 'splash' && (
      <div class={card({ size: 'sm' })} data-sw-card data-size="sm" data-slot="card">
        <div class={cardHeader()}>
          <p class="text-sm text-muted-foreground">Assignment {assignmentId}</p>
          <h2 class={cardTitle()}>{assignment.title}</h2>
          <p class={cardDescription()}>{assignment.kaplay.description}</p>
        </div>
        <div class={cardContent()}>
          <label class="block text-sm font-medium" for={`student-id-${assignmentId}`}>
            Student ID
            <input
              id={`student-id-${assignmentId}`}
              class={input({ size: 'sm' })}
              value={studentId}
              onInput={(event) => setStudentId((event.currentTarget as HTMLInputElement).value)}
            />
          </label>
          <button
            type="button"
            class={button({ variant: 'primary', size: 'sm' })}
            disabled={!studentId.trim()}
            onClick={start}
          >
            Start game
          </button>
        </div>
      </div>
    )}
    {phase === 'playing' && (
      <>
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm font-medium">{assignment.title}</p>
          <output class="text-sm text-muted-foreground" aria-live="polite">
            Score: {score.toFixed(1)} / {maxScore}
          </output>
        </div>
        {error ? (
          <div class={alert({ variant: 'error' })}>
            <h5 class={alertTitle()}>Game Unavailable</h5>
            <p class={alertDescription()}>
              The interactive game is unavailable. Review the rubric levels below and record your result manually.
            </p>
          </div>
        ) : (
          <div ref={containerRef} class={card({ size: 'sm', class: 'overflow-hidden p-0' })} data-sw-card data-size="sm" data-slot="card" aria-label={`${assignment.title}. Use left and right arrows to move and Space to jump.`} />
        )}
        {checkpoint && (
          <div class={itemGroup()}>
            <div class={item({ variant: 'outline', size: 'sm' })} role="group" aria-label={`Choose level for ${checkpoint.name}`}>
              <div class={itemContent()}>
                <p class="text-sm font-medium">{checkpoint.name} checkpoint</p>
                <p class={itemDescription()}>{checkpoint.description}</p>
              </div>
              <div class={itemActions()}>
                <div class="grid w-full gap-2 sm:grid-cols-3">
                  {(['high', 'middle', 'lower'] as Level[]).map((level) => (
                    <button
                      key={level}
                      type="button"
                      class={button({ variant: 'outline', size: 'sm' })}
                      onClick={() => choose(level)}
                    >
                      <span class="font-medium capitalize">{level}</span>
                      <span class={itemDescription()}>{checkpoint.levels[level]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <div class={itemGroup()} aria-label="Rubric score breakdown">
          {rubric.criteria.map((criterion) => (
            <div class={item({ size: 'sm' })}>
              <div class={itemContent()}>
                <span class={itemDescription()}>{criterion.name}</span>
              </div>
              <div class={itemActions()}>
                <span class={levels[criterion.id] ? 'text-sm font-medium text-foreground' : 'text-sm text-muted-foreground'}>
                  {levels[criterion.id]
                    ? `${levels[criterion.id]}: ${(criterion.weight * MULTIPLIER[levels[criterion.id]]).toFixed(1)}/${criterion.weight}`
                    : `not scored / ${criterion.weight}`}
                </span>
              </div>
            </div>
          ))}
        </div>
        <p class={itemDescription()}>Practice score only. Nothing is submitted or stored.</p>
      </>
    )}
    {phase === 'ended' && (
      <div class={card({ size: 'sm' })} data-sw-card data-size="sm" data-slot="card">
        <div class={cardHeader()}>
          <h2 class={cardTitle()}>Game complete</h2>
          <p class={cardDescription()}>
            Total score: <strong class="text-foreground">{(finalScore ?? 0).toFixed(1)} / {maxScore}</strong>
          </p>
          <p class="text-sm text-muted-foreground">Captured: {endDate}</p>
        </div>
        <div class={cardContent()}>
          <button type="button" class={button({ variant: 'ghost', size: 'sm' })} onClick={capture}>
            {captured ? 'Score copied' : 'Copy result'}
          </button>
          {summary && (
            <p class={alert({ variant: 'default', class: 'select-text break-words p-3 text-xs text-muted-foreground' })} role="status">
              {captured ? 'Copied: ' : 'Copy unavailable. Select this summary: '}
              {summary}
            </p>
          )}
        </div>
      </div>
    )}
  </div>;
}