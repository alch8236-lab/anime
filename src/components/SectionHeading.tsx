import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  index: string;
  title: string;
  jp: string;
  lead?: string;
  accent?: 'neon' | 'volt';
}

/**
 * Заголовок секции: номер-индекс, огромный display-заголовок с посимвольным
 * выездом и ведущий абзац. Анимация появления — при входе в вьюпорт.
 */
export function SectionHeading({ index, title, jp, lead, accent = 'neon' }: SectionHeadingProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-line]',
        { yPercent: 110, rotate: 2 },
        {
          yPercent: 0,
          rotate: 0,
          duration: 1,
          ease: 'power3.out',
          stagger: 0.09,
          scrollTrigger: { trigger: root, start: 'top 78%' },
        },
      );
      gsap.fromTo(
        '[data-fade]',
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root, start: 'top 78%' },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="mb-14 md:mb-20">
      <div data-fade className="mb-5 flex items-center gap-4 text-[11px] uppercase tracking-[0.4em] text-neutral-500">
        <span className={accent === 'neon' ? 'text-neon' : 'text-volt'}>{index}</span>
        <span className="h-px w-14 bg-neutral-700" />
        <span className="font-jp text-[13px] tracking-[0.5em]">{jp}</span>
      </div>
      <h2 className="font-display text-[13vw] font-light leading-[0.95] text-white md:text-8xl">
        {title.split(' ').map((word, wi) => (
          <span key={wi} className="reveal-mask mr-[0.22em] last:mr-0">
            <span data-line className="inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </h2>
      {lead && (
        <p data-fade className="mt-7 max-w-2xl text-base leading-relaxed text-neutral-400 md:text-lg">
          {lead}
        </p>
      )}
    </div>
  );
}
