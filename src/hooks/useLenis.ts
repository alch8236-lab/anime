import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Инициализация плавного скролла Lenis + синхронизация с GSAP ScrollTrigger.
 * Возвращает ничего; экземпляр хранится на window для доступа из навигации.
 */
export function useLenis(): void {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);
}

/** Программный скролл к якорю через Lenis (с fallback на нативный). */
export function scrollToId(id: string): void {
  const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.scrollTo(el, { offset: -8, duration: 1.4 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}
