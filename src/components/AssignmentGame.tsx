import { useEffect, useRef, useState } from 'preact/hooks';
import type { KAPLAYCtx } from 'kaplay';
import { assignments, rubricByAssignment } from '../data';

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
  const scoreRef = useRef(score);
  scoreRef.current = score;

  useEffect(() => {
    if (phase !== 'playing') return;
    let k: KAPLAYCtx | undefined;
    let cancelled = false;
    async function init() {
      try {
        const kaplay = (await import('kaplay')).default;
        const container = containerRef.current;
        if (!container || cancelled || phaseRef.current !== 'playing') return;
        k = kaplay({ root: container, width: 640, height: 260, background: [250, 250, 249], global: false });
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
    {phase === 'splash' && <div class="border border-border p-5 space-y-3"><p class="text-sm text-muted-foreground">Assignment {assignmentId}</p><h2 class="text-lg font-medium">{assignment.title}</h2><p class="text-sm text-muted-foreground">{assignment.kaplay.description}</p><label class="block text-sm font-medium" for={`student-id-${assignmentId}`}>Student ID<input id={`student-id-${assignmentId}`} class="mt-1 block w-full border border-border px-3 py-2" value={studentId} onInput={(event) => setStudentId((event.currentTarget as HTMLInputElement).value)} /></label><button type="button" class="border border-border px-3 py-2 text-sm" disabled={!studentId.trim()} onClick={start}>Start game</button></div>}
    {phase === 'playing' && <><div class="flex items-center justify-between gap-3"><p class="text-sm font-medium">{assignment.title}</p><output class="text-sm text-muted-foreground" aria-live="polite">Score: {score.toFixed(1)} / {maxScore}</output></div>{error ? <p class="border border-border p-4 text-sm text-muted-foreground" role="status">The interactive game is unavailable. Review the rubric levels below and record your result manually.</p> : <div ref={containerRef} class="border border-border" aria-label={`${assignment.title}. Use left and right arrows to move and Space to jump.`} />}{checkpoint && <div class="border border-border p-3 space-y-2" role="group" aria-label={`Choose level for ${checkpoint.name}`}><p class="text-sm font-medium">{checkpoint.name} checkpoint</p><p class="text-xs text-muted-foreground">{checkpoint.description}</p><div class="grid gap-2 sm:grid-cols-3">{(['high', 'middle', 'lower'] as Level[]).map((level) => <button type="button" class="border border-border px-2 py-2 text-left text-xs hover:bg-muted" onClick={() => choose(level)}><span class="font-medium capitalize">{level}</span><span class="mt-1 block text-muted-foreground">{checkpoint.levels[level]}</span></button>)}</div></div>}<div class="space-y-1">{rubric.criteria.map((c) => <div class="flex justify-between text-xs"><span class="text-muted-foreground">{c.name}</span><span class="font-mono">{levels[c.id] ? `${levels[c.id]}: ${(c.weight * MULTIPLIER[levels[c.id]]).toFixed(1)}/${c.weight}` : `0/${c.weight}`}</span></div>)}</div><p class="text-xs text-muted-foreground">Practice score only. Nothing is submitted or stored.</p></>}
    {phase === 'ended' && <div class="border border-border p-5 space-y-3"><h2 class="text-lg font-medium">Game complete</h2><p class="text-sm">Total score: <strong>{(finalScore ?? 0).toFixed(1)} / {maxScore}</strong></p><p class="text-sm text-muted-foreground">Captured: {endDate}</p><button type="button" class="text-xs underline" onClick={capture}>{captured ? 'Score copied' : 'Copy result'}</button>{summary && <p class="select-text break-words border border-border p-2 text-xs text-muted-foreground" role="status">{captured ? 'Copied: ' : 'Copy unavailable. Select this summary: '}{summary}</p>}</div>}
  </div>;
}