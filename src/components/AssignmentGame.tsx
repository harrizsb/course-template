import { useEffect, useRef, useState } from 'preact/hooks';
import type { KAPLAYCtx } from 'kaplay';
import { assignments } from '../data/assignments';
import { rubricByAssignment } from '../data/rubrics';
interface Props { assignmentId: number; }
type Level = 'high' | 'middle' | 'lower';
const MULTIPLIER: Record<Level, number> = { high: 1, middle: 0.6, lower: 0.3 };
export default function AssignmentGame({ assignmentId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false), [captured, setCaptured] = useState(false), [pending, setPending] = useState<string | null>(null), [summary, setSummary] = useState('');
  const [levels, setLevels] = useState<Record<string, Level>>({});
  const assignment = assignments.find((a) => a.id === assignmentId)!;
  const rubric = rubricByAssignment[assignmentId];
  const score = rubric.criteria.reduce((sum, c) => sum + (levels[c.id] ? c.weight * MULTIPLIER[levels[c.id]] : 0), 0);
  const maxScore = rubric.criteria.reduce((sum, c) => sum + c.weight, 0);
  const complete = rubric.criteria.every((c) => Boolean(levels[c.id]));
  const checkpoint = rubric.criteria.find((c) => c.id === pending);
  useEffect(() => {
    let k: KAPLAYCtx | undefined, cancelled = false;
    async function init() {
      try {
        const kaplay = (await import('kaplay')).default, container = containerRef.current;
        if (!container || cancelled) return;
        k = kaplay({ root: container, width: 640, height: 260, background: [250, 250, 249], global: false }); k.setGravity(1200);
        const player = k.add([k.rect(24, 24), k.pos(40, 190), k.area(), k.body(), k.color(153, 27, 27), 'player']);
        k.add([k.rect(640, 24), k.pos(0, 236), k.area(), k.body({ isStatic: true }), k.color(64, 64, 64)]);
        rubric.criteria.forEach((criterion, index) => { const token = k!.add([k!.rect(22, 22), k!.pos(100 + index * 90, 190 - (index % 2) * 45), k!.area(), k!.color(217, 119, 6), 'criterion']); token.onCollide('player', () => { if (pending || levels[criterion.id]) return; k?.destroy(token); setPending(criterion.id); }); });
        k.onKeyDown('left', () => { if (!pending) player.move(-220, 0); }); k.onKeyDown('right', () => { if (!pending) player.move(220, 0); }); k.onKeyPress('space', () => { if (!pending && player.isGrounded()) player.jump(500); });
      } catch { if (!cancelled) setError(true); }
    }
    void init(); return () => { cancelled = true; k?.quit(); };
  }, [assignmentId]);
  const choose = (level: Level) => { if (pending) setLevels((current) => ({ ...current, [pending]: level })); setPending(null); };
  const capture = async () => { if (!complete) return; const text = `CS499 A${assignmentId} - ${score.toFixed(1)}/${maxScore} - ${rubric.criteria.map((c) => `${c.name}: ${levels[c.id]}`).join('; ')} - captured ${new Date().toLocaleDateString('en-GB')}`; setSummary(text); try { await navigator.clipboard.writeText(text); setCaptured(true); } catch { setCaptured(false); } };
  return <div class="mt-5 space-y-3">
    <div class="flex items-center justify-between gap-3"><p class="text-sm font-medium">{assignment.kaplay.title}</p><output class="text-sm text-muted-foreground" aria-live="polite">Score: {score.toFixed(1)} / {maxScore}</output></div>
    {error ? <p class="border border-border p-4 text-sm text-muted-foreground" role="status">The interactive game is unavailable. Review the rubric levels below and record your result manually.</p> : <div ref={containerRef} class="border border-border" aria-label={`${assignment.kaplay.title}. Use left and right arrows to move and Space to jump.`} />}
    {checkpoint && <div class="border border-border p-3 space-y-2" role="group" aria-label={`Choose level for ${checkpoint.name}`}><p class="text-sm font-medium">{checkpoint.name} checkpoint</p><p class="text-xs text-muted-foreground">{checkpoint.description}</p><div class="grid gap-2 sm:grid-cols-3">{(['high', 'middle', 'lower'] as Level[]).map((level) => <button type="button" class="border border-border px-2 py-2 text-left text-xs hover:bg-muted" onClick={() => choose(level)}><span class="font-medium capitalize">{level}</span><span class="mt-1 block text-muted-foreground">{checkpoint.levels[level]}</span></button>)}</div></div>}
    <div class="space-y-1">{rubric.criteria.map((c) => <div class="flex justify-between text-xs"><span class="text-muted-foreground">{c.name}</span><span class="font-mono">{levels[c.id] ? `${levels[c.id]}: ${(c.weight * MULTIPLIER[levels[c.id]]).toFixed(1)}/${c.weight}` : `0/${c.weight}`}</span></div>)}</div>
    <button type="button" disabled={!complete} onClick={capture} class="text-xs underline disabled:opacity-50">{captured ? 'Score copied' : 'Capture final score'}</button><p class="text-xs text-muted-foreground">Practice score only. Nothing is submitted or stored.</p>{!complete && <p class="text-xs text-amber-600 font-medium">Collect and rate all criteria to capture your final score.</p>}{summary && <p class="select-text break-words border border-border p-2 text-xs text-muted-foreground" role="status">{captured ? 'Copied: ' : 'Copy unavailable. Select this summary: '}{summary}</p>}
    <p class="text-xs text-muted-foreground">{assignment.kaplay.description} Controls: {assignment.kaplay.controls.join(', ')}.</p>
  </div>;
}
