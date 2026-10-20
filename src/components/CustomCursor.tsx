import { useEffect, useRef, useState } from 'react';

/**
 * Кастомный курсор: белое кольцо с перекрестием в центре.
 * Работает только на точных указателях (мышь/трекпад), на тач-устройствах отключён.
 */
export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    document.documentElement.classList.add('cursor-none-all');

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      hovering = !!t?.closest('a, button, [role="button"], [data-cursor="hover"]');
    };

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${
        hovering ? 1.7 : 1
      })`;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      ring.style.borderColor = hovering ? 'hsl(350 100% 60%)' : 'rgba(255,255,255,0.9)';
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove('cursor-none-all');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] flex h-10 w-10 items-center justify-center rounded-full border will-change-transform"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" className="text-white/70">
          <path d="M5 0 V10 M0 5 H10" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] h-1 w-1 rounded-full bg-white"
      />
    </>
  );
}
