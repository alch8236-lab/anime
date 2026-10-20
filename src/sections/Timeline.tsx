import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionHeading } from '@/components/SectionHeading';
import { timeline, eras } from '@/data/timeline';
import type { TimelineEvent } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const ERA_STYLE: Record<TimelineEvent['era'], string> = {
  'Заря': 'text-neutral-300 border-white/20',
  'Золотой век': 'text-volt border-volt/50',
  'Бум': 'text-neon border-neon/50',
  'Цифра': 'text-sky-300 border-sky-300/40',
  'Сейчас': 'text-white border-white/40',
};

const IMPORTANCE_SIZE = { 1: 'text-2xl md:text-3xl', 2: 'text-3xl md:text-5xl', 3: 'text-4xl md:text-6xl' };

/**
 * Хронология: вертикальная лента событий 1917–2026 с фильтром эпох.
 * События раскрываются по клику; линия прогресса растёт при скролле.
 */
export function Timeline() {
  const [era, setEra] = useState<TimelineEvent['era'] | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = useMemo(
    () => (era === 'all' ? timeline : timeline.filter((e) => e.era === era)),
    [era],
  );

  useEffect(() => {
    const line = lineRef.current;
    const list = listRef.current;
    if (!line || !list) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      line.style.height = '100%';
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        line,
        { height: '0%' },
        {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: list,
            start: 'top 70%',
            end: 'bottom 60%',
            scrub: 0.4,
          },
        },
      );
    });
    return () => ctx.revert();
  }, [era]);

  return (
    <section id="timeline" className="relative bg-[#08080b] py-28 md:py-36" aria-label="История аниме">
      <div className="mx-auto max-w-[1500px] px-6 md:px-12">
        <SectionHeading
          index="04"
          jp="歴史"
          title="Сто лет движения"
          lead="От первых короткометражек 1917 года до мирового стандарта 2026-го. Фильтруйте эпохи и раскрывайте события — линия истории растёт вместе со скроллом."
          accent="volt"
        />

        {/* Фильтр эпох */}
        <div className="mb-14 flex flex-wrap gap-2" role="group" aria-label="Фильтр по эпохам">
          <button
            onClick={() => setEra('all')}
            aria-pressed={era === 'all'}
            className={`border px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${
              era === 'all'
                ? 'border-white bg-white text-[#060608]'
                : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
            }`}
          >
            Вся история
          </button>
          {eras.map((e) => (
            <button
              key={e.id}
              onClick={() => setEra(e.id)}
              aria-pressed={era === e.id}
              title={e.hint}
              className={`border px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                era === e.id
                  ? 'border-neon bg-neon text-[#060608]'
                  : 'border-white/15 text-neutral-400 hover:border-white/40 hover:text-white'
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>

        {/* Лента */}
        <div ref={listRef} className="relative">
          {/* Ось */}
          <div className="absolute bottom-0 left-[19px] top-0 w-px bg-white/10 md:left-1/2" />
          <div
            ref={lineRef}
            className="absolute bottom-0 left-[19px] top-0 w-px bg-gradient-to-b from-neon via-volt to-neon md:left-1/2"
          />

          <ol className="space-y-10 md:space-y-14">
            {visible.map((ev, i) => {
              const side = i % 2 === 0;
              return (
                <li key={`${ev.year}-${ev.title}`} className="relative">
                  {/* Точка на оси */}
                  <span
                    className={`absolute left-[19px] top-2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 md:left-1/2 ${
                      ev.importance === 3
                        ? 'border-neon bg-neon shadow-[0_0_14px_rgba(255,51,85,0.8)]'
                        : ev.importance === 2
                          ? 'border-volt bg-[#08080b]'
                          : 'border-neutral-500 bg-[#08080b]'
                    }`}
                    aria-hidden="true"
                  />

                  <div
                    className={`ml-12 md:ml-0 md:w-[calc(50%-3rem)] ${
                      side ? 'md:mr-auto md:text-right' : 'md:ml-auto'
                    }`}
                  >
                    <button
                      onClick={() => setOpenId(openId === ev.title ? null : ev.title)}
                      aria-expanded={openId === ev.title}
                      className="group block w-full text-left md:text-inherit"
                      data-cursor="hover"
                    >
                      <div
                        className={`flex items-baseline gap-4 ${side ? 'md:flex-row-reverse' : ''}`}
                      >
                        <span className="font-display text-5xl font-light text-white/15 transition-colors group-hover:text-white/35">
                          {ev.year}
                        </span>
                        <span
                          className={`border px-2.5 py-1 text-[9px] uppercase tracking-[0.25em] ${ERA_STYLE[ev.era]}`}
                        >
                          {ev.era}
                        </span>
                      </div>
                      <h3
                        className={`font-display mt-3 font-light leading-tight text-white ${IMPORTANCE_SIZE[ev.importance]}`}
                      >
                        {ev.title}
                      </h3>
                    </button>

                    {openId === ev.title && (
                      <div className="mt-4 border border-white/10 bg-[#0a0a0d]/80 p-5">
                        <p className="text-sm leading-relaxed text-neutral-300">{ev.detail}</p>
                      </div>
                    )}

                    {!openId && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-500">
                        {ev.detail}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
