import { useEffect, useRef, useState } from 'preact/hooks';
import type { KAPLAYCtx } from 'kaplay';
import { missions } from '../data/gamification';

export default function KaplayMissionGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(false);

  useEffect(() => {
    let k: KAPLAYCtx | undefined;
    let cancelled = false;

    async function init() {
      try {
        // Kaplay touches browser globals at initialization, so defer this import until the visible island mounts.
        const kaplay = (await import('kaplay')).default;
        const container = containerRef.current;
        if (!container || cancelled) return;

        k = kaplay({
          root: container,
          width: 640,
          height: 260,
          background: [250, 250, 249],
          global: false,
        });
        k.setGravity(1200);

        const player = k.add([
          k.rect(24, 24),
          k.pos(40, 190),
          k.area(),
          k.body(),
          k.color(153, 27, 27),
          'player',
        ]);

        k.add([
          k.rect(640, 24),
          k.pos(0, 236),
          k.area(),
          k.body({ isStatic: true }),
          k.color(64, 64, 64),
        ]);

        missions.forEach((mission, index) => {
          const missionObj = k!.add([
            k!.rect(22, 22),
            k!.pos(100 + index * 90, 190 - (index % 2) * 45),
            k!.area(),
            k!.color(217, 119, 6),
            { label: mission.title, xp: mission.xp },
            'mission',
          ]);
          missionObj.onCollide('player', () => {
            k?.destroy(missionObj);
            setScore((current) => current + 1);
          });
        });

        k.onKeyDown('left', () => player.move(-220, 0));
        k.onKeyDown('right', () => player.move(220, 0));
        k.onKeyPress('space', () => {
          if (player.isGrounded()) player.jump(500);
        });
      } catch {
        if (!cancelled) setError(true);
      }
    }

    void init();

    return () => {
      cancelled = true;
      k?.quit();
    };
  }, []);

  return (
    <div class="mt-6 space-y-3">
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm font-medium">Kaplay mission run</p>
        <p class="text-sm text-muted-foreground" aria-live="polite">Missions collected: {score} / {missions.length}</p>
      </div>
      {error ? (
        <p class="border border-border p-4 text-sm text-muted-foreground" role="status">The interactive mission preview is unavailable in this browser. Use the static Mission Control panel above.</p>
      ) : (
        <div ref={containerRef} class="border border-border" aria-label="Kaplay mission game. Use left and right arrows to move and Space to jump." />
      )}
      <p class="text-xs text-muted-foreground">Use Left/Right and Space to collect the assignment missions.</p>
    </div>
  );
}
