import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { quotes } from '@/data/quotes';

gsap.registerPlugin(ScrollTrigger);

/**
 * Стена цитат: masonry-сетка из трёх колонок (на десктопе),
 * клик по карточке показывает контекст сцены.
 */
export function QuotesWall() {
  const [openId, setOpenId] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const columns = useMemo(() => {
    const cols: (typeof quotes)[] = [[], [], []];
    quotes.forEach((q, i) => cols[i % 3].push(q));
    return cols;
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-quote-card]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 26 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            delay: (i % 3) * 0.06,
            scrollTrigger: { trigger: card, start: 'top 95%' },
          },
        );
      });
    }, grid);
    return () => ctx.revert();
  }, []);

  return (
    <section id="quotes" className="relative bg-[#060608] py-28 md:py-36" aria-label="Стена цитат">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="07"
          jp="言葉"
          title="Стена цитат"
          lead="Реплики, ставшие языком фандома: от «See you, space cowboy» до «Я люблю Эмилию». Нажмите на карточку, чтобы увидеть контекст сцены."
        />

        <div ref={gridRef} className="grid gap-4 md:grid-cols-3">
          {columns.map((col, ci) => (
            <div key={ci} className="space-y-4">
              {col.map((q) => {
                const open = openId === q.id;
                return (
                  <button
                    key={q.id}
                    data-quote-card
                    onClick={() => setOpenId(open ? null : q.id)}
                    aria-expanded={open}
                    className={`group block w-full border p-6 text-left transition-colors duration-300 ${
                      open
                        ? 'border-neon/60 bg-[#0d0d11]'
                        : 'border-white/10 bg-[#0a0a0d] hover:border-white/30'
                    }`}
                    data-cursor="hover"
                  >
                    <p className="font-display text-xl font-light italic leading-snug text-white md:text-2xl">
                      «{q.text}»
                    </p>
                    <div className="mt-5 flex items-baseline justify-between gap-3">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-neutral-400">
                          {q.author}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-neutral-600">
                          {q.anime} · {q.year}
                        </p>
                      </div>
                      <span
                        className={`font-jp text-lg text-white/15 transition-colors group-hover:text-neon ${
                          open ? 'text-neon' : ''
                        }`}
                        aria-hidden="true"
                      >
                        「
                      </span>
                    </div>
                    {open && (
                      <p className="mt-4 border-t border-white/10 pt-4 text-sm leading-relaxed text-neutral-300">
                        {q.context}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
